// Central app configuration — keep all runtime toggles here
// These are read from Vite env vars (define in .env files or your hosting environment)
export const USE_MOCK: boolean = (import.meta as any).env?.VITE_USE_MOCK === 'true';
// Default to the current origin at runtime if no build-time env is provided.
// Normalize API base so callers don't accidentally produce `/api/api/...` when they append paths.
// If the env includes a trailing `/api` we remove it here so callers can safely append `/api/...`.
const envBase: string | undefined = (import.meta as any).env?.VITE_API_URL;
let rawBase: string;
if (envBase && envBase.trim().length > 0) {
  rawBase = envBase;
} else if (typeof window !== 'undefined' && window.location && window.location.origin) {
  // Use the current origin as the backend root and assume APIs live under `/api`.
  rawBase = `${window.location.origin}/api`;
} else {
  // Fallback for non-browser environments (dev/test).
  rawBase = 'http://localhost:4000/api';
}
export const API_BASE_URL: string = rawBase.replace(/\/$/, '').replace(/\/api$/i, '');
export const API_TIMEOUT_MS = Number(((import.meta as any).env?.VITE_API_TIMEOUT_MS) || 15000);
// Dev auto login (calls /api/dev/token) is opt-in only
export const DEV_AUTO_LOGIN: boolean = ((import.meta as any).env?.VITE_DEV_AUTO_LOGIN || 'false') === 'true';

// Convenience: default JSON headers for backend APIs
export const DEFAULT_HEADERS: Record<string,string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// Versioning (useful for cache-busting or API headers)
export const APP_VERSION = (import.meta as any).env?.VITE_APP_VERSION || 'dev';
