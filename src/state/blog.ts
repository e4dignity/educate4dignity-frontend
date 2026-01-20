import { selector } from 'recoil';
import { apiListBlog } from '../services/apiBlog';
import { blogStore } from '../services/blogStore';
import { blogArticles } from '../data/blogArticles';

// Shape used by BlogPage grid
export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
};

// API-first list with fallback to static + local store (admin-managed)
export const blogBaseListSelector = selector<BlogListItem[]>({
  key: 'blogBaseListSelector',
  get: async () => {
    try {
      const apiRows = await apiListBlog({ page: 1, pageSize: 100 });
      if (apiRows && Array.isArray(apiRows) && apiRows.length) {
        return apiRows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          excerpt: r.summary,
          author: r.author,
          authorRole: '',
          publishDate: r.publishedAt,
          readTime: '6 min read',
          category: 'impact',
          tags: r.tags,
          image: '',
          featured: false,
        }));
      }
    } catch {
      // ignore and fallback
    }

    // Fallback: merge static articles with admin/local store
    const basePostData: BlogListItem[] = [
      {
        id: '2',
        slug: 'why-dignity-engineering-matters',
        title: 'Why dignity engineering matters in MHM',
        excerpt: 'Exploring innovative approaches to bring digital literacy to underserved populations.',
        author: 'Michael Chen',
        authorRole: 'Technology Lead',
        publishDate: '2024-12-10',
        readTime: '7 min read',
        category: 'insights',
        tags: ['education', 'technology', 'digital'],
        image: '/api/placeholder/400/250',
        featured: false,
      },
      {
        id: '4',
        slug: 'coops-women-led-production',
        title: 'Co-ops at the center: women-led production',
        excerpt: 'Latest research on cost-effective approaches to sustainable development projects.',
        author: 'Dr. James Wilson',
        authorRole: 'Research Director',
        publishDate: '2024-12-05',
        readTime: '10 min read',
        category: 'research',
        tags: ['research', 'economics', 'sustainability'],
        image: '/api/placeholder/400/250',
        featured: false,
      },
      {
        id: '6',
        slug: 'training-day-mhm-basics',
        title: 'Training day: MHM basics that stick',
        excerpt: "How we're revolutionizing training programs with innovative pedagogical approaches.",
        author: 'Lisa Thompson',
        authorRole: 'Training Specialist',
        publishDate: '2024-11-28',
        readTime: '8 min read',
        category: 'insights',
        tags: ['training', 'innovation', 'methodology'],
        image: '/api/placeholder/400/250',
        featured: false,
      },
    ];

    const adminPosts = blogStore
      .list()
      .filter((r) => r.status === 'published');
    const staticRows: BlogListItem[] = (blogArticles && blogArticles.length
      ? blogArticles.map((a, idx) => ({
          id: String(idx + 1),
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || '',
          author: a.author?.name || 'E4D',
          authorRole: a.author?.role || '',
          publishDate: a.published_at,
          readTime: `${a.read_minutes} min read`,
          category: (a.category as any) || 'impact',
          tags: a.tags || [],
          image: a.cover_image_url || '',
          featured: false,
        }))
      : basePostData);

    const bySlug = new Map(staticRows.map((r) => [r.slug, r] as const));
    if (adminPosts.length) {
      adminPosts.forEach((r, i) => {
        const existing = bySlug.get(r.slug);
        const merged: BlogListItem = {
          id: existing?.id || `adm-${i + 1}`,
          slug: r.slug,
          title: r.title || existing?.title || r.slug,
          excerpt: (r as any).excerpt || existing?.excerpt || '',
          author: r.author_name || existing?.author || 'E4D',
          authorRole: existing?.authorRole || '',
          publishDate: r.published_at || existing?.publishDate || new Date().toISOString(),
          readTime: `${(r as any).read_minutes || (existing?.readTime ? Number((existing.readTime || '').split(' ')[0]) : 5)} min read`,
          category: (r as any).category || existing?.category || 'impact',
          tags: (r as any).tags || existing?.tags || [],
          image: existing?.image || '', // prefer curated static cover for consistency
          featured: existing?.featured || false,
        };
        bySlug.set(r.slug, merged);
      });
    }

    return Array.from(bySlug.values());
  },
});
