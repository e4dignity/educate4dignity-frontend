import React from 'react';
import { LanguageSelector } from '../ui/LanguageSelector';
import Logo from '../ui/Logo';
import { useAuth } from '../../hooks/authContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, LogOut, HelpCircle, Sun, Moon } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarId?: string;
  sidebarOpen?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, sidebarId = 'admin-sidebar', sidebarOpen }) => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { t } = useTranslation();
  const [menuOpen,setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement|null>(null);
  const [dark,setDark] = React.useState<boolean>(()=> typeof document!=='undefined' && document.documentElement.classList.contains('dark'));

  React.useEffect(()=> {
    const onKey = (e:KeyboardEvent) => { if(e.key==='Escape') setMenuOpen(false); };
    const onClick = (e:MouseEvent) => { if(menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    if(menuOpen){ window.addEventListener('keydown',onKey); window.addEventListener('mousedown',onClick); }
    return ()=> { window.removeEventListener('keydown',onKey); window.removeEventListener('mousedown',onClick); };
  },[menuOpen]);

  React.useEffect(()=> {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('theme', dark? 'dark':'light'); } catch {}
  },[dark]);
  React.useEffect(()=> { try { if(localStorage.getItem('theme')==='dark') setDark(true); } catch {} },[]);

  const handleLogout = () => { logout(); nav('/login'); };

  const displayName = user?.name || 'Admin';

  return (
    <header className="h-14 border-b border-[var(--border-color)]/60 bg-[var(--color-surface)]/80 backdrop-blur flex items-center px-4 sticky top-0 z-30 shadow-[var(--elev-1)]">
      <div className="flex items-center gap-4 w-full">
        {/* Brand cluster on the left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded hover:bg-[var(--chip-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
            aria-label="Toggle sidebar"
            aria-controls={sidebarId}
            aria-expanded={sidebarOpen}
            title="Collapse/expand sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-primary)]">
            <Logo size="sm" />
            <span>{t('admin.admin','Admin')}</span>
          </div>
        </div>

        {/* Controls on the right */}
        <div className="flex items-center gap-4 ml-auto">
          <LanguageSelector />
          <button
            type="button"
            onClick={()=> setDark(d=>!d)}
            className="p-2 rounded hover:bg-[var(--chip-bg)] focus:outline-none"
            aria-label={dark? t('ui.mode.switchToLight','Switch to light mode'):t('ui.mode.switchToDark','Switch to dark mode')}
            title={dark? t('ui.mode.light','Light mode'):t('ui.mode.dark','Dark mode')}
          >
            {dark? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="relative p-2 rounded hover:bg-[var(--chip-bg)] focus:outline-none" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[var(--primary-accent)] text-white text-[9px] rounded-full flex items-center justify-center">3</span>
          </button>
          <div className="relative" ref={menuRef}>
            <button onClick={()=>setMenuOpen(o=>!o)} className="flex items-center gap-2 group focus:outline-none" aria-haspopup="menu" aria-expanded={menuOpen}>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-accent)] text-white text-sm font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="text-[12px] font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-accent)] transition">{displayName}</span>
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 min-w-[180px] rounded-md border border-[var(--border-color)] bg-[var(--color-surface)] shadow-lg py-1 text-[12px] z-50 animate-fade-in">
                <button className="w-full flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-[var(--chip-bg)] text-[var(--text-primary)]" role="menuitem">
                  <HelpCircle size={14} /> {t('admin.ui.actions.help','Help')}
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-[var(--chip-bg)] text-[var(--text-primary)]" role="menuitem">
                  <LogOut size={14} /> {t('admin.ui.actions.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
