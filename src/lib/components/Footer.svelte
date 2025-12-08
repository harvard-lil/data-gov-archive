<script>
  import SkipLink from "./SkipLink.svelte";
</script>

<footer class="bg-gray-800 text-gray-100">
  <a id="footer" class="sr-only" tabindex="-1">Footer</a>

  <div class="mx-auto max-w-225 p-6 relative">
    <SkipLink href="#header" label="top of page" />

    This is a project of the
    <a class="text-blue-200" href="https://lil.law.harvard.edu"> Library Innovation Lab </a>, part
    of the
    <a class="text-blue-200" href="https://hls.harvard.edu"> Harvard Law School Library </a>. For
    more information on our work, please see the
    <a class="text-blue-200" href="https://lil.law.harvard.edu/our-work/public-data-project">
      Public Data Project
    </a>.
  </div>
</footer>
