# Portfolio implementation reference

This reference describes the source in this checkout. See the [repository overview](../README.md) for setup.

## Routes

| Route | Content |
| --- | --- |
| `/` | Film-led introduction and phone contact |
| `/work` | Original folder with three discipline links; one print per discipline shows above the closed folder |
| `/work/design` | Design: original full slider with a project filter, and five project cards |
| `/work/interaction-design` | Beveled website previews |
| `/work/creative-technology` | Original point-study film and terminal |
| `/work/art-direction` | Redirect to Design; the original Design path |
| `/work/archive` | Redirect to Design; separate archive removed |
| `/work/[slug]` | Static case-study pages from the project data |

The first work discipline is labelled Design to cover branding, visual identity and the wider image-led work. It moved from `/work/art-direction` to `/work/design` to match its label; the old path redirects so published links keep working. Data still uses the internal category key `art-direction`.

Legacy discipline redirects are defined in [astro.config.mjs](../astro.config.mjs). `/work#work-index` redirects to `/work/design#case-studies`; the former `/work/archive` route redirects to Design.

## Shared components

| Source | Purpose |
| --- | --- |
| [WorkFolder.tsx](../src/WorkFolder.tsx) | Original folder disclosure |
| [WorkGallery.tsx](../src/WorkGallery.tsx) | Slider, selection state, and native dialog |
| [display-cards.tsx](../src/components/ui/display-cards.tsx) | Stacked media display and thumbnail strip |
| [CaseStudies.astro](../src/components/CaseStudies.astro) | Visual links to Design projects |
| [DigitalWork.astro](../src/components/DigitalWork.astro) | Website preview index driven by project data |
| [images-scrolling-animation.tsx](../src/components/ui/images-scrolling-animation.tsx) | Native horizontal website rail and navigation controls |
| [PointStudy.astro](../src/components/PointStudy.astro) | Point-study film and terminal markup |
| [point-study.ts](../src/lib/point-study.ts) | Playback commands and live media state |
| [Contact.astro](../src/components/Contact.astro) | Shared telephone link |
| [InteractiveProject.astro](../src/components/InteractiveProject.astro) | Interactive project frame with responsive height |
| [WebsiteBundle.astro](../src/components/WebsiteBundle.astro) | Up to three overlapping website views and live-site link |

Collection names, item counts, paths, and slider ordering come from [portfolioData.ts](../src/portfolioData.ts). Case-study content and presentation settings come from [caseStudyData.ts](../src/caseStudyData.ts).

## Interface review · 27 October 2026

Changes from a design and accessibility audit of the published site:

- **Toggles.** The Home film, Home sound, Work mute and gallery pause controls each use one signal. Home film and Home sound are switches with fixed names ("Play film", "Sound") whose checked state follows the setting. The Work mute button keeps a fixed name with `aria-pressed`. The gallery pause and point-study buttons change their visible text and carry no pressed state. The point-study name is its visible text plus "(point study)", so voice control can use the words on screen. The sound cue library treats `role="switch"` as a toggle.
- **One layout system.** Home's button navigation sits in the same 94px band as the Work header. Interaction design and Creative technology use Design's intro spacing and heading scale. Below 600px the Work header puts navigation first, at Home's position, with the controls in a row beneath it.
- **Folder prints.** `public/work/folder/` holds three small WebP prints (17 KB total), derived from `gallery/bstroy-01.jpg`, `sourcelink/views/home.webp` and `point-study/poster.jpg`. They are decorative; the folder trigger's enlarged hit area receives clicks on them. The folder is scaled to 1.2 above 900px.
- **Gallery.** The slider uses a roving tabindex: one card is in the tab order, and arrow keys, Home and End move between cards. `WorkGallery` takes a `filterable` prop that adds project filter buttons (`aria-pressed`, fixed names); changing the filter remounts the slider.
- **Video.** Home plays `gallery/video/moving-09-home.mp4` (834 × 540, H.264 CRF 30, 2.1 MB; was 4.5 MB). Creative technology plays `point-study/point-study-web.mp4` (1440 × 810, CRF 25, 3.4 MB; was 8.5 MB). The original encodes remain for the gallery viewer and as sources.

## Gallery and media viewer

Design retains the complete 141-item slider, original viewer and all five project cards. It uses native scrolling without automatic drift. The separate Image archive page and links have been removed; its former URL redirects to Design.

The viewer opens the selected image in its original collection. It includes previous and next controls, thumbnails, arrow-key navigation, Escape dismissal, and focus restoration. Videos use native playback controls. Thumbnails keep the selected item visible without scrolling the document. The stacked display uses translations without skew or rotation. Image mounts and thumbnails use the page background.

## Current work displays

Corey's latest 27 October correction restores Design's original full slider and five project cards. Its source matches published commit `bc44be6`. Project-detail navigation again includes every project in the same discipline.

`DigitalWork.astro` maps website project data to a React preview rail. Each item is a beveled rectangular image of the site, with its name and role. Native horizontal scrolling and snap alignment arrange future projects alongside SourceLink. Navigation controls appear only with multiple entries after hydration; scroll and resize listeners maintain boundary states. Keyboard activation and reduced motion scroll immediately. Server HTML and browsers without JavaScript retain native links and horizontal scrolling. Framer Motion and Lenis were removed because the latest horizontal presentation does not use them.

Opening a preview leads to `WebsiteBundle.astro`, which enforces a maximum of three images with `.slice(0, 3)`. SourceLink uses three 1440 × 1000 landscape page views, with aligned overlap, natural proportions and no visible screenshot labels. Accessible descriptions, image links and a separate live-site link remain. `listingMedia` supplies the preview; `displayMedia` supplies the page views. Source/time/viewport-extraction provenance accompanies each WebP. Future websites reuse these fields.

