import React from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage';
import { listArticles, deleteArticle } from '../../../utils/blogAdmin';

const BlogList: React.FC = () => {
  const [items, setItems] = React.useState(listArticles());
  function refresh(){ setItems(listArticles()); }
  return (
    <AdminPage title="Articles">
      <div className="flex justify-end mb-4">
        <Link to="new" className="px-3 h-9 rounded-md bg-[var(--rose-600)] text-white inline-flex items-center">Nouvel article</Link>
      </div>
      {items.length === 0 ? (
        <div className="rounded-xl bg-white p-6 border" style={{borderColor:'rgba(0,0,0,0.06)'}}>Aucun article.</div>
      ) : (
        <div className="grid gap-3">
          {items.map(a => (
            <div key={a.id} className="rounded-xl bg-white border p-4 flex items-center justify-between" style={{borderColor:'rgba(0,0,0,0.06)'}}>
              <div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-[12px] text-[var(--muted-color)]">/{a.slug} • {a.status} • {new Date(a.updatedAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`${a.slug}/edit`} className="px-3 h-8 rounded-full border">Modifier</Link>
                <button onClick={()=>{ if(confirm('Supprimer cet article ?')){ deleteArticle(a.slug); refresh(); } }} className="px-3 h-8 rounded-full border">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
};

export default BlogList;
