import { BlogArticle } from '../types/blog';

// Blogs are now served from the API backend - no more mock data
export const blogArticles: BlogArticle[] = [];

export function findArticleBySlug(slug: string) {
  return blogArticles.find(a => a.slug === slug);
}

export function listArticleIndex(): { slug: string; title: string; category: string; published_at: string; read_minutes: number; }[] {
  return blogArticles.map(a => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    published_at: a.published_at,
    read_minutes: a.read_minutes
  }));
}
