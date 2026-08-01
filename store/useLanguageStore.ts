import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/types/learning';

interface LanguageState {
  selectedLanguage: Language | null;
  hasHydrated: boolean;
  setSelectedLanguage: (language: Language) => void;
  clearSelectedLanguage: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      hasHydrated: false,
      setSelectedLanguage: (language: Language) =>
        set({ selectedLanguage: language }),
      clearSelectedLanguage: () => set({ selectedLanguage: null }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: 'user-language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
