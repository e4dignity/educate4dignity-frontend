import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Users, Package, Target, MapPin, TrendingUp } from 'lucide-react';
import { formatNumber } from '../../hooks/useDashboardData';

interface ImpactSummaryCardProps {
  data: {
    stats: {
      impact: {
        girlsTrained: number;
        kitsDistributed: number;
        schoolAttendance: number;
        communityReach: number;
      };
    };
  };
}

const ImpactSummaryCard: React.FC<ImpactSummaryCardProps> = ({ data }) => {
  const { t } = useTranslation();
  const impact = data.stats.impact;
  
  const impactMetrics = [
    {
      icon: <Users className="w-5 h-5" />,
      value: formatNumber(impact.girlsTrained),
      label: t('admin.impact.girlsTrained', 'Girls Trained'),
      color: 'text-[var(--primary-accent)]',
      bgColor: 'bg-[var(--primary-accent)]/10'
    },
    {
      icon: <Package className="w-5 h-5" />,
      value: formatNumber(impact.kitsDistributed),
      label: t('admin.impact.kitsDistributed', 'Kits Distributed'),
      color: 'text-[var(--success)]',
      bgColor: 'bg-[var(--success)]/10'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      value: `${impact.schoolAttendance}%`,
      label: t('admin.impact.attendance', 'Attendance Rate'),
      color: 'text-[var(--info)]',
      bgColor: 'bg-[var(--info)]/10'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      value: impact.communityReach,
      label: t('admin.impact.communities', 'Communities Reached'),
      color: 'text-[var(--warning)]',
      bgColor: 'bg-[var(--warning)]/10'
    }
  ];

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-accent)]/5 to-[var(--primary-accent)]/10"></div>
      
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--primary-accent)]/10">
            <Target className="w-6 h-6 text-[var(--primary-accent)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {t('admin.dashboard.jessicaImpact', 'Jessica\'s Direct Impact')}
            </h3>
            <p className="text-sm text-[var(--muted-color)]">
              {t('admin.dashboard.realTimeMetrics', 'Real-time impact metrics')}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {impactMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center p-3 rounded-full ${metric.bgColor} mb-2`}>
                <span className={metric.color}>
                  {metric.icon}
                </span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-[var(--muted-color)]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-[var(--border-color)]">
          <div className="text-center">
            <blockquote className="text-sm italic text-[var(--muted-color)] mb-2">
              {t('admin.dashboard.jessicaMission', 
                '"Breaking taboos, restoring dignity, one conversation at a time."'
              )}
            </blockquote>
            <div className="text-xs text-[var(--muted-color)]">
              — {t('admin.dashboard.jessicaSignature', 'Jessica, Founder & CEO')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactSummaryCard;