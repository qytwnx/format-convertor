import {
  shell,
  BrowserWindow,
  BrowserWindowConstructorOptions
} from 'electron';
import { join } from 'path';
import url from 'node:url';
import { is } from '@electron-toolkit/utils';

export const createWindow = (
  options: BrowserWindowConstructorOptions & { routerPath?: string }
): BrowserWindow => {
  const win = new BrowserWindow(options);
  win.on('ready-to-show', () => {
    win.show();
  });
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
  const routerPath = options?.routerPath ? `#/${options?.routerPath}` : '';
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + routerPath);
  } else {
    // win.loadFile(join(__dirname, '../renderer/index.html'));
    win.loadURL(
      url.format({
        //编译后的文件
        pathname: join(__dirname, '../renderer/index.html'),
        //协议
        protocol: 'file',
        //protocol 后面需要两个/
        slashes: true,
        //hash 的值
        hash: routerPath
      })
    );
  }
  return win;
};
