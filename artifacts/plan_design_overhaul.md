# Plan: Design Overhaul — Match Stitch Screens

**Date**: April 7, 2026
**Status**: Ready for execution
**Scope**: Medium feature (3-5 days)
**Context**: Current UI is a generic gallery. Stitch designs show an editorial magazine ("TACTILE ARCHIVE"). Full visual component rewrite needed.

---

## Problem

The current implementation diverges significantly from the Stitch screen designs:

| Element | Stitch Design | Current Implementation |
|---------|--------------|----------------------|
| Brand | "TACTILE ARCHIVE" / "THE ARCHIVE" | "Fuji Recipe Hub" |
| Desktop layout | Sidebar + main content | Centered grid, no sidebar |
| Top nav | BROWSE / GALLERY / TECHNICAL JOURNAL tabs | Single "Gallery" link |
| Mobile header | Hamburger + "THE ARCHIVE" + icons | None (bottom nav only) |
| Mobile bottom nav | Feed / Search / Create / Profile | Single "Gallery" icon |
| Hero section | Editorial headline + "LATEST ENTRIES" | Plain "Recipe Gallery" h1 |
| Filter system | Desktop: sidebar film stocks. Mobile: mood tabs | Horizontal film sim chips |
| Recipe cards | Overlay code label + title + @username + inline specs | Image + title + chip |
| Grid layout | Editorial grid (minmax 400px), 48px gap, 64px offset | Simple CSS grid |
| Visual effects | Film grain overlay texture | None |
| Detail page | Hero + description + actions + exhibition gallery | Hero + metadata only |

---

## What Stays (data layer + routing)

- `src/data/types.ts` — Recipe interface
- `src/data/recipeLoader.ts` — JSON loader
- `src/hooks/useRecipes.ts` — Data hook
- `src/hooks/useFilters.ts` — Filter logic (extend)
- `src/App.tsx` — Route definitions
- `src/main.tsx` — Entry point
- `src/app.css` — Design tokens (extend with grain overlay)
- `public/data/recipes.json` — Recipe data

---

## Phase A: Layout Shell (Sequential — everything nests inside)

### A1: Rewrite AppShell
**File**: `src/components/layout/AppShell.tsx`

Desktop layout:
```
┌────────────────────────────────────────────────┐
│  TopNav: TACTILE ARCHIVE | Browse Gallery Tech │
├──────────┬─────────────────────────────────────┤
│ Sidebar  │  Main Content Area                  │
│ Film     │                                     │
│ Stocks   │                                     │
│ ───────  │                                     │
│ Calibrate│                                     │
│ Support  │                                     │
│ Archive  │                                     │
└──────────┴─────────────────────────────────────┘
```

Mobile layout:
```
┌──────────────────────┐
│ MobileHeader         │
│ ☰  THE ARCHIVE  ⚙ 🔍 │
├──────────────────────┤
│ Content Area         │
│                      │
├──────────────────────┤
│ BottomNav            │
│ Feed Search + Profile│
└──────────────────────┘
```

### A2: Create Sidebar
**File**: `src/components/layout/Sidebar.tsx` (NEW)

- "FILM STOCKS" section header + "TECHNICAL SELECTOR" subtitle
- Vertical list of film simulations with icons (Classic Chrome, Pro Neg. Hi, Velvia, Eterna, Acros, Classic Neg)
- Active state: left border accent + bold text
- Divider
- "CALIBRATE SENSOR" button
- "SUPPORT" / "ARCHIVE" links
- Only visible on desktop (`hidden lg:flex flex-col`)

### A3: Rewrite Desktop TopNav
**File**: `src/components/layout/NavBar.tsx`

- Left: "TACTILE ARCHIVE" brand (Manrope, uppercase, tracking-widest)
- Center: "BROWSE" / "GALLERY" / "TECHNICAL JOURNAL" tab links (active = tertiary/red color)
- Right: Search input + "NEW RECIPE" button + settings icon
- Glassmorphism background
- Only visible on desktop (`hidden lg:flex`)

### A4: Create MobileHeader
**File**: `src/components/layout/MobileHeader.tsx` (NEW)

- Left: Hamburger menu icon
- Center: "THE ARCHIVE" (Manrope, uppercase, tracking)
- Right: Settings icon + Search icon
- Fixed top, glassmorphism
- Only visible on mobile (`lg:hidden`)

### A5: Rewrite BottomNav
**File**: `src/components/layout/BottomNav.tsx` (NEW, replace NavBar mobile section)

- 4 items: Feed (grid icon) / Search (magnifier) / Create (+ icon) / Profile (person)
- Each: icon + uppercase label
- Active state: primary color
- Fixed bottom, glassmorphism
- Only visible on mobile (`lg:hidden`)

---

## Phase B: Feed Page Redesign

### B1: Create HeroSection
**File**: `src/components/feed/HeroSection.tsx` (NEW)

- "LATEST ENTRIES" label (uppercase, tracking-widest, tertiary red dot accent)
- Large editorial headline: recipe-themed rotating text (e.g., "THE ANALOG REVIVAL: CHROMATIC CALIBRATION")
- Descriptive subtext about the archive
- Only shows at top of feed, can be hidden on scroll or when filtering

