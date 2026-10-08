# Corey Kavanagh portfolio

An Astro portfolio with React and TypeScript for art direction, design and creative technology. Home is a quiet, film-led introduction with a bio, tools and skills, and clothing-button page navigation. Work is a single centred folder that opens Art direction at `/work/art-direction`, Graphic design at `/work/graphic-design` and Design engineering at `/work/design-engineering`. The existing image-only scrolling archive and text-only collection index are retained at `/work/archive`. See [Folder and sound](#folder-and-sound) for discipline galleries, case studies and interaction details. Design engineering opens the portfolio and local creative-workflow list, with a GitHub profile logo link beside its title. Images have no visible captions and use the page background without tinted mounts; dark mode uses black with neutral grey controls and text.

Version 0.3.1 adds STUDY 01 to Design engineering and the full work index, with a visual-first project page, real application captures and plain Live / Source links. Version 0.3.0 includes the Work interactions described below, removes Home's conversation and adds fitted favicon exports. Version 0.2.2 grouped the two Adobe product tiles into one monochrome Adobe icon with the label "Adobe". Version 0.2.1 refreshed Work with discipline pages, a caption-free archive and a text-only index, following the Astro migration in 0.2.0. See [Rendering and deployment](#rendering-and-deployment) for how pages and React islands are served. The source is published on GitHub and the existing Vercel project hosts the site at [corey-kavanagh-portfolio.vercel.app](https://corey-kavanagh-portfolio.vercel.app/).

## Run locally

Use a supported even-numbered Node.js release at version 22.12 or higher, with npm.

```sh
git clone https://github.com/notlestat/corey-kavanagh-portfolio.git
cd corey-kavanagh-portfolio
npm ci
npm run dev
```

Open the local address printed by Astro, usually `http://localhost:4321`. If the learning project is already running there, Astro will use the next available port, or run `npm run dev -- --port 4322` explicitly.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Astro development server |
| `npm run check` | Check Astro and TypeScript files |
| `npm run build` | Check types and create `dist/` |
| `npm run preview` | Serve the existing production build locally |

Run `npm run build` before `npm run preview`. There is no automated unit-test script in this repository.

## Project files

| Location | Purpose |
|---|---|
| [src/pages/index.astro](src/pages/index.astro) | Home page structure, introduction and tools |
| [src/pages/work.astro](src/pages/work.astro) | Minimal Work folder, discipline navigation and archive link |
| [src/pages/work/[slug].astro](src/pages/work/[slug].astro) | Static case-study routes |
| [src/components/CaseStudies.astro](src/components/CaseStudies.astro) | Text-only case-study index on the Art direction page |
| [src/WorkFolder.tsx](src/WorkFolder.tsx) | Minimal folder disclosure with the three existing discipline links |
| [src/folder.css](src/folder.css) | Folder material, fragmented type, responsive layout and restrained opening motion |
| [src/pages/work/archive.astro](src/pages/work/archive.astro) | Preserved image scroll and full collection list |
| [src/components/sound.tsx](src/components/sound.tsx) | Supplied Web Kits cue library, delegated listener and exported sound controls |
| [src/components/WorkSound.tsx](src/components/WorkSound.tsx) | One sound wrapper/listener and mute control per Work document |
| [src/components/UpcomingStudies.astro](src/components/UpcomingStudies.astro) | Retained upcoming-study layout, no longer rendered by a route |
| [src/caseStudyData.ts](src/caseStudyData.ts) | Existing draft cases and visual-first authored projects with optional live/source links |
| [src/work.css](src/work.css) | Work-only layout, case-study pages and archive viewer |
| [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) | Shared HTML, metadata, global styles and early theme restoration |
| [scripts/generate-favicons.mjs](scripts/generate-favicons.mjs) | Square web-icon exports from the retained CK artwork |
| [scripts/prepare-study-media.mjs](scripts/prepare-study-media.mjs) | WebP crops from real STUDY 01 browser captures |
| [src/HomeFilm.tsx](src/HomeFilm.tsx) | Looping film, sound switch and Home theme control |
| [src/WorkExplorer.tsx](src/WorkExplorer.tsx) | Scrolling archive and modal media viewer with shared React state |
| [src/WorkGallery.tsx](src/WorkGallery.tsx) | Shared discipline slider, automatic loop and retained image/video viewer |
| [src/Navigation.tsx](src/Navigation.tsx) | Clothing-button page links, shared theme control and GitHub icon |
| [src/components/Header.astro](src/components/Header.astro) | Logo-free Work header with page links, sound, theme and GitHub controls |
| [src/components/DigitalWork.astro](src/components/DigitalWork.astro) | Static digital-project section with interactive system rows |
| [src/SystemRow.tsx](src/SystemRow.tsx) | Expandable system details |
| [src/systemData.ts](src/systemData.ts) | Existing digital-system descriptions |
| [src/Conversation.tsx](src/Conversation.tsx) | Retained conversation component, no longer rendered on Home |
| [src/ToolRail.tsx](src/ToolRail.tsx) | Monochrome Home tool marks with hover, keyboard and tap labels |
| [src/portfolioData.ts](src/portfolioData.ts) | Collection names, years, image/video paths and gallery ordering |
| [src/styles.css](src/styles.css) | Typography, layout, motion and responsive rules |
| [src/visualTheme.css](src/visualTheme.css) | Helvetica-based type, muted surfaces and component styling for both themes |
| [src/home.css](src/home.css) | Home spacing, film controls and tactile navigation |
| `public/work/gallery/` | Local gallery images and video previews |
| [astro.config.mjs](astro.config.mjs) | Static output, React integration and Tailwind Vite plugin |
| [vercel.json](vercel.json) | Astro preset, build command and output directory for Vercel |

Update collection metadata and item counts in `src/portfolioData.ts` when adding or removing media. Gallery paths are root-relative; a deployment under a URL subdirectory needs a path review.

Favicons use the intact CK mark on the site's light neutral background, with tight browser padding and additional Apple home-screen padding. [scripts/generate-favicons.mjs](scripts/generate-favicons.mjs) owns the PNG, ICO and Apple touch-icon export sizes; the shared layout owns their declarations on every route. The exports follow [Google's square favicon recommendation](https://developers.google.com/search/docs/appearance/favicon-in-search) and [Safari's touch-icon declaration](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html). Regenerate with `node scripts/generate-favicons.mjs` or pass a higher-resolution CK PNG as its first argument. This uses the sharp image tooling installed by Astro. Only the exported icons belong in public assets, not private source paths. Favicons may remain cached after publication, and Google decides whether and when to show them in search.

## Rendering and deployment

The Home introduction, navigation, page metadata, Work header, case-study text and footers are generated by Astro. `client:load` attaches React to film controls, tool labels, the Work folder, sound controls, discipline galleries, archive/list viewer and workflow disclosures on Design engineering. The workflow section is not rendered on the main Work page. Initial React markup is deterministic during server rendering; browser preferences are read after hydration. The saved theme is applied by a head script before the page paints.

The build generates static HTML for Home, Work, the archive, the discipline pages and individual case studies, alongside the existing assets. `/work` is a real static page and no longer rewrites to the Home HTML. Vercel uses the repository's Astro framework preset, `npm run build` and `dist` output directory. No server-rendering adapter is needed for this static site. Pushes to the connected production branch trigger a production deployment; verify the routes and their interactions after publishing.

## Current content

- Eleven collections contain 144 gallery items. Ten video items have local playable previews.
- Individual source file names are not shown in the interface.
- The draft BSTROY, Jimi Vain and Stem Player case-study routes remain `/work/bstroy`, `/work/jimi-vain` and `/work/stem-player`.
- Navigation links to [the GitHub profile](https://github.com/notlestat).
- No verified public contact route has been added yet.

Home reuses `public/work/gallery/video/moving-09.mp4`, which matches the supplied source film. It loops inline without native playback controls. Playback attempts audio first and falls back to muted autoplay when the browser requires a user gesture. The sound switch enables or disables audio. With reduced motion enabled, the film remains still until the visitor enables sound.

Home also includes a small tools and skills row beneath the name and bio. It becomes a compact grid on narrow phones. A single Adobe mark groups Photoshop and Illustrator, alongside Figma, Paper Design, Claude Code, OpenAI Codex, HTML and Astro. Labels reveal on hover, keyboard focus or tap, and dismiss with Escape, focus leaving, or an outside tap. All seven marks are monochrome; Codex uses the OpenAI parent mark. Adobe's vector silhouette comes from [Simple Icons v13](https://github.com/simple-icons/simple-icons/blob/13.0.0/icons/adobe.svg). Figma, Claude, OpenAI, HTML and Astro silhouettes also come from [Simple Icons](https://github.com/simple-icons/simple-icons); Paper's mark comes from [Paper](https://paper.design/). The names describe the toolkit and skills, not affiliations or certifications.

## Editorial review

The earlier Work refresh was approved for publication on 7 October 2026. The folder, discipline sliders, Home removals and image-click fix were approved for publication on 8 October 2026. The individual case studies remain visibly labelled as drafts while detailed image selections and credits are reviewed. Responsibilities and periods come from the user-supplied `cv.pdf`; media comes from matching existing archive folders. Confirm exact project image selections, collaborator credits, publication permissions and any additional process evidence before removing the draft labels. No campaign titles, analytics or new production outcomes have been invented. The private CV itself is not copied into public assets. Existing `/work#work-index` links redirect to the preserved list at `/work/archive#work-index`. The workflow descriptions are retained with neutral project names, without Axis branding. `/work/digital-work` remains an alias of the Design engineering page.

## Folder and sound

Pressing the folder plays a quiet interface cue; the header's sound button mutes or unmutes interface sounds. The folder uses native button/navigation elements, `aria-expanded`, inert closed links, Escape dismissal and a no-JavaScript link fallback. Its 240ms opening transition explains where the three paper entries come from; keyboard activation and reduced-motion mode skip the transition. Grain and fragmented lettering interpret the supplied paper reference and [Raygun archive](https://designreviewed.com/series/raygun/) without using its cover artwork.

The attached `sound.tsx` reference was used directly rather than running the shadcn registry generator. Its cue definitions, exported API, `data-slot`/`data-sound` wiring, SVG and exact SoundToggle utility string are retained. Differences: relative imports match this repository; Tailwind v4 runs through Astro's Vite integration with only theme/utilities and explicit sound-file sources, no Preflight reset; the supplied CSS dark tokens also recognise the site's existing `data-theme="dark"` selector; extra foreground/ring tokens map to the existing ink. The mute control overrides its outer hit area to 44px with `cn`, leaving the 17px glyph intact. If reading or writing a sound setting fails, that setting uses memory for the rest of the document's lifetime, even if later reads would succeed. Volume is clamped to 0–1, including zero. Untrusted input events are ignored, and observed mutations remain silent until the visitor interacts.

There is one `SoundEffects` wrapper in each Work document's header. Its delegated listener can hear the other React islands and Astro controls without converting the whole page into React. Home has no interface-sound listener. No cue plays on load or hover. The mute preference and volume are saved locally when storage is available; Web Kits also suppresses cues for reduced-motion users. This interface mute is separate from Home's film soundtrack.

The discipline pages put imagery above case studies. Art direction includes art-direction, personal-work and video items above its existing draft case studies, excluding Graphic Design. Graphic design has its own slider, followed by the existing coming-soon case-study state. [src/portfolioData.ts](src/portfolioData.ts) owns collection membership and discipline filters; gallery counts are derived from those arrays in the interface. Collection and image-position IDs are preserved so the viewer opens the correct original image or playable video.

The discipline sliders drift at a linear 24px/s on desktop and wrap seamlessly. They pause on hover, keyboard focus, an open viewer, a hidden tab or when offscreen; a persistent Pause/Resume control lets visitors stop them themselves. The full archive uses the same gallery without automatic drift. Wheel input moves an endless strip while the pointer is over it; Prev/Next also work. Keyboard stepping is instant. Phones and reduced-motion mode retain native swipe/scroll without an automatic loop. Design engineering uses the same gallery for its three real STUDY 01 compositions, above the project and retained workflow list. Short collections repeat enough times to cover a desktop viewport at the loop boundary. Duplicate copies are hidden from assistive technology and keyboard navigation.

Click-to-open viewing is retained. Bringing a card into view is restricted to Tab navigation with visible keyboard focus, not pointer focus or programmatic focus restoration. This prevents a clicked image moving out from under the pointer before the click completes, and keeps the strip in place when the viewer closes.

Confirm project credits and usage rights, add case-study detail where useful, and provide a verified contact route. Review video and image quality at full size. A Graphic Design source image was previously held out pending a publication decision; adding new media still requires editorial review.

## STUDY 01 integration

Version 0.3.1 integration, approved for publication on 8 October 2026. STUDY 01 appears in the Design engineering project list and the full archive, with a visual-first page at `/work/study-01`. It uses the shared case-study data and page layout with optional discipline, attribution, media-dimension and live/source fields. The three existing Art direction cases retain their copy, draft labels and next-project navigation; Home and the Work folder are unchanged.

The [live instrument](https://study-01-nu.vercel.app/) and [source](https://github.com/notlestat/study-01) were checked on 8 October 2026 against source revision `735d6fc`. The four local WebP assets in `public/work/study-01/` are real captures of that application, not reconstructed interfaces: an ORDER workspace plus ORDER seed 4, SILENCE seed 10 and TENSION seed 4 compositions. These use the application's built-in geometric sample, the title "Composition is a system." and Corey Kavanagh metadata, not client imagery. Mobile loads the composition crop instead of the small desktop controls. The full application remains separate, reached through plain Live and Source links; no app engine or iframe is loaded by the portfolio, and the STUDY 01 repository is unchanged.

`node scripts/prepare-study-media.mjs <order-capture> <silence-capture> <tension-capture>` regenerates the media from matching 2880 × 2000 browser captures. The crop coordinates are specific to those captures and should be reviewed if the live interface changes. Gallery membership is 134 Art direction items, seven Graphic design items and three Design engineering items.
