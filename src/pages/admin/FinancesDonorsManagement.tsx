import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import AdminPage from '../../components/admin/AdminPage';
import { useTranslation } from 'react-i18next';

const FinancesDonorsManagement: React.FC = () => {
  // Simplified donations management for Jessica's mission
  React.useEffect(() => {
    console.log('[JESSICA_DONATIONS_LOADED] donations management loaded');
  }, []);
  // Jessica's donations overview - mock data for now
  const [financialOverview] = useState({
    totalDonations: 15420, // Jessica's total donations
    monthlyDonations: 2850, // Current month
    averageDonation: 85     // Average per donor
  });

  // Donor-specific listing moved to dedicated Donors page; Finance focuses on amounts and admin expenses.


  // Donor filtering removed in Finance page scope

  const { t } = useTranslation();
  const [tab, setTab] = useState<'overview'|'transactions'>('overview');
  return (
  <AdminPage title={t('admin.finances','Finances')} description={t('admin.finances.description','Financial overview and transactions')} actions={null}>

  {/* Marker: Finance tabs reduced to Overview + Transactions only. */}
  <div data-testid="finance-simplified-marker" className="mb-2 text-[11px] tracking-wide uppercase font-semibold text-[var(--muted-color)]">FINANCE_SIMPLIFIED_VIEW</div>

      {/* Tabs (Overview | Transactions) */}
      <div className="mb-6 border-b border-border">
        <div className="flex space-x-8">
          <button onClick={()=> setTab('overview')} className={`pb-3 -mb-px text-[13px] font-medium ${tab==='overview'? 'border-b-2 border-[var(--color-primary)] text-[var(--text-primary)]':'text-[var(--muted-color)]'}`}>{t('common.overview','Overview')}</button>
          <button onClick={()=> setTab('transactions')} className={`pb-3 -mb-px text-[13px] font-medium ${tab==='transactions'? 'border-b-2 border-[var(--color-primary)] text-[var(--text-primary)]':'text-[var(--muted-color)]'}`}>{t('admin.ui.finances.transactions','Transactions')}</button>
        </div>
      </div>

      {tab==='overview' && <>

        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="kpi-number">
                    ${financialOverview.totalDonations.toLocaleString()}
                  </div>
                  <div className="text-secondary text-sm">{t('admin.finances.totalDonations','Total Donations')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{color:'var(--color-success)'}}>
                    ${financialOverview.monthlyDonations.toLocaleString()}
                  </div>
                  <div className="text-secondary text-sm">{t('admin.finances.thisMonth','This Month')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{color:'var(--color-warning)'}}>
                    ${financialOverview.averageDonation}
                  </div>
                  <div className="text-secondary text-sm">{t('admin.finances.avgDonation','Avg Donation')}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                  <CardTitle>{t('admin.finances.monthlyTrend','Monthly Donations Trend')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg p-3" style={{background:'var(--color-primary-light)'}}>
                    <MonthlyDonationsChart />
                  </div>
                </CardContent>
            </Card>

            {/* Donor distribution moved to Donors area to avoid redundancy with Finance */}
          </div>

          {/* Recent Donors Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.finances.recentActivity','Recent Donor Activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Marie Dupont</div>
                    <div className="text-sm text-gray-500">{t('admin.finances.monthlyDonation','Monthly Donation')}</div>
                  </div>
                  <div className="font-bold text-green-600">$50</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Jean-Pierre Mukasine</div>
                    <div className="text-sm text-gray-500">{t('admin.finances.oneTimeDonation','One-time Donation')}</div>
                  </div>
                  <div className="font-bold text-green-600">$125</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Deerfield Academy</div>
                    <div className="text-sm text-gray-500">Partenariat institutionnel</div>
                  </div>
                  <div className="font-bold text-green-600">$2,500</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>}

      {tab==='transactions' && <div className="space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Transactions</h3>
        <div className="rounded-xl bg-[var(--color-surface)] p-6 text-[13px] text-[var(--muted-color)]" style={{boxShadow:'var(--elev-1)'}}>
          Liste des transactions (dons, dépenses) à intégrer — en cours d'intégration.
        </div>
      </div>}
    </AdminPage>
  );
};

const MonthlyDonationsChart: React.FC = () => {
  // Mock data for Jessica's donations chart
  const [data] = React.useState<Array<{ month: string; donations: number }>>([
    { month: '2024-08', donations: 1200 },
    { month: '2024-09', donations: 1850 },
    { month: '2024-10', donations: 2400 },
    { month: '2024-11', donations: 2850 },
  ]);

  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-[13px] text-[var(--muted-color)]">No chart data</div>;

  // Simple SVG line chart
  const w = 560; const h = 240; const padding = 28;
  const vals = data.map(d => d.donations);
  const max = Math.max(1, ...vals);
  const stepX = (w - padding*2) / Math.max(1, data.length - 1);
  const points = data.map((d,i)=> {
    const x = padding + i * stepX;
    const y = padding + (1 - (d.donations / max)) * (h - padding*2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none">
      <rect x={0} y={0} width={w} height={h} fill="none" />
      {/* grid lines */}
      {Array.from({length:4}).map((_,i)=> {
        const y = padding + i * ((h - padding*2)/3);
        return <line key={i} x1={padding} x2={w-padding} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" />;
      })}
      {/* polyline */}
      <polyline points={points} fill="none" stroke="var(--color-primary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* area fill */}
      <polygon points={`${padding},${h-padding} ${points} ${w-padding},${h-padding}`} fill="rgba(59,130,246,0.08)" />
      {/* markers */}
      {data.map((d,i)=> {
        const x = padding + i * stepX;
        const y = padding + (1 - (d.donations / max)) * (h - padding*2);
        return <g key={d.month}><circle cx={x} cy={y} r={3} fill="var(--color-primary)" /><text x={x} y={h-padding+14} fontSize={10} textAnchor="middle" fill="var(--muted-color)">{d.month.slice(5)}</text></g>;
      })}
    </svg>
  );
};

export default FinancesDonorsManagement;
