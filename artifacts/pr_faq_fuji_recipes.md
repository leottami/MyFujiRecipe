# PR-FAQ: Fuji Recipe Hub

**Date**: April 7, 2026
**Author**: Product Team
**Status**: Draft
**Design Source**: Google Stitch Project 9626409551350003062

---

## Press Release

### FOR IMMEDIATE RELEASE

**Fuji Recipe Hub Launches: The Photography Gallery for Film Simulation Recipes**

*A curated platform where Fujifilm photographers discover, share, and perfect their signature color recipes*

**April 2026** — Today we're launching Fuji Recipe Hub, a dedicated platform that transforms how Fujifilm photographers discover and share film simulation recipes. Unlike generic photography forums cluttered with technical specs, Fuji Recipe Hub is a carefully curated gallery where each recipe is a work of art.

The platform addresses a core frustration in the Fujifilm community: finding reliable, beautiful film simulation recipes is scattered across Reddit threads, Instagram posts, and personal blogs. Photographers spend hours searching, testing, and documenting their discoveries with no central place to preserve and share their craft.

"Fuji Recipe Hub treats every recipe as a curated artifact," says the product team. "We built an experience that feels like walking through a mid-century photography gallery—minimal, elegant, precise. Your camera settings shouldn't be buried in a spreadsheet; they should be displayed like the technical specifications on a museum placard."

### The Experience

The app opens to an asymmetric gallery wall of recipes—each card showing a hero photograph captured with those exact settings. Tap a recipe to see the full technical manual: ISO, aperture, shutter speed, film simulation, and the photographer's notes about light and mood. Every detail is presented with the precision of a Fujifilm camera dial.

Photographers can create and publish their own recipes using an interface inspired by manual camera controls. No cluttered forms—just clean, engraved labels and tactile inputs that mirror the physical experience of adjusting settings on a Fujifilm body.

### Why Now?

The Fujifilm community has exploded. The X100VI sold out globally. Film simulation photography has moved from niche enthusiasts to mainstream creators. But the tools haven't caught up—photographers are still sharing recipes in Twitter threads and Instagram captions.

Fuji Recipe Hub fills this gap with a platform purpose-built for the craft. It's not another generic Lightroom preset marketplace. It's a curated space where photographers document their signature looks and the community discovers new visual styles.

### Availability

Fuji Recipe Hub launches today as a web application, optimized for mobile and desktop. The platform is free for all photographers. Visit **[fujihub.app]** to explore the gallery and share your first recipe.

### About

Fuji Recipe Hub is built by photographers, for photographers. We believe that camera settings are as much a part of the creative process as composition and light. This platform gives the Fujifilm community the tool it deserves—one that respects the craft and celebrates the art.

---

## FAQ

### 1. Who is this for?

**Primary**: Fujifilm photographers (X-Series, GFX) who use film simulations and want to discover or share recipes.

**Secondary**: Photography enthusiasts considering Fujifilm cameras who want to see what's possible with film simulations before purchasing.

**Tertiary**: Professional photographers looking for a portfolio to showcase their technical signature style alongside their work.

### 2. What problem does this solve?

**The Discovery Problem**: Film simulation recipes are scattered across Instagram, Reddit, YouTube descriptions, and personal blogs. There's no central, searchable, visual gallery.

**The Documentation Problem**: Photographers spend hours dialing in a perfect recipe, then forget the settings or lose their notes. There's no permanent, shareable record.

**The Trust Problem**: Generic settings from random threads often don't work because context (lens, lighting, subject) is missing. Recipes need provenance—who created it, what they shot, and why it works.

**The Aesthetic Problem**: Photography is visual, but recipe sharing happens in text-heavy forums and spreadsheets. The presentation doesn't match the craft.

### 3. What makes this different from [Instagram / Reddit / Existing Forums]?

**Instagram**: Great for showing results, terrible for documenting settings. Recipes are buried in captions, unsearchable, and ephemeral.

**Reddit**: Text-heavy, cluttered, no visual hierarchy. Technical discussions get upvotes, but beautiful recipes get lost in threads.

