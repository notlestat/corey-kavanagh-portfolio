import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  output: "static",
  trailingSlash: "never",
  redirects: {
    "/work/graphic-design": "/work/art-direction",
    "/work/design-engineering": "/work/creative-technology",
    "/work/digital-work": "/work/creative-technology",
  },
});
