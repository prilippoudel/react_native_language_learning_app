import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/types/learning';

const webStorage = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return Promise.resolve(window.localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

const storageProvider = Platform.OS === 'web' ? webStorage : AsyncStorage;

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
      storage: createJSONStorage(() => storageProvider),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
