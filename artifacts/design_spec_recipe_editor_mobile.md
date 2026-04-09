# Design Spec: Recipe Editor — Mobile Wizard & Photo Upload

## Overview

**Status:** Draft  
**Designer:** UI/UX Designer  
**Date:** 2026-04-09  
**Related ADR:** `adr_recipe_creation_mobile_optimization.md`  
**Approach:** Mobile-first (iPhone Safari primary target)

## Design Goals

- Reduce recipe creation from an overwhelming scroll to 4 focused steps
- Enable photo upload from camera roll / camera (not just URL paste)
- Make all interactions touch-friendly (no hover dependencies)
- Maintain the existing Fuji-inspired design language (mechanical, photographic, muted)
- Preserve desktop single-form experience unchanged

---

## Design System Reference

These tokens are already defined in `app.css` and MUST be used consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `--font-headline` | Manrope | Step titles, section headers |
| `--font-label` | Inter | Buttons, chips, micro-copy |
| `--font-body` | Inter | Input text, descriptions |
| Label style | `text-[10px] uppercase tracking-[0.15em]` | ALL label/button text |
| `--color-primary` | `#5f5e5f` | Focus states, active indicators |
| `--color-tertiary` | `#b91e25` | Signal red — errors, required markers |
| `--color-inverse-surface` | `#0d0f0d` | Primary action buttons (CTA) |
| `--color-surface-container-lowest` | `#ffffff` | Card/section backgrounds |
| `--color-surface-container-low` | `#f4f4ef` | Nav bar backgrounds (with `/80` + blur) |
| `--radius-sm` | `0.125rem` | Standard corner radius — mechanical, not rounded |
| `--shadow-card` | `0 8px 24px rgba(47,52,46,0.04)` | Card elevation |
| Film grain overlay | SVG `body::after` | Applied globally, z-9999 |

---

## User Flow (Mobile — 375pt viewport)

```
[BottomNav: Create] 
    → /recipe/new
    → BottomNav hides, WizardNavBar appears
    
    ┌─────────────────────────────────┐
    │ Step 1: PHOTOS                  │
    │ ┌─────────────────────────────┐ │
    │ │   📷  Tap to add photos     │ │
    │ │   Camera · Library · URL    │ │
    │ └─────────────────────────────┘ │
    │ [photo grid if any]             │
    │                                 │
    │ ─────────────────────────────── │
    │ [● ○ ○ ○]        [Next →]      │
    └─────────────────────────────────┘
        ↓ swipe or tap Next
    ┌─────────────────────────────────┐
    │ Step 2: ESSENTIALS              │
    │ Recipe Name*     [___________]  │
    │ Film Simulation* [Select...  ]  │
    │ Sensor           [X-Trans IV ]  │
    │ Dynamic Range    [DR Auto    ]  │
    │ Tags             [+ Tag      ]  │
    │                                 │
    │ ─────────────────────────────── │
    │ [← Back] [○ ● ○ ○] [Next →]    │
    └─────────────────────────────────┘
        ↓ validates name + simulation
    ┌─────────────────────────────────┐
    │ Step 3: SETTINGS                │
    │ ┌── Film Settings ───────────┐  │
    │ │ Grain Effect  [________]   │  │
    │ │ Color Chrome  [________]   │  │
    │ │ Chrome Blue   [________]   │  │
    │ └────────────────────────────┘  │
    │ ┌── Tone Curve ──────────────┐  │
    │ │ Highlight  [________]      │  │
    │ │ Shadow     [________]      │  │
    │ │ Color      [________]      │  │
    │ │ Sharpening [________]      │  │
    │ │ Clarity    [________]      │  │
    │ │ Noise Red. [________]      │  │
    │ └────────────────────────────┘  │
    │ ┌── Shooting ────────────────┐  │
    │ │ White Balance [________]   │  │
    │ │ ISO           [________]   │  │
    │ │ Exposure      [________]   │  │
    │ └────────────────────────────┘  │
    │ ─────────────────────────────── │
    │ [← Back] [○ ○ ● ○] [Next →]    │
    └─────────────────────────────────┘
        ↓
    ┌─────────────────────────────────┐
    │ Step 4: REVIEW                  │
    │ ┌─────────────────────────────┐ │
    │ │ [Hero Photo 21:9]           │ │
    │ │ Recipe Name                 │ │
    │ │ Classic Chrome · X-Trans IV │ │
    │ └─────────────────────────────┘ │
    │                                 │
    │ Photos (3)          [Edit →]    │
    │ ┌──┐ ┌──┐ ┌──┐                 │
    │ │  │ │  │ │  │                  │
    │ └──┘ └──┘ └──┘                  │
    │                                 │
    │ Essentials          [Edit →]    │
    │ Name: Kodachrome 64             │
    │ Film Sim: Classic Chrome        │
    │ Sensor: X-Trans IV              │
    │                                 │
    │ Settings            [Edit →]    │
    │ Highlight: +1 · Shadow: -2      │
    │ Grain: Weak, Small              │
    │                                 │
    │ ─────────────────────────────── │
    │ [← Back] [○ ○ ○ ●] [Create ✓]  │
    └─────────────────────────────────┘
        ↓ saves
    → navigate(/recipe/:id)
    → BottomNav reappears
```

