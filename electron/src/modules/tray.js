const { Menu, Tray } = require('electron');
const Events = require('../globalEvents');
const { translate } = require('./i18n');
const { getAppIconPathByStatus } = require('./icon-handler')

class AppTray {
  mainWindow = null;
  tray = null;

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  open = () => {
    this.mainWindow.show();
  }

  exit = () => {
    this.tray.destroy();
    this.mainWindow.webContents.send(Events.CLOSING);
  }

  getTray() {
    return this.tray;
  }

  initTray() {
    this.tray = new Tray(getAppIconPathByStatus('systray', 'no-tracking'));

    const contextMenu = Menu.buildFromTemplate([
      { label: translate('tray.open'), type: 'normal', click: () => this.open() },
      { label: translate('tray.minimize'), type: 'normal', click: () => this.mainWindow.minimize() },
      { label: translate('tray.exit'), type: 'normal', click: () => this.exit() },
    ]);
  
    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip('Time Tracker');
    this.tray.addListener('click', this.open.bind(this));
  
    return this;
  }
}


module.exports = AppTray;
