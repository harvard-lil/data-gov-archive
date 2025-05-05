<script>
  import Header from "$lib/Header.svelte";
  import "@fontsource-variable/public-sans";
  import "@fontsource-variable/public-sans/wght-italic";
</script>

<Header />

<nav><h2>Filters</h2></nav>

<main>
  <slot />
</main>

<style lang="scss">
  :global(body) {
    background-color: #ddd;
    color: #222;

    margin: 0 auto;
    padding: 0 1.5em 1.5em;
    max-width: 50rem;

    font-family: "Public Sans Variable", sans-serif;
    font-weight: 400;

    /* Grid system */
    display: grid;
    grid-template-columns: 2fr 5fr;
    grid-template-rows: max-content 1fr;
    gap: 0 0;
    grid-template-areas:
      "a a"
      "b c";
  }

  nav {
    grid-area: b;
  }

  main {
    grid-area: c;
  }
</style>
