import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export const PublicNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const items: Array<{ label: string; to: string; match?: RegExp }> = [
    { label: t('nav.about','About'), to: '/about', match: /^\/(about|contact)/ },
    { label: t('nav.projects','Projects'), to: '/projects', match: /^\/projects/ },
    { label: t('nav.blog','Blog'), to: '/blog', match: /^\/blog/ },
    { label: t('nav.resources','Resources'), to: '/resources', match: /^\/resources/ },
    { label: t('admin.elearning', t('nav.elearning','E-learning')), to: '/e-learning', match: /^\/e-learning/ },
    { label: t('nav.contact','Contact'), to: '/contact', match: /^\/(contact)/ },
    { label: t('nav.signin','Sign In'), to: '/login', match: /^\/login/ }
  ];

  const [dark,setDark] = React.useState<boolean>(()=> typeof document!=='undefined' && document.documentElement.classList.contains('dark'));
  React.useEffect(()=> {
    if(typeof document==='undefined') return;
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('theme', dark? 'dark':'light'); } catch {}
  },[dark]);
  React.useEffect(()=> { try { if(localStorage.getItem('theme')==='dark') setDark(true); } catch {} },[]);

  const [open,setOpen] = React.useState(false);
  React.useEffect(()=> { document.body.style.overflow = open? 'hidden':''; return ()=> { document.body.style.overflow=''; }; },[open]);

  return (
    <>
    <header className="sticky-header px-4 sm:px-6 lg:px-8 z-40 relative">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between">
        <Logo size="md" className="flex items-center" />
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {items.map(item=> {
            const active = item.match? item.match.test(location.pathname): location.pathname === item.to;
            return <Link key={item.to} to={item.to} className={`hover:text-[var(--rose-600)] ${active?'font-semibold text-[var(--rose-600)]':'text-[var(--slate-600)]'}`}>{item.label}</Link>;
          })}
          <Link to="/donate" className="btn-donate">{t('nav.donate','Donate')}</Link>
          <LanguageSwitcher className="ml-1" />
          <button type="button" onClick={()=> setDark(d=>!d)} className="ml-2 text-xs px-3 h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors" aria-label={t('ui.mode.toggle', 'Toggle dark mode')}>{dark? t('ui.mode.light','Light'):t('ui.mode.dark','Dark')} mode</button>
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <Link to="/donate" className="btn-donate py-1 px-3 text-xs">{t('nav.donate','Donate')}</Link>
          <button aria-label={t('nav.menuToggle','Toggle menu')} onClick={()=> setOpen(o=>!o)} className="p-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--rose-400)]">{open? <X className="w-5 h-5" />:<Menu className="w-5 h-5" />}</button>
        </div>
      </div>

    </header>
    {open && (
      <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn" role="dialog" aria-modal="true" aria-label={t('nav.menu','Menu')}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--color-border)]">
          <Logo size="sm" className="flex items-center" />
          <button aria-label={t('nav.close','Close menu')} onClick={()=> setOpen(false)} className="p-2 rounded-md hover:bg-[var(--rose-50)]"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.map(item=> {
            const active = item.match? item.match.test(location.pathname): location.pathname === item.to;
            return <Link key={item.to} to={item.to} onClick={()=> setOpen(false)} className={`block text-sm px-3 py-2 rounded-md border transition-colors shadow-sm ${active? 'border-[var(--rose-500)] bg-[var(--rose-50)] text-[var(--rose-700)]':'border-[var(--color-border)] hover:border-[var(--rose-400)] hover:bg-[var(--rose-50)]'}`}>{item.label}</Link>;
          })}
          <div className="pt-2 border-t border-[var(--color-border)] flex items-center gap-2">
            <LanguageSwitcher />
            <button type="button" onClick={()=> setDark(d=>!d)} className="text-xs px-3 h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors flex-1" aria-label="Toggle dark mode">{dark? 'Light':'Dark'} mode</button>
          </div>
          <div className="p-4 border-t border-[var(--color-border)] bg-white mt-4">
            <Link to="/donate" onClick={()=> setOpen(false)} className="btn-donate w-full text-center block">{t('nav.donate','Donate')}</Link>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default PublicNav;