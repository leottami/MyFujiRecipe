---
name: stitch-integration
description: Import and implement designs from Google Stitch. Use when converting Stitch prototypes to production code. Ensures pixel-perfect design fidelity.
---

# Stitch Integration

## Purpose
Convert Google Stitch designs into production-ready React components while maintaining exact design fidelity.

## When to Use
- User mentions existing Stitch designs or project
- Implementing screens that were already designed in Stitch
- Extracting design tokens from Stitch projects
- Need to ensure pixel-perfect implementation of approved designs

## Prerequisites
- Stitch MCP server configured (check `.mcp.json`)
- Stitch project exists with screens designed
- Design system finalized in Stitch
- Target tech stack: React 19 + Vite + Tailwind CSS

## Workflow

### Phase 1: Discovery & Extraction

**1. List available Stitch projects**
```typescript
// Use: mcp__stitch__list_projects
```

**2. Identify target project**
- User provides project name or ID
- Verify project exists and is accessible
- Check last update timestamp

**3. List screens in project**
```typescript
// Use: mcp__stitch__list_screens with projectId
```

**4. Extract design system**
```typescript
// Use: mcp__stitch__list_design_systems with projectId
```

### Phase 2: Design Spec Artifact

Create `./artifacts/design_spec_[feature].md` following this structure:

```markdown
# Design Spec: [Feature Name]

## Source
- **Stitch Project ID**: [projectId]
- **Project Name**: [title]
- **Last Updated**: [updateTime]
- **Design Philosophy**: [Extract from designTheme.designMd]

## Design Tokens

### Color Palette
[Extract from designTheme.namedColors]
```typescript
export const colors = {
  background: '#faf9f5',
  primary: '#5f5e5f',
  secondary: '#5f5f5b',
  // ... all colors
}
```

### Typography
- **Headline Font**: [designTheme.headlineFont]
- **Body Font**: [designTheme.bodyFont]
- **Label Font**: [designTheme.labelFont]

### Spacing
- **Scale**: [designTheme.spacingScale]
- **Calculation**: base × scale

### Border Radius
- **Strategy**: [designTheme.roundness]
- **Values**: [Map ROUND_FOUR to specific values]

## Screens

### [Screen Title]
- **Screen ID**: [screenId]
- **Device Type**: [MOBILE/DESKTOP]
- **Dimensions**: [width] × [height]px
- **Screenshot**: [Link to downloadUrl]
- **HTML Code**: [Link to htmlCode.downloadUrl]

**Purpose**: [Describe the screen's purpose]

**Key Components**:
- [Component 1]
- [Component 2]

**User Interactions**:
- [Interaction 1]
- [Interaction 2]

## Design Philosophy

[Extract and summarize key principles from designMd]

### Core Principles
1. [Principle 1]
2. [Principle 2]

### Rules
**Do**:
- ✅ [Do 1]
- ✅ [Do 2]

**Don't**:
- ❌ [Don't 1]
- ❌ [Don't 2]

## Component Mapping

| Stitch Element | React Component | File Path |
|----------------|-----------------|-----------|
| Recipe Card | RecipeCard | components/Recipe/RecipeCard.tsx |
| Nav Bar | Navigation | components/Navigation.tsx |
```

### Phase 3: HTML Analysis

For each screen to implement:

**1. Download Stitch HTML**
```typescript
// Use: WebFetch to download from screen.htmlCode.downloadUrl
// Store in: ./scratchpad/stitch_html_[screen_name].html
```

**2. Analyze structure**
- Identify reusable components
- Map inline styles to design tokens
- Document component hierarchy
- Note custom interactions

**3. Extract patterns**
- Layout patterns (grid, flex)
- Spacing patterns
- Component composition
- Responsive behavior

### Phase 4: Implementation

