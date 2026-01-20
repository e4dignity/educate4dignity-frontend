import api from './apiClient';

export type DonorIndexRow = {
  id: string;
  name: string;
  email?: string;
  totalDonated: number; // dollars
  donationsCount: number;
  lastDonation?: string;
  anonymous?: boolean;
};

export async function listDonors(): Promise<DonorIndexRow[]> {
  const rows = await api.get<any[]>('/admin/donors');
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    totalDonated: r.totalDonated,
    donationsCount: r.donationsCount,
    lastDonation: r.lastDonation,
    anonymous: r.anonymous,
  }));
}

export async function getDonorProfile(id: string): Promise<{ donor: any; donations: any[] }>{
  return api.get(`/admin/donors/${id}`);
}
