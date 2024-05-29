import '@renderer/assets/styles/main.less';
import ReactDOM from 'react-dom/client';
import router from '@renderer/router';
import { RouterProvider } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
