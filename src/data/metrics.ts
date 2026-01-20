// Centralized impact metrics; in a real app these could be fetched.
export interface ImpactMetric { key: string; end: number; sub: string; prefix?: string; suffix?: string; displaySuffix?: string; formatter?: 'percent' | 'money' | 'integer'; approx?: boolean; }

// Metrics configured for animated counters. `approx` toggles a trailing '+' if true.
export const impactMetrics: ImpactMetric[] = [
  { key:'girls_impacted', end:15000, sub:'girls reached', formatter:'integer', approx:true },
  { key:'attendance_retained', end:89, sub:'attendance retained', formatter:'percent' },
  { key:'pooled_funds', end:900000, sub:'funds raised', formatter:'money', approx:true },
  { key:'schools_public', end:20, sub:'schools reporting', formatter:'integer', approx:true }
];
