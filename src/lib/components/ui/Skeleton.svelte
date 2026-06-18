<script>
  let { class: className = "h-4 w-full" } = $props();
</script>

<div
  class="animate-pulse motion-reduce:animate-none rounded bg-slate-300 dark:bg-slate-700 {className}"
  aria-hidden="true"
></div>
