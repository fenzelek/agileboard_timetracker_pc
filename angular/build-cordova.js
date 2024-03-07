const copy = require('copy');
const path = require('path');
const fs = require('fs');

const config = {
  src: path.join(__dirname, 'dist/angular/**'),
  dist: path.resolve(__dirname, '../cordova/www'),
  indexFile: path.join(__dirname, '../cordova/www/index.html'),
  cordova: {
    markups: {
      meta: '<!--cordova-meta-->',
      js: '<!--cordova-js-->',
    },
    content: {
      meta: `
        <meta http-equiv="Content-Security-Policy" content="default-src *; img-src * data; style-src * 'unsafe-inline'; script-src 'self' 'unsafe-inline'">      
      `,
      js: `
        <script>
          window.addEventListener = function () {
            (window.EventTarget || Window).prototype.addEventListener.apply(this, arguments);
          };
          window.removeEventListener = function () {
            (window.EventTarget || Window).prototype.removeEventListener.apply(this, arguments);
          };
          document.addEventListener = function () {
            (window.EventTarget || Document).prototype.addEventListener.apply(this, arguments);
          };
          document.removeEventListener = function () {
            (window.EventTarget || Document).prototype.removeEventListener.apply(this, arguments);
          };
        </script> 
        <script type="text/javascript" src="cordova.js"></script>
      `,
    }
  },
}

run();


function run() {
  compileIndex();
  // copyToCordova();
}

function compileIndex() {
  console.log(`Compiling ${config.indexFile}`);
  
  // add cordova-specyfic files/configs
  let indexFile = fs.readFileSync(config.indexFile, 'utf-8');

  indexFile = indexFile.replace(config.cordova.markups.meta, config.cordova.content.meta);
  indexFile = indexFile.replace(config.cordova.markups.js, config.cordova.content.js);

  fs.writeFileSync(config.indexFile, indexFile, { encoding: 'utf-8' });

  console.log('Done');
}

function copyToCordova() {
  console.log(`Copying ${config.src} to ${config.dist}`);

  copy(config.src, config.dist, (err) => {
    if (err) {
      console.error('Error:\n', err);
    } else {
      console.log('Done');
    }
  });
}
