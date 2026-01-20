export type ResourceCategory = 'report'|'audit'|'policy'|'template'|'data'|'guide';
export type ResourceLanguage = 'EN'|'FR'|'EN/FR';
export type ResourceFileType = 'PDF'|'DOCX'|'CSV'|'ZIP';

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  year: number;
  language: ResourceLanguage;
  file_type: ResourceFileType;
  file_size_bytes?: number;
  url?: string; // optional download/external URL when available
  published_at: string; // ISO
  tags?: string[];
  views?: number;
}

export interface ResourceListParams {
  q?: string;
  type?: ResourceCategory|'';
  year?: number|'';
  lang?: ResourceLanguage|'';
  tags?: string[];
  sort?: 'newest'|'oldest';
  page?: number;
  pageSize?: number;
}

export interface ResourceListResult {
  items: ResourceItem[];
  total: number;
  page: number;
  pageSize: number;
}
