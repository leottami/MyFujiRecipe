# ADR: Recipe Creation — Mobile-First Optimization & Photo Upload

**Status**: Proposed  
**Date**: 2026-04-09  
**Author**: Architect  
**Stakeholder Request**: Smoother recipe creation, photo upload support, mobile (iPhone Safari) focus

---

## Context

IamFuji is a Fujifilm recipe management app used primarily on iPhone via Safari. The current recipe creation flow has critical mobile UX gaps:

| Problem | Impact | Severity |
|---------|--------|----------|
| URL-paste only for photos | Cannot upload from camera roll or shoot directly | **Critical** |
| Single long-scroll form (20+ fields) | Overwhelming on mobile, no progressive disclosure | **High** |
| Sticky save bar overlaps BottomNav | Both fixed at bottom (z-40 vs z-50), save bar hidden behind nav | **High** |
| `group-hover` for photo delete | Invisible on touch — no hover on mobile | **Medium** |
| No image compression | Users will upload multi-MB iPhone photos into client storage | **High** |
| No step indicator or progress | User can't gauge form completion | **Medium** |

### Constraints

- **No backend** — all data persists in browser (localStorage + IndexedDB)
- **iPhone Safari** — must work within iOS WebKit constraints
- **Tech Strategy** — React 19, Vite, Tailwind 4, no new heavy dependencies
- **Offline-first** — existing pattern must be preserved

---

## Decision

### 1. Multi-Step Wizard for Mobile Recipe Creation

Replace the single-scroll form with a **4-step wizard** on mobile viewports. Desktop retains the current single-page layout.

```
Step 1: Photos         → Camera/upload/URL (visual, engaging first)
Step 2: Essentials     → Name, Film Simulation, Sensor, Dynamic Range
Step 3: Film Settings  → Tone curve, grain, color chrome, WB, ISO, etc.
Step 4: Review & Save  → Summary card with edit-back links
```

**Architecture:**

```
RecipeEditorPage
  ├── useRecipeForm (unchanged)
  ├── useMediaQuery("(max-width: 1023px)")
  │
  ├── [mobile]  → WizardLayout
  │     ├── StepIndicator (progress dots + step name)
  │     ├── WizardStep (animated slide transition)
  │     │   ├── PhotoStep
  │     │   ├── EssentialsStep
  │     │   ├── SettingsStep
  │     │   └── ReviewStep
  │     └── WizardNavBar (Back / Next / Create — replaces BottomNav)
  │
  └── [desktop] → SingleFormLayout (current layout, bug-fixed)
```

**Step Navigation Rules:**
- Step 1 → 2: No validation (photos optional)
- Step 2 → 3: Validate `name` + `filmSimulation` (required fields)
- Step 3 → 4: No validation (all optional)
- Step 4 → Save: Final validation pass

**Animations:** CSS-only slide transitions using `transform: translateX()` with `transition`. No animation libraries needed.

**State:** Wizard step state lives in `RecipeEditorPage` (simple `useState<number>`). Form state remains in `useRecipeForm` — no changes needed.

### 2. Photo Upload via File API + IndexedDB

Add native photo upload alongside the existing URL input. On iPhone Safari, `<input type="file" accept="image/*">` triggers the native photo picker with "Take Photo" and "Photo Library" options automatically.

**New Components:**

```
PhotoStep
  ├── PhotoUploadZone       → Drop zone / tap-to-upload area
  │     ├── <input type="file" accept="image/*" multiple>
  │     └── "Add from URL" toggle (existing PhotoUrlField)
  ├── PhotoPreviewGrid      → Grid of added photos (uploaded + URL)
  │     └── PhotoPreviewCard → Thumbnail + hero badge + delete (always visible)
  └── usePhotoUpload hook   → File → compressed blob → IndexedDB
```

**Storage Architecture:**

```
┌─────────────────────────────┐
│  localStorage               │
│  ┌───────────────────────┐  │
│  │ iamfuji_recipes_overlay│  │  ← Recipe metadata (existing)
│  │  .created[].photos[]   │  │  ← Photo references (url or idb:// URI)
│  └───────────────────────┘  │
└─────────────────────────────┘

┌─────────────────────────────┐
│  IndexedDB                   │
│  ┌───────────────────────┐  │
│  │ iamfuji_photos         │  │  ← Object store
│  │  key: photo-{id}       │  │
│  │  value: {              │  │
│  │    blob: Blob,         │  │
│  │    mimeType: string,   │  │
│  │    width: number,      │  │
│  │    height: number,     │  │
│  │    createdAt: string   │  │
│  │  }                     │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Photo URL Convention:**
- External images: `https://...` (existing behavior)
- Uploaded images: `idb://photo-{timestamp}-{index}` (new convention)

The `HeroImage` component and anywhere that renders a photo URL will need a thin resolver:

```typescript
// photoResolver.ts
async function resolvePhotoUrl(url: string): Promise<string> {
  if (url.startsWith("idb://")) {
    const blob = await photoStore.get(url.replace("idb://", ""));
    return URL.createObjectURL(blob);
  }
  return url; // External URL, pass through
}
```

