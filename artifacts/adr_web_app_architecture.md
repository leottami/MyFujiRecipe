# ADR: Fuji Recipe Hub Web Application Architecture

**Date**: April 7, 2026
**Status**: Proposed
**Deciders**: Principal Architect
**Context**: First web app implementation from Stitch designs + scraped recipe data

---

## Context

Fuji Recipe Hub has:
- A PR-FAQ defining the product vision (read-only gallery MVP, user creation post-MVP)
- 5 Stitch screen designs with a complete "Tactile Archive" design system
- 179 scraped Fujifilm recipes in JSON format (X-Trans IV sensor)
- No web application code yet

We need to define the architecture for the MVP web application that can evolve toward the full vision described in the PR-FAQ.

---

## Decisions

### 1. Application Pattern: Client-Side SPA

**Choice**: React 19 + React Router v7 + Vite (pure SPA, no SSR)

| Option | Pros | Cons |
|--------|------|------|
| **Pure SPA (chosen)** | Simple, fast to build, aligns with tech strategy, GitHub Pages hosting | No SSR/SEO |
| Next.js / SSR framework | SEO, server components | Needs dynamic hosting (Railway), overkill for MVP |
| Vite SSR plugin | SEO + static hosting | Experimental, added complexity |

**Rationale**: The PR-FAQ targets SEO at 6 months, not launch. "Launch lean" means shipping the gallery fast. SPA on GitHub Pages is the simplest path. Migration to SSR is straightforward when needed.

**Router**: HashRouter for GitHub Pages compatibility (no 404.html hacks).

### 2. Routing Structure

```
/                      -> FeedPage (Recipe Gallery)
/recipe/:id            -> RecipeDetailPage (Hero + Metadata)
/photographer/:id      -> PhotographerProfilePage (post-MVP, scaffold)
/create                -> RecipeCreatorPage (post-MVP, scaffold)
```

Maps directly to 5 Stitch screens:
- Feed (Mobile) + Desktop Feed -> FeedPage (responsive)
- Recipe Details (Mobile) -> RecipeDetailPage
- Photographer Profile (Mobile) -> PhotographerProfilePage
- Recipe Creator (Mobile) -> RecipeCreatorPage

### 3. Data Layer: Static JSON Fetched at Runtime

**Choice**: Place `recipes.json` in `public/data/`, fetch at runtime.

| Option | Pros | Cons |
|--------|------|------|
| Build-time import | Zero latency, offline | Bundled in JS (~90KB), rebuild for data changes |
| **Runtime fetch (chosen)** | Data updates without rebuild, smaller JS bundle | Loading state needed |
| API backend | Dynamic queries, auth | Massive overkill for MVP |

**Rationale**: Runtime fetch keeps the JS bundle lean and allows re-scraping data without rebuilding the app. The fetch abstraction layer makes it trivial to swap in an API endpoint later.

**Data abstraction**:
```typescript
// Today: fetches static JSON
// Tomorrow: calls API endpoint — same interface
async function loadRecipes(): Promise<Recipe[]>
async function loadRecipe(id: string): Promise<Recipe | null>
```

### 4. TypeScript Data Model

Derived from the scraped JSON structure:

```typescript
interface Recipe {
  id: string;                      // Generated slug (e.g., "kodachrome-64")
  name: string;                    // "Kodachrome 64"
  url: string;                     // Source attribution URL
  sensor: string;                  // "X-Trans IV"
  publishedDate: string;           // Original publish date
  thumbnailUrl: string;            // Hero image URL
  filmSimulation: string;          // "Classic Chrome"
  dynamicRange: string;            // "DR200"
  highlight: string;               // "+0.5"
  shadow: string;                  // "-2"
  color: string;                   // "+2"
  noiseReduction: string;          // "-4"
  sharpening: string;              // "+1"
  clarity: string;                 // "+3"
  grainEffect: string;             // "Weak, Small"
  colorChromeEffect: string;       // "Strong"
  colorChromeEffectBlue: string;   // "Weak"
  whiteBalance: string;            // "Daylight, +2 Red & -5 Blue"
  iso: string;                     // "Auto, up to ISO 6400"
  exposureCompensation: string;    // "0 to +2/3"
  extraSettings: Record<string, string>;
}
```

**Note**: The scraper output uses `snake_case` keys. A build-time transform script will convert to `camelCase` and generate stable `id` slugs.

### 5. Image Strategy: External URLs + Fallback

**Choice**: Use scraped external URLs with lazy loading and graceful fallback.

| Option | Pros | Cons |
|--------|------|------|
| **External URLs + fallback (chosen)** | Zero storage, immediate | Fragile, CORS risk |
| Self-hosted images | Reliable, fast | Copyright concerns, storage needed |

**Implementation**:
- `loading="lazy"` on all `<img>` elements
- Explicit `width`/`height` attributes to prevent layout shift
- `object-fit: cover` for consistent card presentation
- `onError` handler swaps to a branded gradient placeholder
- Post-MVP: self-hosted images when users upload their own

### 6. Component Architecture

