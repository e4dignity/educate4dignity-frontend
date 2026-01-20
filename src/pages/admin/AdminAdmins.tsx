import React, { useMemo, useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { adminUsersStore } from '../../services/adminUsersStore';

const AdminAdmins: React.FC = () => {
  const navigate = useNavigate();
  const [q,setQ] = useState('');
  const [role,setRole] = useState<'all'|string>('all');
  const [status,setStatus] = useState<'all'|'active'|'invited'|'suspended'>('all');
  const [rowsPerPage,setRowsPerPage] = useState(25);
  const [page,setPage] = useState(1);
  const [selected,setSelected] = useState<string[]>([]);

  const all = useMemo(()=> adminUsersStore.list(),[]);
  const roles = useMemo(()=> Array.from(new Set(all.flatMap(a=> a.roles||[]))),[all]);
  const filtered = useMemo(()=> all.filter(a=> {
    const term = q.toLowerCase().trim();
    if (term && !(a.name.toLowerCase().includes(term) || a.email.toLowerCase().includes(term))) return false;
    if (role!=='all' && !(a.roles||[]).includes(role)) return false;
    if (status!=='all' && a.status!==status) return false;
    return true;
  }),[all,q,role,status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/rowsPerPage));
  const pageItems = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const stats = {
    admins: all.length,
    actifs: all.filter(a=> a.status==='active').length,
    suspendus: all.filter(a=> a.status==='suspended').length,
    accessMedian: '5 j'
  };

  const toggleAll = (checked:boolean)=> setSelected(checked? pageItems.map(r=> r.id): []);
  const toggleOne = (id:string, checked:boolean)=> setSelected(s=> checked? Array.from(new Set([...s,id])): s.filter(x=> x!==id));

  const bulk = (action:'activate'|'suspend'|'resetPwd')=> {
    if (!selected.length) return;
    if (action==='resetPwd') return alert('Réinitialisation du mot de passe envoyée');
    selected.forEach(id=> adminUsersStore.update(id, { status: action==='activate'? 'active':'suspended' }));
    setSelected([]);
  };

  return (
    <AdminPage title="Gestion des administrateurs">
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <Kpi label="Admins (total)" value={stats.admins} />
        <Kpi label="Actifs" value={stats.actifs} />
        <Kpi label="Suspendus" value={stats.suspendus} />
        <Kpi label="Dernier accès médian" value={stats.accessMedian} />
      </div>

      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <Input className="w-full sm:w-[320px]" placeholder="Rechercher (nom, email)" value={q} onChange={e=>{ setQ(e.target.value); setPage(1); }} />
        <select className="h-9 px-3 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={role} onChange={e=> { setRole(e.target.value); setPage(1); }}>
          <option value="all">Rôle</option>
          {roles.map(r=> <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="h-9 px-3 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={status} onChange={e=> { setStatus(e.target.value as any); setPage(1); }}>
          <option value="all">Statut</option>
          <option value="active">Actif</option>
          <option value="invited">Invité</option>
          <option value="suspended">Suspendu</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> navigate('/admin/settings/access/audit')}>Journal d’audit</Button>
          <Button size="sm" className="rounded-full" onClick={()=> navigate('/admin/settings/access/new')}>+ Créer admin</Button>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-2"><input type="checkbox" checked={selected.length===pageItems.length && pageItems.length>0} onChange={e=> toggleAll(e.target.checked)} /></th>
                <th className="py-3 pr-4">Nom</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Rôles</th>
                <th className="py-3 pr-4">Statut</th>
                <th className="py-3 pr-4">Dernier accès</th>
                <th className="py-3 pr-4">2FA</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(a=> (
                <tr key={a.id} className="border-t hover:bg-[var(--chip-bg)]/60" style={{borderColor:'var(--color-border)'}}>
                  <td className="py-2 pl-4 pr-2"><input type="checkbox" checked={selected.includes(a.id)} onChange={e=> toggleOne(a.id, e.target.checked)} /></td>
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4">{a.email}</td>
                  <td className="py-2 pr-4"><div className="flex flex-wrap gap-1">{(a.roles||[]).map(r=> <Badge key={r} size="sm" variant="secondary">{r}</Badge>)}</div></td>
                  <td className="py-2 pr-4">{a.status==='active'? <Badge size="sm" variant="success">Actif</Badge> : a.status==='suspended'? <Badge size="sm" variant="warning">Suspendu</Badge> : <Badge size="sm" variant="secondary">Invité</Badge>}</td>
                  <td className="py-2 pr-4">{a.lastAccess? new Date(a.lastAccess).toLocaleString(): '—'}</td>
                  <td className="py-2 pr-4">{a.twoFactorRequired? 'Oui':'Non'}</td>
                  <td className="py-2 pr-4"><button className="underline" onClick={()=> navigate(`/admin/settings/access/${a.id}`)}>Voir</button></td>
                </tr>
              ))}
              {pageItems.length===0 && <tr><td colSpan={8} className="text-center py-10 text-[13px] text-[var(--muted-color)]">Aucun résultat</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t" style={{borderColor:'var(--color-border)'}}>
          <div className="flex items-center gap-2">
            <select className="h-9 px-3 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
              <option>Actions en masse :</option>
            </select>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> bulk('activate')}>Activer</Button>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> bulk('suspend')}>Suspendre</Button>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> bulk('resetPwd')}>Réinitialiser mot de passe</Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-[var(--muted-color)]">Rows:</label>
            <select className="h-8 px-2 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={rowsPerPage} onChange={e=>{ setRowsPerPage(Number(e.target.value)); setPage(1); }}>
              {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <button aria-label="Previous page" disabled={page===1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>‹</button>
            {Array.from({length: totalPages}).slice(0,7).map((_,i)=> { const n=i+1; const active=n===page; return (
              <button key={n} aria-current={active? 'page':undefined} onClick={()=> setPage(n)} className={`w-8 h-8 rounded-full text-[12px] border ${active? 'bg-[var(--color-primary)] text-white':'bg-[var(--chip-bg)] text-[var(--text-primary)] hover:brightness-95'}`} style={{borderColor:'var(--color-border)'}}>{n}</button>
            );})}
            <button aria-label="Next page" disabled={page===totalPages} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>›</button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

const Kpi = ({label,value}:{label:string; value:number|string}) => (
  <Card>
    <CardContent className="py-4">
      <div className="flex items-center">
        <div className="p-2 bg-primary-light rounded-lg w-8 h-8"/>
        <div className="ml-4">
          <div className="text-2xl font-bold text-text-primary">{value}</div>
          <div className="text-text-secondary text-sm">{label}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminAdmins;
