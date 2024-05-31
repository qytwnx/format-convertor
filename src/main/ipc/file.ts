import { BrowserWindow, dialog, ipcMain } from 'electron';

export const registerFileOperate = (win: BrowserWindow): void => {
  ipcMain.handle('choose:directory', () => {
    return dialog.showOpenDialogSync(win, {
      title: '选择文件夹',
      properties: ['openDirectory', 'createDirectory']
    });
  });
  ipcMain.handle('choose:files', () => {
    return dialog.showOpenDialogSync(win, {
      title: '选择文件',
      properties: ['openFile', 'multiSelections']
    });
  });
};
