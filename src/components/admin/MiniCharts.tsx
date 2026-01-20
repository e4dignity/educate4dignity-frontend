import React from 'react';

export const MiniBarChart: React.FC<{ series: number[]; labels: string[]; title: string; legend?: string[] }>=({series,labels,title,legend})=>{
  const max = Math.max(...series,1);
  return (
    <div className="rounded-lg border bg-white border-[var(--rose-200)] p-3 flex flex-col">
      <div className="text-[12px] font-medium mb-2 text-[var(--slate-700)]">{title}</div>
      <div className="flex items-end gap-1 h-32">
        {series.map((v,i)=>(
          <div key={i} className="flex-1 bg-[var(--rose-100)] rounded-t relative group" style={{height:`${(v/max)*100}%`}}>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-[var(--slate-500)] opacity-0 group-hover:opacity-100 transition">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-[var(--slate-500)]">
        {labels.map(l=> <span key={l}>{l}</span>)}
      </div>
      {legend && <div className="mt-2 flex flex-wrap gap-2">
        {legend.map((l,i)=> <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--rose-100)] text-[var(--slate-600]">{l}</span>)}
      </div>}
    </div>
  );
};

export const GroupedBarChart: React.FC<{ series: Record<string,number[]>; labels: string[]; title: string; palette?: string[] }>=({series,labels,title,palette})=>{
  const keys = Object.keys(series);
  const max = Math.max(...keys.flatMap(k=>series[k]));
  const pal = palette || ['#C23D74','#E9AABB','#8B6678'];
  return (
    <div className="rounded-xl border bg-white border-[var(--border-color,#E9AABB)] p-4 flex flex-col shadow-sm min-h-[220px] overflow-hidden">
      <div className="text-[13px] font-medium mb-2 text-[var(--text-primary,#503246)]">{title}</div>
      <div className="flex-1 flex items-end gap-2">
        {labels.map((lab,i)=> (
          // Important: avoid w-full inside a row flex; use flex-1 basis-0 to evenly distribute without overflow
          <div key={lab} className="flex flex-col items-center gap-1 flex-1 basis-0 min-w-0">
            <div className="flex items-end gap-[2px] w-full h-32">
              {keys.map((k,ki)=> {
                const v = series[k][i];
                return <div key={k} className="flex-1 rounded-sm" style={{height:`${(v/max)*100}%`, background: pal[ki%pal.length], opacity:0.85}} title={`${k}: ${v}`} />; })}
            </div>
            <div className="text-[10px] text-[var(--muted-color,#8B6678)]">{lab}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {keys.map((k,i)=> <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--chip-bg,#FFEAF1)] text-[var(--text-primary,#503246)] flex items-center gap-1"><span className="w-2 h-2 rounded" style={{background:pal[i%pal.length]}} />{k}</span>)}
      </div>
    </div>
  );
};

export const MiniLineChart: React.FC<{ points: number[]; title: string }>=({points,title})=>{
  const max = Math.max(...points,1);
  const path = points.map((p,i)=>`${i===0?'M':'L'} ${i/(points.length-1)*100} ${100-(p/max*100)}`).join(' ');
  return (
    <div className="rounded-xl border bg-white border-[var(--border-color,#E9AABB)] p-4 flex flex-col shadow-sm min-h-[220px]">
      <div className="text-[13px] font-medium mb-2 text-[var(--text-primary,#503246)]">{title}</div>
      <svg viewBox="0 0 100 100" className="w-full h-32 overflow-visible">
        <path d={path} fill="none" stroke="#C23D74" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p,i)=> <circle key={i} cx={i/(points.length-1)*100} cy={100-(p/max*100)} r={2.8} fill="#C23D74" />)}
      </svg>
    </div>
  );
};

export const MiniPieChart: React.FC<{ values: { label: string; value: number; color?: string }[]; title: string }>=({values,title})=>{
  const total = values.reduce((s,v)=>s+v.value,0)||1;
  let acc = 0;
  const slices = values.map(v=>{ const start=acc/total; acc+=v.value; return {v,start,end:acc/total}; });
  const colors = ['#C23D74','#D97A9B','#B46D86','#8B6678'];
  return (
    <div className="rounded-xl border bg-white border-[var(--border-color,#E9AABB)] p-4 flex flex-col shadow-sm min-h-[220px]">
      <div className="text-[13px] font-medium mb-2 text-[var(--text-primary,#503246)]">{title}</div>
      <svg viewBox="0 0 32 32" className="w-full h-32">
        {slices.map(({v,start,end},i)=>{ const large=end-start>0.5?1:0; const a0=2*Math.PI*start; const a1=2*Math.PI*end; const x0=16+14*Math.sin(a0); const y0=16-14*Math.cos(a0); const x1=16+14*Math.sin(a1); const y1=16-14*Math.cos(a1); return <path key={i} d={`M16 16 L ${x0} ${y0} A 14 14 0 ${large} 1 ${x1} ${y1} Z`} fill={v.color||colors[i%colors.length]} stroke="#fff" strokeWidth={0.5} />; })}
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-[var(--muted-color,#8B6678)]">
        {values.map((v,i)=> <div key={i} className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded" style={{background:v.color||colors[i%colors.length]}} />{v.label} {Math.round(v.value/total*100)}%</div>)}
      </div>
    </div>
  );
};
