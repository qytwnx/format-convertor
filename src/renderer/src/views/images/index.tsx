import styles from './index.module.less';

const Images = () => {
  return (
    <>
      <div className={styles['images-container']}>
        <div className={styles['images-container-setting']}>设置</div>
        <div className={styles['images-container-transform']}>转换</div>
      </div>
    </>
  );
};

export default Images;
