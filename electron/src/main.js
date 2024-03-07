// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');

// windows os: prevent multiple app startups during installation/update/uninstallation
if (require('electron-squirrel-startup')) app.quit();

const path = require('path');

const env = require('../env');

// modules
const Dependencies = require('./modules/dependencies');
const ScreenHandler = require('./modules/screenshot');
const Activity = require('./modules/activity');
const Credentials = require('./modules/credentials');
const View = require('./modules/view');
const Tray = require('./modules/tray');
const { IconHandler } = require('./modules/icon-handler');
// const { notify } = require('./modules/notification');
const { handleDevToolsOpening } = require('./modules/devtools');

const { Menu } = require('electron');
const Events = require('./globalEvents');

const { isWindows, isMac, isLinux } = require('./shared/system');

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const config = {
  indexFile: path.resolve(__dirname, '../app/index.html'),
  preloadFile: path.resolve(__dirname, 'preload.js'),
};

const getAppIconPath = () => {
  if (isWindows()) return path.join(app.getAppPath(), 'assets', 'icons', 'win', 'icon.ico');
  if (isMac()) return path.join(app.getAppPath(), 'assets', 'icons', 'mac', 'icon.icns');
  if (isLinux()) return path.join(app.getAppPath(), 'assets', 'icons', 'png', '512x512.png');
}

let mainWindow = null;


removeDefaultMenu();
preventSecondAppInstance();

function removeDefaultMenu() {
  if (env.dev) return; // leave menu in dev mode

  const menu = new Menu();
  Menu.setApplicationMenu(menu);
}

function preventSecondAppInstance() {
  const isFirstInstance = app.requestSingleInstanceLock();
  console.log('Is first app instance:', isFirstInstance);
  
  if (!isFirstInstance) {
    app.whenReady().then(() => {
      // notify('notify.app-already-running');
      app.exit();
      process.abort();
    });
  }
}


function createWindow() {
  // let cursor = screen.getCursorScreenPoint();
  // let display = screen.getDisplayNearestPoint({ x: cursor.x, y: cursor.y });
  // const size = display.workAreaSize;
  // const width = Math.round(size.width * 0.7);
  // const minHeight = Math.round(size.height * 0.7);

  // Create the browser window.
  const win = new BrowserWindow({
    title: 'Time Tracker',
    width: 1202,
    height: 820,
    minWidth: 350,
    center: true,
    icon: getAppIconPath(),
    show: false,
    webPreferences: {
      allowRunningInsecureContent: (serve) ? true : false,
      preload: env.dev ? config.preloadFile : null,
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      backgroundThrottling: false,
    },
  });


  if (serve) {
    const debug = require('electron-debug');
    debug();
    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // and load the index.html of the app.
    win.loadFile(config.indexFile);
  }

  return win;
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  mainWindow = createWindow();

  new Dependencies();
  new ScreenHandler();
  new Credentials();
  new View(mainWindow);
  const tray = new Tray(mainWindow);

  const activity = new Activity(mainWindow);

  ipcMain.on(Events.CLOSE, (event) => {
      app.quit();
      setTimeout(() => process.abort(), 1000);
  });
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
      activity.mainWindow = mainWindow;
    }

    mainWindow.focus();
  });

  app.on('second-instance', () => {
    mainWindow.show();
  });


  handleDevToolsOpening(mainWindow);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    tray.initTray();
    new IconHandler(mainWindow, tray);
  });

  // "hide to tray" on close
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  ipcMain.on(Events.FOCUS, (event) => {
    mainWindow.show();
  });
});
