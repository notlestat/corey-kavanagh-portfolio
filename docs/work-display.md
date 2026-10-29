# Beveled website previews

This local preview follows Corey's latest 27 October 2026 correction. Website projects use a beveled rectangular image of the site, opening into up to three overlapping landscape page views without visible screenshot labels. Design retains its original 141-item slider and five cards. Corey approved publication on 27 October 2026 after requesting removal of In the studio and the separate Image archive. The release workflow uses a dedicated branch; main is not merged automatically.

## Presentation

SourceLink is the only current website project. The index presents its landing page inside a subtle bevel, followed by its name and role. The original main Work folder remains. No small website folders or placeholder projects appear.

The opened project presents landing, reports and savings-calculator views. `WebsiteBundle.astro` limits the supplied image array with `.slice(0, 3)`. Additional data cannot grow the display beyond three. Every image retains its landscape proportions. Small overlaps create depth without rotation or visible annotations. Accessible image descriptions and image links remain, alongside a separate live-site link.

The project index uses a native horizontal scroll rail. Additional real projects appear alongside SourceLink. Snap alignment holds each preview at a useful stopping point. Previous/next controls appear only with multiple projects after hydration. Boundary buttons disable when further scrolling is unavailable. Keyboard activation and reduced motion scroll immediately; pointer activation can scroll smoothly. Without JavaScript, native links and horizontal scrolling remain available.

The earlier sticky stack no longer matches the horizontal brief. Framer Motion and Lenis were removed because this presentation uses React, CSS and the browser's scrolling API. Scrolling stays local to the rail; the component does not intercept page wheel events.

## Files and data

| File | Responsibility |
| --- | --- |
| `src/caseStudyData.ts` | Actual project metadata, `listingMedia` preview and `displayMedia` page views |
| `src/components/DigitalWork.astro` | Selects discipline projects and passes typed props to React |
| `src/components/ui/images-scrolling-animation.tsx` | Horizontal rail, native links and navigation state |
| `src/components/ui/images-scrolling-animation.css` | Bevel, responsive widths, snap alignment, focus and reduced motion |
| `src/components/WebsiteBundle.astro` | Three-screen cap and overlapping composition |
| `src/pages/work/[slug].astro` | Selects the website presentation and discipline navigation |

The existing React, TypeScript, Tailwind and shadcn aliases remain. `@/components/ui` resolves to `src/components/ui`. The example component uses current website data. No new context provider or framework setup is required.

The rail reads its own scroll position and width to update button states. A passive scroll listener and `ResizeObserver` keep those values current; cleanup removes both when the component unmounts. CSS Grid places screenshots into overlapping columns while retaining their document height.

## Assets and preserved work

`public/work/sourcelink/views` contains three 1440 × 1000 viewport images extracted from the complete public-page captures. Each sidecar records the source URL, original capture time, derivation time, crop dimensions and source asset. No page content is retouched. The newsletter was dismissed and optional cookies declined before the underlying capture. The complete captures remain available as source assets, but the visible project uses only the three compact views.

The references inform bevel, horizontal browsing and screenshot overlap. Their binder clip, handwriting, identity and artwork are not reused. Existing Helvetica, page background, main Work folder, original Design display and point-cloud film/terminal remain. Image Press stays removed locally; the independent tool repository is unchanged.

## Verification

After the latest correction:

- Astro check/build: zero errors, warnings or hints.
- Whitespace check and scoped Impeccable detector: passed.
- Chromium at 320, 390, 768 and 1440px on the website index and SourceLink detail: no horizontal document overflow.
- Three loaded 1440 × 1000 images, overlap, native project links, visible keyboard focus, no screenshot labels, both themes and reduced motion: passed.
- No-JavaScript project navigation: passed.
- A temporary nonshipping three-project fixture verified horizontal overflow inside the rail, next/previous controls, disabled boundary states and keyboard activation. Fixture data is absent from the application.
- Original Design count/cards, main Work folder, directly visible film/terminal and empty Creative technology project index: passed.
- No page errors or failed HTTP responses captured in checked routes. Production dependency audit: zero known vulnerabilities.

The shared preview twice timed out during snapshots; isolated Chromium supplied the captures and batched checks. Physical Safari/iPhone behavior remains unverified.

Evidence: `/Users/coreykavanagh/.t3/scratch/2026-10-27-beveled-sites/`.

Local review: `http://localhost:4343/work/interaction-design` and `http://localhost:4343/work/sourcelink`.

## Concepts covered

Typed props separate content from the reusable preview. Native scrolling avoids a page-wide animation dependency. Resize observation keeps navigation accurate when the available width changes. Array slicing enforces the three-view limit in the renderer.

Small practice changes: change a screenshot's accessible description in `displayMedia`; adjust the rail's 460px preview width cap and compare desktop/mobile. These concepts were explained through the build; independent understanding has not been assessed.

Sources: Corey's latest beveled-box references, rejection of small website folders, three-page maximum clarification and supplied code in this conversation; current source, derived captures and executed checks.

## Release cleanup · 27 October 2026

Removed the In the studio disclosure and its Campaign, Post-production and Creative production workflow rows from Creative technology. Removed Image archive links from the discipline pages and Work footer, and replaced the separate archive page with a redirect to Design. The original 141-item Design slider and five project cards remain. Legacy work-index links now point to Design projects. The point-cloud film and terminal are unchanged. This cleanup and publication are explicitly authorised by Corey's final review message.
