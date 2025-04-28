<script>
  import "@fontsource-variable/public-sans";
</script>

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
</style>
