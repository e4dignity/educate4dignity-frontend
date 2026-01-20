// Service Jessica Data - Adapte l'API backend existante à la perspective Jessica
// Utilise les mêmes endpoints sans refactoring backend

import { apiListBlog, BlogPostSummary } from './apiBlog';

// Types Jessica adaptés des types backend existants
export interface JessicaStoryData {
  personalQuote: string;
  missionStatement: string;
  keyAchievements: {
    girlsTrained: number;
    kitsDistributed: number;
    yearsImpact: number;
    milesTravel: number;
    schoolAttendanceRate: number;
  };
  currentProjects: JessicaProject[];
  recentStories: JessicaBlogStory[];
  testimonials: JessicaTestimonial[];
  impactHighlights: JessicaImpactHighlight[];
}

export interface JessicaProject {
  id: string;
  title: string;
  description: string;
  location: string;
  jessicaRole: string;
  impact: string;
  status: 'active' | 'completed' | 'planned';
  coverImage: string;
  progressPct: number;
  budget: number;
  raised: number;
  girlsReached?: number;
  category: 'education' | 'distribution' | 'community' | 'research';
}

export interface JessicaBlogStory {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  jessicaPerspective: string;
}

export interface JessicaTestimonial {
  id: string;
  name: string;
  age?: number;
  location: string;
  quote: string;
  photo: string;
  projectId?: string;
  relationship: 'student' | 'parent' | 'teacher' | 'community';
  category: 'education' | 'health' | 'empowerment' | 'community' | 'personal';
  date: string;
  impact?: 'high' | 'medium' | 'low';
  featured?: boolean;
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export interface JessicaImpactHighlight {
  id: string;
  title: string;
  metric: string;
  description: string;
  icon: string;
  trend: 'up' | 'stable' | 'improving';
  category: 'education' | 'health' | 'economic' | 'social';
}

class JessicaDataService {
  
  /**
   * Récupère l'histoire complète de Jessica en adaptant les données backend
   */
  async getJessicaStory(): Promise<JessicaStoryData> {
    try {
      const blogStories = await apiListBlog({ pageSize: 6 });

      return {
        personalQuote: "Breaking taboos, restoring dignity, one conversation at a time.",
        missionStatement: "What started as listening to girls in Bujumbura has become a science-driven movement combining empathy with engineering to restore dignity and transform educational outcomes.",
        keyAchievements: this.getStaticJessicaAchievements(),
        currentProjects: this.getStaticJessicaProjects(),
        recentStories: this.adaptBlogToJessicaStories(blogStories || []),
        testimonials: this.getJessicaTestimonials(),
        impactHighlights: this.generateImpactHighlights()
      };
    } catch (error) {
      console.error('Error fetching Jessica story data:', error);
      return this.getFallbackJessicaStory();
    }
  }

  /**
   * Retourne les achievements statiques de Jessica
   */
  private getStaticJessicaAchievements(): JessicaStoryData['keyAchievements'] {
    return {
      girlsTrained: 500, // 500 filles formées dans l'initiative de Mugerere 2024
      kitsDistributed: 500, // Un kit par fille formée (500 kits distribués)
      yearsImpact: 2, // Depuis 2023
      milesTravel: 300, // Distance parcourue pour atteindre les communautés rurales
      schoolAttendanceRate: 95 // Taux d'assiduité après intervention
    };
  }

  /**
   * Retourne les projets statiques de Jessica
   */
  private getStaticJessicaProjects(): JessicaProject[] {
    return [
      {
        id: 'mugerere-initiative',
        title: 'Breaking Silence, Building Confidence',
        description: 'Through my direct involvement with 500 girls aged 13-15, I\'m transforming menstrual health education from taboo to science-based empowerment in rural Burundi.',
        location: 'Bujumbura & Mugerere, Burundi',
        jessicaRole: 'Lead Educator & Program Director',
        impact: 'Transformation complete - 500 girls now attend school with confidence and dignity',
        status: 'completed',
        coverImage: '/photos/projects/mugerere-2024.jpg',
        progressPct: 100,
        budget: 25000,
        raised: 25000,
        girlsReached: 500,
        category: 'education'
      },
      {
        id: 'kit-distribution',
        title: 'Dignity Delivered Door-to-Door',
        description: 'As community liaison and distribution coordinator, I personally ensure every girl receives not just a kit, but the knowledge and confidence to use it.',
        location: 'Bujumbura & Mugerere, Burundi',
        jessicaRole: 'Community Liaison & Distribution Coordinator',
        impact: 'Major breakthrough - 300 girls reporting improved attendance and self-esteem',
        status: 'active',
        coverImage: '/photos/projects/kit-distribution.jpg',
        progressPct: 85,
        budget: 18000,
        raised: 15300,
        girlsReached: 300,
        category: 'distribution'
      },
      {
        id: 'community-conversations',
        title: 'Heart-to-Heart Conversations',
        description: 'Building on conversations with over 500 families, I\'m working to transform community attitudes and break generational taboos around menstrual health.',
        location: 'Rural Communities, Burundi',
        jessicaRole: 'Community Advocate & Trainer',
        impact: 'Building momentum - 200 families actively engaged in program activities',
        status: 'active',
        coverImage: '/photos/projects/community-meeting.jpg',
        progressPct: 70,
        budget: 12000,
        raised: 8400,
        girlsReached: 200,
        category: 'community'
      }
    ];
  }

