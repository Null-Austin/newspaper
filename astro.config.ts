import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  image: {
    remotePatterns: [
      // Notion's image CDN!
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
