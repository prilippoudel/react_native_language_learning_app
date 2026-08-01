export type LanguageId = 'es' | 'fr' | 'de' | 'ja' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP' | string;

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
  isPopular?: boolean;
  learnersCount?: string;
}

export type ActivityType =
  | 'multiple_choice'
  | 'translate'
  | 'match'
  | 'listen'
  | 'speak'
  | 'vision_agent';

export interface MultipleChoiceOption {
  id: string;
  text: string;
  translation?: string;
  isCorrect: boolean;
  audioUrl?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic?: string;
  translation: string;
  partOfSpeech?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface PhraseItem {
  id: string;
  original: string;
  translation: string;
  audioUrl?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  instructions?: string;
  options?: MultipleChoiceOption[];
  correctAnswer?: string | string[];
  vocabulary?: VocabularyItem[];
  phrase?: PhraseItem;
  pairs?: { item: string; match: string }[];
  audioUrl?: string;
  prompt?: string;
}

export interface AITeacherPrompt {
  systemPrompt: string;
  initialMessage: string;
  personaName: string;
  targetLanguage: string;
  topics: string[];
  suggestedPhrases?: string[];
}

export interface LessonGoal {
  id: string;
  description: string;
  isCompleted?: boolean;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  activities: Activity[];
  aiTeacherPrompt?: AITeacherPrompt;
}

export interface Unit {
  id: string;
  languageId: string;
  number: number;
  title: string;
  description: string;
  color: string;
  lessons: Lesson[];
}
