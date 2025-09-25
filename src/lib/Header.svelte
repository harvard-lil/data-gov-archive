<script>
  import { base } from "$app/paths";
  import SearchBox from "./SearchBox.svelte";
</script>

<header>
  <h1><a href={`${base}/`}>Archive of Data.gov</a></h1>
  <p>
    This is an access point to the Harvard University <a href="https://lil.law.harvard.edu">
      Library Innovation Lab
    </a>'s archive of <a href="https://data.gov">Data.gov</a>
    datasets. The collection contains 17.9 TB of data across 311,604 datasets harvested, beginning in
    2024, from public data cataloged on Data.gov. For more information, see the
    <a href="https://lil.law.harvard.edu/our-work/public-data-project">Public Data Project</a>.
  </p>
  <p>
    You can also browse the <a href="https://source.coop/harvard-lil/gov-data">
      entire archive on Source Cooperative
    </a>.
  </p>

  <SearchBox />
</header>

<style lang="scss">
  header {
    grid-area: a;

    h1 {
      font-weight: 100;
      font-size: 3em;

      a {
        color: inherit;
        text-decoration: inherit;
      }
    }

    p {
      font-size: 1.25em;
    }
  }
</style>
