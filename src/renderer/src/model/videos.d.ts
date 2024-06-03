type VideosFormat = 'mov' | 'mp4';
type VideosResolution =
  | '4096x2160'
  | '3840x2160'
  | '2560x1440'
  | '1920x1080'
  | '1280x720'
  | '720x480'
  | '640x480'
  | '320x240';
type VideosFrameRate = 144 | 120 | 60 | 30 | 15;

type VideosModel = {
  uid: string;
  name: string;
  path: string;
  progress: number;
  status: TransformStatusEnum;
};

type VideosTransformOptionModel = {
  targetFormat: VideosFormat;
  targetPath: string;
  resolution: VideosResolution;
  frameRate: VideosFrameRate;
  sourceVideos: Array<VideosModel>;
};
