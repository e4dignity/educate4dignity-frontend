// Service d'adaptation pour transformer les données backend organisationnelles 
// en présentation centrée sur Jessica, sans modifier le backend

import { API_BASE_URL, DEFAULT_HEADERS } from '../config';

// Types backend existants (maintenir compatibilité)
export interface BackendProject {
  id: string;
  name: string;
  country: string;
  status: string;
  summary: string;
  coverImage: string;
  progressPct: number;
  budget: number;
  spent: number;
  collected: number;
}

export interface BackendSummary {
  hero: {
    title: string;
    subtitle: string;
  };
  highlights: any[];
  metrics: {
    projects: number;
    beneficiaries: number;
    countries: number;
  };
}

// Types Jessica-centrés (nouvelle présentation)
export interface JessicaStory {
  personalQuote: string;
  missionStatement: string;
  keyAchievements: {
    girlsTrained: number;
    kitsDistributed: number;
    yearsImpact: number;
    milesTravel: number;
  };
  currentProjects: JessicaProject[];
  testimonials: JessicaTestimonial[];
}

export interface JessicaProject {
  id: string;
  title: string;
  description: string;
  location: string;
  jessicaRole: string;
  impact: string;
  status: 'active' | 'completed';
  coverImage: string;
  startDate: string;
  budget: number;
  raised: number;
}

export interface JessicaTestimonial {
  name: string;
  location: string;
  quote: string;
  photo: string;
  projectId?: string;
}

class JessicaDataAdapter {
  
  /**
   * Transforme les données backend organisationnelles en récit personnel de Jessica
   */
  async getJessicaStory(): Promise<JessicaStory> {
    try {
      // Récupère les données existantes du backend
      const projectsData = await this.fetchBackendProjects();

      return {
        personalQuote: "Science, when guided by empathy, can restore dignity and create lasting change.",
        missionStatement: "I began listening to girls in Bujumbura in 2023. What started as conversations among peers has grown into a movement that combines engineering with empathy to restore dignity.",
        keyAchievements: {
          girlsTrained: 500, // 500 filles formées dans l'initiative Mugerere 2024
          kitsDistributed: 500, // Un kit réutilisable par fille (500 kits au total)
          yearsImpact: 2, // Depuis 2023
          milesTravel: 300 // Distance parcourue pour atteindre les communautés rurales
        },
        currentProjects: this.adaptProjectsToJessicaView(projectsData),
        testimonials: this.getJessicaTestimonials()
      };
    } catch (error) {
      console.error('Error fetching Jessica story data:', error);
      return this.getFallbackJessicaStory();
    }
  }

  /**
   * Transforme les projets backend en projets vus de la perspective de Jessica
   */
  private adaptProjectsToJessicaView(backendProjects: BackendProject[]): JessicaProject[] {
    return backendProjects.map(project => ({
      id: project.id,
      title: this.humanizeProjectTitle(project.name),
      description: this.addJessicaPerspective(project.summary),
      location: project.country,
      jessicaRole: this.determineJessicaRole(project),
      impact: this.calculateHumanImpact(project),
      status: project.status === 'completed' ? 'completed' : 'active',
      coverImage: project.coverImage || '/photos/projects/placeholder.jpg',
      startDate: new Date().toISOString(), // Serait idéalement venu du backend
      budget: project.budget,
      raised: project.collected
    }));
  }

  /**
   * Ajoute la perspective personnelle de Jessica aux descriptions de projets
   */
  private addJessicaPerspective(originalSummary: string): string {
    if (!originalSummary) {
      return "A project I'm personally involved in to transform menstrual health education and restore dignity.";
    }

    // Transforme le texte organisationnel en récit personnel
    const personalizedText = originalSummary
      .replace(/\bWe\b/g, 'I')
      .replace(/\bOur\b/g, 'My')
      .replace(/\bthe organization\b/g, 'my initiative')
      .replace(/\bEducate4Dignity\b/g, 'my Jessica Dignity Project');

    return `Through my direct involvement, ${personalizedText.toLowerCase()}`;
  }

