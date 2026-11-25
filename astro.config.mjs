import { defineConfig } from "astro/config";

export default defineConfig({
  // Canonical and share-card URLs are built from this origin. Update it when a custom domain goes live.
  site: "https://corey-kavanagh-portfolio.vercel.app",
  output: "static",
  trailingSlash: "never",
  redirects: {
    // The site became a single page; old addresses land on the matching section.
    "/work": "/",
    "/work/design": "/",
    "/work/interaction-design": "/",
    "/work/creative-technology": "/#point-study",
    "/work/vory-lord-lift-me-up": "/#vory-lord-lift-me-up",
    "/work/unreleased-artwork": "/#unreleased-artwork",
    "/work/sourcelink": "/#sourcelink",
    "/work/bstroy": "/#bstroy",
    "/work/jimi-vain": "/#jimi-vain",
    "/work/stem-player": "/#stem-player",
    // Earlier names for the discipline pages.
    "/work/art-direction": "/",
    "/work/archive": "/",
    "/work/graphic-design": "/",
    "/work/design-engineering": "/#point-study",
    "/work/digital-work": "/#point-study",
  },
});
