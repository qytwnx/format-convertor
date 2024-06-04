import { Tag } from 'antd';
import styles from './index.module.less';

const Welcome = () => {
  return (
    <>
      <div className={styles['welcome-container']}>
        <div className={styles['welcome-container-title']}>
          欢迎使用格式转换器
        </div>
        <div className={styles['welcome-container-description']}>
          本工具可以帮助您将图片、视频、音频等文件转换为其他格式
        </div>
        <div className={styles['welcome-container-tags']}>
          <Tag color="#108ee9">图片转换</Tag>
          <Tag color="#87d568">视频转换</Tag>
          <Tag color="#f50f50">音频转换</Tag>
        </div>
        <div className={styles['welcome-container-line']} />
        <div className={styles['welcome-container-function']}>
          <div className={styles['welcome-container-function-item']}>
            <div className={styles['welcome-container-function-item-title']}>
              图片转换
            </div>
            <div
              className={styles['welcome-container-function-item-description']}
            >
              支持将图片转换为其他格式
            </div>
            <div className={styles['welcome-container-function-item-accept']}>
              <Tag color="#108ee9">JPG</Tag>
              <Tag color="#108ee9">PNG</Tag>
              <Tag color="#108ee9">GIF</Tag>
              <Tag color="#108ee9">WEBP</Tag>
              <Tag color="#108ee9">TIFF</Tag>
              <Tag color="#108ee9">BMP</Tag>
            </div>
          </div>
          <div className={styles['welcome-container-function-item']}>
            <div className={styles['welcome-container-function-item-title']}>
              视频转换
            </div>
            <div
              className={styles['welcome-container-function-item-description']}
            >
              支持将视频转换为其他格式
            </div>
            <div className={styles['welcome-container-function-item-accept']}>
              <Tag color="#87d568">MOV</Tag>
              <Tag color="#87d568">MP4</Tag>
            </div>
          </div>
          <div className={styles['welcome-container-function-item']}>
            <div className={styles['welcome-container-function-item-title']}>
              音频转换
            </div>
            <div
              className={styles['welcome-container-function-item-description']}
            >
              支持将音频转换为其他格式
            </div>
            <div className={styles['welcome-container-function-item-accept']}>
              <Tag color="#f50f50">MP3</Tag>
              <Tag color="#f50f50">WAV</Tag>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
