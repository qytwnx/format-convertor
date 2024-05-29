import styles from './index.module.less';
import { FaGithub } from 'react-icons/fa';
import { MdBrightnessHigh, MdBrightness4 } from 'react-icons/md';
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose
} from 'react-icons/vsc';
import LogoSvg from '@renderer/assets/images/logo.svg';
import { useAppStore } from '@renderer/store';

const Header = () => {
  const [isDark, setIsDark] = useAppStore((state) => [
    state.isDark,
    state.setIsDark
  ]);
  const [isMaximized, setIsMaximized] = useAppStore((state) => [
    state.isMaximized,
    state.setIsMaximized
  ]);

  const handleLoadIsMaximized = async () => {
    const isMaximized = await window.api.mainWindowCustomMaximizeStatus();
    setIsMaximized(isMaximized);
  };

  const handleThemeDarkToggle = async (mode: 'light' | 'dark') => {
    const status = await window.api.themeDarkToggle(mode);
    setIsDark(status);
  };

  return (
    <>
      <header className={styles['header-container']}>
        <div className={styles['header-container-logo']}>
          <img
            src={LogoSvg}
            alt="logo"
            className={styles['header-container-logo-image']}
          />
          <div className={styles['header-container-logo-title']}>
            格式转换器
          </div>
        </div>
        <div className={styles['header-container-operate']}>
          <FaGithub
            className={styles['header-container-operate-item']}
            onClick={() => window.api.openExternal('https://github.com/qytwnx')}
          />
          {isDark ? (
            <MdBrightnessHigh
              className={styles['header-container-operate-item']}
              onClick={() => handleThemeDarkToggle('light')}
            />
          ) : (
            <MdBrightness4
              className={styles['header-container-operate-item']}
              onClick={() => handleThemeDarkToggle('dark')}
            />
          )}
          <VscChromeMinimize
            className={styles['header-container-operate-item']}
            onClick={() => window.api.mainWindowCustomMinimize()}
          />
          {isMaximized ? (
            <VscChromeRestore
              className={styles['header-container-operate-item']}
              onClick={() => {
                window.api.mainWindowCustomUnmaximize();
                handleLoadIsMaximized();
              }}
            />
          ) : (
            <VscChromeMaximize
              className={styles['header-container-operate-item']}
              onClick={() => {
                window.api.mainWindowCustomMaximize();
                handleLoadIsMaximized();
              }}
            />
          )}
          <VscChromeClose
            className={styles['header-container-operate-item']}
            onClick={() => window.api.mainWindowCustomClose()}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
