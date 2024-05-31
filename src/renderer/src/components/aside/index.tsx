import styles from './index.module.less';
import { FaRegImages } from 'react-icons/fa';
import { MdVideoLibrary, MdAudioFile } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const Aside = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuList: Array<MenuItemModel> = [
    {
      id: '1',
      key: '/images',
      name: '图片转换',
      icon: <FaRegImages />
    },
    {
      id: '2',
      key: '/videos',
      name: '视频转换',
      icon: <MdVideoLibrary />
    },
    {
      id: '3',
      key: '/audios',
      name: '音频转换',
      icon: <MdAudioFile />
    }
  ];

  return (
    <>
      <div className={styles['aside-container']}>
        <nav className={styles['aside-container-menu']}>
          {menuList.map((item, index) => (
            <div
              className={[
                styles['aside-container-menu-item'],
                location.pathname === item.key ? styles['active'] : ''
              ].join(' ')}
              key={index}
              onClick={() => navigate(item.key!, { replace: true })}
            >
              <div title={item?.name}>{item?.icon}</div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Aside;
