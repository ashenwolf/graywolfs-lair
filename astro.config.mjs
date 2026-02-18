import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import remarkObsidianEmbeds from "./src/plugins/remark-obsidian-embeds.js";
import remarkMermaid from "./src/plugins/remark-mermaid.js";

export default defineConfig({
  output: "static",
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkMermaid, remarkObsidianEmbeds],
  },
});