---

## Component Specifications

### 1. WizardLayout

**Purpose:** Container that manages step transitions and layout structure for mobile.

**Layout:**
```
┌──────────────────────────────────────┐  ← MobileHeader (existing, stays)
│ ← Cancel          New Recipe         │     h-14, fixed top
├──────────────────────────────────────┤
│                                      │
│           Step Content               │  ← Scrollable area
│           (full viewport)            │     pt-14 pb-[calc(4rem+env(safe-area-inset-bottom))]
│                                      │
├──────────────────────────────────────┤
│ [Back]  [● ○ ○ ○ PHOTOS]  [Next]    │  ← WizardNavBar, fixed bottom
│         env(safe-area-inset-bottom)  │     replaces BottomNav
└──────────────────────────────────────┘
```

**Step Transitions (CSS-only):**
```css
/* Forward: slide left */
.wizard-slide-enter-next {
  transform: translateX(100%); opacity: 0;
}
.wizard-slide-active {
  transform: translateX(0); opacity: 1;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
/* Backward: slide right */
.wizard-slide-enter-prev {
  transform: translateX(-100%); opacity: 0;
}
```

**Timing:** 300ms transform, 200ms opacity — matches existing `pageEnter` feel.

### 2. StepIndicator

**Purpose:** Shows current progress through 4 steps.

**Layout (mobile):**
```
[● ○ ○ ○]  PHOTOS
```

**Specifications:**

| Property | Value |
|----------|-------|
| Dot size | 6px × 6px |
| Dot spacing | 6px gap |
| Active dot | `bg-on-surface` (`#2f342e`) |
| Inactive dot | `bg-outline-variant` (`#afb3ac`) |
| Dot shape | `rounded-full` (exception to mechanical radius — dots are always round) |
| Step label | `font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant` |
| Container | `flex items-center gap-2` |
| Active label | `text-on-surface font-semibold` |

**Accessibility:**
- `role="progressbar"` on container
- `aria-valuenow={currentStep}`, `aria-valuemin={1}`, `aria-valuemax={4}`
- `aria-label="Step {n} of 4: {stepName}"`

### 3. WizardNavBar

**Purpose:** Replaces BottomNav on editor pages. Houses Back, StepIndicator, Next/Create buttons.

