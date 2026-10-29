import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Canonical and share-card URLs are built from this origin. Update it when a custom domain goes live.
  site: "https://corey-kavanagh-portfolio.vercel.app",
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  output: "static",
  trailingSlash: "never",
  redirects: {
    // Design was published at /work/art-direction before the discipline was renamed.
    "/work/art-direction": "/work/design",
    "/work/archive": "/work/design",
    "/work/graphic-design": "/work/design",
    "/work/design-engineering": "/work/creative-technology",
    "/work/digital-work": "/work/creative-technology",
  },
});
