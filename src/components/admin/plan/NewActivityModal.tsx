import React, { useState, useMemo } from 'react';

// Local input contract for creating a new activity via Admin API
export interface NewActivityInput {
  projectId: string;
  title: string;
  description?: string;
  type?: 'achat'|'production'|'distribution'|'formation'|'recherche_dev'|'autre';
  assignee?: string;
  assigneeType?: 'distributeur' | 'producteur' | 'fournisseur' | 'achat' | 'formateur' | 'chef de projet' | 'agent de terrain' | 'autre' | 'r&d';
  priority?: 'low'|'medium'|'high';
  due?: string;
  startDate?: string;
  endDate?: string;
  plannedBudget?: number;
  allocated?: number;
  kpiTargetValue?: number;
  kpiUnit?: string;
  sessionsPlanned?: number;
  participantsExpectedF?: number;
  participantsExpectedM?: number;
  attachments?: { id:string; name:string; size:number; type:string }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Omit<NewActivityInput,'projectId'>) => void;
  projectType?: string;
  operators?: string[]; // (deprecated) kept for compatibility
  projectBudget?: number;
  existingActivitiesTotal?: number; // sum of planned budgets for already planned activities
}

const typeOptions: {value:NewActivityInput['type']; label:string}[] = [
  {value:'achat', label:'Achat'},
  {value:'production', label:'Production'},
  {value:'distribution', label:'Distribution'},
  {value:'formation', label:'Formation'},
  {value:'recherche_dev', label:'R&D'},
  {value:'autre', label:'Autre'}
];


// For now derive organisation options from hard-coded sample (could be passed as prop later)
const globalOrgCatalogue: { name:string; roles:string[] }[] = [
  { name:'SaCoDó', roles:['distribution','hybride'] },
  { name:'Umoja Coop', roles:['recherche_dev','production'] },
  { name:'CRES', roles:['formation'] },
  { name:'PHC', roles:['distribution'] },
  { name:'Mof Relapur', roles:['distribution'] },
  { name:'Central Proc', roles:['achat'] },
  { name:'School Board', roles:['formation'] },
  { name:'Template Org', roles:['autre'] }
];