**Image Compression Pipeline:**

```
iPhone photo (3-8 MB HEIC/JPEG)
  → Canvas resize (max 1920px longest edge)
  → JPEG encode (quality: 0.82)
  → ~200-400 KB output
  → Store in IndexedDB
```

Implementation uses `OffscreenCanvas` where available (Safari 16.4+), falling back to regular `<canvas>`.

**Storage Budget:**
- IndexedDB on iOS Safari: ~50% of free disk space (realistically 100MB+)
- At ~300KB per compressed photo, that's 300+ photos before concern
- Implement a storage quota check with user warning at 80% usage

### 3. Touch-Friendly Photo Interactions

Replace hover-dependent interactions with mobile-safe patterns:

| Current (broken on mobile) | New (mobile-first) |
|---|---|
| `group-hover:opacity-100` for delete | Always-visible delete button (small, top-right) |
| No reorder capability | Long-press drag to reorder (stretch goal) |
| No hero selection | Tap photo → action sheet: "Set as Hero" / "Delete" |
| 2-col grid always | 2-col grid, tappable for full preview |

### 4. Fix Save Bar / BottomNav Collision

**Current bug:** Save bar `fixed bottom-0 z-40` renders behind BottomNav `fixed bottom-0 z-50`.

**Solution for wizard:** The `WizardNavBar` replaces `BottomNav` entirely when on the editor page. Use a layout signal via React context or route detection:

```
BottomNav: hidden when pathname matches /recipe/new or /recipe/:id/edit
WizardNavBar: shown only on editor pages, same position, same styling
```

**Solution for desktop:** Save bar becomes relative-positioned (current `lg:relative` approach is correct but needs testing).

---

## Alternatives Considered

### Photo Storage

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **A: Base64 in localStorage** | Simplest implementation | 5-10MB limit total; bloats JSON parsing; slow | Rejected |
| **B: IndexedDB for everything** | Unlimited storage; fast blob access | Recipe metadata queries need IndexedDB too; more complex | Rejected |
| **C: localStorage (metadata) + IndexedDB (blobs)** | Best of both; metadata stays fast; blobs stored efficiently | Two storage systems to manage | **Selected** |
| **D: Service Worker cache** | Native cache API; good for images | Eviction unpredictable; not meant for user data | Rejected |

### Mobile Form UX

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **A: Accordion/collapsible sections** | Keeps single page; simpler to implement | Still overwhelming; no progress indicator; partial visibility | Rejected |
| **B: Multi-step wizard** | Progressive disclosure; focused steps; clear progress | More components; animation complexity | **Selected** |
| **C: Sheet/modal per section** | Native-feeling on mobile | Back-navigation confusing; state management complex | Rejected |
| **D: Bottom-sheet flow** | Very native iOS feel | Heavy implementation; accessibility concerns | Rejected |

### Image Compression

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **A: No compression** | Zero complexity | 3-8MB per iPhone photo; storage fills fast | Rejected |
| **B: Canvas resize + JPEG** | Works everywhere; ~95% size reduction | Loses HEIC/WebP benefits; canvas memory spikes on large images | **Selected** |
| **C: WebAssembly encoder (e.g., squoosh)** | Better quality/size ratio; AVIF support | +200KB bundle; complex setup | Rejected (over-engineered for MVP) |

---

## Implementation Plan

### New Files

```
src/
  components/
    editor/
      wizard/
        WizardLayout.tsx        → Wizard container + step routing
        StepIndicator.tsx       → Progress dots component
        WizardNavBar.tsx        → Bottom navigation (Back/Next/Create)
        PhotoStep.tsx           → Step 1: Photo upload/URL
        EssentialsStep.tsx      → Step 2: Name, simulation, sensor
        SettingsStep.tsx        → Step 3: All film settings
        ReviewStep.tsx          → Step 4: Summary + create
      PhotoUploadZone.tsx       → File input + drop zone
      PhotoPreviewGrid.tsx      → Photo grid with touch actions
  data/
    photoStore.ts               → IndexedDB wrapper for photo blobs
    imageCompressor.ts          → Canvas-based resize + compress
    photoResolver.ts            → idb:// URL resolver
  hooks/
    usePhotoUpload.ts           → File → compress → store → return ref
    useMediaQuery.ts            → Responsive breakpoint hook
```

### Modified Files

| File | Change |
|------|--------|
| `RecipeEditorPage.tsx` | Conditional rendering: wizard (mobile) vs single-form (desktop) |
| `BottomNav.tsx` | Hide on editor pages |
| `HeroImage.tsx` | Support `idb://` URLs via resolver |
| `PhotoGallery.tsx` | Support `idb://` URLs via resolver |
| `RecipeCard.tsx` | Support `idb://` URLs via resolver |
| `RecipeDetailPage.tsx` | Support `idb://` URLs (photos display) |
| `types.ts` | No changes needed — `RecipePhoto.url` already supports any string |
| `StaticJsonRepository.ts` | No changes needed — stores URL strings as-is |