### B2: Rewrite RecipeCard
**File**: `src/components/recipe/RecipeCard.tsx`

Structure:
```
┌─────────────────────────┐
│                          │
│    [HERO IMAGE]          │
│         ┌──────────┐    │
│         │ CODE LBL │    │
│         └──────────┘    │
│                          │
├──────────────────────────┤
│ Recipe Title             │
│ BY @PHOTOGRAPHER         │
│                          │
│ ISO 400  DR 200%  SIM CC │
└──────────────────────────┘
```

- Full-bleed image (no padding inside card)
- Overlay code label: colored chip on image (positioned absolute, bottom-right or top-right)
  - Use recipe name abbreviated as code (e.g., "STREET NGT.04", "UNDER_RAD")
  - Background: semi-transparent dark or tertiary red depending on mood
- Title below image (Manrope, semibold)
- "BY @SOURCE_NAME" attribution (extract from recipe URL domain or name)
- Inline technical specs row: ISO, DR%, film simulation abbreviation
- No border, subtle shadow-card, rounded-sm

### B3: Rewrite FeedGrid
**File**: `src/components/feed/FeedGrid.tsx`

Desktop: `grid-template-columns: repeat(auto-fill, minmax(400px, 1fr))`, gap 48px
- Even items: margin-top 64px (asymmetric offset)

Mobile: CSS columns masonry (`column-count: 1` default, `column-count: 2` at md breakpoint)
- `break-inside: avoid` on cards

Keep infinite scroll with IntersectionObserver.

### B4: Rewrite FilterBar (mobile mood tabs)
**File**: `src/components/feed/FilterBar.tsx`

Mobile: Horizontal scrollable tabs — "ALL / DAYLIGHT / STREET / PORTRAIT / B&W"
- These are mood/genre categories, not film simulations
- Map recipe data to mood categories (derive from recipe name/settings)
- Desktop: Hidden (filters are in Sidebar)

### B5: Assemble FeedPage
**File**: `src/pages/FeedPage.tsx`

Mobile flow: MobileHeader -> FilterBar (mood tabs) -> HeroSection -> FeedGrid
Desktop flow: Sidebar (film stocks) -> HeroSection -> FeedGrid (no FilterBar)

---

## Phase C: Detail Page Redesign (parallel with Phase B)

### C1: Rewrite RecipeDetailPage
**File**: `src/pages/RecipeDetailPage.tsx`

Structure:
1. Full-width hero image (cinematic, 16:9 or wider)
2. Title + creator attribution ("BY @PHOTOGRAPHER")
3. Description paragraph (recipe context/purpose — use recipe name + settings to generate descriptive text)
4. Action buttons: "Add to Favorites" + "Share" (styled, not functional yet for MVP)
5. Technical specifications table (restructured)
6. Exhibition gallery (grid of images — use thumbnail as placeholder, or show "No specimens" state)

### C2: Update RecipeMetadata
**File**: `src/components/recipe/RecipeMetadata.tsx`

- Restructure as a clean specs table with clear sections
- Use tonal layering (no border dividers)
- Group: Film Settings / Tone Curve / Effects / Shooting Settings

---

## Phase D: Visual Polish

### D1: Film Grain Overlay
**File**: `src/app.css`

Add fixed-position pseudo-element with low-opacity noise texture:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
  z-index: 9999;
}
```

### D2: Visual QA
- Compare desktop feed against Stitch screenshot
- Compare mobile feed against Stitch screenshot
- Compare recipe detail against Stitch screenshot
- Verify all design token compliance

### D3: Quality Gates
- TypeScript: `pnpm typecheck`
- Lint: `pnpm lint`
- Build: `pnpm build`

---

## Dependency Graph

```
Phase A (layout shell) ────┬── Phase B (feed page) ────┐
                           │                            ├── Phase D (polish)
                           └── Phase C (detail page) ───┘
```

Phase B and C can run in parallel after Phase A completes.

---

## Files Changed

| Action | File | Phase |
|--------|------|-------|
| Rewrite | `src/components/layout/AppShell.tsx` | A1 |
| Rewrite | `src/components/layout/NavBar.tsx` | A3 |
| Create | `src/components/layout/Sidebar.tsx` | A2 |
| Create | `src/components/layout/MobileHeader.tsx` | A4 |
| Create | `src/components/layout/BottomNav.tsx` | A5 |
| Create | `src/components/feed/HeroSection.tsx` | B1 |
| Rewrite | `src/components/recipe/RecipeCard.tsx` | B2 |
| Rewrite | `src/components/feed/FeedGrid.tsx` | B3 |
| Rewrite | `src/components/feed/FilterBar.tsx` | B4 |
| Rewrite | `src/pages/FeedPage.tsx` | B5 |
| Rewrite | `src/pages/RecipeDetailPage.tsx` | C1 |
| Rewrite | `src/components/recipe/RecipeMetadata.tsx` | C2 |
| Extend | `src/app.css` | D1 |
| Keep | `src/data/*`, `src/hooks/*`, `src/main.tsx`, `src/App.tsx` | - |

---

## Handoff

Execute with `/swarm-execute`:
- Phase A: sequential (layout shell must be done first)
- Phase B + C: parallel workers (independent pages)
- Phase D: sequential (after B + C complete)
