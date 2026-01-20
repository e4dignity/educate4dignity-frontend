import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';

const CheckoutCancelPage: React.FC = () => {
  return (
    <PublicPageShell>
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-[28px] leading-[34px] font-bold text-primary">Payment canceled</h1>
        <p className="text-secondary">No worries. You can adjust your amount or try again anytime.</p>
        <div className="mt-6">
          <Link to="/donate" className="inline-block px-4 py-2 rounded-full border border-primary text-primary hover:bg-[var(--color-primary-light)]">Return to donate</Link>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default CheckoutCancelPage;
