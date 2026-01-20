import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import KpiCard from '../../components/admin/KpiCard';
import { GroupedBarChart, MiniLineChart, MiniPieChart } from '../../components/admin/MiniCharts';
import RecentActivities from '../../components/admin/RecentActivities';
import ImpactSummaryCard from '../../components/admin/ImpactSummaryCard';
import { adminNavSpec } from '../../data/adminSpec';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useTranslation } from 'react-i18next';
import { useDashboardData, formatCurrency, formatNumber } from '../../hooks/useDashboardData';
import AdminPage from '../../components/admin/AdminPage';
// Essential admin components for Jessica's simplified approach
import AdminBlog from './AdminBlog';
import AdminBlogEditor from './AdminBlogEditor';
import AdminGallery from './AdminGallery';
import AdminDonors from './donors/AdminDonors';
import AdminDonorProfile from './donors/AdminDonorProfile';
import FinancesDonorsManagement from './FinancesDonorsManagement';
import AdminAdmins from './AdminAdmins';

// Admin dashboard simplified for Jessica's approach - stories, gallery, donations

const AdminDashboard: React.FC = () => {
  const [sidebarCollapsed,setSidebarCollapsed] = useState(false); // desktop collapse
  const { t } = useTranslation();
  const nav = adminNavSpec.sidebar;
  const { data, loading, error, refresh } = useDashboardData();
  return (
    <AdminLayout
  sidebar={<AdminSidebar nav={nav} open={true} collapsed={sidebarCollapsed} />}
  header={<AdminHeader onToggleSidebar={()=>setSidebarCollapsed(c=>!c)} sidebarOpen={!sidebarCollapsed} />}
    >
      <Routes>
        <Route index element={
          <AdminPage title={t('admin.dashboard.title', 'Jessica\'s Impact Dashboard')}>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--primary-accent)] border-t-transparent rounded-full"></div>
                <span className="ml-3 text-[var(--muted-color)]">{t('common.loading', 'Loading...')}</span>
              </div>
            )}
            {error && (
              <div className="bg-[var(--error-bg)] border border-[var(--error)] rounded-lg p-4 mb-6">
                <p className="text-[var(--error)] mb-2">{t('common.error','Error')}: {error}</p>
                <button 
                  onClick={refresh} 
                  className="text-[var(--primary-accent)] hover:underline text-sm"
                >
                  {t('common.retry','Retry')}
                </button>
              </div>
            )}
            {data && (
              <div className="space-y-6">
                <JessicaKpiRow data={data} />
                <JessicaChartsRow data={data} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivities activities={data.recentActivities} loading={loading} />
                  <ImpactSummaryCard data={data} />
                </div>
              </div>
            )}
          </AdminPage>
        } />
  {/* Project routes removed - Jessica approach doesn't need complex project management */}
  <Route path="finances" element={<FinancesDonorsManagement />} />
  <Route path="donors" element={<AdminDonors />} />
  <Route path="donors/:id" element={<AdminDonorProfile />} />
  <Route path="blog" element={<AdminBlog />} />
  <Route path="blog/new" element={<AdminBlogEditor />} />
  <Route path="blog/:slug/edit" element={<AdminBlogEditor />} />
  <Route path="gallery" element={<AdminGallery />} />
  {/* E-learning, resources, team routes removed - simplified for Jessica */}
  <Route path="admins" element={<AdminAdmins />} />
        <Route path="*" element={<Outlet />} />
      </Routes>
    </AdminLayout>
  );
};

const JessicaKpiRow: React.FC<{data:any}> = ({data}) => {
  const {t} = useTranslation();
  const stats = data.stats;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard 
        title={t('admin.kpis.blogPosts','Blog Stories')} 
        value={stats.blogPosts.published}
        subtitle={`${stats.blogPosts.drafts} ${t('admin.kpis.drafts', 'drafts')} • ${stats.blogPosts.thisMonth} ${t('admin.kpis.thisMonth', 'this month')}`}
        trend="up"
        href="/admin/blog"
      />
      <KpiCard 
        title={t('admin.kpis.gallery','Photo Gallery')} 
        value={stats.gallery.total}
        subtitle={`${stats.gallery.public} ${t('admin.kpis.public', 'public')} • ${stats.gallery.thisMonth} ${t('admin.kpis.thisMonth', 'this month')}`}
        progressPct={(stats.gallery.public / stats.gallery.total) * 100}
        href="/admin/gallery"
      />
      <KpiCard 
        title={t('admin.kpis.donations','Monthly Donations')} 
        value={formatCurrency(stats.donations.monthlyAmount)}
        subtitle={`${t('admin.kpis.totalDonations', 'Total')}: ${formatCurrency(stats.donations.totalAmount)} • ${stats.donations.donorCount} ${t('admin.kpis.donors', 'donors')}`}
        trend="up"
        href="/admin/donors"
      />
      <KpiCard 
        title={t('admin.kpis.girlsTrained','Girls Trained')} 
        value={formatNumber(stats.impact.girlsTrained)}
        subtitle={`${stats.impact.schoolAttendance}% ${t('admin.kpis.attendance', 'attendance')} • ${stats.impact.communityReach} ${t('admin.kpis.communities', 'communities')}`}
        progressPct={stats.impact.schoolAttendance}
        trend="up"
      />
    </div>
  );
};

const JessicaChartsRow: React.FC<{data:any}> = ({data}) => {
  const chartData = data.chartData;
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <GroupedBarChart
        title={t('admin.charts.monthlyDonations', 'Monthly Donations & Donors')}
        labels={chartData.monthlyDonations.map((d: any) => d.month)}
        series={{
          [t('admin.charts.donations', 'Donations ($)')]: chartData.monthlyDonations.map((d: any) => d.amount / 1000), // Convert to thousands
          [t('admin.charts.donors', 'Donors')]: chartData.monthlyDonations.map((d: any) => d.donors)
        }}
      />
      <MiniLineChart 
        title={t('admin.charts.contentGrowth', 'Content Growth')} 
        points={chartData.contentGrowth.map((d: any) => d.blog + d.gallery)} // Total content pieces
      />
      <MiniPieChart 
        title={t('admin.charts.impactMetrics', 'Impact Progress')} 
        values={chartData.impactMetrics.map((m: any) => ({ 
          label: m.category, 
          value: (m.value / m.target) * 100 // Convert to percentage
        }))} 
      />
    </div>
  );
};

export default AdminDashboard;
