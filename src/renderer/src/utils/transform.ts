import { TransformStatusEnum } from '@renderer/enums/common';

export const handleGetTransformBackgroundColor = (
  status: TransformStatusEnum
): string => {
  return {
    [TransformStatusEnum.READAY]: '#ffffff',
    [TransformStatusEnum.IN_PROGRESS]: '#F9F871',
    [TransformStatusEnum.ERROR]: '#f3a683',
    [TransformStatusEnum.FINISH]: '#55efc4'
  }[status];
};
