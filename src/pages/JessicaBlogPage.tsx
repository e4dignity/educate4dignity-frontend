import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaLightbulb, FaBook, FaFlask, FaUsers } from 'react-icons/fa';
import JessicaNav from '../components/jessica/JessicaNav';
import JessicaFooter from '../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../components/jessica/JessicaChatAssistant';
import { imageForIndex, courseImageAlt } from '../data/imagePools';
import { blogStore } from '../services/blogStore';
import { useRecoilValueLoadable } from 'recoil';
import { blogBaseListSelector } from '../state/blog';
import { useTranslation } from 'react-i18next';

interface BlogIndexRow {
  slug: string;
  title: string;
  excerpt?: string;
  author_name: string;
  category: string;
  tags: string[];
  published_at: string;
  read_minutes?: number;
  cover_image_url?: string;
  featured?: boolean;
  author_role?: string;
}

interface BlogPost {
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
}

const JessicaBlogPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [year, setYear] = useState<number | ''>('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const landingImageBySlug = useMemo(
    () => ({
      'from-absenteeism-to-attendance': '/photos/Dossier/02.png',
      'training-day-mhm-basics': '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
      'coops-women-led-production': '/photos/Dossier/01.png',
    } as Record<string, string>),
    []
  );

  const blogApiLoadable = useRecoilValueLoadable(blogBaseListSelector);

  useEffect(() => {
    const staticPosts: BlogPost[] = blogStore
      .list()
      .filter((r) => r.status === 'published')
      .map((r, i) => ({
        id: `adm-${i + 1}`,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt || '',
        author: r.author_name || 'Jessica',
        authorRole: r.author_role || 'Founder & MHM Advocate',
        publishDate: r.published_at,
        readTime: r.read_minutes ? `${r.read_minutes} min read` : '5 min read',
        category: r.category || 'impact',
        tags: r.tags || [],
        image: r.cover_image_url || '',
        featured: r.featured || false,
      }));

    if (blogApiLoadable.state === 'hasValue') {
      const val = blogApiLoadable.contents as unknown as BlogIndexRow[];
      const mapped: BlogPost[] = val.map((r, i) => ({
        id: `api-${i + 1}`,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt || '',
        author: r.author_name || 'Jessica',
        authorRole: r.author_role || 'Founder & MHM Advocate',
        publishDate: r.published_at,
        readTime: r.read_minutes ? `${r.read_minutes} min read` : '5 min read',
        category: r.category || 'impact',
        tags: r.tags || [],
        image: r.cover_image_url || '',
        featured: r.featured || false,
      }));
      setBlogPosts(mapped.length ? mapped : staticPosts);
    } else if (blogApiLoadable.state === 'hasError') {
      setBlogPosts(staticPosts);
    } else {
      setBlogPosts(staticPosts);
    }
  }, [blogApiLoadable.state]);

  const categoryMeta: Record<string, { icon: React.ReactNode; color: string }> = {
    impact: { icon: <FaHeart className="w-4 h-4" />, color: '#f4a6a9' },
    insights: { icon: <FaLightbulb className="w-4 h-4" />, color: '#e8b4b8' },
    updates: { icon: <FaBook className="w-4 h-4" />, color: '#d4a5a8' },
    research: { icon: <FaFlask className="w-4 h-4" />, color: '#c49ca0' },
    howto: { icon: <FaUsers className="w-4 h-4" />, color: '#f4a6a9' },
  };

  const getCategoryName = (id: string) =>
    t(`blog.categories.${id}`, { defaultValue: id === 'all' ? 'All Stories' : id.charAt(0).toUpperCase() + id.slice(1) });

  const years = useMemo(
    () => Array.from(new Set(blogPosts.map((p) => new Date(p.publishDate).getFullYear()))).sort((a, b) => b - a),
    [blogPosts]
  );

  const filtered = useMemo(() => {
    return blogPosts
      .filter((p) => {
        const qq = q.toLowerCase();
        const okQ =
          !q ||
          p.title.toLowerCase().includes(qq) ||
          p.excerpt.toLowerCase().includes(qq) ||
          p.tags.some((tg) => tg.toLowerCase().includes(qq));
        const okCat = category === 'all' || p.category === category;
        const yr = new Date(p.publishDate).getFullYear();
        const okYear = !year || yr === year;
        return okQ && okCat && okYear;
      })
      .sort((a, b) =>
        sort === 'newest'
          ? new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          : new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
      );
  }, [blogPosts, q, category, year, sort]);

  const paginated = filtered.slice(0, 6);
  const getCoverFor = (slug: string, idx: number) =>
    landingImageBySlug[slug] || blogPosts.find((p) => p.slug === slug)?.image || imageForIndex(idx);

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
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search stories..."
              className="h-12 w-full max-w-[280px] pl-4 pr-4 rounded-full text-sm border border-[#f4a6a9]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a6a9]"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm">
              <option value="all">All Stories</option>
              {Object.keys(categoryMeta).map((c) => (
                <option key={c} value={c}>
                  {getCategoryName(c)}
                </option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')} className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm w-[120px]">
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="h-12 px-4 rounded-full border border-[#f4a6a9]/30 bg-white text-sm">
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </section>

        {/* Posts */}
        <section id="posts" aria-live="polite" className="min-h-[400px]">
          {paginated.length === 0 && (
            <div className="text-center py-24">
              <div className="text-xl text-[#7a6a67] mb-4">No stories match your search.</div>
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
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/photos/banniere.png';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg"
                        style={{ backgroundColor: categoryInfo.color }}
                      >
                        {categoryInfo.icon}
                        {getCategoryName(post.category)}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#5a4a47] mb-3 line-clamp-2 group-hover:text-[#f4a6a9] transition-colors">{post.title}</h3>
                    <p className="text-sm text-[#7a6a67] mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-[#7a6a67] mb-4">
                      <span className="font-medium">{post.author}</span>
                      <span>
                        {new Date(post.publishDate).toLocaleDateString()} • {post.readTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-[#f4a6a9]/10 text-[#f4a6a9] text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/blog/${post.slug}`, { state: { coverOverride: getCoverFor(post.slug, idx), fromJessica: true } })
                        }
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

        <JessicaFooter />
        <JessicaChatAssistant />
      </div>
    </div>
  );
};

export default JessicaBlogPage;
