import React from 'react';

type Props = {
  editor: any | null; // TipTap Editor instance
  fileInputRef: React.RefObject<HTMLInputElement>;
  onOpenVideoModal?: () => void;
  onOpenLinkModal?: () => void;
  onPreview?: () => void; // Optional preview button
};

// Shared editor toolbar used across admin editors (Blog, E-learning lessons)
// It relies on the global .btn-icon and .btn-chip utility classes (declared in App.css)
const EditorToolbar: React.FC<Props> = ({ editor, fileInputRef, onOpenVideoModal, onOpenLinkModal, onPreview }) => {
  return (
    <div className="sticky top-[72px] z-30 mb-3 flex flex-wrap items-center gap-3">
      {/* Formatting bar */}
      <div className="rounded-full border bg-white px-2 py-2 flex flex-wrap items-center gap-2" style={{borderColor:'var(--rose-200)', boxShadow:'var(--elev-1)'}}>
        <button className="btn-icon" onClick={()=> editor?.chain().focus().toggleBold().run()}><b>B</b></button>
        <button className="btn-icon" onClick={()=> editor?.chain().focus().toggleItalic().run()}><i>/</i></button>
        <span className="mx-1 w-px h-4 bg-[var(--border-color)]"></span>
        <button className="btn-chip" onClick={()=> editor?.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button className="btn-chip" onClick={()=> editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button className="btn-chip" onClick={()=> editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <span className="mx-1 w-px h-4 bg-[var(--border-color)]"></span>
        <select
          className="h-8 rounded-full border px-2 text-[12px]"
          style={{borderColor:'var(--border-color)'}}
          onChange={(e)=> editor?.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()}
          defaultValue="18px"
        >
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="22px">22</option>
        </select>
        <span className="mx-1 w-px h-4 bg-[var(--border-color)]"></span>
        <button className="btn-chip" onClick={()=> editor?.chain().focus().toggleBlockquote().run()}>Citation</button>
        <button className="btn-chip" onClick={()=> editor?.chain().focus().setHorizontalRule().run()}>— HR</button>
      </div>
      {/* Insert/actions bar */}
      <div className="rounded-full border bg-white px-2 py-2 flex flex-wrap items-center gap-2" style={{borderColor:'var(--rose-200)', boxShadow:'var(--elev-1)'}}>
        <button className="btn-chip" onClick={()=> fileInputRef.current?.click()}>+ Image</button>
        {onOpenVideoModal && <button className="btn-chip" onClick={onOpenVideoModal}>+ Vidéo</button>}
        <button className="btn-chip" onClick={()=> editor?.chain().focus().setParagraph().run()}>Paragraphe</button>
        <button className="btn-chip" onClick={()=> editor?.chain().focus().toggleBulletList().run()}>• Liste</button>
        {onOpenLinkModal && <button className="btn-chip" onClick={onOpenLinkModal}>Lien</button>}
        <button className="btn-chip" onClick={()=> editor?.chain().focus().unsetLink().run()}>Retirer lien</button>
        <button className="btn-chip" onClick={()=> {
          if (!editor) return;
          const state: any = editor.state; const sel: any = state.selection; const node: any = state.doc.nodeAt(sel.from);
          if (node && node.type && node.type.name === 'image') {
            const current = node.attrs?.title || node.attrs?.alt || '';
            const caption = window.prompt("Légende de l'image:", current || '');
            if (caption !== null) editor.chain().focus().updateAttributes('image', { title: caption, alt: caption }).run();
          } else {
            alert('Sélectionnez d\'abord une image (cliquez dessus).');
          }
        }}>Légende</button>
        <button className="btn-chip" onClick={()=> {
          if (!editor) return;
          const state: any = editor.state; const sel: any = state.selection; const node: any = state.doc.nodeAt(sel.from);
          if (node && node.type && node.type.name === 'image') {
            editor.chain().focus().updateAttributes('image', { style: 'display:block;margin-left:auto;margin-right:auto;' }).run();
          } else {
            alert('Sélectionnez d\'abord une image (cliquez dessus).');
          }
        }}>Centrer</button>
        {onPreview && <button className="btn-chip" onClick={onPreview}>Aperçu</button>}
      </div>
    </div>
  );
};

export default EditorToolbar;
