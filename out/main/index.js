"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.handle("pick-source", async () => {
    const inputSources = await electron.desktopCapturer.getSources({
      types: ["window", "screen"]
    });
    return inputSources;
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  electron.ipcMain.on("build-context-menu", async (_, template) => {
    const data = await JSON.parse(template);
    const menu = electron.Menu.buildFromTemplate(data);
    menu.popup();
  });
  electron.ipcMain.on("menu-item-click", (_, action) => {
    console.log(action);
  });
  electron.ipcMain.on("save-video", async (_, buffer) => {
    console.log("Hitting save video");
    const { filePath } = await electron.dialog.showSaveDialog({
      buttonLabel: "Save video",
      defaultPath: `video-${Date.now()}.webm`
    });
    console.log(filePath);
    if (filePath) {
      fs.writeFile(filePath, buffer, () => {
        console.log("video saved");
      });
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
