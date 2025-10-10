import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    appDir: "app",
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    paths: {
      base: process.env.NODE_ENV === "production" ? "/data-gov-archive" : "",
      relative: process.env.NODE_ENV === "production" ? false : true,
    },
    prerender: {
      crawl: true,
      entries: ["/"],
      handleHttpError: "warn",
    },
  },
};

export default config;
