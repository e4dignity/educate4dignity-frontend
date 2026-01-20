// Mock e-learning data & simple in-memory query helpers.
// This mirrors the lightweight approach used for blog/resources pages.
// In future, replace with real API calls (see spec in conversation).
import { elearningStore } from '../services/elearningStore';

export interface LessonSummary {
  title: string;
  slug: string;
  summary: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_minutes: number;
  tags?: string[];
  topic?: string;
  cover_image_url?: string | null;
  published_at: string; // ISO date
  is_public: boolean;
}

export interface LessonDetail extends LessonSummary {
  updated_at: string;
  body_sections: Array<{ h2: string; html?: string; links?: { label: string; url: string }[] }>;
  quick_tip?: string;
}

export interface ModuleRecord {
  title: string;
  slug: string;
  summary: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  cover_image_url?: string | null;
  estimated_minutes_total: number;
  lessons_count: number;
  downloads?: { label: string; url: string }[];
  related?: Array<{ title: string; slug: string; summary: string; stats: string; tags?: string[] }>;
  is_public: boolean;
}

// Seed lessons (single module mock)
const lessons: LessonDetail[] = [
  {
    title: 'MHM basics: period health 101',
    slug: 'mhm-basics-101',
    summary: 'Track your cycle, stay prepared with a small pouch, nourish well, and know when to seek care.',
    level: 'Beginner',
    duration_minutes: 8,
    tags: ['MHM', 'Education'],
    topic: 'MHM',
  cover_image_url: '/photos/course/Generated Image October 03, 2025 - 9_00AM.png',
    published_at: '2025-05-10',
    updated_at: '2025-05-01',
    is_public: true,
    body_sections: [
      { h2: 'Understanding your cycle & preparation', html: `
        <p>The cycle begins on the first day of bleeding and ends the day before the next period. The length varies from person to person, especially in the first years. Writing your dates in a notebook, a phone calendar, or on a small bead bracelet helps you prepare for classes, exams, and sports. Always keep a discreet pouch with supplies, a wipe, a waterproof bag, and spare underwear.</p>
      ` },
      { h2: 'Nutrition, self‑care & when to seek help', html: `
        <p>Eating local, varied foods supports your energy: beans, groundnuts, dried or fresh fish (ndakala, dagaa), green vegetables such as cassava leaves or amaranth, whole grains like millet or sorghum, and seasonal fruits like mango or guava. Clean water and regular sleep help as well. Mild cramps are common. Heat from a hot water bottle, walking, and gentle stretches often bring relief. Seek care if bleeding lasts more than seven days, if you need to change a product every hour, if pain stops your normal activities, or if you feel very weak. At school and at home, you have the right to dignity, privacy, and to be listened to.</p>
      ` },
      { h2: 'Download & reference', links: [
        { label: 'MoH — Menstrual Cycle (PDF)', url: 'https://www.moh.gov.sa/en/awarenessplateform/WomensHealth/Documents/Menstrual-Cycle.pdf' },
        { label: 'Cornell resource (PDF)', url: 'https://ecommons.cornell.edu/server/api/core/bitstreams/3ee2fed5-bd6d-49cf-8141-4cc02acfd938/content' }
      ] }
    ],
    quick_tip: 'Note your dates and carry a small pouch (pad, soap, bag, spare underwear). Preparation reduces stress.'
  },
  {
    title: 'Materials & safe use',
    slug: 'materials-safe-use',
    summary: 'Options and safety: how to choose, change, wash, and dry with dignity.',
    level: 'Beginner',
    duration_minutes: 7,
    tags: ['MHM'],
    topic: 'MHM',
  cover_image_url: '/photos/course/Generated Image October 03, 2025 - 9_15AM.png',
    published_at: '2025-05-12',
    updated_at: '2025-05-12',
    is_public: true,
    body_sections: [
      { h2: 'Choosing what fits you', html: `
        <p>There are several options depending on budget and access to water: disposable pads, reusable pads sewn by local artisans, period underwear, tampons, and menstrual cups. Choose based on your flow, your activities, and whether you can change discreetly at school or in the market. For sports, some prefer tampons or a cup. For the night, a long pad or period underwear can feel more secure.</p>
      ` },
      { h2: 'Safety and cleaning', html: `
        <p>Safety starts with washing your hands. Change disposable products every 4–6 hours and throw them in a bin. Do not put them in the latrine if it could cause a blockage. For reusables, rinse first with cold water, wash with soap, rinse until the water runs clear, then dry completely in the sun, which helps kill microbes. If you cannot dry them outside, lightly iron them to finish drying and store them in a clean bag. For a cup, empty it, rinse with clean water, and boil it for a few minutes between cycles when possible. If you notice a strong odor, fever, or severe pain, seek advice from a health worker.</p>
      ` },
      { h2: 'Download & reference', links: [
        { label: 'Fistula Care — Female reproductive system (PDF)', url: 'https://fistulacare.org/wp-content/uploads/pdf/Training/Module_3_Female_reproductive_system_Fistula_Care.pdf' },
        { label: 'MoH — Menstrual Cycle (PDF)', url: 'https://www.moh.gov.sa/en/awarenessplateform/WomensHealth/Documents/Menstrual-Cycle.pdf' }
      ] }
    ],
    quick_tip: 'Wash hands first; rinse cold, wash with soap, rinse clear, and dry fully in the sun (or finish with a light iron). Store clean and dry.'
  },
  {
    title: 'Myths & stigma',
    slug: 'myths-stigma',
    summary: 'Periods are healthy; myths don’t limit study, sport, or life. Respectful talk reduces stigma.',
    level: 'Beginner',
    duration_minutes: 6,
    tags: ['MHM'],
    topic: 'MHM',
  cover_image_url: '/photos/course/Generated Image October 02, 2025 - 9_21AM.png',
    published_at: '2025-05-14',
    updated_at: '2025-05-14',
    is_public: true,
    body_sections: [
      { h2: 'Facts about periods', html: `
        <p>Periods are not dirty. They show that the body is renewing itself and working well. A girl can go to school, play football, dance, or swim if she feels comfortable and her protection is secure. Each person chooses the product that fits her body, budget, and activities; the priority is hygiene and comfort. The first period does not mean someone is ready for couple life or motherhood; adolescence is a time for study, dreams, and building confidence. Menstrual cycles do not truly synchronize between friends; when dates look similar it is usually coincidence.</p>
      ` },
      { h2: 'Reducing stigma, building dignity', html: `
        <p>Shame grows in silence. In many African families and schools, we move forward by speaking calmly with a big sister, an auntie, a trusted “mama adviser,” a teacher, or a community health worker. Using simple words in the local language helps everyone understand. Keep a small pouch with supplies and spare underwear so you feel safe at school or in the market. If someone makes jokes or spreads a myth, answer gently that it is not correct and continue with your day. Knowledge, respect, and solidarity reduce stigma and protect dignity.</p>
      ` },
      { h2: 'Download & reference', links: [
        { label: 'Cornell resource (PDF)', url: 'https://ecommons.cornell.edu/server/api/core/bitstreams/3ee2fed5-bd6d-49cf-8141-4cc02acfd938/content' },
        { label: 'ULiège — Thesis (PDF)', url: 'https://matheo.uliege.be/bitstream/2268.2/12225/5/TFE%20final%20-%20Manon%20Beusen.pdf' }
      ] }
    ],
    quick_tip: 'Use simple words in your local language. Answer myths calmly and keep going—knowledge and kindness reduce stigma.'
  },
  {
    title: 'Healthy practices',
    slug: 'healthy-practices',
    summary: 'Frequency, hygiene, safe disposal.',
    level: 'Beginner',
    duration_minutes: 7,
    tags: ['MHM'],
    topic: 'MHM',
  cover_image_url: '/photos/course/Generated Image October 03, 2025 - 9_04AM (1).png',
    published_at: '2025-05-16',
    updated_at: '2025-05-16',
    is_public: false,
    body_sections: [
      { h2: 'Change frequency', html: `<p>Change every 4–6 hours or sooner if needed. Keep a spare pad and a small bag for used pads. Plan ahead for long trips or exams.</p>` },
      { h2: 'Handwashing', html: `<p>Wash with soap and water before and after changing. If water is limited, carry a small soap and use a tippy‑tap or sanitizer as a backup.</p>` },
      { h2: 'Disposal', html: `<p>Follow local guidance. For disposables: wrap and place in a bin or pit—do not flush. For reusables: wash and reuse; dispose only if damaged.</p>` },
      { h2: 'Cramps & self‑care', html: `<p>Warmth, gentle movement, and hydration help. If pain is severe or doesn’t improve, seek advice from a health worker.</p>` },
      { h2: 'Seeking care', html: `<p>Go to a clinic for persistent pain, rash, fever, or unusual bleeding. It’s okay to ask for help.</p>` },
      { h2: 'Download & reference', links: [ { label:'Classroom quick poster (PDF)', url:'/files/classroom-quick-poster.pdf' } ] }
    ],
    quick_tip: 'A small “comfort plan” (water, warm cloth, quiet corner) reassures learners on tough days.'
  },
  {
    title: 'Packing a discreet school kit',
    slug: 'packing-discreet-school-kit',
    summary: 'What to pack, where to store, and how to plan handwashing at school.',
    level: 'Beginner',
    duration_minutes: 5,
    tags: ['MHM','School'],
    topic: 'MHM',
  cover_image_url: '/photos/Dossier/Generated Image October 02, 2025 - 8_50AM (1).png',
    published_at: '2025-05-18',
    updated_at: '2025-05-18',
    is_public: false,
    body_sections: [
      { h2: 'Checklist', html: `<ul><li>Reusable pad (x2)</li><li>Small breathable pouch</li><li>Wipes or tissue</li><li>Small soap bar</li><li>Bag for used pads</li></ul>` },
      { h2: 'Privacy routine', html: `<p>Agree on a simple signal with a teacher. Use known private spots. Keep one spare pad in a pocket you can reach quickly.</p>` },
      { h2: 'Handwashing plan', html: `<p>Know where water and soap are available. If none, carry a small soap and use a tippy‑tap or sanitizer as a backup.</p>` },
      { h2: 'If things go wrong', html: `<p>If a stain happens, wrap a spare cloth around the waist, change into a fresh pad, and take three calm breaths. It happens—and it’s okay.</p>` }
    ],
    quick_tip: 'Keep the kit in the same pocket every day—less to think about when you need it fast.'
  },
  {
    title: 'Care guide for caregivers',
    slug: 'care-guide-caregivers',
    summary: 'Simple support at home: laundering, drying, and talking about periods.',
    level: 'Beginner',
    duration_minutes: 6,
    tags: ['Caregivers','Home'],
    topic: 'MHM',
  cover_image_url: '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    published_at: '2025-05-19',
    updated_at: '2025-05-19',
    is_public: false,
    body_sections: [
      { h2: 'Laundry routine', html: `<p>Rinse first, wash with soap, rinse clear, and dry fully. Help set up a drying line where air and sunlight can reach.</p>` },
      { h2: 'Conversation starters', html: `<ul><li>“How did this month go? Anything that felt hard?”</li><li>“Do you have enough pads for next week?”</li><li>“What would make school days easier?”</li></ul>` },
      { h2: 'Money‑smart view', html: `<p>Reusable pads save money across the year when cleaned well. Plan a small monthly budget for soap and replacements.</p>` },
      { h2: 'When to seek care', html: `<p>Persistent pain, rash, strong odor, or unusual bleeding warrant a clinic visit. Trust your instincts as a caregiver.</p>` }
    ],
    quick_tip: 'Praise small wins (washing well, packing a pouch). Confidence grows from consistency.'
  }
];

