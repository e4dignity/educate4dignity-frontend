// Base de données mock centralisée pour tout le frontend
// Étendre ici (projects, donors, users, etc.) afin de simuler un backend unique.

import type { DashboardData } from '../services/dashboardService';

// === Plan & Milestones Data Model ===
// Activities: granular actionable tasks for a project Kanban
export interface ProjectActivity {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type?: 'achat'|'production'|'distribution'|'formation'|'recherche_dev'|'autre';
  assignee?: string; // operator name
  assigneeType?: 'distributeur' | 'producteur' | 'fournisseur' | 'achat' | 'formateur' | 'chef de projet' | 'agent de terrain' | 'r&d' | 'autre';
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority?: 'low' | 'medium' | 'high';
  due?: string; // ISO date
  startDate?: string; // ISO
  endDate?: string; // ISO
  plannedBudget?: number; // USD planned
  allocated?: number; // auto allocated collected
  // Actor submission fields (to complete an activity)
  actualSpent?: number; // USD actually used (estimation)
  supplyChainInfo?: string; // notes about suppliers, deliveries, logistics
  completionNotes?: string; // short narrative report
  kpiActualValue?: number; // universal actual KPI achieved
  // Type-specific actuals
  distributionKits?: number; // for distribution activities
  purchaseItems?: string; // for achat activities (comma/line separated)
  trainingSessionsDone?: number; // for formation activities
  trainingParticipantsF?: number; // actual female participants trained
  trainingParticipantsM?: number; // actual male participants trained
  kpiTargetValue?: number; // target numeric
  kpiUnit?: string; // e.g. kits | écoles | %
  sessionsPlanned?: number; // formation specific
  participantsExpectedF?: number;
  participantsExpectedM?: number;
  progress?: number; // 0-100 (derived or manually set)
  updatedAt: string; // ISO date
  category?: string; // e.g. distribution | formation | production etc.
  attachments?: { id:string; name:string; size:number; type:string }[]; // simple in-memory list
  // Review workflow (optional)
  reviewStatus?: 'brouillon' | 'soumis' | 'validé' | 'rejeté';
  submittedBy?: string;
  submittedAt?: string; // ISO
  reviewedBy?: string;
  reviewedAt?: string; // ISO
  reviewNotes?: string;
  // Activity-level risks/issues captured on submission
  issues?: string;
}

