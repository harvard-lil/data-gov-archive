import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    sveltekit(),
    viteStaticCopy({
      targets: [
        {
          src: "./data/data.db",
          dest: "./data/data.db",
        },
      ],
    }),
  ],
  server: {
    fs: {
      allow: ["./data"],
    },
  },
});
