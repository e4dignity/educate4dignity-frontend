import React from 'react';
import PublicNav from './PublicNav';
import PublicFooter from './PublicFooter';

interface PublicPageShellProps {
  children: React.ReactNode;
  withFooterNewsletter?: boolean;
  topPadding?: boolean; // allow hero to sit closer if false
  backgroundVariant?: 'gradient' | 'plain';
}

// Lightweight wrapper to unify the minimal rose theme across public pages (mirrors E-learning layout)
// Usage: wraps entire page content (excluding modals) and applies consistent background + container.
const PublicPageShell: React.FC<PublicPageShellProps> = ({ children, withFooterNewsletter = true, topPadding = true, backgroundVariant='gradient' }) => {
  const bg = backgroundVariant==='plain' ? 'var(--rose-50)' : 'linear-gradient(to bottom,var(--rose-50),var(--rose-100))';
  return (
    <div className="min-h-screen" style={{background:bg}}>
      <PublicNav />
      <main className={`${topPadding? 'pt-6':''} pb-24 px-4 sm:px-6 lg:px-8`}> 
        <div className="max-w-[1200px] mx-auto space-y-10">{children}</div>
      </main>
      <PublicFooter withNewsletter={withFooterNewsletter} />
    </div>
  );
};

export default PublicPageShell;
