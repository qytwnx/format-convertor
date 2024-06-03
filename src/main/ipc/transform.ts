import { BrowserWindow, IpcMainEvent, ipcMain } from 'electron';
import { ImagesFfmpeg, VideosFfmpeg } from '../ffmpeg';

export const registerImagesTransform = (win: BrowserWindow): void => {
  const imagesFfmpeg = new ImagesFfmpeg();
  const videosFfmpeg = new VideosFfmpeg();
  ipcMain.on(
    'transform:images:run',
    (_event: IpcMainEvent, options: ImageTransformOptionModel) => {
      imagesFfmpeg.init(win, options).run();
    }
  );
  ipcMain.on(
    'transform:videos:run',
    (_event: IpcMainEvent, options: VideosTransformOptionModel) => {
      videosFfmpeg.init(win, options).run();
    }
  );
};
