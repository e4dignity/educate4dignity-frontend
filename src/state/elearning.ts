import { selector } from 'recoil';
import { listLessons, LessonSummary as LocalLessonSummary } from '../data/elearning';

export type LessonListItem = LocalLessonSummary;

// API-first lessons list; falls back to local dataset with current filters applied upstream
export const elearnBaseListSelector = selector<LessonListItem[]>({
  key: 'elearnBaseListSelector',
  get: async () => {
    // Use local dataset until API is implemented; this avoids missing-module build errors
    return listLessons({ q: '', page: 1, pageSize: 999 }).items;
  },
});
