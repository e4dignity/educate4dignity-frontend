// Service d'accès aux données du dashboard admin
// Abstraction unique: si une API REST existe -> utiliser l'endpoint, sinon fallback mock.
// Permettra de remplacer facilement la source (ex: GraphQL, Supabase, etc.)

export interface DashboardKpis {
  projects_active: number;
  collected_month: number;
  collected_total: number;
  spent_month: number;
  spent_total: number;
  beneficiaries_month: number;
  beneficiaries_total: number;
  distribution_bar: number[]; // [distribution, formation, blank]
}

export interface DashboardCharts {
  months: string[];
  bar: Record<string, number[]>; // {Collecte:number[], Planifié:number[], Dépensé:number[]}
  milestones_percent: number[];
  pie_spending: { label: string; value: number; color?: string }[];
}

export interface DashboardRecentItem {
  date: string;
  type: string;
  ref: string;
  statut: string;
  montant: number | null | undefined;
  action: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  charts: DashboardCharts;
  recent: DashboardRecentItem[];
}

import { USE_MOCK } from '../config';
import api from './apiClient';
let cloneDashboard: (() => DashboardData) | null = null;

async function fetchFromApi(signal?: AbortSignal): Promise<DashboardData> {
  // Use centralized API client to include Authorization and auto-refresh in dev.
  return api.get<DashboardData>('/admin/dashboard', undefined, { ...(signal ? { 'X-Abort': '1' } : {}) });
}

// Fallback mock only when explicitly enabled
function mockData(): DashboardData {
  if (!cloneDashboard) {
    // lazy import to avoid bundling mocks in non-mock mode
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cloneDashboard = require('../mock/db').cloneDashboard as () => DashboardData;
  }
  return (cloneDashboard as () => DashboardData)();
}

export async function getDashboardData(options?: { signal?: AbortSignal; forceMock?: boolean }): Promise<DashboardData> {
  const { signal, forceMock } = options || {};
  if (forceMock || USE_MOCK) return mockData();
  try {
    return await fetchFromApi(signal);
  } catch (e) {
    // In non-mock mode, surface error; do not fallback to mock silently
    if (USE_MOCK) {
      console.warn('[dashboardService] fallback mock après erreur:', e);
      return mockData();
    }
    throw e;
  }
}
