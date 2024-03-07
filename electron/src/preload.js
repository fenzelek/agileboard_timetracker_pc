// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

showVersions();

function showVersions() {
  console.log(process);
  console.log(`
    chrome: ${process.versions.chrome}
    node: ${process.versions.node}
    electron: ${process.versions.electron}
  `);
}

