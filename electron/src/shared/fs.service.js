const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { app } = require('electron');
const { dev } = require('../../env');
const { Deferred } = require('./utils');

const DATA_DIR_PATH = dev ? __dirname : app.getPath('userData');
// const DATA_DIR_PATH = app.getPath('userData');
// const DATA_DIR_PATH = __dirname;


function checkDir(dirPath) {
  const def = new Deferred();

  fs.stat(dirPath, (err, stat) => {
    if (!err) {
      // directory already exists
      def.resolve();
    } else {
      // directory does not exist
      if (err.code === 'ENOENT') {
        // create directory
        mkdirp(dirPath).then(made => {
          def.resolve();
        }, (err) => {
          // creating directory error
          console.error(err);
          def.reject(err);
        });
      } else {
        // other fs error
        console.error(err);
        def.reject(err);
      }
    }
  });

  return def.promise;
}

function saveFile(filePath, file) {
  const def = new Deferred();

  fs.writeFile(filePath, file, (err) => {
    if (err) {
      def.reject(err);
      console.error(err);
    } else
      def.resolve();
  });

  return def.promise;
}

function getPath(...segments) {
  console.log('path', path.join(DATA_DIR_PATH, ...segments));
  return path.join(DATA_DIR_PATH, ...segments);
}


module.exports = {
  checkDir,
  saveFile,
  getPath,
};
