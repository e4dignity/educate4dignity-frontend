import api from './apiClient';
// no fallbacks to public: admin reads DB only

export type AdminBlogIndexRow = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft'|'published';
  updatedAt: string | null;
  publishedAt: string | null;
  coverImageUrl?: string;
};

export type AdminBlogArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft'|'published';
  summary: string;
  contentHtml: string;
  coverImageUrl?: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

export async function listAdminBlog(params?: { q?: string; tag?: string; status?: 'all'|'draft'|'published'; page?: number; pageSize?: number }): Promise<AdminBlogIndexRow[]> {
  // Admin must reflect the database only. No fallback to mocks or public.
  const res = await api.get<{ total: number; items: any[] }>(
    '/admin/blog',
    params as any,
  );
  return res.items.map((r) => ({
    slug: r.slug,
    title: r.title,
    category: r.category,
    tags: r.tags || [],
    author: r.author,
    status: r.status,
    updatedAt: r.updatedAt || null,
    publishedAt: r.publishedAt || null,
    coverImageUrl: r.coverImageUrl,
  }));
}

export async function getAdminBlog(slug: string): Promise<AdminBlogArticle | null> {
  const r = await api.get<any>(`/admin/blog/${encodeURIComponent(slug)}`);
  if (!r) return null as any;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    tags: r.tags || [],
    author: r.author,
    status: r.status,
    summary: r.summary,
    contentHtml: r.contentHtml,
    coverImageUrl: r.coverImageUrl,
    publishedAt: r.publishedAt || null,
    updatedAt: r.updatedAt || null,
  };
}

export async function createAdminBlog(body: { slug: string; title: string; summary: string; contentHtml?: string; contentMd?: string; author?: string; coverImageUrl?: string; category?: string; tags?: string[]; readMinutes?: number; status?: 'draft'|'published'; publishedAt?: string }): Promise<{ id: string; slug: string }> {
  return api.post(`/admin/blog`, body);
}

export async function updateAdminBlog(slug: string, body: Partial<{ title: string; summary: string; contentHtml: string; author: string; coverImageUrl: string; category: string; tags: string[]; readMinutes: number; status: 'draft'|'published'; publishedAt: string }>): Promise<{ id: string; slug: string }> {
  return api.put(`/admin/blog/${encodeURIComponent(slug)}`, body);
}

export async function publishAdminBlog(slug: string): Promise<{ ok: true }> {
  return api.post(`/admin/blog/${encodeURIComponent(slug)}/publish`);
}

export async function unpublishAdminBlog(slug: string): Promise<{ ok: true }> {
  return api.post(`/admin/blog/${encodeURIComponent(slug)}/unpublish`);
}

export async function deleteAdminBlog(slug: string): Promise<{ ok: true }> {
  return api.delete(`/admin/blog/${encodeURIComponent(slug)}`);
}
