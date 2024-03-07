const { ipcMain } = require('electron');
const ioHook = require('iohook');

const env = require('../../../env');
const MouseTracker = require('./mouse-tracker');
const KeyboardTracker = require('./keyboard-tracker');
const Events = require('../../globalEvents');


class Activity {
  constructor(mainWindow) {
    this.mouseTracker = new MouseTracker();
    this.keyboardTracker = new KeyboardTracker();
    this.activityMap = [];
    this.intervalId = null;
    this.idleTimeout = null;
    this.idle = false;
    this.mainWindow = mainWindow;
    this.listenToGlobalEvents();
  }

  listenToGlobalEvents() {
    ipcMain.on(Events.ACTIVITY_START, (event, arg) => {
      console.log(Events.ACTIVITY_START);
      this.track();
    });
    
    ipcMain.on(Events.ACTIVITY_STOP, (event, arg) => {
      console.log(Events.ACTIVITY_STOP);
      this.stopTracking();
    });
    
    ipcMain.on(Events.ACTIVITY_GET, (event, arg) => {
      console.log(Events.ACTIVITY_GET);
      const act = this.getActivity();
      event.sender.send(Events.ACTIVITY_VALUE, act);
    });
  }

  track() {
    this.mouseTracker.track();
    this.keyboardTracker.track();
    ioHook.start();

    this.intervalId = setInterval(() => {
      const mouseActive = this.mouseTracker.wasActive();
      const keyboardActive = this.keyboardTracker.wasActive();
      const active = keyboardActive || mouseActive ? 1 : 0;
      this.activityMap.push(active);

      // todo: Commented due to idle time not working. Needs check and fix.
      // if (active) {
      //   this.stopIdle();
      // } else {
      //   this.startIdle();
      // }
    }, env.activityCheckInterval);
  }
  
  stopTracking() {
    const activity = this.getActivity();
    
    this.activityMap = [];
    this.mouseTracker.stopTracking();
    this.keyboardTracker.stopTracking();
    ioHook.stop();
    clearInterval(this.intervalId);

    clearTimeout(this.idleTimeout);
    this.idleTimeout = null;

    return activity;
  }

  getActivity() {
    const activitySum = this.activityMap.reduce((prev, curr) => prev + curr, 0);
    return activitySum;
  }

  startIdle() {
    if (!this.idle && !this.idleTimeout) {
      this.idleTimeout = setTimeout(() => {
        this.idle = true;
        this.mainWindow.webContents.send(Events.IDLE_START);
      }, env.idleTimeout);
    }
  }

  stopIdle() {
    if (this.idle) {
        this.idle = false;
        this.mainWindow.webContents.send(Events.IDLE_STOP);
    }

    clearTimeout(this.idleTimeout);
    this.idleTimeout = null;
  }

}


module.exports = Activity;