export const NewActivityModal: React.FC<Props> = ({open,onClose,onCreate,projectType,projectBudget,existingActivitiesTotal=0}) => {
  const [form,setForm] = useState<Omit<NewActivityInput,'projectId'>>({ title:'', type: projectType as any, attachments: [], assigneeType:'autre'});
  const [dragActive,setDragActive] = useState(false);
  if(!open) return null;

  const update = (k: keyof typeof form, v:any) => setForm(f=>({...f,[k]:v}));
  const totalIfAdded = (existingActivitiesTotal || 0) + (form.plannedBudget||0);
  const exceedsProject = projectBudget ? totalIfAdded > projectBudget : false;
  const submit = () => {
    if(!form.title || !form.type || exceedsProject) return; // validation
    onCreate(form); onClose();
  };

  const type = form.type;
  const isFormation = type==='formation';

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center p-4 bg-black/40 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 space-y-6 border border-[var(--color-border,#e2d6e0)]" style={{boxShadow:'var(--elev-3,0 4px 24px rgba(0,0,0,0.12))'}}>
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold">Nouvelle Activité{type? ' — '+labelType(type):''}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <p className="text-[12px] text-gray-600">Configurez une activité (achat / production / distribution / formation / R&D / autre). Les jalons internes pourront être ajoutés après création.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field label="Type *">
              <select value={form.type||''} onChange={e=>update('type', e.target.value as any)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]">
                <option value="">Choisir...</option>
                {typeOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Titre *">
              <input value={form.title} onChange={e=>update('title', e.target.value)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" placeholder="ex: Production lots P-01 à P-04" />
            </Field>
            <Field label="Description">
              <textarea value={form.description||''} onChange={e=>update('description', e.target.value)} className="w-full rounded-md min-h-[90px] border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] resize-y placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" placeholder="Objectifs, périmètre, partenaires, risques..." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date début *"><input type="date" value={form.startDate||''} onChange={e=>update('startDate', e.target.value)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-2 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" /></Field>
              <Field label="Date fin *"><input type="date" value={form.endDate||''} onChange={e=>update('endDate', e.target.value)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-2 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" /></Field>
            </div>
            <OrganisationSelectors form={form} update={update} />
            <div className="grid grid-cols-2 gap-3">
              <Field label={`Budget planifié *${projectBudget?` (Total: ${(existingActivitiesTotal||0).toLocaleString()} / ${projectBudget.toLocaleString()})`:''}`}>
                <input type="number" value={form.plannedBudget||''} onChange={e=>update('plannedBudget', Number(e.target.value)||undefined)} className={`w-full rounded-md border ${exceedsProject?'border-red-500':'border-[var(--color-border,#d1c3cd)]'} bg-white px-3 py-2 text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]`} placeholder="ex: 90000" />
                {exceedsProject && <p className="text-[10px] text-red-600">Dépasse le budget projet (reste: {(projectBudget! - (existingActivitiesTotal||0)).toLocaleString()}).</p>}
              </Field>
              <Field label="Collecte affectée (auto)"><input disabled value={autoAllocated(form).toLocaleString()} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-gray-50 px-3 py-2 text-[12px] disabled:opacity-60" /></Field>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Field label="Priorité">
                <select value={form.priority||''} onChange={e=>update('priority', e.target.value as any)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]">
                  <option value="">—</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </Field>
              <Field label="Échéance"><input type="date" value={form.due||''} onChange={e=>update('due', e.target.value)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-2 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" /></Field>
              <Field label="Unité KPI"><input value={form.kpiUnit||''} onChange={e=>update('kpiUnit', e.target.value)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" placeholder="kits / écoles / %" /></Field>
              <Field label="Valeur KPI"><input type="number" value={form.kpiTargetValue||''} onChange={e=>update('kpiTargetValue', Number(e.target.value)||undefined)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" /></Field>
            </div>
            {isFormation && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sessions prévues *"><input type="number" value={form.sessionsPlanned||''} onChange={e=>update('sessionsPlanned', Number(e.target.value)||undefined)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" placeholder="ex: 12" /></Field>
                <div />
              </div>
            )}
            {isFormation && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Participants F prévus"><input type="number" value={form.participantsExpectedF||''} onChange={e=>update('participantsExpectedF', Number(e.target.value)||undefined)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" placeholder="ex: 480" /></Field>
                <Field label="Participants M prévus"><input type="number" value={form.participantsExpectedM||''} onChange={e=>update('participantsExpectedM', Number(e.target.value)||undefined)} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" placeholder="ex: 160" /></Field>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <RulesBlock type={type} />
            <AttachmentsArea files={form.attachments||[]} onFiles={(list)=> update('attachments', list)} dragActive={dragActive} setDragActive={setDragActive} />
            <TransparencyBlock type={type} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2 text-sm">
          <button onClick={onClose} className="px-4 py-2 rounded-full border bg-white hover:bg-gray-50">Annuler</button>
          <button onClick={submit} className="px-4 py-2 rounded-full bg-[var(--color-primary,#7b1d4f)] text-white font-medium shadow hover:brightness-110 disabled:opacity-50" disabled={!form.title || !form.type || !form.startDate || !form.endDate || !form.plannedBudget || exceedsProject || !form.assignee}>Créer</button>
        </div>
        <p className="text-[10px] text-gray-500">Champs * obligatoires. Jalons / sessions pourront être ajoutés après la création.</p>
      </div>
    </div>
  );
};

const Field: React.FC<{label:string;children:React.ReactNode}> = ({label,children}) => (
  <label className="block space-y-1 text-[11px] font-medium text-[var(--text-primary,#503246)]">
    <span>{label}</span>
    {children}
  </label>
);

const RulesBlock: React.FC<{type:NewActivityInput['type']|undefined}> = ({type}) => {
  const lines: string[] = [];
  if(type==='distribution') lines.push('* "Production" et "Distribution" activités non supprimables (projets distribution).');
  if(type==='formation') lines.push('* Dépenses imputées à "formation" nécessitent justificatif.');
  if(type==='achat') lines.push('* Achat optionnel mais doit respecter QA avant distribution.');
  if(type==='production') lines.push('* QA interne requis pour validation lots.');
  lines.push('* Chaque dépense doit pointer vers Activité + (Milestone) + Catégorie.');
  return (
  <div className="rounded-xl border border-[var(--color-border,#e2d6e0)] bg-white p-4 text-[11px] space-y-2" style={{boxShadow:'var(--elev-1)'}}>
      <h3 className="font-semibold text-[12px]">Règles</h3>
      <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-600">
        {lines.map((l,i)=><li key={i}>{l}</li>)}
      </ul>
    </div>
  );
};

interface AttachmentMeta { id:string; name:string; size:number; type:string }
const AttachmentsArea: React.FC<{files:AttachmentMeta[]; onFiles:(f:AttachmentMeta[])=>void; dragActive:boolean; setDragActive:(b:boolean)=>void}> = ({files,onFiles,dragActive,setDragActive}) => {
  function handleFiles(fileList: FileList|null){
    if(!fileList) return;
    const added: AttachmentMeta[] = Array.from(fileList).map(f=> ({ id: Math.random().toString(36).slice(2), name:f.name, size:f.size, type:f.type }));
    onFiles([...(files||[]), ...added]);
  }
  return (
    <div
      onDragOver={e=>{e.preventDefault(); setDragActive(true);}}
      onDragLeave={e=>{e.preventDefault(); setDragActive(false);}}
      onDrop={e=>{e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files);}}
      className={`rounded-xl border border-dashed ${dragActive? 'border-[var(--color-primary,#7b1d4f)] bg-rose-50':'border-[var(--color-border,#e2d6e0)] bg-white'} p-4 text-[11px] space-y-2 min-h-[140px] flex flex-col`} style={{boxShadow:'var(--elev-1)'}}>
      <div className="flex-0 text-gray-600">
        <p className="font-medium mb-1">Pièces jointes</p>
        <p className="text-gray-500">Glisser-déposer ou <label className="text-[var(--color-primary,#7b1d4f)] underline cursor-pointer"><input multiple type="file" className="hidden" onChange={e=> handleFiles(e.target.files)} /> parcourir</label></p>
      </div>
      <div className="flex-1 overflow-auto">
        {(!files || files.length===0) && <div className="text-gray-400 italic">Aucun fichier</div>}
        <ul className="space-y-1">
          {files.map(f=> (
            <li key={f.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-2 py-1">
              <span className="truncate max-w-[160px]" title={f.name}>{f.name}</span>
              <button onClick={()=> onFiles(files.filter(x=>x.id!==f.id))} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TransparencyBlock: React.FC<{type:NewActivityInput['type']|undefined}> = ({type}) => (
  <div className="rounded-xl border border-[var(--color-border,#e2d6e0)] bg-white p-4 text-[11px] space-y-2" style={{boxShadow:'var(--elev-1)'}}>
    <h3 className="font-semibold text-[12px]">Finance & KPIs</h3>
    <p className="text-gray-600">Les champs budget, KPI et participants (formation) alimentent les KPIs du projet & dashboard.</p>
    {type==='formation' && <p className="text-indigo-600">Sessions prévues & participants attendus mis à jour via reporting.</p>}
  </div>
);

function labelType(t:NewActivityInput['type']) {
  const found = typeOptions.find(o=>o.value===t);
  return found? found.label: t;
}

function autoAllocated(f:Partial<NewActivityInput>) {
  if(!f.plannedBudget) return 0;
  // simple heuristic: allocate 35% at creation
  return Math.round(f.plannedBudget * 0.35);
}

const OrganisationSelectors: React.FC<{form:any; update:(k:any,v:any)=>void}> = ({form,update}) => {
  const entityTypes = [
    {value:'distributeur', label:'Distributeur'},
    {value:'producteur', label:'Producteur'},
    {value:'fournisseur', label:'Fournisseur'},
    {value:'achat', label:'Achat'},
    {value:'formateur', label:'Formateur'},
    {value:'chef de projet', label:'Chef de projet'},
    {value:'agent de terrain', label:'Agent de terrain'},
    {value:'r&d', label:'R&D'},
    {value:'autre', label:'Autre'}
  ];
  const selectedEntity = form.assigneeType || 'autre';
  const orgOptions = useMemo(()=>{
    // map entity->activity types in catalogue simple heuristic
    const reverse: Record<string,string[]> = {
      distributeur:['distribution','hybride'],
      producteur:['production'],
      fournisseur:['achat'],
      achat:['achat'],
      formateur:['formation'],
      'chef de projet':['hybride','distribution','formation','production','achat','recherche_dev','autre'],
      'agent de terrain':['distribution','formation','production','hybride'],
      'r&d':['recherche_dev'],
      autre:['autre']
    };
    const roles = reverse[selectedEntity] || [];
    return globalOrgCatalogue.filter(o=> roles.some(r=> o.roles.includes(r)));
  },[selectedEntity]);
  const custom = form.assignee && !orgOptions.some(o=>o.name===form.assignee);
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Type d'entité *">
        <select value={selectedEntity} onChange={e=>{update('assigneeType', e.target.value); update('assignee','');}} className="w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]">
          {entityTypes.map(t=> <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Field>
      <Field label="Responsable (personne/organisation) *">
        <select value={orgOptions.some(o=>o.name===form.assignee)? form.assignee: ''} onChange={e=>{const v=e.target.value; if(v==='__other'){ update('assignee',''); } else { update('assignee', v);} }} className={`w-full rounded-md border ${!form.assignee?'border-red-400':'border-[var(--color-border,#d1c3cd)]'} bg-white px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]`}>
          <option value="">Choisir...</option>
          {orgOptions.map(o=> <option key={o.name} value={o.name}>{o.name}</option>)}
          <option value="__other">Autre...</option>
        </select>
        {(form.assignee==='' || custom) && <input value={form.assignee} onChange={e=>update('assignee', e.target.value)} placeholder="Saisir responsable (personne ou organisation)" className="mt-2 w-full rounded-md border border-[var(--color-border,#d1c3cd)] bg-white px-3 py-2 text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#7b1d4f)] focus:border-[var(--color-primary,#7b1d4f)]" />}
      </Field>
    </div>
  );
};

export default NewActivityModal;
