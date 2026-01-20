import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage';
import { AdminArticle, BLOG_CATEGORIES, generateId, getArticle, slugify, upsertArticle } from '../../../utils/blogAdmin';

const emptyForm: AdminArticle = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  category: BLOG_CATEGORIES[0],
  tags: [],
  coverUrl: '',
  body_paragraphs: [''],
  status: 'draft',
  createdAt: '',
  updatedAt: ''
};

const BlogEditor: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const existing = slug ? getArticle(slug) : undefined;
  const [form, setForm] = React.useState<AdminArticle>(existing ? existing : emptyForm);

  function update<K extends keyof AdminArticle>(key: K, value: AdminArticle[K]){ setForm(prev => ({...prev, [key]: value})); }
  function setParagraph(i:number, v:string){ const arr=[...form.body_paragraphs]; arr[i]=v; update('body_paragraphs',arr); }
  function addParagraph(){ update('body_paragraphs',[...form.body_paragraphs,'']); }
  function removeParagraph(i:number){ const arr=form.body_paragraphs.filter((_,idx)=>idx!==i); update('body_paragraphs', arr.length?arr:['']); }
  function save(status?:'draft'|'published'){
    const now = new Date().toISOString();
    const id = form.id || generateId();
    const payload: AdminArticle = {
      ...form,
      id,
      slug: form.slug || slugify(form.title || id),
      status: status || form.status,
      updatedAt: now,
      createdAt: form.createdAt || now
    };
    upsertArticle(payload);
    navigate('/admin/blog');
  }

  const isEdit = Boolean(existing);

  return (
    <AdminPage title={isEdit? 'Modifier Article' : 'Nouvel article'}>
      <div className="rounded-2xl bg-white border p-6 grid md:grid-cols-3 gap-6" style={{borderColor:'rgba(0,0,0,0.06)'}}>
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="text-[12px] block mb-1">Titre</label>
            <input value={form.title} onChange={e=>update('title',e.target.value)} className="w-full h-10 rounded-md border px-3" />
          </div>
          <div>
            <label className="text-[12px] block mb-1">Slug</label>
            <input value={form.slug} onChange={e=>update('slug',slugify(e.target.value))} placeholder="auto" className="w-full h-10 rounded-md border px-3" />
          </div>
          <div>
            <label className="text-[12px] block mb-1">Extrait</label>
            <textarea value={form.excerpt} onChange={e=>update('excerpt',e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2"/>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] block mb-1">Catégorie</label>
              <select value={form.category} onChange={e=>update('category',e.target.value)} className="w-full h-10 rounded-md border px-3">
                {BLOG_CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] block mb-1">Tags (séparés par des virgules)</label>
              <input value={form.tags?.join(',')||''} onChange={e=>update('tags', e.target.value.split(',').map(t=>t.trim()).filter(Boolean))} className="w-full h-10 rounded-md border px-3"/>
            </div>
          </div>
          <div>
            <label className="text-[12px] block mb-1">Image de couverture (URL)</label>
            <input value={form.coverUrl} onChange={e=>update('coverUrl',e.target.value)} placeholder="https://..." className="w-full h-10 rounded-md border px-3"/>
          </div>
          <div className="space-y-3">
            <div className="font-medium">Paragraphes (fallback si l'éditeur riche ne fonctionne pas)</div>
            {form.body_paragraphs.map((p,idx)=> (
              <div key={idx} className="flex items-start gap-2">
                <textarea value={p} onChange={e=>setParagraph(idx,e.target.value)} rows={4} className="flex-1 rounded-md border px-3 py-2" />
                <button onClick={()=>removeParagraph(idx)} className="h-9 px-3 rounded-md border">Supprimer</button>
              </div>
            ))}
            <button onClick={addParagraph} className="h-9 px-3 rounded-md border">+ Ajouter un paragraphe</button>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border p-4" style={{borderColor:'rgba(0,0,0,0.06)'}}>
            <div className="text-[12px] text-[var(--muted-color)] mb-2">Statut</div>
            <div className="flex gap-2">
              <button onClick={()=>save('draft')} className="h-9 px-3 rounded-md border">Enregistrer brouillon</button>
              <button onClick={()=>save('published')} className="h-9 px-3 rounded-md bg-[var(--rose-600)] text-white">Publier</button>
            </div>
          </div>
          <div className="rounded-xl border p-4 text-[12px]" style={{borderColor:'rgba(0,0,0,0.06)'}}>
            <div><span className="opacity-60">Créé:</span> {form.createdAt? new Date(form.createdAt).toLocaleString():'—'}</div>
            <div><span className="opacity-60">Mis à jour:</span> {form.updatedAt? new Date(form.updatedAt).toLocaleString():'—'}</div>
            <div><span className="opacity-60">ID:</span> {form.id || '—'}</div>
          </div>
        </aside>
      </div>
    </AdminPage>
  );
};

export default BlogEditor;
