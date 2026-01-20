import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import PublicNav from '../../components/layout/PublicNav';
import JessicaNav from '../../components/jessica/JessicaNav';
// Logo import removed (handled inside PublicFooter)
import NewsletterInline from '../../components/ui/NewsletterInline';
import PublicFooter from '../../components/layout/PublicFooter';
import JessicaFooter from '../../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../../components/jessica/JessicaChatAssistant';
import { findArticleBySlug } from '../../data/blogArticles';
import { BlogArticle } from '../../types/blog';
import { ArrowLeft, Share2, Copy, Check, ShieldCheck, Clock, Tag, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { mdToHtml } from '../../utils/markdown';
import { blogStore } from '../../services/blogStore';
import { transformArticleHtml } from '../../utils/mediaTransform';
import { apiGetBlog, apiTrackBlogView } from '../../services/apiBlog';

const BlogArticlePage: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const location = useLocation() as unknown as { state?: { coverOverride?: string; quote?: string; nameLine?: string; descLine?: string; fromJessica?: boolean; fromOrganization?: boolean } };
  const navigate = useNavigate();
  
  // Detect Jessica vs Organization context based on route state and referrer
  // Jessica context: Default for /blog/:slug since Jessica owns the blog
  // Organization context: Only when explicitly coming from organization pages
  const isJessicaContext = useMemo(() => {
    // Check if we have explicit context from route state
    if (location.state?.fromJessica) {
      return true;
    }
    if (location.state?.fromOrganization) {
      return false;
    }
    
    // Check referrer for organization pages
    const referrer = document.referrer;
    if (referrer.includes('/organization') || referrer.includes('/about') || 
        referrer.includes('/contact') || referrer.includes('/donate')) {
      return false;
    }
    
    // Default to Jessica context since /blog is Jessica's blog
    // This ensures consistent Jessica branding for direct navigation and Jessica blog navigation
    return true;
  }, [location.state]);
  // Prefer admin/store article if available, else fall back to static dataset
  const storeArticle = slug ? blogStore.get(slug) : undefined;
  const staticArticle: BlogArticle | undefined = slug ? findArticleBySlug(slug) : undefined;
  const [apiArticle, setApiArticle] = useState<BlogArticle | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string|undefined>(undefined);
  useEffect(()=> {
    let cancelled=false;
    if(!slug) return;
    setLoading(true); setLoadError(undefined);
    apiGetBlog(slug).then(r=> {
      if(cancelled){ return; }
      if(!r){ setApiArticle(undefined); setLoading(false); return; }
      // Map API to BlogArticle shape (ensure we use coverImageUrl field)
      const textFromHtml = (html?: string) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const txt = tmp.textContent || tmp.innerText || '';
        return txt.trim().slice(0, 220);
      };
      const mapped: BlogArticle = {
        title: r.title,
        slug: r.slug,
        category: 'impact', // API lacks category; fallback constant
        tags: r.tags || [],
        author: { id: 'api', name: r.author },
        cover_image_url: r.coverImage || '',
        published_at: r.publishedAt,
        read_minutes: 6,
        excerpt: textFromHtml(r.contentHtml),
        body_md: '',
        body_html: r.contentHtml,
      } as BlogArticle;
      setApiArticle(mapped);
      if(r.id) apiTrackBlogView(r.id).catch(()=>{});
      setLoading(false);
  }).catch(()=> { if(!cancelled){ setLoadError('load-failed'); setLoading(false); } }).finally(()=>{});
    return ()=> { cancelled=true; };
  },[slug]);
  // Helper to detect placeholder content in admin entries
  const isPlaceholder = (s?: string) => {
    if (!s) return true;
    const t = s.trim().toLowerCase();
    if (t.length < 30) return true;
    return ['content coming soon', 'coming soon', 'short intro'].some(p => t.includes(p));
  };
  // Merge admin and static: prefer admin for meta if present, prefer static for body when admin is placeholder
  const merged: BlogArticle | undefined = (() => {
    if (apiArticle) return apiArticle;
    if (!storeArticle && !staticArticle) return undefined;
    const meta = { ...(staticArticle || {}), ...(storeArticle || {}) } as BlogArticle;
    const useStaticBody = isPlaceholder(storeArticle?.body_md) && isPlaceholder(storeArticle?.body_html);
    if (useStaticBody) {
      if (staticArticle?.body_html) meta.body_html = staticArticle.body_html;
      if (staticArticle?.body_md) meta.body_md = staticArticle.body_md;
    }
    return meta;
  })();
  const article: BlogArticle | undefined = merged;
  // Prefer API-provided cover first (most up-to-date), then navigation override, then static/store fallbacks
  const coverUrl = (apiArticle?.cover_image_url || location.state?.coverOverride || staticArticle?.cover_image_url || storeArticle?.cover_image_url || '');
  const [imgSrc, setImgSrc] = useState(coverUrl);
  // Update image source when API or navigation state changes; prefer API value when available
  useEffect(() => {
    const next = (apiArticle?.cover_image_url || location.state?.coverOverride || staticArticle?.cover_image_url || storeArticle?.cover_image_url || '');
    setImgSrc(next);
  }, [slug, apiArticle, storeArticle, staticArticle, location.state]);
  const tried = useRef<{staticTried:boolean; placeholderTried:boolean}>({staticTried:false, placeholderTried:false});
  const [copied, setCopied] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if(!article) return;
    const onScroll = () => {
      if(!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight + 120; // some offset
      const scrolled = Math.min(Math.max(window.scrollY - (contentRef.current.offsetTop - 80), 0), total);
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [article]);

  const toc = useMemo(() => {
    if(!article) return [] as { id: string; text: string; level: number }[];
    const bodyMd = article.body_md || '';
    const lines = bodyMd.split(/\n/);
    const items: { id: string; text: string; level: number }[] = [];
    lines.forEach(line => {
      const h2 = line.match(/^## (.+)/);
      const h3 = line.match(/^### (.+)/);
      if(h2){
        const id = h2[1].toLowerCase().replace(/[^a-z0-9]+/g,'-');
        items.push({ id, text: h2[1], level: 2 });
      } else if(h3){
        const id = h3[1].toLowerCase().replace(/[^a-z0-9]+/g,'-');
        items.push({ id, text: h3[1], level: 3 });
      }
    });
    return items;
  }, [article]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    });
  };

  if(loading){
    return (
      <div className="min-h-screen bg-[var(--rose-50)]">
        {isJessicaContext ? <JessicaNav /> : <PublicNav />}
        <div className="max-w-[900px] mx-auto px-6 pt-24 pb-40">
          <div className="animate-pulse space-y-6">
            <div className="h-9 w-2/3 rounded-md bg-[var(--rose-100)]" />
            <div className="h-5 w-1/3 rounded-md bg-[var(--rose-100)]" />
            <div className="w-full aspect-video rounded-2xl bg-[var(--rose-100)]" />
            <div className="space-y-3 mt-8">
              {Array.from({length:6}).map((_,i)=> <div key={i} className="h-4 w-full rounded bg-[var(--rose-100)]" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if(!article){
    return (
      <div className="min-h-screen bg-[var(--rose-50)]">
        {isJessicaContext ? <JessicaNav /> : <PublicNav />}
        <div className="max-w-[1200px] mx-auto px-6 pt-28 pb-40 text-center">
          <h1 className="text-[32px] font-extrabold text-[var(--slate-900)] mb-6">{t('blog.articleNotFound','Article not found')}</h1>
          {loadError && <p className="text-[14px] text-[var(--rose-700)] mb-4">{t('common.error','Error')} – {t('blog.loadFail','Failed to load article')}</p>}
          <button onClick={()=>navigate('/blog')} className="h-11 px-6 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white font-semibold inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4"/>{t('blog.backToList','Back to blog')}</button>
        </div>
      </div>
    );
  }

  const htmlBody = mdToHtml(article.body_md);
  const withMediaTransforms = (html: string) => transformArticleHtml(html);
  // Normalize strings for equality checks (strip quotes, spaces, punctuation nuances)
  const normalize = (s?: string) => (s || '')
    .replace(/[“”"'’]/g,'')
    .replace(/\.+$/,'')
    .trim()
    .toLowerCase();
  const quoteRaw = location.state?.quote;
  const shouldShowQuote = !!quoteRaw && normalize(quoteRaw) !== normalize(article?.title);

  return (
    <div className="min-h-screen bg-[var(--rose-50)] font-[Segoe UI,ui-sans-serif,sans-serif] relative">
      {isJessicaContext ? <JessicaNav /> : <PublicNav />}
      {/* Reading progress bar */}
      <div ref={progressRef} className="fixed top-[64px] left-0 right-0 h-1 bg-[var(--rose-200)] z-40">
        <div className="h-full bg-[var(--rose-600)] transition-all" style={{width: `${progress}%`}}></div>
      </div>

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[820px_300px] gap-8">
          {/* Content */}
          <article ref={contentRef} className="space-y-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-[12px] text-[var(--slate-600)] flex flex-wrap gap-1">
              <Link to="/" className="hover:text-[var(--rose-700)]">{t('nav.home','Home')}</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-[var(--rose-700)]">{t('nav.blog','Blog')}</Link>
              <span>/</span>
              <span className="text-[var(--slate-700)]">{article.category}</span>
              <span>/</span>
              <span className="text-[var(--slate-900)] font-medium">{article.title}</span>
            </nav>

            {/* Cover */}
            {imgSrc && (
              <div className="relative rounded-2xl overflow-hidden border bg-white" style={{borderColor:'var(--rose-200)'}}>
                <div className="w-full aspect-video bg-[var(--rose-50)]">
                  <img
                    src={imgSrc}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={() => {
                      // Try static cover first if current failed and not yet tried
                      const staticCover = staticArticle?.cover_image_url || '';
                      if (!tried.current.staticTried && staticCover && imgSrc !== staticCover) {
                        tried.current.staticTried = true;
                        setImgSrc(staticCover);
                        return;
                      }
                      // Then fall back to placeholder only once
                      if (!tried.current.placeholderTried) {
                        tried.current.placeholderTried = true;
                        setImgSrc('/photos/banniere.png');
                      }
                    }}
                  />
                </div>
                {article.cover_consent_verified && (
                  <div className="absolute top-3 left-3 h-7 px-3 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur border flex items-center gap-1" style={{borderColor:'var(--rose-200)'}}>
                    <ShieldCheck className="w-4 h-4 text-[var(--rose-600)]" /> {t('blog.consentVerified','Consent verified')}
                  </div>
                )}
              </div>
            )}

            {/* Title + optional landing card lines */}
            <header className="space-y-4">
              <h1 className="text-[32px] leading-[38px] font-extrabold text-[var(--slate-900)]">
                {article.title}
              </h1>
              {shouldShowQuote && (
                <blockquote className="text-[18px] leading-[24px] font-extrabold text-[var(--slate-900)]">{quoteRaw}</blockquote>
              )}
              {location.state?.nameLine && (
                <div className="text-[14px] text-[var(--slate-800)]">{location.state.nameLine}</div>
              )}
              {location.state?.descLine && (
                <div className="text-[13px] text-[var(--slate-600)]">{location.state.descLine}</div>
              )}
              {(() => {
                // Build an HTML excerpt: prefer first <p> from body_html; else convert first paragraph of markdown/excerpt
                let headerHtml = '';
                if (article.body_html && article.body_html.trim().length) {
                  const m = article.body_html.match(/<p[\s\S]*?>[\s\S]*?<\/p>/i);
                  headerHtml = m ? m[0] : article.body_html.slice(0, 400);
                } else if (article.body_md && article.body_md.trim().length) {
                  const firstParaMd = article.body_md.split(/\n\n+/)[0];
                  headerHtml = mdToHtml(firstParaMd);
                } else if (article.excerpt && article.excerpt.trim().length) {
                  headerHtml = mdToHtml(article.excerpt);
                }
                return headerHtml ? (
                  <div
                    className="text-[15px] leading-[22px] text-[var(--slate-700)] max-w-2xl prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: withMediaTransforms(headerHtml) }}
                  />
                ) : null;
              })()}
            </header>

            {/* Byline */}
            <div className="rounded-2xl bg-white border p-5 flex flex-col gap-4" style={{borderColor:'var(--rose-200)'}}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border overflow-hidden flex items-center justify-center text-[12px] font-medium" style={{borderColor:'var(--rose-200)', background:'var(--rose-100)', color:'var(--rose-700)'}}>
                    {article.author.avatar_url ? (
                      <img src={article.author.avatar_url} alt={article.author.name} className="w-full h-full object-cover" />
                    ) : (
                      article.author.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--slate-900)] text-[14px]">{article.author.name}</div>
                    {article.author.role && <div className="text-[12px] text-[var(--slate-600)]">{article.author.role}</div>}
                  </div>
                </div>
                <div className="text-[12px] text-[var(--slate-600)] flex items-center gap-2 flex-wrap">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{article.read_minutes} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopyLink} className="h-9 px-3 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white text-[12px] font-medium inline-flex items-center gap-1">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? t('blog.copy.copied','Copied') : t('blog.copy.copy','Copy link')}
                  </button>
                  <button className="h-9 px-3 rounded-md bg-white border text-[12px] font-medium inline-flex items-center gap-1" style={{borderColor:'var(--rose-200)', color:'var(--rose-700)'}}>
                    <Share2 className="w-4 h-4"/> {t('blog.copy.share','Share')}
                  </button>
                </div>
              </div>
              {(article.category || (article.tags && article.tags.length)) && (
                <div className="flex flex-wrap gap-2">
                  {article.category && (
                    <span className="inline-flex items-center gap-1 h-7 px-3 rounded-full text-[11px] font-medium bg-[var(--rose-100)] border" style={{borderColor:'var(--rose-200)', color:'var(--rose-700)'}}>
                      <BookOpen className="w-3 h-3" /> {article.category}
                    </span>
                  )}
                  {article.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 h-7 px-3 rounded-full text-[11px] font-medium border" style={{borderColor:'var(--rose-200)', color:'var(--slate-700)'}}>
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article body */}
            {(() => {
              // Prefer merged article HTML if present; fall back to converted Markdown
              const mergedHtml = (article.body_html && article.body_html.trim().length) ? article.body_html : htmlBody;
              return (
                <div
                  className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[var(--slate-900)] prose-p:text-[14px] prose-p:leading-[22px] prose-p:text-[var(--slate-700)] prose-p:text-justify prose-a:underline prose-a:text-[var(--rose-700)] prose-blockquote:border-l-4 prose-blockquote:border-[var(--rose-300)] prose-blockquote:bg-[var(--rose-50)] prose-blockquote:p-4 prose-blockquote:rounded-xl prose-blockquote:text-[var(--slate-700)] prose-img:rounded-xl bg-white border rounded-2xl p-8"
                  style={{ borderColor: 'var(--rose-200)' }}
                  dangerouslySetInnerHTML={{ __html: withMediaTransforms(mergedHtml) }}
                />
              );
            })()}

            {/* Transparency callout removed by request */}

            {/* Author bio */}
            {article.author.bio && (
              <div className="rounded-2xl border p-6 bg-white flex gap-4" style={{borderColor:'var(--rose-200)'}}>
                <div className="w-16 h-16 rounded-full border overflow-hidden flex items-center justify-center text-[12px] font-medium" style={{borderColor:'var(--rose-200)', background:'var(--rose-100)', color:'var(--rose-700)'}}>
                  {article.author.avatar_url ? (
                    <img src={article.author.avatar_url} alt={article.author.name} className="w-full h-full object-cover" />
                  ) : (
                    article.author.name.charAt(0)
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--slate-900)] text-[14px]">{article.author.name}</div>
                  <p className="text-[13px] leading-[19px] text-[var(--slate-700)] max-w-xl">{article.author.bio}</p>
                </div>
              </div>
            )}

            {/* Related */}
            {article.related && article.related.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[18px] font-bold text-[var(--slate-900)]">{t('blog.keepReading','Keep Reading')}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {article.related.slice(0,2).map(r => {
                    const rel = findArticleBySlug(r.slug);
                    const cover = rel?.cover_image_url;
                    return (
                      <button 
                        key={r.slug} 
                        onClick={() => navigate(`/blog/${r.slug}`, { 
                          state: { 
                            coverOverride: cover,
                            fromJessica: isJessicaContext 
                          } 
                        })} 
                        className="group rounded-2xl border p-5 bg-white flex flex-col gap-3 hover:shadow-sm transition text-left w-full" 
                        style={{borderColor:'var(--rose-200)'}}
                      >
                        <div className="h-28 rounded-xl border overflow-hidden" style={{borderColor:'var(--rose-200)'}}>
                          {cover ? (
                            <img src={cover} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full bg-[var(--rose-100)] flex items-center justify-center text-[11px] text-[var(--rose-600)]">Preview</div>
                          )}
                        </div>
                        <div className="font-semibold text-[14px] leading-[20px] text-[var(--slate-900)] group-hover:text-[var(--rose-700)] line-clamp-3">{r.title}</div>
                        <div className="text-[12px] text-[var(--rose-700)] inline-flex items-center gap-1 mt-auto">{t('blog.read','Read →')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
            {toc.length > 0 && (
              <div className="rounded-2xl border bg-white p-5" style={{borderColor:'var(--rose-200)'}}>
                <h2 className="text-[14px] font-semibold text-[var(--slate-900)] mb-3">{t('blog.onThisPage','On this page')}</h2>
                <ul className="space-y-2 text-[12px] text-[var(--slate-700)]">
                  {toc.map(item => (
                    <li key={item.id} className={item.level===3 ? 'pl-4 relative before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-[var(--rose-400)] before:rounded-full':''}>
                      <a href={`#${item.id}`} className="hover:text-[var(--rose-700)] focus:outline-none focus:ring-2 focus:ring-[var(--rose-400)] rounded-sm inline-block">{item.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-2xl border bg-white p-5 overflow-hidden" style={{borderColor:'var(--rose-200)'}}>
              <div className="text-[12px] leading-[18px] text-[var(--slate-700)] mb-2">{t('blog.stayLoopDesc','Monthly round-up of impact stories and transparency updates.')}</div>
              <NewsletterInline />
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="rounded-2xl border bg-white p-5" style={{borderColor:'var(--rose-200)'}}>
                <h2 className="text-[14px] font-semibold text-[var(--slate-900)] mb-3">{t('blog.popularTopics','Popular topics')}</h2>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-medium bg-[var(--rose-100)] border" style={{borderColor:'var(--rose-200)', color:'var(--rose-700)'}}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {isJessicaContext ? <JessicaFooter /> : <PublicFooter withNewsletter />}
      
      {/* Chat Assistant */}
      <JessicaChatAssistant />
    </div>
  );
};

export default BlogArticlePage;