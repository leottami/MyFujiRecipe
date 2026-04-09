# Design Spec — Mobile Experience Review

**Date**: 2025-07-15
**Scope**: iPhone Safari (375–430px), touch targets, spacing, flows, accessibility
**Breakpoints tested**: 320px, 375px, 390px (iPhone 14/15), 428px (iPhone 14 Plus)

---

## Executive Summary

The app has a solid editorial foundation. The wizard, BottomNav safe-area handling, and overall type scale are well-tuned for mobile. This audit uncovered **8 findings** — mostly touch-target sizing and spacing tweaks that will meaningfully improve the thumb-zone experience on iPhones.

---

## Findings

### F1 — RecipeCard: Favorite & Camera Buttons Too Small (Critical)

**File**: `src/components/recipe/RecipeCard.tsx`
**Lines**: Heart button (L44–L67), Camera button (L70–L88)

**Problem**: Both action buttons use `p-1` padding with a 16×16 SVG icon. That yields ~24×24px total touch area — well below the 44×44px minimum (Apple HIG / WCAG 2.5.5).

**Fix**:
- Increase padding from `p-1` to `p-2.5` (10px each side → 36+px total)
- Increase SVG from 16→20px
- Add `min-w-11 min-h-11` (44px) to guarantee minimum touch area
- On mobile: buttons should be always-visible (not hover-gated) since there's no hover state on touch devices

```tsx
// Before
className="absolute bottom-3 left-3 p-1 transition-all ..."

// After
className="absolute bottom-3 left-3 p-2.5 min-w-11 min-h-11 flex items-center justify-center transition-all ..."
```

**Mobile visibility**: The `opacity-0 group-hover:opacity-100` pattern hides the camera button entirely on touch devices. Add a media query or always show on mobile:
```css
@media (hover: none) {
  .group .group-hover\:opacity-100 { opacity: 1; }
}
```
Or more targeted: use a `touch:opacity-100` Tailwind variant.

---

### F2 — FeaturedCard: Favorite Button Needs Larger Target (High)

**File**: `src/components/recipe/FeaturedCard.tsx`
**Line**: L74

**Problem**: `p-2` with 20×20 SVG = 36×36px total. Close but still under 44px minimum.

**Fix**: Increase to `p-3 min-w-11 min-h-11`.

---

### F3 — FilterBar: Tag Pills & "Filters" Button Vertically Undersized (High)

**File**: `src/components/feed/FilterBar.tsx`

**Problem**: `PillToggle` uses `px-3 py-1.5` — the vertical padding is only 6px. With 10px font, total height is ~22px. The "Filters" expand button also uses `py-2` (~32px). Both are below 44px minimum height.

**Fix**:
- Change `py-1.5` → `py-2.5` on `PillToggle` (gives ~38px, acceptable for inline chips per Apple HIG exceptions for scrollable rows)
- Change the "Filters" expand button to `min-h-11 py-3` for full 44px compliance
- The tag row is scrollable, so slightly smaller is acceptable — but not 22px

---

### F4 — RecipeDetailPage: Action Buttons Cramped on Small Screens (Medium)

**File**: `src/pages/RecipeDetailPage.tsx`
**Lines**: L149–L192

**Problem**: The action buttons (Edit, Favorite, Camera, Source) use `px-4 py-2` = ~32px height. They wrap on 375px screens and the "Source →" link is easy to miss. The entire row sits on the hero gradient which can suffer from poor contrast on light photos.

**Fix**:
- Increase button height: `py-2.5 min-h-11`
- On mobile, stack the action row into a 2×2 grid instead of flex-wrap:
  ```html
  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
  ```
- Add a subtle `text-shadow` or increase gradient intensity to ensure contrast on any hero photo

---

### F5 — Profile Page: Camera Slot Grid Too Tight on Small Phones (Medium)

**File**: `src/pages/ProfilePage.tsx`
**Lines**: 3×2 grid with `gap-3`