const moduleRecord: ModuleRecord = {
  title: 'MHM Essentials',
  slug: 'mhm-essentials',
  summary: 'Basics of menstrual health, reusable kits, myths & healthy practices.',
  level: 'Beginner',
  tags: ['MHM','Education'],
  cover_image_url: null,
  // Optional module cover can use a generic placeholder
  // cover_image_url: '/images/placeholder-generic.svg',
  estimated_minutes_total: lessons.filter(l=> l.is_public).reduce((a,l)=> a + l.duration_minutes, 0),
  lessons_count: lessons.filter(l=> l.is_public).length,
  downloads: [
    { label:'One-pager (PDF)', url:'/files/mhm-onepager.pdf' },
    { label:'Facilitator checklist (PDF)', url:'/files/facilitator-checklist.pdf' }
  ],
  related: [
    { title:'WASH in Schools', slug:'wash-in-schools', summary:'Water & hygiene basics.', stats:'3 lessons • ~22 min', tags:['School','WASH'] },
    { title:'Privacy & Consent', slug:'privacy-consent', summary:'Photos & anonymization.', stats:'2 lessons • ~14 min', tags:['Policy','Privacy'] }
  ],
  is_public: true
};

// Helpers to layer dynamic admin-created lessons over the static seeds
function storePublishedSummaries(): LessonSummary[] {
  return elearningStore
    .list()
    .filter(r => r.status === 'published')
    .map(r => ({
      title: r.title,
      slug: r.slug,
      summary: r.summary,
      level: r.level,
      duration_minutes: r.duration_minutes,
      tags: r.tags,
      topic: r.topic,
      cover_image_url: r.cover_image_url,
      published_at: r.published_at,
      is_public: true,
    } as LessonSummary));
}

