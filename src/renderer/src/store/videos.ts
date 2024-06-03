import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TransformVideosStateProps {
  videosOptions: VideosTransformOptionModel;
  setVideosOptions: (
    data: VideosTransformOptionModel
  ) => VideosTransformOptionModel;
}

export default create<TransformVideosStateProps>()(
  persist(
    (set) => ({
      videosOptions: {
        targetFormat: 'mov',
        targetPath: '',
        resolution: '1920x1080',
        frameRate: 30,
        sourceVideos: []
      },
      setVideosOptions: (data) => {
        set({ videosOptions: data });
        return data;
      }
    }),
    {
      name: 'transform-videos-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
