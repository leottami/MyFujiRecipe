# Screen Implementation Gap Analysis

**Date**: April 7, 2026
**Project**: Fuji Recipe Hub
**Status**: MVP Implementation Snapshot
**Stitch Project**: 9626409551350003062

---

## Executive Summary

**Implemented**: 2 of 5 screens (40%)
- ✅ Recipe Feed (Mobile) — Core gallery feed, fully functional
- ✅ Recipe Details (Mobile) — Recipe metadata view, fully functional

**Partially Implemented**: 1 of 5 screens (20%)
- ⚠️ Desktop Feed — Responsive layout exists (3-4 columns), but not pixel-perfect to Stitch design

**Not Implemented**: 2 of 5 screens (40%)
- ❌ Photographer Profile (Mobile) — No page/route/components
- ❌ Recipe Creator (Mobile) — No page/route/components

---

## Screen-by-Screen Analysis

### Screen 1: Recipe Feed (Mobile) — 780×5176px ✅ IMPLEMENTED

**Status**: Fully implemented and functional

**Implemented Components**:
- ✅ `FeedPage.tsx` — Main feed page with filtering and search
- ✅ `FeedGrid.tsx` — Asymmetric gallery grid with 2-column mobile layout
- ✅ `RecipeCard.tsx` — Recipe preview card with hero image + metadata
- ✅ `FilterBar.tsx` — Film simulation filter dropdown
- ✅ `SearchInput.tsx` — Text search input
- ✅ Infinite scroll pagination (20 recipes per batch via Intersection Observer)
- ✅ `useRecipes()` hook — Fetches and manages recipe data
- ✅ `useFilters()` hook — Manages filter/search state with URL params

**Design System Compliance**:
- ✅ Asymmetric grid (2 columns mobile, 3-4 columns desktop with alternating `mt-8 lg:mt-12`)
- ✅ Colors match Stitch tokens (background, surface layers)
- ✅ Typography uses Manrope (headlines) + Inter (body/labels)
- ✅ Border radius: `rounded-md` on cards (0.25rem)
- ⚠️ No 1px borders — uses tonal layering via `bg-surface-container-lowest`
- ✅ Photos own 60%+ with `aspect-ratio 3/2` hero images
- ✅ Generous whitespace (px-4, pt-6, mb-8 spacing)
- ✅ MetadataChip components with `bg-secondary-container`

**What's Missing from Stitch Design**:
1. **Glassmorphism navbar** — Current NavBar is basic, not frosted lens effect with backdrop blur
2. **Asymmetric offset precision** — FeedGrid offsets recipes by `mt-8/mt-12` but Stitch shows more dramatic 10%+ visual offset
3. **Responsive breakpoint alignment** — Desktop grid is 3-4 columns; Stitch shows 5-column layout for 2560px width
4. **Hover animations** — Cards have basic `transition-shadow`, not matching Stitch's more tactile "lifted" feeling
5. **Ambient shadows** — Using default Tailwind shadows, not the specified 6% opacity tinted shadows
6. **Loading state typography** — Uses `animate-pulse`, but Stitch may have specific skeleton design

**Performance Notes**:
- Infinite scroll prevents rendering 179 recipes at once
- Lazy loading on images via `loading="lazy"`
- Filter/search state persisted in URL for shareable links

---

### Screen 2: Recipe Details (Mobile) — 780×7252px ✅ IMPLEMENTED

**Status**: Fully implemented and functional

**Implemented Components**:
- ✅ `RecipeDetailPage.tsx` — Main recipe detail page
- ✅ `HeroImage.tsx` — Full-bleed hero image with fallback handling
- ✅ `RecipeMetadata.tsx` — Technical settings display (ISO, aperture, etc.)
- ✅ Navigation breadcrumb ("← Gallery") back to feed
- ✅ Recipe title + quick metadata chips (film simulation, sensor, dynamic range)
- ✅ Link to original source (attribution)
- ✅ Responsive grid layout (1-column mobile, 2-column desktop)

**Design System Compliance**:
- ✅ Hero image owns 60%+ of screen on mobile
- ✅ Title uses `font-headline font-extrabold text-2xl lg:text-4xl`
- ✅ Metadata chips styled per design tokens
- ✅ Border radius on images: `lg:rounded-md` (0.25rem)
- ✅ Color scheme matches Stitch (on-surface, on-surface-variant text)
- ✅ Generous whitespace: `px-4 pt-6 lg:px-0 lg:pt-0` padding structure
- ✅ Navigation link styled with `font-label text-xs uppercase tracking-widest`

