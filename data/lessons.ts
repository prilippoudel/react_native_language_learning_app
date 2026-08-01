import { Lesson } from '../types/learning';

export const LESSONS: Lesson[] = [
  // Spanish Unit 1 Lessons
  {
    id: 'lesson-es-1-1',
    unitId: 'unit-es-1',
    title: 'Basic Greetings',
    description: 'Learn how to say hello and goodbye in Spanish.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { id: 'g1', description: 'Say hello and goodbye' },
      { id: 'g2', description: 'Ask how someone is doing' },
    ],
    vocabulary: [
      { id: 'v1', word: 'Hola', phonetic: 'OH-lah', translation: 'Hello', partOfSpeech: 'interjection' },
      { id: 'v2', word: 'Adiós', phonetic: 'ah-DYOHSS', translation: 'Goodbye', partOfSpeech: 'interjection' },
      { id: 'v3', word: 'Buenos días', phonetic: 'BWAY-nohss DEE-ahss', translation: 'Good morning', partOfSpeech: 'phrase' },
    ],
    phrases: [
      { id: 'p1', original: '¡Hola! ¿Cómo estás?', translation: 'Hello! How are you?' },
      { id: 'p2', original: 'Hasta luego', translation: 'See you later' },
    ],
    activities: [
      {
        id: 'a1',
        type: 'multiple_choice',
        question: 'How do you say "Hello" in Spanish?',
        options: [
          { id: 'o1', text: 'Hola', isCorrect: true },
          { id: 'o2', text: 'Adiós', isCorrect: false },
          { id: 'o3', text: 'Gracias', isCorrect: false },
        ],
      },
      {
        id: 'a2',
        type: 'translate',
        question: 'Translate: "Good morning"',
        correctAnswer: 'Buenos días',
      },
      {
        id: 'a3',
        type: 'match',
        question: 'Match the words with their meanings',
        pairs: [
          { item: 'Hola', match: 'Hello' },
          { item: 'Adiós', match: 'Goodbye' },
          { item: 'Gracias', match: 'Thank you' },
        ],
      },
      {
        id: 'a4',
        type: 'vision_agent',
        question: 'Practice greetings with your AI tutor',
        prompt: 'Interactive speaking practice: Greet the AI teacher in Spanish.',
      },
    ],
    aiTeacherPrompt: {
      personaName: 'Sofia',
      targetLanguage: 'Spanish',
      systemPrompt: 'You are Sofia, a friendly Spanish teacher. Practice basic greetings like "Hola" and "Buenos días" with the student. Keep explanations simple and encouraging.',
      initialMessage: '¡Hola! Soy Sofia. ¿Cómo estás hoy?',
      topics: ['greetings', 'introductions', 'basic courtesy'],
      suggestedPhrases: ['¡Hola!', 'Buenos días', 'Estoy bien, gracias'],
    },
  },
  {
    id: 'lesson-es-1-2',
    unitId: 'unit-es-1',
    title: 'Introducing Yourself',
    description: 'Learn to say your name and where you are from.',
    order: 2,
    xpReward: 15,
    estimatedMinutes: 4,
    goals: [
      { id: 'g1', description: 'State your name in Spanish' },
      { id: 'g2', description: 'Ask someone their name' },
    ],
    vocabulary: [
      { id: 'v4', word: 'Me llamo', phonetic: 'meh YAH-moh', translation: 'My name is', partOfSpeech: 'phrase' },
      { id: 'v5', word: 'Mucho gusto', phonetic: 'MOO-choh GOO-stoh', translation: 'Nice to meet you', partOfSpeech: 'phrase' },
    ],
    phrases: [
      { id: 'p3', original: '¿Cómo te llamas?', translation: 'What is your name?' },
      { id: 'p4', original: 'Me llamo Alex. Mucho gusto.', translation: 'My name is Alex. Nice to meet you.' },
    ],
    activities: [
      {
        id: 'a5',
        type: 'multiple_choice',
        question: 'What does "Mucho gusto" mean?',
        options: [
          { id: 'o4', text: 'Nice to meet you', isCorrect: true },
          { id: 'o5', text: 'See you tomorrow', isCorrect: false },
          { id: 'o6', text: 'You are welcome', isCorrect: false },
        ],
      },
      {
        id: 'a6',
        type: 'translate',
        question: 'Translate: "My name is Sofia"',
        correctAnswer: 'Me llamo Sofia',
      },
    ],
    aiTeacherPrompt: {
      personaName: 'Sofia',
      targetLanguage: 'Spanish',
      systemPrompt: 'You are Sofia, a friendly Spanish teacher. Help the student introduce themselves and ask for your name.',
      initialMessage: '¡Hola! Me llamo Sofia. ¿Cómo te llamas tú?',
      topics: ['self-introduction', 'names'],
      suggestedPhrases: ['Me llamo...', 'Mucho gusto'],
    },
  },
  // Spanish Unit 2 Lessons
  {
    id: 'lesson-es-2-1',
    unitId: 'unit-es-2',
    title: 'Ordering Food',
    description: 'Learn vocabulary for ordering meals and drinks.',
    order: 1,
    xpReward: 15,
    estimatedMinutes: 4,
    goals: [
      { id: 'g1', description: 'Order water or coffee' },
      { id: 'g2', description: 'Say please and thank you in a restaurant' },
    ],
    vocabulary: [
      { id: 'v6', word: 'Agua', phonetic: 'AH-gwah', translation: 'Water', partOfSpeech: 'noun' },
      { id: 'v7', word: 'Café', phonetic: 'kah-FAY', translation: 'Coffee', partOfSpeech: 'noun' },
      { id: 'v8', word: 'Por favor', phonetic: 'por fah-BOR', translation: 'Please', partOfSpeech: 'phrase' },
    ],
    phrases: [
      { id: 'p5', original: 'Un café, por favor.', translation: 'A coffee, please.' },
    ],
    activities: [
      {
        id: 'a7',
        type: 'multiple_choice',
        question: 'How do you say "Water"?',
        options: [
          { id: 'o7', text: 'Agua', isCorrect: true },
          { id: 'o8', text: 'Leche', isCorrect: false },
          { id: 'o9', text: 'Jugo', isCorrect: false },
        ],
      },
    ],
    aiTeacherPrompt: {
      personaName: 'Mateo',
      targetLanguage: 'Spanish',
      systemPrompt: 'You are Mateo, a waiter at a café in Madrid. Take the student order in Spanish.',
      initialMessage: '¡Hola! Bienvenido al café. ¿Qué te gustaría tomar?',
      topics: ['ordering food', 'café conversation'],
      suggestedPhrases: ['Un café, por favor', 'Agua, por favor', 'Gracias'],
    },
  },
  // French Unit 1 Lessons
  {
    id: 'lesson-fr-1-1',
    unitId: 'unit-fr-1',
    title: 'Bonjour & Basic Words',
    description: 'Start learning French with basic greetings.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [{ id: 'g1', description: 'Greet someone in French' }],
    vocabulary: [
      { id: 'v9', word: 'Bonjour', phonetic: 'bohn-ZHOOR', translation: 'Hello / Good morning', partOfSpeech: 'interjection' },
      { id: 'v10', word: 'Merci', phonetic: 'mair-SEE', translation: 'Thank you', partOfSpeech: 'interjection' },
    ],
    phrases: [
      { id: 'p6', original: 'Bonjour, comment ça va ?', translation: 'Hello, how are you?' },
    ],
    activities: [
      {
        id: 'a8',
        type: 'multiple_choice',
        question: 'What does "Bonjour" mean?',
        options: [
          { id: 'o10', text: 'Hello', isCorrect: true },
          { id: 'o11', text: 'Goodbye', isCorrect: false },
        ],
      },
    ],
    aiTeacherPrompt: {
      personaName: 'Pierre',
      targetLanguage: 'French',
      systemPrompt: 'You are Pierre, a French tutor from Paris. Practice basic greetings in French.',
      initialMessage: 'Bonjour ! Comment ça va ?',
      topics: ['greetings', 'politeness'],
      suggestedPhrases: ['Bonjour !', 'Ça va bien', 'Merci'],
    },
  },
  // German Unit 1 Lessons
  {
    id: 'lesson-de-1-1',
    unitId: 'unit-de-1',
    title: 'Guten Tag & Greetings',
    description: 'Learn essential German greetings.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [{ id: 'g1', description: 'Greet someone in German' }],
    vocabulary: [
      { id: 'v11', word: 'Hallo', translation: 'Hello', partOfSpeech: 'interjection' },
      { id: 'v12', word: 'Tschüss', translation: 'Goodbye', partOfSpeech: 'interjection' },
    ],
    phrases: [
      { id: 'p7', original: 'Hallo, wie gehts?', translation: 'Hello, how are you?' },
    ],
    activities: [
      {
        id: 'a9',
        type: 'translate',
        question: 'Translate: "Hello"',
        correctAnswer: 'Hallo',
      },
    ],
  },
  // Japanese Unit 1 Lessons
  {
    id: 'lesson-ja-1-1',
    unitId: 'unit-ja-1',
    title: 'Konnichiwa & Courtesy',
    description: 'Essential Japanese greetings.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [{ id: 'g1', description: 'Greet people politely in Japanese' }],
    vocabulary: [
      { id: 'v13', word: 'こんにちは (Konnichiwa)', translation: 'Hello / Good afternoon', partOfSpeech: 'interjection' },
      { id: 'v14', word: 'ありがとう (Arigatou)', translation: 'Thank you', partOfSpeech: 'interjection' },
    ],
    phrases: [
      { id: 'p8', original: 'こんにちは！お元気ですか？', translation: 'Hello! How are you?' },
    ],
    activities: [
      {
        id: 'a10',
        type: 'multiple_choice',
        question: 'Which word means "Thank you"?',
        options: [
          { id: 'o12', text: 'ありがとう (Arigatou)', isCorrect: true },
          { id: 'o13', text: 'さようなら (Sayounara)', isCorrect: false },
        ],
      },
    ],
  },
];

export const getLessonById = (id: string): Lesson | undefined => {
  return LESSONS.find((lesson) => lesson.id === id);
};
