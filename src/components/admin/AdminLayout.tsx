import React from 'react';
import JessicaChatAssistant from '../jessica/JessicaChatAssistant';

interface AdminLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  cssVars?: React.CSSProperties;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ sidebar, header, children, cssVars }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ ...cssVars }}>
      {/* Full-width header on top */}
      {header}
      {/* Content row below header: sidebar + main */}
      <div className="flex-1 min-h-0 flex bg-[var(--admin-bg)]">
        {sidebar}
        <div className="flex-1 min-h-0 flex flex-col">
          <main className="flex-1 w-full flex flex-col items-center bg-gradient-to-br from-[var(--color-background)] to-[var(--admin-bg)] p-6">
            <div className="w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Chat Assistant for all admin pages */}
      <JessicaChatAssistant />
    </div>
  );
};

export default AdminLayout;