**Layout:**
```
┌────────────────────────────────────────┐
│  [← Back]   [● ○ ○ ○ PHOTOS]  [Next →]│
│             safe-area-inset             │
└────────────────────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Position | `fixed bottom-0 left-0 right-0 z-50` |
| Background | `bg-surface-container-low/80 backdrop-blur-[20px]` (matches BottomNav) |
| Padding | `px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]` |
| Layout | `flex items-center justify-between` |
| Height | ~56px + safe area (matches BottomNav) |

**Back Button:**
| State | Style |
|-------|-------|
| Visible (step 2-4) | `font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant` |
| Hidden (step 1) | Invisible but preserves space: `invisible` |
| Tap target | min `44px × 44px` (iOS HIG minimum) |

**Next Button:**
| State | Style |
|-------|-------|
| Default | `bg-inverse-surface text-inverse-on-surface font-label text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm` |
| Disabled (validation fails) | `opacity-50 cursor-default` |
| Final step | Label changes to "Create" with checkmark icon |
| Saving | Label changes to "Saving..." with `opacity-75 animate-pulse` |
| Tap target | min `44px` height |

**"Create" button final step variant:**
```
[✓ CREATE RECIPE] — full-width, taller (py-3), same inverse-surface style
```

### 4. PhotoUploadZone

**Purpose:** Primary photo input — tap opens iPhone's native picker (camera + library).

**Layout (empty state):**
```
┌──────────────────────────────────────┐
│                                      │
│         ┌──────────────┐             │
│         │   📷 (icon)  │             │
│         └──────────────┘             │
│      TAP TO ADD PHOTOS               │
│    Camera · Photo Library            │
│                                      │
│   ─ ─ ─ ─  or  ─ ─ ─ ─             │
│                                      │
│    [PASTE IMAGE URL]                 │
│                                      │
└──────────────────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Container | `bg-surface-container-lowest rounded-sm border-2 border-dashed border-outline-variant/40` |
| Height (empty) | `min-h-[200px]` |
| Camera icon | 32px, stroke `text-on-surface-variant/40`, strokeWidth 1.5 |
| Primary label | `font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant` |
| Secondary label | `font-body text-xs text-on-surface-variant/50` |
| Divider | `font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/30` with dashed lines |
| URL toggle | `font-label text-[10px] uppercase tracking-[0.15em] text-primary underline` |

**Hidden file input:**
```html
<input type="file" accept="image/*" multiple class="sr-only" />
```
- Entire zone is tappable (wraps or triggers the file input)
- On iPhone Safari: automatically shows "Take Photo or Video" + "Photo Library" + "Choose File"
- `accept="image/*"` — no `capture` attribute (would remove Library option)

**Active/Uploading state:**
```
┌──────────────────────────────────────┐
│  ████████░░░░░░░░  Compressing...    │
│                    2 of 3            │
└──────────────────────────────────────┘
```
- Progress bar: `h-1 bg-primary rounded-full` inside `bg-surface-variant rounded-full`
- Label: `font-label text-[10px] text-on-surface-variant`

### 5. PhotoPreviewGrid

**Purpose:** Displays uploaded/URL photos with touch-friendly actions.

**Layout:**
```
┌──────────┐  ┌──────────┐
│ [HERO]   │  │          │
│  photo1  │  │  photo2  │
│       [×]│  │       [×]│
└──────────┘  └──────────┘
┌──────────┐  ┌──────────┐
│          │  │   [+]    │
│  photo3  │  │  Add     │
│       [×]│  │  More    │
└──────────┘  └──────────┘
```

**Grid Specifications:**

| Property | Value |
|----------|-------|
| Layout | `grid grid-cols-2 gap-2` |
| Photo aspect ratio | `3/2` |
| Photo border radius | `rounded-sm` (0.125rem) |
| Photo fit | `object-cover` |

**Hero Badge:**
| Property | Value |
|----------|-------|
| Position | `absolute top-1.5 left-1.5` |
| Style | `bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface` |
| Typography | `font-label text-[8px] uppercase tracking-[0.15em]` |
| Padding | `px-1.5 py-0.5` |
| Radius | `rounded-sm` |

**Delete Button (ALWAYS visible — no hover dependency):**
| Property | Value |
|----------|-------|
| Position | `absolute top-1.5 right-1.5` |
| Size | `w-6 h-6` (larger than current w-5 — better touch target) |
| Style | `bg-error/80 backdrop-blur-sm text-on-error rounded-sm` |
| Icon | × (times), `text-xs` |
| Opacity | **`opacity-100`** always (not `group-hover:opacity-100`) |
| Touch target | Effectively 44px with padding (accessibility) |

**"Add More" Card:**
| Property | Value |
|----------|-------|
| Style | `border-2 border-dashed border-outline-variant/40 rounded-sm` |
| Content | + icon + "ADD MORE" label |
| Aspect ratio | `3/2` (matches photo cells) |
| Tap effect | Triggers same file input as PhotoUploadZone |

**Tap-to-Set-Hero Interaction:**
- Tap any non-hero photo → shows inline action: "Set as hero" toast-like overlay on the photo
- Or: long-press → shows action sheet (stretch goal)
- For MVP: tap photo cycles hero designation (simpler)

