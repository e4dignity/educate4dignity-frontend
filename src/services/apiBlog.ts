import { API_BASE_URL, DEFAULT_HEADERS } from '../config';

export type BlogPostSummary = { id: string; slug: string; title: string; coverImage?: string; summary: string; author: string; publishedAt: string; tags: string[] };
export type BlogPost = { id: string; slug: string; title: string; contentHtml: string; coverImage?: string; author: string; publishedAt: string; tags: string[] };

export async function apiListBlog(params: { tag?: string; q?: string; page?: number; pageSize?: number }): Promise<BlogPostSummary[]|undefined> {
  if (!API_BASE_URL) return undefined;
  const url = new URL('/api/blog', API_BASE_URL);
  Object.entries(params).forEach(([k,v])=> { if(v!==undefined && v!=='') url.searchParams.set(k,String(v)); });
  // Bust caches aggressively to reflect admin edits immediately on public
  url.searchParams.set('_', String(Date.now()));
  const res = await fetch(url.toString(), { headers: DEFAULT_HEADERS, cache: 'no-store' });
  if (!res.ok) throw new Error('Blog list failed');
  return res.json();
}

export async function apiGetBlog(slug: string): Promise<BlogPost|undefined> {
  if (!API_BASE_URL) return undefined;
  const url = new URL(`/api/blog/${slug}`, API_BASE_URL);
  // Bust caches aggressively to reflect admin edits immediately on public
  url.searchParams.set('_', String(Date.now()));
  const res = await fetch(url.toString(), { headers: DEFAULT_HEADERS, cache: 'no-store' });
  if (!res.ok) throw new Error('Blog get failed');
  return res.json();
}

export async function apiTrackBlogView(id: string) {
  if (!API_BASE_URL) return;
  await fetch(`${API_BASE_URL}/api/blog/${id}/track-view`, { method: 'POST', headers: DEFAULT_HEADERS });
}
