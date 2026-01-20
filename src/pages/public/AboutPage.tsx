import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';
import { useInView } from '../../hooks/useInView';
import { useTranslation } from 'react-i18next';
import './about-animations.css';

// New About page presentation using Tailwind-only layout and specified assets
const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  // simple in-view hooks for gentle reveals
  const hero = useInView<HTMLDivElement>();
  const vid = useInView<HTMLDivElement>();
  const mission = useInView<HTMLDivElement>();
  const vision = useInView<HTMLDivElement>();
  const approach = useInView<HTMLDivElement>();
  const founder = useInView<HTMLDivElement>();
  const team = useInView<HTMLDivElement>();

  return (
    <PublicPageShell backgroundVariant="plain">
      {/* Hero with specified image (B13) */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className={`relative rounded-xl overflow-hidden border border-base reveal from-left ${hero.inView ? 'in-view' : ''}`} ref={hero.ref}>
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: 'url(/photos/about/B13.jpg)' }}
            aria-hidden="true"
          />
          <div className="relative bg-black/40">
            <div className="px-6 sm:px-10 py-14 sm:py-20">
              <div className="rounded-xl p-5 sm:p-6 inline-block max-w-3xl text-white">
                <h1 className="text-2xl sm:text-4xl font-extrabold">{t('aboutPage.hero.title', 'About Educate4Dignity')}</h1>
                <p className="mt-2 sm:mt-3 text-[15px] sm:text-lg text-white/90">
                  {t(
                    'aboutPage.hero.subtitle',
                    'We break taboos, educate communities, and provide sustainable, reusable solutions so every girl can manage her period with dignity.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video + mission */}
      <section className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
        <div className={`rounded-xl border border-base bg-white overflow-hidden card-hover reveal from-right ${vid.inView ? 'in-view' : ''}`} ref={vid.ref}>
          <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px]">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              controls
              muted
              playsInline
              preload="metadata"
              poster="/photos/about/B13.jpg"
              aria-label={t('aboutPage.video.aria', 'Organization overview video')}
            >
              <source src="/videos/video5985359414595426492.mp4" type="video/mp4" />
              {t('aboutPage.video.unsupported', 'Your browser does not support the video tag.')}
            </video>
          </div>
          <div className="p-4 border-t border-base">
            <p className="text-[13px] leading-[19px] text-secondary">{t(
              'aboutPage.video.caption',
              'Clip from a school distribution session, capturing the energy in the room when girls receive their kits and guidance.'
            )}</p>
          </div>
        </div>

  <div className={`rounded-xl border border-base bg-white p-6 sm:p-8 card-hover reveal from-left ${mission.inView ? 'in-view' : ''}`} ref={mission.ref}>
          <h2 className="text-[20px] leading-[26px] font-semibold text-primary">{t('aboutPage.mission.title', 'Our mission')}</h2>
          <p className="mt-3 text-[14px] leading-[22px] text-primary">{t(
            'aboutPage.mission.body',
            'Across Burundi and the wider East Africa region, too many learners miss lessons during menstruation, not for lack of motivation, but because of cost, silence, inadequate WASH facilities and limited guidance.'
          )}</p>
          <ul className="mt-4 space-y-2 text-[14px] leading-[22px] text-primary list-disc pl-5">
            <li>{t('aboutPage.mission.bullets.education', 'Education: clear, stigma-free menstrual health learning.')}</li>
            <li>{t('aboutPage.mission.bullets.access', 'Access: sustainable, reusable kits & locally sourced materials.')}</li>
            <li>{t('aboutPage.mission.bullets.facilities', 'Facilities (WASH): privacy, water & handwashing that match real school contexts.')}</li>
            <li>{t('aboutPage.mission.bullets.capacity', 'Local capacity: co-building with cooperatives, teachers & health workers.')}</li>
          </ul>
        </div>
      </section>

      {/* Vision (moved directly below Video + mission) */}
  <section className={`max-w-6xl mx-auto mt-8 rounded-xl border border-base bg-white p-6 sm:p-8 card-hover reveal from-right ${vision.inView ? 'in-view' : ''}`} ref={vision.ref}>
        <h2 className="text-[18px] leading-[24px] font-semibold text-primary">{t('aboutPage.vision.title', 'Our vision')}</h2>
        <p className="mt-3 text-[14px] leading-[22px] text-primary">{t(
          'aboutPage.vision.body',
          "A region where no learner's education is interrupted by menstruation, where dignity, health, and opportunity are standard in every classroom."
        )}</p>
        <ul className="mt-4 list-disc pl-5 space-y-1 text-[14px] leading-[22px] text-primary">
          <li>{t('aboutPage.vision.bullets.schools', 'Every school equipped with practical menstrual health education and WASH facilities.')}</li>
          <li>{t('aboutPage.vision.bullets.production', 'Local women-led production sustaining affordable, reusable solutions.')}</li>
          <li>{t('aboutPage.vision.bullets.transparency', 'Transparent impact data shared to accelerate what works.')}</li>
        </ul>
      </section>

      {/* Approach */}
      <section className="max-w-6xl mx-auto mt-8 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: t('aboutPage.approach.whyTitle', 'Why it matters'),
            body: t(
              'aboutPage.approach.whyBody',
              'Education delays early marriage, improves health and multiplies community resilience. A pad is not the whole answer, but without one, too many futures shrink.'
            ),
          },
          {
            title: t('aboutPage.approach.howTitle', 'How we work'),
            body: t(
              'aboutPage.approach.howBody',
              'We listen first, co-design with schools and cooperatives, document early, publish openly and iterate to create replicable support.'
            ),
          },
          {
            title: t('aboutPage.approach.valueTitle', 'What we value'),
            body: t(
              'aboutPage.approach.valueBody',
              'Dignity, transparency and local intelligence. We remove basic health barriers so education remains uninterrupted.'
            ),
          },
        ].map((c, i) => (
          <div
            key={i}
            className={`relative group rounded-2xl border border-base bg-white/90 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-xl reveal delay-${i + 1} ${approach.inView ? 'in-view' : ''}`}
            ref={i === 0 ? approach.ref : undefined}
          >
            {/* subtle gradient top line */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200 opacity-60 group-hover:opacity-100 transition-opacity"></div>
            {/* ambient ring on hover */}
            <div aria-hidden className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-transparent group-hover:ring-rose-200/70 transition"></div>

            <h3 className="text-[18px] leading-[24px] font-semibold text-primary tracking-tight">{c.title}</h3>
            <p className="mt-2 text-[14px] leading-[22px] text-primary">{c.body}</p>
          </div>
        ))}
      </section>

      {/* Founder’s note */}
  <section className={`max-w-6xl mx-auto mt-8 rounded-xl border border-base bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start card-hover reveal from-left ${founder.inView ? 'in-view' : ''}`} ref={founder.ref}>
        <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border border-base bg-[var(--color-primary-light)] flex items-center justify-center">
          <img
            src="/photos/Team/16.png"
            alt={t('aboutPage.founder.title', 'Founder’s note')}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="space-y-3 text-[14px] leading-[22px] text-primary">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary m-0">{t('aboutPage.founder.title', 'Founder’s note')}</h2>
          <p>{t(
            'aboutPage.founder.p1',
            'I began listening to girls in Bujumbura in 2023. The pattern was simple and painful: curiosity and ambition blocked by a pad that was never there. A basic supply determining academic confidence felt unacceptable.'
          )}</p>
          <p>{t(
            'aboutPage.founder.p2',
            'Our approach now is to prototype small, evidence-light solutions, share data, and widen partnerships, always centering the student experience. Biology should not decide who sits in a classroom.'
          )}</p>
          <p className="italic">“{t('aboutPage.founder.quote', 'Dignity is not a luxury add-on. It is the quiet infrastructure of learning.')}”</p>
        </div>
      </section>

      {/* Team */}
  <section className={`max-w-6xl mx-auto mt-10 reveal from-right ${team.inView ? 'in-view' : ''}`} ref={team.ref}>
        <h2 className="text-[18px] leading-[24px] font-semibold text-primary mb-4">{t('aboutPage.team.title', 'Team')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: t('aboutPage.team.roles.opsTitle', 'Operations Lead'), body: t('aboutPage.team.roles.opsBody', 'Program logistics & cooperative coordination.'), img: '/photos/Team/001.png', alt: t('aboutPage.team.roles.opsAlt', 'Operations lead overseeing distribution workflows') },
            { title: t('aboutPage.team.roles.finTitle', 'Finance & Compliance'), body: t('aboutPage.team.roles.finBody', 'Budget discipline, transparent reporting.'), img: '/photos/Team/002.png', alt: t('aboutPage.team.roles.finAlt', 'Finance and compliance specialist') },
            { title: t('aboutPage.team.roles.eduTitle', 'Education & Research'), body: t('aboutPage.team.roles.eduBody', 'MHM content, training design, monitoring.'), img: '/photos/Team/16.png', alt: t('aboutPage.team.roles.eduAlt', 'Education & research facilitator') },
          ].map((m, i) => (
            <div key={i} className={`rounded-xl border border-base bg-white p-4 flex flex-col items-start gap-3 reveal delay-${i + 1} ${team.inView ? 'in-view' : ''}`}>
              <div className="w-16 h-16 rounded-full overflow-hidden border border-base bg-[var(--color-primary-light)]">
                <img src={m.img} alt={m.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-primary leading-[20px] m-0">{m.title}</h3>
                <p className="text-[13px] leading-[19px] text-secondary m-0">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[11px] leading-[16px] text-secondary">{t('aboutPage.team.disclaimer', 'Images are placeholders; replace with consented photos for production.')}</p>
      </section>

      

      {/* CTA */}
      <section className="max-w-6xl mx-auto mt-10">
        <div className={`p-6 rounded-xl border border-base bg-white text-center space-y-4 reveal ${hero.inView ? 'in-view' : ''}`}>
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary">{t('aboutPage.cta.title', 'Join us in restoring dignity')}</h2>
          <Link to="/donate" className="btn-donate inline-flex justify-center">{t('aboutPage.cta.donate', 'Donate')}</Link>
        </div>
      </section>
    </PublicPageShell>
  );
};

export default AboutPage;