// Milestones: higher-level checkpoints with progress implication
export interface ProjectMilestone {
  id: string;
  projectId: string;
  label: string;
  targetDate?: string; // ISO
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
  progress: number; // 0-100
  activityId?: string; // optional link to activity
  plannedBudget?: number; // portion of activity budget
  // Planning metadata (optional)
  type?: 'distribution' | 'formation' | 'recherche_dev' | 'achat' | 'hybride' | 'autre';
  owner?: string; // responsable du jalon
  location?: string; // site / zone
  // Targets per project type (optional)
  targetKits?: number; // distribution
  targetSchools?: number; // distribution
  sessionsPlanned?: number; // formation
  participantsExpectedF?: number; // formation
  participantsExpectedM?: number; // formation
  itemsScope?: string; // achat (articles / lots)
  poRef?: string; // achat PO/reference
  prototypeVersion?: string; // R&D
  hypothesis?: string; // R&D
  dependsOnId?: string; // simple dependency on another milestone
  risk?: 'low' | 'medium' | 'high';
  externalRef?: string; // external tracking code/ID
  description?: string; // notes at planning time
  // Logistics tracking (optional)
  logisticsStatus?: 'prep' | 'pickup' | 'in_transit' | 'customs' | 'delayed' | 'delivered';
  origin?: string;
  destination?: string;
  carrier?: string;
  trackingNumber?: string;
  eta?: string; // ISO ETA
  shippedOn?: string; // ISO
  deliveredOn?: string; // ISO
  qtyPlanned?: number;
  qtyShipped?: number;
  qtyReceived?: number;
  unit?: string; // e.g. kits, cartons
  damagesNotes?: string;
  // Actor submission fields (milestone-specific)
  actualSpentUSD?: number; // spent attributable to this milestone (USD)
  notes?: string; // milestone-specific notes / narrative
  attachments?: { id:string; name:string; size:number; type:string }[]; // files tied to this milestone
  // Additional details captured on submission
  completedOn?: string; // ISO date when milestone completed/reached
  issues?: string; // risks or blockers encountered
  nextSteps?: string; // follow-ups
  outputs?: number; // deliverables count for this milestone
  outputsUnit?: string; // unit for deliverables (e.g., kits, sessions)
  // Review workflow (optional)
  reviewStatus?: 'brouillon' | 'soumis' | 'validé' | 'rejeté';
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// Phases: Timeline segments (Gantt style)
export interface ProjectPhase {
  id: string;
  projectId: string;
  name: string;
  start: string; // ISO
  end: string;   // ISO
  color?: string; // optional hex for display
}

// Expenses linked to activity & optional milestone
export interface ProjectExpense {
  id: string;
  projectId: string;
  activityId: string;
  milestoneId?: string;
  category: string; // production | distribution | formation | admin | achat | logistique
  date: string; // ISO
  description: string;
  payee: string;
  method: string; // Cash | Virement | Mobile
  currency: string; // USD | BIF etc.
  amount: number; // original currency amount
  fx?: number; // rate to USD
  status: 'draft' | 'soumis' | 'validé' | 'rejeté';
  // Optional receipt filename (mock only)
  attachment?: string;
}

// Reports
export interface ProjectReport {
  id: string;
  projectId: string;
  type: 'mensuel' | 'milestone' | 'final';
  period?: string; // e.g. 2025-03 for mensuel
  milestoneId?: string;
  activityId?: string;
  author: string;
  submittedAt?: string;
  status: 'brouillon' | 'soumis' | 'validé' | 'rejeté';
  file?: string; // filename placeholder
}

// Beneficiaries simple aggregation entries
export interface BeneficiaryRecord {
  id: string;
  projectId: string;
  date: string; // ISO
  type: 'distribution' | 'formation';
  females: number;
  males: number;
  notes?: string;
  file?: string; // optional filename for list export/link
}

export interface ProjectRow {
  id: string; // short code
  name: string;
  type: 'blank' | 'distribution' | 'formation' | 'recherche_dev' | 'achat' | 'hybride';
  organisation: string;
  orgType?: 'ong' | 'ecole' | 'association' | 'institution' | 'organisation';
  location: string; // Country • City or region
  start: string; // ISO date
  status: 'actif' | 'en pause' | 'clos' | 'draft';
  budget: number; // planned budget
  collected: number; // collected amount
  spent: number; // spent amount
  manager?: string; // project manager (name or id)
  shortDescription?: string; // brief summary for cards
  longDescription?: string; // full narrative description
  coverImage?: string; // URL/path to cover image
  videoUrl?: string; // optional video URL (embed)
  operators?: string[]; // field operators
  primaryOperator?: string; // designated leader
}

export interface MockDB {
  dashboard: DashboardData;
  projects: ProjectRow[];
  projectActivities: ProjectActivity[];
  projectMilestones: ProjectMilestone[];
  projectPhases: ProjectPhase[];
  projectExpenses: ProjectExpense[];
  projectReports: ProjectReport[];
  beneficiaries: BeneficiaryRecord[];
}

export const db: MockDB = {
  dashboard: {
    kpis: {
      projects_active: 28,
      collected_month: 42300,
      collected_total: 284900,
      spent_month: 28900,
      spent_total: 196400,
      beneficiaries_month: 1420,
      beneficiaries_total: 12960,
      distribution_bar: [35, 15, 50],
    },
    charts: {
      // Codes mois (jan..dec) pour traduction via i18n
      months: ['jan','feb','mar','apr','may','jun'],
      bar: {
        collecte: [22, 26, 24, 28, 30, 32],
        planifié: [24, 28, 27, 30, 32, 34],
        dépensé: [18, 22, 21, 25, 26, 28],
      },
      milestones_percent: [20, 35, 50, 65, 78, 86],
      pie_spending: [
        { label: 'Production', value: 45 },
        { label: 'Distribution', value: 32 },
        { label: 'Formation', value: 18 },
        { label: 'Admin', value: 5 },
      ],
    },
    recent: [
      { date: '2025-09-24', type: 'don', ref: 'P#R45S-DON-8932', statut: 'réussi', montant: 1200, action: 'voir' },
      { date: '2025-09-23', type: 'rapport', ref: 'D123-final', statut: 'soumis', montant: null, action: 'valider' },
      { date: '2025-09-22', type: 'don', ref: 'P#G22-DON-1121', statut: 'réussi', montant: 600, action: 'voir' },
      { date: '2025-09-22', type: 'don', ref: 'P#G22-DON-1120', statut: 'réussi', montant: 200, action: 'voir' },
      { date: '2025-09-21', type: 'projet', ref: 'RS6', statut: 'draft', montant: null, action: 'éditer' },
      { date: '2025-09-20', type: 'rapport', ref: 'RS6-m1', statut: 'validé', montant: null, action: 'voir' },
      { date: '2025-09-19', type: 'don', ref: 'P#B17-DON-7001', statut: 'remboursé', montant: -200, action: 'voir' },
      { date: '2025-09-19', type: 'rapport', ref: 'G33-m2', statut: 'rejeté', montant: null, action: 'voir' },
      { date: '2025-09-18', type: 'projet', ref: 'G33', statut: 'actif', montant: null, action: 'voir' },
    ],
  },
  projects: [
  { id:'D123', name:'Gitega School Kits', type:'distribution', organisation:'SaCoDó', orgType:'ong', location:'Burundi • Gitega', start:'2025-01-20', status:'actif', budget:120000, collected:92000, spent:61000, shortDescription:'Reusable kits for rural schools', longDescription:'Programme de distribution de kits réutilisables visant à améliorer la santé menstruelle dans les écoles rurales de Gitega. Inclut formation des enseignants, implication communautaire et suivi d\'impact.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Alice','Jean','Chantal'], primaryOperator:'Jean' },
  { id:'R56', name:'Kigali Coop Scale-up', type:'recherche_dev', organisation:'Umoja Coop', orgType:'association', location:'Rwanda • Kigali', start:'2025-02-02', status:'en pause', budget:180000, collected:140000, spent:90000, shortDescription:'Scaling cooperative pad R&D', longDescription:'Projet d\'échelle pour la coopérative locale afin d\'améliorer la capacité de production et l\'innovation des produits.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Peter','Grace'], primaryOperator:'Grace' },
  { id:'G33', name:'MHM + Wash Edu', type:'formation', organisation:'CRES', orgType:'ong', location:'DRC • Goma', start:'2025-03-22', status:'actif', budget:95000, collected:64000, spent:36000, shortDescription:'Menstrual health & hygiene education', longDescription:'Sessions éducatives intégrées sur la santé menstruelle et l\'hygiène WASH pour élèves et communautés locales.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Alice','Chantal'], primaryOperator:'Alice' },
  { id:'B17', name:'Last-mile Distribution', type:'distribution', organisation:'PHC', orgType:'ong', location:'Burundi • Rural', start:'2025-04-02', status:'clos', budget:98000, collected:96000, spent:96000, shortDescription:'Closing distribution cycle', longDescription:'Dernière phase de distribution avec consolidation des données d\'impact et collecte de témoignages.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Jean'], primaryOperator:'Jean' },
  { id:'Z09', name:'Boarding Kits', type:'distribution', organisation:'Mof Relapur', orgType:'ecole', location:'India • Raipur', start:'2025-03-01', status:'actif', budget:160000, collected:118000, spent:68000, shortDescription:'Kits for boarding schools', longDescription:'Distribution ciblée pour internats avec modules d\'hygiène et formation du personnel.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Grace','Chantal','Peter'], primaryOperator:'Grace' },
  { id:'Q21', name:'Supplier Onboarding', type:'achat', organisation:'Central Proc', orgType:'organisation', location:'Sénégal • Dakar', start:'2025-01-14', status:'actif', budget:60000, collected:26000, spent:12000, shortDescription:'Integrate new suppliers', longDescription:'Processus d\'intégration pour nouveaux fournisseurs : homologation qualité, contrats et logistique.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Peter'], primaryOperator:'Peter' },
  { id:'E21', name:'Teacher Training', type:'formation', organisation:'School Board', orgType:'ecole', location:'Tanzania • Mwanza', start:'2025-05-02', status:'actif', budget:60000, collected:18000, spent:6000, shortDescription:'Training sessions for teachers', longDescription:'Renforcement des capacités des enseignants sur l\'éducation menstruelle et hygiène.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Alice','Grace'], primaryOperator:'Grace' },
  { id:'Q77', name:'Pad R&D Lots', type:'recherche_dev', organisation:'Umoja Coop', orgType:'association', location:'Rwanda • Kigali', start:'2025-01-22', status:'actif', budget:82000, collected:51000, spent:22000, shortDescription:'Multiple R&D iterations', longDescription:'Itérations successives de conception et tests terrain pour pads réutilisables.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Peter','Jean'], primaryOperator:'Peter' },
  { id:'H01', name:'Hybrid Pilot', type:'hybride', organisation:'SaCoDó', orgType:'ong', location:'Burundi • Gitega', start:'2025-07-01', status:'draft', budget:45000, collected:5000, spent:2000, shortDescription:'Pilot combining distribution & training', longDescription:'Projet pilote hybride combinant distribution de kits et sessions de formation.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Alice','Jean','Grace'], primaryOperator:'Alice' },
  { id:'B00', name:'Blank Template Seed', type:'blank', organisation:'Template Org', orgType:'organisation', location:'Burundi • ---', start:'2025-08-15', status:'draft', budget:0, collected:0, spent:0, shortDescription:'Empty template project', longDescription:'Projet vierge servant de modèle initial.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Jean'], primaryOperator:'Jean' },
  { id:'M12', name:'WASH Sessions', type:'formation', organisation:'CRES', orgType:'ong', location:'DRC • Goma', start:'2025-02-02', status:'en pause', budget:70000, collected:19000, spent:8000, shortDescription:'Water sanitation sessions', longDescription:'Programme de sessions WASH complémentaires à l\'éducation menstruelle.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Chantal','Grace'], primaryOperator:'Chantal' },
  { id:'A05', name:'Emergency Refill', type:'achat', organisation:'Central Proc', orgType:'organisation', location:'Burundi • Gitega', start:'2025-06-02', status:'actif', budget:30000, collected:22000, spent:9000, shortDescription:'Emergency stock refill', longDescription:'Réapprovisionnement d\'urgence pour maintenir les niveaux de stock critiques.', coverImage:'/photos/jeune-adulte-deprime-a-la-maison.jpg', operators:['Peter','Grace'], primaryOperator:'Peter' },
  ],
  projectActivities: [
    // Seed sample activities for a few projects
  { id:'A1', projectId:'D123', title:'Confirmer fournisseurs kits', assignee:'Jean', assigneeType:'achat', status:'in_progress', priority:'high', due:'2025-02-05', progress:55, updatedAt:'2025-01-28' },
  { id:'A2', projectId:'D123', title:'Plan logistique distribution', description:'Définir itinéraires, équipes, et calendrier des livraisons pour Gitega.', assignee:'Chantal', assigneeType:'distributeur', status:'todo', priority:'medium', due:'2025-02-10', progress:0, updatedAt:'2025-01-28', kpiTargetValue:2000, kpiUnit:'kits' },
  { id:'A3', projectId:'D123', title:'Former 2 écoles pilotes', description:'Sessions de formation initiales pour enseignants et élèves (2 écoles).', assignee:'Alice', assigneeType:'formateur', status:'todo', priority:'high', due:'2025-02-18', progress:10, updatedAt:'2025-01-28', kpiTargetValue:4, kpiUnit:'sessions' },
  { id:'A4', projectId:'R56', title:'Valider design lot #2', assignee:'Grace', assigneeType:'r&d', status:'blocked', priority:'high', due:'2025-02-08', progress:30, updatedAt:'2025-01-27' },
  { id:'A5', projectId:'R56', title:'Collecter retours coopératives', assignee:'Peter', assigneeType:'r&d', status:'in_progress', priority:'medium', due:'2025-02-12', progress:40, updatedAt:'2025-01-28' },
  ],
  projectMilestones: [
    // Link milestones to activities to ease simulation
    { id:'M1', projectId:'D123', label:'1ère vague kits envoyée', targetDate:'2025-02-12', status:'on_track', progress:40, activityId:'A2', plannedBudget: 12000 },
    { id:'M1b', projectId:'D123', label:'Distribution écoles pilote bouclée', targetDate:'2025-02-20', status:'not_started', progress:0, activityId:'A2', plannedBudget: 8000 },
    { id:'M2', projectId:'D123', label:'Formation enseignants terminée', targetDate:'2025-03-05', status:'not_started', progress:0, activityId:'A3', plannedBudget: 10000 },
    { id:'M2b', projectId:'D123', label:'Évaluation post-formation', targetDate:'2025-03-12', status:'not_started', progress:0, activityId:'A3', plannedBudget: 4000 },
    { id:'M1a', projectId:'D123', label:'Fournisseurs confirmés', targetDate:'2025-02-08', status:'on_track', progress:60, activityId:'A1', plannedBudget: 5000 },
    { id:'M3', projectId:'R56', label:'Prototype V2 validé', targetDate:'2025-02-28', status:'at_risk', progress:20, activityId:'A4', plannedBudget: 9000 },
    { id:'M3b', projectId:'R56', label:'Retours coopératives consolidés', targetDate:'2025-03-10', status:'not_started', progress:0, activityId:'A5', plannedBudget: 3000 },
  ],
  projectPhases: [
    { id:'PH1', projectId:'D123', name:'Préparation', start:'2025-01-15', end:'2025-02-05', color:'#6366F1' },
    { id:'PH2', projectId:'D123', name:'Distribution', start:'2025-02-06', end:'2025-03-10', color:'#10B981' },
    { id:'PH3', projectId:'R56', name:'R&D Itération 2', start:'2025-01-20', end:'2025-02-25', color:'#F59E0B' },
  ],
  projectExpenses: [
    { id:'E1', projectId:'D123', activityId:'A1', category:'production', date:'2025-02-18', description:'Contrôle qualité lots P01-02', payee:'Umoja Coop', method:'Virement', currency:'BIF', amount:2300000, fx:0.00034, status:'validé' },
    { id:'E2', projectId:'D123', activityId:'A2', category:'transport', date:'2025-03-05', description:'Camion hub→écoles (Gitega)', payee:'Transco Gitega', method:'Mobile', currency:'BIF', amount:6800000, fx:0.00034, status:'validé' },
    { id:'E3', projectId:'D123', activityId:'A3', category:'formation', date:'2025-03-15', description:'Défraiement formateurs', payee:'Alice & Eric', method:'Cash', currency:'BIF', amount:1560000, fx:0.00034, status:'soumis' },
    { id:'E4', projectId:'D123', activityId:'A1', category:'admin', date:'2025-03-18', description:'Frais plateforme dons', payee:'Stripe', method:'CB', currency:'USD', amount:320, fx:1, status:'validé' },
    { id:'E5', projectId:'D123', activityId:'A2', category:'achat', date:'2025-02-12', description:'Tissu coton (200m)', payee:'Textiles SA', method:'Virement', currency:'USD', amount:4600, fx:1, status:'validé' },
  ],
  projectReports: [
    { id:'RPT1', projectId:'D123', type:'mensuel', period:'2025-03', author:'Equipe terrain', submittedAt:'2025-03-31', status:'validé', file:'rapport_mensuel_2025-03.pdf' },
    { id:'RPT2', projectId:'D123', type:'milestone', milestoneId:'M1', author:'Chef projet', submittedAt:'2025-03-18', status:'validé', file:'rapport_QA_M02.pdf' },
    { id:'RPT3', projectId:'D123', type:'final', author:'Chef projet', submittedAt:undefined, status:'brouillon', file:'rapport_final_draft.pdf' },
    { id:'RPT4', projectId:'D123', type:'mensuel', period:'2025-01', author:'Equipe terrain', submittedAt:'2025-01-31', status:'rejeté', file:'rapport_mensuel_2025-01.pdf' },
    { id:'RPT5', projectId:'D123', type:'milestone', milestoneId:'M2', author:'Production', submittedAt:'2025-01-20', status:'validé', file:'rapport_prod_M01.pdf' },
  ],
  beneficiaries: [
    { id:'BENE1', projectId:'D123', date:'2025-02-10', type:'distribution', females:200, males:50, file:'beneficiaires_D123_2025-02-10.csv' },
    { id:'BENE2', projectId:'D123', date:'2025-02-18', type:'formation', females:80, males:15, file:'beneficiaires_D123_2025-02-18.csv' },
    { id:'BENE3', projectId:'D123', date:'2025-03-05', type:'distribution', females:260, males:60, file:'beneficiaires_D123_2025-03-05.csv' },
  ]
};

