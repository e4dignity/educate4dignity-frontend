// Mock project service
import { Project, ProjectType, ProjectStatus } from '../types';
import { mockProjects } from '../data/mockData';

let inMemoryProjects: Project[] = [...mockProjects];

export interface CreateProjectInput {
  title: string;
  description: string;
  type: ProjectType;
  budget: number;
  startDate: string;
  endDate?: string;
  location: string;
  thumbnail?: string;
  video?: string;
  createdBy: string;
  organizationType?: string;
  organizationId?: string;
  country?: string;
  province?: string;
  city?: string;
  projectManagerId?: string;
  operatorIds?: string[];
  templateKey?: string;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  await new Promise(r => setTimeout(r, 400));
  if(!input.thumbnail && !input.video) throw new Error('Cover image or promo video required');
  const project: Project = {
    id: 'prj_' + Math.random().toString(36).slice(2),
    title: input.title,
    description: input.description,
    type: input.type,
    status: 'draft',
    budget: input.budget,
    raised: 0,
    startDate: input.startDate,
    endDate: input.endDate || '',
    location: input.location,
    thumbnail: input.thumbnail,
    video: input.video,
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    organizationType: input.organizationType,
    organizationId: input.organizationId,
    country: input.country,
    province: input.province,
    city: input.city,
    projectManagerId: input.projectManagerId,
    operatorIds: input.operatorIds || [],
    templateKey: input.templateKey
  };
  inMemoryProjects.unshift(project);
  return project;
}

export async function listProjects(): Promise<Project[]> {
  await new Promise(r => setTimeout(r, 200));
  return [...inMemoryProjects];
}

export async function listActivePublicProjects(): Promise<Project[]> {
  const all = await listProjects();
  return all.filter(p=> p.status==='active' && !!p.thumbnail);
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const p = inMemoryProjects.find(p => p.id === id);
  if (p) p.status = status;
  return p;
}