  // Méthodes d'adaptation supprimées - utilisation de données statiques pour simplicité

  /**
   * Adapte les articles de blog en histoires Jessica
   */
  private adaptBlogToJessicaStories(blogPosts: BlogPostSummary[]): JessicaBlogStory[] {
    return blogPosts.slice(0, 4).map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.summary,
      coverImage: post.coverImage || '/photos/blog/jessica-story.jpg',
      publishedAt: post.publishedAt,
      readTime: '5 min read',
      category: 'Field Story',
      tags: post.tags,
      jessicaPerspective: this.generateJessicaPerspective()
    }));
  }

  /**
   * Génère une perspective Jessica pour les histoires
   */
  private generateJessicaPerspective(): string {
    const perspectives = [
      "A story from my direct field experience",
      "Lessons learned through personal engagement",
      "Real conversations that changed everything",
      "Moments that strengthened my resolve"
    ];
    
    return perspectives[Math.floor(Math.random() * perspectives.length)];
  }

  /**
   * Retourne les témoignages authentiques des bénéficiaires de Jessica
   */
  private getJessicaTestimonials(): JessicaTestimonial[] {
    return [
      {
        id: 'amina-001',
        name: 'Amina',
        age: 15,
        location: 'Bujumbura, Burundi',
        quote: "Jessica listened when no one else would. Before her program, I missed school every month. Now I sit in the front row and raise my hand with confidence.",
        photo: '/photos/testimonials/amina.jpg',
        relationship: 'student',
        category: 'education',
        date: '2024-01-15',
        impact: 'high',
        featured: true,
        beforeAfter: {
          before: 'Missing 5-7 days of school monthly',
          after: 'Perfect attendance for 8 months running'
        }
      },
      {
        id: 'grace-001',
        name: 'Grace Uwimana',
        age: 42,
        location: 'Rural Burundi',
        quote: "My daughter now walks with her head high. Jessica's training transformed our home conversations and gave my daughter her future back.",
        photo: '/photos/testimonials/grace.jpg',
        relationship: 'parent',
        category: 'empowerment',
        date: '2024-02-10',
        impact: 'high',
        featured: true,
        beforeAfter: {
          before: 'Daughter ashamed and isolated',
          after: 'Confident young woman pursuing education'
        }
      },
      {
        id: 'esperance-001',
        name: 'Esperance',
        age: 28,
        location: 'Mugerere, Burundi',
        quote: "Jessica showed us that dignity is not negotiable. Her approach combines science with compassion, creating lasting change in our community.",
        photo: '/photos/testimonials/esperance.jpg',
        relationship: 'teacher',
        category: 'education',
        date: '2024-01-28',
        impact: 'high',
        featured: false,
        beforeAfter: {
          before: 'Taboo subject causing student dropouts',
          after: 'Open discussions and improved retention'
        }
      }
    ];
  }

  /**
   * Génère les highlights d'impact basés sur les métriques réelles
   */
  private generateImpactHighlights(): JessicaImpactHighlight[] {
    return [
      {
        id: 'attendance-improvement',
        title: 'School Attendance',
        metric: '95%',
        description: 'Girls maintaining regular attendance after receiving kits and training',
        icon: 'graduation-cap',
        trend: 'up',
        category: 'education'
      },
      {
        id: 'confidence-growth',
        title: 'Self-Confidence',
        metric: '500+',
        description: 'Young women reporting increased confidence and classroom participation',
        icon: 'heart',
        trend: 'improving',
        category: 'social'
      },
      {
        id: 'family-savings',
        title: 'Family Impact',
        metric: '$180/year',
        description: 'Average family savings from switching to reusable menstrual products',
        icon: 'dollar-sign',
        trend: 'up',
        category: 'economic'
      },
      {
        id: 'taboo-breaking',
        title: 'Community Change',
        metric: '300 miles',
        description: 'Distance traveled to reach and transform rural communities',
        icon: 'map',
        trend: 'improving',
        category: 'social'
      }
    ];
  }

  /**
   * Récupère le contexte des blogs pour le chat assistant
   */
  async getBlogContextForChat(): Promise<string> {
    try {
      const blogStories = await apiListBlog({ pageSize: 10 });
      
      if (!blogStories || blogStories.length === 0) {
        return this.getFallbackBlogContext();
      }

      const blogContext = blogStories.map(story => 
        `- ${story.title}: ${story.summary} (Tags: ${story.tags.join(', ')})`
      ).join('\n');

      return `Recent blog stories and content:\n${blogContext}\n\nThese are Jessica's personal experiences and insights from her work in menstrual health education and community empowerment in Burundi.`;
    } catch (error) {
      console.error('Error fetching blog context for chat:', error);
      return this.getFallbackBlogContext();
    }
  }

  /**
   * Contexte blog de fallback
   */
  private getFallbackBlogContext(): string {
    return `Recent blog stories and content:
- Breaking Silence, Building Confidence: My journey working directly with 500 girls in rural Burundi, transforming taboos into empowerment
- Dignity Delivered Door-to-Door: Personal insights from distributing menstrual kits and seeing the immediate impact on girls' lives
- Heart-to-Heart Conversations: How community dialogues are changing generational attitudes about menstrual health
- From Taboo to Science: The methodology behind our evidence-based approach to menstrual health education

These stories reflect Jessica's personal experiences and the real impact of her work in menstrual health education and community empowerment.`;
  }

  /**
   * Données de fallback si le backend n'est pas disponible
   */
  private getFallbackJessicaStory(): JessicaStoryData {
    return {
      personalQuote: "Breaking taboos, restoring dignity, one conversation at a time.",
      missionStatement: "My journey began with listening. What started as conversations in Bujumbura has become a movement that proves dignity and education can transform everything.",
      keyAchievements: {
        girlsTrained: 500,
        kitsDistributed: 500,
        yearsImpact: 2,
        milesTravel: 300,
        schoolAttendanceRate: 95
      },
      currentProjects: [
        {
          id: 'mugerere-initiative',
          title: 'Mugerere Dignity Initiative',
          description: 'Through my direct involvement with 500 girls aged 13-15, we\'re transforming menstrual health education from taboo to science-based empowerment.',
          location: 'Mugerere, Burundi',
          jessicaRole: 'Lead Educator & Program Director',
          impact: 'Transformation complete - 500 girls now attend school with confidence and dignity',
          status: 'completed',
          coverImage: '/photos/projects/mugerere-2024.jpg',
          progressPct: 100,
          budget: 25000,
          raised: 25000,
          girlsReached: 500,
          category: 'education'
        }
      ],
      recentStories: [
        {
          id: 'why-dignity-engineering-matters',
          slug: 'why-dignity-engineering-matters',
          title: 'Why dignity engineering matters in MHM',
          excerpt: 'Exploring innovative approaches to bring digital literacy to underserved populations through menstrual health management.',
          coverImage: '/photos/blog/jessica-story-1.jpg',
          publishedAt: '2024-12-10',
          readTime: '7 min read',
          category: 'insights',
          tags: ['innovation', 'engineering', 'mhm'],
          jessicaPerspective: 'A story from my direct field experience'
        },
        {
          id: 'coops-women-led-production',
          slug: 'coops-women-led-production',
          title: 'Co-ops at the center: women-led production',
          excerpt: 'How local women cooperatives are transforming menstrual health kit production in rural Burundi.',
          coverImage: '/photos/blog/jessica-story-2.jpg',
          publishedAt: '2024-12-05',
          readTime: '10 min read',
          category: 'research',
          tags: ['cooperatives', 'women', 'production'],
          jessicaPerspective: 'Lessons learned through personal engagement'
        },
        {
          id: 'training-day-mhm-basics',
          slug: 'training-day-mhm-basics',
          title: 'Training day: MHM basics that stick',
          excerpt: 'Breaking taboos through education: how we make menstrual health conversations approachable and lasting.',
          coverImage: '/photos/blog/jessica-story-3.jpg',
          publishedAt: '2024-11-28',
          readTime: '8 min read',
          category: 'insights',
          tags: ['training', 'education', 'taboos'],
          jessicaPerspective: 'Real conversations that changed everything'
        }
      ],
      testimonials: this.getJessicaTestimonials(),
      impactHighlights: this.generateImpactHighlights()
    };
  }
}

// Export instance singleton
export const jessicaDataService = new JessicaDataService();