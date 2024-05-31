import { Button, Input, Select, Upload, UploadFile } from 'antd';
import styles from './index.module.less';
import { useState } from 'react';
import { ImagesFormatOptions } from '@renderer/constants/options';
import { MdAddPhotoAlternate } from 'react-icons/md';

const Images = () => {
  const [imageTransformOption, setImageTransformOption] =
    useState<ImageTransformOptionModel>({});
  // const [sourceImages, setSourceImages] = useState<Array<ImagesModel>>([]);
  const [sourceImages, setSourceImages] = useState<UploadFile[]>([]);

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

  const handleFormatChange = (value: string) => {
    setImageTransformOption({ ...imageTransformOption, targetFormat: value });
  };

  return (
    <>
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
            multiple
            showUploadList={false}
            fileList={sourceImages}
            beforeUpload={(file, fileList) => {
              console.log(file, fileList);
              setSourceImages([...sourceImages, ...fileList]);
              return false;
            }}
          >
            <MdAddPhotoAlternate
              className={styles['images-container-transform-select']}
            />
          </Upload>

          <div className={styles['images-container-transform-operate']}>
            <Button
              onClick={() => {
                console.log(sourceImages);
              }}
            >
              开始转换
            </Button>
            <Button danger onClick={() => setSourceImages([])}>
              清空列表
            </Button>
          </div>
          <div className={styles['images-container-transform-list']}>
            {sourceImages.map((item, index) => (
              <div key={index}>
                <div>{item?.name}</div>
                <img src={`${item?.url}`} alt="img" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Images;
