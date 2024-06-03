import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
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
  },
  transformImagesRun: (options: ImageTransformOptionModel): void => {
    ipcRenderer.send('transform:images:run', options);
  },
  transformImagesProgress: (
    callback: (params: ProgressModel<ImagesModel>) => void
  ): void => {
    ipcRenderer.on(
      'transform:images:progress',
      (_event: IpcRendererEvent, params: ProgressModel<ImagesModel>) => {
        callback({ ...params });
      }
    );
  },
  transformVideosRun: (options: VideosTransformOptionModel): void => {
    ipcRenderer.send('transform:videos:run', options);
  },
  transformVideosProgress: (
    callback: (params: ProgressModel<VideosModel>) => void
  ): void => {
    ipcRenderer.on(
      'transform:videos:progress',
      (_event: IpcRendererEvent, params: ProgressModel<VideosModel>) => {
        callback({ ...params });
      }
    );
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
