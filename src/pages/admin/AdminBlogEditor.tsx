import React, { useEffect, useRef, useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getAdminBlog, createAdminBlog, updateAdminBlog } from '../../services/apiAdminBlog';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from '../../components/editor/EditorToolbar';
import { uploadBlogImage, listBlogImages, deleteBlogImage, BlogImageRec } from '../../services/blogImagesApi';
import { transformArticleHtml } from '../../utils/mediaTransform';
// Minimal UI: only Bubble (selection) and Floating "+" menu

function slugify(input: string){
  return input
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)+/g,'')
    .slice(0,100);
}

const CATEGORIES = ['impact','insights','updates','research','howto'];

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  // note: we could track loading, but we render immediately with defaults
  const [title, setTitle] = useState('');
  const [slugVal, setSlugVal] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('impact');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [cover, setCover] = useState('');
  const coverInputRef = useRef<HTMLInputElement|null>(null);
  // Rich editor only (Markdown mode removed)
  const fileInputRef = useRef<HTMLInputElement|null>(null);

  // Custom font-size support on TextStyle mark
  const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes() {
      return [
        {
          types: ['textStyle'],
          attributes: {
            fontSize: {
              default: null,
              parseHTML: element => (element as HTMLElement).style.fontSize || null,
              renderHTML: attributes => {
                const size = (attributes as any).fontSize as string | null;
                if (!size) return {};
                return { style: `font-size: ${size}` };
              },
            },
          },
        },
      ];
    },
  });

  const [editorHTML, setEditorHTML] = useState('');
  // Fallback simple paragraphs (if TipTap fails or user prefers)
  const [fallbackParas, setFallbackParas] = useState<string[]>(()=>
    ['']
  );
  const [useFallback, setUseFallback] = useState(false);

  // Extend Link to preserve data-e4d-video attribute
  const VideoAwareLink = Link.extend({
    addAttributes() {
      return {
        ...((this.parent && typeof this.parent === 'function') ? this.parent() : {}),
        'data-e4d-video': {
          default: null,
          parseHTML: (element: any) => element.getAttribute('data-e4d-video'),
          renderHTML: (attributes: any) => {
            const v = attributes['data-e4d-video'];
            return v ? { 'data-e4d-video': v } : {};
          },
        },
      } as any;
    },
  });

  const editor = useEditor({
    extensions: [
      TextStyle,
      StarterKit,
  VideoAwareLink.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl' } }),
      Placeholder.configure({ placeholder: 'Écrivez votre article…' }),
      FontSize,
    ],
  content: '',
    editorProps: {
      attributes: { class: 'prose prose-base max-w-none min-h-[420px] outline-none' },
      handleClickOn: (_view: any, _pos: number, node: any, nodePos: number, event: MouseEvent) => {
        if (node?.type?.name === 'image') {
          // Focus the editor and select the image node
          editor?.chain().setNodeSelection(nodePos).focus().run();
          const current = node?.attrs?.title || node?.attrs?.alt || '';
          const caption = window.prompt('Légende de l\'image (caption):', current || '');
          if (caption !== null) {
            editor?.chain().focus().updateAttributes('image', { title: caption, alt: caption }).run();
          }
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setEditorHTML(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      setEditorHTML(editor.getHTML());
    }
  });
  const [authorName, setAuthorName] = useState('E4D Ops');
  const [uploadedImages, setUploadedImages] = useState<BlogImageRec[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);

  // Use shared transform util for preview/public rendering parity
  // Note: We purposely do NOT embed raw iframes into TipTap content, because StarterKit schema drops them.
  // We insert links instead and convert them to embeds in preview/public rendering.

  // Auto-enable fallback if editor failed to initialize
  useEffect(()=> { if(!editor) setUseFallback(true); }, [editor]);

  useEffect(()=>{ if(!slug && title){ setSlugVal(s=> s|| slugify(title)); } },[title, slug]);

  // Load existing article when editing
  useEffect(()=>{
    let cancelled = false;
    (async () => {
  if (!slug) { return; }
      try {
        const r = await getAdminBlog(slug);
  if (!r || cancelled) { return; }
        setTitle(r.title || '');
        setSlugVal(r.slug || '');
        setExcerpt(r.summary || '');
        setCategory(r.category || 'impact');
        setTags(r.tags || []);
        setAuthorName(r.author || 'E4D Ops');
        setCover(r.coverImageUrl || '');
        setEditorHTML(r.contentHtml || '');
        if (editor && r.contentHtml) editor.commands.setContent(r.contentHtml);
        // Fetch uploaded images list
        try {
          setLoadingImages(true);
          const imgs = await listBlogImages(r.slug);
          if (!cancelled) setUploadedImages(imgs);
        } catch {}
        finally { setLoadingImages(false); }
      } catch {}
      // done
    })();
    return () => { cancelled = true; };
  }, [slug, editor]);

  useEffect(()=>{
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saving) return;
      const hasEditorContent = !!editorHTML && editorHTML.replace(/<[^>]*>/g,'').trim().length>0;
      if (title || excerpt || hasEditorContent) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return ()=> window.removeEventListener('beforeunload', onBeforeUnload);
  },[title, excerpt, saving, editorHTML]);

  function addTag(){ const t=tagInput.trim(); if(!t) return; if(!tags.includes(t)) setTags([...tags,t]); setTagInput(''); }
  function removeTag(tag:string){ setTags(tags.filter(t=> t!==tag)); }

  function extractMedia(html: string | undefined): { images: string[]; videos: string[] } {
    if (!html) return { images: [], videos: [] };
    const container = document.createElement('div');
    container.innerHTML = html;
    const imgs = Array.from(container.querySelectorAll('img')).map(img => img.getAttribute('src') || '').filter(Boolean) as string[];
    const vids: string[] = [];
    // native video tags
    Array.from(container.querySelectorAll('video')).forEach(v => {
      const direct = v.getAttribute('src');
      if (direct) vids.push(direct);
      Array.from(v.querySelectorAll('source')).forEach(s => { const src = s.getAttribute('src'); if (src) vids.push(src); });
    });
    // basic iframe embeds (e.g., YouTube)
    Array.from(container.querySelectorAll('iframe')).forEach(f => { const src = f.getAttribute('src'); if (src) vids.push(src); });
    return { images: imgs, videos: vids };
  }

  function buildPayload() {
    const html = editorHTML;
    const plainText = editor?.getText() || '';
    const coverAuto = (() => {
      const { images } = extractMedia(html);
      return cover || images[0] || '/photos/course/001.jpg';
    })();
    return {
      slug: slugVal || slugify(title) || `untitled-${Date.now()}`,
      title,
      category,
      tags,
      author: authorName,
      coverImageUrl: coverAuto,
      summary: excerpt,
      contentHtml: html,
      readMinutes: Math.max(3, Math.round(plainText.split(/\s+/).filter(Boolean).length / 200)),
      status: 'draft' as 'draft'|'published',
    };
  }

  async function saveDraft(){
    if (saving) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      if (slug) await updateAdminBlog(slug, payload);
      else await createAdminBlog(payload);
      setSaving(false);
      navigate('/admin/blog');
    } catch (e) {
      setSaving(false);
      console.error(e);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async function publishNow(){
    if (saving) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      payload.status = 'published';
      if (slug) await updateAdminBlog(slug, payload);
      else await createAdminBlog(payload);
      setSaving(false);
      navigate('/admin/blog');
    } catch (e) {
      setSaving(false);
      console.error(e);
      alert('Erreur lors de la publication');
    }
  }
  return (
    <AdminPage title={slug ? 'Modifier l\'article' : 'Nouvel article'}>
      {/* Global fixed toolbar placed under the page title (not inside the editor) */}
      {!useFallback && (
        <>
          <EditorToolbar
            editor={editor}
            fileInputRef={fileInputRef}
            onOpenVideoModal={()=> { setVideoUrl(''); setVideoCaption(''); setShowVideoModal(true); }}
            onOpenLinkModal={()=> { if(!editor) return; const current = editor.getAttributes('link') as any; setLinkUrl(current?.href || ''); setLinkTargetBlank((current?.target || '_blank') !== '_self'); setShowLinkModal(true); }}
            onPreview={()=> setShowPreview(true)}
          />
          {/* Hidden image input near toolbar for reliability */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e)=>{
            const f = e.target.files?.[0];
            if(!f || !editor) return;
            try {
              const currentSlug = (slugVal || slugify(title) || '').trim();
              const rec = await uploadBlogImage(f, { role: 'inline', slug: currentSlug });
              editor.chain().focus().setImage({ src: rec.url, title: rec.alt || '', alt: rec.alt || '' }).run();
            } catch (err: any) {
              console.error('Inline upload failed', err);
              alert('Échec de téléchargement de l\'image');
            } finally {
              if (e.target) e.target.value = '';
            }
          }} />
        </>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Editor area */}
        <div className="lg:col-span-2 rounded-2xl bg-white border p-4 space-y-4" style={{borderColor:'var(--rose-200)'}}>
          {/* Title (Medium-like) */}
          <input value={title} onChange={e=> setTitle(e.target.value)} placeholder="Titre..." className="w-full text-[28px] font-bold outline-none bg-transparent" />
          {/* Fallback is automatic if the rich editor fails; no manual toggle shown */}
          {/* Toolbar moved to top of page; editor area stays clean */}
          {/* Editors */}
          {!useFallback && (
          <div className="relative">
              {editor && <EditorContent editor={editor} />}
            </div>
          )}
          {useFallback && (
            <div className="space-y-3">
              <div className="text-[12px] text-[var(--muted-color)]">Si l'éditeur riche ne fonctionne pas, utilisez ces paragraphes. Chaque zone représente un paragraphe.</div>
              {fallbackParas.map((p,idx)=> (
                <div key={idx} className="flex items-start gap-2">
                  <textarea value={p} onChange={e=> { const arr=[...fallbackParas]; arr[idx]=e.target.value; setFallbackParas(arr); }} rows={5} className="flex-1 rounded-md border px-3 py-2" />
                  <button className="h-9 px-3 rounded-md border" onClick={()=> setFallbackParas(prev=> prev.filter((_,i)=> i!==idx))}>Supprimer</button>
                </div>
              ))}
              <button className="h-9 px-3 rounded-md border" onClick={()=> setFallbackParas(prev=> [...prev,''])}>+ Ajouter un paragraphe</button>
            </div>
          )}
        </div>

        {/* Meta sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border p-4 space-y-3" style={{borderColor:'var(--rose-200)'}}>
            <Input label="Slug" value={slugVal} onChange={e=> setSlugVal(slugify(e.target.value))} placeholder="auto" />
            <label className="block text-sm font-medium text-text-primary">Catégorie</label>
            <select className="h-10 w-full rounded-md border px-3" style={{borderColor:'var(--rose-200)'}} value={category} onChange={e=> setCategory(e.target.value)}>
              {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <div>
            {/* Video insert modal */}
            {showVideoModal && (
              <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4">
                <div className="w-full max-w-xl rounded-2xl bg-white border p-5" style={{borderColor:'var(--rose-200)'}}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[16px] font-semibold text-[var(--slate-900)]">Insérer une vidéo</h3>
                    <button className="h-8 px-3 rounded-md border text-[12px]" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowVideoModal(false)}>Fermer</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[12px] font-medium text-[var(--slate-800)] mb-1">URL vidéo (YouTube ou MP4)</label>
                      <input value={videoUrl} onChange={e=> setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=... ou https://cdn.exemple.com/video.mp4" className="w-full h-10 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}}/>
                      <p className="text-[12px] text-[var(--slate-600)] mt-1">Les liens YouTube seront intégrés automatiquement en lecteur responsive.</p>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[var(--slate-800)] mb-1">Légende (optionnel)</label>
                      <input value={videoCaption} onChange={e=> setVideoCaption(e.target.value)} className="w-full h-10 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}}/>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="h-9 px-3 rounded-md border" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowVideoModal(false)}>Annuler</button>
                    <button className="h-9 px-3 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white" onClick={()=> {
                      if (!editor) return;
                      const url = videoUrl.trim();
                      if (!url) return;
                      const label = (videoCaption.trim() || url).replace(/</g,'&lt;').replace(/>/g,'&gt;');
                      const html = `<p><a href="${url}" data-e4d-video="1" target="_blank" rel="noopener noreferrer">${label}</a></p>`;
                      editor.chain().focus().insertContent(html).run();
                      setShowVideoModal(false);
                    }}>Insérer</button>
                  </div>
                </div>
              </div>
            )}
            {/* Link modal */}
            {showLinkModal && (
              <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white border p-5" style={{borderColor:'var(--rose-200)'}}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[16px] font-semibold text-[var(--slate-900)]">Définir un lien</h3>
                    <button className="h-8 px-3 rounded-md border text-[12px]" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowLinkModal(false)}>Fermer</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[12px] font-medium text-[var(--slate-800)] mb-1">URL</label>
                      <input value={linkUrl} onChange={e=> setLinkUrl(e.target.value)} placeholder="https://exemple.com" className="w-full h-10 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}}/>
                    </div>
                    <label className="inline-flex items-center gap-2 text-[12px]">
                      <input type="checkbox" checked={linkTargetBlank} onChange={(e)=> setLinkTargetBlank(e.target.checked)} />
                      Ouvrir dans un nouvel onglet
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="h-9 px-3 rounded-md border" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowLinkModal(false)}>Annuler</button>
                    <button className="h-9 px-3 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white" onClick={()=> {
                      if (!editor) return;
                      let url = linkUrl.trim();
                      if (!url) return;
                      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
                      const attrs: any = { href: url };
                      if (linkTargetBlank) { attrs.target = '_blank'; attrs.rel = 'noopener noreferrer'; }
                      // If selection is empty, insert link as its own text; else set mark on selection
                      const hasSelection = !editor.state.selection.empty;
                      if (!hasSelection) {
                        editor.chain().focus().insertContent(`<a href="${url}"${linkTargetBlank?" target=\"_blank\" rel=\"noopener noreferrer\"":""}>${url}</a>`).run();
                      } else {
                        editor.chain().focus().extendMarkRange('link').setLink(attrs).run();
                      }
                      setShowLinkModal(false);
                    }}>Appliquer</button>
                  </div>
                </div>
              </div>
            )}
              <label className="block text-sm font-medium text-text-primary">Tags</label>

          {/* Preview overlay */}
          {showPreview && (
            <div className="fixed inset-0 z-[100] bg-black/40 flex items-start justify-center overflow-auto">
              <div className="bg-[var(--rose-50)] w-full max-w-[1200px] min-h-screen p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[18px] font-semibold text-[var(--slate-900)]">Aperçu de l'article</h2>
                  <button className="h-9 px-3 rounded-md border" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowPreview(false)}>Fermer</button>
                </div>
                <div className="grid lg:grid-cols-[820px_300px] gap-8">
                  <article className="space-y-6">
                    <header className="space-y-2">
                      <h1 className="text-[28px] font-extrabold text-[var(--slate-900)]">{title || 'Sans titre'}</h1>
                      {excerpt && <p className="text-[14px] text-[var(--slate-700)]">{excerpt}</p>}
                    </header>
                    <div className="prose prose-sm max-w-none bg-white border rounded-2xl p-6 prose-img:rounded-xl" style={{borderColor:'var(--rose-200)'}} dangerouslySetInnerHTML={{__html: transformArticleHtml(editorHTML)}} />
                  </article>
                  <aside className="space-y-4">
                    <div className="rounded-2xl border bg-white p-5" style={{borderColor:'var(--rose-200)'}}>
                      <div className="text-[12px] text-[var(--slate-700)]">Cette prévisualisation reprend le style de lecture public (BlogArticlePage).</div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          )}
              <div className="flex gap-2 mt-1">
                <input value={tagInput} onChange={e=> setTagInput(e.target.value)} placeholder="Ajouter un tag" className="h-9 flex-1 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}} />
                <Button size="sm" onClick={addTag}>Ajouter</Button>
              </div>
              {tags.length>0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(t=> (
                    <span key={t} className="inline-flex items-center gap-2 px-2 h-7 rounded-full border text-[12px]" style={{borderColor:'var(--rose-200)'}}>
                      {t}
                      <button aria-label={`Remove ${t}`} className="text-[var(--rose-700)]" onClick={()=> removeTag(t)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white border p-4 space-y-3" style={{borderColor:'var(--rose-200)'}}>
            <Input label="Auteur" value={authorName} onChange={e=> setAuthorName(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-text-primary">Cover/Thumbnail</label>
              <div className="flex gap-2 mt-1">
                <Button size="sm" onClick={()=> coverInputRef.current?.click()}>Choisir une image…</Button>
                {cover && <Button size="sm" variant="secondary" onClick={()=> setCover('')}>Retirer</Button>}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={async (e)=>{
                const f = e.target.files?.[0]; if(!f) return;
                try {
                  const currentSlug = (slugVal || slugify(title) || '').trim();
                  const rec = await uploadBlogImage(f, { role: 'cover', slug: currentSlug });
                  setCover(rec.url);
                } catch (err: any) {
                  console.error('Cover upload failed', err);
                  alert('Échec de téléchargement de la cover');
                } finally {
                  if (e.target) e.target.value = '';
                }
              }} />
            </div>
            {(cover || extractMedia(editorHTML).images[0]) ? (
              <div className="rounded-xl overflow-hidden border" style={{borderColor:'var(--rose-200)'}}>
                <img src={cover || extractMedia(editorHTML).images[0]} alt="thumbnail" className="w-full h-36 object-cover" />
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border flex items-center justify-center h-36" style={{borderColor:'var(--rose-200)'}}>
                <div className="text-sm text-[var(--muted-color)]">Aucune image de couverture — uploader une image pour le thumbnail</div>
              </div>
            )}
            {/* Media summary */}
            {(() => {
              const { images, videos } = extractMedia(editorHTML);
              return (
                <div className="space-y-2">
                  <div className="text-sm text-text-secondary">Médias détectés (éditeur): <b>{images.length}</b> image(s), <b>{videos.length}</b> vidéo(s)</div>
                  <div className="text-sm text-text-secondary">Images uploadées (Cloudinary): <b>{uploadedImages.length}</b> {loadingImages && '(chargement...)'}</div>
                  <div className="flex gap-2 flex-wrap">
                    {uploadedImages.map(img => (
                      <div key={img.id} className="flex flex-col items-center gap-1">
                        <img src={img.url} alt={img.alt || ''} className="w-16 h-16 object-cover rounded-md border" style={{borderColor:'var(--rose-200)'}} />
                        <div className="flex gap-1">
                          <Button size="sm" variant="secondary" onClick={()=> setCover(img.url)}>Définir cover</Button>
                          <Button size="sm" variant="secondary" onClick={async ()=>{ if (!slug) return; await deleteBlogImage(slug, img.id); setUploadedImages(prev=> prev.filter(x=> x.id!==img.id)); }}>Supprimer</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <div>
              <label className="block text-sm font-medium text-text-primary">Extrait</label>
              <textarea value={excerpt} onChange={e=> setExcerpt(e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 text-sm" style={{borderColor:'var(--rose-200)'}} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={saveDraft} loading={saving} className="rounded-full">Enregistrer brouillon</Button>
              <Button onClick={publishNow} loading={saving} className="rounded-full">Publier</Button>
              <Button variant="secondary" onClick={()=> navigate('/admin/blog')} className="rounded-full">Annuler</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminBlogEditor;
