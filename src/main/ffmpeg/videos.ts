import { ProgressStatusEnum } from './../../renderer/src/enums/common';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';
import { BrowserWindow } from 'electron';
import ffmpeg from 'fluent-ffmpeg';
import { existsSync } from 'node:fs';
import path from 'node:path';

export default class VideosFfmpeg {
  constructor(
    private running: boolean = false,
    private ffmpeg?: ffmpeg.FfmpegCommand,
    private window?: BrowserWindow,
    private options?: VideosTransformOptionModel
  ) {}

  init(window: BrowserWindow, options: VideosTransformOptionModel) {
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

  private validate(file: VideosModel) {
    if (!existsSync(this.options!.targetPath)) {
      this.window!.webContents.send('transform:videos:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.DIREDCTORY_CHECK,
        data: false,
        message: '目标路径校验：目标路径不存在'
      } as ProgressModel<VideosModel>);
      return false;
    } else {
      this.window!.webContents.send('transform:videos:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.DIREDCTORY_CHECK,
        data: true,
        message: '目标路径校验：目标路径已存在'
      } as ProgressModel<VideosModel>);
    }
    if (existsSync(this.getSaveFilePath(file))) {
      this.window!.webContents.send('transform:videos:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.FILE_CHECK,
        data: false,
        message: '目标文件校验：目标文件已存在'
      } as ProgressModel<VideosModel>);
      return false;
    } else {
      this.window!.webContents.send('transform:videos:progress', {
        file: file,
        progressStatus: ProgressStatusEnum.FILE_CHECK,
        data: true,
        message: '目标文件校验：目标文件不存在'
      } as ProgressModel<VideosModel>);
    }
    return true;
  }

  private getSaveFilePath(file: VideosModel) {
    const info = path.parse(file.name);
    return path.join(
      this.options!.targetPath,
      `${info.name}.${this.options!.targetFormat || 'mp4'}`
    );
  }

  run() {
    if (
      this.options?.targetFormat === undefined ||
      this.options?.targetPath === undefined ||
      this.options?.resolution === undefined ||
      this.options?.frameRate === undefined ||
      this.options?.sourceVideos.length === 0
    ) {
      return;
    }
    this.running = true;
    this.runItem();
  }

  private runItem() {
    const video = this.options!.sourceVideos.shift();
    if (video === undefined) {
      this.running = false;
      return;
    }
    if (!this.validate(video)) {
      this.runItem();
      return;
    }
    this.ffmpeg!.input(video.path)
      .fps(this.options!.frameRate)
      .size(this.options!.resolution)
      .format(this.options!.targetFormat || 'mp4')
      .videoCodec('libx264')
      .on('progress', (progress) => {
        console.log('progress', progress);
        this.window!.webContents.send('transform:videos:progress', {
          file: video,
          progressStatus: ProgressStatusEnum.IN_PROGRESS,
          data: progress.percent,
          message: '转换中'
        } as ProgressModel<VideosModel>);
      })
      .on('error', (error) => {
        console.log('error', error);
        this.window!.webContents.send('transform:videos:progress', {
          file: video,
          progressStatus: ProgressStatusEnum.ERROR,
          data: 100,
          message: '转换失败'
        } as ProgressModel<VideosModel>);
      })
      .on('end', () => {
        console.log('end');
        this.window!.webContents.send('transform:videos:progress', {
          file: video,
          progressStatus: ProgressStatusEnum.END,
          data: 100,
          message: '转换成功'
        } as ProgressModel<VideosModel>);
        this.runItem();
      })
      .save(this.getSaveFilePath(video))
      .run();
  }

  isRunning(): boolean {
    return this.running;
  }
}
