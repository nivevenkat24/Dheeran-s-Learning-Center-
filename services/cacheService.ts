
import { LessonHistoryItem } from '../types';

// In-memory cache: Concept String -> LessonHistoryItem
const LESSON_CACHE = new Map<string, LessonHistoryItem>();

export const getCachedLesson = (conceptKey: string): LessonHistoryItem | undefined => {
  return LESSON_CACHE.get(conceptKey);
};

export const setCachedLesson = (conceptKey: string, item: LessonHistoryItem): void => {
  LESSON_CACHE.set(conceptKey, item);
  
  // Simple memory management: limit to 200 items to prevent crashes
  if (LESSON_CACHE.size > 200) {
    const firstKey = LESSON_CACHE.keys().next().value;
    if (firstKey) LESSON_CACHE.delete(firstKey);
  }
};

export const hasCachedLesson = (conceptKey: string): boolean => {
  return LESSON_CACHE.has(conceptKey);
};
