import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../components/admin/AdminPage';
import { useEffect } from 'react';
import { listAdminBlog, publishAdminBlog, unpublishAdminBlog, deleteAdminBlog, AdminBlogIndexRow } from '../../services/apiAdminBlog';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const AdminBlog: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all'|'draft'|'published'>('all');
  const [category, setCategory] = useState<'all'|string>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [all, setAll] = useState<AdminBlogIndexRow[]>([]);
  useEffect(()=>{
    let cancelled = false;
    (async ()=>{
      try {
        const rows = await listAdminBlog();
        if (cancelled) return;
        // Auto-clean: remove specific legacy posts both admin and public
        const banned = new Set([
          'local-production-reusable-kits',
          'menstrual-health-education-lycee-buhiga',
          'kit-distribution-next-steps',
        ]);
        const toDelete = rows.filter(r=> banned.has(r.slug));
        if (toDelete.length){
          // try to delete them server-side, ignore errors
          for (const r of toDelete){ try { await deleteAdminBlog(r.slug); } catch {}
          }
          const refreshed = await listAdminBlog().catch(()=>[] as any);
          if (!cancelled) setAll(refreshed);
        } else {
          setAll(rows);
        }
      } catch {
        setAll([]);
      }
    })();
    return ()=> { cancelled = true; };
  },[]);
  const categories = useMemo(()=> {
    const set = new Set<string>();
    all.forEach(r=> set.add(r.category));
    return ['all', ...Array.from(set)];
  }, [all]);

  const filtered: AdminBlogIndexRow[] = useMemo(()=> {
    const qq = q.toLowerCase();
    return all.filter(r=> {
      const okQ = !q || r.title.toLowerCase().includes(qq) || (r.tags||[]).some(t=> t.toLowerCase().includes(qq));
      const okS = status==='all' || r.status===status;
      const okC = category==='all' || r.category===category;
      return okQ && okS && okC;
    });
  },[all,q,status,category]);

  const total = all.length;
  const drafts = all.filter(r=> r.status==='draft').length;
  const published = all.filter(r=> r.status==='published').length;
  const views30 = 24500; // placeholder KPI for now

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageRows = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  function toggleAll(checked: boolean){
    setSelected(checked? pageRows.map(r=> r.slug) : []);
  }
  function toggleOne(slug: string){
    setSelected(sel=> sel.includes(slug)? sel.filter(s=> s!==slug) : [...sel, slug]);
  }
  async function bulkPublish(){ await Promise.all(selected.map(slug=> publishAdminBlog(slug))); setSelected([]); const rows = await listAdminBlog().catch(()=>[]); setAll(rows); }
  async function bulkUnpublish(){ await Promise.all(selected.map(slug=> unpublishAdminBlog(slug))); setSelected([]); const rows = await listAdminBlog().catch(()=>[]); setAll(rows); }
  async function bulkDelete(){ if(!selected.length) return; if(!confirm(t('blog.admin.actions.confirmDelete'))) return; await Promise.all(selected.map(slug=> deleteAdminBlog(slug))); setSelected([]); const rows = await listAdminBlog().catch(()=>[]); setAll(rows); }

  function exportCsv(){
    const headers = ['title','slug','category','tags','author','status','published_at'];
    const rows = filtered.map(r=> [
      r.title,
      r.slug,
      r.category,
      (r.tags||[]).join('|'),
      r.author,
      r.status,
      r.publishedAt||''
    ]);
    const csv = [headers.join(','), ...rows.map(r=> r.map(v=> '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'blog_articles.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminPage title={t('admin.blog')}>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Kpi label={t('admin.ui.blog.kpis.total','Total articles')} value={total} />
        <Kpi label={t('admin.ui.blog.kpis.drafts','Drafts')} value={drafts} />
        <Kpi label={t('admin.ui.blog.kpis.published','Published')} value={published} />
        <Kpi label={t('admin.ui.blog.kpis.views30','Views (30d)')} value={views30.toLocaleString()} />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} placeholder={t('common.search')} className="h-10 w-full pl-9 pr-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
        </div>
        <select value={status} onChange={e=> { setStatus(e.target.value as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          <option value="all">{t('admin.ui.blog.filters.all')}</option>
          <option value="draft">{t('admin.ui.blog.filters.draft')}</option>
          <option value="published">{t('admin.ui.blog.filters.published')}</option>
        </select>
        <select value={category} onChange={e=> { setCategory(e.target.value); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          <option value="all">{t('common.category')}</option>
          {categories.filter(c=> c!=='all').map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <Button variant="secondary" size="sm" className="rounded-full" onClick={exportCsv}>{t('admin.ui.actions.exportCsv')}</Button>
        <Button onClick={()=> navigate('/admin/blog/new')} className="rounded-full">+ {t('common.create')}</Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[var(--text-primary)]">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-2"><input aria-label="Select all" type="checkbox" checked={selected.length===pageRows.length && pageRows.length>0} onChange={e=> toggleAll(e.target.checked)} /></th>
                <th className="py-3 pr-4">{t('common.title')}</th>
                <th className="py-3 pr-4">{t('common.category')}</th>
                <th className="py-3 pr-4">{t('common.tags')}</th>
                <th className="py-3 pr-4">{t('common.author')}</th>
                <th className="py-3 pr-4">{t('admin.ui.table.status')}</th>
                <th className="py-3 pr-4">{t('common.updated')}</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(r=> {
                const checked = selected.includes(r.slug);
                const updated = r.updatedAt ? new Date(r.updatedAt).toISOString().slice(0,10) : (r.publishedAt ? new Date(r.publishedAt).toISOString().slice(0,10) : '');
                return (
                  <tr key={r.slug} className="border-t" style={{borderColor:'var(--color-border)'}}>
                    <td className="py-2 pl-4 pr-2"><input aria-label={`Select ${r.title}`} type="checkbox" checked={checked} onChange={()=> toggleOne(r.slug)} /></td>
                    <td className="py-2 pr-4">
                      <div className="font-medium text-[var(--text-primary)]">{r.title}</div>
                    </td>
                    <td className="py-2 pr-4">{r.category}</td>
                    <td className="py-2 pr-4"><div className="flex flex-wrap gap-1">{(r.tags||[]).slice(0,3).map(tg=> <span key={tg} className="px-2 py-0.5 rounded-full text-[11px] border" style={{borderColor:'var(--color-border)', color:'var(--text-primary)'}}>{tg}</span>)}</div></td>
                    <td className="py-2 pr-4">{r.author}</td>
                    <td className="py-2 pr-4"><span className={`${r.status==='published'? 'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-amber-50 text-amber-700 border border-amber-200'} px-2 py-0.5 rounded-full text-[11px]`}>{r.status==='published'? t('admin.ui.status.validated','published'):t('admin.ui.status.draft')}</span></td>
                    <td className="py-2 pr-4">{updated}</td>
                    <td className="py-2 pr-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" className="rounded-full" onClick={()=> navigate(`/admin/blog/${r.slug}/edit`)}>{t('common.edit')}</Button>
                        {r.status==='published' ? (
                          <Button size="sm" variant="secondary" className="rounded-full" onClick={async ()=> { await unpublishAdminBlog(r.slug); const rows = await listAdminBlog().catch(()=>[]); setAll(rows); }}>{t('admin.ui.actions.unpublish')}</Button>
                        ) : (
                          <Button size="sm" className="rounded-full" onClick={async ()=> { await publishAdminBlog(r.slug); const rows = await listAdminBlog().catch(()=>[]); setAll(rows); }}>{t('admin.ui.actions.publish')}</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length===0 && (
                <tr><td colSpan={9} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('common.noResults')}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t" style={{borderColor:'var(--color-border)'}}>
          <div className="flex items-center gap-2">
            <span className="text-[12px]">{t('admin.ui.actions.bulk')}</span>
            <Button size="sm" className="rounded-full" disabled={!selected.length} onClick={bulkPublish}>{t('admin.ui.actions.publishSelected')}</Button>
            <Button size="sm" variant="secondary" className="rounded-full" disabled={!selected.length} onClick={bulkUnpublish}>{t('admin.ui.actions.unpublish')}</Button>
            <Button size="sm" variant="danger" className="rounded-full" disabled={!selected.length} onClick={bulkDelete}>{t('common.delete')}</Button>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="flex items-center gap-2">{t('common.rows')}
              <select className="h-8 px-2 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={rowsPerPage} onChange={e=>{ setRowsPerPage(Number(e.target.value)); setPage(1); }}>
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

const Kpi: React.FC<{label:string; value: React.ReactNode}> = ({label,value}) => (
  <div className="rounded-2xl p-4 bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
    <div className="text-[12px] text-[var(--muted-color)]">{label}</div>
    <div className="text-[22px] font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);

export default AdminBlog;
