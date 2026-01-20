export type ArticleStatus = 'draft' | 'published';

export interface AdminArticle {
  id: string; // uuid-like
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  coverUrl?: string;
  body_paragraphs: string[]; // fallback when rich editor fails
  status: ArticleStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

const STORAGE_KEY = 'e4d.blog.admin.articles';

function readStore(): AdminArticle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as AdminArticle[];
  } catch {}
  return [];
}

function writeStore(items: AdminArticle[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function listArticles(): AdminArticle[] {
  return readStore().sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getArticle(slug: string): AdminArticle | undefined {
  return readStore().find(a => a.slug === slug);
}

export function upsertArticle(article: AdminArticle): AdminArticle {
  const items = readStore();
  const idx = items.findIndex(a => a.id === article.id || a.slug === article.slug);
  const now = new Date().toISOString();
  article.updatedAt = now;
  if (!article.createdAt) article.createdAt = now;
  if (idx >= 0) { items[idx] = article; } else { items.push(article); }
  writeStore(items);
  return article;
}

export function deleteArticle(slug: string): boolean {
  const items = readStore();
  const next = items.filter(a => a.slug !== slug);
  writeStore(next);
  return next.length !== items.length;
}

export function generateId(): string {
  return 'a-' + Math.random().toString(36).slice(2,8) + '-' + Date.now().toString(36);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const BLOG_CATEGORIES = [
  'impact', 'research', 'insights', 'stories'
];