**What's Missing from Stitch Design**:
1. **RecipeMetadata grid layout** — Stitch shows a specific 2-column settings grid on mobile; current implementation needs inspection
2. **Technical manual aesthetic** — Settings should feel like engraved camera labels, not generic form layout
3. **Tertiary color usage** — No use of red (#b91e25) for critical settings or highlights
4. **Photographer attribution** — No photographer name/avatar/profile link (future feature, but Stitch may hint at it)
5. **Desktop vs. Mobile responsive** — Desktop hero + metadata layout may differ from Stitch's 1.2fr/1fr ratio expectations
6. **Hero image fallback styling** — Gradient placeholder should use tertiary color or branded colors, not default

**Navigation Routing**:
- Route: `/recipe/:id` (correctly implemented)
- Back navigation works via React Router

---

### Screen 3: Photographer Profile (Mobile) — 780×3574px ❌ NOT IMPLEMENTED

**Status**: No code exists; route/page/components all missing

**What Needs to Be Built**:

**Page Component** (`src/pages/PhotographerProfilePage.tsx`):
- Route: `/photographer/:id`
- Query photographer data (post-MVP will need API; for MVP can derive from recipes)
- Display photographer header section
- Gallery of photographer's recipes
- Links to external portfolio/Instagram

**Layout Sections** (from Stitch design):
1. **Header** (profile hero)
   - Photographer avatar/profile photo
   - Name (headline, large, Manrope)
   - Bio/signature style description
   - Camera gear list (comma-separated technical specs)
   - Links: Portfolio URL, Instagram handle

2. **Recipe Gallery** (below header)
   - Horizontal scroller or grid of photographer's recipes
   - Each recipe card shows only hero image + title
   - Tapping a card navigates to recipe detail

3. **Call-to-action** (bottom)
   - "View Portfolio" button (primary style)
   - "Follow" button (secondary, post-MVP social feature)

**Components to Create**:
- `PhotographerHeader.tsx` — Profile avatar, name, bio, gear, links
- `PhotographerRecipeGallery.tsx` — Filtered recipe grid by photographer
- Hook: `usePhotographer(id)` — Fetch photographer data from recipes dataset

**Design System Requirements**:
- Avatar image: circular (full border radius or use `rounded-full` with caution per rules)
- Bio text: `font-body text-sm text-on-surface`
- Gear list: `font-label text-xs uppercase tracking-widest text-on-surface-variant`
- Links: styled as primary text with hover underline
- Button: `GradientButton` component (already exists)
- Gallery: asymmetric grid matching feed layout

**Data Model Gap**:
- Current `Recipe` type has no photographer ID, name, or profile data
- Post-MVP: need to add `photographer: { id, name, bio, avatar, gear, portfolio }` to Recipe type
- For MVP: can derive photographer ID from recipe source URL or create mock photographer data

---

### Screen 4: Recipe Creator (Mobile) — 780×6914px ❌ NOT IMPLEMENTED

**Status**: No code exists; route/page/components all missing

**What Needs to Be Built**:

**Page Component** (`src/pages/RecipeCreatorPage.tsx`):
- Route: `/create` (or `/recipe/new`)
- Multi-step form or single-page form with sections
- Submit handler (post-MVP: posts to API; for MVP can be a mock)

**Form Sections** (from Stitch design and PR-FAQ):
1. **Hero Image Upload**
   - File input with preview
   - Placeholder if no image selected
   - Validation: min resolution (e.g., 1200×800)

2. **Recipe Title & Basic Info**
   - Name input (text field, styled as camera manual)
   - Select camera body (dropdown: X-T5, X100VI, X-S20, etc.)

3. **Film Simulation Selection**
   - Dropdown or segmented tabs
   - Options: Classic Chrome, Velvia, Acros, Pro Neg Hi, Pro Neg Std, etc.

4. **Technical Settings**
   - ISO input (text or number, manual input style)
   - Aperture input (dropdown or text, e.g., "f/2.8")
   - Shutter Speed input (dropdown or text, e.g., "1/125")
   - Exposure Compensation slider (using `ExposureSlider` component style)

5. **Film Simulation Adjustments**
   - Dynamic Range (DR200, DR400, etc.)
   - Highlight slider (-2 to +2)
   - Shadow slider (-4 to +2)
   - Color slider (-4 to +4)
   - Noise Reduction slider (-4 to +2)
   - Sharpening slider (0 to +4)
   - Clarity slider (-4 to +4)
   - Grain Effect (off/weak small/weak large/strong small/strong large)
   - Color Chrome Effect (off/weak/strong)
   - Color Chrome Effect Blue (off/weak/strong)

6. **White Balance**
   - Dropdown: Daylight, Cloudy, Shade, Tungsten, Fluorescent, Custom
   - If custom: R/B offset values

7. **Context Notes**
   - Textarea: photographer's notes on lighting, mood, subject type

8. **Action Buttons**
   - "Publish" (primary button with tertiary color emphasis)
   - "Draft" (secondary button, post-MVP feature)
   - "Cancel" (back to feed)

**Components to Create**:
- `RecipeCreatorForm.tsx` — Main form container with sections
- `ImageUploadField.tsx` — File input + preview
- `FilmSimulationSelector.tsx` — Dropdown/tabs for film simulation
- `SettingsGrid.tsx` — 2-column grid layout for technical settings
- `TechnicalSettingInput.tsx` — Input field styled as camera manual (bottom-border only, uppercase label)
- `ExposureSlider.tsx` — Range slider with vertical thumb (already referenced in design tokens)
- `TextareaInput.tsx` — Textarea styled matching input design

**Hooks to Create**:
- `useRecipeForm()` — Form state management (useState for all fields)
- `useImageUpload()` — Handle file input, preview, validation
- `useRecipeCreation()` — Submit handler (mock API call for MVP)

**Design System Requirements**:
- Inputs: bottom-border style, transparent background, uppercase placeholder labels
- Sliders: aperture-ring look with vertical thumb
- Section headers: `font-headline font-semibold text-lg` for each group
- Buttons: GradientButton (primary) + secondary buttons
- Spacing: Generous whitespace, 3-column gap spacing
- Photos should NOT own 60% here — form fields dominate

**Data Model Changes**:
- Current `Recipe` type is read-only from scraped data
- Need to add `RecipeInput` type for form submission:
  ```typescript
  interface RecipeInput {
    name: string;
    cameraBody: string;
    filmSimulation: string;
    iso: string;
    aperture: string;
    shutterSpeed: string;
    exposureCompensation: string;
    // ... all other settings
    contextNotes: string;
    heroImage: File;
  }
  ```

**Post-MVP Integration Points**:
- User authentication (add `userId` to Recipe model)
- Image upload to S3 (replaces `heroImage: File` with `heroImageUrl: string`)
- API endpoint: `POST /api/recipes`
- Database persistence in PostgreSQL

---

### Screen 5: Desktop Feed — 2560×2089px ⚠️ PARTIALLY IMPLEMENTED

**Status**: Responsive layout exists but not pixel-perfect to Stitch design

**Current Implementation**:
- `FeedGrid.tsx` uses Tailwind breakpoints: `grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6`
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop (1024px+): 3-4 columns depending on screen size
- Asymmetric offset: `mt-8 lg:mt-12` on alternating rows

**Stitch Design Expectation** (2560px width):
- 5-column layout (based on Stitch design artifact)
- Specific asymmetric offset pattern (not just alternating rows)
- Possibly different gap sizing for ultra-wide displays

**What's Missing**:
1. **5-column layout** — No `2xl:grid-cols-5` breakpoint for 2560px width
2. **Gap sizing scaling** — Gap may need to scale up for larger screens (currently capped at `gap-6`)
3. **Asymmetric offset precision** — Stitch offset pattern may be more complex than simple alternating `mt-8/mt-12`
4. **Maximum width constraint** — No hard max-width that matches Stitch's intended desktop layout
5. **Viewport testing** — Current implementation not tested at 2560px resolution
6. **Hero image aspect ratio** — May need adjustment for ultra-wide displays

**Performance Considerations**:
- Infinite scroll works across all breakpoints
- Image lazy loading still applies to all columns
- May need to increase batch size (`batchSize=20`) for faster desktop pagination

**Responsive Breakpoints Used**:
```typescript
// Tailwind breakpoints (from ADR)
sm: 640px      (not used currently)
md: 768px      (not used, but Tailwind default)
lg: 1024px     (desktop grid-cols-3)
xl: 1280px     (could be used for grid-cols-4 or 5)
2xl: 1536px    (not defined in tailwind.config.ts, would need custom)
```

---

## Summary Table

| Screen | Status | Pages | Components | Routes | Missing |
|--------|--------|-------|-----------|--------|---------|
| Recipe Feed (Mobile) | ✅ | FeedPage | FeedGrid, RecipeCard, FilterBar, SearchInput | `/` | Glassmorphism navbar, precise asymmetry, shadow refinement |
| Recipe Details (Mobile) | ✅ | RecipeDetailPage | HeroImage, RecipeMetadata, MetadataChip | `/recipe/:id` | Technical manual aesthetic, photographer link |
| Photographer Profile | ❌ | None | None | `/photographer/:id` | All components, data model |
| Recipe Creator | ❌ | None | None | `/create` | All components, form state, image upload |
| Desktop Feed | ⚠️ | FeedPage | FeedGrid (responsive) | `/` | 5-column layout, ultra-wide optimization |

---

## Priority Implementation Order

Based on MVP scope (PR-FAQ section 12: "In Scope - Launch"):

### Phase 1 (Current - Core Gallery) ✅ COMPLETE
- Recipe Feed (mobile & responsive desktop) ✅
- Recipe Details ✅

### Phase 2 (Post-MVP - Social) ❌ NEEDS BUILD
- Photographer Profiles
- Recipe Creator (post-MVP per PR-FAQ section 12)

### Phase 3 (Polish & Optimization)
- Desktop Feed responsive perfection (5-column layout)
- Performance optimization (image loading, bundle size)
- Visual QA against Stitch designs

---

## Technical Debt & Refinements

### High Priority (Pre-Launch)
1. **RecipeMetadata component** — Needs detailed inspection to ensure 2-column technical grid matches Stitch
2. **NavBar glassmorphism** — Implement frosted effect with `backdrop-blur-[20px]`
3. **Ambient shadows** — Replace default Tailwind shadows with `shadow-[0_24px_48px_rgba(47,52,46,0.06)]`
4. **Image fallbacks** — Branded gradient placeholder instead of generic gray
5. **Desktop breakpoints** — Add 2560px design validation

### Medium Priority (Polish)
1. **Form styling** — Prepare manual input style for Recipe Creator
2. **Photographer data model** — Add to Recipe type structure
3. **Tertiary color usage** — Identify 3-5 places to add red accents (live states, CTAs)
4. **Accessibility** — Verify focus states and ARIA labels on all interactive elements

### Low Priority (Future)
1. **Animation refinement** — More tactile hover/click feedback
2. **Loading skeleton** — Custom skeleton matching Stitch design
3. **Error state design** — Specific error card layout from Stitch

---

## File Structure for Remaining Screens

```
src/
  pages/
    PhotographerProfilePage.tsx        # New
    RecipeCreatorPage.tsx              # New
  components/
    photographer/                      # New folder
      PhotographerHeader.tsx
      PhotographerRecipeGallery.tsx
    creator/                           # New folder
      RecipeCreatorForm.tsx
      ImageUploadField.tsx
      FilmSimulationSelector.tsx
      SettingsGrid.tsx
      TechnicalSettingInput.tsx
      ExposureSlider.tsx
      TextareaInput.tsx
  hooks/
    usePhotographer.ts                 # New
    useRecipeForm.ts                   # New
    useImageUpload.ts                  # New
```

---

## Design System Alignment Checklist

Before committing next features:

- [ ] Colors match exact hex from `fuji-recipe-hub.md`
- [ ] Typography: Manrope headlines + Inter body/labels
- [ ] No `rounded-xl` or `rounded-full` (only none/sm/md/lg)
- [ ] No 1px borders (tonal layering only)
- [ ] Glassmorphism on floating elements with `backdrop-blur-[20px]`
- [ ] Metadata chips use `bg-secondary-container`
- [ ] Photos own 60%+ real estate where applicable
- [ ] Asymmetric layouts for gallery sections
- [ ] Tertiary red used sparingly (only critical states)
- [ ] Generous whitespace maintained
- [ ] Touch targets minimum 48px
- [ ] Ambient shadows at 6% opacity

---

## References

- **PR-FAQ**: `artifacts/pr_faq_fuji_recipes.md` — MVP scope in section 12
- **Design System**: `.claude/skills/design/stitch-integration/resources/fuji-recipe-hub.md`
- **ADR**: `artifacts/adr_web_app_architecture.md` — Component and routing architecture
- **Recipe Scraper**: `tools/scraper/fuji_parser.py` — 179 scraped recipes
- **Stitch Project**: ID `9626409551350003062`
