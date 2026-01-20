import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage';
import { Button } from '../../../components/ui/Button';
import { donorStore, getAggregates as getMockAggregates, DonorIndexRow as MockDonorIndexRow } from '../../../services/donorStore';
import * as donorsApi from '../../../services/donorsApi';
import { USE_MOCK } from '../../../config';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminDonors: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [rows,setRows] = useState<MockDonorIndexRow[]>([]);
  const [aggr,setAggr] = useState(()=> getMockAggregates());
  React.useEffect(()=>{
    if (USE_MOCK) {
      setRows(donorStore.listDonors());
      setAggr(getMockAggregates());
      return;
    }
    donorsApi.listDonors()
      .then(list => {
        // Map backend rows to MockDonorIndexRow shape for reuse
        const mapped: MockDonorIndexRow[] = list.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
            totalDonated: r.totalDonated,
            donationsCount: r.donationsCount,
            lastDonation: r.lastDonation,
            anonymous: r.anonymous,
        }));
        setRows(mapped);
        // Recalculate aggregates from fetched data
        const nbDonors = mapped.length;
        const collected = mapped.reduce((a,r)=> a + r.totalDonated, 0);
        const totalCount = mapped.reduce((a,r)=> a + r.donationsCount, 0);
        const avg = totalCount ? (collected / totalCount) : 0;
        const top5 = mapped.slice(0,5).map((r,i)=> ({ rank:i+1, name:r.name, amount:r.totalDonated }));
        setAggr({ nbDonors, collected, average: avg, top5 });
      })
      .catch(()=> {
        setRows(donorStore.listDonors());
        setAggr(getMockAggregates());
      });
  },[]);

  // Toolbar state
  const [q,setQ] = useState('');
  const [anonymous,setAnonymous] = useState<'all'|'yes'|'no'>('all');
  const [destination,setDestination] = useState<'all'|'general'|'project'>('all');
  const [country,setCountry] = useState<'all'|string>('all');

  // Derive country options from donors
  const countryOptions = useMemo(()=> ['all', ...Array.from(new Set(rows.map(r=> (donorStore.getDonor(r.id)?.country)||'—'))).filter(Boolean)], [rows]);

  // For destination filter, we need to check each donor's donations lazily
  const filtered: MockDonorIndexRow[] = useMemo(()=> {
    const qq = q.toLowerCase();
  return rows.filter(row => {
      const inQ = !q || row.name.toLowerCase().includes(qq) || (row.email||'').toLowerCase().includes(qq);
      const inAnon = anonymous==='all' || (anonymous==='yes'? !!row.anonymous : !row.anonymous);
      const d = donorStore.getDonor(row.id);
      const inCountry = country==='all' || (d?.country===country);
      let inDest = true;
      if(destination!=='all'){
        const dons = donorStore.getDonationsByDonor(row.id).filter(x=> x.status==='succeeded');
        if(destination==='general') inDest = dons.some(x=> !x.projectId || x.projectId==='GEN');
        else inDest = dons.some(x=> x.projectId && x.projectId!=='GEN');
      }
      return inQ && inAnon && inCountry && inDest;
    });
  }, [rows,q,anonymous,country,destination]);

  // Table state
  const [rowsPerPage,setRowsPerPage] = useState(10);
  const [page,setPage] = useState(1);
  const [selected,setSelected] = useState<string[]>([]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageRows = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  function toggleAll(ch:boolean){ setSelected(ch? pageRows.map(r=> r.id) : []); }
  function toggleOne(id:string){ setSelected(sel=> sel.includes(id)? sel.filter(x=> x!==id) : [...sel,id]); }

  function exportCsv(){
    const headers = ['name','email','totalDonated','donationsCount','lastDonation'];
    const rows = filtered.map(r=> [r.name, r.email||'', String(r.totalDonated), String(r.donationsCount), (r.lastDonation||'').slice(0,10)]);
    const csv = [headers.join(','), ...rows.map(r=> r.map(v=> '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='donors.csv'; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <AdminPage title={t('admin.donors','Donors')}>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Kpi label={t('admin.ui.donors.kpis.total','Total donors')} value={aggr.nbDonors} />
        <Kpi label={t('admin.ui.donors.kpis.collected','Collected')} value={`$ ${aggr.collected.toLocaleString()}`} />
        <Kpi label={t('admin.ui.donors.kpis.average','Average donation')} value={`$ ${aggr.average.toFixed(0)}`} />
        <Kpi label={t('admin.ui.donors.kpis.top','Top donor')} value={`${(aggr.top5[0]?.name)||'—'} • $ ${(aggr.top5[0]?.amount||0).toLocaleString()}`} />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input value={q} onChange={e=> { setQ(e.target.value); setPage(1); }} placeholder={t('common.search')} className="h-10 w-full pl-9 pr-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
        </div>
        <select value={anonymous} onChange={e=> { setAnonymous(e.target.value as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          <option value="all">{t('admin.ui.donors.filters.anon.all','All')}</option>
          <option value="no">{t('admin.ui.donors.filters.anon.no','Identified')}</option>
          <option value="yes">{t('admin.ui.donors.filters.anon.yes','Anonymous')}</option>
        </select>
        <select value={destination} onChange={e=> { setDestination(e.target.value as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          <option value="all">{t('admin.ui.donors.filters.dest.all','All destinations')}</option>
          <option value="general">{t('admin.ui.donors.filters.dest.general','General fund')}</option>
          <option value="project">{t('admin.ui.donors.filters.dest.project','Projects')}</option>
        </select>
        <select value={country} onChange={e=> { setCountry(e.target.value as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          {countryOptions.map(opt=> <option key={opt} value={opt}>{opt==='all'? t('admin.ui.donors.filters.country','Country'): opt}</option>)}
        </select>
        <Button variant="secondary" size="sm" className="rounded-full" onClick={exportCsv}>{t('admin.ui.actions.exportCsv')}</Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[var(--text-primary)]">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-2"><input type="checkbox" checked={selected.length===pageRows.length && pageRows.length>0} onChange={e=> toggleAll(e.target.checked)} /></th>
                <th className="py-3 pr-4">{t('admin.ui.donors.table.name','Name')}</th>
                <th className="py-3 pr-4">{t('admin.ui.donors.table.email','Email')}</th>
                <th className="py-3 pr-4">{t('admin.ui.donors.table.count','Donations')}</th>
                <th className="py-3 pr-4">{t('admin.ui.donors.table.total','Total')}</th>
                <th className="py-3 pr-4">{t('admin.ui.donors.table.last','Last')}</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(r=> {
                const checked = selected.includes(r.id);
                return (
                  <tr key={r.id} className="border-t" style={{borderColor:'var(--color-border)'}}>
                    <td className="py-2 pl-4 pr-2"><input type="checkbox" checked={checked} onChange={()=> toggleOne(r.id)} /></td>
                    <td className="py-2 pr-4"><div className="font-medium text-[var(--text-primary)]">{r.name}{r.anonymous? ` (${t('admin.ui.donors.anon','Anon.')})`:''}</div></td>
                    <td className="py-2 pr-4">{r.email||'—'}</td>
                    <td className="py-2 pr-4">{r.donationsCount}</td>
                    <td className="py-2 pr-4">$ {r.totalDonated.toLocaleString()}</td>
                    <td className="py-2 pr-4">{(r.lastDonation||'').slice(0,10) || '—'}</td>
                    <td className="py-2 pr-4 text-right"><Button size="sm" className="rounded-full" onClick={()=> navigate(`/admin/donors/${r.id}`)}>{t('admin.ui.donors.viewProfile','View profile')}</Button></td>
                  </tr>
                );
              })}
              {pageRows.length===0 && (
                <tr><td colSpan={7} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('common.noResults')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between gap-2 p-3 border-t" style={{borderColor:'var(--color-border)'}}>
          <div className="text-[12px] text-[var(--muted-color)]">{filtered.length} {t('admin.donors','Donors')} • {t('common.page','Page')} {page} / {totalPages}</div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="flex items-center gap-2">{t('common.rows')}
              <select className="h-8 px-2 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={rowsPerPage} onChange={e=> { setRowsPerPage(Number(e.target.value)); setPage(1); }}>
                {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Previous page" disabled={page===1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>‹</button>
              {Array.from({length: totalPages}).slice(0,5).map((_,i)=> { const n=i+1; const active=n===page; return (
                <button key={n} aria-current={active? 'page':undefined} onClick={()=> setPage(n)} className={`w-8 h-8 rounded-full text-[12px] border ${active? 'bg-[var(--color-primary)] text-white':'bg-[var(--chip-bg)] text-[var(--text-primary)] hover:brightness-95'}`} style={{borderColor:'var(--color-border)'}}>{n}</button>
              );})}
              <button aria-label="Next page" disabled={page===totalPages} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>›</button>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminDonors;

const Kpi: React.FC<{label:string; value: React.ReactNode}> = ({label,value}) => (
  <div className="rounded-2xl p-4 bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
    <div className="text-[12px] text-[var(--muted-color)]">{label}</div>
    <div className="text-[22px] font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);
