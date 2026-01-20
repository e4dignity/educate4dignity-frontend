import { selector } from 'recoil';
import { apiListProjects } from '../services/apiPublic';
import { Project } from '../types';
import { mockProjects } from '../data/mockData';

export const publicProjectsSelector = selector<Project[]>({
  key: 'publicProjectsSelector',
  get: async () => {
    try {
      const api = await apiListProjects();
      if (api && api.length) {
        return api.map(r => ({
          id: r.id,
          title: r.name,
          description: r.short || '',
          type: 'distribution',
          status: r.status === 'completed' ? 'completed' : 'active',
          budget: 0,
          raised: 0,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          location: r.location || '',
          thumbnail: r.coverImage || '',
          video: '',
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Project));
      }
    } catch {}
    // fallback to mock
    return mockProjects as unknown as Project[];
  }
});
