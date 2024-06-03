type ImagesModel = {
  uid: string;
  name: string;
  thumbnail: string;
  path: string;
  progress: number;
  status: TransformStatusEnum;
};

type ImageTransformOptionModel = {
  targetFormat: string;
  targetPath: string;
  sourceImages: Array<ImagesModel>;
};
