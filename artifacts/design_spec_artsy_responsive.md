# Design Spec: Artsy & Responsive Overhaul

**Status**: Draft  
**Author**: UI/UX Designer  
**Date**: 2026-04-09  
**Scope**: All pages — FeedPage, RecipeDetailPage, ProfilePage, RecipeEditorPage

---

## 1. Design Vision

Transform the app from a *functional archive tool* into an **editorial photography magazine** that feels alive, layered, and cinematic — like flipping through a tactile Fuji zine on your phone.

**Mood keywords**: Darkroom exhibition · Japanese minimalism · Film-lab tactile · Gallery vernissage

### What "artsy" means here:

| Current | Target |
|---------|--------|
| Flat grid of cards | Gallery-exhibition layout with breathing space |
| Static hero text | Typography-first landing with scroll-reveal choreography |
| Uniform card sizes | Asymmetric masonry with hero-feature cards |
| Neutral warm grays | Deeper contrast — near-black header strips, warm cream paper |
| Hover-only interactivity | Micro-interactions on scroll, tap, and drag |
| Data-table metadata | Beautifully typeset film-setting "data sheet" |

---

## 2. Color Evolution

Keep the existing Material-style token system but push contrast and warmth.

### New / Modified Tokens

```css
/* Deepen background to "darkroom paper" cream */
--color-background: #f7f5f0;  /* was #faf9f5 — slightly warmer, more yellow */
--color-surface-container-low: #f0efe9;  /* was #f4f4ef */

/* Add a true dark mode for hero strips */
--color-editorial-dark: #1a1a18;  /* near-black, warmer than #0d0f0d */
--color-editorial-dark-text: #c8c5be;  /* softer than pure inverse */

/* Accent evolution — same red, add a warm gold */
--color-accent-warm: #c4956a;  /* film-canister copper/gold */
--color-accent-warm-dim: #a67b52;

/* Subtle tint for active states instead of red */
--color-tint-active: rgba(185, 30, 37, 0.06);  /* red wash */
```

### Dark Hero Strips

Use `editorial-dark` background for:
- Feed page hero section (full-bleed)
- Recipe detail hero image area
- Profile header
- "Film data sheet" section headers