**1. Create design tokens file**
```typescript
// src/design-tokens.ts
// Extract exact values from Stitch designTheme

export const colors = {
  // From namedColors
  background: '#faf9f5',
  primary: '#5f5e5f',
  // ...
} as const;

export const typography = {
  headline: ['Manrope', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  label: ['Inter', 'sans-serif'],
} as const;

export const spacing = {
  // Calculate from spacingScale
  scale: 3,
  base: 4, // 4px
  // 1: 4px, 2: 8px, 3: 12px, etc.
} as const;

export const borderRadius = {
  // From roundness
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;
```

**2. Configure Tailwind**
```javascript
// tailwind.config.js
import { colors, typography, borderRadius } from './src/design-tokens';

export default {
  theme: {
    extend: {
      colors,
      fontFamily: {
        headline: typography.headline,
        body: typography.body,
        label: typography.label,
      },
      borderRadius,
    }
  }
}
```

**3. Generate React components**
- Convert Stitch HTML to semantic JSX
- Apply Tailwind classes using design tokens
- Add TypeScript types
- Implement component props for reusability
- Handle responsive behavior

**4. File structure**
```
src/
├── components/
│   └── [Feature]/
│       ├── [ComponentName].tsx
│       └── index.ts
├── pages/
│   └── [ScreenName].tsx
├── design-tokens.ts
└── App.tsx
```

### Phase 5: Quality Gates

**Visual Fidelity**
- [ ] Screenshot matches Stitch preview
- [ ] Colors match exact hex values
- [ ] Typography (family, size, weight, line-height) matches
- [ ] Spacing matches design system scale
- [ ] Border radius matches roundness strategy

**Responsive Behavior**
- [ ] Verified on target device types (mobile/desktop)
- [ ] Breakpoints align with Stitch preview
- [ ] Layout adapts correctly

**Accessibility**
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1)
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels for screen readers
- [ ] Focus states visible

**Code Quality**
- [ ] Tests pass (Vitest)
- [ ] Linter passes (Biome)
- [ ] Type checker passes (TypeScript strict)
- [ ] Build succeeds (Vite)
- [ ] No console errors/warnings

**Design System Adherence**
- [ ] Follows "Do's" from Stitch designMd
- [ ] Avoids "Don'ts" from Stitch designMd
- [ ] Implements design philosophy correctly
- [ ] Uses only defined design tokens (no arbitrary values)

## Design Token Mapping

### Stitch Roundness → Tailwind
```typescript
const roundnessMap = {
  ROUND_NONE: { none: '0' },
  ROUND_FOUR: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', xl: '0.75rem' },
  ROUND_FULL: { full: '9999px' },
};
```

### Stitch Spacing Scale → Tailwind
```typescript
// spacingScale = 3
// base = 4px
const spacing = {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  // Scale by factor of spacingScale
};
```

### Stitch Named Colors → CSS Variables
```css
:root {
  --color-background: #faf9f5;
  --color-primary: #5f5e5f;
  --color-surface: #faf9f5;
  --color-surface-container-low: #f4f4ef;
  /* ... all namedColors */
}
```

## Anti-Patterns

❌ **Don't guess or eyeball values**
- Use exact hex values from `namedColors`
- Don't use arbitrary Tailwind values like `w-[247px]`

❌ **Don't skip the design spec artifact**
- It's the contract between design and implementation
- Required for handoffs to `/builder`

❌ **Don't implement before analyzing Stitch HTML**
- Always download and review structure first
- Identify reusable patterns before coding

❌ **Don't deviate from design system guidelines**
- The `designMd` contains authoritative rules
- E.g., "No 1px solid borders" is a hard rule

❌ **Don't use generic component names**
- Match naming to design system language
- E.g., if Stitch uses "Signal Red" → name it `signalRed` not `danger`

## Example: Full Workflow

### User Request
```
"Implement the Recipe Feed screen from my Stitch project"
```

