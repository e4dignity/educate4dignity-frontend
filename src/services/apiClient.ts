import { API_BASE_URL, API_TIMEOUT_MS, DEFAULT_HEADERS } from '../config';

// Single-flight refresh to avoid stampedes when many requests hit 401 at once
let refreshPromise: Promise<boolean> | null = null;

function decodeJwtExp(token: string | null): number | null {
  if (!token) return null;
  try {
    const [, payload] = token.split('.') as [string, string, string?];
    if (!payload) return null;
    // JWTs are base64url encoded (no padding, - and _ instead of + and /)
    let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    if (pad) b64 = b64 + '='.repeat(4 - pad);
    const json = JSON.parse(atob(b64));
    return typeof json?.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

function isExpiredOrStale(token: string | null, skewSeconds = 30): boolean {
  const exp = decodeJwtExp(token);
  if (!exp) return false;
  // exp is in seconds since epoch
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + skewSeconds;
}

function authHeaders() {
  try {
    const token = localStorage.getItem('e4d_access_token');
    if (token) return { Authorization: `Bearer ${token}` } as Record<string,string>;
  } catch {}
  return {} as Record<string,string>;
}

async function withTimeout<T>(p: Promise<T>, ms = API_TIMEOUT_MS): Promise<T> {
  const t = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Request timeout')), ms));
  return Promise.race([p, t]);
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  // API_BASE_URL is normalized to not end with a slash and may omit a trailing `/api`.
  // Ensure all API calls go to the backend under the `/api` prefix. Callers may
  // pass paths starting with `/api` or `/admin` or `/projects` etc. We must avoid
  // duplicating `/api` when it's already present in either the base or the path.
  let base = API_BASE_URL?.replace(/\/$/, '') || '';
  // If the caller's path already contains /api at the start, just join with base.
  if (!path.startsWith('/api')) {
    // If base doesn't already end with /api, append it so final URL becomes
    // e.g. http://host:4000/api/projects or http://host:4000/api/admin/...
    if (!base.match(/\/api$/i)) base = base + '/api';
  }
  const url = new URL(base + path);
  if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) url.searchParams.set(k, String(v)); });
  return url.toString();
}

async function performRefresh(): Promise<boolean> {
  try {
    const rt = localStorage.getItem('e4d_refresh_token');
    if (!rt) return false;
    const refreshRes = await withTimeout(fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: { ...DEFAULT_HEADERS },
      body: JSON.stringify({ refreshToken: rt }),
      credentials: 'omit'
    }));
    if (!refreshRes.ok) return false;
    const data = await refreshRes.json();
    if (data?.accessToken) localStorage.setItem('e4d_access_token', data.accessToken);
    if (data?.refreshToken) localStorage.setItem('e4d_refresh_token', data.refreshToken);
    return Boolean(data?.accessToken);
  } catch {
    return false;
  }
}

async function ensureFreshToken(): Promise<void> {
  // Proactively refresh if token is expired or about to expire
  const token = (() => {
    try { return localStorage.getItem('e4d_access_token'); } catch { return null; }
  })();
  if (!isExpiredOrStale(token)) return;
  if (!refreshPromise) refreshPromise = performRefresh().finally(() => { refreshPromise = null; });
  await refreshPromise;
}

async function request<T>(method: 'GET'|'POST'|'PATCH'|'PUT'|'DELETE', path: string, body?: any, params?: Record<string, any>, headers: Record<string,string> = {}) {
  // Small helper to actually perform the fetch
  const doFetch = () => fetch(buildUrl(path, params), {
    method,
    headers: { ...DEFAULT_HEADERS, ...authHeaders(), ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Do not include credentials across origins to avoid CORS issues; we rely on Authorization header
    credentials: 'omit'
  });

  // If token is stale, refresh first (single-flight)
  await ensureFreshToken();
  let res = await withTimeout(doFetch());

  // If unauthorized, attempt a one-time refresh using the refresh token and retry once
  if (res.status === 401) {
    try {
      if (!refreshPromise) refreshPromise = performRefresh().finally(() => { refreshPromise = null; });
      const ok = await refreshPromise;
      if (ok) {
        res = await withTimeout(doFetch());
      } else {
        // Clear stale tokens to avoid repeatedly sending expired JWTs
        try { localStorage.removeItem('e4d_access_token'); localStorage.removeItem('e4d_refresh_token'); } catch {}
      }
      // In dev, if still unauthorized, try a seeded admin login to ease local testing
      if (res.status === 401 && (import.meta as any).env?.DEV) {
        const loginRes = await withTimeout(fetch(buildUrl('/auth/login'), {
          method: 'POST',
          headers: { ...DEFAULT_HEADERS },
          body: JSON.stringify({ email: 'admin@e4d.test', password: 'admin123' }),
          credentials: 'omit'
        }));
        if (loginRes.ok) {
          const data = await loginRes.json();
          if (data?.accessToken) localStorage.setItem('e4d_access_token', data.accessToken);
          if (data?.refreshToken) localStorage.setItem('e4d_refresh_token', data.refreshToken);
          res = await withTimeout(doFetch());
        }
      }
    } catch {}
  }

  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  // Handle empty body
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json() as Promise<T>;
  return (await res.text()) as unknown as T;
}

export const api = {
  get: <T>(path: string, params?: Record<string, any>, headers?: Record<string,string>) => request<T>('GET', path, undefined, params, headers),
  post: <T>(path: string, body?: any, params?: Record<string, any>, headers?: Record<string,string>) => request<T>('POST', path, body, params, headers),
  patch: <T>(path: string, body?: any, params?: Record<string, any>, headers?: Record<string,string>) => request<T>('PATCH', path, body, params, headers),
  put: <T>(path: string, body?: any, params?: Record<string, any>, headers?: Record<string,string>) => request<T>('PUT', path, body, params, headers),
  delete: <T>(path: string, params?: Record<string, any>, headers?: Record<string,string>) => request<T>('DELETE', path, undefined, params, headers),
};

export default api;
