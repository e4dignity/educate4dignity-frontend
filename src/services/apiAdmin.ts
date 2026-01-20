import api from './apiClient';

// Team APIs (backend guards require a valid admin JWT). Frontend callers
// should handle fallback to local stores when requests fail (401/403 or
// network errors).
export async function fetchTeamList() {
  return api.get<any[]>('/admin/team');
}

export async function fetchTeamMember(id: string) {
  return api.get<any>(`/admin/team/${encodeURIComponent(id)}`);
}

export async function createTeamMember(payload: any) {
  return api.post<any>('/admin/team', payload);
}

export async function updateTeamMember(id: string, payload: any) {
  return api.put<any>(`/admin/team/${encodeURIComponent(id)}`, payload);
}

export async function removeTeamMembers(ids: string[]) {
  return api.post<any>('/admin/team/bulk-delete', { ids });
}

// Settings APIs
export async function fetchSettings() {
  return api.get<any>('/admin/settings');
}

export async function updateSettings(patch: any) {
  return api.put<any>('/admin/settings', patch);
}

export default {
  fetchTeamList,
  fetchTeamMember,
  createTeamMember,
  updateTeamMember,
  removeTeamMembers,
  fetchSettings,
  updateSettings,
};
