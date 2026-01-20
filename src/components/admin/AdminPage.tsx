import React from 'react';

interface AdminPageProps { title?: string; children: React.ReactNode; actions?: React.ReactNode; description?: string; }

const AdminPage: React.FC<AdminPageProps> = ({ title, description, actions, children }) => {
  return (
    <div className="w-full space-y-8">
      {title && (
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{title}</h1>
            {description && <p className="text-lg text-[var(--muted-color)]">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default AdminPage;
