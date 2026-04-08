# Roadmap: Fuji Recipe Hub MVP

**Date**: April 7, 2026
**Status**: Active

---

## Completed

### Phase 1: Core Gallery (Done)
- Project scaffold (Vite + React 19 + Tailwind + Biome + TypeScript)
- Design system with Stitch tokens (Tactile Archive)
- Recipe Feed page (asymmetric grid, infinite scroll, film sim filter, search)
- Recipe Detail page (hero image, technical metadata, source attribution)
- Responsive layout (mobile 2-col, desktop 3-4 col)
- 179 recipes from FujiX Weekly scraper
- Data abstraction layer (swappable JSON -> API)

---

## In Progress

### Phase 2: MVP Polish (plan_mvp_polish.md)
- Data quality fixes (dates, film sim names, null handling)
- Camera body/sensor filter
- Desktop 5-column layout at ultra-wide
- Design compliance fixes (tonal layering, dead code removal)
- Visual QA

---

## Planned

### Phase 3: Photographer Profiles (3-5 days)
**Stitch Screen**: Photographer Profile (Mobile) - 780x3574px
**Route**: `/photographer/:id`

**Scope**:
- Extend Recipe type with photographer metadata (name, bio, gear, links)
- Extract photographer data from recipe source URLs
- PhotographerProfilePage with header + recipe gallery
- Link from RecipeDetailPage -> photographer profile
- Photographer directory/list on feed page

**Data model change**:
```typescript
interface Photographer {
  id: string;
  name: string;
  bio: string;
  gear: string[];
  portfolioUrl: string;
}
// Recipe.photographer: Photographer
```

**Depends on**: Phase 2 (clean data)

### Phase 4: Recipe Creator (5-7 days)
**Stitch Screen**: Recipe Creator (Mobile) - 780x6914px
**Route**: `/create`

**Scope**:
- Multi-section form with "manual camera control" UX
- Image upload with preview
- Film simulation selector dropdown
- Technical settings grid (18+ fields) with dial-style inputs
- Exposure slider (aperture ring aesthetic)
- Context notes textarea
- MVP: Save to localStorage (no backend)
- Future: API submission when backend exists

**Components needed** (7 new):
- RecipeCreatorPage, RecipeCreatorForm, ImageUploadField
- FilmSimulationSelector, SettingsGrid, TechnicalSettingInput
- ExposureSlider

**Depends on**: Phase 2 (design system validated)

### Phase 5: Backend & Auth
**Scope**:
- Hono API backend on Railway
- PostgreSQL database for recipes + users
- Simple email/social auth
- Recipe CRUD API
- Image upload to S3

**Depends on**: Phase 4 (form ready to submit)

### Phase 6: Enhanced Discovery
**Scope**:
- Full-text search across all recipe fields
- Sort options (newest, name, popularity)
- Mood/tag taxonomy
- Related recipes on detail page
- SEO (SSR or static pre-rendering)

**Depends on**: Phase 5 (backend for dynamic queries)

---

## Success Metrics (from PR-FAQ)

| Timeframe | Target |
|-----------|--------|
| 3 months | 100 active photographers, 500 curated recipes |
| 6 months | 1,000 photographers, organic search traffic |
| 12 months | Canonical platform for Fujifilm recipes |
