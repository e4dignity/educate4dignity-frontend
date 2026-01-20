// Central image pools for public sections (projects, blog, e-learning)
// Add new files into /public/photos/course then append here; consumers map by index % length.

export const courseImages = [
  '/photos/course/48e1c9d3-6c82-469f-9b0a-f4fd7875090c (1).jpg',
  '/photos/course/92038f75-aeef-42a1-a6f0-a4a014771f14.png',
  '/photos/course/Generated Image October 02, 2025 - 9_11AM.png',
  '/photos/course/Generated Image October 02, 2025 - 9_21AM.png',
  '/photos/course/Generated Image October 03, 2025 - 9_00AM.png',
  '/photos/course/Generated Image October 03, 2025 - 9_04AM (1).png',
  '/photos/course/Generated Image October 03, 2025 - 9_15AM.png',
  '/photos/course/variete-de-l-hygiene-menstruelle-feminine-vue-de-dessus.jpg'
];

export function imageForIndex(i: number) {
  if (courseImages.length === 0) return '';
  return courseImages[i % courseImages.length];
}

// Accessible alt text generator so we keep wording consistent across sections.
// kind examples: 'blog', 'lesson', 'project'
export function courseImageAlt(kind: string, title: string) {
  const prefix = kind ? `${kind.charAt(0).toUpperCase()+kind.slice(1)} cover` : 'Cover image';
  return `${prefix}: ${title}`;
}