// Utilitaires évolutifs
export function cloneDashboard(): DashboardData {
  return JSON.parse(JSON.stringify(db.dashboard));
}

export function listProjects(): ProjectRow[] { return JSON.parse(JSON.stringify(db.projects)); }

export function addProject(p: ProjectRow) {
  db.projects.push(p);
  return p;
}

// === Plan Utilities ===
export function listProjectActivities(projectId: string): ProjectActivity[] {
  return db.projectActivities.filter(a => a.projectId === projectId).map(a => ({ ...a }));
}

export function listProjectMilestones(projectId: string): ProjectMilestone[] {
  return db.projectMilestones.filter(m => m.projectId === projectId).map(m => ({ ...m }));
}

export function listProjectPhases(projectId: string): ProjectPhase[] {
  return db.projectPhases.filter(p => p.projectId === projectId).map(p => ({ ...p }));
}

export function addProjectActivity(activity: Omit<ProjectActivity,'id'|'updatedAt'> & { id?: string }): ProjectActivity {
  const id = activity.id || 'A' + Math.floor(Math.random()*9000+1000);
  const full: ProjectActivity = { ...activity, id, updatedAt: new Date().toISOString() };
  db.projectActivities.push(full);
  return { ...full };
}

export function updateActivityStatus(activityId: string, status: ProjectActivity['status']): ProjectActivity | null {
  const idx = db.projectActivities.findIndex(a => a.id === activityId);
  if (idx === -1) return null;
  db.projectActivities[idx].status = status;
  // Simple heuristic: map status to default progress if progress undefined or lower
  const map: Record<ProjectActivity['status'], number> = { todo: 0, in_progress: 40, blocked: 25, done: 100 };
  const current = db.projectActivities[idx].progress ?? 0;
  if (map[status] > current) db.projectActivities[idx].progress = map[status];
  db.projectActivities[idx].updatedAt = new Date().toISOString();
  return { ...db.projectActivities[idx] };
}

