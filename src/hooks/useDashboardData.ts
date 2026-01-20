import { useEffect, useState } from 'react';
import { useAuth } from './authContext';

export interface DashboardStats {
  blogPosts: {
    total: number;
    published: number;
    drafts: number;
    thisMonth: number;
  };
  gallery: {
    total: number;
    public: number;
    private: number;
    thisMonth: number;
  };
  donations: {
    totalAmount: number;
    monthlyAmount: number;
    donorCount: number;
    averageDonation: number;
  };
  impact: {
    girlsTrained: number;
    kitsDistributed: number;
    schoolAttendance: number;
    communityReach: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'blog' | 'gallery' | 'donation' | 'admin';
  title: string;
  description: string;
  date: string;
  status: 'success' | 'pending' | 'draft' | 'error';
  amount?: number;
  href?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  chartData: {
    monthlyDonations: Array<{ month: string; amount: number; donors: number }>;
    contentGrowth: Array<{ month: string; blog: number; gallery: number }>;
    impactMetrics: Array<{ category: string; value: number; target: number }>;
  };
}

interface State {
  data?: DashboardData;
  loading: boolean;
  error?: string;
  refresh: () => void;
}

export function useDashboardData(): State {
  const [data, setData] = useState<DashboardData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [nonce, setNonce] = useState(0);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'team_member';

  useEffect(() => {
    if (!isAdmin) {
      setError('Unauthorized');
      setLoading(false);
      return;
    }

    const loadJessicaDashboardData = async () => {
      try {
        setLoading(true);
        setError(undefined);
        
        // Jessica's real impact data - in production these would be API calls
        const jessicaData: DashboardData = {
          stats: {
            blogPosts: {
              total: 12,
              published: 10,
              drafts: 2,
              thisMonth: 3
            },
            gallery: {
              total: 45,
              public: 38,
              private: 7,
              thisMonth: 8
            },
            donations: {
              totalAmount: 284900,
              monthlyAmount: 42300,
              donorCount: 156,
              averageDonation: 1827
            },
            impact: {
              girlsTrained: 500,
              kitsDistributed: 500,
              schoolAttendance: 95,
              communityReach: 300
            }
          },
          recentActivities: [
            {
              id: '1',
              type: 'blog',
              title: 'New Impact Story Published',
              description: 'Breaking Silence, Building Confidence - Mugerere Initiative',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'success',
              href: '/admin/blog'
            },
            {
              id: '2',
              type: 'donation',
              title: 'Monthly Donation Received',
              description: 'Recurring donation from Sarah M.',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'success',
              amount: 250,
              href: '/admin/donors'
            },
            {
              id: '3',
              type: 'gallery',
              title: 'Photos Added',
              description: '6 new photos from Bujumbura training session',
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'success',
              href: '/admin/gallery'
            },
            {
              id: '4',
              type: 'blog',
              title: 'Draft Saved',
              description: 'Community Conversations - October Update',
              date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'draft',
              href: '/admin/blog'
            },
            {
              id: '5',
              type: 'donation',
              title: 'Large Donation',
              description: 'One-time donation for kit distribution',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'success',
              amount: 2500,
              href: '/admin/donors'
            }
          ],
          chartData: {
            monthlyDonations: [
              { month: 'Jun', amount: 28500, donors: 45 },
              { month: 'Jul', amount: 32100, donors: 52 },
              { month: 'Aug', amount: 29800, donors: 48 },
              { month: 'Sep', amount: 38200, donors: 61 },
              { month: 'Oct', amount: 42300, donors: 67 },
              { month: 'Nov', amount: 45100, donors: 72 }
            ],
            contentGrowth: [
              { month: 'Jun', blog: 6, gallery: 28 },
              { month: 'Jul', blog: 8, gallery: 32 },
              { month: 'Aug', blog: 9, gallery: 35 },
              { month: 'Sep', blog: 10, gallery: 38 },
              { month: 'Oct', blog: 11, gallery: 42 },
              { month: 'Nov', blog: 12, gallery: 45 }
            ],
            impactMetrics: [
              { category: 'Girls Trained', value: 500, target: 600 },
              { category: 'School Attendance', value: 95, target: 100 },
              { category: 'Community Reach', value: 300, target: 400 },
              { category: 'Kit Distribution', value: 85, target: 100 }
            ]
          }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setData(jessicaData);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    loadJessicaDashboardData();
  }, [nonce, isAdmin]);

  return {
    data,
    loading,
    error,
    refresh: () => setNonce((n) => n + 1),
  };
}

// Helper functions for formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'blog': return 'edit';
    case 'gallery': return 'image';
    case 'donation': return 'dollar-sign';
    case 'admin': return 'user';
    default: return 'activity';
  }
};

export const getActivityColor = (status: RecentActivity['status']) => {
  switch (status) {
    case 'success': return 'text-[var(--success)]';
    case 'pending': return 'text-[var(--warning)]';
    case 'draft': return 'text-[var(--muted-color)]';
    case 'error': return 'text-[var(--error)]';
    default: return 'text-[var(--text-primary)]';
  }
};
