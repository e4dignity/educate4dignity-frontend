import React from 'react';
import { ActivityCard } from './ActivityCard';
import type { ProjectActivity } from '../../../mock/db';

interface Props {
  activities: ProjectActivity[];
  onStatusChange: (id: string, status: ProjectActivity['status']) => void;
  onAddMilestone?: (activityId:string)=>void;
  onOpenActivity?: (id:string)=>void;
  onEditActivity?: (id:string)=>void;
  onValidateActivity?: (id:string)=>void;
  onRejectActivity?: (id:string)=>void;
}

const columns: { key: ProjectActivity['status']; label: string }[] = [
  { key: 'todo', label: 'A faire' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'blocked', label: 'Bloqué' },
  { key: 'done', label: 'Terminé' },
];

export const PlanKanbanBoard: React.FC<Props> = ({ activities, onStatusChange, onAddMilestone, onOpenActivity, onEditActivity, onValidateActivity, onRejectActivity }) => {
  return (
  <div className="flex gap-6 overflow-x-auto pb-1" style={{scrollbarWidth:'thin'}}>
      {columns.map(col => {
        const list = activities.filter(a => a.status === col.key);
        return (
          <div key={col.key} className="flex flex-col gap-2 min-w-[220px] w-[220px]">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-gray-600">{col.label}</div>
      <div className="flex flex-col gap-2 min-h-[160px] bg-[#FCF7FA] p-2 rounded-xl border border-gray-200 shadow-sm pb-10">
              {list.map(a => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  onStatusChange={(s) => onStatusChange(a.id, s)}
                  onAddMilestone={(id)=> onAddMilestone?.(id)}
                  onOpen={(id)=> onOpenActivity?.(id)}
                  onEdit={(id)=> onEditActivity?.(id)}
                  onValidateActivity={onValidateActivity}
                  onRejectActivity={onRejectActivity}
                />
              ))}
              {list.length === 0 && <div className="text-xs text-gray-400 italic">Vide</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
