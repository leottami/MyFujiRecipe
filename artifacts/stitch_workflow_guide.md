# Stitch-Integrated Workflow Guide

## Overview
Your Fuji Recipe Hub already has designs in Google Stitch. This guide shows how to use the Claude Agentic Framework with your existing Stitch designs.

**Skills Location**: `.claude/skills/design/stitch-integration/`
**Design System Reference**: `.claude/skills/design/stitch-integration/resources/fuji-recipe-hub.md`

## Your Stitch Project Details
- **Project ID**: `9626409551350003062`
- **Project Name**: Fuji Recipe Hub
- **Design Philosophy**: "Tactile Archive" (mid-century Fujifilm camera + gallery aesthetics)
- **Device Types**: Mobile & Desktop
- **Last Updated**: April 7, 2026

## Available Screens
1. **Fuji Recipe Feed - Desktop** (2560x2089px)
2. **Recipe Details (Silver Halide)** (780x7252px, Mobile)
3. **Photographer Profile (Silver Halide)** (780x3574px, Mobile)
4. **Recipe Feed (Silver Halide)** (780x5176px, Mobile)
5. **Recipe Creator (Silver Halide)** (780x6914px, Mobile)

## Design System Highlights
### Colors (Extracted from Stitch)
- **Background**: `#faf9f5` (paper-like off-white)
- **Primary**: `#5f5e5f` (camera body charcoal)
- **Secondary**: `#5f5f5b` (muted charcoal)
- **Tertiary**: `#b91e25` (Signal Red - use sparingly)
- **Surface Tiers**: Multiple levels for tonal layering

### Typography
- **Headlines**: Manrope (editorial, authoritative)
- **Body**: Inter (technical precision)
- **Labels**: Inter (camera metadata)

### Key Principles
- **No 1px borders** - Use background color shifts
- **Glassmorphism** for floating elements
- **Asymmetric grids** for gallery wall feel
- **Photos own 60%+ of visual real estate**
- **Generous whitespace** - "gallery wall" aesthetic

## Recommended Implementation Flow

### Option A: Full Planning + Stitch Integration (Recommended)
```bash
# 1. Create PR-FAQ
"Let's create a PR-FAQ for the Fuji Recipes app based on my Stitch designs"

# 2. Generate Design Spec from Stitch
"Pull my Fuji Recipe Hub designs from Stitch (project 9626409551350003062)
and create a design spec in ./artifacts/"

# 3. Architecture decisions
/architect "Create ADRs for the tech stack based on the design spec"

# 4. Implementation plan
/swarm-plan "Create implementation plan for MVP screens from Stitch"

# 5. Build from Stitch
"Implement the Recipe Feed screen from Stitch using the stitch-to-code workflow"
```

### Option B: Direct Implementation
```bash
# Fast track - straight to code
"Implement the Recipe Feed screen from my Stitch project (9626409551350003062)
using React 19 + Vite + Tailwind"
```

## Step-by-Step: Implementing a Stitch Screen

### 1. Extract Design Spec
```
"Create a design spec for the Recipe Feed screen from Stitch project 9626409551350003062"
```

Claude will:
- Pull screen details from Stitch API
- Extract design tokens (colors, typography, spacing)
- Document design philosophy and principles
- Create `./artifacts/design_spec_recipe_feed.md`

### 2. Download HTML
```
"Download the HTML for the Recipe Feed screen from Stitch"
```

Claude will:
- Fetch HTML from Stitch's downloadUrl
- Store in `./scratchpad/stitch_html_recipe_feed.html`
- Analyze component structure

### 3. Generate React Components
```
"Convert the Recipe Feed Stitch HTML to React components following the stitch-to-code workflow"
```

Claude will:
- Create `src/design-tokens.ts` with exact Stitch values
- Generate semantic React components
- Apply Tailwind classes matching design tokens
- Configure `tailwind.config.js`
- Add TypeScript types

