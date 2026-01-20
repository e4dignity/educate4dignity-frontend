import React, { useMemo, useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { adminUsersStore } from '../../../services/adminUsersStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

const AdminAuditLog: React.FC = () => {
  const [q,setQ] = useState('');
  const [user,setUser] = useState<'all'|string>('all');
  const allAdmins = useMemo(()=> adminUsersStore.list(),[]);

  const rows = useMemo(()=> {
    const list = allAdmins.flatMap(a=> (a.auditLog||[]).map(ev=> ({
      id: `${a.id}-${ev.date}-${ev.action}`,
      adminId: a.id,
      adminName: a.name,
      date: ev.date,
      action: ev.action,
      object: ev.object||'',
      details: ev.details||'',
      result: ev.result||'Succès',
    })));
    const term = q.toLowerCase().trim();
    return list.filter(r=> {
      if (user!=='all' && r.adminId!==user) return false;
      if (term && !(r.action.toLowerCase().includes(term) || r.object.toLowerCase().includes(term) || r.adminName.toLowerCase().includes(term))) return false;
      return true;
    }).sort((a,b)=> (b.date||'').localeCompare(a.date||''));
  },[allAdmins,q,user]);

  const exportCsv = ()=> {
    const H = ['admin','date','action','objet','details','résultat'];
    const csv = [H.join(','), ...rows.map(r=> [r.adminName,r.date,r.action,r.object,r.details,r.result].map(v=> '"'+String(v??'').replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='audit_global.csv'; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <AdminPage title="Journal d’audit (global)">
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <Input className="w-full sm:w-[320px]" placeholder="Rechercher (action, objet, admin)" value={q} onChange={e=> setQ(e.target.value)} />
        <select className="h-9 px-3 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={user} onChange={e=> setUser(e.target.value)}>
          <option value="all">Tous les admins</option>
          {allAdmins.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="rounded-full" onClick={exportCsv}>Exporter CSV</Button>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-4">Date</th>
                <th className="py-3 pr-4">Admin</th>
                <th className="py-3 pr-4">Action</th>
                <th className="py-3 pr-4">Objet</th>
                <th className="py-3 pr-4">Détails</th>
                <th className="py-3 pr-4">Résultat</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=> (
                <tr key={r.id} className="border-t" style={{borderColor:'var(--color-border)'}}>
                  <td className="py-2 pl-4 pr-4">{r.date}</td>
                  <td className="py-2 pr-4">{r.adminName}</td>
                  <td className="py-2 pr-4">{r.action}</td>
                  <td className="py-2 pr-4">{r.object||'—'}</td>
                  <td className="py-2 pr-4">{r.details||'—'}</td>
                  <td className="py-2 pr-4">{r.result}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td colSpan={6} className="py-10 text-center text-[13px] text-[var(--muted-color)]">—</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminAuditLog;