### Zero Changes Required

- `useRecipeForm.ts` — Form state model unchanged
- `useRecipeMutations.ts` — Mutation interface unchanged
- `RecipeRepository.ts` — Repository interface unchanged
- `filterHelpers.ts` — Filters don't touch photos

### Implementation Order

```
Phase 1: Photo Upload (highest user value)
  1. photoStore.ts (IndexedDB wrapper)
  2. imageCompressor.ts (canvas resize)
  3. photoResolver.ts (idb:// resolver)
  4. usePhotoUpload.ts (hook)
  5. PhotoUploadZone.tsx (UI component)
  6. Update HeroImage + PhotoGallery + RecipeCard (resolver integration)
  7. Fix PhotoUrlField touch interactions (always-visible delete)

Phase 2: Mobile Wizard
  1. useMediaQuery.ts
  2. WizardLayout.tsx + StepIndicator.tsx
  3. PhotoStep.tsx (wraps PhotoUploadZone + PhotoUrlField)
  4. EssentialsStep.tsx
  5. SettingsStep.tsx
  6. ReviewStep.tsx
  7. WizardNavBar.tsx
  8. Update RecipeEditorPage.tsx (conditional layout)
  9. Update BottomNav.tsx (hide on editor)

Phase 3: Polish
  1. Slide animations between steps
  2. Storage quota warning
  3. Photo action sheet (hero selection, delete)
  4. Haptic feedback via navigator.vibrate() (where supported)
```

---

## Technical Details

### IndexedDB Schema

```typescript
// Database: "iamfuji"
// Version: 1
// Object Store: "photos"
//   keyPath: "id"
//   Indexes: none needed (always accessed by key)

interface StoredPhoto {
  id: string;           // "photo-{timestamp}-{index}"
  blob: Blob;           // Compressed JPEG
  mimeType: string;     // "image/jpeg"
  width: number;        // After resize
  height: number;       // After resize
  sizeBytes: number;    // For quota tracking
  createdAt: string;    // ISO timestamp
}
```

### Image Compression Spec

```typescript
interface CompressionOptions {
  maxDimension: 1920;    // Longest edge in pixels
  quality: 0.82;         // JPEG quality (good balance)
  outputType: "image/jpeg";
}

// Expected results:
// iPhone 15 photo (4032x3024, 3.5MB HEIC) → 1920x1440, ~280KB JPEG
// iPhone 15 photo (4032x3024, 6MB JPEG)   → 1920x1440, ~350KB JPEG
```

### Photo Resolver (Memoized)

```typescript
// Cache object URLs to prevent repeated IndexedDB reads
const urlCache = new Map<string, string>();

// Cleanup: revoke object URLs when component unmounts
// Use a usePhotoUrl(url) hook that handles lifecycle
```

### Wizard Step Transitions (CSS-only)

```css
.wizard-step-enter { transform: translateX(100%); opacity: 0; }
.wizard-step-active { transform: translateX(0); opacity: 1; transition: transform 0.3s ease, opacity 0.2s ease; }
.wizard-step-exit { transform: translateX(-100%); opacity: 0; transition: transform 0.3s ease, opacity 0.2s ease; }
```

### iPhone Safari Considerations

- `<input type="file" accept="image/*">` triggers native picker with Camera/Photo Library
- `capture="environment"` forces camera — **avoid** (removes Photo Library option)
- HEIC files from iPhone are auto-converted to JPEG by Safari's file picker
- `navigator.vibrate()` is **not supported** on iOS — skip haptic feedback
- Safe area insets needed for bottom bar: `env(safe-area-inset-bottom)`
- Add `env(safe-area-inset-bottom)` padding to `WizardNavBar`

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| IndexedDB storage quota exceeded | Low | High | Show warning at 80%; implement photo cleanup for deleted recipes |
| Canvas OOM on very large images | Low | Medium | Downscale in steps (50% → target) rather than single resize |
| iOS Safari IndexedDB bugs | Low | High | Wrap all IDB operations in try/catch with localStorage fallback for small images |
| Wizard feels slower than single form for power users | Medium | Low | Desktop retains single-form layout; wizard is mobile-only |
| Photo URLs leak as object URLs (memory) | Medium | Medium | `usePhotoUrl` hook with cleanup on unmount; LRU cache with max 20 entries |

---

## Success Criteria

- [ ] User can tap "Create" → upload photo from camera roll → fill name + simulation → save — under 30 seconds
- [ ] Photo upload works on iPhone Safari 16+ (iOS 16+)
- [ ] Compressed photos are <500KB each
- [ ] Wizard step transitions feel smooth (no jank, 60fps)
- [ ] Save bar never overlaps with navigation
- [ ] Photo delete works on touch devices without hover
- [ ] Desktop experience unchanged (single-form layout preserved)
- [ ] All existing tests pass; new tests cover photo upload + wizard navigation