function storeDetail(slug: string): LessonDetail | undefined {
  const rec = elearningStore.get(slug);
  if (!rec || !rec.published_at) return undefined;
  return {
    title: rec.title,
    slug: rec.slug,
    summary: rec.summary,
    level: rec.level,
    duration_minutes: rec.duration_minutes,
    tags: rec.tags,
    topic: rec.topic,
    cover_image_url: rec.cover_image_url,
    published_at: rec.published_at,
    updated_at: rec.updated_at || rec.published_at,
    is_public: true,
    body_sections: [ { h2: 'Lesson', html: rec.body_html } ],
  } as LessonDetail;
}

function combinedPublic(): LessonSummary[] {
  return [...lessons, ...storePublishedSummaries()].filter(l => l.is_public).map(l => ({
    title: l.title,
    slug: l.slug,
    summary: (l as any).summary,
    level: l.level,
    duration_minutes: (l as any).duration_minutes,
    tags: (l as any).tags,
    topic: (l as any).topic,
    cover_image_url: (l as any).cover_image_url,
    published_at: (l as any).published_at,
    is_public: true,
  }));
}

// Public outline convenience (would be filtered for public lessons only)
export function getModuleOutline(moduleSlug: string) {
  if (moduleSlug !== moduleRecord.slug) return [];
  const base = lessons.filter(l => l.is_public);
  const store = storePublishedSummaries();
  const merged = [...base, ...store];
  return merged.map((l,idx) => ({
    title: (l.title || '').replace(': period health 101',''),
    slug: l.slug,
    order_index: idx+1,
    is_public: l.is_public,
  }));
}

