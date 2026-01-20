import React from 'react';
import type { ProjectPhase } from '../../../mock/db';

interface Props { phases: ProjectPhase[]; }

export const PlanGanttMini: React.FC<Props> = ({ phases }) => {
  if (!phases.length) return <div className="text-xs text-gray-400">Aucune phase</div>;
  // Simple horizontal timeline representation
  const min = Math.min(...phases.map(p => new Date(p.start).getTime()));
  const max = Math.max(...phases.map(p => new Date(p.end).getTime()));
  const span = max - min || 1;

  return (
    <div className="flex flex-col gap-2">
      {phases.map(p => {
        const left = ((new Date(p.start).getTime() - min) / span) * 100;
        const width = ((new Date(p.end).getTime() - new Date(p.start).getTime()) / span) * 100;
        return (
          <div key={p.id} className="flex flex-col">
            <div className="text-xs text-gray-600 mb-1">{p.name}</div>
            <div className="relative h-3 bg-gray-100 rounded">
              <div className="absolute h-3 rounded" style={{ left: left+'%', width: width+'%', background: p.color || '#6366F1' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