**Existing Forums**: Built for discussion, not discovery. Finding a recipe requires reading through 47-page threads.

**Fuji Recipe Hub**: Purpose-built for recipe discovery and curation. Every recipe is a visual card. Search by film simulation, camera body, mood, or photographer. The interface respects the craft with a gallery-quality presentation.

### 4. How does recipe creation work?

The creation flow is inspired by manual camera controls:

1. **Upload Hero Image**: Your best shot with this recipe
2. **Technical Settings**: ISO, Aperture, Shutter Speed (inputs styled like camera dials)
3. **Film Simulation**: Select from the full Fujifilm catalog (Classic Neg, Velvia, Acros, etc.)
4. **Context Notes**: Lighting conditions, subject type, mood description
5. **Publish**: Your recipe goes live in the gallery

No complicated forms. No premium tiers. Just clean, precise inputs that mirror the physical camera experience.

### 5. Why "Tactile Archive" design philosophy?

We studied two references:

**Mid-century Fujifilm cameras**: Mechanical precision, engraved labels, tactile dials. Every element has purpose. No decoration.

**Contemporary photography galleries**: Generous whitespace, asymmetric layouts, photography as hero. The frame never competes with the image.

The result: An app that feels like a curated object, not a utility. Soft neutrals, paper-white backgrounds, sharp typography. The UI is the technical manual; the photography is the artifact.

### 6. What about monetization?

**Launch Phase**: Free for all photographers. No ads, no paywalls, no "pro" features. We want maximum community participation.

**Future (Optional)**:
- **Portfolio Mode**: Photographers can create a public profile showcasing their signature recipes (like a technical portfolio)
- **Print Exports**: High-quality PDF exports of recipes for reference in the field
- **Community Requests**: If the community wants features like preset packs or downloadable LUTs, we'll explore respectful ways to support development

**Non-negotiable**: The core gallery—browsing and sharing recipes—will always be free.

### 7. What cameras are supported?

**Launch**: All Fujifilm X-Series and GFX cameras with film simulations (X-T5, X100VI, X-S20, X-H2S, GFX100 II, etc.)

**Explicit Non-Support**: Non-Fujifilm cameras. This is a dedicated platform. We're not building a generic photography app.

**Rationale**: Fujifilm's film simulations are unique. The community deserves a platform that speaks their language, not a lowest-common-denominator tool.

### 8. How do photographers get discovered?

**Gallery Feed**: Recipes are surfaced based on:
- Visual quality (hero image)
- Community engagement (favorites, shares)
- Freshness (new recipes get priority)
- Diversity (algorithm prevents one photographer from dominating the feed)

**Photographer Profiles**: Each creator has a profile showing:
- Their recipe collection
- Their camera gear
- Their signature style description
- A link to their portfolio/Instagram

**Search & Filter**:
- By film simulation (e.g., "Show me all Classic Neg recipes")
- By camera body (e.g., "X100VI recipes only")
- By mood (e.g., "Moody," "Bright," "Vintage")
- By photographer

### 9. What about copyright and image ownership?

**Clear Policy**:
- Photographers retain 100% ownership of their images
- Uploading a recipe grants Fuji Recipe Hub a license to display the image in the gallery
- No image is ever sold, licensed to third parties, or used for advertising without explicit consent
- Photographers can delete their recipes and images at any time

**Respect for Craft**: We're photographers too. This platform exists to celebrate your work, not exploit it.

### 10. What's the technical stack?

**Frontend**: React 19 with Vite (fast, modern, optimized for mobile and desktop)

**Styling**: Tailwind CSS configured with exact design tokens from our Stitch design system (Tactile Archive)

**Hosting**: GitHub Pages (static) with Railway as fallback for dynamic features

**Design Source**: Google Stitch (design system maintained there, implemented pixel-perfect)

**Rationale**: Fast, modern, maintainable. No bloated frameworks. Optimized for the visual experience—high-quality images, fast load times, smooth interactions.

### 11. What does success look like?

**3 Months**:
- 100 active photographers
- 500 curated recipes
- Top 5 film simulations covered comprehensively

