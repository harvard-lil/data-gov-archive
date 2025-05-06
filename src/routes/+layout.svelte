<script>
  import "@fontsource-variable/public-sans";
  import "@fontsource-variable/public-sans/wght-italic";

  import FilterNav from "$lib/FilterNav.svelte";
  import Header from "$lib/Header.svelte";

  let { data, children } = $props();
</script>

<Header />

<FilterNav
  organizations={data.organizations}
  publishers={data.publishers}
  bureaus={data.bureaus}
  tags={data.tags}
/>

<main>
  {@render children?.()}
</main>

<style lang="scss">
  :global(body) {
    background-color: #ddd;
    color: #222;

    margin: 0 auto;
    padding: 0 1.5em 1.5em;
    max-width: 54em;

    font-family: "Public Sans Variable", sans-serif;
    font-weight: 400;

    /* Grid system */
    display: grid;
    grid-template-columns: 16em 36em;
    grid-template-rows: max-content 1fr;
    gap: 0 2em;
    grid-template-areas:
      "a a"
      "b c";
  }

  main {
    grid-area: c;
  }
</style>
