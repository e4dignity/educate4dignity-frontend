import api from './apiClient';

export async function login(email: string, password: string) {
  const res = await api.post<{ accessToken: string; refreshToken: string }>('/auth/login', { email, password });
  localStorage.setItem('e4d_access_token', res.accessToken);
  localStorage.setItem('e4d_refresh_token', res.refreshToken);
  return res;
}

export async function refresh(refreshToken?: string) {
  const token = refreshToken || localStorage.getItem('e4d_refresh_token');
  if (!token) throw new Error('No refresh token');
  const res = await api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken: token });
  localStorage.setItem('e4d_access_token', res.accessToken);
  localStorage.setItem('e4d_refresh_token', res.refreshToken);
  return res;
}

export function logout() {
  localStorage.removeItem('e4d_access_token');
  localStorage.removeItem('e4d_refresh_token');
}
