import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
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
