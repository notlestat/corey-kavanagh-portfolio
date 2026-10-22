# Portfolio implementation reference

This reference describes the checked-in Astro site. See [the repository overview](../README.md) for setup and navigation.

## Project files

| Location | Purpose |
|---|---|
| [src/pages/index.astro](../src/pages/index.astro) | Home page structure and introduction |
| [src/pages/work.astro](../src/pages/work.astro) | Minimal Work folder, discipline navigation and archive link |
| [src/pages/work/[slug].astro](../src/pages/work/[slug].astro) | Static case-study routes |
| [src/components/CaseStudies.astro](../src/components/CaseStudies.astro) | Text-only case-study index on the Art direction page |
| [src/WorkFolder.tsx](../src/WorkFolder.tsx) | Minimal folder disclosure using the shared discipline links |
| [src/workDisciplines.ts](../src/workDisciplines.ts) | Authoritative discipline names, routes and descriptions |
| [src/lib/folder-events.ts](../src/lib/folder-events.ts) | Single-use trusted folder transition provenance for scoped audio |
| [src/folder.css](../src/folder.css) | Folder material, fragmented type, responsive layout and restrained opening motion |
| [src/pages/work/archive.astro](../src/pages/work/archive.astro) | Preserved image scroll and full collection list |
| [src/components/sound.tsx](../src/components/sound.tsx) | Supplied Web Kits cue library, delegated listener and exported sound controls |
| [src/components/WorkSound.tsx](../src/components/WorkSound.tsx) | One sound wrapper/listener and mute control per Work document |
| [src/components/UpcomingStudies.astro](../src/components/UpcomingStudies.astro) | Retained upcoming-study layout, no longer rendered by a route |
| [src/caseStudyData.ts](../src/caseStudyData.ts) | Existing draft cases and visual-first authored projects with optional live/source links |
| [src/work.css](../src/work.css) | Work-only layout, case-study pages and archive viewer |
| [src/layouts/BaseLayout.astro](../src/layouts/BaseLayout.astro) | Shared HTML, metadata, global styles and early theme restoration |
| [scripts/generate-favicons.mjs](../scripts/generate-favicons.mjs) | Square web-icon exports from the retained CK artwork |
| [scripts/prepare-study-media.mjs](../scripts/prepare-study-media.mjs) | WebP crops from real STUDY 01 browser captures |
| [src/HomeFilm.tsx](../src/HomeFilm.tsx) | Looping film, sound switch and Home theme control |
| [src/WorkExplorer.tsx](../src/WorkExplorer.tsx) | Scrolling archive and modal media viewer with shared React state |
| [src/WorkGallery.tsx](../src/WorkGallery.tsx) | Shared discipline slider, automatic loop and retained image/video viewer |
| [src/Navigation.tsx](../src/Navigation.tsx) | Clothing-button page links, shared theme control and GitHub icon |
| [src/components/Header.astro](../src/components/Header.astro) | Logo-free Work header with page links, sound, theme and GitHub controls |
| [src/components/DigitalWork.astro](../src/components/DigitalWork.astro) | Static digital-project section with interactive system rows |
| [src/SystemRow.tsx](../src/SystemRow.tsx) | Expandable system details |
| [src/systemData.ts](../src/systemData.ts) | Existing digital-system descriptions |
| [src/Conversation.tsx](../src/Conversation.tsx) | Retained conversation component, no longer rendered on Home |
| [src/ToolRail.tsx](../src/ToolRail.tsx) | Retained tools and skills component, no longer rendered on Home |
| [src/portfolioData.ts](../src/portfolioData.ts) | Collection names, years, image/video paths and gallery ordering |
| [src/styles.css](../src/styles.css) | Typography, layout, motion and responsive rules |
| [src/visualTheme.css](../src/visualTheme.css) | Helvetica-based type, muted surfaces and component styling for both themes |
| [src/home.css](../src/home.css) | Home spacing, film controls and tactile navigation |
| `public/work/gallery/` | Local gallery images and video previews |
| [astro.config.mjs](../astro.config.mjs) | Static output, React integration and Tailwind Vite plugin |
| [vercel.json](../vercel.json) | Astro preset, build command and output directory for Vercel |

