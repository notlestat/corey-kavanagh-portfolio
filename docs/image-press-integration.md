# Image Press integration history

Removed from this local portfolio build at Corey’s request on 27 October 2026. Its listing, project page, public runtime snapshot and preview image are no longer shipped. The original app repository is unchanged. The sections below describe the earlier integration; paths and update instructions are historical.

## Source snapshot

The bundled application comes from [notlestat/image-press](https://github.com/notlestat/image-press), commit `442ea9bff65f1bf714306bce668c16d7d0b85a0c`. The repository's interface screenshot supplies the project cover. No placeholder imagery is used.

The runtime snapshot lives in `public/tools/image-press`. Its controls, machine drawing, print model and local image processing are retained. Root asset paths are scoped to `/tools/image-press/`, and the app's home link opens the standalone press. No remote service or API key is required. Uploaded photographs stay in browser memory.

`InteractiveProject.astro` embeds the app with normal keyboard and file-input access. It measures the app's content to keep the frame tall enough without an inner scrollbar, including after fonts load or the viewport changes. A separate-tab link stays available, and a failed frame has a fallback message.

## Update the snapshot

Use a clean Image Press checkout at the revision you intend to include. Build and check that project first:

```sh
npm run build
npm test
npm run audit
```

From the portfolio checkout, copy its runtime files:

```sh
node scripts/sync-image-press.mjs /path/to/image-press
```

The script records the source commit in `public/tools/image-press/provenance.json`. Review any upstream behavior changes before including the new snapshot. Update the interface cover separately when its appearance changes.

## Attribution

The snapshot retains Anatomy’s MIT licence and the SIL Open Font Licenses for Archivo and Roboto Mono. The sample photograph comes from [Unsplash](https://images.unsplash.com/photo-1470770841072-f978cf4d019e). App credits and source links are retained in `public/tools/image-press/CREDITS.md`.

The portfolio keeps its Helvetica stack. The app's fonts and visual system remain isolated inside its frame. The orb experiment is excluded from this branch. Corey authorised the GitHub push and Vercel publication on 25 October 2026. Pull-request merging requires separate approval.
