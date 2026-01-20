import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Image, DollarSign, User, Activity, ExternalLink } from 'lucide-react';
import { RecentActivity, formatCurrency, getActivityColor } from '../../hooks/useDashboardData';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface RecentActivitiesProps {
  activities: RecentActivity[];
  loading?: boolean;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, loading = false }) => {
  const { t } = useTranslation();

  const getIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'blog': return <Edit className="w-4 h-4" />;
      case 'gallery': return <Image className="w-4 h-4" />;
      case 'donation': return <DollarSign className="w-4 h-4" />;
      case 'admin': return <User className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: RecentActivity['type']) => {
    switch (type) {
      case 'blog': return t('admin.activities.blog', 'Blog');
      case 'gallery': return t('admin.activities.gallery', 'Gallery');
      case 'donation': return t('admin.activities.donation', 'Donation');
      case 'admin': return t('admin.activities.admin', 'Admin');
      default: return t('admin.activities.other', 'Other');
    }
  };

  const getStatusBadge = (status: RecentActivity['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'success':
        return <span className={`${baseClasses} bg-[var(--success-bg)] text-[var(--success)]`}>
          {t('admin.status.success', 'Success')}
        </span>;
      case 'pending':
        return <span className={`${baseClasses} bg-[var(--warning-bg)] text-[var(--warning)]`}>
          {t('admin.status.pending', 'Pending')}
        </span>;
      case 'draft':
        return <span className={`${baseClasses} bg-[var(--muted-bg)] text-[var(--muted-color)]`}>
          {t('admin.status.draft', 'Draft')}
        </span>;
      case 'error':
        return <span className={`${baseClasses} bg-[var(--error-bg)] text-[var(--error)]`}>
          {t('admin.status.error', 'Error')}
        </span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return t('admin.activities.today', 'Today');
    } else if (diffDays === 1) {
      return t('admin.activities.yesterday', 'Yesterday');
    } else if (diffDays < 7) {
      return t('admin.activities.daysAgo', '{days} days ago', { days: diffDays });
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {t('admin.dashboard.recentActivities', 'Recent Activities')}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-[var(--muted-bg)]"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--muted-bg)] rounded w-3/4"></div>
                  <div className="h-3 bg-[var(--muted-bg)] rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-[var(--muted-bg)] rounded-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {t('admin.dashboard.recentActivities', 'Recent Activities')}
          </h3>
          <button className="text-sm text-[var(--primary-accent)] hover:underline">
            {t('admin.activities.viewAll', 'View All')}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-[var(--muted-color)]">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('admin.activities.empty', 'No recent activities')}</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors group"
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.status)}`}>
                  {getIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {activity.amount && (
                        <span className="text-sm font-semibold text-[var(--success)]">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted-color)] mb-2 line-clamp-1">
                    {activity.description}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted-color)]">
                        {getTypeLabel(activity.type)}
                      </span>
                      <span className="text-[var(--muted-color)]">•</span>
                      <span className="text-[var(--muted-color)]">
                        {formatDate(activity.date)}
                      </span>
                    </div>

                    {activity.href && (
                      <a
                        href={activity.href}
                        className="flex items-center gap-1 text-[var(--primary-accent)] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                      >
                        <span>{t('admin.activities.view', 'View')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {activities.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between text-xs text-[var(--muted-color)]">
              <span>
                {t('admin.activities.showing', 'Showing {count} recent activities', { 
                  count: activities.length 
                })}
              </span>
              <button className="text-[var(--primary-accent)] hover:underline">
                {t('admin.activities.loadMore', 'Load More')}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;