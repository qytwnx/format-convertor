import styles from './index.module.less';

const Welcome = () => {
  return (
    <>
      <div className={styles['welcome-container']}>
        <div className={styles['welcome-container-title']}>
          欢迎使用格式转换器
        </div>
      </div>
    </>
  );
};

export default Welcome;
