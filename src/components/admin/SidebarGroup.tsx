import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Item { id?:string; label:string; path?:string; href?:string; }
interface Props { title: string; items: Item[]; defaultOpen?: boolean; preview?: string; }

const SidebarGroup: React.FC<Props> = ({ title, items, defaultOpen, preview }) => {
  const [open,setOpen] = useState(!!defaultOpen);
  const location = useLocation();
  return (
    <div className="mb-4">
      <button 
        onClick={()=>setOpen(o=>!o)} 
        aria-expanded={open} 
        className="w-full text-left flex items-center justify-between text-sm font-semibold px-3 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--card-bg)] hover:shadow-[var(--elev-1)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] transition-all duration-200"
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />} 
          {title}
        </span>
      </button>
      {!open && preview && (
        <div className="mt-2 px-3 text-sm text-[var(--muted-color)] leading-relaxed">{preview}</div>
      )}
      {open && (
        <ul className="mt-2 space-y-1">
          {items.map((it,idx) => {
            const to = it.path || it.href || '#';
            const active = location.pathname === to;
            return (
              <li key={idx}>
                <Link 
                  to={to} 
                  aria-current={active ? 'page' : undefined} 
                  className={`group flex items-center gap-3 text-sm px-4 py-2.5 rounded-lg truncate transition-all duration-200 ${
                    active
                      ? 'bg-[var(--primary-accent)] text-white shadow-[var(--elev-2)]'
                      : 'text-[var(--muted-color)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)] hover:shadow-[var(--elev-1)]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full transition-colors ${
                    active 
                      ? 'bg-white' 
                      : 'bg-[var(--border-color)] group-hover:bg-[var(--primary-accent)]'
                  }`} />
                  <span className="truncate font-medium">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SidebarGroup;
