# Corey Kavanagh portfolio

A React and TypeScript portfolio for art direction, design and creative technology. Home is a quiet, film-led introduction with an animated conversation and clothing-button page navigation. The Work page brings together a pinned entry index, image collections and current digital projects. In the image gallery, wheel scrolling moves an endless strip while the pointer is over it. On smaller screens and with reduced motion enabled, the strip becomes swipeable.

The source is published on GitHub. This README does not establish that a production website has been deployed.

## Run locally

Use Node.js 20.19+ or 22.12+ with npm, matching the checked-in Vite dependency requirements.

```sh
git clone https://github.com/notlestat/corey-kavanagh-portfolio.git
cd corey-kavanagh-portfolio
npm ci
npm run dev
```

Open the local address printed by Vite.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run check` | Check TypeScript project references |
| `npm run build` | Check types and create `dist/` |
| `npm run preview` | Serve the existing production build locally |

Run `npm run build` before `npm run preview`. There is no automated unit-test script in this repository.

## Project files

| Location | Purpose |
|---|---|
| [src/App.tsx](src/App.tsx) | Home and Work pages, navigation, gallery, collection viewer and contact section |
| [src/Home.tsx](src/Home.tsx) | Minimal Home, looping film, sound switch and conversation |
| [src/Navigation.tsx](src/Navigation.tsx) | Clothing-button page links, shared theme control and Work header |
| [src/Conversation.tsx](src/Conversation.tsx) | Accessible conversation bubbles used on Home |
| [src/ToolRail.tsx](src/ToolRail.tsx) | Monochrome Home tool marks with hover, keyboard and tap labels |
| [src/portfolioData.ts](src/portfolioData.ts) | Collection names, years, image/video paths and gallery ordering |
| [src/styles.css](src/styles.css) | Typography, layout, motion and responsive rules |
| [src/visualTheme.css](src/visualTheme.css) | Helvetica-based type, muted surfaces and component styling for both themes |
| [src/home.css](src/home.css) | Home spacing, film controls and tactile navigation |
| [src/main.tsx](src/main.tsx) | React entry point |
| `public/work/gallery/` | Local gallery images and video previews |
| [vite.config.ts](vite.config.ts) | Vite configuration |
| [vercel.json](vercel.json) | Direct `/work` route rewrite for Vercel |

Update collection metadata and item counts in `src/portfolioData.ts` when adding or removing media. Gallery paths are root-relative; a deployment under a URL subdirectory needs a path review.

## Current content

- Ten collections contain 141 gallery items. Ten video items have local playable previews.
- Individual source file names are not shown in the interface.
- Home introduces the full practice. Work holds the image archive and a growing digital section.
- Navigation links to [the GitHub profile](https://github.com/notlestat).
- No verified public contact route has been added yet.

Home reuses `public/work/gallery/video/moving-09.mp4`, which matches the supplied source film. It loops inline without native playback controls. Playback attempts audio first and falls back to muted autoplay when the browser requires a user gesture. The sound switch enables or disables audio. With reduced motion enabled, the film remains still until the visitor enables sound; the conversation shows its complete transcript.

The conversation uses iMessage-style blue outgoing and grey incoming bubbles in both themes. Replies type at a varied pace with thinking, punctuation and send pauses. Visitors can show every message immediately or replay the sequence.

Home also includes a small tools rail beside the introduction on desktop, moving beneath it on mobile. It identifies Photoshop, Illustrator, Figma, Paper Design, Claude Code and OpenAI Codex. Labels reveal on hover, keyboard focus or tap, and dismiss with Escape, focus leaving, or an outside tap. Ps/Ai are monochrome typographic tiles; Codex uses the OpenAI parent mark. Figma, Claude and OpenAI vector silhouettes come from [Simple Icons](https://github.com/simple-icons/simple-icons); Paper's mark comes from [Paper](https://paper.design/). The tool names describe the toolkit, not affiliations or certifications.

## Before launching the website

Confirm project credits and usage rights, add case-study detail where useful, and provide a verified contact route. Review video and image quality at full size. A Graphic Design source image was previously held out pending a publication decision; adding new media still requires editorial review.
