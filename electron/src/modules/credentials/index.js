const { ipcMain } = require('electron');
const keytar = require('keytar');
const Events = require('../../globalEvents');

const APP_KEY = 'time-tracker';


class Credentials {
  constructor() {
    this.listenToGlobalEvents();
  }

  listenToGlobalEvents() {
    ipcMain.on(Events.CREDENTIALS_GET, (event, name) => {
      console.log(Events.CREDENTIALS_GET);
      this.getPassword(event, name);
    });

    ipcMain.on(Events.CREDENTIALS_SET, (event, name, password) => {
      console.log(Events.CREDENTIALS_SET);
      this.setPassword(event, name, password);
    });
  }

  getPassword(event, name) {
    keytar.getPassword(APP_KEY, name).then((password) => {
      console.log('Password fetch success');
      event.sender.send(Events.CREDENTIALS_VALUE, password);
    }, (err) => {
      console.error('Password fetch error', err);
      event.sender.send(Events.CREDENTIALS_VALUE, null);
    });
  }

  setPassword(event, name, password) {
    keytar.setPassword(APP_KEY, name, password).then(() => {
      console.log('Password set success');
    }, (err) => {
      console.error('Password set error', err);
    });
  }

}


module.exports = Credentials;
