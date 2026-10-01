# Corey Kavanagh portfolio

A React and TypeScript portfolio for art direction, design and creative technology. Home introduces the practice through a scroll-led type sequence and an interactive conversation. The Work page brings together a pinned entry index, image collections and current digital projects. In the image gallery, wheel scrolling moves an endless strip while the pointer is over it. On smaller screens and with reduced motion enabled, the strip becomes swipeable.

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
| [src/Conversation.tsx](src/Conversation.tsx) | Accessible conversation bubbles used on Home |
| [src/portfolioData.ts](src/portfolioData.ts) | Collection names, years, image/video paths and gallery ordering |
| [src/styles.css](src/styles.css) | Typography, layout, motion and responsive rules |
| [src/visualTheme.css](src/visualTheme.css) | Helvetica-based type, muted surfaces and component styling for both themes |
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

## Before launching the website

Confirm project credits and usage rights, add case-study detail where useful, and provide a verified contact route. Review video and image quality at full size. A Graphic Design source image was previously held out pending a publication decision; adding new media still requires editorial review.
