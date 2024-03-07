const copy = require('copy');
const path = require('path');

const config = {
    src: path.join(__dirname, 'dist/angular/**'),
    dist: path.resolve(__dirname, '../electron/app'),
}

run();


function run() {
    console.log(`Copying ${config.src} to ${config.dist}`);
    
    copy(config.src, config.dist, (err) => {
        if (err) {
            console.error('Error:\n', err);
        } else {
            console.log('Done');
        }
    });
}
