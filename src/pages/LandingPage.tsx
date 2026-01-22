import React, { useState, useEffect, Suspense } from 'react';
import { Users, Heart, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiListBlog, BlogPostSummary } from '../services/apiBlog';
import * as apiPublic from '../services/apiPublic';
import { Project } from '../types';
import { useTranslation } from 'react-i18next';
import ProjectCard from '../components/ProjectCard';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import PublicFooter from '../components/layout/PublicFooter';
import PublicNav from '../components/layout/PublicNav';
import { impactMetrics } from '../data/metrics';
import CountUp from '../components/ui/CountUp';
import Reveal from '../components/ui/Reveal';
import { ImageWithSpinner } from '../components/ui/ImageWithSpinner';


// Lazy load composants lourds
const InteractiveWorldMap = React.lazy(() => import('../components/InteractiveWorldMap'));
const Chatbot = React.lazy(() => import('../components/ui/Chatbot').then(module => ({ default: module.Chatbot })));
const WorkflowDiagram = React.lazy(() => import('../components/ui/WorkflowDiagram'));

// Helper timeout
function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<BlogPostSummary[]>([]);

  // FETCH PROJECTS
  useEffect(()=> {
    let mounted = true;

    const cached = localStorage.getItem('landing_projects');
    if (cached) setActiveProjects(JSON.parse(cached));

    (async ()=> {
      try {
        const featured = await withTimeout(apiPublic.apiListFeaturedProjects(3), 2500);
        if (!mounted || !featured?.length) return;

        const photoPool = [
          '/photos/Others/Luiru1.jpg',
          '/photos/Others/luiru5.jpg',
          '/photos/Others/luiru6.jpg',
          '/photos/Others/B5.jpg',
          '/photos/Others/B10.jpg'
        ];
        let pIdx = 0;

        const mapped: Project[] = featured.map((r) => ({
          id: r.id,
          title: r.name,
          description: r.short || '',
          type: 'distribution',
          status: 'active',
          budget: 0,
          raised: 0,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          location: r.location || '',
          thumbnail: r.coverImage || '',
          video: '',
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        const hydrated = mapped.map(pr => {
          const needsFallback = !pr.thumbnail || pr.thumbnail.endsWith('.svg');
          return needsFallback
            ? { ...pr, thumbnail: photoPool[pIdx++ % photoPool.length] }
            : pr;
        });

        localStorage.setItem('landing_projects', JSON.stringify(hydrated));
        if (mounted) setActiveProjects(hydrated);
      } catch {
        // ignore
      }
    })();

    return () => { mounted = false; };
  }, []);

  // FETCH BLOG STORIES
  useEffect(() => {
    let mounted = true;

    const cached = localStorage.getItem('landing_stories');
    if (cached) setStories(JSON.parse(cached));

    (async () => {
      try {
        const rows = await withTimeout(apiListBlog({ page: 1, pageSize: 3 }), 2500);
        if (!mounted || !rows?.length) return;

        localStorage.setItem('landing_stories', JSON.stringify(rows));
        if (mounted) setStories(rows);
      } catch {
        // ignore
      }
    })();

    return () => { mounted = false; };
  }, []);

  // IntersectionObserver lazy init
  useEffect(()=> {
    requestIdleCallback(() => {
      const groups = document.querySelectorAll('[data-stagger-group]');
      if(!groups.length) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            const container = entry.target as HTMLElement;
            const items = Array.from(container.querySelectorAll('.card-fade')) as HTMLElement[];
            items.forEach((el, idx) => {
              el.style.transitionDelay = `${idx * 80}ms`;
              requestAnimationFrame(()=> el.classList.add('in'));
            });
            io.unobserve(container);
          }
        });
      }, { threshold: 0.2 });
      groups.forEach(g => io.observe(g));
    });
  }, [activeProjects]);

  const partnerLogos = [
    { src: '/photos/partener/deerfield_academy_green_black_lock_up_horizontal.jpg', alt: 'Deerfield Academy' },
    { src: '/photos/partener/LE CRES.png', alt: 'LE CRES' },
    { src: '/photos/partener/images.png', alt: 'UNICEF' }
  ];

  return (
  <div className="min-h-screen" style={{ background: 'var(--color-primary-light)' }}>
    <PublicNav />
    <main>
      {/* HERO */}
    <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-14 min-h-[520px] md:min-h-[640px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ImageWithSpinner src="/photos/Others/Luiru1.jpg" alt="Hero background" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.24) 100%), radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.38) 100%)',
          mixBlendMode: 'normal'
        }} />
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.20)' }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl space-y-6 bg-white/55 backdrop-blur-md rounded-xl px-8 py-8 shadow-sm ring-1 ring-white/40">
          <h1 className="font-extrabold text-[40px] leading-[44px] sm:text-[48px] sm:leading-[50px] md:text-[52px] md:leading-[56px]" style={{ color: 'var(--color-text-primary)' }}>
            {t('landing.title','Transform menstrual health education in East Africa')}
          </h1>
          <p className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {t('landing.subtitle','We break taboos, educate communities, and provide sustainable solutions so every girl can manage her period with dignity.')}
          </p>
          <p className="text-sm font-semibold" style={{ color: 'var(--rose-700)' }}>
            {t('landing.valueProp','Because no girl should miss school because of her period')}
          </p>
          <div className="flex gap-3 flex-wrap pt-2">
            <Link to="/donate" className="btn-donate">{t('landing.makeDonation','Donate Now')}</Link>
            <Link to="/projects" className="btn-outline-rose">{t('landing.exploreProjects','See Active Projects')}</Link>
          </div>
        </div>
      </div>
    </section>

        {/* Immediate Impact Stats (moved up) */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-8 pb-12" id="impact-top">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" data-stagger-group>
            {impactMetrics.map((m) => {
              const format = (v: number) => {
                switch(m.formatter){
                  case 'percent': return Math.round(v) + '%';
                  case 'money': {
                    const base = (v>=1000) ? (v/1000).toFixed(v>=100000 ? 0:1) + 'k' : v.toString();
                    return '$' + base;
                  }
                  default: return Math.round(v).toLocaleString();
                }
              };
              return (
                <div key={m.key} className="p-6 text-center rounded-lg border card-fade card-hover-lift" style={{ borderColor: 'var(--color-border)', background: 'var(--color-primary-light)' }}>
                  <div className="kpi-number mb-1">
                    <CountUp end={m.end} formatter={format} />{m.approx && '+'}
                  </div>
                  <div className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>{m.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
        
        {/* EDUCATION SECTION (image left, text right) */}
<Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-14 mt-14" id="education" delay={60}>
        <div className="max-w-7xl mx-auto grid gap-10 items-center md:grid-cols-2">
          <div className="rounded-2xl overflow-hidden border order-1 md:order-none" style={{ borderColor: 'var(--rose-200)' }}>
            <video className="w-full h-full object-cover md:h-[420px]" poster="/photos/Others/B5.jpg" controls preload="metadata" playsInline onEnded={(e) => { const v = e.currentTarget; try { v.pause(); v.currentTime = 0; v.load(); } catch(_){} }}>
              <source src="/videos/video5985359414595426492.mp4" type="video/mp4" />
              {t('education.videoFallback','Your browser does not support the video tag.')}
            </video>
          </div>
          <div className="order-2 md:order-none">
            <h2 className="font-extrabold mb-4" style={{ fontSize:'34px', lineHeight:'1.15', color:'var(--color-text-primary)' }}>{t('education.title','Why menstrual health education matters')}</h2>
            <p className="text-base font-medium mb-4" style={{ color:'var(--color-text-secondary)' }}>{t('education.lead','Knowledge and dignity keep girls learning consistently.')}</p>
            <p className="text-sm mb-3" style={{ color:'var(--color-text-secondary)' }}>{t('education.p1')}</p>
            <p className="text-sm mb-6" style={{ color:'var(--color-text-secondary)' }}>{t('education.p2')}</p>
            <Link to="/e-learning" className="btn-outline-rose text-sm">{t('education.cta','See more content about menstruation health')}</Link>
          </div>
        </div>
      </Reveal>
  {/* AUDIENCE COMBINED 3-COLUMN SECTION (moved below education) */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-16 mt-4" id="audiences-moved" delay={70}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-8" style={{fontSize:'30px',color:'var(--color-text-primary)'}}>{t('audience.overview.title', 'Paths, impact and collaboration')}</h2>
            <div className="grid gap-6 md:grid-cols-3" data-stagger-group>
              {/* Card 1: Beneficiaries */}
              <div className="card-fade info-card flex flex-col" aria-labelledby="aud-card-beneficiaries">
                <div className="top-accent" />
                <div className="flex items-center gap-2 mt-3 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--rose-100)] text-[var(--rose-600)] border border-[var(--rose-200)]"><Users className="w-4 h-4" /></div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--rose-600)]">{t('audience.labels.beneficiaries','Beneficiaries')}</span>
                </div>
                <h3 id="aud-card-beneficiaries" className="font-bold mb-4" style={{color:'var(--color-text-primary)',fontSize:'20px'}}>{t('audience.beneficiaries.sectionTitle')}</h3>
                <ul className="space-y-3 text-sm flex-1" style={{color:'var(--color-text-secondary)'}}>
                  {[t('audience.beneficiaries.p1'),t('audience.beneficiaries.p2'),t('audience.beneficiaries.p3'),t('audience.beneficiaries.p4')].map((txt,i)=>(
                    <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--rose-500)] leading-snug">{txt}</li>
                  ))}
                </ul>
              </div>
              {/* Card 2: Donors */}
              <div className="card-fade info-card alt flex flex-col" aria-labelledby="aud-card-donors">
                <div className="top-accent" />
                <div className="flex items-center gap-2 mt-3 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--slate-900)] text-white border border-[var(--slate-700)]"><Heart className="w-4 h-4" /></div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--slate-800)]">{t('audience.labels.donors','Donors')}</span>
                </div>
                <h3 id="aud-card-donors" className="font-bold mb-4" style={{color:'var(--color-text-primary)',fontSize:'20px'}}>{t('audience.donors.sectionTitle')}</h3>
                <ul className="space-y-3 text-sm font-medium flex-1" style={{color:'var(--color-text-secondary)'}}>
                  {[t('audience.donors.i1'),t('audience.donors.i2'),t('audience.donors.i3')].map((txt,i)=>(
                    <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--rose-500)] leading-snug">{txt}</li>
                  ))}
                </ul>
                <div className="text-[12px] mt-4 font-semibold" style={{color:'var(--rose-700)'}}>{t('audience.donors.transparency')}</div>
              </div>
              {/* Card 3: Partners */}
              <div className="card-fade info-card secondary flex flex-col" aria-labelledby="aud-card-partners">
                <div className="top-accent" />
                <div className="flex items-center gap-2 mt-3 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--rose-100)] text-[var(--rose-600)] border border-[var(--rose-200)]"><Building2 className="w-4 h-4" /></div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--rose-600)]">{t('audience.labels.partners','Partners')}</span>
                </div>
                <h3 id="aud-card-partners" className="font-bold mb-4" style={{color:'var(--color-text-primary)',fontSize:'20px'}}>{t('audience.partners.sectionTitle')}</h3>
                <ul className="space-y-3 text-sm font-medium flex-1" style={{color:'var(--color-text-secondary)'}}>
                  {[t('audience.partners.i1'),t('audience.partners.i2'),t('audience.partners.i3')].map((txt,i)=>(
                    <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--rose-500)] leading-snug">{txt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
  {/* Removed the two pedagogy/menstrual health info cards per request. Guard any leftover legacy sections by not rendering them. */}
        {/* STORIES */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="stories" delay={80}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-6" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.storiesTitle','Real voices, real change')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3" data-stagger-group>
              {stories.map((s, idx) => {
                // Replace card images with curated local assets from public/photos/Others as requested
                const othersPool = [
                  '/photos/Others/Luiru1.jpg',
                  '/photos/Others/luiru5.jpg',
                  '/photos/Others/luiru6.jpg',
                  '/photos/Others/B5.jpg',
                  '/photos/Others/B10.jpg',
                ];
                const img = othersPool[idx % othersPool.length];
                const quote = s.title.startsWith('“') ? s.title : `“${s.title}”`;
                return (
                  <Link
                    key={s.id}
                    to={`/blog/${s.slug}`}
                    state={{ coverOverride: img }}
                    className="p-4 rounded-lg border flex flex-col card-fade card-hover-lift h-full focus:outline-none focus:ring-2 focus:ring-[var(--rose-400)] hover:shadow-md transition"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-primary-light)' }}
                    aria-label={`Read more: ${s.title}`}
                  >
                    <div className="h-40 mb-3 rounded-md border overflow-hidden" style={{ borderColor: 'var(--rose-200)' }}>
                      <ImageWithFallback src={img} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                    <blockquote className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{quote}</blockquote>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{s.author || 'E4D'}</div>
                    <div className="text-[13px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{s.summary}</div>
                  </Link>
                );
              })}
              {stories.length === 0 && (
                <div className="text-sm text-[var(--slate-700)]">No stories published yet.</div>
              )}
            </div>
            <div className="mt-6 text-right"><Link to="/blog" className="btn-outline-rose text-sm">View all stories</Link></div>
          </div>
        </Reveal>

        {/* PROJECTS */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="projects" delay={120}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-6" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.featuredProjectsTitle','Pick a project and move it forward today')}</h2>
            <div className="grid gap-4 md:grid-cols-3" data-stagger-group>
              {activeProjects.map((p)=>(
                <div key={p.id} className="card-fade card-hover-lift">
                  <ProjectCard project={p} onSupport={()=>{/* future donate modal */}} />
                </div>
              ))}
              {activeProjects.length===0 && <div className="text-base text-[var(--slate-600)]">No active projects with cover image yet.</div>}
            </div>
            <div className="mt-6 text-right"><Link to="/projects" className="btn-outline-rose text-sm">View all projects</Link></div>
          </div>
        </Reveal>

        {/* FIELD MOMENTS GALLERY */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="field-moments" delay={240}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>
              {t('landing.momentsTitle','Locally sewn kits, women leading, girls keeping their days.')}
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3" data-stagger-group>
                    {[
                      {src:'/photos/Others/Luiru1.jpg', alt:'Women-led production, classroom context', title:'Sewn here, led by women', text:'Local women sew reusable pads. Skills grow. Income stays where it matters.'},
                      {src:'/photos/Others/luiru5.jpg', alt:'Local sewing cooperative at work', title:'Practicing together', text:'The cooperative checks every stitch so kits are comfy and ready to use.'},
                      {src:'/photos/Others/luiru6.jpg', alt:'Reusable kits materials and preparation', title:'Simple materials, easy care', text:'Breathable fabrics and clear labels make washing and drying straightforward.'},
                      {src:'/photos/Others/B5.jpg', alt:'Girls receiving guidance and kits', title:'How we learn', text:'A short, hands on lesson shows how to use, wash and pack a spare.'},
                      {src:'/photos/Others/B10.jpg', alt:'Smiles and confidence after training', title:'Confidence to stay in class', text:'With a plan and a spare in the bag, girls keep their days at school.'},
                      {src:'/photos/Others/Luiru1.jpg', alt:'Community and dignity in focus', title:'Dignity every day', text:'Good kits and clear guidance reduce stigma and make school feel normal.'}
                    ].map((g,i)=>(
                <div
                  key={i}
                  className="relative rounded-lg overflow-hidden border card-fade group"
                  style={{borderColor:'var(--color-border)'}}
                  aria-label={g.title}
                >
                  <div className="w-full aspect-[4/3] overflow-hidden bg-white relative">
                    <ImageWithFallback src={g.src} alt={g.alt} className="w-full h-full object-cover transition-all duration-300 group-hover:blur-[2px] group-hover:scale-[1.02]" />
                    {/* Hover overlay: centered explanatory text */}
                    <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center text-center p-4">
                      <div className="absolute inset-0 bg-black/45"></div>
                      <div className="relative text-white max-w-[90%] transition-transform duration-300 group-hover:scale-[1.06]">
                        <div className="font-extrabold leading-tight text-[22px] sm:text-[24px] md:text-[28px]">{g.title}</div>
                        <p className="mt-2 leading-snug text-white/95 text-[15px] sm:text-[16px] md:text-[17px]">{g.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        {/* HOW IT WORKS (Workflow Diagram) */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="how" delay={280}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-8" style={{ fontSize: '26px', color: 'var(--color-text-primary)' }}>
              {t('landing.howTitle', 'A simple model that keeps girls in school')}
            </h2>
            <div className="rounded-xl p-6 md:p-10 border" style={{ borderColor: 'var(--rose-200)', background: 'var(--rose-50)' }}>
              <Suspense fallback={null}>
                <WorkflowDiagram />
              </Suspense>
            </div>
          </div>
        </Reveal>
        {/* RELOCATED PARTNERS */}
        
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="partners" delay={300}>
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>
                {t('landing.partnersTitle','We work hand‑in‑hand with committed local partners')}
              </h2>
              <div className="rounded-2xl bg-white border p-4" style={{borderColor:'var(--rose-200)'}}>
                <div className="partner-marquee" aria-label="Partner logos carousel">
                  <div className="partner-marquee-track">
                    {[...partnerLogos, ...partnerLogos].map((p, idx)=> (
                      <img key={p.src + idx} src={p.src} alt={p.alt} loading="lazy" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        
        {/* RELOCATED MAP */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="map" delay={320}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-4" style={{ fontSize:'26px', color:'var(--color-text-primary)' }}>
              {t('landing.countriesTitle','Where your impact is already growing')}
            </h2>
            <div className="bg-white border rounded-2xl p-2 sm:p-4 md:p-6" style={{ borderColor:'var(--rose-200)' }}>
              <Suspense fallback={null}>
                <InteractiveWorldMap />
              </Suspense>
            </div>
          </div>
        </Reveal>
        {/* DONATE BANNER */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-16" id="donate-banner" delay={320}>
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl border p-10 text-center" style={{borderColor:'var(--rose-200)',background:'var(--rose-100)'}}>
              <h3 className="font-bold mb-3" style={{color:'var(--color-text-primary)',fontSize:'22px'}}>{t('landing.makeDonation','Help a girl stay in school')}</h3>
              <div className="text-sm mb-4 font-medium" style={{color:'var(--color-text-primary)'}}>$25 supports one girl for a year.</div>
              <Link to="/donate" className="btn-donate mb-2" data-analytics-id="donate_banner_btn">{t('nav.donate','Donate $25')}</Link>
              <div className="text-[12px] mt-2" style={{color:'var(--color-text-tertiary)'}}><a href="/transparency" className="underline hover:text-[var(--color-primary)]">Open costs & public evidence</a>.</div>
            </div>
          </div>
  </Reveal>
      </main>
      <PublicFooter withNewsletter topMargin={false} />
        {/* CHATBOT */}
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </div>
  );
};

export default LandingPage;
