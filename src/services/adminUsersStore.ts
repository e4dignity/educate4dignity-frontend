export type AdminStatus = 'invited'|'active'|'suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: string[]; // e.g., 'Superadmin', 'Finance', 'Projet', 'Lecture seule', 'E-learning'
  status: AdminStatus;
  country: string; // e.g., BI, RW, TZ
  language?: string; // FR/EN
  timezone?: string; // Africa/Bujumbura, etc.
  lastAccess?: string; // ISO datetime
  twoFactorRequired?: boolean;
  sessionsRecentCount?: number; // last 30d
  sensitiveExportsCount?: number; // last 30d
  scopes?: { projects?: string[]; countries?: string[] };
  notes?: string; // internal audit notes
  auditLog?: { date:string; action:string; object?:string; details?:string; result?:'Succès'|'Échec' }[];
  documents?: { name: string; url?: string; size?: number; uploadedAt?: string }[];
}

const STORAGE_KEY = 'e4d.adminUsers.v1';

function seed(): AdminUser[] {
  const now = new Date();
  const iso = (d:Date)=> d.toISOString().slice(0,16);
  const ago = (h:number)=> iso(new Date(now.getTime()-h*3600_000));
  return [
    { id:'A1', name:'Aïcha K.', email:'aicha@e4d.org', roles:['Superadmin','Finance'], status:'active', country:'BI', language:'FR', timezone:'Africa/Bujumbura', lastAccess: ago(2), twoFactorRequired:true, sessionsRecentCount:14, sensitiveExportsCount:0, scopes:{ projects:['D-2025-0926-001','D-2025-0110-003'], countries:['BI','RW'] }, notes:'Créée le 2025-09-15 par Superadmin. Portée limitée à EAC. Autorise dépenses jusqu’à 5k.', auditLog:[ {date:ago(2), action:'Connexion', object:'Back-office', result:'Succès'}, {date:ago(24), action:'Créer dépense', object:'Projet D-2025-0926-001', details:'$260', result:'Succès'}, {date:ago(45), action:'Valider rapport', object:'Projet D-2025-0926-001', result:'Succès'} ] },
    { id:'A2', name:'Jean M.', email:'jean@e4d.org', roles:['Projet'], status:'active', country:'BI', lastAccess: ago(20), twoFactorRequired:true, sessionsRecentCount:9, sensitiveExportsCount:0 },
    { id:'A3', name:'Dora N.', email:'dora@e4d.org', roles:['Finance'], status:'suspended', country:'RW', lastAccess: ago(200), twoFactorRequired:false, sessionsRecentCount:2, sensitiveExportsCount:0 },
    { id:'A4', name:'Léa T.', email:'lea@e4d.org', roles:['Projet'], status:'invited', country:'BI', sessionsRecentCount:0, sensitiveExportsCount:0 },
    { id:'A5', name:'Ibrahim C.', email:'ibrahim@e4d.org', roles:['Projet','Finance'], status:'active', country:'TZ', lastAccess: ago(30), twoFactorRequired:true, sessionsRecentCount:11, sensitiveExportsCount:0 },
  ];
}

function load(): AdminUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return persist(seed());
    return JSON.parse(raw) as AdminUser[];
  } catch {
    return persist(seed());
  }
}
function persist(arr: AdminUser[]): AdminUser[] { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); return arr; }

export const adminUsersStore = {
  list(): AdminUser[] { return load().map(x=> ({...x})); },
  get(id:string): AdminUser | undefined { return load().find(x=> x.id===id); },
  add(u: Omit<AdminUser,'id'> & { id?: string }): AdminUser {
    const id = u.id || 'A'+ Math.floor(Math.random()*90000+10000);
    const full: AdminUser = { ...u, id } as AdminUser;
    persist([full, ...load()]);
    return full;
  },
  update(id:string, patch: Partial<AdminUser>): AdminUser | undefined {
    const arr = load();
    const idx = arr.findIndex(x=> x.id===id);
    if (idx===-1) return undefined;
    arr[idx] = { ...arr[idx], ...patch };
    persist(arr);
    return arr[idx];
  },
  removeMany(ids:string[]) { const set=new Set(ids); persist(load().filter(x=> !set.has(x.id))); },
  toCsv(rows?: AdminUser[]): string {
    const arr = rows ?? load();
    const H = ['id','name','email','roles','status','country','language','timezone','lastAccess','twoFactorRequired'];
    const esc = (s:any)=> '"'+String(s??'').replace(/"/g,'""')+'"';
    return [H.join(','), ...arr.map(r=> [r.id,r.name,r.email,(r.roles||[]).join('|'),r.status,r.country,r.language||'',r.timezone||'',r.lastAccess||'', r.twoFactorRequired?'Oui':'Non'].map(esc).join(','))].join('\n');
  },
};