export function patchActivity(activityId: string, patch: Partial<ProjectActivity>): ProjectActivity | null {
  const idx = db.projectActivities.findIndex(a => a.id === activityId);
  if(idx===-1) return null;
  db.projectActivities[idx] = { ...db.projectActivities[idx], ...patch, updatedAt: new Date().toISOString() };
  return { ...db.projectActivities[idx] };
}

// --- Review helpers for Activities ---
export function submitActivityForReview(activityId: string, by: string, notes?: string): ProjectActivity | null {
  return patchActivity(activityId, { reviewStatus: 'soumis', submittedBy: by, submittedAt: new Date().toISOString(), reviewNotes: notes });
}
export function approveActivityReview(activityId: string, by: string, notes?: string): ProjectActivity | null {
  return patchActivity(activityId, { reviewStatus: 'validé', reviewedBy: by, reviewedAt: new Date().toISOString(), reviewNotes: notes });
}
export function rejectActivityReview(activityId: string, by: string, notes?: string): ProjectActivity | null {
  return patchActivity(activityId, { reviewStatus: 'rejeté', reviewedBy: by, reviewedAt: new Date().toISOString(), reviewNotes: notes });
}

export function addProjectMilestone(m: Omit<ProjectMilestone,'id'> & { id?: string }): ProjectMilestone {
  const id = m.id || 'MS' + Math.floor(Math.random()*9000+1000);
  const full: ProjectMilestone = { ...m, id };
  db.projectMilestones.push(full);
  return { ...full };
}

