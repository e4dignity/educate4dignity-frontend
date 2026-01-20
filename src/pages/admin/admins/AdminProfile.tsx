import React, { useMemo } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { useParams } from 'react-router-dom';
import { adminUsersStore } from '../../../services/adminUsersStore';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const AdminProfile: React.FC = () => {
  const { id } = useParams();
  const u = useMemo(()=> id? adminUsersStore.get(id): undefined, [id]);
  if (!u) return <AdminPage title="Administrateur — Voir">Inconnu</AdminPage>;
  const initials = (u.name||'?').split(' ').map(s=> s[0]).slice(0,2).join('').toUpperCase();

  const exportAuditCsv = ()=> {
    const H = ['date','action','objet','details','résultat'];
    const rows = (u.auditLog||[]).map(r=> [r.date,r.action,r.object||'',r.details||'',r.result||'Succès']);
    const csv = [H.join(','), ...rows.map(r=> r.map(v=> '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`audit_${u.id}.csv`; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <AdminPage title="Administrateur — Voir">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Identity */}
        <div className="rounded-2xl bg-[var(--color-surface)] border p-4 space-y-3" style={{borderColor:'var(--color-border)'}}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--chip-bg)] flex items-center justify-center text-[14px] font-bold">{initials}</div>
            <div>
              <div className="text-[15px] font-semibold">{u.name}</div>
              <div className="text-[12px] text-[var(--muted-color)]">{u.email}</div>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={()=> alert('Edit (mock)')}>Éditer</Button>
              <Button variant="secondary" onClick={()=> alert('Réinit. mot de passe (mock)')}>Réinit. mot de p.</Button>
            </div>
          </div>
          <div className="text-[13px] space-y-1">
            <div><span className="text-[var(--muted-color)]">Langue:</span> {u.language||'FR'}</div>
            <div><span className="text-[var(--muted-color)]">Fuseau:</span> {u.timezone||'—'}</div>
            <div><span className="text-[var(--muted-color)]">Pays:</span> {u.country}</div>
            <div><span className="text-[var(--muted-color)]">Statut:</span> {u.status==='active'? <Badge size="sm" variant="success">Actif</Badge> : u.status==='suspended'? <Badge size="sm" variant="warning">Suspendu</Badge> : <Badge size="sm" variant="secondary">Invité</Badge>}</div>
            <div><span className="text-[var(--muted-color)]">Rôles:</span> <span className="inline-flex flex-wrap gap-1">{(u.roles||[]).map(r=> <Badge key={r} size="sm" variant="secondary">{r}</Badge>)}</span></div>
            <div><span className="text-[var(--muted-color)]">Sécurité:</span> 2FA: {u.twoFactorRequired? 'Requis':'—'} • Dernier accès: {u.lastAccess? new Date(u.lastAccess).toLocaleString(): '—'}</div>
          </div>

          <div>
            <h3 className="font-semibold text-[13px] mb-1">Portée (scopes)</h3>
            <div className="text-[12px] text-[var(--muted-color)]">Projets: {(u.scopes?.projects||[]).join(', ')||'—'}</div>
            <div className="text-[12px] text-[var(--muted-color)]">Pays: {(u.scopes?.countries||[]).join(', ')||'—'}</div>
          </div>

          <div>
            <h3 className="font-semibold text-[13px] mb-1">Notes internes (audit)</h3>
            <div className="text-[13px] text-[var(--muted-color)]">{u.notes || '—'}</div>
          </div>
        </div>

        {/* Sessions + Audit Log */}
        <div className="lg:col-span-2 grid gap-4">
          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[13px]">Aperçu & sessions</h3>
              <div className="text-[12px] text-[var(--muted-color)]">Dernière activité: {u.lastAccess? 'il y a ~'+ Math.floor((Date.now()- new Date(u.lastAccess).getTime())/3600_000) +' h' : '—'}</div>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 text-[13px]">
              <div className="rounded-lg border p-3">Connexions (30 j): <strong>{u.sessionsRecentCount??0}</strong></div>
              <div className="rounded-lg border p-3">Export sensibles: <strong>{u.sensitiveExportsCount??0}</strong></div>
              <div className="rounded-lg border p-3">Sessions actives: <strong>2</strong></div>
            </div>
            <table className="w-full text-[12px] mt-3">
              <thead className="text-[var(--muted-color)]">
                <tr className="text-left">
                  <th className="py-2">Appareil</th>
                  <th className="py-2">IP</th>
                  <th className="py-2">Localisation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="py-1.5">Chrome • Desktop</td><td>154.73.10.22</td><td>Gitega, BI</td></tr>
                <tr className="border-t"><td className="py-1.5">Android • PWA</td><td>10.14.7.2</td><td>Ngozi, BI</td></tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[13px]">Journal d’audit (actions)</h3>
              <div className="flex gap-2 items-center"><select className="h-8 px-2 rounded-full border"><option>Type d’action</option></select><select className="h-8 px-2 rounded-full border"><option>Période</option></select><Button variant="secondary" size="sm" className="rounded-full" onClick={exportAuditCsv}>Exporter CSV</Button></div>
            </div>
            <table className="w-full text-[12px]">
              <thead className="text-[var(--muted-color)]">
                <tr className="text-left">
                  <th className="py-2">Date</th>
                  <th className="py-2">Action</th>
                  <th className="py-2">Objet</th>
                  <th className="py-2">Détails</th>
                </tr>
              </thead>
              <tbody>
                {(u.auditLog||[]).map((r,i)=> (
                  <tr key={i} className="border-t">
                    <td className="py-1.5">{r.date}</td>
                    <td className="py-1.5">{r.action}</td>
                    <td className="py-1.5">{r.object||'—'}</td>
                    <td className="py-1.5">{r.details||'—'}</td>
                  </tr>
                ))}
                {(u.auditLog||[]).length===0 && <tr><td colSpan={4} className="py-6 text-center text-[var(--muted-color)]">—</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminProfile;
