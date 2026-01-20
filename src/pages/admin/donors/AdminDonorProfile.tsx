import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { donorStore } from '../../../services/donorStore';
import { USE_MOCK } from '../../../config';
import { getDonorProfile } from '../../../services/donorsApi';
import { useTranslation } from 'react-i18next';

const formatUsd = (n:number) => `$ ${n.toLocaleString()}`;

const AdminDonorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // 'loading' value isn't displayed; keep setter for future UX while avoiding TS unused var error
  const [,setLoading] = useState(false);
  const [donor,setDonor] = useState<any>();
  const [donations,setDonations] = useState<any[]>([]);
  const refunds = useMemo(()=> USE_MOCK && id? donorStore.getRefundsByDonor(id): [], [id]);

  useEffect(()=>{
    let ignore=false;
    async function load(){
      if(!id) return;
      if(USE_MOCK){
        const d = donorStore.getDonor(id);
        const dons = donorStore.getDonationsByDonor(id);
        if(!ignore){ setDonor(d); setDonations(dons); }
        return;
      }
      setLoading(true);
      try{
        const data = await getDonorProfile(id);
        const d = data.donor;
        const name = (d.firstName||'') + (d.lastName? ` ${d.lastName}`:'');
        setDonor({
          id: d.id,
          name: name.trim() || d.email || 'Anonymous',
          email: d.email,
          anonymous: !!d.anonymous,
          country: d.country,
          createdAt: d.createdAt,
        });
        setDonations((data.donations||[]).map((x:any)=> ({
          id: x.id,
          date: x.createdAt,
          projectId: x.projectId || 'GEN',
          projectTitle: undefined,
          method: 'card',
          status: x.status==='COMPLETE'? 'succeeded' : (x.status==='OPEN'? 'pending' : 'failed'),
          amount: Math.round((x.amountCents||0)/100),
        })));
      } finally {
        if(!ignore) setLoading(false);
      }
    }
    load();
    return ()=>{ ignore=true; };
  },[id]);

  const kpis = useMemo(()=>{
    const succ = donations.filter(d=> d.status==='succeeded');
    const total = succ.reduce((a,d)=> a+d.amount, 0);
    const avg = succ.length? total/succ.length: 0;
    const last = succ.length? succ.map(d=> d.date).sort().slice(-1)[0]: undefined;
    return { total, count: succ.length, avg, last };
  }, [donations]);

  const projectsSupported = useMemo(()=> {
    const set = new Set<string>();
    donations.forEach(d=> { if(d.projectId && d.projectId!=='GEN') set.add(d.projectTitle||d.projectId); });
    return Array.from(set);
  }, [donations]);

  // Refund modal state
  const [openRefund,setOpenRefund] = useState(false);
  const [selectedDonation,setSelectedDonation] = useState<string>('');
  const [amount,setAmount] = useState<number>(0);
  const [reason,setReason] = useState('');

  function openRefundFor(donationId: string){
    setSelectedDonation(donationId);
    const d = donations.find(x=> x.id===donationId);
    setAmount(d? d.amount: 0);
    setReason('');
    setOpenRefund(true);
  }
  function submitRefund(){
    if(!id || !selectedDonation) return;
    const rid = 'rf_'+Math.random().toString(36).slice(2,9);
    donorStore.requestRefund({ id: rid, donorId: id, donationId: selectedDonation, amount, reason, status:'pending', createdAt: new Date().toISOString() });
    setOpenRefund(false);
    // refresh by navigating to same route
    navigate(0 as any);
  }

  if(!donor){
    return <AdminPage title={t('admin.ui.donors.profile.title','Donor profile')}><div className="p-6">{t('admin.ui.donors.profile.notFound','Donor not found.')}</div></AdminPage>;
  }

  return (
    <AdminPage title={`${t('admin.donors','Donors')} • ${donor.name}${donor.anonymous? ` (${t('admin.ui.donors.anon','Anon.')})`:''}`}>
      {/* Header */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-4 mb-4" style={{borderColor:'var(--color-border)'}}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[18px] font-semibold text-[var(--text-primary)]">{donor.name}{donor.anonymous? ` (${t('admin.ui.donors.anon','Anon.')})`:''}</div>
            <div className="text-[13px] text-[var(--muted-color)]">{donor.email||'—'} • {donor.country||'—'} • {t('admin.ui.donors.profile.since','Since')} {(donor.createdAt||'').slice(0,10)}</div>
          </div>
          <div className="flex gap-3">
            <Kpi label={t('admin.ui.donors.kpis.collected','Collected')} value={formatUsd(kpis.total)} />
            <Kpi label={t('admin.ui.donors.table.count','Donations')} value={kpis.count} />
            <Kpi label={t('admin.ui.donors.kpis.average','Average donation')} value={formatUsd(kpis.avg||0)} />
            <Kpi label={t('admin.ui.donors.kpis.last','Last donation')} value={(kpis.last||'').slice(0,10)||'—'} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donations history */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
          <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
            <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.donors.profile.history','Donations history')}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-[var(--text-primary)]">
              <thead>
                <tr className="text-left text-[var(--color-text-secondary)]">
                  <th className="py-3 pl-4 pr-4">{t('admin.ui.table.date','Date')}</th>
                  <th className="py-3 pr-4">{t('admin.ui.donors.profile.destination','Destination')}</th>
                  <th className="py-3 pr-4">{t('admin.ui.donors.profile.method','Method')}</th>
                  <th className="py-3 pr-4">{t('admin.ui.table.status','Status')}</th>
                  <th className="py-3 pr-4">{t('admin.ui.donors.profile.amount','Amount')}</th>
                  <th className="py-3 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d=> (
                  <tr key={d.id} className="border-t" style={{borderColor:'var(--color-border)'}}>
                    <td className="py-2 pl-4 pr-4">{(d.date||'').slice(0,10)}</td>
                    <td className="py-2 pr-4">{d.projectId && d.projectId!=='GEN'? (d.projectTitle||d.projectId) : t('admin.ui.donors.filters.dest.general','General fund')}</td>
                    <td className="py-2 pr-4">{d.method}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] border ${d.status==='succeeded'?'bg-emerald-50 text-emerald-700 border-emerald-200': d.status==='pending'?'bg-amber-50 text-amber-700 border-amber-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{d.status}</span>
                    </td>
                    <td className="py-2 pr-4">{formatUsd(d.amount)}</td>
                    <td className="py-2 pr-4 text-right">
                      {d.status==='succeeded' && (
                        <Button size="sm" variant="secondary" className="rounded-full" onClick={()=> openRefundFor(d.id)}>{t('admin.ui.donors.profile.requestRefund','Request refund')}</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {donations.length===0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('admin.ui.donors.profile.noDonations','No donations')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Impact and Refunds */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
            <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
              <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.donors.profile.projects','Projects supported')}</div>
            </div>
            <div className="p-3">
              {projectsSupported.length? (
                <ul className="list-disc pl-5 text-[13px] text-[var(--text-primary)]">
                  {projectsSupported.map(p=> <li key={p}>{p}</li>)}
                </ul>
              ) : <div className="text-[13px] text-[var(--muted-color)]">{t('admin.ui.donors.profile.generalOnly','General fund only')}</div>}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
            <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
              <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.donors.profile.refunds','Refunds')}</div>
            </div>
            <div className="p-3 space-y-2">
              {refunds.length===0 && <div className="text-[13px] text-[var(--muted-color)]">{t('admin.ui.donors.profile.noRefunds','No refund requests.')}</div>}
              {refunds.map(r=> (
                <div key={r.id} className="p-3 rounded-lg border flex items-center justify-between" style={{borderColor:'var(--color-border)'}}>
                  <div>
                    <div className="text-[13px] text-[var(--text-primary)]">{(r.createdAt||'').slice(0,10)} • {formatUsd(r.amount)}</div>
                    <div className="text-[12px] text-[var(--muted-color)]">{r.reason||'—'}</div>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] border ${r.status==='approved'?'bg-emerald-50 text-emerald-700 border-emerald-200': r.status==='pending'?'bg-amber-50 text-amber-700 border-amber-200': r.status==='paid'?'bg-sky-50 text-sky-700 border-sky-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Refund modal */}
      <Modal isOpen={openRefund} onClose={()=> setOpenRefund(false)} title={t('admin.ui.donors.profile.requestRefund','Request refund')} size="lg">
        <div className="space-y-3">
          <div>
            <label className="text-[12px]">{t('admin.ui.donors.profile.donation','Donation')}</label>
            <select value={selectedDonation} onChange={e=> setSelectedDonation(e.target.value)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
              <option value="">{t('admin.ui.donors.profile.selectDonation','Select donation')}</option>
              {donations.filter(d=> d.status==='succeeded').map(d=> (
                <option key={d.id} value={d.id}>{(d.date||'').slice(0,10)} • {d.projectId && d.projectId!=='GEN'? (d.projectTitle||d.projectId): t('admin.ui.donors.filters.dest.general','General')} • {formatUsd(d.amount)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[12px]">{t('admin.ui.donors.profile.amount','Amount')}</label>
            <Input type="number" value={amount} onChange={e=> setAmount(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-[12px]">{t('admin.ui.donors.profile.reason','Reason')}</label>
            <textarea value={reason} onChange={e=> setReason(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={()=> setOpenRefund(false)}>{t('common.cancel')}</Button>
            <Button disabled={!selectedDonation || amount<=0} onClick={submitRefund}>{t('common.submit')}</Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
};

export default AdminDonorProfile;

const Kpi: React.FC<{label:string; value: React.ReactNode}> = ({label,value}) => (
  <div className="rounded-xl p-3 bg-[var(--chip-bg)] border text-center min-w-[120px]" style={{borderColor:'var(--color-border)'}}>
    <div className="text-[11px] text-[var(--muted-color)]">{label}</div>
    <div className="text-[18px] font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);
