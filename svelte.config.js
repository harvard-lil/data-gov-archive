import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    paths: {
      base: "/harvard-lil/gov-data",
    },
    prerender: {
      crawl: true,
      entries: [
        "/*",
        "/bureaus/[id]",
        "/datasets",
        "/datasets/[name]",
        "/organizations/[id]",
        "/publishers/[id]",
        "/tags",
        "/tags/[tag]",
      ],
    },
  },
};

export default config;
