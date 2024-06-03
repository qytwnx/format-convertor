import {
  Button,
  GetProp,
  Input,
  Select,
  Skeleton,
  Upload,
  UploadProps,
  Image,
  message
} from 'antd';
import styles from './index.module.less';
import { useEffect, useState } from 'react';
import { ImagesFormatOptions } from '@renderer/constants/options';
import { MdAddPhotoAlternate, MdDeleteOutline } from 'react-icons/md';
import {
  ProgressStatusEnum,
  TransformStatusEnum
} from '@renderer/enums/common';
import { useTransformImagesStore } from '@renderer/store';
import { handleGetTransformBackgroundColor } from '@renderer/utils/transform';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const handleGetBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Images = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageTransformOption, setImageTransformOption] =
    useTransformImagesStore((state) => [
      state.imagesOptions,
      state.setImagesOptions
    ]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [currentProgressInfo, setCurrentProgressInfo] =
    useState<ProgressModel<ImagesModel>>();

  const handleChooseTargetPath = async () => {
    const res = await window.api.chooseDirectory();
    if (res !== undefined && res instanceof Array && res.length > 0) {
      const targetPath = String(res[0]);
      setImageTransformOption({
        ...imageTransformOption,
        targetPath: targetPath
      });
    }
  };

  const handleTrnasformImagesProgress = (
    params: ProgressModel<ImagesModel>
  ) => {
    console.log('progress: ', imageTransformOption);
    setCurrentProgressInfo(params);
    const { file, progressStatus, data } = params;
    const sourceImages = imageTransformOption.sourceImages;
    const imageIndex = sourceImages.findIndex((item) => item.uid == file.uid);
    if (imageIndex === -1) {
      return;
    }
    switch (progressStatus) {
      case ProgressStatusEnum.IN_PROGRESS:
        if (typeof data === 'number') {
          sourceImages[imageIndex].progress = data;
          setImageTransformOption(imageTransformOption);
        }
        break;
      case ProgressStatusEnum.END:
        sourceImages[imageIndex].progress = 100;
        sourceImages[imageIndex].status = TransformStatusEnum.FINISH;
        setImageTransformOption({
          ...imageTransformOption,
          sourceImages: sourceImages
        });
        break;
      case ProgressStatusEnum.DIREDCTORY_CHECK:
        if (!data) {
          sourceImages[imageIndex].status = TransformStatusEnum.ERROR;
          sourceImages[imageIndex].progress = 100;
          setImageTransformOption({
            ...imageTransformOption,
            sourceImages: sourceImages
          });
        }
        break;
      case ProgressStatusEnum.FILE_CHECK:
        if (!data) {
          sourceImages[imageIndex].status = TransformStatusEnum.ERROR;
          sourceImages[imageIndex].progress = 100;
          setImageTransformOption({
            ...imageTransformOption,
            sourceImages: sourceImages
          });
        }
        break;
      case ProgressStatusEnum.ERROR:
        if (!data) {
          sourceImages[imageIndex].status = TransformStatusEnum.ERROR;
          sourceImages[imageIndex].progress = 100;
          setImageTransformOption({
            ...imageTransformOption,
            sourceImages: sourceImages
          });
        }
        break;
    }
  };

  const handleFormatChange = (value: ImageFormat) => {
    setImageTransformOption({ ...imageTransformOption, targetFormat: value });
  };

  const handleTransformImagesRun = () => {
    console.log('run: ', imageTransformOption);
    if (!imageTransformOption.targetPath) {
      messageApi.error('请选择存储位置');
      return;
    }
    if (!imageTransformOption.targetFormat) {
      messageApi.error('请选择存储格式');
      return;
    }
    if (imageTransformOption.sourceImages.length === 0) {
      messageApi.error('请选择图片');
      return;
    }
    const sourceImages = imageTransformOption.sourceImages.filter(
      (filter) => filter.status === TransformStatusEnum.READAY
    );
    if (sourceImages.length === 0) {
      messageApi.error('请选择图片');
      return;
    }
    window.api.transformImagesRun({
      ...imageTransformOption,
      sourceImages: sourceImages
    });
  };

  useEffect(() => {
    window.api.transformImagesProgress(handleTrnasformImagesProgress);
  }, [imageTransformOption]);

  return (
    <>
      {contextHolder}
      <div className={styles['images-container']}>
        <div className={styles['images-container-setting']}>
          <div className={styles['images-container-setting-item']}>
            <div className={styles['images-container-setting-item-label']}>
              存储位置
            </div>
            <div className={styles['images-container-setting-item-content']}>
              <Input
                value={imageTransformOption?.targetPath}
                readOnly
                placeholder="请选择位置"
              />
              <Button
                onClick={() => {
                  handleChooseTargetPath();
                }}
              >
                选择
              </Button>
            </div>
          </div>
          <div className={styles['images-container-setting-item']}>
            <div className={styles['images-container-setting-item-label']}>
              存储格式
            </div>
            <div className={styles['images-container-setting-item-content']}>
              <Select
                value={imageTransformOption?.targetFormat}
                placeholder="请选择存储格式"
                listHeight={130}
                placement="bottomLeft"
                className="w-full"
                onChange={handleFormatChange}
                options={ImagesFormatOptions}
              />
            </div>
          </div>
        </div>
        <div className={styles['images-container-transform']}>
          <Upload
            action="#"
            // multiple
            showUploadList={false}
            accept="image/*"
            // maxCount={10}
            onChange={async (info) => {
              console.log('info: ', info);
              if (info.file.status === 'uploading') {
                setLoading(true);
              }
              if (info.file.status === 'done') {
                const { uid, originFileObj } = info.file;
                const thumbnail = await handleGetBase64(
                  originFileObj as FileType
                );
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { name, path } = originFileObj;
                const sourceImages = imageTransformOption.sourceImages;
                console.log(imageTransformOption);
                setImageTransformOption({
                  ...imageTransformOption,
                  sourceImages: [
                    ...sourceImages,
                    {
                      uid: uid,
                      name: name,
                      path: path,
                      thumbnail: thumbnail,
                      progress: 0,
                      status: TransformStatusEnum.READAY
                    }
                  ]
                });
                setLoading(false);
              }
            }}
            customRequest={async ({ file, onSuccess, onProgress }) => {
              if (onProgress) {
                onProgress({ percent: 100 });
              }
              if (onSuccess) {
                onSuccess(file);
              }
            }}
          >
            <MdAddPhotoAlternate
              className={styles['images-container-transform-select']}
            />
          </Upload>
          <div className={styles['images-container-transform-operate']}>
            <Button onClick={() => handleTransformImagesRun()}>开始转换</Button>
            <Button
              danger
              onClick={() =>
                setImageTransformOption({
                  targetFormat: imageTransformOption.targetFormat,
                  targetPath: imageTransformOption.targetPath,
                  sourceImages: []
                })
              }
            >
              清空列表
            </Button>
          </div>
          <Skeleton active className="px-6 py-4" loading={loading}>
            <div className={styles['images-container-transform-list']}>
              {imageTransformOption.sourceImages.map((item, index) => (
                <div
                  key={index}
                  style={
                    {
                      '--process': `${item.progress}%`,
                      '--bgColor': handleGetTransformBackgroundColor(
                        item.status
                      )
                    } as React.CSSProperties
                  }
                  className={styles['images-container-transform-list-item']}
                >
                  <div
                    className={
                      styles['images-container-transform-list-item-progress-bg']
                    }
                  ></div>
                  <div
                    className={
                      styles['images-container-transform-list-item-progress']
                    }
                  >
                    <div
                      className={
                        styles[
                          'images-container-transform-list-item-progress-number'
                        ]
                      }
                    >
                      {index + 1}
                    </div>
                    <img
                      src={item.thumbnail}
                      alt="thumbnail"
                      className={
                        styles['images-container-transform-list-item-thumbnail']
                      }
                      onClick={() => {
                        if (item.thumbnail) {
                          setPreviewImage(item.thumbnail);
                          setPreviewOpen(true);
                        }
                      }}
                    />
                    <div
                      className={
                        styles[
                          'images-container-transform-list-item-progress-name'
                        ]
                      }
                    >
                      {item?.name}
                    </div>
                    <MdDeleteOutline
                      className={
                        styles['images-container-transform-list-item-delete']
                      }
                      onClick={() => {
                        const sourceImages = imageTransformOption.sourceImages;
                        setImageTransformOption({
                          targetFormat: imageTransformOption.targetFormat,
                          targetPath: imageTransformOption.targetPath,
                          sourceImages: sourceImages.filter(
                            (_, i) => i !== index
                          )
                        });
                      }}
                    />
                  </div>
                  {currentProgressInfo &&
                    currentProgressInfo.file.uid === item.uid && (
                      <div
                        className={
                          styles[
                            'images-container-transform-list-item-infomation'
                          ]
                        }
                      >
                        {currentProgressInfo?.message}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </Skeleton>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage('')
              }}
              src={previewImage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Images;
