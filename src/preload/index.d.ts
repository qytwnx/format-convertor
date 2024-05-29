import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      mainWindowCustomMinimize: () => void;
      mainWindowCustomMaximizeStatus: () => Promise<boolean>;
      mainWindowCustomMaximize: () => void;
      mainWindowCustomUnmaximize: () => void;
      mainWindowCustomClose: () => void;
      openExternal: (url: string) => void;
      themeDarkToggle: (mode: 'light' | 'dark') => Promise<boolean>;
      themeDarkStatus: () => Promise<boolean>;
    };
  }
}
