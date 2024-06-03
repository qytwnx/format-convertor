import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppStateProps {
  isDark: boolean | undefined;
  isMaximized: boolean | undefined;
  setIsDark: (data: boolean) => boolean;
  setIsMaximized: (data: boolean) => boolean;
}

export default create<AppStateProps>()(
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
