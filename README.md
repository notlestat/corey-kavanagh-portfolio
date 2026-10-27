# Portfolio

An image-led portfolio built with Astro, React, TypeScript, and Tailwind CSS. Home uses a looping film. Work opens a folder containing Design, Interaction design and Creative technology.

Design retains its original full slider and five project cards. Website projects use beveled site previews in a horizontal row, opening into up to three overlapping page views. Creative technology retains the point-cloud film and functioning terminal. The Design slider contains the complete image and film selection.

The scroll component is in `src/components/ui`, using the existing shadcn aliases, TypeScript and Tailwind setup. It uses native horizontal scrolling and real portfolio data. See the [work display reference](docs/work-display.md) for the data flow, motion choices and local-review scope.

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
