# Real Photos & Vector Illustrations Integration

Add real, consent-verified, properly licensed photos before production. Vector SVGs act as fallback if photos missing.

## Folder Structure
public/
  photos/                # Real photos (JPG/WEBP)
  illustrations/         # Generated SVG fallbacks
    hero_illustration.svg
    amina.svg / grace.svg / esperance.svg
    project_water.svg / project_literacy.svg
    session_mhm.svg / production_kits.svg / distribution.svg / kit_flat.svg

## Manifest Files
`src/data/imageManifest.ts` exposes:
- `resolveRealImage(key, fallback)`
- `resolveVector(key, fallback)`
- Arrays `realImages`, `vectorImages`

Keys example:
- hero_main (photo) / vector_hero (svg)
- story_amima / vector_story_amina
- project_water / vector_project_water

Usage pattern (pseudo):
```tsx
<ImageWithFallback src={resolveRealImage('project_water', resolveVector('vector_project_water'))} alt="..." />
```

## Naming Convention (photos)
subject-region-purpose_version.ext
Example: woman-kenya-distribution_v1.jpg

## Requirements (Photos)
1. Consent & guardian approval if minor.
2. Valid license (prefer owned content).
3. Avoid sensitive health/location metadata.
4. Optimize ≤ 180KB (1600px max width).
5. Strip EXIF metadata.

## Vector Fallback Philosophy
- Neutral, dignified, minimal facial detail.
- Brand palette only (rose gradient + neutrals).
- Non-stigmatizing representation of menstrual health.

## Adding Photos
1. Place optimized file in `public/photos` matching key.
2. Reload app: real photo automatically replaces vector fallback.
3. Confirm alt text neutrality.

## Alt Text Guidelines
- Describe context + action (no judgment).
- Avoid specifying emotion unless clearly shown.
- Avoid medical/private info.

## Optimization Tips
- WebP: `cwebp -q 80 input.jpg -o output.webp`
- Strip EXIF: `exiftool -all= file.jpg`
- Compress: `jpegoptim --strip-all --max=80 file.jpg`

## Checklist Before Go-Live
[ ] Required hero & testimonial photos present
[ ] All alt text reviewed (EN/FR future)
[ ] Performance (LCP image < 200KB) OK
[ ] Consent docs archived securely
[ ] Attribution file updated if external sources

## Future Enhancements
- Blurhash / LQIP generation script
- CMS upload + automated optimization
- i18n alt text resources

## Mapping des images du dossier Context/images
Copie depuis `Context/images` vers `public/photos` en renommant:

| Fichier source (Context/images) | Utilisation suggérée | Nom cible |
|---------------------------------|-----------------------|-----------|
| portrait-de-femme-afro-americaine-triste.jpg | (Éviter si expression négative) Hero alternatif si posture neutre | hero_main.jpg |
| photo-d-une-femme-afro-americaine-ravie-tient-un-tampon-et-une-serviette-hygienique-vetue-d-un-t-shirt-blanc-isole-sur-un-mur-rose-femmes-pms.jpg | Témoignage positif (sourire) | story_grace.jpg |
| tir-isole-de-l-heureuse-jeune-femme-afro-tient-un-tampon-de-coton-menstuation-et-une-serviette-hygienique.jpg | Témoignage (Amina) | story_amima.jpg |
| jeune-adulte-deprime-a-la-maison.jpg | (Éviter: connotation négative) — | — |
| jeune-adulte-deprime-a-la-maison (1).jpg | (Éviter) — | — |
| une-femme-europeenne-heureuse-choisit-entre-un-tampon-et-une-serviette-hygienique-...jpg | Diversité (Esperance) | story_esperance.jpg |
| variete-de-l-hygiene-menstruelle-feminine-vue-de-dessus.jpg | Kit flat lay produit | project_literacy.jpg ou product_kit_flat.jpg |

Conseils: privilégier expressions positives / dignes, éviter images montrant la douleur ou détresse (stigmatisation). Remplacer plus tard par photos terrain réelles.
