# Portfolio

An image-led portfolio built with Astro, React, TypeScript, and Tailwind CSS. Home plays a looping film. Work opens a folder with one page per discipline.

| Route | Contents |
| --- | --- |
| `/work/design` | A filterable slider with the full image and film selection, then five project cards |
| `/work/interaction-design` | A horizontal row of website projects |
| `/work/creative-technology` | A point-cloud film with a working terminal. Featured projects with this category appear below it |
| `/work/<slug>` | One case-study page per entry in `src/caseStudyData.ts` |

`/work/art-direction` redirects to `/work/design`. Website projects open into up to three overlapping page views. Type `help` in the Creative technology terminal to list its playback commands.

`src/components/ui/images-scrolling-animation.tsx` renders the website row with native horizontal scrolling. It uses the shadcn aliases in [components.json](components.json). See the [work display reference](docs/work-display.md) for the data flow, motion choices, and local-review scope.

The site uses the system Helvetica stack. The checked-in version is in [package.json](package.json).

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
| Edit the Design slider and filter | [src/WorkGallery.tsx](src/WorkGallery.tsx) |
| Edit the media display | [src/components/ui/display-cards.tsx](src/components/ui/display-cards.tsx) |
| Edit the website row | [src/components/ui/images-scrolling-animation.tsx](src/components/ui/images-scrolling-animation.tsx) |
| Edit terminal commands | [src/lib/point-study.ts](src/lib/point-study.ts) |
| Edit contact details | [src/components/Contact.astro](src/components/Contact.astro) |
| Edit shared typography | [src/visualTheme.css](src/visualTheme.css) |
| Review hosting settings | [vercel.json](vercel.json) |

Reusable UI components live in `src/components/ui`. The `@/` import alias points to `src/`. [components.json](components.json) records the shadcn-compatible paths. Tailwind scans these components through the explicit sources in [src/styles.css](src/styles.css).

## Read the project records

- [Implementation reference](docs/implementation.md) describes the routes, gallery, image viewer, terminal, and static deployment.
- [Editorial record](docs/editorial-record.md) retains the artwork evidence, draft labels, attribution, and publication decisions.

Review media selections, collaborator credits, and usage permissions before changing public claims. Private source documents and personal-use font downloads are excluded from the release.
