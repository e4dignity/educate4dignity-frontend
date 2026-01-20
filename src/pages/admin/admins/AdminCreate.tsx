import React, { useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { adminUsersStore, AdminUser } from '../../../services/adminUsersStore';

const ROLE_GROUPS: { group: string; items: string[] }[] = [
  { group: 'Operations & Projects', items: ['Projects','Distributors','Suppliers','Beneficiaries'] },
  { group: 'Finance & Donors', items: ['Dashboard','Donors'] },
  { group: 'Content & Learning', items: ['Blog','E-learning','Resources'] },
  { group: 'Governance & Administration', items: ['Team','Admin','Settings'] },
];

const AdminCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form,setForm] = useState<Partial<AdminUser>>({
    roles: [], country:'BI', status:'invited', twoFactorRequired:true, language:'FR', timezone:'Africa/Bujumbura'
  });
  const set = (k:keyof AdminUser, v:any)=> setForm(s=> ({...s, [k]: v }));

  const superAdminOn = (form.roles||[]).includes('SuperAdmin');
  const toggleRole = (r:string)=> {
    if (r==='SuperAdmin') {
      const cur = new Set(form.roles||[]);
      if (cur.has('SuperAdmin')) cur.delete('SuperAdmin'); else cur.add('SuperAdmin');
      set('roles', Array.from(cur));
      return;
    }
    if (superAdminOn) return; // when SuperAdmin, subordinate toggles are disabled
    const cur = new Set(form.roles||[]);
    if (cur.has(r)) cur.delete(r); else cur.add(r);
    set('roles', Array.from(cur));
  };

  const create = ()=> {
    if (!form.name || !form.email || !(form.roles||[]).length) return alert('Champs requis manquants');
    const u = adminUsersStore.add({
      id: undefined as any,
      name: form.name!, email: form.email!, roles: form.roles||[],
      status: form.status||'invited', country: form.country||'BI', language: form.language||'FR', timezone: form.timezone||'Africa/Bujumbura',
      twoFactorRequired: form.twoFactorRequired??true, lastAccess: undefined,
      sessionsRecentCount: 0, sensitiveExportsCount: 0,
      scopes: { projects: [], countries: [] }, notes: form.notes||'', auditLog: [], documents: []
    });
    navigate(`/admin/settings/access/${u.id}`);
  };

  return (
    <AdminPage title="Créer un administrateur">
      <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Identité */}
          <section className="lg:col-span-2 space-y-3">
            <h3 className="font-medium">Identité</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[12px] text-[var(--muted-color)]">Nom complet *</label>
                <Input value={form.name||''} onChange={e=> set('name', e.target.value)} placeholder="Ex: Aïcha Karim" />
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Email *</label>
                <Input value={form.email||''} onChange={e=> set('email', e.target.value)} placeholder="prenom@e4d.org" />
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Langue</label>
                <select className="w-full h-9 rounded-lg border px-2" value={form.language} onChange={e=> set('language', e.target.value)}>
                  {['FR','EN'].map(l=> <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Fuseau horaire</label>
                <select className="w-full h-9 rounded-lg border px-2" value={form.timezone} onChange={e=> set('timezone', e.target.value)}>
                  {['Africa/Bujumbura','Africa/Kigali','Africa/Dar_es_Salaam'].map(z=> <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Pays</label>
                <select className="w-full h-9 rounded-lg border px-2" value={form.country} onChange={e=> set('country', e.target.value)}>
                  {['BI','RW','TZ','CD','SN','IN'].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Rôles (groupés) */}
            <div className="space-y-2">
              <label className="text-[12px] text-[var(--muted-color)]">Rôles *</label>
              <div>
                <label className="inline-flex gap-2 items-center">
                  <input type="checkbox" checked={superAdminOn} onChange={()=> toggleRole('SuperAdmin')} /> SuperAdmin
                </label>
              </div>
              {ROLE_GROUPS.map(g=> (
                <div key={g.group} className="rounded-xl border p-3">
                  <div className="text-[13px] font-medium mb-2">{g.group}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map(it=> (
                      <label key={it} className={`inline-flex gap-2 items-center px-3 py-1 rounded-full border ${superAdminOn? 'opacity-60':''}`}>
                        <input type="checkbox" disabled={superAdminOn} checked={superAdminOn || (form.roles||[]).includes(it)} onChange={()=> toggleRole(it)} /> {it}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Statut */}
            <div>
              <label className="text-[12px] text-[var(--muted-color)]">Statut du compte</label>
              <div className="flex gap-4 items-center h-9">
                <label className="inline-flex gap-1 items-center"><input type="radio" name="status" checked={form.status==='invited'} onChange={()=> set('status','invited')} /> Invité</label>
                <label className="inline-flex gap-1 items-center"><input type="radio" name="status" checked={form.status==='active'} onChange={()=> set('status','active')} /> Actif</label>
                <label className="inline-flex gap-1 items-center"><input type="radio" name="status" checked={form.status==='suspended'} onChange={()=> set('status','suspended')} /> Suspendu</label>
              </div>
            </div>

            {/* Accès initial */}
            <div>
              <label className="text-[12px] text-[var(--muted-color)]">Accès initial</label>
              <div className="space-y-2 rounded-xl border p-3">
                <label className="inline-flex gap-2 items-center"><input type="checkbox" /> Envoyer email d’invitation</label>
                <label className="inline-flex gap-2 items-center"><input type="checkbox" /> Définir mot de passe temporaire</label>
                <div className="flex gap-2 items-center">
                  <Input className="flex-1" placeholder="Mot de passe temporaire (optionnel)" />
                  <Button variant="secondary" onClick={()=> alert('Temp password: '+ Math.random().toString(36).slice(2,8).toUpperCase())}>Générer</Button>
                </div>
              </div>
            </div>

            {/* Note interne (journal audit) */}
            <div>
              <label className="text-[12px] text-[var(--muted-color)]">Note interne (journal audit)</label>
              <textarea className="w-full rounded-lg border p-2 min-h-[88px]" value={form.notes||''} onChange={e=> set('notes', e.target.value)} placeholder="Ex: Création suite à extension de l’équipe finance Q4." />
            </div>
          </section>

          {/* Sécurité & Portée */}
          <section className="space-y-3">
            <h3 className="font-medium">Sécurité</h3>
            <div className="space-y-2 rounded-xl border p-3">
              <label className="inline-flex gap-2 items-center"><input type="checkbox" checked={!!form.twoFactorRequired} onChange={e=> set('twoFactorRequired', e.target.checked)} /> 2FA requis à la connexion</label>
              <div className="grid grid-cols-2 gap-2">
                <select className="h-9 rounded-lg border px-2"><option>Politique mot de passe</option><option>Min. 10 caractères</option></select>
                <select className="h-9 rounded-lg border px-2"><option>Expiration de l’invitation</option><option>7 jours</option></select>
              </div>
            </div>

            {/* Documents (facultatif) */}
            <h3 className="font-medium">Documents (facultatif)</h3>
            <div className="rounded-xl border p-6 text-center text-[13px] text-[var(--muted-color)]">
              Glissez-déposez / Cliquez pour téléverser
              <div className="mt-2"><Button variant="secondary" onClick={()=> alert('Uploader non connecté (mock)')}>Téléverser...</Button></div>
            </div>

            <h3 className="font-medium">Aperçu des permissions</h3>
            <div className="rounded-xl border p-3 text-[13px] text-[var(--muted-color)]">
              Lecture: Projets, Transparence, Rapports • Écriture: Dépenses (Finance). Actions sensibles soumises à 2FA. Export audit. Suppression admin: rôle superadmin requis.
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={()=> navigate('/admin/settings/access')}>Annuler</Button>
          <Button variant="secondary" onClick={create}>Créer (sans invite)</Button>
          <Button onClick={create}>Créer & inviter</Button>
        </div>
        <div className="mt-2 text-[12px] text-[var(--muted-color)]">Astuce: si vous n’envoyez pas l’invitation, vous pouvez activer le compte plus tard.</div>
      </div>
    </AdminPage>
  );
};

export default AdminCreate;