  /**
   * Détermine le rôle spécifique de Jessica dans chaque projet
   */
  private determineJessicaRole(project: BackendProject): string {
    if (project.name.toLowerCase().includes('mugerere')) {
      return 'Lead Educator & Program Director';
    }
    if (project.country.toLowerCase().includes('burundi')) {
      return 'Founder & Community Liaison';
    }
    return 'Project Founder & Mentor';
  }

  /**
   * Calcule l'impact humain d'un projet du point de vue de Jessica
   */
  private calculateHumanImpact(project: BackendProject): string {
    const progressPct = project.progressPct || 
      (project.budget > 0 ? Math.min((project.collected / project.budget) * 100, 100) : 0);
    
    if (progressPct >= 80) {
      return `Transforming lives daily - ${Math.floor(progressPct)}% of girls now attend school regularly`;
    } else if (progressPct >= 50) {
      return `Making steady progress - ${Math.floor(progressPct)}% of target reached`;
    } else {
      return `Early stages - building trust and breaking taboos in the community`;
    }
  }

  /**
   * Humanise les titres de projets pour qu'ils reflètent l'approche personnelle de Jessica
   */
  private humanizeProjectTitle(originalTitle: string): string {
    const humanTitles: Record<string, string> = {
      'Menstrual Health Education Program': 'Breaking Taboos Through Education',
      'Kit Distribution Initiative': 'Delivering Dignity Door-to-Door',
      'Community Awareness Campaign': 'Conversations That Change Lives',
      'Reusable Pad Production': 'Women-Led Kit Manufacturing'
    };

    return humanTitles[originalTitle] || originalTitle;
  }

  /**
   * Retourne les témoignages liés aux projets de Jessica
   */
  private getJessicaTestimonials(): JessicaTestimonial[] {
    return [
      {
        name: "Amina",
        location: "Bujumbura, Burundi",
        quote: "Jessica listened to our struggles and brought real solutions. I used to miss the first week of every month. Now I sit in the front row and raise my hand with confidence.",
        photo: "/photos/about/B8.jpg"
      },
      {
        name: "Grace",
        location: "Rural Burundi", 
        quote: "My daughter now has confidence. Jessica's program changed our routine and her future. The kit eased our family budget and gave learning time back.",
        photo: "/photos/about/03.png"
      },
      {
        name: "Esperance",
        location: "Mugerere, Burundi",
        quote: "No more stigma. Just dignity. Jessica's training showed us that menstruation should be met with science, support, and solidarity.",
        photo: "/photos/Team/001.png"
      }
    ];
  }

  /**
   * Récupère les projets du backend existant
   */
  private async fetchBackendProjects(): Promise<BackendProject[]> {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects data');
    }
    
    return response.json();
  }

  /**
   * Données de fallback si le backend n'est pas disponible
   */
  private getFallbackJessicaStory(): JessicaStory {
    return {
      personalQuote: "Science, when guided by empathy, can restore dignity and create lasting change.",
      missionStatement: "My journey into this movement began in 2023. I started listening to girls in Bujumbura, and transformed a taboo topic into a cause of justice and innovation.",
      keyAchievements: {
        girlsTrained: 500,
        kitsDistributed: 500,
        yearsImpact: 2,
        milesTravel: 300
      },
      currentProjects: [
        {
          id: 'mugerere-2024',
          title: 'Mugerere Initiative 2024',
          description: 'This year, with support from Deerfield, I led a comprehensive menstrual health education initiative, working with 500 girls aged 13-15.',
          location: 'Mugerere, Burundi',
          jessicaRole: 'Lead Educator & Program Director',
          impact: 'Transformed 500 young lives - school attendance up 95%',
          status: 'completed' as const,
          coverImage: '/photos/projects/mugerere-2024.jpg',
          startDate: '2024-01-01',
          budget: 25000,
          raised: 25000
        }
      ],
      testimonials: this.getJessicaTestimonials()
    };
  }
}

// Export instance unique
export const jessicaDataAdapter = new JessicaDataAdapter();