```
src/
  components/
    layout/              # AppShell, NavBar (glassmorphism)
    ui/                  # MetadataChip, GradientButton, SearchInput
    recipe/              # RecipeCard, RecipeMetadata, HeroImage
    feed/                # FeedGrid, FilterBar
  pages/                 # FeedPage, RecipeDetailPage
  hooks/                 # useRecipes, useFilters
  data/                  # types.ts, recipeLoader.ts
  lib/                   # slugify, image fallback utilities
```

**Separation principle**:
- `ui/` = design system primitives (reusable, stateless, Stitch token-aware)
- `recipe/` = domain components (recipe-specific, compose `ui/` primitives)
- `pages/` = route-level components (compose domain + layout components)
- `hooks/` = data fetching and filter state logic

### 7. State Management: React Built-ins Only

**Choice**: `useState` + `useContext` + URL search params. No Redux/Zustand/Jotai.

**Rationale**: MVP has two pieces of state:
1. **Recipes list** (loaded once, read-only) -> `useRecipes()` hook with fetch
2. **Filter/search state** (film simulation, search query) -> URL search params for shareable URLs

No global state library justified until user auth or real-time features arrive.

### 8. Design System: Tailwind CSS with Stitch Tokens

**Choice**: Custom `tailwind.config.ts` mapping all Stitch design tokens.

**Tokens to configure**:
- Colors: Exact hex values from Stitch (background, primary, secondary, tertiary, surface layers, outline)
- Typography: Manrope (headlines) + Inter (body/labels) via Google Fonts
- Spacing: 4px base scale
- Border radius: `none` / `sm` (0.125rem) / `md` (0.25rem) / `lg` (0.5rem) only
- Shadows: Ambient shadows tinted with `on-surface` at 6% opacity

**Mandatory design rules** (enforced via code review):
- NO `rounded-xl` or `rounded-full`
- NO `border` without `/15` opacity modifier
- Photos own 60%+ of card real estate
- Asymmetric grid offsets on gallery layout

### 9. Hosting & CI/CD

**Choice**: GitHub Pages (static tier per tech strategy)

**Pipeline** (GitHub Actions):
```
push to feature branch
  -> Biome lint + format check
  -> TypeScript type check
  -> Vitest tests
  -> Vite build
  -> (on main merge) Deploy to GitHub Pages
```

### 10. Pagination Strategy

**Choice**: Infinite scroll with intersection observer, 20 recipes per batch.

**Rationale**: 179 recipes is manageable but rendering all at once hurts performance with external image loading. Batched loading of 20 cards at a time provides fast initial render and progressive discovery.

---

## Migration Path (Post-MVP)

When the project needs dynamic features (auth, recipe creation, image uploads):

| Phase | Change | Hosting |
|-------|--------|---------|
| MVP (now) | Static SPA + JSON | GitHub Pages |
| Auth + Creation | Add Hono API backend | Railway (Agile tier) |
| Image Uploads | Add S3 object storage | AWS |
| Database | PostgreSQL for recipes + users | Railway / AWS RDS |
| SEO | Add Vite SSR or migrate to framework | Railway |

The key design principle: **the data layer is a thin abstraction**. `recipeLoader.ts` exports `loadRecipes()` and `loadRecipe(id)`. Today they fetch JSON. Tomorrow they call an API. Components never know the difference.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| External images unavailable | Medium | Fallback placeholders, plan self-hosting post-MVP |
| No SEO for recipe discovery | Accepted | MVP target is community sharing, not organic search |
| Design token drift from Stitch | Medium | Single source in tailwind.config.ts, sync checklist |
| No auth = no user content | Accepted | MVP is curated gallery with scraped data |
| Bundle size growth | Low | Runtime JSON fetch, paginated rendering |

---

## Implementation Phases

For handoff to `/builder` or `/swarm-execute`:

| Phase | Scope | Depends On |
|-------|-------|------------|
| 1 | Project scaffold (Vite + React 19 + Tailwind + Biome + Vitest + pnpm) | - |
| 2 | Design system foundation (tailwind.config.ts with Stitch tokens, base UI components) | Phase 1 |
| 3 | Data layer (types.ts, recipeLoader.ts, transform script for scraped JSON) | Phase 1 |
| 4 | Recipe Feed page (asymmetric gallery grid, RecipeCard, FilterBar) | Phase 2, 3 |
| 5 | Recipe Detail page (HeroImage, RecipeMetadata, navigation) | Phase 2, 3 |
| 6 | Responsive desktop layout (multi-column feed) | Phase 4 |
| 7 | Search and filtering (film simulation, text search) | Phase 4 |
| 8 | CI/CD pipeline (GitHub Actions -> GitHub Pages) | Phase 1 |

---

## References

- [PR-FAQ](../artifacts/pr_faq_fuji_recipes.md) — Product vision and scope
- [Stitch Design Tokens](../.claude/skills/design/stitch-integration/resources/fuji-recipe-hub.md) — Complete design system reference
- [Scraped Recipes](../tools/scraper/fuji_recipes_xtrans4.json) — 179 recipes, X-Trans IV
- Tech Strategy: `.claude/rules/tech-strategy.md`
