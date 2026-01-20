import React, { useState } from 'react';
import type { ProjectActivity } from '../../../mock/db';

interface Props {
  activity: ProjectActivity;
  onStatusChange?: (s: ProjectActivity['status']) => void;
  onOpen?: (id:string)=>void;
  onEdit?: (id:string)=>void;
  onAddMilestone?: (id:string)=>void;
  onViewExpenses?: (id:string)=>void;
  onCloseActivity?: (id:string)=>void;
  onDelete?: (id:string)=>void;
  onValidateActivity?: (id:string)=>void;
  onRejectActivity?: (id:string)=>void;
}

const statusStyles: Record<ProjectActivity['status'], string> = {
  todo: 'bg-gray-100 text-gray-700 border-gray-300',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-300',
  done: 'bg-green-100 text-green-700 border-green-300',
  blocked: 'bg-red-100 text-red-700 border-red-300'
};

const statusLabel: Record<ProjectActivity['status'], string> = {
  todo: 'A faire',
  in_progress: 'En cours',
  done: 'Fait',
  blocked: 'Bloqué'
};

export const ActivityCard: React.FC<Props> = ({ activity, onStatusChange, onOpen, onEdit, onAddMilestone, onViewExpenses, onCloseActivity, onDelete, onValidateActivity, onRejectActivity }) => {
  const [menu, setMenu] = useState(false);
  const [statusMenu, setStatusMenu] = useState(false);
  const toggle = () => setMenu(m=>!m);
  const change = (s: ProjectActivity['status']) => { onStatusChange?.(s); setStatusMenu(false); };
  return (
  <div className="rounded-xl shadow-sm border p-2.5 text-sm bg-white flex flex-col gap-2 relative group min-h-[120px]">
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-gray-800 leading-snug min-w-0 break-words text-[13px] pr-4">{activity.title}</div>
        <div className="flex items-start gap-1">
          <button onClick={()=>setStatusMenu(o=>!o)} className={`text-[10px] px-2 py-0.5 rounded-full border ${statusStyles[activity.status]} font-medium whitespace-nowrap`}>{statusLabel[activity.status]}</button>
          <button aria-label="menu" onClick={toggle} className="h-5 w-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-xs">⋮</button>
        </div>
        {statusMenu && (
          <div className="absolute z-20 top-7 right-6 w-36 bg-white border rounded-md shadow-lg text-[11px] flex flex-col">
            {(['todo','in_progress','blocked','done'] as ProjectActivity['status'][]).map(s => (
              <button key={s} onClick={()=>change(s)} className="text-left px-3 py-1 hover:bg-indigo-50">{statusLabel[s]}</button>
            ))}
            <div className="border-t my-1" />
            <button onClick={()=>setStatusMenu(false)} className="px-3 py-1 text-left text-gray-500 hover:bg-gray-50">Fermer</button>
          </div>
        )}
        {menu && (
          <div className="absolute z-20 top-7 right-0 w-48 bg-white border rounded-md shadow-xl text-[11px] flex flex-col p-1">
            <MenuItem label="Ouvrir (détail)" onClick={()=>{onOpen?.(activity.id); setMenu(false);}} />
            <MenuItem label="Éditer l'activité" onClick={()=>{onEdit?.(activity.id); setMenu(false);}} />
            <MenuItem label="Ajouter un milestone" onClick={()=>{onAddMilestone?.(activity.id); setMenu(false);}} />
            {/* Admin validation actions when activité est soumise */}
            {activity.reviewStatus==='soumis' && (
              <>
                <Divider />
                <MenuItem label="Valider l’activité" onClick={()=>{onValidateActivity?.(activity.id); setMenu(false);}} />
                <MenuItem label="Rejeter l’activité" onClick={()=>{onRejectActivity?.(activity.id); setMenu(false);}} />
              </>
            )}
            <Divider />
            <MenuItem label="Marquer « En cours »" onClick={()=>{change('in_progress');}} />
            <MenuItem label="Marquer « Fait »" onClick={()=>{change('done');}} />
            <MenuItem label="Marquer « Bloqué »" onClick={()=>{change('blocked');}} />
            <Divider />
            <MenuItem label="Voir dépenses" onClick={()=>{onViewExpenses?.(activity.id); setMenu(false);}} />
            <MenuItem label="Fermer l'activité" onClick={()=>{onCloseActivity?.(activity.id); setMenu(false);}} />
            <Divider />
            <MenuItem label="Supprimer" destructive onClick={()=>{onDelete?.(activity.id); setMenu(false);}} />
          </div>
        )}
      </div>
      {/* Description truncated */}
      {activity.description && (
        <div className="text-[11px] text-gray-600 leading-snug line-clamp-2 break-words">{activity.description}</div>
      )}
      {/* Quick actions row */}
      <div className="flex items-center gap-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={()=> onOpen?.(activity.id)} className="px-2 py-0.5 rounded border bg-white hover:bg-gray-50">Afficher</button>
        <button onClick={()=> onEdit?.(activity.id)} className="px-2 py-0.5 rounded border bg-white hover:bg-gray-50">Éditer</button>
        {activity.reviewStatus==='soumis' && (
          <>
            <button onClick={()=> onValidateActivity?.(activity.id)} className="px-2 py-0.5 rounded border bg-emerald-600 text-white hover:bg-emerald-500">Valider</button>
            <button onClick={()=> onRejectActivity?.(activity.id)} className="px-2 py-0.5 rounded border bg-rose-600 text-white hover:bg-rose-500">Rejeter</button>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 text-[10px] text-gray-500 flex-wrap">
        {/* Hide assignee name on cards per requirement; show only the role (assigneeType) */}
        {/* {activity.assignee && <span className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-200 text-[9.5px] font-medium">{activity.assignee}</span>} */}
        {activity.assigneeType && <span className="px-1 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-600 capitalize text-[9px]">{activity.assigneeType}</span>}
  {activity.category && <span className="px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 capitalize">{activity.category}</span>}
  {activity.reviewStatus==='soumis' && <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Soumis</span>}
  {activity.reviewStatus==='validé' && <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Approuvé</span>}
  {activity.reviewStatus==='rejeté' && <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Rejeté</span>}
        {activity.due && (
          <span className={`px-1.5 py-0.5 rounded border text-[10px] ${deadlineColor(activity.due, activity.status)}`}>⌛ {activity.due}</span>
        )}
      </div>
      <div className="mt-1">
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          {(() => { const p = normalizeProgress(activity); return (
            <div className="h-full transition-all duration-300 rounded-full" style={{width: `${p}%`, background: progressColor(p, activity.status) }} />
          ) })()}
        </div>
        <div className="flex justify-between items-center text-[9px] text-gray-400 mt-1">
          <span>{normalizeProgress(activity)}%</span>
          <div className="flex items-center gap-1">
            {/* KPI unit/value */}
            {(activity.kpiTargetValue || activity.kpiUnit) && (
              <span className="px-1 py-0.5 rounded bg-white border text-[8.5px] text-gray-700">
                KPI: {activity.kpiTargetValue ?? '—'} {activity.kpiUnit || ''}
              </span>
            )}
            {activity.type && <span className="px-1 py-0.5 rounded bg-gray-100 border text-[8.5px] uppercase tracking-wide text-gray-600">{activity.type}</span>}
            {activity.status === 'blocked' && <span className="text-red-500 font-medium">Bloqué</span>}
            {activity.status === 'done' && <span className="text-green-600 font-medium">Terminé</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Small subcomponents ---
const MenuItem: React.FC<{label:string; onClick?:()=>void; destructive?:boolean}> = ({label,onClick,destructive}) => (
  <button onClick={onClick} className={`text-left px-3 py-1 rounded hover:bg-pink-50 ${destructive? 'text-red-600 hover:bg-red-50':''}`}>{label}</button>
);
const Divider = () => <div className="h-px bg-gray-200 my-1" />;

// --- helpers ---
function deadlineColor(due: string, status: ProjectActivity['status']): string {
  const now = new Date();
  const d = new Date(due + 'T00:00:00');
  if (status === 'done') return 'bg-green-50 border-green-200 text-green-600';
  const msLeft = d.getTime() - now.getTime();
  const days = msLeft / 86400000;
  if (days < 0) return 'bg-red-50 border-red-200 text-red-600';
  if (days <= 2) return 'bg-amber-50 border-amber-200 text-amber-600';
  return 'bg-blue-50 border-blue-200 text-blue-600';
}

function progressColor(p: number | undefined, status: ProjectActivity['status']): string {
  if (status === 'done') return '#16a34a';
  if (status === 'blocked') return '#dc2626';
  if (!p || p < 30) return '#f59e0b';
  if (p < 70) return '#3b82f6';
  return '#10b981';
}

function normalizeProgress(a: ProjectActivity): number {
  if (typeof a.progress === 'number') return Math.min(100, Math.max(0, a.progress));
  // derive from status if missing
  const map: Record<ProjectActivity['status'], number> = { todo: 0, in_progress: 40, blocked: 25, done: 100 };
  return map[a.status];
}
