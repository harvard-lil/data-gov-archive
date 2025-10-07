<script>
  import { base } from "$app/paths";
  import SearchBox from "./SearchBox.svelte";
</script>

<header class="mb-6">
  <h1 class="mb-4 text-5xl font-thin">
    <a class="text-inherit no-underline" href={`${base}/`}> Data.gov Archive Search </a>
  </h1>

  <h2 class="mb-6 text-2xl font-light">
    A project of the Library Innovation Lab at Harvard Law School
  </h2>

  <p class="mb-4 text-lg">
    This is an interface to search the <a href="https://lil.law.harvard.edu">
      Library Innovation Lab's
    </a>
    archive of <a href="https://data.gov">Data.gov</a>
    datasets. The collection contains 17.9 TB of data across 311,604 datasets harvested, beginning in
    2024, from public data cataloged at the "home of the U.S. government's open data."
  </p>
  <p class="text-lg">
    You may also browse the <a href="https://source.coop/harvard-lil/gov-data">entire archive</a> on
    <a href="https://source.coop">Source Cooperative</a>. Each entry here includes links to both the
    objects in Source Cooperative and the original Data.gov dataset, if available. For more
    information, see LIL's
    <a href="https://lil.law.harvard.edu/our-work/public-data-project">Public Data Project</a>.
  </p>
</header>

<SearchBox />