export function updateMilestoneStatus(milestoneId: string, status: ProjectMilestone['status'], progress?: number): ProjectMilestone | null {
  const idx = db.projectMilestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  db.projectMilestones[idx].status = status;
  if (typeof progress === 'number') db.projectMilestones[idx].progress = Math.min(100, Math.max(0, progress));
  return { ...db.projectMilestones[idx] };
}

export function patchMilestone(milestoneId: string, patch: Partial<ProjectMilestone>): ProjectMilestone | null {
  const idx = db.projectMilestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  db.projectMilestones[idx] = { ...db.projectMilestones[idx], ...patch };
  return { ...db.projectMilestones[idx] };
}

// --- Review helpers for Milestones ---
export function submitMilestoneForReview(milestoneId: string, by: string, notes?: string): ProjectMilestone | null {
  const idx = db.projectMilestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  db.projectMilestones[idx] = { ...db.projectMilestones[idx], reviewStatus: 'soumis', submittedBy: by, submittedAt: new Date().toISOString(), reviewNotes: notes };
  return { ...db.projectMilestones[idx] };
}
export function approveMilestoneReview(milestoneId: string, by: string, notes?: string): ProjectMilestone | null {
  const idx = db.projectMilestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  db.projectMilestones[idx] = { ...db.projectMilestones[idx], reviewStatus: 'validé', reviewedBy: by, reviewedAt: new Date().toISOString(), reviewNotes: notes };
  return { ...db.projectMilestones[idx] };
}
export function rejectMilestoneReview(milestoneId: string, by: string, notes?: string): ProjectMilestone | null {
  const idx = db.projectMilestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  db.projectMilestones[idx] = { ...db.projectMilestones[idx], reviewStatus: 'rejeté', reviewedBy: by, reviewedAt: new Date().toISOString(), reviewNotes: notes };
  return { ...db.projectMilestones[idx] };
}