### Step 1: Discovery
```typescript
// 1. List projects
mcp__stitch__list_projects()
// → Found: "Fuji Recipe Hub" (ID: 9626409551350003062)

// 2. List screens
mcp__stitch__list_screens({ projectId: "9626409551350003062" })
// → Found: "Recipe Feed (Silver Halide)" (780×5176px, Mobile)

// 3. Get design system
mcp__stitch__list_design_systems({ projectId: "9626409551350003062" })
// → Extract designTheme
```

### Step 2: Create Design Spec
```markdown
# Design Spec: Recipe Feed

## Source
- Stitch Project: 9626409551350003062
- Screen: Recipe Feed (Silver Halide)
- Device: Mobile (780×5176px)

## Design Tokens
[Extract colors, fonts, spacing from designTheme]

## Design Philosophy: "Tactile Archive"
- Mid-century Fujifilm camera + gallery aesthetics
- No 1px borders - use tonal layering
- Glassmorphism for floating elements
- Asymmetric grids for gallery feel
```

### Step 3: Download & Analyze HTML
```typescript
// Download HTML
WebFetch({ url: screen.htmlCode.downloadUrl })
// → Save to ./scratchpad/stitch_html_recipe_feed.html

// Analyze structure
// → Found: RecipeCard component (repeated)
// → Found: NavigationBar (glassmorphic)
// → Found: FilterChips
```

### Step 4: Implement
```typescript
// src/design-tokens.ts
export const colors = {
  background: '#faf9f5',
  primary: '#5f5e5f',
  // ... exact from Stitch
};

// src/components/Recipe/RecipeCard.tsx
export function RecipeCard({ title, image, metadata }) {
  return (
    <article className="bg-surface-container-low rounded-md p-6">
      <img src={image} className="w-full rounded-sm" />
      <h2 className="font-headline text-2xl mt-4">{title}</h2>
      <div className="font-label text-sm text-on-surface-variant">
        {metadata}
      </div>
    </article>
  );
}
```

### Step 5: Quality Check
```bash
# Visual comparison
npm run dev
# → Screenshot and compare to Stitch

# Run gates
npm run test
npm run lint
npm run type-check
npm run build

# All pass ✅
```

## Handoff Protocol

When handing off to `/builder` or another agent:

**Required Artifacts**:
1. `./artifacts/design_spec_[feature].md` - Complete design spec
2. `./scratchpad/stitch_html_[screen].html` - Downloaded HTML (optional)

**Handoff Message Format**:
```
Implement [Screen Name] from Stitch.

Design Spec: ./artifacts/design_spec_recipe_feed.md
Stitch Project: 9626409551350003062
Screen ID: [screenId]

Key Requirements:
- Use design tokens from spec (NO arbitrary values)
- Follow "Tactile Archive" design philosophy
- Implement glassmorphism for nav bar
- Ensure asymmetric layout as per Stitch preview

Target: Mobile-first, React 19 + Tailwind
```

## MCP Tools Reference

| Tool | Usage |
|------|-------|
| `mcp__stitch__list_projects` | Discover available Stitch projects |
| `mcp__stitch__list_screens` | List screens in a project |
| `mcp__stitch__list_design_systems` | Extract design system tokens |
| `mcp__stitch__get_screen` | Get specific screen details |
| `WebFetch` | Download HTML from htmlCode.downloadUrl |

## Integration with Other Skills

**→ design-systems**: Use Stitch design tokens to populate design system
**→ interface-design**: Use Stitch screens as reference for UI patterns
**→ component-recipes**: Extract reusable patterns from Stitch HTML
**→ accessibility**: Validate Stitch designs meet WCAG standards

## Success Criteria

✅ **Design Fidelity**: Pixel-perfect to Stitch preview
✅ **Design Tokens**: All values extracted and documented
✅ **Components**: Semantic, reusable, typed
✅ **Quality Gates**: All pass (tests, linter, types, build)
✅ **Artifacts**: Design spec created and committed
✅ **Documentation**: Implementation notes in design spec
