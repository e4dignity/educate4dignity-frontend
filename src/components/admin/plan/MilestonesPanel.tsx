import React from 'react';
import type { ProjectMilestone } from '../../../mock/db';

interface Props { milestones: ProjectMilestone[]; onStatusChange: (id: string, status: ProjectMilestone['status']) => void; }

const statusLabels: Record<ProjectMilestone['status'], string> = {
  not_started: 'Pas démarré',
  on_track: 'OK',
  at_risk: 'Risque',
  completed: 'Fini'
};

export const MilestonesPanel: React.FC<Props> = ({ milestones, onStatusChange }) => {
  return (
    <div className="flex flex-col gap-3">
      {milestones.map(m => (
        <div key={m.id} className="rounded border p-2 bg-white shadow-sm text-xs flex flex-col gap-1">
          <div className="font-medium text-gray-700">{m.label}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              {m.targetDate && <span>Echéance: {m.targetDate}</span>}
              <span>Prog: {m.progress}%</span>
            </div>
            <select className="border rounded text-xs" value={m.status} onChange={e => onStatusChange(m.id, e.target.value as any)}>
              {Object.entries(statusLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="h-1.5 bg-gray-100 rounded">
            <div className="h-1.5 rounded bg-indigo-500" style={{ width: m.progress + '%' }} />
          </div>
        </div>
      ))}
      {milestones.length === 0 && <div className="text-gray-400 italic">Aucun jalon</div>}
    </div>
  );
};
