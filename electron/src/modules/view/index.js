const { ipcMain, screen } = require('electron');
const Events = require('../../globalEvents');

const viewMode = {
  COMPACT: 'compact',
  MEDIUM: 'medium',
  WIDE: 'wide',
}


class View {
  mainWindow = null;
  currentViewMode = viewMode.MEDIUM;

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.listenToGlobalEvents();
  }

  listenToGlobalEvents() {
    ipcMain.on(Events.CHANGE_VIEW_MODE, (event, { mode }) => {
      if (mode === viewMode.COMPACT) this.setCompactView();
      if (mode === viewMode.MEDIUM) this.setMediumView();
      if (mode === viewMode.WIDE) this.setWideView();
    });
  }

  setCompactView() {
    this.mainWindow.setBounds({
      width: 350,
      // x: this.mainWindow.getBounds().x,
    });
    this.currentViewMode = viewMode.COMPACT;
  }

  setMediumView() {
    const cursor = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint({ x: cursor.x, y: cursor.y });

    const size = display.workAreaSize;
    // const width = Math.round(size.width * 0.7);
    const width = 1202;

    this.mainWindow.setBounds({
      width,
      // x: Math.round(((size.width - width) / 2) + display.workArea.x),
    });

    this.currentViewState = viewMode.MEDIUM;
  }

  setWideView() {
    const cursor = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint({x: cursor.x, y: cursor.y});

    const size = display.workAreaSize;
    // const width = Math.round(size.width * 0.9);
    const width = 1830;

    this.mainWindow.setBounds({
      width,
      // x: Math.round(((size.width - width) / 2) + display.workArea.x),
    });

    this.currentViewState = viewMode.WIDE;
  }

}


module.exports = View;
