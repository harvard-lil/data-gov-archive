<script>
  import SkipLink from "./SkipLink.svelte";
</script>

<footer class="bg-gray-800 text-gray-100 relative">
  <a id="footer" class="sr-only" tabindex="-1" aria-label="Footer"></a>
  <SkipLink href="#header" label="top of page" />

  <div class="mx-auto max-w-225 p-6">
    <div class="max-w-200 flex-1">
      This is a project of the <a class="text-blue-200" href="https://lil.law.harvard.edu">
        Library Innovation Lab
      </a>, part of the
      <a class="text-blue-200" href="https://hls.harvard.edu"> Harvard Law School Library </a>. For
      more information on our work, please see the
      <a class="text-blue-200" href="https://lil.law.harvard.edu/our-work/public-data-project">
        Public Data Project
      </a>.
    </div>
  </div>
</footer>
