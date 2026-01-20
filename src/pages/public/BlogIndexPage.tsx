import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../../components/layout/PublicNav';
import JessicaNav from '../../components/jessica/JessicaNav';
import PublicFooter from '../../components/layout/PublicFooter';
import JessicaFooter from '../../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../../components/jessica/JessicaChatAssistant';
import { useTranslation } from 'react-i18next';
import { apiListBlog, BlogPostSummary } from '../../services/apiBlog';

// Simple card component for blog posts
const BlogCard: React.FC<{ post: BlogPostSummary }> = ({ post }) => {
  const cover = post.coverImage || ''; // coverImage from API already points to Cloudinary if set
  return (
    <Link to={`/blog/${post.slug}`} className="group rounded-2xl border bg-white flex flex-col overflow-hidden hover:shadow-md transition-shadow" style={{borderColor:'var(--rose-200)'}}>
      <div className="aspect-video bg-[var(--rose-50)]">{cover ? <img src={cover} alt={post.title} className="w-full h-full object-cover" loading="lazy"/> : <div className="w-full h-full flex items-center justify-center text-[12px] text-[var(--muted-color)]">No cover</div>}</div>
      <div className="p-4 space-y-2">
        <h3 className="text-[15px] font-semibold text-[var(--slate-900)] line-clamp-2 group-hover:text-[var(--rose-700)]">{post.title}</h3>
        <p className="text-[12px] text-[var(--slate-600)]">{post.author}</p>
        <div className="flex flex-wrap gap-1 mt-1">{post.tags.slice(0,3).map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-[var(--rose-50)] text-[11px] text-[var(--rose-700)] border" style={{borderColor:'var(--rose-200)'}}>{t}</span>)}</div>
      </div>
    </Link>
  );
};

const BlogIndexPage: React.FC<{ jessicaContext?: boolean }> = ({ jessicaContext }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>(undefined);

  useEffect(()=> {
    let cancelled = false;
    (async ()=> {
      setLoading(true); setError(undefined);
      try {
        const rows = await apiListBlog({ pageSize: 24 });
        if (!cancelled && rows) setPosts(rows);
      } catch (e) {
        if (!cancelled) setError('load-failed');
      } finally { if(!cancelled) setLoading(false); }
    })();
    return ()=> { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--rose-50)]">
      {jessicaContext ? <JessicaNav /> : <PublicNav />}
      <main className="pt-20 pb-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-extrabold text-[var(--slate-900)]">{t('blog.title','Stories & Impact')}</h1>
              <p className="text-[14px] text-[var(--slate-600)] mt-2">{t('blog.subtitle','Updates on menstrual health education, kit distribution and community impact.')}</p>
            </div>
          </header>
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({length:6}).map((_,i)=> (
                <div key={i} className="animate-pulse rounded-2xl border bg-white overflow-hidden" style={{borderColor:'var(--rose-200)'}}>
                  <div className="aspect-video bg-[var(--rose-100)]" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-[var(--rose-100)] rounded" />
                    <div className="h-3 w-1/2 bg-[var(--rose-100)] rounded" />
                    <div className="h-3 w-2/3 bg-[var(--rose-100)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && error && (
            <div className="rounded-xl border bg-white p-6 text-center" style={{borderColor:'var(--rose-200)'}}>
              <p className="text-[var(--rose-700)] text-sm mb-3">{t('common.error','Error')} – {t('blog.loadFail','Failed to load articles')}</p>
              <button onClick={()=> { setLoading(true); setError(undefined); apiListBlog({ pageSize:24 }).then(r=> { setPosts(r||[]); setLoading(false); }).catch(()=> { setError('load-failed'); setLoading(false); }); }} className="h-10 px-5 rounded-full bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white text-sm">{t('common.retry','Retry')}</button>
            </div>
          )}
          {!loading && !error && posts.length===0 && (
            <div className="text-center py-20 text-[13px] text-[var(--muted-color)]">{t('blog.empty','No published stories yet.')}</div>
          )}
          {!loading && posts.length>0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map(p=> <BlogCard key={p.slug} post={p} />)}
            </div>
          )}
        </div>
      </main>
      {jessicaContext ? <JessicaFooter /> : <PublicFooter />}
      <JessicaChatAssistant />
    </div>
  );
};

export default BlogIndexPage;