**Problem**: 3 columns on 375px with gap-3 leaves each slot ~107px wide. On 320px (iPhone SE), it's ~93px — barely usable for the slot labels and remove actions. The "Drag from collection" instruction doesn't apply on mobile (no drag-and-drop on touch).

**Fix**:
- On screens < 375px, switch to 2 columns: `grid-cols-2 sm:grid-cols-3`
- Replace drag instructions with tap-to-add on mobile:
  ```
  "Tap a recipe to load · Swipe to remove"
  ```

---

### F6 — Collection Cards: Drag-to-Add Doesn't Work on Mobile (Medium)

**File**: `src/pages/ProfilePage.tsx`
**Lines**: L142–L170

**Problem**: The collection section relies on HTML drag-and-drop (`draggable`, `onDragStart`) which doesn't work on mobile Safari. Favorite recipe cards have no way to be loaded to camera on mobile.

**Fix**: Add an "Add to Camera" button overlay visible on mobile (or long-press action). Example:
- Show a small `+` button on each collection card when not on camera and camera isn't full
- On tap, trigger `addToCamera(recipe.id)`

---

### F7 — BottomNav: Touch Targets Slightly Under 44px (Low)

**File**: `src/components/layout/BottomNav.tsx`
**Lines**: Nav items use `px-3 py-1`

**Problem**: `py-1` = 4px top/bottom + icon 20px + label ~12px ≈ 40px total. Close but slightly under on the vertical axis.

**Fix**: Increase to `py-2` for 44px+ vertical height.

---

### F8 — MobileHeader: Search/Close Button Adequate but Misaligned (Low)

**File**: `src/components/layout/MobileHeader.tsx`

**Problem**: Search and close buttons use `p-2` with 20×20 SVG = 36px. Combined with `-mr-2` / `-ml-2`, the visual area is offset. Not a blocking issue but has room to improve.

**Fix**: Use `min-w-11 min-h-11 flex items-center justify-center` to standardize the hit area.

---

## Summary Table

| ID | Severity | Component | Issue | Fix |
|----|----------|-----------|-------|-----|
| F1 | Critical | RecipeCard | Heart/Camera buttons 24px, invisible on touch | Enlarge to 44px, always-visible on touch |
| F2 | High | FeaturedCard | Favorite button 36px | Enlarge to 44px |
| F3 | High | FilterBar | Pills 22px tall, Filters button 32px | Increase vertical padding |
| F4 | Medium | RecipeDetailPage | Action buttons 32px, flex-wrap cramped | 2×2 grid on mobile, min-h-11 |
| F5 | Medium | ProfilePage | 3-col camera grid tight on SE | 2-col on small screens |
| F6 | Medium | ProfilePage | Drag-and-drop doesn't work on mobile | Add tap-to-camera button |
| F7 | Low | BottomNav | Nav items ~40px tall | Increase py to 44px |
| F8 | Low | MobileHeader | Search button 36px, offset | Standardize to 44px |

---

## Positive Findings (No Change Needed)

- **WizardLayout**: Header cancel button correctly uses `min-w-11 min-h-11` — gold standard
- **WizardNavBar**: All buttons use `min-h-11` — good
- **BottomNav safe-area**: `env(safe-area-inset-bottom)` correctly used — good
- **Wizard content padding**: Uses `calc(4rem + env(safe-area-inset-bottom))` — good
- **Reduced motion**: All custom animations respect `prefers-reduced-motion` — good
- **Focus-visible rings**: Global `:focus-visible` styles properly set — good
- **Step indicator & slide animations**: Smooth and responsive — good
- **Search mode**: Input expands full width with proper keyboard focus — good

---

## Recommended Priority Order

1. **F1** — RecipeCard buttons (most tapped element, affects every user)
2. **F3** — FilterBar pills (primary discovery mechanism)
3. **F6** — Collection drag-to-add (broken feature on mobile)
4. **F4** — Detail page action buttons (second most visited page)
5. **F2** — FeaturedCard favorite
6. **F5** — Camera grid on small phones
7. **F7** — BottomNav padding
8. **F8** — MobileHeader button sizing
