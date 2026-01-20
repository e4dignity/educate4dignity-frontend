import { API_BASE_URL } from '../config';
import { api } from './apiClient';

// Gallery and Blog are handled by their respective services (apiBlog.ts, etc.)
// Donations are handled via donorsApi.ts for admin and direct API calls for public

export type PublicSummary = { 
  totalDonors: number; 
  totalAmount: number; 
  recentDonations: Array<{ amount: number; purpose: string; date: string }>; 
};

export async function apiPublicSummary(): Promise<PublicSummary|undefined> {
  if (!API_BASE_URL) return undefined;
  return api.get('/public/summary');
}

// Featured projects (simple public list)
export interface FeaturedProjectDto { id: string; name: string; coverImage?: string; location?: string; short?: string; progressPct?: number; }
export async function apiListFeaturedProjects(limit = 3): Promise<FeaturedProjectDto[]> {
  try {
    const rows = await api.get<FeaturedProjectDto[]>(`/projects/featured`, { limit });
    return Array.isArray(rows) ? rows.slice(0, limit) : [];
  } catch {
    return [];
  }
}

// Generic project listing (public)
export interface PublicProjectDto { id: string; name: string; status?: string; location?: string; short?: string; coverImage?: string; }
export async function apiListProjects(): Promise<PublicProjectDto[]> {
  try {
    const rows = await api.get<PublicProjectDto[]>(`/projects`);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}
