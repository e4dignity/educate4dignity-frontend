// Central pool of course / project / blog illustrative images.
// Any new file dropped into /public/photos/course can be added here manually
// OR (future) discovered dynamically via an endpoint / manifest.
// Using explicit list keeps Vite static asset hashing predictable at build.

export const COURSE_IMAGE_PATHS: string[] = [
  '/photos/course/48e1c9d3-6c82-469f-9b0a-f4fd7875090c (1).jpg',
  '/photos/course/92038f75-aeef-42a1-a6f0-a4a014771f14.png',
  '/photos/course/Generated Image October 02, 2025 - 9_11AM.png',
  '/photos/course/Generated Image October 02, 2025 - 9_21AM.png',
  '/photos/course/Generated Image October 03, 2025 - 9_00AM.png',
  '/photos/course/Generated Image October 03, 2025 - 9_04AM (1).png',
  '/photos/course/Generated Image October 03, 2025 - 9_15AM.png',
  '/photos/course/variete-de-l-hygiene-menstruelle-feminine-vue-de-dessus.jpg'
];

// Deterministic helper so same record keeps same image across renders.
export function pickCourseImage(seedIndex: number): string {
  if (COURSE_IMAGE_PATHS.length === 0) return '';
  return COURSE_IMAGE_PATHS[seedIndex % COURSE_IMAGE_PATHS.length];
}
