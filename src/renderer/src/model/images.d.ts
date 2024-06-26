type ImagesFormat = 'jpg' | 'png' | 'gif' | 'webp' | 'tiff' | 'bmp';

type ImagesModel = {
  uid: string;
  name: string;
  thumbnail: string;
  path: string;
  progress: number;
  status: TransformStatusEnum;
};

type ImagesTransformOptionModel = {
  targetFormat: ImagesFormat;
  targetPath: string;
  sourceImages: Array<ImagesModel>;
};
