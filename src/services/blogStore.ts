import { BlogArticle, BlogArticleIndexMeta, BlogAuthor } from '../types/blog';

const LS_KEY = 'e4d_blog_articles_v1';

function migrate(all: BlogArticle[]): BlogArticle[] {
  let changed = false;
  const out = all.map(a => {
    if (a.slug === 'from-absenteeism-to-attendance' && a.title?.endsWith('reusable kits at work')) {
      changed = true;
      return { ...a, title: 'From absenteeism to attendance: reusable kits at school' };
    }
    // Normalize published date for the attendance article
    if (a.slug === 'from-absenteeism-to-attendance') {
      const targetDate = '2024-10-15T00:00:00.000Z';
      if (!a.published_at || !String(a.published_at).startsWith('2024-10-15')) {
        changed = true;
        return { ...a, published_at: targetDate };
      }
    }
    return a;
  });
  // Remove deprecated articles
  const drop = new Set([
    'mobile-money-receipts-kits',
    'from-absenteeism-to-attendance-gitega',
    'what-counts-as-proof',
    'tracking-beneficiary-offline'
  ]);
  const filtered = out.filter(a => !drop.has(a.slug));
  if (filtered.length !== out.length) changed = true;
  if (changed) persist(filtered);
  return filtered;
}

function loadAll(): BlogArticle[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seed();
    const arr = JSON.parse(raw) as BlogArticle[];
    return Array.isArray(arr) ? migrate(arr) : seed();
  } catch {
    return seed();
  }
}

function persist(all: BlogArticle[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

function seed(): BlogArticle[] {
  const author: BlogAuthor = { id: 'auth1', name: 'E4D Ops', role: 'Operations' };
  const s: BlogArticle[] = [
    {
      title: 'From absenteeism to attendance: reusable kits at school',
      slug: 'from-absenteeism-to-attendance',
      category: 'impact',
      tags: ['MHM','Attendance','Case Study'],
      author,
  cover_image_url: '/photos/jeune-adulte-deprime-a-la-maison.jpg',
      published_at: '2024-10-15T00:00:00.000Z',
      read_minutes: 6,
      excerpt: 'What changed when girls received training and reusable kits.',
      body_md: '# Headline\n\nShort intro...\n\n- point 1\n- point 2',
      callout_transparency: 'Photos anonymized. Data aggregated over 3 schools.'
    }
  ];
  persist(s);
  return s;
}

export type BlogStatus = 'draft'|'published';

export interface BlogIndexRow extends BlogArticleIndexMeta {
  status: BlogStatus;
  author_name: string;
}

export const blogStore = {
  list(): BlogIndexRow[] {
    const all = loadAll();
  return all.map(a=> ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      tags: a.tags,
      excerpt: a.excerpt,
      published_at: a.published_at,
      read_minutes: a.read_minutes,
      featured: false,
  status: (a.published_at ? 'published' : 'draft') as BlogStatus,
      author_name: a.author?.name || 'Unknown'
    })).sort((a,b)=> new Date(b.published_at).getTime()-new Date(a.published_at).getTime());
  },
  get(slug: string): BlogArticle | undefined {
    return loadAll().find(a=> a.slug===slug);
  },
  upsert(article: BlogArticle) {
    const all = loadAll();
    const idx = all.findIndex(a=> a.slug===article.slug);
    if (idx>=0) all[idx]=article; else all.push(article);
    persist(all);
  },
  delete(slug: string) {
    const all = loadAll().filter(a=> a.slug!==slug);
    persist(all);
  },
  publish(slug: string) {
    const all = loadAll();
    const a = all.find(x=> x.slug===slug);
    if (a) { a.published_at = new Date().toISOString(); persist(all);} 
  },
  unpublish(slug: string) {
    const all = loadAll();
    const a = all.find(x=> x.slug===slug);
    if (a) { a.published_at = ''; persist(all);} 
  }
};
