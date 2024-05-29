import { BrowserWindow, app, ipcMain } from 'electron';

export const registerMainWindowControl = (win: BrowserWindow): void => {
  ipcMain.on('main:window:custom:minimize', () => {
    win.minimize();
  });
  ipcMain.handle('main:window:custom:maximize:status', () => {
    return win.isMaximized();
  });
  ipcMain.on('main:window:custom:maximize', () => {
    win.maximize();
  });
  ipcMain.on('main:window:custom:unmaximize', () => {
    win.unmaximize();
  });
  ipcMain.on('main:window:custom:close', () => {
    app.quit();
  });
};
