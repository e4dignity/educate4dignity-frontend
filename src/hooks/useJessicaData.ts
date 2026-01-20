// Hook React optimisé pour les données Jessica - utilise l'API backend existante sans refactoring

import { useState, useEffect, useMemo } from 'react';
import { jessicaDataService, type JessicaStoryData, type JessicaProject, type JessicaTestimonial } from '../services/jessicaDataService';

// Hook principal pour les données complètes de Jessica
export const useJessicaStory = () => {
  const [story, setStory] = useState<JessicaStoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const jessicaStory = await jessicaDataService.getJessicaStory();
        
        if (isMounted) {
          setStory(jessicaStory);
        }
      } catch (err) {
        console.error('Error loading Jessica story:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStory();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const jessicaStory = await jessicaDataService.getJessicaStory();
      setStory(jessicaStory);
    } catch (err) {
      console.error('Error refetching Jessica story:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    story,
    isLoading,
    error,
    refetch
  };
};

// Hook spécialisé pour les métriques d'impact Jessica
export const useJessicaMetrics = () => {
  const { story, isLoading, error } = useJessicaStory();

  const metrics = useMemo(() => {
    if (!story) {
      return {
        girlsTrained: 0,
        kitsDistributed: 0,
        yearsImpact: 0,
        milesTravel: 0,
        schoolAttendanceRate: 0
      };
    }

    return story.keyAchievements;
  }, [story]);

  // Calculs dérivés pour l'affichage avec formatage
  const derivedMetrics = useMemo(() => {
    const avgKitsPerGirl = metrics.girlsTrained > 0 ? Math.round(metrics.kitsDistributed / metrics.girlsTrained) : 0;
    const impactRate = metrics.yearsImpact > 0 ? Math.round(metrics.girlsTrained / metrics.yearsImpact) : 0;
    
    return {
      ...metrics,
      avgKitsPerGirl,
      impactRate,
      // Métriques formatées pour l'affichage
      formatted: {
        girlsTrained: metrics.girlsTrained.toLocaleString(),
        kitsDistributed: metrics.kitsDistributed.toLocaleString(),
        milesTravel: metrics.milesTravel.toLocaleString(),
        attendanceRate: `${metrics.schoolAttendanceRate}%`
      }
    };
  }, [metrics]);

  return {
    metrics: derivedMetrics,
    isLoading,
    error
  };
};

// Hook spécialisé pour les projets Jessica
export const useJessicaProjects = () => {
  const { story, isLoading, error } = useJessicaStory();

  const projectData = useMemo(() => {
    if (!story?.currentProjects) {
      return {
        all: [],
        active: [],
        completed: [],
        planned: [],
        byCategory: {}
      };
    }

    const allProjects = story.currentProjects;
    const active = allProjects.filter((p: JessicaProject) => p.status === 'active');
    const completed = allProjects.filter((p: JessicaProject) => p.status === 'completed');
    const planned = allProjects.filter((p: JessicaProject) => p.status === 'planned');

    // Groupement par catégorie
    const byCategory = allProjects.reduce((acc: any, project: JessicaProject) => {
      if (!acc[project.category]) {
        acc[project.category] = [];
      }
      acc[project.category].push(project);
      return acc;
    }, {});

    return {
      all: allProjects,
      active,
      completed,
      planned,
      byCategory
    };
  }, [story]);

  // Calculs de financement et d'impact
  const statistics = useMemo(() => {
    const { all } = projectData;
    
    const totalBudget = all.reduce((sum: number, p: JessicaProject) => sum + p.budget, 0);
    const totalRaised = all.reduce((sum: number, p: JessicaProject) => sum + p.raised, 0);
    const totalGirls = all.reduce((sum: number, p: JessicaProject) => sum + (p.girlsReached || 0), 0);
    const fundingProgress = totalBudget > 0 ? (totalRaised / totalBudget) * 100 : 0;

    return {
      counts: {
        total: all.length,
        active: projectData.active.length,
        completed: projectData.completed.length,
        planned: projectData.planned.length
      },
      funding: {
        budget: totalBudget,
        raised: totalRaised,
        progress: fundingProgress,
        remaining: Math.max(0, totalBudget - totalRaised)
      },
      impact: {
        totalGirls,
        avgGirlsPerProject: all.length > 0 ? Math.round(totalGirls / all.length) : 0,
        completionRate: all.length > 0 ? Math.round((projectData.completed.length / all.length) * 100) : 0
      }
    };
  }, [projectData]);

  return {
    projects: projectData,
    statistics,
    funding: statistics.funding, // Expose funding directly for easier access
    isLoading,
    error
  };
};

// Hook pour les témoignages avec rotation et catégorisation
export const useJessicaTestimonials = (rotationInterval = 5000) => {
  const { story, isLoading, error } = useJessicaStory();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonialData = useMemo(() => {
    if (!story?.testimonials) {
      return {
        all: [],
        featured: [],
        recent: [],
        byCategory: {},
        byImpact: { high: [], medium: [], low: [] }
      };
    }

    const all = story.testimonials;
    
    // Groupement par catégorie
    const byCategory = all.reduce((acc: any, testimonial: JessicaTestimonial) => {
      if (!acc[testimonial.category]) {
        acc[testimonial.category] = [];
      }
      acc[testimonial.category].push(testimonial);
      return acc;
    }, {});

    // Groupement par niveau d'impact
    const byImpact = all.reduce((acc: any, testimonial: JessicaTestimonial) => {
      const impact = testimonial.impact || 'medium';
      if (!acc[impact]) {
        acc[impact] = [];
      }
      acc[impact].push(testimonial);
      return acc;
    }, { high: [], medium: [], low: [] });

    // Sélection des témoignages featured et récents
    const featured = all
      .filter((t: JessicaTestimonial) => t.featured)
      .sort((a: JessicaTestimonial, b: JessicaTestimonial) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    const recent = all
      .sort((a: JessicaTestimonial, b: JessicaTestimonial) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 6);

    return {
      all,
      featured,
      recent,
      byCategory,
      byImpact
    };
  }, [story]);

  // Rotation automatique des témoignages
  useEffect(() => {
    if (testimonialData.all.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex(prev => 
        (prev + 1) % testimonialData.all.length
      );
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [testimonialData.all.length, rotationInterval]);

  const goToTestimonial = (index: number) => {
    if (index >= 0 && index < testimonialData.all.length) {
      setCurrentTestimonialIndex(index);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex(prev => 
      (prev + 1) % testimonialData.all.length
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex(prev => 
      prev === 0 ? testimonialData.all.length - 1 : prev - 1
    );
  };

  const statistics = useMemo(() => {
    return {
      total: testimonialData.all.length,
      featured: testimonialData.featured.length,
      categoryCounts: Object.keys(testimonialData.byCategory).reduce((acc: any, cat: string) => {
        acc[cat] = testimonialData.byCategory[cat].length;
        return acc;
      }, {}),
      impactDistribution: {
        high: testimonialData.byImpact.high.length,
        medium: testimonialData.byImpact.medium.length,
        low: testimonialData.byImpact.low.length
      }
    };
  }, [testimonialData]);

  return {
    testimonials: testimonialData.all, // Expose array directly for easier access
    testimonialsData: testimonialData, // Keep structured data available
    currentTestimonial: testimonialData.all[currentTestimonialIndex] || null,
    currentIndex: currentTestimonialIndex,
    totalCount: testimonialData.all.length, // Add totalCount for backward compatibility
    statistics,
    goToTestimonial,
    nextTestimonial,
    prevTestimonial,
    isLoading,
    error
  };
};

// Hook pour formater les données pour l'affichage
export const useFormattedJessicaData = () => {
  const { story, isLoading, error } = useJessicaStory();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatImpactMetrics = () => {
    if (!story) return null;

    const { keyAchievements } = story;
    
    return {
      girlsTrained: {
        value: formatNumber(keyAchievements.girlsTrained),
        label: 'Girls Trained',
        description: 'Young women empowered with knowledge and dignity'
      },
      kitsDistributed: {
        value: formatNumber(keyAchievements.kitsDistributed),
        label: 'Kits Distributed',
        description: 'Reusable menstrual kits changing lives'
      },
      yearsImpact: {
        value: '3',
        label: 'Years Kit Lifespan',
        description: 'Each kit designed to last 3 years'
      },
      milesTravel: {
        value: formatNumber(keyAchievements.milesTravel),
        label: 'Miles Traveled',
        description: 'Distance covered to reach communities in need'
      }
    };
  };

  return {
    story,
    formatCurrency,
    formatNumber,
    formatImpactMetrics,
    isLoading,
    error
  };
};