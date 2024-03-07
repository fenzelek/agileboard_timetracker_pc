function isLinux() {
  return process.platform === 'linux';
}

function isMac() {
  return process.platform === 'darwin';
}

function isWindows() {
  return process.platform === 'win32';
}


module.exports = {
  isLinux,
  isMac,
  isWindows,
}
