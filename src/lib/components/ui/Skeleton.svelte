<script>
  let { class: className = "h-4 w-full" } = $props();
</script>

<div
  class="animate-pulse motion-reduce:animate-none rounded bg-gray-300 dark:bg-gray-700 {className}"
  aria-hidden="true"
></div>
