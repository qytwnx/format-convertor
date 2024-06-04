import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TransformAudiosStateProps {
  audiosOptions: AudiosTransformOptionModel;
  setAudiosOptions: (
    data: AudiosTransformOptionModel
  ) => AudiosTransformOptionModel;
}

export default create<TransformAudiosStateProps>()(
  persist(
    (set) => ({
      audiosOptions: { targetFormat: 'mp3', targetPath: '', sourceAudios: [] },
      setAudiosOptions: (data) => {
        set({ audiosOptions: data });
        return data;
      }
    }),
    {
      name: 'transform-audios-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