export function getModule(slug: string): ModuleRecord | undefined {
  return slug === moduleRecord.slug ? moduleRecord : undefined;
}

export function listLessons(params: { q?: string; topic?: string; level?: string; length?: string; sort?: string; page?: number; pageSize: number }) {
  const { q='', topic='', level='', length='', sort='newest', page=1, pageSize } = params;
  let pool: LessonSummary[] = combinedPublic();
  if(q) pool = pool.filter(l => (l.title + l.summary).toLowerCase().includes(q.toLowerCase()));
  if(topic) pool = pool.filter(l => l.topic === topic);
  if(level) pool = pool.filter(l => l.level === level);
  if(length){
    pool = pool.filter(l => {
      if(length==='<=5') return l.duration_minutes <=5;
      if(length==='6-10') return l.duration_minutes >=6 && l.duration_minutes <=10;
      if(length==='11-15') return l.duration_minutes >=11 && l.duration_minutes <=15;
      if(length==='15+') return l.duration_minutes >15;
      return true;
    });
  }
  if(sort==='newest') pool = pool.slice().sort((a,b)=> b.published_at.localeCompare(a.published_at));
  if(sort==='oldest') pool = pool.slice().sort((a,b)=> a.published_at.localeCompare(b.published_at));
  if(sort==='shortest') pool = pool.slice().sort((a,b)=> a.duration_minutes - b.duration_minutes);
  if(sort==='longest') pool = pool.slice().sort((a,b)=> b.duration_minutes - a.duration_minutes);
  const total = pool.length;
  const start = (page-1)*pageSize;
  const items = pool.slice(start, start + pageSize);
  return { items, total, page };
}

export function getLessonDetail(slug: string): LessonDetail | undefined {
  const fromStore = storeDetail(slug);
  if (fromStore) return fromStore;
  return lessons.find(l => l.slug === slug && l.is_public);
}

export function getRelatedLessons(slug: string) {
  // simplified: pick two different lessons
  const pool = combinedPublic();
  const others = pool.filter(l => l.slug !== slug).slice(0,2).map(l => ({ title: l.title, slug: l.slug, level: l.level, duration_minutes: l.duration_minutes, cover_image_url: l.cover_image_url }));
  return others;
}

// Analytics placeholders
export function logEvent(name: string, payload?: any){
  // eslint-disable-next-line no-console
  console.log(name, payload||{});
}
