"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  buildContextMenu: (template) => {
    electron.ipcRenderer.send("build-context-menu", template);
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
