import React from 'react';
import SidebarGroup from './SidebarGroup';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavSpec {
  title: string;
  quick_links: { label: string; labelKey?: string; href: string; active?: boolean }[];
  groups: { id: string; title: string; titleKey?: string; expanded?: boolean; preview?: string; items: { label: string; labelKey?: string; href: string }[] }[];
}

interface AdminSidebarProps {
  nav: NavSpec;
  open: boolean; // mobile visibility
  collapsed?: boolean; // desktop collapsed state
  onClose?: () => void;
  id?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ nav, open, collapsed=false, id = 'admin-sidebar' }) => {
  const { t } = useTranslation();
  return (
    <aside
      id={id}
      role="navigation"
      aria-label="Admin sidebar"
      className={`relative lg:static self-stretch bg-[var(--panel-sidebar)] border-r border-[var(--border-color)] flex flex-col transform transition-all duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'w-16' : 'w-64'} shadow-[var(--elev-2)]`}
      data-collapsed={collapsed}
    >
      {/* Logo/Brand Section */}
      <div className={`p-6 border-b border-[var(--border-color)] ${collapsed ? 'px-4 text-center' : ''}`}>
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Admin Panel</h2>
            <p className="text-sm text-[var(--muted-color)]">Jessica's Dashboard</p>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-[var(--primary-accent)] rounded-lg flex items-center justify-center text-white font-bold">
            J
          </div>
        )}
      </div>
      
      {/* Quick Links Section */}
      <div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
        <div className={`${collapsed ? 'space-y-2 flex flex-col items-center' : 'space-y-1'}`}>
          {nav.quick_links.map((q) => (
            <Link
              key={q.href}
              to={q.href}
              aria-current={q.active ? 'page' : undefined}
              className={`block text-sm font-medium transition-all duration-200 ${
                collapsed 
                  ? 'w-10 h-10 flex items-center justify-center rounded-xl' 
                  : 'px-4 py-3 rounded-lg'
              } ${
                q.active
                  ? 'bg-[var(--primary-accent)] text-white shadow-[var(--elev-2)]'
                  : 'text-[var(--muted-color)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)] hover:shadow-[var(--elev-1)]'
              }`}
            >
              {collapsed ? q.label.charAt(0).toUpperCase() : (q.labelKey ? t(q.labelKey) : q.label)}
            </Link>
          ))}
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-4'} pb-6 space-y-4 admin-scrollbar`}>
        {nav.groups.map((g) => (
          <div key={g.id}>
            {!collapsed && <SidebarGroup
              title={g.titleKey ? t(g.titleKey) : g.title}
              items={g.items.map((it) => ({ label: it.labelKey ? t(it.labelKey) : it.label, path: it.href }))}
              defaultOpen={g.expanded}
              preview={g.preview}
            />}
            {collapsed && (
              <div className="flex flex-col items-center gap-2" aria-label={g.titleKey ? t(g.titleKey) : g.title}>
                {g.items.map(it => (
                  <Link 
                    key={it.href} 
                    to={it.href} 
                    title={it.labelKey ? t(it.labelKey) : it.label} 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium text-[var(--muted-color)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)] hover:shadow-[var(--elev-1)] transition-all duration-200"
                  >
                    {(it.labelKey ? t(it.labelKey) : it.label).charAt(0).toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Collapse/expand button removed per design; use header hamburger instead */}
    </aside>
  );
};

export default AdminSidebar;
