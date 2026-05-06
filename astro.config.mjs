import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import remarkObsidianEmbeds from "./src/plugins/remark-obsidian-embeds.js";
import remarkMermaid from "./src/plugins/remark-mermaid.js";
import remarkObsidianLinks from "./src/plugins/remark-obsidian-links.js";
import remarkImageCaptions from "./src/plugins/remark-image-captions.js";

import imageOptimization from "./src/plugins/integration-optimize-images.js";

export default defineConfig({
  site: "https://gulenok.lu",
  output: "static",
  adapter: cloudflare({
    prerenderEnvironment: "node",
    imageService: "compile",
  }),
  integrations: [imageOptimization()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkMermaid, remarkObsidianEmbeds, remarkObsidianLinks, remarkImageCaptions],
  },
});
