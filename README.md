# Corey Kavanagh portfolio

An Astro portfolio for art direction, design, and creative technology, with React and TypeScript for interactive components. Home uses a looping film. Work groups projects by discipline and retains an image archive.

The published address is [corey-kavanagh-portfolio.vercel.app](https://corey-kavanagh-portfolio.vercel.app/). The checked-in version is in [package.json](package.json).

## Run locally

Use a supported even-numbered Node.js release at version 22.12 or higher, with npm.

```sh
git clone https://github.com/notlestat/corey-kavanagh-portfolio.git
cd corey-kavanagh-portfolio
npm ci
npm run dev
```

Open the address printed by Astro, usually `http://localhost:4321`. To choose another port, run `npm run dev -- --port 4322`.

## Check a change

Run the production build, which includes Astro and TypeScript checks:

```sh
npm run build
npm run preview
```

Use the preview address to inspect the changed pages. Check navigation, image viewing, keyboard focus, narrow layouts, and reduced motion where relevant. `npm run check` runs the static checks separately. There is no unit-test script.

## Find the source

| Task | File |
| --- | --- |
| Edit Home | [src/pages/index.astro](src/pages/index.astro) |
| Edit discipline links | [src/workDisciplines.ts](src/workDisciplines.ts) |
| Edit case studies | [src/caseStudyData.ts](src/caseStudyData.ts) |
| Edit gallery membership | [src/portfolioData.ts](src/portfolioData.ts) |
| Edit shared metadata | [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) |
| Review hosting configuration | [vercel.json](vercel.json) |

Keep media paths and collection metadata aligned when adding or removing artwork. Review credits, selected media, and usage permissions before changing public claims.

## Read the project records

- [Implementation reference](docs/implementation.md) describes routes, source files, galleries, folder controls, sound, and website previews.
- [Editorial record](docs/editorial-record.md) retains the dated artwork evidence, draft labels, and publication decisions.

The site builds static HTML to `dist/`. Hosting configuration is recorded in the repository; a successful local build does not establish a new production deployment.
