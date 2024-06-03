import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppStateProps {
  isDark: boolean | undefined;
  isMaximized: boolean | undefined;
  setIsDark: (data: boolean) => boolean;
  setIsMaximized: (data: boolean) => boolean;
}

export const useAppStore = create<AppStateProps>()(
  persist(
    (set) => ({
      isDark: undefined,
      isMaximized: undefined,
      setIsDark: (data) => {
        set({ isDark: data });
        return data;
      },
      setIsMaximized: (data) => {
        set({ isMaximized: data });
        return data;
      }
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

interface TransformImagesStateProps {
  imagesOptions: ImageTransformOptionModel;
  setImagesOptions: (
    data: ImageTransformOptionModel
  ) => ImageTransformOptionModel;
}

export const useTransformImagesStore = create<TransformImagesStateProps>()(
  persist(
    (set) => ({
      imagesOptions: { targetFormat: 'png', targetPath: '', sourceImages: [] },
      setImagesOptions: (data) => {
        set({ imagesOptions: data });
        return data;
      }
    }),
    {
      name: 'transform-images-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
