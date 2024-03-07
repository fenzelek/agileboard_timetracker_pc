const { exec } = require('child_process');
const sudo = require('sudo-prompt');
const { ipcMain } = require('electron');

const { Deferred, allSettled } = require('../../shared/utils');
const { isLinux } = require('../../shared/system');
const Events = require('../../globalEvents');

// list of dependencies
const DEPS = [
  {
    name: 'scrot',
    command: 'apt-get install -y scrot',
  },
  {
    name: 'libsecret',
    command: 'apt-get install -y libsecret-1-dev',
  },
];

// dependency checks
const CHECKS = {
  scrot: () => {
    const def = new Deferred();

    exec('dpkg -s scrot', (err) => {
      if (err) {
        def.reject(false);
      } else {
        def.resolve(true);
      }
    });

    return def.promise;
  },

  libsecret: () => {
    const def = new Deferred();

    exec('dpkg -s libsecret-1-dev', (err, stdout) => {
      if (err) {
        def.reject(false);
      } else {
        def.resolve(stdout);
      }
    });

    return def.promise;
  },
}


class Dependencies {
  constructor() {
    this.listenToGlobalEvents();
  }

  listenToGlobalEvents() {
    ipcMain.once(Events.DEPENDENCIES_CHECK, (event, filesMap) => {
      console.log(Events.DEPENDENCIES_CHECK);
      this.check(event);
    });
  }

  check(event) {
    console.log('Checking dependencies...');
  
    if (isLinux()) {
      const checks = DEPS.map(dep => CHECKS[dep.name]());

      allSettled(...checks).then(result => {
        const allOK = Object.keys(result.resolved).length === checks.length;

        if (allOK) {
          console.log('OK');
        } else {
          const requiredDeps = Object.keys(result.rejected).map(key => DEPS[key].name);
          console.log('Dependencies required:', requiredDeps.join(', '));
          this.install(event, result);
        }
      });
    } else {
      console.log('OK');
    }
  }

  install(event, result) {
    ipcMain.on(Events.DEPENDENCIES_INSTALL, (event) => {
      console.log('Installing dependencies...');

      this.execCommands(result).then(() => {
        console.log('Successfully installed dependencies');
        event.sender.send(Events.DEPENDENCIES_INSTALL_SUCCESS);
      }, (err) => {
        console.error('Error installing dependencies', err);
        event.sender.send(Events.DEPENDENCIES_INSTALL_ERROR);
      });
    });
    
    event.sender.send(Events.DEPENDENCIES_REQUIRED);
  }

  execCommands(result) {
    const def = new Deferred();
    const commands = [];

    Object.keys(result.rejected).forEach(key => {
      const cmd = DEPS[key].command;
      commands.push(cmd);
    });

    const command = commands.join(' && ');

    this.execSudo(command).then(() => {
      def.resolve();
    }, (err) => {
      def.reject(err);
    });

    return def.promise;
  }

  execSudo(command) {
    console.log('executing with sudo:', command);

    const def = new Deferred();

    sudo.exec(command, { name: 'Install required dependencies' }, (err) => {
      if (err) {
        def.reject(err);
      } else {
        def.resolve();
      }
    });

    return def.promise;
  }

}

module.exports = Dependencies;
