import { IpcMainInvokeEvent, ipcMain, nativeTheme } from 'electron';

export const registerTheme = (): void => {
  ipcMain.handle(
    'theme:dark:toggle',
    (_event: IpcMainInvokeEvent, mode: 'light' | 'dark') => {
      nativeTheme.themeSource = mode;
      return nativeTheme.shouldUseDarkColors;
    }
  );
  ipcMain.handle('theme:dark:status', () => {
    const status = nativeTheme.shouldUseDarkColors;
    return status;
  });
};
