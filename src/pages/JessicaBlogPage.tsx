import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { FaHeart, FaLightbulb, FaBook, FaFlask, FaUsers } from 'react-icons/fa';
import JessicaNav from '../components/jessica/JessicaNav';
import JessicaFooter from '../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../components/jessica/JessicaChatAssistant';
import { imageForIndex, courseImageAlt } from '../data/imagePools';
import { useTranslation } from 'react-i18next';
import { apiListBlog, BlogPostSummary } from '../services/apiBlog';

const JessicaBlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'newest'|'oldest'>('newest');
  const [year, setYear] = useState<number|''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  const [blogPosts, setBlogPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const landingImageBySlug = useMemo(() => ({
    'from-absenteeism-to-attendance': '/photos/Dossier/02.png',
    'training-day-mhm-basics': '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    'coops-women-led-production': '/photos/Dossier/01.png'
  } as Record<string, string>), []);

  const categoryMeta: Record<string, { icon: React.ReactNode; color: string }> = {
    impact: { icon: <FaHeart className="w-4 h-4" />, color: '#f4a6a9' },
    insights: { icon: <FaLightbulb className="w-4 h-4" />, color: '#e8b4b8' },
    updates: { icon: <FaBook className="w-4 h-4" />, color: '#d4a5a8' },
    research: { icon: <FaFlask className="w-4 h-4" />, color: '#c49ca0' },
    howto: { icon: <FaUsers className="w-4 h-4" />, color: '#f4a6a9' }
  };

  // Load from backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await apiListBlog({ pageSize: 100 });
        if (!cancelled) setBlogPosts(rows || []);
      } catch (e) {
        if (!cancelled) setError('load-failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const normalizedPosts = blogPosts.map((p, idx) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    author: p.author || 'Jessica',
    publishDate: p.published_at,
    readTime: `${p.read_minutes || 5} min read`,
    category: p.category || 'impact',
    tags: p.tags || [],
    image: p.coverImage || '',
    coverOverride: landingImageBySlug[p.slug] || ''
  }));

  const filtered = normalizedPosts.filter(p => {
    const qq = q.toLowerCase();
    const okQ = !q || p.title.toLowerCase().includes(qq) || p.excerpt.toLowerCase().includes(qq) || p.tags.some(t => t.toLowerCase().includes(qq));
    const okCat = category === 'all' || p.category === category;
    const yr = new Date(p.publishDate).getFullYear();
    const okYear = !year || yr === year;
    const okTags = !tags.length || tags.every(t => p.tags.includes(t));
    return okQ && okCat && okYear && okTags;
  }).sort((a,b) => sort === 'newest' ? (new Date(b.publishDate).getTime()-new Date(a.publishDate).getTime()) : (new Date(a.publishDate).getTime()-new Date(b.publishDate).getTime()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  const years = Array.from(new Set(normalizedPosts.map(p=>new Date(p.publishDate).getFullYear()))).sort((a,b)=>b-a);
  const allTags = Array.from(new Set(normalizedPosts.flatMap(p=>p.tags))).sort();
  const categories = [{id:'all', name: t('blog.categories.all','All Stories'), count: normalizedPosts.length}, ...Object.keys(categoryMeta).map(id=>({id, name: id.charAt(0).toUpperCase()+id.slice(1), count: normalizedPosts.filter(p=>p.category===id).length}))];

  function getCoverFor(slug: string, idx:number) {
    return landingImageBySlug[slug] || normalizedPosts[idx]?.image || imageForIndex(idx);
  }

  function resetAll() { setQ(''); setCategory('all'); setSort('newest'); setYear(''); setTags([]); setPage(1);}
  function toggleTag(tag:string){ setTags(cur=>cur.includes(tag)?cur.filter(t=>t!==tag):[...cur, tag]); }

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

        {/* Toolbar */}
        <section className="sticky top-[84px] z-30 mb-12">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#f4a6a9]/30 shadow-lg p-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#f4a6a9]" />
              <input value={q} onChange={e=>{setQ(e.target.value);setPage(1)}} placeholder="Search my stories..." className="h-12 w-full pl-12 pr-4 rounded-full text-sm border border-[#f4a6a9]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a6a9] focus:border-[#f4a6a9]" />
            </div>
            <select value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}} className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm focus:ring-2 focus:ring-[#f4a6a9]">
              {categories.map(c=><option key={c.id} value={c.id}>{c.name} ({c.count})</option>)}
            </select>
            <select value={year} onChange={e=>{setYear(e.target.value?Number(e.target.value):''); setPage(1)}} className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm w-[120px] focus:ring-2 focus:ring-[#f4a6a9]">
              <option value="">All Years</option>
              {years.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            <div className="relative" aria-expanded={showTags} aria-haspopup="listbox">
              <button type="button" onClick={()=>setShowTags(s=>!s)} className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white flex items-center gap-2 text-sm focus:ring-2 focus:ring-[#f4a6a9]">
                <span>Topics</span>{tags.length>0 && <span className="text-xs rounded-full px-2 py-1 bg-[#f4a6a9] text-white font-medium">{tags.length}</span>}
              </button>
              {showTags && <div className="absolute left-0 mt-2 w-[280px] max-h-[300px] overflow-y-auto rounded-2xl border border-[#f4a6a9]/30 bg-white shadow-xl p-4 z-40">
                <div className="flex justify-between items-center mb-3"><span className="text-sm font-semibold text-[#5a4a47]">Select Topics</span>{tags.length>0 && <button onClick={()=>setTags([])} className="text-sm text-[#f4a6a9] hover:text-[#e89396] font-medium">Clear All</button>}</div>
                <div className="flex flex-wrap gap-2">{allTags.map(tg => {const active = tags.includes(tg); return <button key={tg} onClick={()=>toggleTag(tg)} className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${active?'bg-[#f4a6a9] text-white shadow-md':'bg-[#f4a6a9]/10 text-[#5a4a47] hover:bg-[#f4a6a9]/20 border border-[#f4a6a9]/30'}`}>{tg}</button>})}</div>
                <div className="pt-3 flex justify-end"><button type="button" onClick={()=>setShowTags(false)} className="text-sm text-[#f4a6a9] hover:text-[#e89396] font-medium">Done</button></div>
              </div>}
            </div>
            <select value={sort} onChange={e=>{setSort(e.target.value as any); setPage(1)}} className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm focus:ring-2 focus:ring-[#f4a6a9]">
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            {(q||category!=='all'||year||tags.length||sort!=='newest') && <button onClick={resetAll} className="h-12 px-6 rounded-full bg-[#f4a6a9] text-white text-sm font-medium hover:bg-[#e89396] transition-colors">Reset All</button>}
          </div>
        </section>

        {/* Loading / Error */}
        {loading && <div className="text-center py-24 text-[#7a6a67]">Loading stories…</div>}
        {!loading && error && <div className="text-center py-24 text-red-500">Failed to load stories. <button onClick={()=>window.location.reload()} className="ml-3 px-4 py-2 rounded-full bg-[#f4a6a9] text-white">Retry</button></div>}
        {!loading && !error && paginated.length===0 && <div className="text-center py-24 text-[#7a6a67]">No stories found.</div>}

        {/* Grid */}
        {!loading && !error && paginated.length>0 &&
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((p,idx) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group rounded-2xl border bg-white flex flex-col overflow-hidden hover:shadow-md transition-shadow" style={{borderColor:'#f4a6a9'}}>
                <div className="aspect-video bg-[#fceaea]">{p.coverOverride ? <img src={p.coverOverride} alt={p.title} className="w-full h-full object-cover"/> : <img src={getCoverFor(p.slug, idx)} alt={p.title} className="w-full h-full object-cover"/>}</div>
                <div className="p-4 space-y-2">
                  <h3 className="text-[15px] font-semibold text-[#5a4a47] line-clamp-2 group-hover:text-[#f4a6a9]">{p.title}</h3>
                  <p className="text-[12px] text-[#7a6a67]">{p.author} • {new Date(p.publishDate).toLocaleDateString()} • {p.readTime}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.tags.slice(0,3).map(t => <span key={t} className="px-2 py-0.5 rounded-full text-[11px] text-[#f4a6a9] border border-[#f4a6a9]/40">{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        }

        {/* Pagination */}
        {!loading && !error && totalPages>1 && <div className="mt-10 flex justify-center gap-2">
          <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-4 py-2 rounded-full bg-white border border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10">Prev</button>
          {Array.from({length:totalPages}).map((_,i)=> <button key={i} onClick={()=>setPage(i+1)} className={`px-4 py-2 rounded-full border ${page===i+1?'bg-[#f4a6a9] text-white border-[#f4a6a9]':'bg-white border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10'}`}>{i+1}</button>)}
          <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-4 py-2 rounded-full bg-white border border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10">Next</button>
        </div>}

      </div>

      <JessicaFooter />
      <JessicaChatAssistant />
    </div>
  );
};

export default JessicaBlogPage;
