import { Language } from '../types/learning';

export const LANGUAGES: Language[] = [
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: 'https://flagcdn.com/w20/es.png',
    code: 'es',
    isPopular: true,
    learnersCount: '28.4M learners',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: 'https://flagcdn.com/w20/fr.png',
    code: 'fr',
    isPopular: true,
    learnersCount: '19.4M learners',
  },
  {
    id: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: 'https://flagcdn.com/w20/de.png',
    code: 'de',
    isPopular: true,
    learnersCount: '8.1M learners',
  },
  {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: 'https://flagcdn.com/w20/jp.png',
    code: 'ja',
    isPopular: true,
    learnersCount: '12.7M learners',
  },
];

export const getLanguageById = (id: string): Language | undefined => {
  return LANGUAGES.find((lang) => lang.id === id);
};
