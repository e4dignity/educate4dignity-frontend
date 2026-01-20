// Minimal in-memory resources store used by src/data/resources.ts
// Provides list() and get() so builds don’t fail when dynamic admin content is absent.

export interface ResourceRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'report'|'audit'|'policy'|'template'|'data'|'guide';
  year: number;
  language: 'EN'|'FR'|'EN/FR';
  file_type: 'PDF'|'DOCX'|'CSV'|'ZIP';
  file_size_bytes?: number;
  published_at?: string;
  tags?: string[];
  status: 'draft'|'published';
  visibility: 'public'|'private';
  views_30d?: number;
}

const records: ResourceRecord[] = [];

function list(): ResourceRecord[] {
  return records.slice();
}

function get(id: string): ResourceRecord | undefined {
  return records.find(r => r.id === id);
}

export const resourcesStore = { list, get };
