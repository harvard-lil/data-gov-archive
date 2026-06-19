<script>
  import logoUrl from "$lib/assets/pdp-primary-logo-hls.svg?url";
  import SkipLink from "./SkipLink.svelte";
</script>

<footer class="bg-gray-300 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  <a id="footer" class="sr-only" tabindex="-1">Footer</a>

  <div class="mx-auto max-w-225 p-8 relative">
    <SkipLink target="header" label="top of page" />

    <div class="text-xl hyphens-auto">
      <p class="mb-4">
        This interface supports searching the
        <a href="https://source.coop/harvard-lil/gov-data">
          Data.gov Archive
        </a>, a collection of 311,604 datasets (approximately 17.9 TB) harvested between November
        2024 and January 2025.
      </p>
      <p>
        Data.gov Archive Search is a project of the
        <a href="https://lil.law.harvard.edu">Library Innovation Lab</a>
        (LIL) at Harvard Law School. For more information on our work, see LIL's
        <a href="https://lil.law.harvard.edu/our-work/public-data-project">
          Public Data Project
        </a>.
      </p>
    </div>

    <a
      class="block text-inherit hover:text-inherit"
      href="https://lil.law.harvard.edu/our-work/public-data-project/"
      rel="external"
      title="Public Data Project at Harvard Law School Library"
    >
      <div
        class="aspect-1064/155.5 w-full mt-4 bg-current mask-contain mask-no-repeat"
        role="img"
        style="mask-image: url({logoUrl});"
      ></div>
    </a>
  </div>
</footer>