Update collection metadata and item counts in `src/portfolioData.ts` when adding or removing media. Gallery paths are root-relative; a deployment under a URL subdirectory needs a path review.

Favicons use the intact CK mark on the site's light neutral background, with tight browser padding and additional Apple home-screen padding. [scripts/generate-favicons.mjs](../scripts/generate-favicons.mjs) owns the PNG, ICO and Apple touch-icon export sizes; the shared layout owns their declarations on every route. The exports follow [Google's square favicon recommendation](https://developers.google.com/search/docs/appearance/favicon-in-search) and [Safari's touch-icon declaration](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html). Regenerate with `node scripts/generate-favicons.mjs` or pass a higher-resolution CK PNG as its first argument. This uses the sharp image tooling installed by Astro. Only the exported icons belong in public assets, not private source paths. Favicons may remain cached after publication, and Google decides whether and when to show them in search.

## Rendering and deployment

The Home introduction, navigation, page metadata, Work header, case-study text and footers are generated by Astro. `client:load` attaches React to film controls, the Work folder, sound controls, discipline galleries, archive/list viewer and workflow disclosures on Creative technology. The workflow section is not rendered on the main Work page. Initial React markup is deterministic during server rendering; browser preferences are read after hydration. The saved theme is applied by a head script before the page paints.

The build generates static HTML for Home, Work, the archive, the discipline pages and individual case studies, alongside the existing assets. `/work` is a real static page and no longer rewrites to the Home HTML. Legacy discipline redirects are configured in [astro.config.mjs](../astro.config.mjs). Vercel uses the repository's Astro framework preset, `npm run build` and `dist` output directory. No server-rendering adapter is needed for this static site. Pushes to the connected production branch trigger a production deployment; verify the routes and their interactions after publishing.

## Current content

- Collection membership and image/video counts come from [src/portfolioData.ts](../src/portfolioData.ts); the archive derives its displayed counts from those arrays.
- Individual source file names are not shown in the interface.
- The draft BSTROY, Jimi Vain and Stem Player case-study routes remain `/work/bstroy`, `/work/jimi-vain` and `/work/stem-player`.
- See [Album artwork](editorial-record.md#album-artwork-approved-for-publication-on-12-october-2026) for the new Art direction entries.
- Navigation links to [the GitHub profile](https://github.com/notlestat).
- No verified public contact route has been added yet.

Home reuses `public/work/gallery/video/moving-09.mp4`, which matches the supplied source film. It loops inline without native playback controls. Playback attempts audio first and falls back to muted autoplay when the browser requires a user gesture. The sound switch enables or disables audio. With reduced motion enabled, the film remains still until the visitor enables sound.

The tools and skills icon row has been removed from Home. Its component and styles remain in the source for reuse, but Home does not render or hydrate them. The film, name, disciplines, bio, navigation and footer are unchanged.

## Folder and sound

Unmute feedback belongs to one trusted local `SoundToggle` press and is consumed once. The public `setSoundMuted` API is always silent, including when passed a saved native event; its optional event argument is retained only for compatibility. The shared setting notifier clears pending feedback for storage updates, volume changes and programmatic setting changes, so background updates cannot reuse a previous button press.

The folder uses native button/navigation elements, `aria-expanded`, inert closed links, Escape dismissal and a no-JavaScript link fallback. Its 240ms opening transition explains where the three paper entries come from; keyboard activation and reduced-motion mode skip the transition. Grain and fragmented lettering interpret the supplied paper reference and [Raygun archive](https://designreviewed.com/series/raygun/) without using its cover artwork.

The attached `sound.tsx` reference was used directly rather than running the shadcn registry generator. Its cue definitions, exported API, `data-slot`/`data-sound` wiring, SVG and exact SoundToggle utility string are retained. Differences: relative imports match this repository; Tailwind v4 runs through Astro's Vite integration with only theme/utilities and explicit sound-file sources, no Preflight reset; the supplied CSS dark tokens also recognise the site's existing `data-theme="dark"` selector; extra foreground/ring tokens map to the existing ink. The mute control overrides its outer hit area to 44px with `cn`, leaving the 17px glyph intact. If reading or writing a sound setting fails, that setting uses memory for the rest of the document's lifetime, even if later reads would succeed. Volume is clamped to 0–1, including zero.

There is one `SoundEffects` wrapper in each Work document's header, with `scope="folder"`. Only opening or closing the folder and using the sound switch can play interface cues; navigation, gallery controls, viewers, workflow disclosures, theme changes and context menus are silent. The header's sound button mutes or unmutes interface sounds, and muted folder actions are silent. Folder feedback follows actual `aria-expanded` changes caused by trusted native button activation, Escape or outside-click dismissal. [src/lib/folder-events.ts](../src/lib/folder-events.ts) issues provenance for the synchronous transition dispatch and consumes it once; scripted folder events, attribute mutations and saved-event replays cannot produce a folder cue. The wrapper leaves the library's default `scope="all"` available to other callers. Home has no interface-sound listener. No cue plays on load or hover. The mute preference and volume are saved locally when storage is available; Web Kits also suppresses cues for reduced-motion users. This interface mute is separate from Home's film soundtrack.

The folder's entries come from [src/workDisciplines.ts](../src/workDisciplines.ts). Art direction at `/work/art-direction` combines the original art-direction, Graphic Design, personal-work and video collections in its image-only looping gallery above the artwork entries and three draft case studies. Interaction design at `/work/interaction-design` contains a SourceLink case-study link and the portfolio link. Creative technology at `/work/creative-technology` contains one clickable STUDY 01 title row above the retained workflow list, with no discipline-page slider. Collection and image-position IDs are preserved so the archive viewer opens the correct original image or playable video.

The Art direction slider drifts at a linear 24px/s on desktop and wraps seamlessly. It pauses on hover, keyboard focus, an open viewer, a hidden tab or when offscreen; a persistent Pause/Resume control lets visitors stop it themselves. The full archive uses the same gallery without automatic drift. Wheel input moves an endless strip while the pointer is over it; Prev/Next also work. Keyboard stepping is instant. Phones and reduced-motion mode retain native swipe/scroll without an automatic loop. The shared gallery repeats short collections enough times to cover a desktop viewport at the loop boundary. Duplicate copies are hidden from assistive technology and keyboard navigation.

Click-to-open viewing is retained. Bringing a card into view is restricted to Tab navigation with visible keyboard focus, not pointer focus or programmatic focus restoration. This prevents a clicked image moving out from under the pointer before the click completes, and keeps the strip in place when the viewer closes.

Confirm project credits and usage rights, add case-study detail where useful, and provide a verified contact route. Review video and image quality at full size. A Graphic Design source image was previously held out pending a publication decision; adding new media still requires editorial review.

## Website and app projects

STUDY 01 at `/work/study-01` and SourceLink at `/work/sourcelink` use the shared `SitePreview.astro` component. A live homepage preview links to the external project, followed by the project name and a short description. The preview has a small hover lift, a visible external-link cue, keyboard focus and reduced-motion support. Desktop homepages render in a fixed 1440 × 900 iframe and scale to the available width. No screenshot galleries appear on these project pages or in the image archive.

Use `presentation: "website"`, a verified `liveUrl`, a brief `summary` and `media: []` for future website/app projects. Set `previewScripts: true` only when the app needs JavaScript to render. Previews do not accept input, submit forms or navigate the embedded page. The enclosing link opens the actual site in a new tab. Check the destination's frame restrictions before adding it. SourceLink renders its server-generated homepage without scripts, avoiding its newsletter popup; STUDY 01 requires scripts for its application.

Interaction design and Creative technology reuse Art direction's case-study row markup and hover underline. Website projects remain linked to their local project pages from these discipline lists. The existing Art direction case studies retain their image layouts and draft content.
