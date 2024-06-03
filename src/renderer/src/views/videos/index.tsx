import { Button, Input, Select, Skeleton, Upload, message } from 'antd';
import styles from './index.module.less';
import { useEffect, useState } from 'react';
import {
  VideosFormatOptions,
  VideosFrameRateOptions,
  VideosResolutionOptions
} from '@renderer/constants/options';
import { MdDeleteOutline } from 'react-icons/md';
import { RiVideoAddFill } from 'react-icons/ri';
import {
  ProgressStatusEnum,
  TransformStatusEnum
} from '@renderer/enums/common';
import { useTransformVideosStore } from '@renderer/store';
import { handleGetTransformBackgroundColor } from '@renderer/utils/transform';

const Videos = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [videosTransformOption, setVideosTransformOption] =
    useTransformVideosStore((state) => [
      state.videosOptions,
      state.setVideosOptions
    ]);
  const [currentProgressInfo, setCurrentProgressInfo] =
    useState<ProgressModel<VideosModel>>();

  const handleChooseTargetPath = async () => {
    const res = await window.api.chooseDirectory();
    if (res !== undefined && res instanceof Array && res.length > 0) {
      const targetPath = String(res[0]);
      setVideosTransformOption({
        ...videosTransformOption,
        targetPath: targetPath
      });
    }
  };

  const handleTrnasformVideosProgress = (
    params: ProgressModel<VideosModel>
  ) => {
    console.log('progress: ', videosTransformOption);
    setCurrentProgressInfo(params);
    const { file, progressStatus, data } = params;
    const sourceVideos = videosTransformOption.sourceVideos;
    const videoIndex = sourceVideos.findIndex((item) => item.uid == file.uid);
    if (videoIndex === -1) {
      return;
    }
    switch (progressStatus) {
      case ProgressStatusEnum.IN_PROGRESS:
        if (typeof data === 'number') {
          sourceVideos[videoIndex].progress = data;
          sourceVideos[videoIndex].status = TransformStatusEnum.IN_PROGRESS;
          setVideosTransformOption(videosTransformOption);
        }
        break;
      case ProgressStatusEnum.END:
        sourceVideos[videoIndex].progress = 100;
        sourceVideos[videoIndex].status = TransformStatusEnum.FINISH;
        setVideosTransformOption({
          ...videosTransformOption,
          sourceVideos: sourceVideos
        });
        break;
      case ProgressStatusEnum.DIREDCTORY_CHECK:
        if (!data) {
          sourceVideos[videoIndex].status = TransformStatusEnum.ERROR;
          sourceVideos[videoIndex].progress = 100;
          setVideosTransformOption({
            ...videosTransformOption,
            sourceVideos: sourceVideos
          });
        }
        break;
      case ProgressStatusEnum.FILE_CHECK:
        if (!data) {
          sourceVideos[videoIndex].status = TransformStatusEnum.ERROR;
          sourceVideos[videoIndex].progress = 100;
          setVideosTransformOption({
            ...videosTransformOption,
            sourceVideos: sourceVideos
          });
        }
        break;
      case ProgressStatusEnum.ERROR:
        if (!data) {
          sourceVideos[videoIndex].status = TransformStatusEnum.ERROR;
          sourceVideos[videoIndex].progress = 100;
          setVideosTransformOption({
            ...videosTransformOption,
            sourceVideos: sourceVideos
          });
        }
        break;
    }
  };

  const handleFormatChange = (value: VideosFormat) => {
    setVideosTransformOption({ ...videosTransformOption, targetFormat: value });
  };

  const handleResolutionChange = (value: VideosResolution) => {
    setVideosTransformOption({
      ...videosTransformOption,
      resolution: value
    });
  };

  const handleFrameRateChange = (value: VideosFrameRate) => {
    setVideosTransformOption({
      ...videosTransformOption,
      frameRate: value
    });
  };

  const handleTransformVideosRun = () => {
    console.log('run: ', videosTransformOption);
    if (!videosTransformOption.targetPath) {
      messageApi.error('请选择存储位置');
      return;
    }
    if (!videosTransformOption.targetFormat) {
      messageApi.error('请选择存储格式');
      return;
    }
    if (!videosTransformOption.resolution) {
      messageApi.error('请选择画质');
      return;
    }
    if (!videosTransformOption.frameRate) {
      messageApi.error('请选择帧率');
      return;
    }
    if (videosTransformOption.sourceVideos.length === 0) {
      messageApi.error('请选择视频');
      return;
    }
    const sourceVideos = videosTransformOption.sourceVideos.filter(
      (filter) => filter.status === TransformStatusEnum.READAY
    );
    if (sourceVideos.length === 0) {
      messageApi.error('请选择视频');
      return;
    }
    window.api.transformVideosRun({
      ...videosTransformOption,
      sourceVideos: sourceVideos
    });
  };

  useEffect(() => {
    window.api.transformVideosProgress(handleTrnasformVideosProgress);
  }, [videosTransformOption]);

  return (
    <>
      {contextHolder}
      <div className={styles['videos-container']}>
        <div className={styles['videos-container-setting']}>
          <div className={styles['videos-container-setting-item']}>
            <div className={styles['videos-container-setting-item-label']}>
              存储位置
            </div>
            <div className={styles['videos-container-setting-item-content']}>
              <Input
                value={videosTransformOption?.targetPath}
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
          <div className={styles['videos-container-setting-item']}>
            <div className={styles['videos-container-setting-item-label']}>
              存储格式
            </div>
            <div className={styles['videos-container-setting-item-content']}>
              <Select
                value={videosTransformOption?.targetFormat}
                placeholder="请选择存储格式"
                listHeight={130}
                placement="bottomLeft"
                className="w-full"
                onChange={handleFormatChange}
                options={VideosFormatOptions}
              />
            </div>
          </div>
          <div className={styles['videos-container-setting-item']}>
            <div className={styles['videos-container-setting-item-label']}>
              画质
            </div>
            <div className={styles['videos-container-setting-item-content']}>
              <Select
                value={videosTransformOption?.resolution}
                placeholder="请选择画质"
                listHeight={130}
                placement="bottomLeft"
                className="w-full"
                onChange={handleResolutionChange}
                options={VideosResolutionOptions}
              />
            </div>
          </div>
          <div className={styles['videos-container-setting-item']}>
            <div className={styles['videos-container-setting-item-label']}>
              帧率
            </div>
            <div className={styles['videos-container-setting-item-content']}>
              <Select
                value={videosTransformOption?.frameRate}
                placeholder="请选择帧率"
                listHeight={130}
                placement="bottomLeft"
                className="w-full"
                onChange={handleFrameRateChange}
                options={VideosFrameRateOptions}
              />
            </div>
          </div>
        </div>
        <div className={styles['videos-container-transform']}>
          <Upload
            action="#"
            showUploadList={false}
            accept="video/*"
            onChange={async (info) => {
              console.log('info: ', info);
              if (info.file.status === 'uploading') {
                setLoading(true);
              }
              if (info.file.status === 'done') {
                const { uid, originFileObj } = info.file;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { name, path } = originFileObj;
                const sourceVideos = videosTransformOption.sourceVideos;
                setVideosTransformOption({
                  ...videosTransformOption,
                  sourceVideos: [
                    ...sourceVideos,
                    {
                      uid: uid,
                      name: name,
                      path: path,
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
            <RiVideoAddFill
              className={styles['videos-container-transform-select']}
            />
          </Upload>
          <div className={styles['videos-container-transform-operate']}>
            <Button onClick={() => handleTransformVideosRun()}>开始转换</Button>
            <Button
              danger
              onClick={() =>
                setVideosTransformOption({
                  ...videosTransformOption,
                  sourceVideos: []
                })
              }
            >
              清空列表
            </Button>
          </div>
          <Skeleton active className="px-6 py-4" loading={loading}>
            <div className={styles['videos-container-transform-list']}>
              {videosTransformOption.sourceVideos.map((item, index) => (
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
                  className={styles['videos-container-transform-list-item']}
                >
                  <div
                    className={
                      styles['videos-container-transform-list-item-progress-bg']
                    }
                  ></div>
                  <div
                    className={
                      styles['videos-container-transform-list-item-progress']
                    }
                  >
                    <div
                      className={
                        styles[
                          'videos-container-transform-list-item-progress-number'
                        ]
                      }
                    >
                      {index + 1}
                    </div>
                    <div
                      className={
                        styles[
                          'videos-container-transform-list-item-progress-name'
                        ]
                      }
                    >
                      {item?.name}
                    </div>
                    <MdDeleteOutline
                      className={
                        styles['videos-container-transform-list-item-delete']
                      }
                      onClick={() => {
                        const sourceVideos = videosTransformOption.sourceVideos;
                        setVideosTransformOption({
                          ...videosTransformOption,
                          sourceVideos: sourceVideos.filter(
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
                            'videos-container-transform-list-item-infomation'
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
        </div>
      </div>
    </>
  );
};

export default Videos;
