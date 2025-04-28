<script>
  import "@fontsource-variable/public-sans";
</script>

<h1><a href="/">Archive of Data.gov</a></h1>

<slot />

<style lang="scss">
  :global(body) {
    background-color: #ddd;
    color: #222;

    margin: 0 auto;
    max-width: 40rem;

    font-family: "Public Sans Variable", sans-serif;
    font-weight: 400;
  }

  h1 {
    font-weight: 100;
    font-size: 3em;

    a {
      color: inherit;
      text-decoration: inherit;
    }
  }
</style>
