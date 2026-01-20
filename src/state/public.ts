import { selector } from 'recoil';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config';

export type LandingSummary = {
  hero: { title: string; subtitle: string };
  highlights: any[];
  metrics: { projects: number; beneficiaries: number; countries: number };
};

export const publicSummarySelector = selector<LandingSummary | undefined>({
  key: 'publicSummarySelector',
  get: async () => {
    if (!API_BASE_URL) return undefined;
    const res = await fetch(`${API_BASE_URL}/api/public/summary`, { headers: DEFAULT_HEADERS });
    if (!res.ok) return undefined;
    return res.json();
  }
});

export type FeaturedProject = { id: string; name: string; coverImage?: string; location?: string; short?: string; progressPct?: number };
export const featuredProjectsSelector = selector<FeaturedProject[] | undefined>({
  key: 'featuredProjectsSelector',
  get: async () => {
    if (!API_BASE_URL) return undefined;
    const res = await fetch(`${API_BASE_URL}/api/projects/featured`, { headers: DEFAULT_HEADERS });
    if (!res.ok) return undefined;
    return res.json();
  }
});

export type DonationStatus = { status: 'open'|'complete'|'expired' };
export const donationStatusSelector = (sessionId: string) => selector<DonationStatus | undefined>({
  key: `donationStatusSelector_${sessionId}`,
  get: async () => {
    if (!API_BASE_URL || !sessionId) return undefined;
    const res = await fetch(`${API_BASE_URL}/api/donations/session-status?session_id=${encodeURIComponent(sessionId)}`, { headers: DEFAULT_HEADERS });
    if (!res.ok) return undefined;
    return res.json();
  }
});
