# Portfolio

An image-led portfolio built with Astro, React, TypeScript, and Tailwind CSS. Home uses a looping film. Work opens a folder with three disciplines and retains the complete image archive.

Design combines the original image slider with visual project links. The media viewer includes stacked images, thumbnails, keyboard navigation, and video controls. Creative technology includes a point-study film with a terminal that controls playback. Contact links dial the published phone number.

Image Press is available as an interactive Creative technology project. Its app runs inside the portfolio, with a separate-tab link and browser-only image processing. See the [integration reference](docs/image-press-integration.md) for its source snapshot and credits.

The release uses the system Helvetica stack. The checked-in version is recorded in [package.json](package.json).

## Run locally

Use a supported even-numbered Node.js release at version 22.12 or higher, with npm. Download or clone the repository, then run:

```sh
npm ci
npm run dev
```

Open the address printed by Astro, usually `http://localhost:4321`. To choose another port, run `npm run dev -- --port 4322`.

## Check a change

Build the static site and serve the result:

```sh
npm run build
npm run preview
```

The build includes Astro and TypeScript checks. `npm run check` runs those checks separately. There is no unit-test script.

Use the preview to check changed routes, the Work folder, slider controls, media viewing, keyboard focus, narrow layouts, both themes, and reduced motion. A passing local build does not establish a production deployment.

## Find the source

| Task | File |
| --- | --- |
| Edit Home | [src/pages/index.astro](src/pages/index.astro) |
| Edit discipline links | [src/workDisciplines.ts](src/workDisciplines.ts) |
| Edit case studies | [src/caseStudyData.ts](src/caseStudyData.ts) |
| Edit gallery membership | [src/portfolioData.ts](src/portfolioData.ts) |
| Edit the media display | [src/components/ui/display-cards.tsx](src/components/ui/display-cards.tsx) |
| Edit terminal commands | [src/lib/point-study.ts](src/lib/point-study.ts) |
| Edit contact details | [src/components/Contact.astro](src/components/Contact.astro) |
| Edit shared typography | [src/visualTheme.css](src/visualTheme.css) |
| Review hosting settings | [vercel.json](vercel.json) |

Reusable UI components live in `src/components/ui`. The `@/` import alias points to `src/`; [components.json](components.json) records the shadcn-compatible paths. Tailwind scans these components through the explicit sources in [src/styles.css](src/styles.css).

## Read the project records

- [Implementation reference](docs/implementation.md) describes the routes, gallery, image viewer, terminal, and static deployment.
- [Editorial record](docs/editorial-record.md) retains the artwork evidence, draft labels, attribution, and publication decisions.

Review media selections, collaborator credits, and usage permissions before changing public claims. Private source documents and personal-use font downloads are excluded from the release.
