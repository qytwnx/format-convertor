import { ProgressStatusEnum } from './../../renderer/src/enums/common';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';
import { BrowserWindow } from 'electron';
import ffmpeg from 'fluent-ffmpeg';
import { existsSync } from 'node:fs';
import path from 'node:path';

export default class AudiosFfmpeg {
  constructor(
    private running: boolean = false,
    private ffmpeg?: ffmpeg.FfmpegCommand,
    private window?: BrowserWindow,
    private options?: AudiosTransformOptionModel
  ) {}

  init(window: BrowserWindow, options: AudiosTransformOptionModel) {
    this.running = false;
    this.ffmpeg = ffmpeg();
    this.window = window;
    this.options = options;
    ffmpeg.setFfmpegPath(
      ffmpegPath.path.replace('app.asar', 'app.asar.unpacked')
    );
    ffmpeg.setFfprobePath(
      ffprobePath.path.replace('app.asar', 'app.asar.unpacked')
    );
    return this;
  }

  private validate(file: AudiosModel) {
    if (!existsSync(this.options!.targetPath)) {
      this.window!.webContents.send('transform:audios:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.DIREDCTORY_CHECK,
        data: false,
        message: '目标路径校验：目标路径不存在'
      } as ProgressModel<AudiosModel>);
      return false;
    } else {
      this.window!.webContents.send('transform:audios:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.DIREDCTORY_CHECK,
        data: true,
        message: '目标路径校验：目标路径已存在'
      } as ProgressModel<AudiosModel>);
    }
    if (existsSync(this.getSaveFilePath(file))) {
      this.window!.webContents.send('transform:audios:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.FILE_CHECK,
        data: false,
        message: '目标文件校验：目标文件已存在'
      } as ProgressModel<AudiosModel>);
      return false;
    } else {
      this.window!.webContents.send('transform:audios:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.FILE_CHECK,
        data: true,
        message: '目标文件校验：目标文件不存在'
      } as ProgressModel<AudiosModel>);
    }
    return true;
  }

  private getSaveFilePath(file: AudiosModel) {
    const info = path.parse(file.name);
    return path.join(
      this.options!.targetPath,
      `${info.name}.${this.options!.targetFormat || 'mp3'}`
    );
  }

  run() {
    if (
      this.options?.targetFormat === undefined ||
      this.options?.targetPath === undefined ||
      this.options?.sourceAudios.length === 0
    ) {
      return;
    }
    this.running = true;
    this.runItem();
  }

  private runItem() {
    const audio = this.options!.sourceAudios.shift();
    if (audio === undefined) {
      this.running = false;
      return;
    }
    if (!this.validate(audio)) {
      this.runItem();
      return;
    }
    this.ffmpeg!.input(audio.path)
      .on('progress', (progress) => {
        console.log('progress', progress);
        this.window!.webContents.send('transform:audios:progress', {
          file: audio,
          progressStatus: ProgressStatusEnum.IN_PROGRESS,
          data: progress.percent,
          message: '转换中'
        } as ProgressModel<AudiosModel>);
      })
      .on('error', (error) => {
        console.log('error', error);
        this.window!.webContents.send('transform:audios:progress', {
          file: audio,
          progressStatus: ProgressStatusEnum.ERROR,
          data: 100,
          message: '转换失败'
        } as ProgressModel<AudiosModel>);
      })
      .on('end', () => {
        console.log('end');
        this.window!.webContents.send('transform:audios:progress', {
          file: audio,
          progressStatus: ProgressStatusEnum.END,
          data: 100,
          message: '转换成功'
        } as ProgressModel<AudiosModel>);
        this.runItem();
      })
      .save(this.getSaveFilePath(audio))
      .run();
  }

  isRunning(): boolean {
    return this.running;
  }
}
