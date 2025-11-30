
export enum LessonTopic {
  NUMBERS = 'Numbers (1-20)',
  ALPHABET = 'Alphabet Letters',
  COLORS = 'Natural Colors',
  FRUITS = 'Real Fruits',
  VEGETABLES = 'Real Vegetables',
  FARM_ANIMALS = 'Farm Animals',
  WILD_ANIMALS = 'Wild Animals',
  SHAPES = 'Shapes',
  OBJECTS = 'Everyday Objects',
}

export interface LessonHistoryItem {
  id: string;
  concept: string;
  questionText: string;
  imageSrc: string;
  questionAudio: string | null;
}

export interface LessonState {
  currentQuestionIndex: number;
  topic: LessonTopic | null;
  isLoading: boolean;
  isPlayingAudio: boolean;
  currentImage: string | null;
  currentQuestionText: string | null;
  currentConcept: string | null; // e.g., "Apple" or "5"
  history: LessonHistoryItem[];
}

export interface GenerationResult {
  concept: string;
  question: string;
  imagePrompt: string;
}

export interface FeedbackResult {
  isCorrect: boolean;
  text: string;
}