// Manifest of real photo placeholders. Replace files in /public/photos with real, licensed, consent-verified images.
// Naming convention: subject-region-purpose_version.ext
// Example: woman-kenya-training_v1.jpg

export interface RealImageRef {
  key: string;
  path: string; // relative to public
  alt: string;
  required?: boolean;
  notes?: string;
}
export interface VectorImageRef { key: string; path: string; alt: string; notes?: string; }

export const realImages: RealImageRef[] = [
  { key: 'hero_main', path: '/photos/hero_main.jpg', alt: 'Young woman student smiling after receiving reusable kit', required: true, notes: 'Primary landing hero image' },
  { key: 'story_amima', path: '/photos/story_amima.jpg', alt: 'Amina from Burundi smiling at school', notes: 'Testimonial Amina' },
  { key: 'story_grace', path: '/photos/story_grace.jpg', alt: 'Grace from Rwanda showing confidence in classroom', notes: 'Testimonial Grace' },
  { key: 'story_esperance', path: '/photos/story_esperance.jpg', alt: 'Esperance from DRC standing outside school', notes: 'Testimonial Esperance' },
  { key: 'project_water', path: '/photos/project_water.jpg', alt: 'Community gathering near new water access point', notes: 'Project Clean Water cover' },
  { key: 'project_literacy', path: '/photos/project_literacy.jpg', alt: 'Students using tablets in digital literacy session', notes: 'Project Literacy cover' }
];

export const vectorImages: VectorImageRef[] = [
  { key: 'vector_hero', path: '/illustrations/hero_illustration.svg', alt: 'Stylized young woman student with educational materials', notes: 'Fallback hero illustration' },
  { key: 'vector_story_amina', path: '/illustrations/amina.svg', alt: 'Stylized portrait of Amina smiling', notes: 'Fallback testimonial Amina' },
  { key: 'vector_story_grace', path: '/illustrations/grace.svg', alt: 'Stylized portrait of Grace confident', notes: 'Fallback testimonial Grace' },
  { key: 'vector_story_esperance', path: '/illustrations/esperance.svg', alt: 'Stylized portrait of Esperance dignified', notes: 'Fallback testimonial Esperance' },
  { key: 'vector_project_water', path: '/illustrations/project_water.svg', alt: 'Illustration water project women at access point', notes: 'Water project card' },
  { key: 'vector_project_literacy', path: '/illustrations/project_literacy.svg', alt: 'Illustration digital literacy training tablets', notes: 'Literacy project card' },
  { key: 'vector_session_mhm', path: '/illustrations/session_mhm.svg', alt: 'Illustration menstrual health education session', notes: 'Education session' },
  { key: 'vector_production_kits', path: '/illustrations/production_kits.svg', alt: 'Illustration cooperative producing reusable kits', notes: 'Production cooperative' },
  { key: 'vector_distribution', path: '/illustrations/distribution.svg', alt: 'Illustration distribution of kits by cooperative', notes: 'Distribution phase' },
  { key: 'vector_kit_flat', path: '/illustrations/kit_flat.svg', alt: 'Illustration reusable menstrual kit flat lay', notes: 'Kit flat lay' }
];

export function resolveRealImage(key: string, fallback?: string) {
  const found = realImages.find(r => r.key === key);
  return found ? found.path : (fallback || '/images/placeholder-generic.svg');
}

export function resolveVector(key: string, fallback?: string) {
  const found = vectorImages.find(v => v.key === key);
  return found ? found.path : (fallback || '/images/placeholder-generic.svg');
}
