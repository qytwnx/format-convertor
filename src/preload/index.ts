import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  mainWindowCustomMinimize: (): void => {
    ipcRenderer.send('main:window:custom:minimize');
  },
  mainWindowCustomMaximizeStatus: (): Promise<boolean> => {
    return ipcRenderer.invoke('main:window:custom:maximize:status');
  },
  mainWindowCustomMaximize: (): void => {
    ipcRenderer.send('main:window:custom:maximize');
  },
  mainWindowCustomUnmaximize: (): void => {
    ipcRenderer.send('main:window:custom:unmaximize');
  },
  mainWindowCustomClose: (): void => {
    ipcRenderer.send('main:window:custom:close');
  },
  openExternal: (url: string): void => {
    ipcRenderer.send('open:external', url);
  },
  themeDarkToggle: (mode: 'light' | 'dark'): Promise<boolean> => {
    return ipcRenderer.invoke('theme:dark:toggle', mode);
  },
  themeDarkStatus: (): Promise<boolean> => {
    return ipcRenderer.invoke('theme:dark:status');
  },
  chooseDirectory: (): Promise<Array<string> | undefined> => {
    return ipcRenderer.invoke('choose:directory');
  },
  chooseFiles: (): Promise<Array<string> | undefined> => {
    return ipcRenderer.invoke('choose:files');
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