### 4. Quality Check
```
"Run quality gates and create a screenshot comparison"
```

Claude will:
- Run tests, linter, type checker
- Generate screenshot for visual comparison
- Check accessibility (ARIA, contrast, keyboard nav)
- Verify responsive behavior

## Commands for Stitch Workflows

### List Your Projects
```
"Show me all my Stitch projects"
```

### View Specific Project Screens
```
"Show me all screens in my Fuji Recipe Hub Stitch project"
```

### Get Design System Details
```
"Show me the design system for Fuji Recipe Hub"
```

### Implement Specific Screen
```
"Implement the [Screen Name] from Stitch project 9626409551350003062"
```

## Tech Stack Alignment

Your Stitch designs will be implemented using:
- **Frontend**: React 19 (per tech-strategy.md)
- **Build**: Vite
- **Styling**: Tailwind CSS (configured with Stitch design tokens)
- **Linting**: Biome
- **Testing**: Vitest
- **Package Manager**: pnpm
- **Hosting**: GitHub Pages (static) or Railway (dynamic)

## Quality Gates (Always Applied)

Before any commit:
- [ ] Visual matches Stitch screenshot
- [ ] Design tokens match exactly
- [ ] Responsive on target device types
- [ ] Accessibility requirements met
- [ ] Tests pass
- [ ] Linter passes (Biome)
- [ ] Type checker passes
- [ ] Build succeeds

## File Structure

```
IamFuji/
├── artifacts/
│   ├── design_spec_*.md          # Design specs from Stitch
│   ├── adr_*.md                   # Architecture decisions
│   └── plan_*.md                  # Implementation plans
├── scratchpad/
│   └── stitch_html_*.html         # Downloaded Stitch HTML (temporary)
├── src/
│   ├── components/
│   │   └── Recipe/                # Feature components
│   ├── pages/
│   │   └── RecipeFeed.tsx         # Screen implementations
│   ├── design-tokens.ts           # Stitch design system tokens
│   └── App.tsx
├── tailwind.config.js             # Configured with Stitch tokens
└── .claude/
    └── skills/
        └── stitch-to-code.md      # Workflow automation
```

## Best Practices

### Do
✅ Always create design spec artifact first
✅ Download and analyze Stitch HTML before coding
✅ Use exact hex values from Stitch design system
✅ Follow the "No 1px borders" rule from design system
✅ Implement glassmorphism for floating elements
✅ Maintain asymmetric layouts for gallery feel

### Don't
❌ Eyeball colors or spacing - use design tokens
❌ Use arbitrary Tailwind values - define in config
❌ Skip the design spec artifact
❌ Deviate from Stitch's design philosophy
❌ Use standard Material shadows - use tonal layering

## Integration with Commands

### /architect
- Reviews Stitch design specs
- Creates ADRs based on design requirements
- Validates technical feasibility

### /builder
- Implements screens using stitch-to-code workflow
- Receives design spec artifact as input
- Ensures pixel-perfect implementation

### /qa-engineer
- Visual regression testing against Stitch screenshots
- Accessibility audits
- Responsive behavior verification

### /ui-ux-designer
- Can pull from Stitch or design from scratch
- Always checks for existing Stitch designs first
- Maintains design system consistency

## Next Steps

Ready to start? Choose your approach:

**A) Full Planning Flow**
```
"Let's create a comprehensive plan for the Fuji Recipes app using my Stitch designs"
```

**B) Direct Implementation**
```
"Let's implement the Recipe Feed screen from Stitch"
```

**C) Design Spec First**
```
"Create a design spec for all my Fuji Recipe Hub screens from Stitch"
```

## Questions?

Common queries:
- "How do I update designs in Stitch and sync to code?"
- "Can I modify the Stitch design system and regenerate?"
- "How do I handle custom interactions not in Stitch?"
- "What if I need additional screens not in Stitch?"
