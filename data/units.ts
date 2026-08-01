import { Unit } from '../types/learning';
import { LESSONS } from './lessons';

export const UNITS: Unit[] = [
  {
    id: 'unit-es-1',
    languageId: 'es',
    number: 1,
    title: 'Basics & Greetings',
    description: 'Learn basic greetings, introducing yourself, and essential words in Spanish.',
    color: '#58CC02',
    lessons: LESSONS.filter((lesson) => lesson.unitId === 'unit-es-1'),
  },
  {
    id: 'unit-es-2',
    languageId: 'es',
    number: 2,
    title: 'Food & Ordering',
    description: 'Learn vocabulary for common food, drinks, and restaurant expressions.',
    color: '#FFC800',
    lessons: LESSONS.filter((lesson) => lesson.unitId === 'unit-es-2'),
  },
  {
    id: 'unit-fr-1',
    languageId: 'fr',
    number: 1,
    title: 'Basics & Greetings',
    description: 'Learn basic French greetings and introductions.',
    color: '#1CB0F6',
    lessons: LESSONS.filter((lesson) => lesson.unitId === 'unit-fr-1'),
  },
  {
    id: 'unit-de-1',
    languageId: 'de',
    number: 1,
    title: 'Basics & Greetings',
    description: 'Master essential German greetings and simple phrases.',
    color: '#FF9600',
    lessons: LESSONS.filter((lesson) => lesson.unitId === 'unit-de-1'),
  },
  {
    id: 'unit-ja-1',
    languageId: 'ja',
    number: 1,
    title: 'Greetings & Essentials',
    description: 'Basic Japanese greetings and politeness markers.',
    color: '#CE82FF',
    lessons: LESSONS.filter((lesson) => lesson.unitId === 'unit-ja-1'),
  },
];

export const getUnitsByLanguage = (languageId: string): Unit[] => {
  return UNITS.map((unit) => ({
    ...unit,
    lessons: LESSONS.filter((lesson) => lesson.unitId === unit.id),
  })).filter((unit) => unit.languageId === languageId);
};
