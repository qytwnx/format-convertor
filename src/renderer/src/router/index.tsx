import App from '@renderer/App';
import { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import Home from '@renderer/layout/home';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
        children: [
          {
            index: true,
            Component: lazy(() => import('@renderer/views/welcome'))
          },
          {
            path: 'images',
            Component: lazy(() => import('@renderer/views/images'))
          },
          {
            path: 'videos',
            Component: lazy(() => import('@renderer/views/videos'))
          },
          {
            path: 'audios',
            Component: lazy(() => import('@renderer/views/audios'))
          }
        ]
      }
    ]
  }
]);
export default router;
