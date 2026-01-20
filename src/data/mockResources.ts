export type ResourceCategory = 'report'|'audit'|'policy'|'template'|'data'|'guide';
export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  year: number;
  language: 'EN'|'FR'|'EN/FR';
  file_type: 'PDF'|'DOCX'|'CSV';
  file_size: string; // human readable
}

export const mockResources: ResourceItem[] = [
  {
    id:'r1', slug:'annual-report-2024', title:'Annual Report 2024',
    summary:'Full-year outcomes, delivery rates, and audited statements.',
    category:'report', year:2024, language:'EN', file_type:'PDF', file_size:'2.1 MB'
  },
  {
    id:'r2', slug:'independent-audit-q3-2024', title:'Independent Audit Q3 2024',
    summary:'Scope: funds flow, supplier payments, inventory reconciliation.',
    category:'audit', year:2024, language:'EN', file_type:'PDF', file_size:'1.3 MB'
  },
  {
    id:'r3', slug:'policy-data-privacy', title:'Policy: Data Privacy',
    summary:'How we anonymize beneficiary data & manage consent.',
    category:'policy', year:2025, language:'EN/FR', file_type:'PDF', file_size:'480 KB'
  },
  {
    id:'r4', slug:'template-mou-partnership', title:'Template: MOU (Partnership)',
    summary:'Draft template for local partners (schools, NGOs).',
    category:'template', year:2025, language:'EN', file_type:'DOCX', file_size:'120 KB'
  },
  {
    id:'r5', slug:'impact-dataset-2023', title:'Impact Dataset 2023',
    summary:'Kits delivered, attendance retained %, schools by region.',
    category:'data', year:2023, language:'EN', file_type:'CSV', file_size:'340 KB'
  },
  {
    id:'r6', slug:'field-guide-mhm-training', title:'Field Guide: MHM Training',
    summary:'Session design, facilitator notes, printable checklists.',
    category:'guide', year:2025, language:'EN', file_type:'PDF', file_size:'3.4 MB'
  }
];
