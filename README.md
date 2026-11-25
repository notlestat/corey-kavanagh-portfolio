# Portfolio

A one-page portfolio built with Astro and TypeScript. The page opens with a signature that draws itself and a short letter. Below the letter, each project sits in a pile of images. Click a pile to open the project in a sheet with its images, credits and notes. The site has no UI framework. One script, [src/scripts/one-page.ts](src/scripts/one-page.ts), runs the page.

The first project, SourceLink, is a product case. Its pile holds a working copy of the SourceLink savings calculator, and its sheet shows the problem, the design decisions and what to measure.

## Run locally

Use Node.js 22.12 or higher, with npm. Clone the repository, then run:

```sh
npm ci
npm run dev
```

Open the address that Astro prints, usually `http://localhost:4321`.

The dev server also shows draft prompts in the SourceLink case. They mark copy that still needs writing and show as yellow highlights that start with "To write". Published builds leave them out.

## Check a change

Build the static site and serve the result:

```sh
npm run build
npm run preview
```

`npm run build` runs `astro check` before it builds. `npm run check` runs the check on its own. There is no unit-test script.

In the preview, check the signature and letter animation, the piles, the calculator, the project sheet, keyboard focus, narrow layouts and reduced motion. A passing local build does not prove that a production deployment worked.

## Find the source

| Task | File |
| --- | --- |
| Edit the letter, the index or the page structure | [src/pages/index.astro](src/pages/index.astro) |
| Edit projects, images and case copy | [src/onePageProjects.ts](src/onePageProjects.ts) |
| Edit page behaviour: animation, calculator, sheet and clocks | [src/scripts/one-page.ts](src/scripts/one-page.ts) |
| Edit styles | [src/one-page.css](src/one-page.css) |
| Edit the signature | [src/components/Signature.astro](src/components/Signature.astro) |
| Edit metadata and fonts | [src/layouts/OnePageLayout.astro](src/layouts/OnePageLayout.astro) |
| Edit redirects from old addresses | [astro.config.mjs](astro.config.mjs) |
| Review hosting settings | [vercel.json](vercel.json) |

Images and film live in `public/work`. Each project in `src/onePageProjects.ts` lists its images in `slides`. A pile shows five, three or one of them, depending on how many the project has.

## Add a draft prompt

Case copy accepts a string or `{ draft: "..." }`. A string is published copy. A draft is a note to yourself. `publishable()` in `src/onePageProjects.ts` removes every draft when `import.meta.env.DEV` is false, so drafts never reach the built page or its data. To publish a line, replace its `{ draft }` entry with a string.

## Keep old links working

The site used to have a page per discipline and per project. `astro.config.mjs` redirects those addresses. Each `/work/<project>` address goes to `/#<project>` on the one page, and the discipline pages go to `/` or to the Point study section. The project `id` values in `src/onePageProjects.ts` match the old addresses, so keep them stable.

## Read the project records

- [Editorial record](docs/editorial-record.md) keeps the artwork evidence, attribution and publication decisions.
- [Image Press integration history](docs/image-press-integration.md) describes an earlier embedded tool that is no longer shipped.

Review media selections, collaborator credits and usage permissions before changing public claims.
