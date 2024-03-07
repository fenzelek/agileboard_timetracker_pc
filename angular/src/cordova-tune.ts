export function tuneCordova() {
  window.open = (window as any).cordova.InAppBrowser.open;
}
