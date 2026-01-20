// Minimal in-memory e-learning store used by src/data/elearning.ts
// Exposes list() and get(slug) for public lessons added by admins (optional).

export interface LessonRecord {
  slug: string;
  title: string;
  summary: string;
  level: 'Beginner'|'Intermediate'|'Advanced';
  duration_minutes: number;
  tags?: string[];
  topic?: string;
  cover_image_url?: string | null;
  published_at?: string; // ISO when published
  updated_at?: string;
  status: 'draft'|'published';
  body_html?: string; // simple HTML body used in detail view
}

const lessons: LessonRecord[] = [];

function list(): LessonRecord[] {
  return lessons.slice();
}

function get(slug: string): LessonRecord | undefined {
  return lessons.find(l => l.slug === slug);
}

export const elearningStore = { list, get };
