const ioHook = require('iohook');


class KeyboardTracker {
  constructor() {
    this._listener = null;
    this._pressed = false;
  }

  track() {
    this._listener = (event) => {
      this._pressed = true;
    }
    ioHook.on('keydown', this._listener); // https://wilix-team.github.io/iohook/usage.html#keydown
  }

  stopTracking() {
    ioHook.off('keydown', this._listener);
  }

  wasActive() {
    const pressed = this._pressed;
    this._pressed = false;

    return pressed;
  }
}


module.exports = KeyboardTracker;
