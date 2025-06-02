import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

import vercel from "@astrojs/vercel";

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

  adapter: vercel(),
});