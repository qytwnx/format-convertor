type AudiosFormat = 'mp3' | 'wav';

type AudiosModel = {
  uid: string;
  name: string;
  path: string;
  progress: number;
  status: TransformStatusEnum;
};

type AudiosTransformOptionModel = {
  targetFormat: AudiosFormat;
  targetPath: string;
  sourceAudios: Array<AudiosModel>;
};
