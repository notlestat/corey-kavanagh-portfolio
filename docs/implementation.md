# Portfolio implementation reference

This reference describes the source in this checkout. See the [repository overview](../README.md) for setup.

## Routes

| Route | Content |
| --- | --- |
| `/` | Film-led introduction and phone contact |
| `/work` | Original folder with three discipline links |
| `/work/art-direction` | Design: full image slider and visual case-study cards |
| `/work/interaction-design` | SourceLink project imagery and description |
| `/work/creative-technology` | Point-study film, playback terminal, Image Press, and workflow disclosures |
| `/work/archive` | Full image strip and collection index |
| `/tools/image-press` | Bundled interactive two-ink photo press |
| `/work/[slug]` | Static case-study pages from the project data |

The first work discipline is labelled Design to cover branding, visual identity and the wider image-led work. Its existing `/work/art-direction` path is retained so published links keep working.

Legacy discipline redirects are defined in [astro.config.mjs](../astro.config.mjs). `/work#work-index` redirects to `/work/archive#work-index`.

## Shared components

| Source | Purpose |
| --- | --- |
| [WorkFolder.tsx](../src/WorkFolder.tsx) | Original folder disclosure |
| [WorkGallery.tsx](../src/WorkGallery.tsx) | Slider, selection state, and native dialog |
| [display-cards.tsx](../src/components/ui/display-cards.tsx) | Stacked media display and thumbnail strip |
| [CaseStudies.astro](../src/components/CaseStudies.astro) | Visual links to Design projects |
| [DigitalWork.astro](../src/components/DigitalWork.astro) | Aligned website and application project images |
| [PointStudy.astro](../src/components/PointStudy.astro) | Point-study film and terminal markup |
| [point-study.ts](../src/lib/point-study.ts) | Playback commands and live media state |
| [Contact.astro](../src/components/Contact.astro) | Shared telephone link |
| [InteractiveProject.astro](../src/components/InteractiveProject.astro) | Interactive project frame with responsive height |
| [SitePreview.astro](../src/components/SitePreview.astro) | Scaled live homepage previews on website case-study pages |

Collection names, item counts, paths, and slider ordering come from [portfolioData.ts](../src/portfolioData.ts). Case-study content and presentation settings come from [caseStudyData.ts](../src/caseStudyData.ts).

## Gallery and media viewer

The Design slider uses the original gallery items. Desktop automatic motion pauses on hover, keyboard focus, an open viewer, a hidden document, or an offscreen gallery. Pause and Resume controls persist for the page visit. Phones and reduced-motion preferences use native scrolling without automatic drift. The archive uses the gallery without automatic drift.

The viewer opens the selected image in its original collection. It includes previous and next controls, thumbnails, arrow-key navigation, Escape dismissal, and focus restoration. Videos use native playback controls. Thumbnails keep the selected item visible without scrolling the document. The stacked display uses translations without skew or rotation. Image mounts and thumbnails use the page background.

## Point-study terminal

The supplied five-second film is served from `public/work/point-study/`, with a 1080p web encode and a still poster. The terminal displays a short playback script, then accepts these commands:

| Command | Effect |
| --- | --- |
| `help` | List supported commands |
| `play` | Play the visible film |
| `pause` | Pause the film |
| `speed 0.5` | Set playback speed between 0.25 and 2 |
| `seek 2` | Seek to a time from 0 to 5.33 seconds after the film has loaded |
| `clear` | Clear the command display |

Time, frame, and speed output comes from the video element. The command interpreter does not evaluate user-supplied JavaScript or run a shell. Up and down arrows recall command history. Reduced motion and data-saving preferences start with the poster and a manual play control. Offscreen and hidden playback pauses.

## Folder and sound

The original folder component and its CSS are retained. It uses a native button and navigation, `aria-expanded`, inert closed links, Escape dismissal, and a no-JavaScript fallback. Keyboard activation and reduced motion skip its opening transition.

The folder's grain and fragmented lettering interpret the supplied paper reference and the [Raygun archive](https://designreviewed.com/series/raygun/), without copying its cover artwork. The media display adapts the user-supplied React DisplayCards reference to real image and video collections.

The Web Kits sound component uses a header wrapper scoped to the folder. Folder transitions and the mute control can play cues; gallery controls, viewers, navigation, workflow disclosures, and theme changes remain silent. The setting is separate from Home's film soundtrack. Trusted transition provenance is handled in [folder-events.ts](../src/lib/folder-events.ts).

## Typography and styling

[visualTheme.css](../src/visualTheme.css) defines the Helvetica system stack, page colours, and monospace labels. The terminal uses monospace text. The release has no bundled PP Neue Montreal files or font requests.

[experimental-work.css](../src/experimental-work.css) defines the current project grids and film presentation. The folder keeps [folder.css](../src/folder.css). [styles.css](../src/styles.css) imports Tailwind theme and utilities with explicit component sources and no Preflight reset. [components.json](../components.json) and [tsconfig.json](../tsconfig.json) define the UI component paths and `@/` alias.

## Static rendering and hosting

Astro generates static HTML and assets in `dist/`. React islands hydrate the film controls, folder, sound controls, galleries, media viewer, and workflow disclosures. The terminal uses a client-side script. Theme restoration runs before paint.

[vercel.json](../vercel.json) specifies the Astro framework, `npm run build`, and `dist/`. The repository does not need a server-rendering adapter. A successful local build is separate from a Vercel deployment; production status requires deployment metadata and live route checks.

## Media preparation

The scripts in `scripts/` prepare favicon exports, STUDY 01 images, and album artwork. Album artwork is uncropped and has responsive WebP sizes. Private CVs, original source attachments, and personal-use font downloads are excluded from public assets. Credits and publication evidence are tracked in the [editorial record](editorial-record.md).

## Image Press

The Creative technology project list includes Image Press. Listing images and optional detail images are defined on each case study rather than selected by category. Image Press uses the interactive presentation; its embedded app retains its own CSS and font licences. STUDY 01 has been removed from the project data, so it has no listing, project page or next-project link. Its existing media and preparation script remain in the repository. See the [Image Press integration reference](image-press-integration.md) for the pinned source, update command and credits.
