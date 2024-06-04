import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TransformImagesStateProps {
  imagesOptions: ImagesTransformOptionModel;
  setImagesOptions: (
    data: ImagesTransformOptionModel
  ) => ImagesTransformOptionModel;
}

export default create<TransformImagesStateProps>()(
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
