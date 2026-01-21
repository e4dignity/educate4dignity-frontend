import React, { useEffect, useState, useMemo } from 'react';  
import { Link } from 'react-router-dom';
import PublicNav from '../../components/layout/PublicNav';
import JessicaNav from '../../components/jessica/JessicaNav';
import PublicFooter from '../../components/layout/PublicFooter';
import JessicaFooter from '../../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../../components/jessica/JessicaChatAssistant';
import { useTranslation } from 'react-i18next';
import { apiListBlog, BlogPostSummary } from '../../services/apiBlog';
import { Search } from 'lucide-react';

// Simple card component for blog posts
const BlogCard: React.FC<{ post: BlogPostSummary }> = ({ post }) => {
  const cover = post.coverImage || '';
  return (
    <Link to={`/blog/${post.slug}`} className="group rounded-2xl border bg-white flex flex-col overflow-hidden hover:shadow-md transition-shadow" style={{borderColor:'var(--rose-200)'}}>
      <div className="aspect-video bg-[var(--rose-50)]">
        {cover ? <img src={cover} alt={post.title} className="w-full h-full object-cover" loading="lazy"/> 
               : <div className="w-full h-full flex items-center justify-center text-[12px] text-[var(--muted-color)]">No cover</div>}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-[15px] font-semibold text-[var(--slate-900)] line-clamp-2 group-hover:text-[var(--rose-700)]">{post.title}</h3>
        <p className="text-[12px] text-[var(--slate-600)]">{post.author}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {post.tags.slice(0,3).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-[var(--rose-50)] text-[11px] text-[var(--rose-700)] border" style={{borderColor:'var(--rose-200)'}}>{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

const BlogIndexPage: React.FC<{ jessicaContext?: boolean }> = ({ jessicaContext }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>(undefined);

  // 🔹 États pour recherche, pagination
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6; // const car non utilisé ailleurs

  useEffect(()=> {
    let cancelled = false;
    (async ()=> {
      setLoading(true); setError(undefined);
      try {
        const rows = await apiListBlog({ pageSize: 100 }); // récupérer tous pour pagination + filtre
        if (!cancelled && rows) setPosts(rows);
      } catch (e) {
        if (!cancelled) setError('load-failed');
      } finally { if(!cancelled) setLoading(false); }
    })();
    return ()=> { cancelled = true; };
  }, []);

  // 🔹 Filtrage + pagination calculée
  const filtered = useMemo(() => {
    return posts.filter(p => !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.tags.some(t=>t.toLowerCase().includes(q.toLowerCase())));
  }, [posts, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  // 🔹 Reset recherche + pagination
  const resetAll = () => { setQ(''); setPage(1); };

  return (
    <div className="min-h-screen bg-[var(--rose-50)]">
      {jessicaContext ? <JessicaNav /> : <PublicNav />}
      <main className="pt-20 pb-28 px-6">
        <div className="max-w-[1200px] mx-auto">

          {/* Header */}
          <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-extrabold text-[var(--slate-900)]">{t('blog.title','Stories & Impact')}</h1>
              <p className="text-[14px] text-[var(--slate-600)] mt-2">{t('blog.subtitle','Updates on menstrual health education, kit distribution and community impact.')}</p>
            </div>
          </header>

          {/* 🔹 Barre de recherche */}
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rose-400)]" />
              <input
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1); }}
                placeholder={t('blog.search','Search stories...')}
                className="h-12 w-full pl-12 pr-4 rounded-full text-sm border border-[var(--rose-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--rose-400)] focus:border-[var(--rose-400)]"
              />
            </div>
            {q && <button onClick={resetAll} className="h-12 px-6 rounded-full bg-[var(--rose-400)] text-white text-sm font-medium hover:bg-[var(--rose-500)] transition-colors">{t('blog.reset','Reset')}</button>}
          </div>

          {/* Loading / Error / Empty */}
          {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=> (<div key={i} className="animate-pulse rounded-2xl border bg-white overflow-hidden" style={{borderColor:'var(--rose-200)'}}><div className="aspect-video bg-[var(--rose-100)]" /><div className="p-4 space-y-3"><div className="h-4 w-3/4 bg-[var(--rose-100)] rounded" /><div className="h-3 w-1/2 bg-[var(--rose-100)] rounded" /><div className="h-3 w-2/3 bg-[var(--rose-100)] rounded" /></div></div>))}</div>}
          {!loading && error && <div className="rounded-xl border bg-white p-6 text-center" style={{borderColor:'var(--rose-200)'}}><p className="text-[var(--rose-700)] text-sm mb-3">{t('common.error','Error')} – {t('blog.loadFail','Failed to load articles')}</p><button onClick={()=> { setLoading(true); setError(undefined); apiListBlog({ pageSize:100 }).then(r=> { setPosts(r||[]); setLoading(false); }).catch(()=> { setError('load-failed'); setLoading(false); }); }} className="h-10 px-5 rounded-full bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white text-sm">{t('common.retry','Retry')}</button></div>}
          {!loading && !error && filtered.length===0 && <div className="text-center py-20 text-[13px] text-[var(--muted-color)]">{t('blog.empty','No stories match your search.')}</div>}

          {/* 🔹 Grid posts */}
          {!loading && filtered.length>0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map(p => <BlogCard key={p.slug} post={p} />)}
            </div>
          )}

          {/* 🔹 Pagination */}
          {!loading && filtered.length>0 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              <button onClick={()=> setPage(p=>Math.max(1,p-1))} disabled={page===1} className="h-10 px-4 rounded-full border border-[var(--rose-200)] bg-white text-[var(--rose-400)] disabled:opacity-40">Prev</button>
              {Array.from({length:Math.min(totalPages,5)}).map((_,i)=>{ const n=i+1; const active=n===page; return <button key={n} onClick={()=>setPage(n)} className={`h-10 w-10 rounded-full ${active ? 'bg-[var(--rose-400)] text-white' : 'bg-white text-[var(--rose-400)] border border-[var(--rose-200)]'}`}>{n}</button>})}
              <button onClick={()=> setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="h-10 px-4 rounded-full border border-[var(--rose-200)] bg-white text-[var(--rose-400)] disabled:opacity-40">Next</button>
            </nav>
          )}

          {/* 🔹 Connect with These Stories */}
          <section className="mt-20">
            <div className="bg-gradient-to-br from-[var(--rose-400)] to-[var(--rose-300)] rounded-3xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">Connect with These Stories</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Every story shared here represents real conversations and genuine connections with girls across Burundi. Want to learn more or get involved?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--rose-400)] font-semibold rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl">Get In Touch</Link>
                <Link to="/gallery" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[var(--rose-400)] transition-all duration-200">See the Photos</Link>
              </div>
            </div>
          </section>

        </div>
      </main>
      {jessicaContext ? <JessicaFooter /> : <PublicFooter />}
      <JessicaChatAssistant />
    </div>
  );
};

export default BlogIndexPage;