This creates **rhythmic contrast** — alternating between the warm cream (#f7f5f0) body and near-black (#1a1a18) cinematic strips.

---

## 3. Typography Enhancements

### Add a Display Weight

The existing Manrope 800 is great but under-used. Push to display scale:

| Element | Current | Target |
|---------|---------|--------|
| Feed hero title | `text-2xl` (mobile) / `text-5xl` (desktop) | `text-4xl` (mobile) / `text-7xl` (desktop) |
| Recipe name (detail) | `text-3xl lg:text-5xl` | `text-4xl lg:text-6xl` with negative letter-spacing |
| Profile "My Camera" | `text-4xl lg:text-5xl` | `text-5xl lg:text-7xl` |
| Card recipe name | `text-[15px]` | `text-base lg:text-lg` |

### Typographic Details

- **Headline tracking**: Switch from `tracking-tight` → `tracking-[-0.03em]` for display sizes (organic, not mechanical)
- **Pull quotes**: Add a `blockquote` style for recipe descriptions — italic, large, indented
- **Reading line-height**: Body text `leading-[1.7]` → more editorial spacing
- **Caption style**: Strengthen the uppercase system — add a subtle left-border accent line on section headers

---

## 4. Layout: Feed Page

### 4.1 Full-Bleed Hero Strip (Mobile + Desktop)

**Current**: Hero section sits inside padded container, warm background.  
**Target**: Full-bleed dark strip spanning edge-to-edge with:

```
┌─────────────────────────────────────┐
│  [editorial-dark background]        │
│                                     │
│  ● LATEST ENTRIES                   │
│                                     │
│  THE ANALOG                         │
│  REVIVAL                            │  ← text-4xl mobile / text-7xl desktop
│                                     │
│  A curated feed of bespoke          │
│  sensor profiles.                   │  ← visible on all sizes now (not desktop-only)
│                                     │
└─────────────────────────────────────┘
```

- On mobile: `-mx-4` to bleed past padding
- On desktop: Full-width across the content area (sidebar stays)
- Text color: `editorial-dark-text` with tertiary red accent dot

### 4.2 Featured Card (First Recipe)

The first recipe in the feed gets a **featured treatment**:

```
Mobile:                    Desktop:
┌───────────────────┐     ┌──────────────────────────────────────────────┐
│                   │     │                                              │
│   (full-width     │     │   (spanning 2 columns, 16:9 aspect)         │
│    hero image     │     │                                              │
│    16:9 aspect)   │     │              [gradient overlay]              │
│                   │     │                                              │
│  Recipe Name      │     │   Recipe Name             Film Sim badge     │
│  Author / DR      │     │   Author / DR                                │
└───────────────────┘     └──────────────────────────────────────────────┘
```

- Image aspect changes from `3:2` → `16:9` for the featured card
- Text overlays on the image (bottom-left) instead of below
- Remaining cards continue in the asymmetric grid

### 4.3 Desktop Grid Refinement

- Keep alternating offset (`mt-16` on odd cards) — this is already a strong editorial choice
- Add subtle column gap variation: alternate between `gap-x-8` and `gap-x-14` rows
- **Tablet (md)**: Currently jumps straight to 2-col masonry. Add a proper 2-column grid with offset at `md` too.

### 4.4 Mobile Feed Spacing

- Increase `gap` from `4` to `6` between cards — more breathing room
- Add thin divider lines between cards (1px `surface-variant/15`) as an option

### 4.5 Scroll Animations

- Cards: `fadeInUp` stays but gets a parallax-like stagger — first card loads immediately, subsequent cards delay by 100ms with a slight scale-in (0.97 → 1.0)
- Hero section: Subtle opacity + translateY on mount

---

## 5. Layout: Recipe Detail Page

### 5.1 Immersive Hero

**Current**: `21/9` aspect hero in a container.  
**Target**: Full-viewport hero image with scroll-overlay content.

```
Mobile:
┌─────────────────────────────────────┐
│                                     │
│        (Hero image fills            │
│         80vh height)                │
│                                     │
│  ────────────────────────────────   │  ← gradient from transparent to bg
│  Recipe Name                        │
│  by Author                          │
│  [♥ Favorite] [📷 Camera] [Edit]   │
└─────────────────────────────────────┘

Desktop:
┌──────────────────────────────────────────────────┐
│                                                    │
│          (Hero image, max-height 70vh,             │
│           full-bleed with rounded-sm               │
│           on desktop only)                         │
│                                                    │
│  ──────────────────────────────────────            │
│  Recipe Name (large)    │  TECHNICAL SPECS          │
│  Author · Tags          │  Film Simulation: Provia  │
│  Description            │  Dynamic Range: DR400     │
│  [Actions]              │  ...                      │
└──────────────────────────────────────────────────┘
```

- Hero image: Scale from `21/9` → `hero` (fill 65-80vh on mobile, 60vh on desktop)
- Gradient overlay on bottom 40% of hero image
- Recipe title + author overlaid on hero image bottom
- Action buttons move inside the hero zone on mobile

### 5.2 "Film Data Sheet" Metadata

Redesign `RecipeMetadata` from plain rows into an artful data sheet:

```
┌──────────────────────────────────┐
│  ─ FILM SETTINGS ────────────    │  ← accent-warm left border on section title
│                                  │
│  FILM SIMULATION    Provia       │  ← larger value text, monospace-feel
│  ─────────────────────────       │  ← hairline divider between rows
│  DYNAMIC RANGE      DR400       │
│  ─────────────────────────       │
│  GRAIN              Weak        │
│                                  │
│  ─ TONE CURVE ────────────       │
│  HIGHLIGHT          +1          │  ← consider color-coding +/- values
│  SHADOW             -1          │
└──────────────────────────────────┘
```

- Section titles: Add a 2px `accent-warm` left border line
- Value alignment: Right-aligned, slightly larger (`text-base`)
- Dividers: Hairline `1px surface-variant/10` between rows
- Monospace feel: Values in `font-headline font-semibold` (not body)

### 5.3 Photo Gallery

- Lightbox overlay: Add a film-strip counter style (`03 / 12`)
- Grid: Add a subtle hover animation → lift by 4px + shadow deepens
- On mobile: Full-bleed gallery (remove padding)

---

## 6. Layout: Profile Page

### 6.1 Camera Slots — "Film Back" Treatment

Current 3x2 grid is functional. Make it feel like loading film backs:

```
┌─────────────────────────────────────┐
│  C1                C2              C3 │  ← 3:2 aspect, rounded-sm
│  [recipe image]   [recipe image]  [ ] │
│  Provia           Classic Neg     ···  │  ← film sim name below each slot
│                                       │
│  C4                C5              C6 │
│  [ ]              [ ]             [ ] │
│  ···              ···             ···  │
└─────────────────────────────────────┘
```

- Empty slots: Subtle dashed border with `accent-warm/20` tint
- Filled slots: Slight 3D lift effect (shadow + `translate-y-[-2px]` on filled)
- Film simulation name visible under each slot (not just camera number)
- Slot number badge uses `accent-warm` instead of neutral (feels like film canister labels)

### 6.2 Collection Grid

- Switch from uniform 2/3/4-col grid → Pinterest-style masonry using CSS `columns`
- Slight rotation on hover (`rotate-[0.5deg]`) for a tactile "photo stack" feel
- On desktop: Larger cards, minimum 280px

---

## 7. Layout: RecipeEditorPage (Desktop Form)

### 7.1 Section Breathing

- Currently feels compressed. Add `gap-8` between form sections (currently `gap-6`)
- Section headers: Same accent-warm left-border treatment as metadata

### 7.2 Photo Upload Zone

- Make it taller (minimum 200px → 240px)
- Add dashed border animation on hover (dash offset animation)
- Success state: Thumbnail preview with a polaroid-frame effect (white 8px border)

---

## 8. Responsive Breakpoint Improvements

### 8.1 Missing Breakpoints

| Breakpoint | Name | Current State | Target |
|------------|------|---------------|--------|
| 320px | iPhone SE | Works but cramped | Reduce title sizes, stack actions |
| 390px | iPhone 14/15 | Primary target | Optimize spacing |
| 428px | iPhone Pro Max | Slightly too spacious | 2-col card option possible |
| 768px | iPad Mini | Jumps to 2-col | Proper 2-col with sidebar peek |
| 834px | iPad Air | No specific treatment | 2-col + visible sidebar |
| 1024px | Desktop start | Sidebar appears | Keep as-is |
| 1440px | Large desktop | Under-utilized | Max-width content, larger cards |

### 8.2 Mobile-Specific Improvements

1. **Safe areas**: Add `env(safe-area-inset-bottom)` to BottomNav height  
2. **Pull-to-refresh feel**: Subtle bounce on scroll-to-top (overscroll behavior)
3. **Touch targets**: All interactive elements minimum 44×44px effective area
4. **Thumb zone**: Keep primary actions (favorite, camera) in bottom-half of screen
5. **Landscape mode (iPhone)**: Feed switches to 2-col, detail hero shrinks to 50vh

### 8.3 Tablet Layout (768-1023px)

Currently no sidebar at tablet size — it jumps from full-mobile to full-desktop.

Add an intermediate layout:
- Feed: 2-column masonry grid
- Hero description visible (currently hidden below lg)
- Filter bar gets a horizontal scroll with more room
- Recipe detail: Side-by-side layout (image left, metadata right) even at tablet

---

## 9. Micro-Interactions & Motion

### 9.1 Scroll-Triggered Animations

| Element | Trigger | Animation |
|---------|---------|-----------|
| Hero section | Page mount | Fade up (0.6s) + title scale from 0.95 |
| Feed cards | Intersect viewport | FadeInUp with stagger (current) + subtle scale |
| Metadata sections | Scroll into view | Slide in from left (0.3s) |
| Profile camera slots | Page mount | Stagger (current) + subtle rotate from ±2deg |

### 9.2 Interaction Feedback

| Action | Feedback |
|--------|----------|
| Favorite toggle | Heart scales to 1.3x then back (spring) |
| Camera add | Brief green flash tint on the slot |
| Card hover (desktop) | Image zoom 3% (current) + shadow lift + title color |
| Card tap (mobile) | Subtle scale 0.98x then navigate |
| Filter pill tap | Background fills with spring animation |
| Photo upload success | Polaroid-style "develop" fade-in |

### 9.3 Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Replace motion with instant opacity changes
- Remove transforms and scale effects
- Keep color transitions (they're non-motion)

---

## 10. Accessibility Audit Items

| Issue | Fix |
|-------|-----|
| Filter pills lack `aria-pressed` state | Add `aria-pressed={active}` to all toggle pills |
| Gallery images missing meaningful alt text | Include recipe name + "sample photo N of M" |
| Color contrast: `on-surface-variant/40` on cream bg | Fails WCAG AA at some sizes — raise to `/60` minimum |
| Heart icon buttons lack `aria-label` | Add `aria-label="Add to favorites"` / `"Remove from favorites"` |
| Drag-and-drop has no keyboard alternative | Add keyboard slot-assignment via Enter/Space on collection cards |
| Toast announcements not live-region'd | Add `role="status" aria-live="polite"` to toast container |

---

## 11. Implementation Priority

### Phase 1: Foundation (Color + Typography + Spacing)
1. Update CSS theme tokens (background, editorial-dark, accent-warm)
2. Push typography to display scale on heroes/titles
3. Increase card gap, add breathing space
4. Fix accessibility contrast issues

### Phase 2: Feed Page Artsy
5. Full-bleed dark hero strip
6. Featured first card treatment
7. Scroll animation refinements
8. Tablet breakpoint (md) grid improvements

### Phase 3: Detail Page Immersion
9. Full-viewport hero with gradient overlay + title overlay
10. "Film data sheet" metadata redesign
11. Photo gallery improvements

### Phase 4: Profile & Editor Polish
12. Camera slot "film back" redesign
13. Collection masonry layout
14. Editor section breathing + upload zone polish

### Phase 5: Motion & Interaction
15. Heart/camera micro-interactions
16. Scroll-triggered section reveals
17. Card tap feedback (mobile)
18. Reduced motion coverage

---

## 12. Files to Modify

| File | Changes |
|------|---------|
| `src/app.css` | New tokens, animations, scroll-reveal classes |
| `src/components/feed/HeroSection.tsx` | Full-bleed dark strip, display typography |
| `src/components/feed/FeedGrid.tsx` | Featured card, tablet grid, spacing |
| `src/components/recipe/RecipeCard.tsx` | Featured variant, improved spacing |
| `src/components/recipe/RecipeMetadata.tsx` | Film data sheet redesign |
| `src/components/recipe/HeroImage.tsx` | Full-viewport hero support |
| `src/pages/FeedPage.tsx` | Hero wrapping, layout adjustments |
| `src/pages/RecipeDetailPage.tsx` | Immersive hero, overlay title, actions |
| `src/pages/ProfilePage.tsx` | Camera slot styling, masonry collection |
| `src/components/layout/AppShell.tsx` | Tablet breakpoint handling |
| `src/components/layout/BottomNav.tsx` | Safe area insets |
| `src/components/layout/Sidebar.tsx` | Accent-warm section headers |
| `src/components/ui/GradientButton.tsx` | Warm accent variant |
| `src/components/editor/PhotoUploadZone.tsx` | Taller zone, dash animation |

---

## 13. Visual References

The aesthetic should evoke:
- **Kinfolk Magazine** — generous white space, large typography, muted palette
- **VSCO app** — dark mode strips, photography-first, minimal chrome
- **Leica Akademie** — German precision, label typography, technical data presented beautifully
- **Analog.Cafe** — film photography community, warm tones, editorial grid
