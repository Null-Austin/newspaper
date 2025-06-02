import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://news.hackclub.com",

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
  integrations: [sitemap()],
});
