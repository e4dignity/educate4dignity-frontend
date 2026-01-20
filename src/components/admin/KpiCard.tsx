import React from 'react';

interface KpiCardProps { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  progressPct?: number; 
  segments?: number[]; 
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
  href?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, progressPct, segments, trend, icon: _icon, href }) => {
  const totalSeg = segments?.reduce((a,b)=>a+b,0) || 0;
  
  const cardContent = (
    <>
      <div className="flex items-start justify-between">
        <div className="text-sm font-semibold text-[var(--muted-color)]">{title}</div>
        {trend && (
          <div className={`text-lg flex items-center gap-1 ${
            trend === 'up' ? 'text-[var(--success)]' : 
            trend === 'down' ? 'text-[var(--error)]' : 
            'text-[var(--muted-color)]'
          }`}>
            {trend === 'up' && '↗'}
            {trend === 'down' && '↘'}
            {trend === 'stable' && '→'}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-[var(--text-primary)] leading-none mb-1">{value}</div>
      {subtitle && <div className="text-sm text-[var(--muted-color)] leading-relaxed">{subtitle}</div>}
      {segments && segments.length>0 && (
        <div className="flex w-full h-1.5 rounded overflow-hidden bg-[var(--chip-bg,#FFEAF1)] mt-auto">
          {segments.map((s,i)=> <div key={i} style={{width:`${(s/totalSeg)*100}%`}} className="bg-[var(--primary-accent,#C23D74)]/50 first:rounded-l last:rounded-r" />)}
        </div>
      )}
      {!segments && typeof progressPct === 'number' && (
        <div className="h-1.5 rounded bg-[var(--chip-bg,#FFEAF1)] overflow-hidden mt-auto">
          <div className="h-full bg-[var(--primary-accent,#C23D74)] transition-all" style={{width: `${Math.min(100, Math.max(0, progressPct))}%`}} />
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className="rounded-xl border p-6 bg-[var(--card-bg)] border-[var(--border-color)] flex flex-col gap-3 shadow-[var(--elev-2)] min-h-[160px] hover:shadow-[var(--elev-3)] transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
        {cardContent}
      </a>
    );
  }

  return (
    <div className="rounded-xl border p-6 bg-[var(--card-bg)] border-[var(--border-color)] flex flex-col gap-3 shadow-[var(--elev-2)] min-h-[160px]">
      {cardContent}
    </div>
  );
};

export default KpiCard;
