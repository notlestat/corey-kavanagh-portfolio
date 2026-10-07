# Corey Kavanagh portfolio

An Astro portfolio with React and TypeScript for art direction, design and creative technology. Home is a quiet, film-led introduction with an animated conversation and clothing-button page navigation. Work contains pinned discipline links, an image-only scrolling archive and a text-only index of the ten collections. Art direction opens “Behind the images” at `/work/art-direction`, linking to the individual case studies. Graphic design opens an upcoming-study page. Design engineering opens the portfolio and local creative-workflow list at `/work/design-engineering`, with a GitHub profile logo link beside its title. Images use the page background without tinted mounts, and dark mode uses black with neutral grey controls and text. In the image gallery, wheel scrolling moves an endless strip while the pointer is over it. On smaller screens and with reduced motion enabled, the strip becomes swipeable.

Version 0.2.1 refreshes Work with discipline pages, a caption-free archive and a text-only index, following the Astro migration in 0.2.0. Every route generates HTML during the build; React hydrates the interactive components. The source is published on GitHub and the existing Vercel project hosts the site at [corey-kavanagh-portfolio.vercel.app](https://corey-kavanagh-portfolio.vercel.app/).

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
| [src/pages/index.astro](src/pages/index.astro) | Home page structure, introduction and conversation content |
| [src/pages/work.astro](src/pages/work.astro) | Work route, pinned navigation, image archive, text index and footer |
| [src/pages/work/[slug].astro](src/pages/work/[slug].astro) | Static case-study routes |
| [src/components/CaseStudies.astro](src/components/CaseStudies.astro) | Text-only case-study index on the Art direction page |
| [src/components/WorkLanding.astro](src/components/WorkLanding.astro) | Pinned links to Art direction, Graphic design and Design engineering |
| [src/components/UpcomingStudies.astro](src/components/UpcomingStudies.astro) | Shared upcoming-study page layout |
| [src/caseStudyData.ts](src/caseStudyData.ts) | Draft case copy grounded in the supplied CV and existing archive imagery |
| [src/work.css](src/work.css) | Work-only layout, case-study pages and archive viewer |
| [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) | Shared HTML, metadata, global styles and early theme restoration |
| [src/HomeFilm.tsx](src/HomeFilm.tsx) | Looping film, sound switch and Home theme control |
| [src/WorkExplorer.tsx](src/WorkExplorer.tsx) | Scrolling archive and modal media viewer with shared React state |
| [src/Navigation.tsx](src/Navigation.tsx) | Clothing-button page links, shared theme control and GitHub icon |
| [src/components/Header.astro](src/components/Header.astro) | Work header with an interactive theme control |
| [src/components/DigitalWork.astro](src/components/DigitalWork.astro) | Static digital-project section with interactive system rows |
| [src/SystemRow.tsx](src/SystemRow.tsx) | Expandable system details |
| [src/systemData.ts](src/systemData.ts) | Existing digital-system descriptions |
| [src/Conversation.tsx](src/Conversation.tsx) | Accessible conversation bubbles used on Home |
| [src/ToolRail.tsx](src/ToolRail.tsx) | Monochrome Home tool marks with hover, keyboard and tap labels |
| [src/portfolioData.ts](src/portfolioData.ts) | Collection names, years, image/video paths and gallery ordering |
| [src/styles.css](src/styles.css) | Typography, layout, motion and responsive rules |
| [src/visualTheme.css](src/visualTheme.css) | Helvetica-based type, muted surfaces and component styling for both themes |
| [src/home.css](src/home.css) | Home spacing, film controls and tactile navigation |
| `public/work/gallery/` | Local gallery images and video previews |
| [astro.config.mjs](astro.config.mjs) | Static output and React integration |
| [vercel.json](vercel.json) | Astro preset, build command and output directory for Vercel |

Update collection metadata and item counts in `src/portfolioData.ts` when adding or removing media. Gallery paths are root-relative; a deployment under a URL subdirectory needs a path review.

## Rendering and deployment

The Home introduction, navigation, page metadata, Work header, case-study text and footers are generated by Astro. `client:load` attaches React to film controls, tool labels, conversation playback, the Work archive/list viewer and workflow disclosures on Design engineering. The workflow section is not rendered on the main Work page. Initial React markup is deterministic during server rendering; browser preferences are read after hydration. The saved theme is applied by a head script before the page paints.

The build generates static HTML for Home, Work, the discipline pages and individual case studies, alongside the existing assets. `/work` is a real static page and no longer rewrites to the Home HTML. Vercel uses the repository's Astro framework preset, `npm run build` and `dist` output directory. No server-rendering adapter is needed for this static site. Pushes to the connected production branch trigger a production deployment; verify the routes and their interactions after publishing.

## Current content

- Ten collections contain 141 gallery items. Ten video items have local playable previews.
- Individual source file names are not shown in the interface.
- Home introduces the full practice. Work holds the image archive and links to draft BSTROY, Jimi Vain and Stem Player case studies at `/work/bstroy`, `/work/jimi-vain` and `/work/stem-player`.
- Navigation links to [the GitHub profile](https://github.com/notlestat).
- No verified public contact route has been added yet.

Home reuses `public/work/gallery/video/moving-09.mp4`, which matches the supplied source film. It loops inline without native playback controls. Playback attempts audio first and falls back to muted autoplay when the browser requires a user gesture. The sound switch enables or disables audio. With reduced motion enabled, the film remains still until the visitor enables sound; the conversation shows its complete transcript.

The conversation uses iMessage-style blue outgoing and grey incoming bubbles in both themes. Replies type at a varied pace with thinking, punctuation and send pauses. Visitors can show every message immediately or replay the sequence.

Home also includes a small tools and skills row beneath the name and bio, before the conversation. It becomes a compact grid on narrow phones. It identifies Photoshop, Illustrator, Figma, Paper Design, Claude Code, OpenAI Codex, HTML and Astro. Labels reveal on hover, keyboard focus or tap, and dismiss with Escape, focus leaving, or an outside tap. Ps/Ai are monochrome typographic tiles; Codex uses the OpenAI parent mark. Figma, Claude, OpenAI, HTML and Astro vector silhouettes come from [Simple Icons](https://github.com/simple-icons/simple-icons); Paper's mark comes from [Paper](https://paper.design/). The names describe the toolkit and skills, not affiliations or certifications.

## Editorial review

The Work refresh was approved for publication on 7 October 2026. The individual case studies remain visibly labelled as drafts while detailed image selections and credits are reviewed. Responsibilities and periods come from the user-supplied `cv.pdf`; media comes from matching existing archive folders. Confirm exact project image selections, collaborator credits, publication permissions and any additional process evidence before removing the draft labels. No campaign titles, analytics or new production outcomes have been invented. The private CV itself is not copied into public assets. Existing `/work#work-index` links reach the text-only work list. The workflow descriptions are retained with neutral project names, without Axis branding. `/work/digital-work` remains an alias of the Design engineering page.

Confirm project credits and usage rights, add case-study detail where useful, and provide a verified contact route. Review video and image quality at full size. A Graphic Design source image was previously held out pending a publication decision; adding new media still requires editorial review.
