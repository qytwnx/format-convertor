import { BrowserWindow, IpcMainEvent, ipcMain } from 'electron';
import { ImagesFfmpeg, VideosFfmpeg, AudiosFfmpeg } from '../ffmpeg';

export const registerImagesTransform = (win: BrowserWindow): void => {
  const imagesFfmpeg = new ImagesFfmpeg();
  const videosFfmpeg = new VideosFfmpeg();
  const audiosFfmpeg = new AudiosFfmpeg();
  ipcMain.on(
    'transform:images:run',
    (_event: IpcMainEvent, options: ImagesTransformOptionModel) => {
      imagesFfmpeg.init(win, options).run();
    }
  );
  ipcMain.on(
    'transform:videos:run',
    (_event: IpcMainEvent, options: VideosTransformOptionModel) => {
      videosFfmpeg.init(win, options).run();
    }
  );
  ipcMain.on(
    'transform:audios:run',
    (_event: IpcMainEvent, options: AudiosTransformOptionModel) => {
      audiosFfmpeg.init(win, options).run();
    }
  );
};