export function getProjectById(id: string): ProjectRow | undefined {
  const p = db.projects.find(p => p.id === id);
  return p ? { ...p } : undefined;
}

export function updateProject(id: string, patch: Partial<ProjectRow>): ProjectRow | undefined {
  const idx = db.projects.findIndex(p=>p.id===id);
  if(idx===-1) return undefined;
  db.projects[idx] = { ...db.projects[idx], ...patch };
  return { ...db.projects[idx] };
}

// === Extended listing helpers ===
export function listProjectExpenses(projectId: string): ProjectExpense[] {
  return db.projectExpenses.filter(e=>e.projectId===projectId).map(e=>({...e}));
}
export function listProjectReports(projectId: string): ProjectReport[] {
  return db.projectReports.filter(r=>r.projectId===projectId).map(r=>({...r}));
}
export function listBeneficiaries(projectId: string): BeneficiaryRecord[] {
  return db.beneficiaries.filter(b=>b.projectId===projectId).map(b=>({...b}));
}

export function addBeneficiary(b: Omit<BeneficiaryRecord,'id'> & { id?: string }): BeneficiaryRecord {
  const id = b.id || 'BENE' + Math.floor(Math.random()*9000+1000);
  const row: BeneficiaryRecord = { ...b, id };
  db.beneficiaries.push(row);
  return { ...row };
}

