import { IpcMainInvokeEvent, ipcMain, shell } from 'electron';

export const registerOpenExternal = (): void => {
  ipcMain.on('open:external', (_event: IpcMainInvokeEvent, url: string) => {
    shell.openExternal(url);
  });
};
