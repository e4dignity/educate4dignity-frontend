// Mock resource API with client-side filtering/sorting/pagination
// This will later be replaced by real backend integration.

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: string;        // pdf, audit, policy, template, dataset, guide
  year: number;
  language: string;    // en, fr, etc.
  size: string;        // e.g. '2.4 MB'
  downloads: number;
  rating?: number;
  tags: string[];
  image?: string;      // optional cover/illustration
  url: string;         // download or view link
}

export interface ResourceQuery {
  q?: string;
  types?: string[];        // filter by type
  years?: number[];        // filter years
  languages?: string[];    // filter languages
  tags?: string[];         // filter tags (OR logic)
  sort?: 'downloads' | 'year' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Canonical six resources (mirroring earlier mock intent)
const BASE: ResourceItem[] = [
  { id:'r1', title:'Annual Impact Report 2024', description:'Full transparency report with audited financials and KPI outcomes.', type:'pdf', year:2024, language:'en', size:'2.5 MB', downloads:1240, rating:4.8, tags:['report','impact','finance'], image:'/illustrations/kit_flat.svg', url:'#' },
  { id:'r2', title:'Independent Audit FY2024', description:'External financial audit summary with notes and compliance statements.', type:'audit', year:2024, language:'en', size:'1.1 MB', downloads:860, rating:4.9, tags:['audit','finance'], image:'/illustrations/distribution.svg', url:'#' },
  { id:'r3', title:'Child Protection Policy v2', description:'Operational safeguarding & child protection standards for all partners.', type:'policy', year:2025, language:'en', size:'0.6 MB', downloads:540, rating:4.7, tags:['policy','safeguarding'], image:'/illustrations/project_literacy.svg', url:'#' },
  { id:'r4', title:'Budget Template (XLSX)', description:'Reusable budgeting template with cost categories and auto totals.', type:'template', year:2025, language:'en', size:'0.2 MB', downloads:2150, rating:4.6, tags:['template','finance','planning'], image:'/illustrations/project_water.svg', url:'#' },
  { id:'r5', title:'MHM Training Dataset (Sample)', description:'Sample anonymized dataset for session attendance and retention.', type:'dataset', year:2023, language:'en', size:'310 KB', downloads:420, rating:4.5, tags:['data','training','mhm'], image:'/illustrations/session_mhm.svg', url:'#' },
  { id:'r6', title:'Field Facilitation Guide', description:'Step-by-step operational guide for school-based dignity sessions.', type:'guide', year:2025, language:'en', size:'1.9 MB', downloads:980, rating:4.8, tags:['guide','operations','training'], image:'/illustrations/hero_illustration.svg', url:'#' },
];

export async function fetchResources(query: ResourceQuery = {}): Promise<PagedResult<ResourceItem>> {
  // Simulate latency
  await new Promise(r=>setTimeout(r, 250));
  let data = [...BASE];

  const { q, types, years, languages, tags, sort='downloads', order='desc', page=1, pageSize=12 } = query;

  if (q) {
    const ql = q.toLowerCase();
    data = data.filter(r => r.title.toLowerCase().includes(ql) || r.description.toLowerCase().includes(ql) || r.tags.some(t=>t.toLowerCase().includes(ql)));
  }
  if (types && types.length) data = data.filter(r => types.includes(r.type));
  if (years && years.length) data = data.filter(r => years.includes(r.year));
  if (languages && languages.length) data = data.filter(r => languages.includes(r.language));
  if (tags && tags.length) data = data.filter(r => r.tags.some(t => tags.includes(t)));

  data.sort((a,b)=>{
    let cmp=0;
    if (sort==='downloads') cmp = a.downloads - b.downloads;
    else if (sort==='year') cmp = a.year - b.year;
    else if (sort==='title') cmp = a.title.localeCompare(b.title);
    return order==='asc'? cmp : -cmp;
  });

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1,page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = data.slice(start, start + pageSize);

  return { items, total, page: safePage, pageSize, totalPages };
}

export type { ResourceItem as Resource, ResourceQuery as ResourceFilter };
