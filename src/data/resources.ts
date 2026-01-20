import { ResourceItem, ResourceListParams, ResourceListResult } from '../types/resources';
import { resourcesStore } from '../services/resourcesStore';

export function formatSize(bytes?: number) {
  if(bytes === undefined) return '—';
  if(bytes < 1024) return `${bytes} B`;
  const kb = bytes/1024; if(kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb/1024; return `${mb.toFixed(1)} MB`;
}

export const mockResources: ResourceItem[] = [
  {
    id:'1', slug:'annual-report-2024', title:'Annual Report 2024', summary:'Full-year outcomes, delivery rates, and audited statements.', category:'report', year:2024, language:'EN', file_type:'PDF', file_size_bytes: 2.1*1024*1024, published_at:'2025-02-01', tags:['impact','finance']
  },
  {
    id:'2', slug:'independent-audit-q3-2024', title:'Independent Audit Q3 2024', summary:'Scope: funds flow, supplier payments, inventory reconciliation.', category:'audit', year:2024, language:'EN', file_type:'PDF', file_size_bytes: 1.3*1024*1024, published_at:'2024-11-05', tags:['compliance']
  },
  {
    id:'3', slug:'policy-data-privacy', title:'Policy: Data Privacy', summary:'How we anonymize beneficiary data & manage consent.', category:'policy', year:2025, language:'EN/FR', file_type:'PDF', file_size_bytes: 480*1024, published_at:'2025-01-15', tags:['privacy','consent']
  },
  {
    id:'4', slug:'template-mou-partnership', title:'Template: MOU (Partnership)', summary:'Draft template for local partners (schools, NGOs).', category:'template', year:2025, language:'EN', file_type:'DOCX', file_size_bytes: 120*1024, published_at:'2025-03-02', tags:['partnership']
  },
  {
    id:'5', slug:'impact-dataset-2023', title:'Impact Dataset 2023', summary:'Kits delivered, attendance retained %, schools by region.', category:'data', year:2023, language:'EN', file_type:'CSV', file_size_bytes: 340*1024, published_at:'2024-12-20', tags:['data','attendance']
  },
  {
    id:'6', slug:'field-guide-mhm-training', title:'Field Guide: MHM Training', summary:'Session design, facilitator notes, printable checklists.', category:'guide', year:2025, language:'EN', file_type:'PDF', file_size_bytes: 3.4*1024*1024, published_at:'2025-04-08', tags:['training','mhm']
  }
];

export function listResources(params: ResourceListParams): ResourceListResult {
  const { q='', type='', year='', lang='', tags=[], sort='newest', page=1, pageSize=6 } = params;
  // Include store-published resources (public visibility only)
  const fromStore = resourcesStore.list().filter(r=> r.status==='published' && r.visibility==='public').map(r=> ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    category: r.category as any,
    year: r.year,
    language: r.language as any,
    file_type: r.file_type as any,
    file_size_bytes: r.file_size_bytes,
    published_at: r.published_at || new Date().toISOString(),
  tags: r.tags,
  views: (resourcesStore.get(r.id)?.views_30d),
  } as ResourceItem));
  let items = [...mockResources, ...fromStore];

  if(q) {
    const ql = q.toLowerCase();
    items = items.filter(r => r.title.toLowerCase().includes(ql) || r.summary.toLowerCase().includes(ql) || (r.tags||[]).some(t=> t.toLowerCase().includes(ql)));
  }
  if(type) items = items.filter(r => r.category === type);
  if(year) items = items.filter(r => r.year === year);
  if(lang) items = items.filter(r => r.language === lang);
  if(tags.length) items = items.filter(r => tags.every(t=> (r.tags||[]).includes(t)));
  items.sort((a,b)=> sort==='newest' ? (new Date(b.published_at).getTime() - new Date(a.published_at).getTime()) : (new Date(a.published_at).getTime() - new Date(b.published_at).getTime()));

  const total = items.length;
  const start = (page-1)*pageSize;
  const paged = items.slice(start, start+pageSize);
  return { items: paged, total, page, pageSize };
}
