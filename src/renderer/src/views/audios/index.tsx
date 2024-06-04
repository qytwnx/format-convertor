import { Button, Input, Select, Skeleton, Upload, message } from 'antd';
import styles from './index.module.less';
import { useEffect, useState } from 'react';
import { AudiosFormatOptions } from '@renderer/constants/options';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineAddAlert } from 'react-icons/md';
import {
  ProgressStatusEnum,
  TransformStatusEnum
} from '@renderer/enums/common';
import { useTransformAudiosStore } from '@renderer/store';
import { handleGetTransformBackgroundColor } from '@renderer/utils/transform';

const Audios = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [audiosTransformOption, setAudiosTransformOption] =
    useTransformAudiosStore((state) => [
      state.audiosOptions,
      state.setAudiosOptions
    ]);
  const [currentProgressInfo, setCurrentProgressInfo] =
    useState<ProgressModel<AudiosModel>>();

  const handleChooseTargetPath = async () => {
    const res = await window.api.chooseDirectory();
    if (res !== undefined && res instanceof Array && res.length > 0) {
      const targetPath = String(res[0]);
      setAudiosTransformOption({
        ...audiosTransformOption,
        targetPath: targetPath
      });
    }
  };

  const handleTrnasformAudiosProgress = (
    params: ProgressModel<AudiosModel>
  ) => {
    setCurrentProgressInfo(params);
    const { file, progressStatus, data } = params;
    const sourceAudios = audiosTransformOption.sourceAudios;
    const audioIndex = sourceAudios.findIndex((item) => item.uid == file.uid);
    if (audioIndex === -1) {
      return;
    }
    switch (progressStatus) {
      case ProgressStatusEnum.IN_PROGRESS:
        if (typeof data === 'number') {
          sourceAudios[audioIndex].progress = data;
          sourceAudios[audioIndex].status = TransformStatusEnum.IN_PROGRESS;
          setAudiosTransformOption({ ...audiosTransformOption, sourceAudios });
        }
        break;
      case ProgressStatusEnum.END:
        sourceAudios[audioIndex].progress = 100;
        sourceAudios[audioIndex].status = TransformStatusEnum.FINISH;
        setAudiosTransformOption({
          ...audiosTransformOption,
          sourceAudios: sourceAudios
        });
        break;
      case ProgressStatusEnum.DIREDCTORY_CHECK:
        if (!data) {
          sourceAudios[audioIndex].status = TransformStatusEnum.ERROR;
          sourceAudios[audioIndex].progress = 100;
          setAudiosTransformOption({
            ...audiosTransformOption,
            sourceAudios: sourceAudios
          });
        }
        break;
      case ProgressStatusEnum.FILE_CHECK:
        if (!data) {
          sourceAudios[audioIndex].status = TransformStatusEnum.ERROR;
          sourceAudios[audioIndex].progress = 100;
          setAudiosTransformOption({
            ...audiosTransformOption,
            sourceAudios: sourceAudios
          });
        }
        break;
      case ProgressStatusEnum.ERROR:
        if (!data) {
          sourceAudios[audioIndex].status = TransformStatusEnum.ERROR;
          sourceAudios[audioIndex].progress = 100;
          setAudiosTransformOption({
            ...audiosTransformOption,
            sourceAudios: sourceAudios
          });
        }
        break;
    }
  };

  const handleFormatChange = (value: AudiosFormat) => {
    setAudiosTransformOption({ ...audiosTransformOption, targetFormat: value });
  };

  const handleTransformAudiosRun = () => {
    if (!audiosTransformOption.targetPath) {
      messageApi.error('请选择存储位置');
      return;
    }
    if (!audiosTransformOption.targetFormat) {
      messageApi.error('请选择存储格式');
      return;
    }
    if (audiosTransformOption.sourceAudios.length === 0) {
      messageApi.error('请选择音频');
      return;
    }
    const sourceAudios = audiosTransformOption.sourceAudios.filter(
      (filter) => filter.status === TransformStatusEnum.READAY
    );
    if (sourceAudios.length === 0) {
      messageApi.error('请选择音频');
      return;
    }
    window.api.transformAudiosRun({
      ...audiosTransformOption,
      sourceAudios: sourceAudios
    });
  };

  useEffect(() => {
    window.api.transformAudiosProgress(handleTrnasformAudiosProgress);
  }, [audiosTransformOption]);

  return (
    <>
      {contextHolder}
      <div className={styles['audios-container']}>
        <div className={styles['audios-container-setting']}>
          <div className={styles['audios-container-setting-item']}>
            <div className={styles['audios-container-setting-item-label']}>
              存储位置
            </div>
            <div className={styles['audios-container-setting-item-content']}>
              <Input
                value={audiosTransformOption?.targetPath}
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
          <div className={styles['audios-container-setting-item']}>
            <div className={styles['audios-container-setting-item-label']}>
              存储格式
            </div>
            <div className={styles['audios-container-setting-item-content']}>
              <Select
                value={audiosTransformOption?.targetFormat}
                placeholder="请选择存储格式"
                listHeight={130}
                placement="bottomLeft"
                className="w-full"
                onChange={handleFormatChange}
                options={AudiosFormatOptions}
              />
            </div>
          </div>
        </div>
        <div className={styles['audios-container-transform']}>
          <Upload
            action="#"
            showUploadList={false}
            accept="audio/*"
            onChange={async (info) => {
              if (info.file.status === 'uploading') {
                setLoading(true);
              }
              if (info.file.status === 'done') {
                const { uid, originFileObj } = info.file;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { name, path } = originFileObj;
                const sourceAudios = audiosTransformOption.sourceAudios;
                setAudiosTransformOption({
                  ...audiosTransformOption,
                  sourceAudios: [
                    ...sourceAudios,
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
            <MdOutlineAddAlert
              className={styles['audios-container-transform-select']}
            />
          </Upload>
          <div className={styles['audios-container-transform-operate']}>
            <Button onClick={() => handleTransformAudiosRun()}>开始转换</Button>
            <Button
              danger
              onClick={() =>
                setAudiosTransformOption({
                  ...audiosTransformOption,
                  sourceAudios: []
                })
              }
            >
              清空列表
            </Button>
          </div>
          <Skeleton active className="px-6 py-4" loading={loading}>
            <div className={styles['audios-container-transform-list']}>
              {audiosTransformOption.sourceAudios.map((item, index) => (
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
                  className={styles['audios-container-transform-list-item']}
                >
                  <div
                    className={
                      styles['audios-container-transform-list-item-progress-bg']
                    }
                  ></div>
                  <div
                    className={
                      styles['audios-container-transform-list-item-progress']
                    }
                  >
                    <div
                      className={
                        styles[
                          'audios-container-transform-list-item-progress-number'
                        ]
                      }
                    >
                      {index + 1}
                    </div>
                    <div
                      className={
                        styles[
                          'audios-container-transform-list-item-progress-name'
                        ]
                      }
                    >
                      {item?.name}
                    </div>
                    <MdDeleteOutline
                      className={
                        styles['audios-container-transform-list-item-delete']
                      }
                      onClick={() => {
                        const sourceAudios = audiosTransformOption.sourceAudios;
                        setAudiosTransformOption({
                          ...audiosTransformOption,
                          sourceAudios: sourceAudios.filter(
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
                            'audios-container-transform-list-item-infomation'
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

export default Audios;
