const { ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const Blob = require('node-blob');
const screenshot = require('screenshot-desktop');

const { saveFile, checkDir, getPath } = require('../../shared/fs.service');
const { isLinux } = require('../../shared/system');
const Events = require('../../globalEvents');

const SCREENSHOTS_DIR_NAME = 'screenshots';
const SCREENSHOTS_PATH = getPath(SCREENSHOTS_DIR_NAME);


class ScreenHandler {
  constructor() {
    this.listenToGlobalEvents();
  }

  listenToGlobalEvents() {
    ipcMain.on(Events.SCREENSHOT_TAKE, (event, arg) => {
      console.log(Events.SCREENSHOT_TAKE);
      this.take(event);
    });
    
    ipcMain.on(Events.SCREENSHOT_SAVE, (event, filesMap) => {
      console.log(Events.SCREENSHOT_SAVE);
      this.save(event, filesMap);
    });

    ipcMain.on(Events.SCREENSHOT_FILE, (event, screenId) => {
      console.log(Events.SCREENSHOT_FILE);
      this.getFile(event, screenId);
    });
    
    ipcMain.on(Events.SCREENSHOT_REMOVE, (event, screenId) => {
      console.log(Events.SCREENSHOT_REMOVE);
      this.remove(screenId);
    });
  }

  take(event) {
    if (isLinux()) { // take screen with scrot if linux
      this.takeScreenWithScrot(event);
    } else {
      this.takeScreenWithScreenshotDesktop(event);
    }
  }

  save(event, filesMap) { // filesMap: name => Buffer
    checkDir(SCREENSHOTS_PATH).then(() => {
      this.saveImages(filesMap).then(() => {
        event.sender.send(Events.SCREENSHOT_SAVE_SUCCESS);
      }, (err) => {
        event.sender.send(Events.SCREENSHOT_SAVE_ERROR, err);
        console.error(Events.SCREENSHOT_SAVE_ERROR, err);
      });
    });
  }

  /**
   * @description Fetch file from fs. Emits even if fetch failed; in this case, null is sent as value.
   * @param {Electron.IpcMainEvent} event
   * @param {string} screenId
   */
  getFile(event, screenId) {
    const filePath = `${SCREENSHOTS_PATH}/${screenId}`;
  
    fs.readFile(filePath, (err, screen) => {
      if (err) {
        const data = { buffer: null, id: screenId };
        event.sender.send(Events.SCREENSHOT_FILE_VALUE, data);
      } else {
        const blob = new Blob([screen], { type: 'image/png' });
        const data = { buffer: blob.buffer, id: screenId };
        event.sender.send(Events.SCREENSHOT_FILE_VALUE, data);
      }
    });
  }
  
  remove(screenId) {
    const filePath = `${SCREENSHOTS_PATH}/${screenId}`;
  
    fs.unlink(filePath, (err) => { // remove tmp file
      if (err) {
        console.log('Error removing screen file', screenId, err);
      }
    });
  }

  takeScreenWithScrot(event) {
    const filePath = `${SCREENSHOTS_PATH}/tmp.png`;
    const command = `scrot ${filePath}`;
    console.log('takeScreenWithScrot', command);
  
    checkDir(SCREENSHOTS_PATH).then(() => {
      exec(command, err => {
        if (err) {
          handleError(err);
        } else {
          readTmpFile();
        }
      });
    });

    function handleError(err) {
      const errorMessage = 'Error executing scrot. Please make sure "scrot" is installed on your system.';
      console.log(errorMessage, err);
      event.sender.send(Events.SCREENSHOT_TAKE_ERROR, errorMessage, err);
    }

    function readTmpFile() {
      fs.readFile(filePath, (err, screen) => { // read tmp file
        if (err) {
          console.log(err);
          return;
        }

        removeTmpFile();
  
        const blob = new Blob([screen], { type: 'image/png' });
        event.sender.send(Events.SCREENSHOT_TAKE_VALUE, [blob.buffer]);
      });
    }

    function removeTmpFile() {
      fs.unlink(filePath, (err) => { // remove tmp file
        if (err) {
          console.log('Error removing tmp screen file', err);
        }
      });
    }

  }

  takeScreenWithScreenshotDesktop(event) {
    screenshot.all().then(images => {
      const data = this.parseToBuffers(images);
      event.sender.send(Events.SCREENSHOT_TAKE_VALUE, data);
    }, err => {
      event.sender.send(Events.SCREENSHOT_TAKE_ERROR, err);
      console.error(Events.SCREENSHOT_TAKE_ERROR, 'Internal error', err);
    });
  }

  parseToBuffers(images) {
    return images.map(unit8Arr => new Blob([unit8Arr]).buffer);
  }

  saveImages(filesMap) {
    const savePromises = [];

    Object.keys(filesMap).forEach(fileName => {
      const buffer = filesMap[fileName];
      const filePath = `${SCREENSHOTS_PATH}/${fileName}`;
      const promise = saveFile(filePath, buffer);
      savePromises.push(promise);
    });

    return Promise.all(savePromises);
  }

}


module.exports = ScreenHandler;
