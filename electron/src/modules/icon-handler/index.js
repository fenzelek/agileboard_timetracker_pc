const { app, ipcMain, screen } = require('electron');
const path = require('path');
const Events = require('../../globalEvents');
const { isWindows, isMac, isLinux } = require('../../shared/system');

class IconHandler {
  mainWindow = null;
  tray = null;
  latestBadgeIcon = null;

  constructor(mainWindow, tray) {
    this.mainWindow = mainWindow;
    this.tray = tray.getTray();
    this.listenToGlobalEvents();
  }

  listenToGlobalEvents() {
    app.on('browser-window-focus', () => {
      if(isWindows()) this.mainWindow.setOverlayIcon(this.latestBadgeIcon, "test");
    });

    ipcMain.on(Events.ACTIVITY_START, () => {
        this.setTrackingIcon();
    });
    
    ipcMain.on(Events.ACTIVITY_STOP, () => {
        this.setNoTrackingIcon();
    });
    
    ipcMain.on(Events.LOGOUT, () => {
      this.setNoTrackingIcon();
    });
    
    ipcMain.on(Events.SELECT_COMPANY, () => {
        this.setNoTrackingIcon();
    });
    
    ipcMain.on(Events.UNSELECT_COMPANY, () => {
      this.setNoTrackingIcon();
    });
  }

  setTrackingIcon = () => {
    if(!this.tray || this.tray.isDestroyed()) return;
    this.tray.setImage(getAppIconPathByStatus('systray', 'tracking'));
    if(!isMac()) this.mainWindow.setIcon(getAppIconPathByStatus('toolbar', 'tracking'));
    if(isWindows()) {
      this.latestBadgeIcon = getAppIconPathByStatus('badge', 'tracking');
      this.mainWindow.setOverlayIcon(this.latestBadgeIcon, "test");
    }
  }

  setNoTrackingIcon = () => {
    if(!this.tray || this.tray.isDestroyed()) return;
    this.tray.setImage(getAppIconPathByStatus('systray', 'no-tracking'));
    if(!isMac()) this.mainWindow.setIcon(getAppIconPathByStatus('toolbar', 'no-tracking'));
    if(isWindows()) {
      this.latestBadgeIcon = getAppIconPathByStatus('badge', 'no-tracking');
      this.mainWindow.setOverlayIcon(this.latestBadgeIcon, "test");
    }
  }

}

const getAppIconPathByStatus = (type, status) => {
  let appPath = app.getAppPath();
  if(!appPath.includes('src')) {
    appPath = path.join(appPath, 'src');
  }


  if(isWindows()) return path.join(appPath, 'assets', `${type}-icons`, `${status}.ico`);
  if(isMac()) return path.join(appPath, 'assets', `${type}-icons`, `${status}.icns`);
  if(isLinux()) return path.join(appPath, 'assets', `${type}-icons`, `${status}.png`);
}

module.exports = { IconHandler, getAppIconPathByStatus };