### 6. PhotoStep (Wizard Step 1)

**Purpose:** Combines PhotoUploadZone + PhotoPreviewGrid into step 1 content.

**Layout:**
```
┌──────────────────────────────┐
│  PHOTOS                      │  ← Step title
│  Add photos from your camera │  ← Subtitle
│  roll or paste a URL         │
│                              │
│  ┌────────────────────────┐  │
│  │  [PhotoUploadZone]     │  │  ← Shown when 0 photos
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  [PhotoPreviewGrid]    │  │  ← Shown when 1+ photos
│  └────────────────────────┘  │
│                              │
│  Optional — skip to          │  ← Hint text
│  add photos later            │
└──────────────────────────────┘
```

**Step Title:**
| Property | Value |
|----------|-------|
| Typography | `font-headline font-bold text-lg text-on-surface` |
| Margin | `mb-1` |

**Step Subtitle:**
| Property | Value |
|----------|-------|
| Typography | `font-body text-sm text-on-surface-variant` |
| Margin | `mb-6` |

**"Optional" Hint:**
| Property | Value |
|----------|-------|
| Typography | `font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/40` |
| Position | Below grid, `mt-4 text-center` |

### 7. EssentialsStep (Wizard Step 2)

**Purpose:** Name, Film Simulation (required), Sensor, Dynamic Range, Tags.

**Layout:** Uses existing `FormField`, `FormSelect`, `TagEditor` components inside `FormSection` containers. No new components needed.

**Validation Behavior:**
- Attempting "Next" with empty name: name field gets `shake` animation + error text
- Attempting "Next" with no film simulation: select field highlighted + error text
- Errors clear on field change (existing `useRecipeForm` behavior)

**Required Field Indicator:**
- Append `*` to label text for required fields
- Or: Add `text-tertiary` colored asterisk after label

### 8. SettingsStep (Wizard Step 3)

**Purpose:** All optional film/tone/shooting settings.

**Layout:** Three `FormSection` groups (Film Settings, Tone Curve, Shooting Settings) — identical to current form structure but presented as a dedicated step.

**Enhancement — Smart Defaults Banner:**
```
┌──────────────────────────────────────┐
│  ℹ  All settings are optional.       │
│     Leave blank to use defaults.     │
└──────────────────────────────────────┘
```
| Property | Value |
|----------|-------|
| Style | `bg-primary-container/50 rounded-sm px-4 py-3 mb-6` |
| Icon | Info circle, `text-on-primary-container` |
| Text | `font-body text-xs text-on-primary-container` |

### 9. ReviewStep (Wizard Step 4)

**Purpose:** Summary of all entered data with quick-edit links back to each step.

**Layout:**
```
┌──────────────────────────────────────┐
│  REVIEW YOUR RECIPE                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [Hero Image — 21:9 aspect]    │  │
│  │                                │  │
│  │  Recipe Name                   │  │
│  │  Classic Chrome · X-Trans IV   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌── Photos (3) ──────── [Edit] ──┐  │
│  │  [thumb] [thumb] [thumb]       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌── Essentials ──────── [Edit] ──┐  │
│  │  Name         Kodachrome 64    │  │
│  │  Film Sim     Classic Chrome   │  │
│  │  Sensor       X-Trans IV      │  │
│  │  DR           DR200            │  │
│  │  Tags         street, travel   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌── Film Settings ───── [Edit] ──┐  │
│  │  Grain        Weak, Small      │  │
│  │  Chrome       Strong           │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌── Tone & Shooting ─── [Edit] ─┐  │
│  │  Highlight    +1               │  │
│  │  Shadow       -2               │  │
│  │  WB           Daylight         │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Summary Card (hero):**
| Property | Value |
|----------|-------|
| Container | `bg-surface-container-lowest rounded-sm overflow-hidden shadow-card` |
| Hero image | `aspect-ratio: 21/9`, `object-cover`, `w-full` |
| Name | `font-headline font-bold text-base text-on-surface px-4 pt-3` |
| Metadata line | `font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant px-4 pb-3` |

**Review Section:**
| Property | Value |
|----------|-------|
| Header | `flex justify-between items-center mb-2` |
| Title | `font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50` |
| Edit link | `font-label text-[10px] uppercase tracking-[0.15em] text-primary` |
| Container | `bg-surface-container-lowest rounded-sm p-4 mb-4` |
| Key-value row | `flex justify-between py-1.5 border-b border-surface-variant/50 last:border-0` |
| Key | `font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant` |
| Value | `font-body text-sm text-on-surface` |

**Empty Fields:** Omit from review (don't show "—" for 15+ blank optional fields).

**Edit Links:** Clicking "Edit" navigates back to that wizard step (setStep(n)).

### 10. MobileHeader Modification (Editor Mode)

**Current:** Shows "The Archive" + search icon.  
**On Editor Pages:** Replace with editor-specific header.

```
┌──────────────────────────────────────┐
│  ← Cancel          New Recipe        │
└──────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Cancel link | `font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant` → navigates to `/` or `/recipe/:id` |
| Title | `font-headline font-bold text-sm text-on-surface` |
| Layout | `flex items-center justify-between w-full` |

