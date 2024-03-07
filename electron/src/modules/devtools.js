const ioHook = require('iohook');
const { isLinux, isWindows, isMac } = require('../shared/system');

module.exports.handleDevToolsOpening = (mainWindow) => {
  let windowIsFocused;
  
  mainWindow.on('focus', () => {
    windowIsFocused = true;
  });
  
  mainWindow.on('blur', () => {
    windowIsFocused = false;
  });

  // ctrl, shift, k
  const linuxKeys = [29, 42, 37];  // https://github.com/torvalds/linux/blob/master/include/uapi/linux/input-event-codes.h
  // ctrl, shift, i
  const windowsKeys = [17, 16, 75];  // https://boostrobotics.eu/windows-key-codes
  const macKeys = [59, 57, 40];  // https://eastmanreference.com/complete-list-of-applescript-key-codes
  const keys = isLinux() ? linuxKeys : isWindows() ? windowsKeys : isMac() ? macKeys : null;

  if (!keys) return;

  ioHook.registerShortcut(keys, () => {
    if (!windowIsFocused) return;
    mainWindow.webContents.toggleDevTools();
  });

  ioHook.start();
}
