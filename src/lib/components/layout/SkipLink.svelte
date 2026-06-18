<script>
  let { target, label } = $props();
</script>

<a
  class="clip-rect block w-1 h-1 overflow-hidden py-2 px-4 absolute top-4 left-4 z-50 text-inherit no-underline focus:w-auto focus:h-auto focus:overflow-visible focus:bg-gray-100 focus:text-gray-800"
  href={`#${target}`}
  tabindex="0">Skip to {label}</a
>

<style>
  .clip-rect {
    clip-path: rect(1px 1px 1px 1px);
  }
  .clip-rect:focus {
    clip-path: unset;
  }
</style>