No Creative technology app projects remain after Image Press's removal. The point-cloud film and terminal stay directly visible, preserving their original components and playback behavior. The main folder and homepage remain. The In the studio disclosure and separate Image archive have been removed for this release. Corey authorised pushing branch `codex/edited-work-sequence` and publishing the approved revision on Vercel on 27 October 2026. See [work-display.md](work-display.md) for scope and checks.

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

The Web Kits sound component uses a header wrapper scoped to the folder. Folder transitions and the mute control can play cues; gallery controls, viewers, navigation, and workflow disclosures remain silent. The setting is separate from Home's film soundtrack. Trusted transition provenance is handled in [folder-events.ts](../src/lib/folder-events.ts).

## Typography and styling

[visualTheme.css](../src/visualTheme.css) defines the Helvetica system stack, page colours, and monospace labels. The terminal uses monospace text. The release has no bundled PP Neue Montreal files or font requests.

[edited-work.css](../src/edited-work.css) defines the compact digital discipline headings. Website preview/rail styles live in `images-scrolling-animation.css`; the screenshot bundle styles live in `WebsiteBundle.astro`. Design keeps its original styles. [experimental-work.css](../src/experimental-work.css) retains the film presentation and earlier layout rules. The folder keeps [folder.css](../src/folder.css). [styles.css](../src/styles.css) imports Tailwind theme and utilities with explicit component sources and no Preflight reset. [components.json](../components.json) and [tsconfig.json](../tsconfig.json) define the UI component paths and `@/` alias.

## Static rendering and hosting

Astro generates static HTML and assets in `dist/`. React islands hydrate the film controls, folder, sound controls, galleries, media viewer, and workflow disclosures. The terminal uses a client-side script. The site has one light colour scheme and no theme switch.

[vercel.json](../vercel.json) specifies the Astro framework, `npm run build`, and `dist/`. The repository does not need a server-rendering adapter. A successful local build is separate from a Vercel deployment; production status requires deployment metadata and live route checks.

## Media preparation

The scripts in `scripts/` prepare favicon exports, STUDY 01 images, and album artwork. Album artwork is uncropped and has responsive WebP sizes. Private CVs, original source attachments, and personal-use font downloads are excluded from public assets. Credits and publication evidence are tracked in the [editorial record](editorial-record.md).

## Removed projects

Image Press is removed from the project data, generated project pages, public tool snapshot and preview assets. `/work/image-press` and `/tools/image-press` return 404 in this local build. The standalone source repository is unchanged. The [historical integration reference](image-press-integration.md) records its original snapshot and attribution.

STUDY 01 remains absent from the project data, listing and routes. Its unused preparation script and media remain in the repository.

## Local visual pass · 16 November 2026

Unreviewed local changes in a worktree. Nothing here is committed, pushed or published, and none of it is an approved direction yet.

Home moves from a centred stack to the Work pages' column. On a twelve-column grid the film takes seven columns and the introduction four. The name is set at heading size on the film's top edge, and the contact line rests on its bottom edge. The film's caption shows its live playback position, and the Film and Sound switches sit in the same row. Below 900px the page returns to one column.

Under the film, [hover-preview-list.tsx](../src/components/ui/hover-preview-list.tsx) lists every case study and the point study as title rows. With a mouse, an uncropped image of the row follows the pointer in the same paper mount as the website previews. Keyboard focus parks the same image at the right of the focused row. The preview images download on the first hover or focus. Touch screens and widths under 700px show a 64px thumbnail in each row. Rows are separated by space, with no rules.

[motion.css](../src/motion.css) holds the shared motion:

- Cross-document view transitions (`@view-transition { navigation: auto; }`). Pages crossfade, the navigation buttons hold still, and a project image travels from its card or preview to the case study's lead image through a shared `view-transition-name`. Browsers without support navigate as before.
- `.rise` lifts a heading line out of its baseline on load. `.settle` fades supporting text in after it.
- `.reveal-media` ties an image's fade and 34px rise to its scroll position with `animation-timeline: view()`. Browsers without support show the image in place.

Reduced motion keeps the page crossfade and removes the movement.

Other changes:

- [magnetic.ts](../src/lib/magnetic.ts) pulls each navigation button 28% of the way toward the pointer through the `translate` property, which leaves the existing hover `transform` working.
- The Work folder leans up to 5 degrees toward the pointer while its prints shift the other way. Its three sheets rise 55ms apart when it opens, and the prints slide up on load. Above 1200 × 860px the folder is 1.3 times its base size. It uses `zoom` instead of `scale`, so the browser redraws the type at the larger size.
- [NextProject.astro](../src/components/NextProject.astro) replaces three copies of the case-study navigation. The next project's name is set at up to 72px beside its lead image.
- [SiteFooter.astro](../src/components/SiteFooter.astro) replaces the three page footers. [live-clock.tsx](../src/components/ui/live-clock.tsx) adds the current time in London and New Zealand after hydration. The server output still reads "London / New Zealand" without times.
- Design drops the "Selected case studies" label that repeated the "Selected projects." heading.
- `.work-container` moved from `work.css` to `styles.css`, because Home now uses it.

No dependency was added. The magnetic, pointer-following and scroll-reveal patterns are common in motion-primitives, React Bits and Magic UI, where they depend on the Motion library. They are rewritten here in CSS and plain React.

Checked locally on 16 November 2026 in Chrome for Testing: `astro check` and `npm run build` pass with no errors; no horizontal overflow on eight routes at 1440px and on Home, Work and BSTROY at 390px; view transitions complete on Home, Work, Design, case-study and website-project navigation; the keyboard preview appears on focus; reduced motion removes the load animations and pauses the film. Safari, Firefox and physical phones are unchecked.