// === Mutations for Expenses & Reports & Project status ===
export function addExpense(e: Omit<ProjectExpense,'id'> & { id?: string }): ProjectExpense {
  const id = e.id || 'E' + Math.floor(Math.random()*9000+1000);
  const row: ProjectExpense = { ...e, id };
  db.projectExpenses.push(row);
  return { ...row };
}

export function updateExpenseStatus(expenseId: string, status: ProjectExpense['status']): ProjectExpense | null {
  const idx = db.projectExpenses.findIndex(x=> x.id===expenseId);
  if(idx===-1) return null;
  db.projectExpenses[idx].status = status;
  return { ...db.projectExpenses[idx] };
}

export function addReport(r: Omit<ProjectReport,'id'> & { id?: string }): ProjectReport {
  const id = r.id || 'RPT' + Math.floor(Math.random()*9000+1000);
  const row: ProjectReport = { ...r, id };
  db.projectReports.push(row);
  return { ...row };
}

export function updateReportStatus(reportId: string, status: ProjectReport['status']): ProjectReport | null {
  const idx = db.projectReports.findIndex(x=> x.id===reportId);
  if(idx===-1) return null;
  db.projectReports[idx].status = status;
  // if status moves to 'soumis' or 'validé' and no submittedAt, set it now
  if((status==='soumis' || status==='validé') && !db.projectReports[idx].submittedAt){
    db.projectReports[idx].submittedAt = new Date().toISOString();
  }
  return { ...db.projectReports[idx] };
}

export function closeProject(projectId: string): ProjectRow | undefined {
  const idx = db.projects.findIndex(p=> p.id===projectId);
  if(idx===-1) return undefined;
  db.projects[idx].status = 'clos';
  return { ...db.projects[idx] };
}
