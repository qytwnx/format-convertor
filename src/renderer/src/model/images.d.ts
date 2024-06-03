type ImageFormat = 'jpg' | 'png' | 'gif' | 'webp' | 'tiff' | 'bmp';

type ImagesModel = {
  uid: string;
  name: string;
  thumbnail: string;
  path: string;
  progress: number;
  status: TransformStatusEnum;
};

type ImageTransformOptionModel = {
  targetFormat: ImageFormat;
  targetPath: string;
  sourceImages: Array<ImagesModel>;
};