**Implementation:** Either modify MobileHeader to accept an `editorMode` prop, or render a custom header inside the wizard layout and hide MobileHeader on editor routes.

---

## Responsive Behavior

### Breakpoint Strategy

| Viewport | Layout | Component |
|----------|--------|-----------|
| < 1024px (mobile/tablet) | 4-step wizard | `WizardLayout` |
| ≥ 1024px (desktop) | Single-scroll form (existing) | `RecipeEditorForm` (current, unchanged) |

Uses `useMediaQuery("(max-width: 1023px)")` hook — CSS `lg:` breakpoint matches existing Tailwind config.

### Safe Area Insets (iPhone)

Critical for iPhone X+ with home indicator:

```css
/* WizardNavBar bottom padding */
padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
```

The existing BottomNav does NOT have safe area handling — this is a **bug fix** that should be applied to BottomNav too.

Add to `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

## Animation Specifications

### Step Transitions

| Animation | Duration | Easing | Property |
|-----------|----------|--------|----------|
| Slide forward | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | `transform: translateX` |
| Slide backward | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | `transform: translateX` |
| Fade in | 200ms | `ease` | `opacity` |

### Photo Upload

| Animation | Duration | Easing |
|-----------|----------|--------|
| Photo appear in grid | 300ms | `fadeInUp` (existing keyframe) |
| Delete photo | 200ms | `opacity` + `scale(0.95)` to 0 |
| Progress bar fill | linear, matches actual progress | — |

### Validation Error

| Animation | Existing? |
|-----------|-----------|
| Field shake | Yes — `shake` keyframe already in `app.css` |
| Error text appear | Instant (no animation needed) |

---

## Accessibility Requirements (WCAG 2.1 AA)

### Touch Targets
- All interactive elements: minimum **44×44px** touch target (iOS HIG)
- Current delete button (w-5 = 20px) is too small — increased to w-6 with padding to reach 44px effective area

### Focus Management
- When wizard step changes: focus moves to step title (`h2`)
- Existing `*:focus-visible` ring (`2px solid primary`) applies
- Keyboard: Tab navigates within step; Enter triggers Next; Escape triggers Back

### Screen Reader
- `StepIndicator`: `role="progressbar"` with `aria-valuenow`
- `PhotoUploadZone`: `aria-label="Upload photos. Tap to select from camera or photo library"`
- `PhotoPreviewGrid` items: `aria-label="{role} photo, {index} of {total}"`
- Delete buttons: `aria-label="Remove photo {index}"`
- Wizard navigation: `aria-label="Wizard navigation"`

### Color Contrast
- All text tokens already verified against WCAG AA:
  - `on-surface` (#2f342e) on `background` (#faf9f5) → **13.2:1** ✓
  - `on-surface-variant` (#5c605a) on `background` (#faf9f5) → **5.7:1** ✓
  - `inverse-on-surface` (#9d9d9a) on `inverse-surface` (#0d0f0d) → **7.1:1** ✓
  - `on-error` (#fff7f6) on `error` (#9f403d) → **5.2:1** ✓

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .wizard-slide-active { transition: none; }
}
```

---

## State Matrix

### Wizard States

