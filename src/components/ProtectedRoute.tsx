import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/authContext';
import { UserRole } from '../types';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config';

interface Props { roles?: UserRole[]; element: React.ReactElement; }
export const ProtectedRoute: React.FC<Props> = ({ roles, element }) => {
  const { user } = useAuth();
  // In development, proactively ensure a backend token exists to avoid 401 on first admin fetch
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    let cancelled = false;
    async function ensureToken() {
      if (!import.meta.env?.DEV) { setReady(true); return; }
      // Helpers to decode exp from JWT (base64url) and check staleness
      const decodeExp = (tok: string | null): number | null => {
        if (!tok) return null;
        try {
          const parts = tok.split('.');
          const payload = parts[1];
          if (!payload) return null;
          let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
          const pad = b64.length % 4; if (pad) b64 += '='.repeat(4 - pad);
          const json = JSON.parse(atob(b64));
          return typeof json?.exp === 'number' ? json.exp : null;
        } catch { return null; }
      };
      const isStale = (tok: string | null, skewSec = 30) => {
        const exp = decodeExp(tok);
        if (!exp) return false;
        const now = Math.floor(Date.now() / 1000);
        return exp <= now + skewSec;
      };
      try {
        const access = localStorage.getItem('e4d_access_token');
        const refresh = localStorage.getItem('e4d_refresh_token');
        // If we have a token but it's stale/expired, try a refresh first
        if (access && isStale(access) && refresh) {
          try {
            const res = await fetch((API_BASE_URL?.replace(/\/$/, '') || '') + '/auth/refresh', {
              method: 'POST', headers: { ...DEFAULT_HEADERS }, body: JSON.stringify({ refreshToken: refresh }), credentials: 'omit'
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.accessToken) localStorage.setItem('e4d_access_token', String(data.accessToken));
              if (data?.refreshToken) localStorage.setItem('e4d_refresh_token', String(data.refreshToken));
            } else {
              // Refresh failed, clear tokens so we fall back to dev login below
              try { localStorage.removeItem('e4d_access_token'); localStorage.removeItem('e4d_refresh_token'); } catch {}
            }
          } catch {}
        }
        // If we still have a (non-stale) token, proceed
        const accessAfter = localStorage.getItem('e4d_access_token');
        if (accessAfter && !isStale(accessAfter)) { setReady(true); return; }
        // Attempt a dev login using seeded admin credentials
        const res = await fetch((API_BASE_URL?.replace(/\/$/, '') || '') + '/auth/login', {
          method: 'POST',
          headers: { ...DEFAULT_HEADERS },
          body: JSON.stringify({ email: 'admin@e4d.test', password: 'admin123' }),
          credentials: 'omit',
        });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.accessToken) localStorage.setItem('e4d_access_token', String(data.accessToken));
          if (data?.refreshToken) localStorage.setItem('e4d_refresh_token', String(data.refreshToken));
        }
      } catch {}
      finally {
        if (!cancelled) { setReady(true); }
      }
    }
    ensureToken();
    return () => { cancelled = true; };
  }, []);

  if (import.meta.env?.DEV) {
    if (!ready) return <div className="p-4 text-xs text-slate-600">Initialisation de la session admin…</div>;
    return element;
  }
  if(!user) return <Navigate to="/login" replace />;
  if(roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return element;
};
