import Aside from '@renderer/components/aside';
import Header from '@renderer/components/header';
import Footer from '@renderer/components/footer';
import PageLoading from '@renderer/components/page-loading';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="h-full w-full">
        <Header />
        <div className="flex h-[calc(100vh-113px)]">
          <Aside />
          <div className="p-3 w-full flex-1">
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
