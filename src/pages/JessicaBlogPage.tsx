import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaLightbulb, FaBook, FaFlask, FaUsers } from 'react-icons/fa';
import JessicaNav from '../components/jessica/JessicaNav';
import JessicaFooter from '../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../components/jessica/JessicaChatAssistant';
import { imageForIndex, courseImageAlt } from '../data/imagePools';
import { blogStore } from '../services/blogStore';
import { blogArticles } from '../data/blogArticles';
import { useRecoilValueLoadable } from 'recoil';
import { blogBaseListSelector } from '../state/blog';
import { useTranslation } from 'react-i18next';

interface BlogIndexRow {
  slug: string;
  title: string;
  excerpt?: string;
  author_name: string;
  author_role?: string;
  category: string;
  tags: string[];
  published_at: string;
  read_minutes?: number;
  cover_image_url?: string;
}

const JessicaBlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'newest'|'oldest'>('newest');
  const [year, setYear] = useState<number|''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  const landingImageBySlug = useMemo(() => ({
    'from-absenteeism-to-attendance': '/photos/Dossier/02.png',
    'training-day-mhm-basics': '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    'coops-women-led-production': '/photos/Dossier/01.png'
  } as Record<string, string>), []);

  const staticRows: BlogIndexRow[] = blogArticles.length
    ? blogArticles.map((a, idx) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt || '',
        author_name: a.author?.name || 'Jessica',
        author_role: a.author?.role || 'Founder & MHM Advocate',
        published_at: a.published_at,
        read_minutes: a.read_minutes,
        category: a.category || 'impact',
        tags: a.tags || [],
        cover_image_url: a.cover_image_url || ''
      }))
    : [];

  const adminPosts = blogStore.list().filter(r => r.status === 'published');

  const bySlug = new Map(staticRows.map(r => [r.slug, r] as const));
  adminPosts.forEach((r, i) => {
    const existing = bySlug.get(r.slug);
    const merged: BlogIndexRow = {
      slug: r.slug,
      title: r.title || existing?.title || r.slug,
      excerpt: r.excerpt || existing?.excerpt || '',
      author_name: r.author_name || existing?.author_name || 'Jessica',
      author_role: r.author_role || existing?.author_role || 'Founder & MHM Advocate',
      published_at: r.published_at || existing?.published_at || new Date().toISOString(),
      read_minutes: r.read_minutes || existing?.read_minutes || 5,
      category: r.category || existing?.category || 'impact',
      tags: r.tags || existing?.tags || [],
      cover_image_url: r.cover_image_url || existing?.cover_image_url || ''
    };
    bySlug.set(r.slug, merged);
  });

  const blogApiLoadable = useRecoilValueLoadable(blogBaseListSelector);
  const [blogPosts, setBlogPosts] = useState(Array.from(bySlug.values()));

  useEffect(() => {
    if (blogApiLoadable.state === 'hasValue') {
      const val = blogApiLoadable.contents as BlogIndexRow[];
      setBlogPosts(val.length ? val : Array.from(bySlug.values()));
    } else if (blogApiLoadable.state === 'hasError') {
      setBlogPosts(Array.from(bySlug.values()));
    }
  }, [blogApiLoadable.state]);

  const categoryMeta: Record<string, { icon: React.ReactNode; color: string }> = {
    impact: { icon: <FaHeart className="w-4 h-4" />, color: '#f4a6a9' },
    insights: { icon: <FaLightbulb className="w-4 h-4" />, color: '#e8b4b8' },
    updates: { icon: <FaBook className="w-4 h-4" />, color: '#d4a5a8' },
    research: { icon: <FaFlask className="w-4 h-4" />, color: '#c49ca0' },
    howto: { icon: <FaUsers className="w-4 h-4" />, color: '#f4a6a9' }
  };

  const getCoverFor = (slug: string, idx: number) => {
    if (landingImageBySlug[slug]) return landingImageBySlug[slug];
    const fromStatic = blogArticles.find(a => a.slug === slug)?.cover_image_url;
    if (fromStatic) return fromStatic;
    const fromStore = blogStore.get(slug)?.cover_image_url;
    return fromStore || imageForIndex(idx);
  };

  const filtered = blogPosts.filter(p => {
    const okQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.excerpt?.toLowerCase().includes(q.toLowerCase()) ?? false) || p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()));
    const okCat = category === 'all' || p.category === category;
    const yr = new Date(p.published_at).getFullYear();
    const okYear = !year || yr === year;
    const okTags = !tags.length || tags.every(t => p.tags.includes(t));
    return okQ && okCat && okYear && okTags;
  }).sort((a,b) => sort === 'newest'
      ? new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      : new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  const resetAll = () => { setQ(''); setCategory('all'); setSort('newest'); setYear(''); setTags([]); setPage(1); }

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <JessicaNav />

      <section className="pt-24 pb-16 bg-gradient-to-br from-[#fef7f0] to-[#f9f1f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#5a4a47] mb-6">Stories</h1>
            <div className="w-24 h-1 bg-[#f4a6a9] mx-auto rounded-full" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Toolbar */}
        <section className="sticky top-[84px] z-30 mb-12">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#f4a6a9]/30 shadow-lg p-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[280px]">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search my stories..."
                className="h-12 w-full pl-4 pr-4 rounded-full text-sm border border-[#f4a6a9]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a6a9]"
              />
            </div>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm focus:ring-2 focus:ring-[#f4a6a9]"
            >
              {Object.keys(categoryMeta).map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm focus:ring-2 focus:ring-[#f4a6a9]"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {(q || category !== 'all' || sort !== 'newest') && (
              <button onClick={resetAll} className="h-12 px-6 rounded-full bg-[#f4a6a9] text-white text-sm font-medium hover:bg-[#e89396] transition-colors">Reset All</button>
            )}
          </div>
        </section>

        <section id="posts" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map((post, idx) => {
            const categoryInfo = categoryMeta[post.category] || categoryMeta.impact;
            return (
              <article key={post.slug} className="group bg-white rounded-2xl border border-[#f4a6a9]/20 overflow-hidden hover:shadow-xl hover:border-[#f4a6a9] transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={getCoverFor(post.slug, idx)}
                    alt={courseImageAlt('blog', post.title)}
                    loading={idx>2?'lazy':'eager'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg" style={{backgroundColor: categoryInfo.color}}>
                      {categoryInfo.icon} {post.category}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#5a4a47] mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-[#7a6a67] mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-[#7a6a67] mb-4">
                    <span>{post.author_name}</span>
                    <span>{new Date(post.published_at).toLocaleDateString()} • {post.read_minutes} min read</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <JessicaFooter />
      <JessicaChatAssistant />
    </div>
  );
};

export default JessicaBlogPage;
