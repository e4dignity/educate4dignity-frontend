import React from 'react';
import { useTranslation } from 'react-i18next';

// Simple language switcher (EN/FR) with persistence
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const languages: Array<{ code: string; label: string }> = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' }
  ];

  const current = i18n.language?.substring(0,2) === 'fr' ? 'fr' : 'en';

  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem('lang', lng); } catch {}
    setOpen(false);
  };

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved && saved !== current) {
        i18n.changeLanguage(saved);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative ${className || ''}`}>      
      <button
        type="button"
        aria-haspopup="listbox"
        aria-label="Select language"
        onClick={() => setOpen(o => !o)}
        className="px-2.5 h-8 text-xs rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-primary-light)] flex items-center gap-1 font-medium"
      >
        <span>{current.toUpperCase()}</span>
        <svg className="w-3 h-3 opacity-70" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 mt-1 w-24 rounded-md shadow-sm border border-slate-200 bg-white/95 backdrop-blur-sm py-1 z-50 text-xs">
          {languages.map(l => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={current===l.code}
                onClick={() => change(l.code)}
                className={`w-full text-left px-3 py-1.5 hover:bg-rose-50 ${current===l.code ? 'font-semibold text-rose-600':'text-slate-700'}`}
              >{l.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