| State | Back | Next | Create | Indicator |
|-------|------|------|--------|-----------|
| Step 1 (Photos) | Hidden | Enabled | — | `● ○ ○ ○` |
| Step 2 (Essentials) | Enabled | Enabled if valid | — | `○ ● ○ ○` |
| Step 2, invalid | Enabled | Shake + error | — | `○ ● ○ ○` |
| Step 3 (Settings) | Enabled | Enabled | — | `○ ○ ● ○` |
| Step 4 (Review) | Enabled | — | Enabled | `○ ○ ○ ●` |
| Saving | Disabled | — | "Saving..." + disabled | `○ ○ ○ ●` |

### Photo Upload States

| State | Zone Appearance | Grid |
|-------|-----------------|------|
| No photos | Upload zone (full height, dashed border) | Hidden |
| Uploading | Progress bar + "Compressing..." | Previous photos shown |
| Has photos | "Add More" card in grid | Visible with thumbnails |
| Upload error | Toast: "Failed to process image. Try another photo." | Unchanged |

### Photo Card States

| State | Visual |
|-------|--------|
| Default | Photo thumbnail, delete button visible |
| Hero | "HERO" badge top-left |
| Tapped (set hero) | Brief flash of `bg-primary/20` overlay, then hero badge moves |

---

## Error Handling

| Error | Display | Recovery |
|-------|---------|----------|
| Image too large (>20MB raw) | Toast: "Image too large. Max 20MB." | Auto-dismiss 4s |
| Compression fails | Toast: "Couldn't process image. Try another." | Auto-dismiss 4s |
| IndexedDB unavailable | Fall back to URL-only mode; toast: "Photo upload unavailable in this browser" | Persistent info |
| Validation on step 2 | Inline errors under fields + shake animation | User corrects field |
| Save fails | Error banner in review step (existing pattern) | Retry button |

---

## Desktop Behavior (≥ 1024px)

**No wizard.** Desktop retains the current single-scroll form with these fixes only:

1. **PhotoUploadZone** added above URL input in the Photos `FormSection`
2. **Photo delete buttons** always visible (remove `group-hover:opacity-100`)
3. **Save bar** — already `lg:relative` positioned (working correctly)

This means `PhotoUploadZone` and `PhotoPreviewGrid` are shared components used by both mobile wizard and desktop form.

---

## Implementation Notes for Builder

### CSS Classes Needed (add to `app.css`)

```css
/* Wizard step transitions */
@keyframes wizardSlideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
@keyframes wizardSlideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
@keyframes wizardSlideOutLeft {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(-100%); opacity: 0; }
}
@keyframes wizardSlideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}

.wizard-enter-next  { animation: wizardSlideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) both; }
.wizard-enter-prev  { animation: wizardSlideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) both; }
.wizard-exit-next   { animation: wizardSlideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) both; }
.wizard-exit-prev   { animation: wizardSlideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) both; }

@media (prefers-reduced-motion: reduce) {
  .wizard-enter-next,
  .wizard-enter-prev,
  .wizard-exit-next,
  .wizard-exit-prev {
    animation: none;
  }
}
```

### BottomNav Visibility

```tsx
// BottomNav.tsx — hide on editor routes
const isEditor = /^\/recipe\/(new|[^/]+\/edit)/.test(location.pathname);
if (isEditor) return null;
```

### Shared Components (Mobile + Desktop)

These components must work in both contexts:
- `PhotoUploadZone` — used in PhotoStep (wizard) and FormSection (desktop)
- `PhotoPreviewGrid` — used in PhotoStep (wizard) and FormSection (desktop)
- All existing `FormField`, `FormSelect`, `FormSection`, `TagEditor` — used in wizard steps AND desktop form

### File Input Trigger Pattern

```tsx
const fileInputRef = useRef<HTMLInputElement>(null);

// Entire zone click triggers file picker
<div onClick={() => fileInputRef.current?.click()}>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    className="sr-only"
    onChange={handleFiles}
  />
  {/* Zone content */}
</div>
```

---

## Handoff

- **To `/builder`**: Implement Phase 1 (photo upload infrastructure) first, then Phase 2 (wizard)
- **To `/swarm-review`**: After implementation for accessibility audit + iPhone Safari testing
