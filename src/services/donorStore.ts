// Local donor/donation store with simple aggregates. Backed by localStorage for demo purposes.
// Reuses Donation types shape loosely, but self-contained to avoid coupling.

export type DonationMethod = 'card'|'mobile_money'|'bank';
export type DonationStatus = 'succeeded'|'pending'|'failed';
export type RefundStatus = 'pending'|'approved'|'rejected'|'canceled'|'paid';

export interface DonorRecord {
  id: string;
  name: string;            // can be 'Anonyme' when anonymous
  email?: string;          // undefined if anonymous or unavailable
  country?: string;        // ISO name or localized label
  language?: string;       // EN/FR
  anonymous?: boolean;     // true if prefers anonymity
  createdAt: string;       // ISO
}

export interface DonationRecord {
  id: string;
  donorId: string;
  projectId?: string;      // undefined means general fund
  projectTitle?: string;   // denormalized for display
  amount: number;          // in USD for demo
  currency: string;        // 'USD'
  method: DonationMethod;  // card, mm, bank
  status: DonationStatus;  // succeeded, pending, failed
  date: string;            // ISO
}

export interface RefundRequestRecord {
  id: string;
  donorId: string;
  donationId: string;
  amount: number;
  reason?: string;
  status: RefundStatus;
  createdAt: string;
  attachmentName?: string;
}

export interface DonorIndexRow {
  id: string;
  name: string;
  email?: string;
  totalDonated: number;
  donationsCount: number;
  lastDonation?: string; // ISO
  anonymous?: boolean;
}

const LS_KEY = 'e4d_donors_v1';

interface Snapshot {
  donors: DonorRecord[];
  donations: DonationRecord[];
  refunds: RefundRequestRecord[];
}

function load(): Snapshot {
  try { const raw = localStorage.getItem(LS_KEY); if(!raw) return seed(); const obj = JSON.parse(raw) as Snapshot; if(!obj || !Array.isArray(obj.donors)) return seed(); return obj; } catch { return seed(); }
}
function persist(s: Snapshot){ localStorage.setItem(LS_KEY, JSON.stringify(s)); }

function seed(): Snapshot {
  const donors: DonorRecord[] = [
    { id:'d1', name:'Deerfield Academy', email:'giving@deerfield.edu', country:'United States', language:'EN', anonymous:false, createdAt:'2024-09-01' },
    { id:'d2', name:'Alice K.', email:'alice.k@example.com', country:'Burundi', language:'EN', anonymous:false, createdAt:'2024-05-10' },
    { id:'d3', name:'Anonyme', email:undefined, country:'—', language:'EN', anonymous:true, createdAt:'2025-01-01' },
    { id:'d4', name:'B. T.', email:'bt@example.org', country:'Burundi', language:'FR', anonymous:false, createdAt:'2024-02-02' },
  ];
  const donations: DonationRecord[] = [
    { id:'x1', donorId:'d1', projectId:'P-0926', projectTitle:'D-2025-0926 Gitega Schools', amount:1000, currency:'USD', method:'card', status:'succeeded', date:'2025-09-18T15:32:00Z' },
    { id:'x2', donorId:'d1', projectId:'GEN', projectTitle:'Fonds général', amount:800, currency:'USD', method:'card', status:'succeeded', date:'2025-03-02' },
    { id:'x3', donorId:'d1', projectId:'P-0314', projectTitle:'D-2025-0314-6 Kigali Schools', amount:800, currency:'USD', method:'card', status:'succeeded', date:'2025-05-09' },
    { id:'x4', donorId:'d1', projectId:'P-0110', projectTitle:'D-2025-0110 Arusha Cohort', amount:600, currency:'USD', method:'card', status:'succeeded', date:'2025-01-21' },
    { id:'x5', donorId:'d2', projectId:'GEN', projectTitle:'Fonds général', amount:980, currency:'USD', method:'card', status:'succeeded', date:'2025-09-14' },
    { id:'x6', donorId:'d3', projectId:'GEN', projectTitle:'Fonds général', amount:560, currency:'USD', method:'card', status:'succeeded', date:'2025-09-10' },
    { id:'x7', donorId:'d4', projectId:'GEN', projectTitle:'Fonds général', amount:1760, currency:'USD', method:'card', status:'succeeded', date:'2025-09-05' },
  ];
  const refunds: RefundRequestRecord[] = [
    { id:'r1', donorId:'d1', donationId:'x1', amount:200, reason:'Partial refund test', status:'pending', createdAt:'2025-09-19' },
  ];
  const s: Snapshot = { donors, donations, refunds };
  persist(s); return s;
}

function indexRows(s: Snapshot): DonorIndexRow[] {
  const map = new Map<string, DonorIndexRow>();
  s.donors.forEach(d => {
    map.set(d.id, { id:d.id, name:d.name, email:d.email, totalDonated:0, donationsCount:0, lastDonation:undefined, anonymous:d.anonymous });
  });
  s.donations.forEach(tx => {
    if(tx.status!=='succeeded') return;
    const row = map.get(tx.donorId);
    if(!row) return;
    row.totalDonated += tx.amount;
    row.donationsCount += 1;
    if(!row.lastDonation || new Date(tx.date) > new Date(row.lastDonation)) row.lastDonation = tx.date;
  });
  return Array.from(map.values()).sort((a,b)=> b.totalDonated - a.totalDonated);
}

export function getAggregates(){
  const s = load();
  const rows = indexRows(s);
  const nbDonors = rows.length;
  const collected = rows.reduce((a,r)=> a+r.totalDonated, 0);
  const allDonations = s.donations.filter(d=> d.status==='succeeded');
  const avg = allDonations.length? (allDonations.reduce((a,d)=> a+d.amount,0)/allDonations.length): 0;
  const top5 = rows.slice(0,5).map((r,i)=> ({ rank:i+1, name:r.name, amount:r.totalDonated }));
  return { nbDonors, collected, average: avg, top5 };
}

export const donorStore = {
  listDonors(): DonorIndexRow[] { return indexRows(load()); },
  getDonor(id: string): DonorRecord|undefined { return load().donors.find(d=> d.id===id); },
  getDonationsByDonor(id: string): DonationRecord[] { return load().donations.filter(d=> d.donorId===id).sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime()); },
  getRefundsByDonor(id: string): RefundRequestRecord[] { return load().refunds.filter(r=> r.donorId===id).sort((a,b)=> new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()); },
  addDonor(input: { name: string; email?: string; country?: string; language?: string; anonymous?: boolean }): string {
    const s = load();
    // if email provided, try to reuse existing donor
    if(input.email){
      const existing = s.donors.find(d=> d.email && d.email.toLowerCase()===input.email!.toLowerCase());
      if(existing){ return existing.id; }
    }
    const id = 'd_'+Math.random().toString(36).slice(2,9);
    const rec: DonorRecord = { id, name: input.name||'Anonyme', email: input.email, country: input.country, language: input.language, anonymous: !!input.anonymous, createdAt: new Date().toISOString() };
    s.donors.push(rec); persist(s); return id;
  },
  addDonation(d: DonationRecord){ const s=load(); s.donations.push(d); persist(s); },
  requestRefund(r: RefundRequestRecord){ const s=load(); s.refunds.push(r); persist(s); },
  updateRefundStatus(id:string, status: RefundStatus){ const s=load(); const r=s.refunds.find(x=> x.id===id); if(r){ r.status=status; persist(s);} },
};

export type { DonorRecord as Donor, DonationRecord as DonationTx, RefundRequestRecord as RefundRequest };
