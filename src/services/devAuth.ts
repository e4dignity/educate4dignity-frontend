import { API_BASE_URL, DEV_AUTO_LOGIN } from '../config';

export async function fetchAndStoreDevToken() {
  // Only attempt auto dev token in dev AND when explicitly enabled
  if ((import.meta as any).env?.PROD) return false;
  if (!DEV_AUTO_LOGIN) return false;
  try {
    const base = (API_BASE_URL || '').replace(/\/$/, '');
    const url = (base.endsWith('/api') ? base : base + '/api') + '/dev/token';
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.accessToken) localStorage.setItem('e4d_access_token', data.accessToken);
    if (data?.refreshToken) localStorage.setItem('e4d_refresh_token', data.refreshToken);
    return true;
  } catch (err) {
    return false;
  }
}
