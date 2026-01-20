import { API_BASE_URL } from '../config';

export type BlogImageRole = 'cover' | 'inline';
export interface BlogImageRec {
  id: string;
  url: string;
  role: BlogImageRole;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  postId?: string | null;
  uploadedAt?: string | Date;
}

async function authHeadersUpload(): Promise<HeadersInit> {
  const token = localStorage.getItem('e4d_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadBlogImage(file: File, opts: { role?: BlogImageRole; slug?: string; alt?: string }): Promise<BlogImageRec> {
  const form = new FormData();
  form.append('image', file);
  if (opts.role) form.append('role', opts.role);
  if (opts.slug) form.append('slug', opts.slug);
  if (opts.alt) form.append('alt', opts.alt);
  const res = await fetch(`${API_BASE_URL}/api/uploads/blog-image`, {
    method: 'POST',
    headers: await authHeadersUpload(),
    body: form,
    credentials: 'omit'
  });
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function listBlogImages(slug: string): Promise<BlogImageRec[]> {
  const token = localStorage.getItem('e4d_access_token');
  const res = await fetch(`${API_BASE_URL}/api/admin/blog/${encodeURIComponent(slug)}/images`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'omit'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

export async function deleteBlogImage(slug: string, id: string): Promise<void> {
  const token = localStorage.getItem('e4d_access_token');
  const res = await fetch(`${API_BASE_URL}/api/admin/blog/${encodeURIComponent(slug)}/images/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'omit'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
