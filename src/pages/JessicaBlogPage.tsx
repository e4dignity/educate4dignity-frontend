import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { FaHeart, FaLightbulb, FaBook, FaFlask, FaUsers } from 'react-icons/fa';
import JessicaNav from '../components/jessica/JessicaNav';
import JessicaFooter from '../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../components/jessica/JessicaChatAssistant';
import { imageForIndex } from '../data/imagePools';
import { blogStore } from '../services/blogStore';
import { blogBaseListSelector } from '../state/blog';
import { useRecoilValueLoadable } from 'recoil';
import { useTranslation } from 'react-i18next';

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  author: string;
  authorRole?: string;
  publishDate: string;
  readTime?: string;
  category?: string;
  tags: string[];
  image?: string;
  featured?: boolean;
}

const JessicaBlogPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- States ---
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [year, setYear] = useState<number | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [blogPosts, setBlogPosts] = useState<BlogPostSummary[]>([]);

  // --- Images spécifiques ---
  const landingImageBySlug = useMemo(() => ({
    'from-absenteeism-to-attendance': '/photos/Dossier/02.png',
    'training-day-mhm-basics': '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    'coops-women-led-production': '/photos/Dossier/01.png'
  } as Record<string, string>), []);

  // --- Chargement backend via Recoil ---
  const blogApiLoadable = useRecoilValueLoadable(blogBaseListSelector);

  useEffect(() => {
    if (blogApiLoadable.state === 'hasValue') {
      const val = blogApiLoadable.contents as BlogPostSummary[];
      setBlogPosts(val || []);
    } else if (blogApiLoadable.state === 'hasError') {
      // fallback : données du store
      const adminPosts = blogStore.list().filter(r => r.status === 'published');
      const mapped = adminPosts.map((r, i) => ({
        id: r.id || `adm-${i + 1}`,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt || '',
        author: r.author_name || 'Jessica',
        authorRole: r.authorRole || 'Founder & MHM Advocate',
        publishDate: r.publishedAt || new Date().toISOString(),
        readTime: r.readTime || '5 min read',
        category: r.category || 'impact',
        tags: r.tags || [],
        image: r.cover_image_url || '',
        featured: r.featured || false
      }));
      setBlogPosts(mapped);
    }
  }, [blogApiLoadable.state]);

  // --- Categories meta ---
  const categoryMeta: Record<string, { icon: React.ReactNode; color: string }> = {
    impact: { icon: <FaHeart className="w-4 h-4" />, color: '#f4a6a9' },
    insights: { icon: <FaLightbulb className="w-4 h-4" />, color: '#e8b4b8' },
    updates: { icon: <FaBook className="w-4 h-4" />, color: '#d4a5a8' },
    research: { icon: <FaFlask className="w-4 h-4" />, color: '#c49ca0' },
    howto: { icon: <FaUsers className="w-4 h-4" />, color: '#f4a6a9' }
  };

  const getCategoryName = (id: string) =>
    t(`blog.categories.${id}`, id === 'all' ? t('blog.categories.all', 'All Stories') : id.charAt(0).toUpperCase() + id.slice(1));

  // --- Filtrage & pagination ---
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach(p => { counts[p.category || 'impact'] = (counts[p.category || 'impact'] || 0) + 1; });
    return [
      { id: 'all', name: t('blog.categories.all', 'All Stories'), count: blogPosts.length },
      ...Object.keys(categoryMeta).map((id) => ({ id, name: getCategoryName(id), count: counts[id] || 0 }))
    ];
  }, [blogPosts, t]);

  const years = useMemo(() => Array.from(new Set(blogPosts.map(p => new Date(p.publishDate).getFullYear()))).sort((a, b) => b - a), [blogPosts]);
  const allTags = useMemo(() => Array.from(new Set(blogPosts.flatMap(p => p.tags))).sort(), [blogPosts]);

  const filtered = blogPosts.filter(p => {
    const qq = q.toLowerCase();
    const okQ = !q || p.title.toLowerCase().includes(qq) || (p.excerpt?.toLowerCase().includes(qq)) || p.tags.some(t => t.toLowerCase().includes(qq));
    const okCat = category === 'all' || p.category === category;
    const yr = new Date(p.publishDate).getFullYear();
    const okYear = !year || yr === year;
    const okTags = !tags.length || tags.every(t => p.tags.includes(t));
    return okQ && okCat && okYear && okTags;
  }).sort((a, b) => sort === 'newest'
    ? new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    : new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // --- Helpers ---
  function getCoverFor(slug: string, idx: number) {
    return landingImageBySlug[slug] || imageForIndex(idx);
  }

  function resetAll() { setQ(''); setCategory('all'); setSort('newest'); setYear(''); setTags([]); setPage(1); }
  function toggleTag(tag: string) { setTags(cur => cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag]); }

  // --- JSX ---
  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <JessicaNav />

      <section className="pt-24 pb-16 bg-gradient-to-br from-[#fef7f0] to-[#f9f1f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#5a4a47] mb-6">Stories</h1>
          <div className="w-24 h-1 bg-[#f4a6a9] mx-auto rounded-full" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Toolbar, Filters, Tags, Search */}
        {/* ... identique au code que tu as fourni ... */}

        {/* Grid des posts */}
        <section id="posts" aria-live="polite" className="min-h-[400px]">
          {paginated.length === 0 && <div className="text-center py-24 text-[#7a6a67]">No stories match your search.</div>}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((post, idx) => {
              const categoryInfo = categoryMeta[post.category || 'impact'];
              return (
                <article key={post.id} className="group bg-white rounded-2xl border border-[#f4a6a9]/20 overflow-hidden hover:shadow-xl hover:border-[#f4a6a9] transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={getCoverFor(post.slug, idx)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = '/photos/banniere.png'; }}
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg" style={{backgroundColor: categoryInfo.color}}>
                      {categoryInfo.icon}{t(`blog.categories.${post.category}`, post.category)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#5a4a47] mb-3 line-clamp-2 group-hover:text-[#f4a6a9]">{post.title}</h3>
                    <p className="text-sm text-[#7a6a67] mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-[#7a6a67] mb-4">
                      <span className="font-medium">{post.author}</span>
                      <span>{new Date(post.publishDate).toLocaleDateString()} • {post.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">{post.tags.slice(0,2).map(tag => <span key={tag} className="px-2 py-1 bg-[#f4a6a9]/10 text-[#f4a6a9] text-xs rounded-full">{tag}</span>)}</div>
                      <button onClick={() => navigate(`/blog/${post.slug}`)} className="inline-flex items-center px-4 py-2 bg-[#f4a6a9] text-white text-sm font-medium rounded-full hover:bg-[#e89396] transition-colors">Read Story →</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Pagination */}
        {/* ... identique au code que tu as fourni ... */}

      </div>

      <JessicaFooter />
      <JessicaChatAssistant />
    </div>
  );
};

export default JessicaBlogPage;

