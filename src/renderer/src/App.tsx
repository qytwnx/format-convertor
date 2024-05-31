import { useAppStore } from '@renderer/store';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PageLoading from '@renderer/components/page-loading';
import { ConfigProvider, theme } from 'antd';

const App = () => {
  const [isDark, setIsDark] = useAppStore((state) => [
    state.isDark,
    state.setIsDark
  ]);
  const [isMaximized, setIsMaximized] = useAppStore((state) => [
    state.isMaximized,
    state.setIsMaximized
  ]);

  const handleLoadThemeDarkStatus = async () => {
    if (isDark !== undefined) {
      window.api.themeDarkToggle(isDark ? 'dark' : 'light');
      return;
    }
    const status = await window.api.themeDarkStatus();
    setIsDark(status);
  };

  const handleLoadMaximizedStatus = async () => {
    if (isMaximized === undefined) {
      const status = await window.api.mainWindowCustomMaximizeStatus();
      setIsMaximized(status);
      return;
    }
    if (isMaximized) {
      window.api.mainWindowCustomMaximize();
      return;
    }
    if (!isMaximized) {
      window.api.mainWindowCustomUnmaximize();
      return;
    }
  };

  useEffect(() => {
    handleLoadThemeDarkStatus();
    handleLoadMaximizedStatus();
  }, []);
  return (
    <>
      <div className="w-screen h-screen">
        <ConfigProvider
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
          }}
        >
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </ConfigProvider>
      </div>
    </>
  );
};

export default App;
