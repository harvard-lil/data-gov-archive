<script>
  import { resolve } from "$app/paths";
  import SearchBox from "./SearchBox.svelte";
  import SkipLink from "./SkipLink.svelte";
</script>

<header class="mb-8 relative">
  <a id="header" class="sr-only" tabindex="-1">Header</a>
  <SkipLink target="search" label="search" />

  <h1 class="mb-4 text-5xl font-extralight">
    <a class="text-inherit no-underline" href={resolve("/")}>Data.gov Archive Search</a>
  </h1>

  <h2 class="mb-8 text-2xl font-light">
    A project of the Library Innovation Lab at Harvard Law School
  </h2>
</header>

<SearchBox />
