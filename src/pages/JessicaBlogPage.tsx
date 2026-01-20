import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
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

const JessicaBlogPage: React.FC = () => {
  const { t } = useTranslation();
  // Conservation de toute la logique blog existante
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'newest'|'oldest'>('newest');
  const [year, setYear] = useState<number|''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  // Conservation de la logique de mapping d'images
  const landingImageBySlug = useMemo(() => ({
    'from-absenteeism-to-attendance': '/photos/Dossier/02.png',
    'training-day-mhm-basics': '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    'coops-women-led-production': '/photos/Dossier/01.png'
  } as Record<string, string>), []);

  // Conservation de la logique de données blog existante
  const basePostData = [
    {
      id: '2',
      slug: 'why-dignity-engineering-matters',
      title: 'Why dignity engineering matters in MHM',
      excerpt: 'Exploring innovative approaches to bring digital literacy to underserved populations.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Jessica',
      authorRole: 'Founder & MHM Advocate',
      publishDate: '2024-12-10',
      readTime: '7 min read',
      category: 'insights',
      tags: ['education', 'technology', 'digital'],
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: '4',
      slug: 'coops-women-led-production',
      title: 'Co-ops at the center: women-led production',
      excerpt: 'How local women cooperatives are transforming menstrual health kit production in rural Burundi.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Jessica',
      authorRole: 'Founder & MHM Advocate',
      publishDate: '2024-12-05',
      readTime: '10 min read',
      category: 'research',
      tags: ['research', 'economics', 'sustainability'],
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: '6',
      slug: 'training-day-mhm-basics',
      title: 'Training day: MHM basics that stick',
      excerpt: 'Breaking taboos through education: how we make menstrual health conversations approachable and lasting.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Jessica',
      authorRole: 'Founder & MHM Advocate',
      publishDate: '2024-11-28',
      readTime: '8 min read',
      category: 'insights',
      tags: ['training', 'innovation', 'methodology'],
      image: '/api/placeholder/400/250',
      featured: false
    }
  ];

  // Conservation complète de la logique de merge admin/static
  const adminPosts = blogStore.list().filter(r => r.status === 'published');
  const staticRows = (blogArticles && blogArticles.length ? blogArticles.map((a, idx) => ({
    id: String(idx + 1),
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || '',
    author: a.author?.name || 'Jessica',
    authorRole: a.author?.role || 'Founder & MHM Advocate',
    publishDate: a.published_at,
    readTime: `${a.read_minutes} min read`,
    category: (a.category as any) || 'impact',
    tags: a.tags || [],
    image: a.cover_image_url || '',
    featured: false
  })) : basePostData);
  
  const bySlug = new Map(staticRows.map(r => [r.slug, r] as const));
  if (adminPosts.length) {
    adminPosts.forEach((r, i) => {
      const existing = bySlug.get(r.slug);
      const merged = {
        id: existing?.id || `adm-${i + 1}`,
        slug: r.slug,
        title: r.title || existing?.title || r.slug,
        excerpt: r.excerpt || existing?.excerpt || '',
        author: r.author_name || existing?.author || 'Jessica',
        authorRole: existing?.authorRole || 'Founder & MHM Advocate',
        publishDate: r.published_at || existing?.publishDate || new Date().toISOString(),
        readTime: `${r.read_minutes || (existing?.readTime ? Number((existing.readTime || '').split(' ')[0]) : 5)} min read`,
        category: r.category || existing?.category || 'impact',
        tags: r.tags || existing?.tags || [],
        image: existing?.image || '',
        featured: existing?.featured || false
      };
      bySlug.set(r.slug, merged);
    });
  }

  const blogApiLoadable = useRecoilValueLoadable(blogBaseListSelector);
  const [blogPosts, setBlogPosts] = useState(Array.from(bySlug.values()));
  
  useEffect(() => {
    if (blogApiLoadable.state === 'hasValue') {
      const val = blogApiLoadable.contents as typeof blogPosts;
      setBlogPosts(val && val.length ? val : Array.from(bySlug.values()));
    } else if (blogApiLoadable.state === 'hasError') {
      setBlogPosts(Array.from(bySlug.values()));
    }
  }, [blogApiLoadable.state]);

  // Conservation de la logique de catégories avec icônes Jessica-style
  const categoryMeta: Record<string, { icon: React.ReactNode; color: string }> = {
    impact: { icon: <FaHeart className="w-4 h-4" />, color: '#f4a6a9' },
    insights: { icon: <FaLightbulb className="w-4 h-4" />, color: '#e8b4b8' },
    updates: { icon: <FaBook className="w-4 h-4" />, color: '#d4a5a8' },
    research: { icon: <FaFlask className="w-4 h-4" />, color: '#c49ca0' },
    howto: { icon: <FaUsers className="w-4 h-4" />, color: '#f4a6a9' }
  };

  const getCategoryName = (id: string) =>
    t(`blog.categories.${id}`, id === 'all' ? t('blog.categories.all', 'All Stories') : id.charAt(0).toUpperCase() + id.slice(1));

  // Conservation de toute la logique de filtrage et pagination
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return [
      { id: 'all', name: t('blog.categories.all', 'All Stories'), count: blogPosts.length },
      ...Object.keys(categoryMeta).map((id) => ({ id, name: getCategoryName(id), count: counts[id] || 0 }))
    ];
  }, [blogPosts, t]);

  const years = useMemo(() => Array.from(new Set(blogPosts.map(p => new Date(p.publishDate).getFullYear()))).sort((a, b) => b - a), [blogPosts]);
  const allTags = useMemo(() => Array.from(new Set(blogPosts.flatMap(p => p.tags))).sort(), [blogPosts]);

  const filtered = blogPosts.filter(p => {
    const qq = q.toLowerCase();
    const okQ = !q || p.title.toLowerCase().includes(qq) || p.excerpt.toLowerCase().includes(qq) || p.tags.some(t => t.toLowerCase().includes(qq));
    const okCat = category === 'all' || p.category === category;
    const yr = new Date(p.publishDate).getFullYear();
    const okYear = !year || yr === year;
    const okTags = !tags.length || tags.every(t => p.tags.includes(t));
    return okQ && okCat && okYear && okTags;
  }).sort((a, b) => sort === 'newest' ? (new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()) : (new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Conservation de la logique d'images de couverture
  function getCoverFor(slug: string, idx: number): string {
    if (landingImageBySlug[slug]) return landingImageBySlug[slug];
    const fromStatic = blogArticles.find(a => a.slug === slug)?.cover_image_url || '';
    if (fromStatic) return fromStatic;
    const fromStore = blogStore.get(slug)?.cover_image_url || '';
    return fromStore || imageForIndex(idx);
  }

  function resetAll() { setQ(''); setCategory('all'); setSort('newest'); setYear(''); setTags([]); setPage(1); }
  function toggleTag(tag: string) { setTags(cur => cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag]); }

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <JessicaNav />
      
      {/* Hero Section Jessica-style */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#fef7f0] to-[#f9f1f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#5a4a47] mb-6">
              Stories
            </h1>
            <div className="w-24 h-1 bg-[#f4a6a9] mx-auto rounded-full" />
          </div>
        </div>
      </section>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Toolbar Jessica-style mais logique conservée */}
        <section className="sticky top-[84px] z-30 mb-12">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#f4a6a9]/30 shadow-lg p-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#f4a6a9]" />
              <input 
                value={q} 
                onChange={e => { setQ(e.target.value); setPage(1); }} 
                placeholder="Search my stories..." 
                className="h-12 w-full pl-12 pr-4 rounded-full text-sm border border-[#f4a6a9]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a6a9] focus:border-[#f4a6a9]" 
              />
            </div>
            
            <select 
              value={category} 
              onChange={e => { setCategory(e.target.value); setPage(1); }} 
              className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm focus:ring-2 focus:ring-[#f4a6a9]"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.count})</option>)}
            </select>
            
            <select 
              value={year} 
              onChange={e => { setYear(e.target.value ? Number(e.target.value) : ''); setPage(1); }} 
              className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm w-[120px] focus:ring-2 focus:ring-[#f4a6a9]"
            >
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Conservation du système de tags */}
            <div className="relative" aria-expanded={showTags} aria-haspopup="listbox">
              <button 
                type="button" 
                onClick={() => setShowTags(s => !s)} 
                className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white flex items-center gap-2 text-sm focus:ring-2 focus:ring-[#f4a6a9]"
              >
                <span>Topics</span>
                {tags.length > 0 && (
                  <span className="text-xs rounded-full px-2 py-1 bg-[#f4a6a9] text-white font-medium">
                    {tags.length}
                  </span>
                )}
              </button>
              {showTags && (
                <div className="absolute left-0 mt-2 w-[280px] max-h-[300px] overflow-y-auto rounded-2xl border border-[#f4a6a9]/30 bg-white shadow-xl p-4 z-40">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-[#5a4a47]">Select Topics</span>
                    {tags.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setTags([])} 
                        className="text-sm text-[#f4a6a9] hover:text-[#e89396] font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tg => {
                      const active = tags.includes(tg);
                      return (
                        <button 
                          key={tg} 
                          type="button" 
                          onClick={() => toggleTag(tg)} 
                          className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                            active 
                              ? 'bg-[#f4a6a9] text-white shadow-md' 
                              : 'bg-[#f4a6a9]/10 text-[#5a4a47] hover:bg-[#f4a6a9]/20 border border-[#f4a6a9]/30'
                          }`}
                        >
                          {tg}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-3 flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => setShowTags(false)} 
                      className="text-sm text-[#f4a6a9] hover:text-[#e89396] font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <select 
              value={sort} 
              onChange={e => { setSort(e.target.value as any); setPage(1); }} 
              className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm focus:ring-2 focus:ring-[#f4a6a9]"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            {(q || category !== 'all' || year || tags.length || sort !== 'newest') && (
              <button 
                onClick={resetAll} 
                className="h-12 px-6 rounded-full bg-[#f4a6a9] text-white text-sm font-medium hover:bg-[#e89396] transition-colors"
              >
                Reset All
              </button>
            )}
          </div>
        </section>

        {/* Grid de posts Jessica-style */}
        <section id="posts" aria-live="polite" className="min-h-[400px]">
          {paginated.length === 0 && (
            <div className="text-center py-24">
              <div className="text-xl text-[#7a6a67] mb-4">No stories match your search.</div>
              <button 
                onClick={resetAll} 
                className="inline-flex items-center px-6 py-3 bg-[#f4a6a9] text-white rounded-full font-medium hover:bg-[#e89396] transition-colors"
              >
                Show All Stories
              </button>
            </div>
          )}
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((post, idx) => {
              const categoryInfo = categoryMeta[post.category] || categoryMeta.impact;
              return (
                <article 
                  key={post.id} 
                  className="group bg-white rounded-2xl border border-[#f4a6a9]/20 overflow-hidden hover:shadow-xl hover:border-[#f4a6a9] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={getCoverFor(post.slug, idx)}
                      alt={courseImageAlt('blog', post.title)}
                      loading={idx > 2 ? 'lazy' : 'eager'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/photos/banniere.png'; }}
                    />
                    <div className="absolute top-4 left-4">
                      <div 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg"
                        style={{ backgroundColor: categoryInfo.color }}
                      >
                        {categoryInfo.icon}
                        {String(t(`blog.categories.${post.category}`, post.category))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#5a4a47] mb-3 line-clamp-2 group-hover:text-[#f4a6a9] transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-[#7a6a67] mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-[#7a6a67] mb-4">
                      <span className="font-medium">{post.author}</span>
                      <span>{new Date(post.publishDate).toLocaleDateString()} • {post.readTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-[#f4a6a9]/10 text-[#f4a6a9] text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/blog/${post.slug}`, { state: { coverOverride: getCoverFor(post.slug, idx), fromJessica: true } })} 
                        className="inline-flex items-center px-4 py-2 bg-[#f4a6a9] text-white text-sm font-medium rounded-full hover:bg-[#e89396] transition-colors group-hover:shadow-lg"
                      >
                        Read Story →
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Conservation de la pagination avec style Jessica */}
        <nav className="mt-12 flex items-center justify-between text-sm flex-wrap gap-6" aria-label="Pagination">
          <div className="flex items-center gap-3 text-[#7a6a67]">
            <span>Stories per page:</span>
            <select 
              value={pageSize} 
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} 
              className="h-10 px-3 rounded-full border border-[#f4a6a9]/30 bg-white text-sm focus:ring-2 focus:ring-[#f4a6a9]"
            >
              {[6, 9, 12].map(sz => <option key={sz} value={sz}>{sz}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              aria-label="Previous page" 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="h-10 px-4 rounded-full transition-colors border border-[#f4a6a9]/30 bg-white text-[#f4a6a9] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f4a6a9] hover:text-white"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const n = i + 1;
              const active = n === page;
              return (
                <button 
                  key={n} 
                  aria-current={active ? 'page' : undefined} 
                  onClick={() => setPage(n)} 
                  className={`w-10 h-10 rounded-full text-sm transition-all ${
                    active 
                      ? 'bg-[#f4a6a9] text-white shadow-md' 
                      : 'bg-white text-[#f4a6a9] border border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10'
                  }`}
                >
                  {n}
                </button>
              );
            })}
            
            <button 
              aria-label="Next page" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages} 
              className="h-10 px-4 rounded-full transition-colors border border-[#f4a6a9]/30 bg-white text-[#f4a6a9] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f4a6a9] hover:text-white"
            >
              Next
            </button>
          </div>
        </nav>

        {/* Connect banner Jessica-style */}
        <section className="mt-20">
          <div className="bg-gradient-to-br from-[#f4a6a9] to-[#e8b4b8] rounded-3xl p-8 lg:p-12 text-center text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Connect with These Stories
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Every story shared here represents real conversations and genuine connections with girls 
              across Burundi. Want to learn more or get involved?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#f4a6a9] font-semibold rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get In Touch
              </Link>
              <Link 
                to="/gallery" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#f4a6a9] transition-all duration-200"
              >
                See the Photos
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <JessicaFooter />

      <JessicaChatAssistant />
    </div>
  );
};

export default JessicaBlogPage;