# Plan: MVP Polish

**Date**: April 7, 2026
**Status**: Ready for execution
**Scope**: Small feature (1-2 days)
**Prerequisite**: ADR (adr_web_app_architecture.md), initial implementation complete

---

## Context

The core MVP is implemented (Recipe Feed + Recipe Detail + responsive layout), but exploration revealed:
- **Data quality issues**: truncated dates, incomplete film sim names, null fields, bad image URLs
- **Missing filter**: camera body/sensor filter (PR-FAQ requirement)
- **Desktop gap**: 5-column layout at 2560px not implemented
- **Design violations**: 1 minor (horizontal dividers in RecipeMetadata)

These are all polish tasks that complete the MVP before launch.

---

## Tasks

### Task 1: Data Quality Fixes
**Files**: `tools/transform-recipes.ts`, `public/data/recipes.json`

- Fix truncated `publishedDate` (e.g., "May 27, 20" -> "May 27, 2020") — pad year to 4 digits
- Clean `filmSimulation` names — trim trailing `(`, whitespace, incomplete text
- Replace `null` values with empty string `""` at transform time
- Filter out recipes where `thumbnailUrl` points to non-photo URLs (affiliate banners, etc.)
- Re-run transform script, verify output recipe count and data quality
- Update `RecipeMetadata` to handle empty strings (already renders conditionally for "N/A")

**Acceptance criteria**: All 179 recipes have valid film simulation names, no null fields, dates are complete or empty.

### Task 2: Camera Body / Sensor Filter
**Files**: `src/data/types.ts`, `src/hooks/useFilters.ts`, `src/components/feed/FilterBar.tsx`, `src/pages/FeedPage.tsx`

- Add `sensor` filter to `RecipeFilters` interface
- Add sensor filter logic to `useFilters` hook (URL param: `sensor`)
- Extract unique sensor values from recipes
- Add a second row of filter chips for sensor in `FilterBar` (or a combined filter UI)
- Wire sensor filter into `FeedPage`

**Acceptance criteria**: User can filter recipes by sensor type (e.g., "X-Trans IV"). Filter persists in URL.

### Task 3: Desktop Ultra-Wide Layout
**Files**: `src/components/feed/FeedGrid.tsx`

- Add `2xl:grid-cols-5` to grid classes
- Scale gap: `2xl:gap-8`
- Verify asymmetric offset still works at 5 columns

**Acceptance criteria**: At 2560px viewport, feed shows 5 columns with proper spacing.

### Task 4: Design Polish
**Files**: `src/components/recipe/RecipeMetadata.tsx`, `src/components/ui/GradientButton.tsx`

- Replace `border-b border-outline-variant/15` in RecipeMetadata with margin-based spacing (`mb-3 pb-3`) — tonal layering philosophy
- Remove unused `GradientButton` component or use it for a CTA (e.g., "View Source" on detail page)
- Verify all interactive elements have visible focus states

**Acceptance criteria**: No horizontal divider lines in metadata. No unused components.

### Task 5: Visual QA
**Tools**: Chrome DevTools MCP, dev server

- Start `pnpm dev`
- Screenshot Feed page at mobile (390px) and desktop (2560px)
- Screenshot Recipe Detail page at mobile and desktop
- Compare against Stitch design principles
- File issues for any remaining visual gaps

**Acceptance criteria**: Screenshots confirm design compliance. No new issues found.

---

## Dependency Graph

```
Task 1 (data quality) ─────┐
                            ├── Task 2 (sensor filter) ──┐
Task 3 (desktop layout) ───┤                              ├── Task 5 (visual QA)
Task 4 (design polish) ────┘                              │
                                                          │
```

Tasks 1, 3, 4 are independent — can run in parallel.
Task 2 depends on Task 1 (clean sensor data).
Task 5 depends on all others.

---

## Quality Gates

- `pnpm typecheck` — pass
- `pnpm lint` — pass
- `pnpm build` — pass
- Visual QA screenshots reviewed

---

## Handoff

Execute with `/swarm-execute`. Parallelize Tasks 1, 3, 4 as independent workers.