**6 Months**:
- 1,000 active photographers
- Organic traffic from "Fujifilm [film simulation] recipe" Google searches
- Community feature requests guide roadmap

**12 Months**:
- Recognized as the canonical platform for Fujifilm recipes
- Partnerships with Fujifilm communities (FujiLove, FujiX Weekly)
- Every new Fujifilm owner's first stop for inspiration

### 12. What's the MVP scope?

**In Scope (Launch)**:
- Browse recipe gallery (mobile & desktop)
- View recipe details (hero image, settings, notes)
- Photographer profiles
- Create and publish recipes
- Search by film simulation and camera body

**Out of Scope (Post-Launch)**:
- Social features (comments, likes, follows)
- Mobile native apps
- Recipe versioning
- Lightroom/Capture One preset exports
- Community voting/ranking

**Philosophy**: Launch lean. Perfect the core gallery experience. Let the community tell us what's next.

### 13. What's the biggest risk?

**Network Effects**: A gallery is only valuable if there are recipes to discover. Cold start is hard.

**Mitigation**:
- Seed the gallery with 50 high-quality recipes from the team and trusted photographers
- Partner with existing Fujifilm creators to import their best recipes at launch
- Make creation so easy that photographers want to document their work
- Beautiful design encourages sharing ("Look at this platform I'm on")

**Secondary Risk**: Stale content. If photographers upload once and never return, the gallery feels dead.

**Mitigation**:
- Encourage photographers to build a "recipe portfolio" (multiple uploads)
- Surface fresh content prominently
- Future: Optional email digests of trending recipes in your favorite style

### 14. Why not just build this as a subreddit or Instagram page?

**Control**: We need to control the presentation. Reddit's text-heavy UI and Instagram's feed-first design don't serve the craft.

**Searchability**: Reddit search is broken. Instagram is chronological and ephemeral. A dedicated platform can offer rich filtering (by camera, film sim, mood).

**Permanence**: Subreddits get cluttered. Instagram posts get buried. Recipes should be evergreen—discoverable years after they're posted.

**Design Integrity**: The "Tactile Archive" philosophy requires full control over layout, typography, spacing, and interaction. We can't achieve this in someone else's platform.

### 15. How do I share my first recipe?

Visit **[fujihub.app]** → Sign in → Tap "Create Recipe" → Upload your hero image → Enter your camera settings → Publish.

Your recipe goes live immediately in the gallery. Share the link with the community, or let it be discovered organically through search.

Welcome to the gallery.

---

## Metrics to Track

**Engagement**:
- Number of recipes published
- Number of recipe views
- Time spent viewing recipe details
- Search queries (what are people looking for?)

**Quality**:
- Hero image quality (manual review at scale?)
- Recipe completeness (all fields filled?)
- Community feedback (future: ratings/favorites)

**Growth**:
- New photographers per week
- Returning photographers (7-day, 30-day retention)
- Organic search traffic
- Social media shares

**Technical**:
- Page load time (must be fast for image-heavy content)
- Mobile vs. desktop usage
- Image optimization effectiveness

---

## Open Questions

1. **Authentication**: Start with simple email sign-in, or require social auth (Google/Apple) to reduce spam?

2. **Moderation**: Manual review for first 100 recipes, then community flagging? Or trust-by-default?

3. **Image Requirements**: Enforce minimum resolution? Aspect ratio guidelines?

4. **Film Simulation Taxonomy**: Use Fujifilm's official names, or allow custom tags for hybrid recipes?

5. **Desktop vs. Mobile Priority**: Design is mobile-first, but photographers may prefer desktop for uploading. Which experience to perfect first?

---

## Timeline

**Week 1-2**: Design Spec from Stitch → React component implementation
**Week 3**: Recipe Feed + Recipe Details pages (MVP core)
**Week 4**: Recipe Creator flow + Photographer Profiles
**Week 5**: Testing, visual QA, performance optimization
**Week 6**: Soft launch with seed recipes + beta photographers
**Week 7**: Public launch + community outreach

---

## Contact

For questions, feedback, or early access:
**Email**: [team@fujihub.app]
**Stitch Design System**: Project ID `9626409551350003062`
