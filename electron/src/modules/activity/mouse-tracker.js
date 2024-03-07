const electron = require('electron');
const ioHook = require('iohook'); // https://wilix-team.github.io/iohook/usage.html


class MouseTracker {
  constructor() {
    this._wheelListener = null;
    this._clickListener = null;
    this._position = { x: 0, y: 0 };
    this._scrolled = false;
    this._clicked = false;
  }

  track() {
    this._wheelListener = (event) => {
      this._scrolled = true;
    }
    ioHook.on('mousewheel', this._wheelListener);

    this._clickListener = (event) => {
      this._clicked = true;
    }
    ioHook.on('mouseclick', this._clickListener);
  }

  stopTracking() {
    ioHook.off('mousewheel', this._wheelListener);
    ioHook.off('mouseclick', this._clickListener);
  }

  wasActive() {
    const positionChanged = this._positionChanged();
    const wheelPositionChanged = this._wheelPositionChanged();
    const buttonClicked = this._buttonClicked();
    
    return positionChanged || wheelPositionChanged || buttonClicked;
  }

  _positionChanged() {
    const currentPos = electron.screen.getCursorScreenPoint();
    const xChanged = currentPos.x !== this._position.x;
    const yChanged = currentPos.y !== this._position.y;
    const changed = xChanged || yChanged;
    
    this._position = { x: currentPos.x, y: currentPos.y };

    return changed;
  }

  _wheelPositionChanged() {
    const scrolled = this._scrolled;
    this._scrolled = false;

    return scrolled;
  }

  _buttonClicked() {
    const clicked = this._clicked;
    this._clicked = false;

    return clicked;
  }

}


module.exports = MouseTracker;
