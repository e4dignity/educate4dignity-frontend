export type WorkflowEventType =
  | 'activity:submit'
  | 'activity:approve'
  | 'activity:reject'
  | 'milestone:submit'
  | 'milestone:approve'
  | 'milestone:reject'
  | 'report:submit'
  | 'beneficiaries:submit'
  | 'expense:submit'
  | 'expense:approve'
  | 'expense:reject';

export interface WorkflowEvent {
  id: string;
  projectId: string;
  activityId?: string;
  milestoneId?: string;
  type: WorkflowEventType;
  by: string; // actor label
  notes?: string;
  payload?: any;
  at: string; // ISO date
}

const KEY = 'e4d_workflow_log';

function getAll(): WorkflowEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr as WorkflowEvent[];
  } catch {
    return [];
  }
}

function saveAll(events: WorkflowEvent[]) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(KEY, JSON.stringify(events)); } catch {}
}

export function logEvent(evt: Omit<WorkflowEvent, 'id' | 'at'>): WorkflowEvent {
  const e: WorkflowEvent = { ...evt, id: 'WE' + Math.floor(Math.random() * 900000 + 100000), at: new Date().toISOString() };
  const all = getAll();
  all.push(e);
  saveAll(all);
  return e;
}

export function listEvents(filter?: Partial<Pick<WorkflowEvent, 'projectId' | 'activityId' | 'milestoneId' | 'type'>>): WorkflowEvent[] {
  let all = getAll();
  if (filter) {
    all = all.filter(ev => (
      (filter.projectId ? ev.projectId === filter.projectId : true) &&
      (filter.activityId ? ev.activityId === filter.activityId : true) &&
      (filter.milestoneId ? ev.milestoneId === filter.milestoneId : true) &&
      (filter.type ? ev.type === filter.type : true)
    ));
  }
  // sort by time desc
  return all.sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function clearEventsByActivity(activityId: string) {
  const all = getAll();
  const rest = all.filter(e => e.activityId !== activityId);
  saveAll(rest);
}

export function clearAllEvents() { saveAll([]); }
