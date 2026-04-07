# Fuji Recipe Hub - Stitch Design System Reference

**Project ID**: `9626409551350003062`
**Last Synced**: April 7, 2026
**Design Philosophy**: "Tactile Archive"

## Design Philosophy

The design system bridges the mechanical precision of a mid-century Fujifilm camera with the airy, silent atmosphere of a contemporary photography gallery. The app is a curated object, not a utility.

**Creative North Star**: The Modern Curator

## Core Design Principles

### 1. The Gallery Wall
- Generous whitespace is mandatory
- Asymmetric layouts over rigid grids
- Photography owns 60%+ of visual real estate
- Editorial feel over utility app

### 2. Mechanical Precision
- Typography serves as "technical manual"
- Camera metadata prominently displayed
- Sharp, mechanical UI elements (shutter button feel)
- No 1px borders - only tonal layering

### 3. Premium Materials
- Glassmorphism for floating elements (frosted lens effect)
- Subtle gradients for tactile "button" feel
- Paper-white background (#faf9f5) prevents screen fatigue
- Ambient shadows (never pure black)

## Design Tokens

### Color Palette

```typescript
export const colors = {
  // Background
  background: '#faf9f5',           // Paper-white canvas

  // Primary (Camera Body)
  primary: '#5f5e5f',              // Main charcoal
  primary_container: '#e5e2e3',
  primary_dim: '#535253',
  primary_fixed: '#e5e2e3',
  primary_fixed_dim: '#d6d4d5',
  on_primary: '#faf7f8',
  on_primary_container: '#525152',
  on_primary_fixed: '#403f40',
  on_primary_fixed_variant: '#5c5b5c',

  // Secondary (Muted Charcoal)
  secondary: '#5f5f5b',
  secondary_container: '#e4e2dd',
  secondary_dim: '#535350',
  secondary_fixed: '#e4e2dd',
  secondary_fixed_dim: '#d6d4cf',
  on_secondary: '#fbf9f4',
  on_secondary_container: '#52524e',
  on_secondary_fixed: '#3f3f3c',
  on_secondary_fixed_variant: '#5c5c58',

  // Tertiary (Signal Red - Use Sparingly!)
  tertiary: '#b91e25',             // Record indicator red
  tertiary_container: '#fc504d',
  tertiary_dim: '#a80c1a',
  tertiary_fixed: '#fc504d',
  tertiary_fixed_dim: '#ea4342',
  on_tertiary: '#fff7f6',
  on_tertiary_container: '#1f0001',
  on_tertiary_fixed: '#000000',
  on_tertiary_fixed_variant: '#3b0003',

  // Surface Layers (Tonal Layering)
  surface: '#faf9f5',
  surface_bright: '#faf9f5',
  surface_container: '#edeee8',
  surface_container_high: '#e7e9e2',
  surface_container_highest: '#e0e4db',
  surface_container_low: '#f4f4ef',
  surface_container_lowest: '#ffffff',
  surface_dim: '#d7dcd2',          // Inactive/historical states
  surface_tint: '#5f5e5f',
  surface_variant: '#e0e4db',

  // Text
  on_background: '#2f342e',
  on_surface: '#2f342e',
  on_surface_variant: '#5c605a',

  // Inverse
  inverse_on_surface: '#9d9d9a',
  inverse_primary: '#ffffff',
  inverse_surface: '#0d0f0d',

  // Outlines
  outline: '#787c75',
  outline_variant: '#afb3ac',      // Use at 15% opacity for "ghost borders"

  // Error
  error: '#9f403d',
  error_container: '#fe8983',
  error_dim: '#4e0309',
  on_error: '#fff7f6',
  on_error_container: '#752121',
} as const;
```

### Typography

```typescript
export const typography = {
  // Headlines - Editorial "Gallery Labels"
  headline: ['Manrope', 'sans-serif'],  // Geometric, authoritative

  // Body - Technical "Specifications"
  body: ['Inter', 'sans-serif'],        // Tall x-height, high legibility

  // Labels - Camera metadata
  label: ['Inter', 'sans-serif'],       // Small sizes, technical
} as const;

// Typography Scale
export const typographyScale = {
  'display-lg': '3.5rem',    // Hero titles
  'headline-md': '1.75rem',  // Photo titles, category headers
  'body-md': '1rem',         // Descriptions
  'label-sm': '0.875rem',    // Camera metadata (ISO, Aperture, Shutter)
} as const;
```

### Spacing

```typescript
// Spacing Scale: 3 (from Stitch)
// Base: 4px
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
} as const;

// Vertical rhythm: Always more whitespace than expected
// Lead with whitespace - let designs "breathe"
```

### Border Radius

```typescript
// Roundness: ROUND_FOUR (from Stitch)
// Strategy: Sharp, mechanical feel (NOT bubbly consumer-grade)
export const borderRadius = {
  none: '0',            // Preferred for primary containers
  sm: '0.125rem',       // Mechanical "shutter button"
  md: '0.25rem',        // Default for most containers
  lg: '0.5rem',         // Subtle curves
  xl: '0.75rem',        // AVOID - too bubbly
  full: '9999px',       // AVOID - too consumer-grade
} as const;

// Default to 'none', 'sm', or 'md' for premium feel
```

## Component Rules

### Buttons

**Primary (Solid)**
```tsx
<button className="bg-primary text-on-primary rounded-sm hover:bg-primary-dim">
  {/* Sharp, mechanical shutter button feel */}
</button>
```

**Secondary (Tactile)**
```tsx
<button className="bg-surface-container-high border border-outline-variant/15">
  {/* Inset dial, recessed button feel */}
</button>
```

### Cards & Lists

**FORBIDDEN**: Horizontal divider lines
```tsx
// ❌ NO
<div className="border-b border-gray-300" />

// ✅ YES - Use vertical whitespace or background shift
<div className="mb-6" />  {/* Vertical spacing */}
<div className="bg-surface-container-low" />  {/* Tonal separation */}
```

**Asymmetric Grids**
```tsx
// Gallery wall layout - stagger alignment
<div className="grid grid-cols-2 gap-6">
  <div className="mt-0">...</div>
  <div className="mt-10">...</div>  {/* Offset for curatorial feel */}
</div>
```

### Inputs (The "Manual" Input)

```tsx
<input
  className="
    bg-transparent
    border-b-2 border-surface-variant
    focus:border-primary
    placeholder:text-label placeholder:uppercase placeholder:tracking-wide
  "
/>
{/* No enclosing boxes. Bottom-stroke only. Labels in all-caps */}
```

### Glassmorphism (Floating Elements)

```tsx
<nav className="
  bg-surface-container-low/80
  backdrop-blur-[20px]
  {/* Frosted lens effect */}
">
  ...
</nav>
```

### Metadata Chips

```tsx
<span className="
  inline-block
  px-3 py-1
  bg-secondary-container
  text-on-secondary-container
  rounded-md
  font-label text-sm
">
  ISO 400
</span>
{/* Small printed labels on film canister */}
```

## Design Rules (Mandatory)

### Do ✅

1. **Use `surface_dim` for inactive states** - Gives weathered, analog feel
2. **Embrace asymmetry** - Offset photos by 10% for premium feel
3. **Use `tertiary` surgically** - Only for "Live" or "Critical" states
4. **Lead with whitespace** - Display titles need room to breathe
5. **Define boundaries through tonal shifts** - Not borders

### Don't ❌

1. **NO `xl` or `full` roundedness** - Makes app look bubbly/consumer-grade
2. **NO 1px solid borders** - Use background color shifts instead
3. **NO high-contrast borders** - If shift isn't enough, layout is cluttered
4. **NO crowding photography** - Photos own 60%+ of screen
5. **NO pure black shadows** - Use ambient shadows tinted with `on-surface`

## Elevation System

**Tonal Layering** (not traditional shadows)

```tsx
// Layer 1 (lowest)
<div className="bg-surface-container-lowest">
  {/* Base layer */}
</div>

// Layer 2 (lifted)
<div className="bg-surface-container">
  {/* Feels like stacked cotton paper */}
</div>

// Floating element (special case)
<div className="shadow-[0_24px_48px_rgba(47,52,46,0.06)]">
  {/* Ambient shadow - tinted with on-surface, 6% opacity */}
</div>
```

## Ghost Border (Accessibility Fallback)

```tsx
// If boundary MUST be visible for accessibility
<div className="border border-outline-variant/15">
  {/* 15% opacity creates "suggestion" not hard stop */}
</div>
```

## Specialized Components

### The Exposure Slider

```tsx
<input
  type="range"
  className="
    [&::-webkit-slider-track]:bg-outline-variant
    [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:h-8
    [&::-webkit-slider-thumb]:bg-primary
  "
/>
{/* Thumb is vertical line mimicking aperture ring */}
```

### Signature Gradients (Primary CTAs)

```tsx
<button className="
  bg-gradient-to-b from-primary to-primary-dim
  {/* Tactile button feel */}
">
  Create Recipe
</button>
```

## Responsive Strategy

### Device Types (from Stitch)
- **Mobile**: 780px (default)
- **Desktop**: 2560px

### Breakpoints
```typescript
export const breakpoints = {
  sm: '640px',
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',
} as const;
```

## Accessibility Requirements

- **Contrast**: Minimum 4.5:1 (WCAG AA)
- **Focus states**: Always visible (no outline-none)
- **Touch targets**: 48px minimum
- **Screen reader**: ARIA labels for all interactive elements

## Screens in Stitch

1. **Recipe Feed (Mobile)** - 780×5176px - Asymmetric grid of recipes
2. **Recipe Details (Mobile)** - 780×7252px - Hero photo + metadata
3. **Photographer Profile (Mobile)** - 780×3574px - Profile + gallery
4. **Recipe Creator (Mobile)** - 780×6914px - Form with manual input style
5. **Desktop Feed** - 2560×2089px - Multi-column layout

## Implementation Checklist

Before committing:
- [ ] Colors match exact hex values from this reference
- [ ] Typography uses Manrope (headlines) + Inter (body/labels)
- [ ] No 1px borders used (tonal layering only)
- [ ] Border radius is `none`, `sm`, or `md` (no `xl` or `full`)
- [ ] Glassmorphism applied to floating navigation
- [ ] Asymmetric layouts for photo grids
- [ ] Tertiary color used sparingly (only critical states)
- [ ] Photos own 60%+ of screen real estate
- [ ] Generous whitespace maintained
- [ ] Ghost borders at 15% opacity (if needed for a11y)
