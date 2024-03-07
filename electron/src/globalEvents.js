const Events = {
  // dependencies
  DEPENDENCIES_CHECK: 'dependencies-check', // (request)
  DEPENDENCIES_REQUIRED: 'dependencies-required', // (response; optional)

  DEPENDENCIES_INSTALL: 'dependencies-install', // (request)
  DEPENDENCIES_INSTALL_SUCCESS: 'dependencies-install-success', // (response)
  DEPENDENCIES_INSTALL_ERROR: 'dependencies-install-error', // (response)

  // credentials
  CREDENTIALS_GET: 'credentials-get', // (request)
  CREDENTIALS_VALUE: 'credentials-value', // (response)

  CREDENTIALS_SET: 'credentials-set', // (request)

  LOGOUT: 'logout',
  SELECT_COMPANY: 'select-company',
  UNSELECT_COMPANY: 'unselect-company',

  // idle
  IDLE_START: 'idle-start', // (request)
  IDLE_STOP: 'idle-stop', // (request)

  // activity
  ACTIVITY_START: 'activity-start', // (request)
  ACTIVITY_STOP: 'activity-stop', // (request)

  ACTIVITY_GET: 'activity-get', // (request)
  ACTIVITY_VALUE: 'activity-value', // (response)

  // screenshot
  SCREENSHOT_TAKE: 'screenshot-take', // (request) make screenshot
  SCREENSHOT_TAKE_VALUE: 'screenshot-take-value', // (response) buffer[]
  SCREENSHOT_TAKE_ERROR: 'screenshot-take-error', // (response)

  SCREENSHOT_FILE: 'screenshot-file', // (response) fetch one file
  SCREENSHOT_FILE_VALUE: 'screenshot-value', // (response) Screen object
  // No error event here. If error, value is null.

  SCREENSHOT_REMOVE: 'screenshot-remove', // (request)

  SCREENSHOT_SAVE: 'screenshot-save', // (request) save screenshot on hdd
  SCREENSHOT_SAVE_SUCCESS: 'screenshot-save-success', // (response)
  SCREENSHOT_SAVE_ERROR: 'screenshot-save-error', // (response)

  // CORE
  CLOSE: 'app-close', // (request)
  CLOSING: 'app-closing', // (notify renderer)
  FOCUS: 'app-focus', // (request)

  LOG: 'log', // pass logs from main to renderer
  CHANGE_VIEW_MODE: 'change-view-mode',
};

module.exports = Events;
