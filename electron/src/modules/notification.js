const { Notification, app } = require("electron");
const path = require("path");
const { translate } = require("./i18n");
const icon = path.join(app.getAppPath(), 'src', 'assets', 'icons', 'png', '128x128.png');


notify = (body, config = {}) => {
  body = translate(body);

  const notification = new Notification({ title: 'Time Tracker', icon, body, ...config });
  notification.show();

  return notification;
}


module.exports = { notify };
