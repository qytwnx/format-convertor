import { BrowserWindow, IpcMainEvent, ipcMain } from 'electron';
import { ImagesFfmpeg } from '../ffmpeg';

export const registerImagesTransform = (win: BrowserWindow): void => {
  const imagesFfmpeg = new ImagesFfmpeg();
  ipcMain.on(
    'transform:images:run',
    (_event: IpcMainEvent, options: ImageTransformOptionModel) => {
      imagesFfmpeg.init(win, options).run();
    }
  );
};
