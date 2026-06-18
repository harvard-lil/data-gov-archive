<script>
  import { resolve } from "$app/paths";
  let { tags } = $props();
</script>

<ul class="flex flex-wrap gap-1.5">
  {#each tags as tag (tag)}
    <li class="flex-none">
      <a
        class="font-mono py-1.5 px-2.5 text-sm text-inherit no-underline hover:underline block max-w-100 overflow-nowrap overflow-hidden text-ellipsis text-nowrap border border-dotted border-gray-800 rounded-md"
        href={resolve(`/?resource=tags/${encodeURIComponent(tag)}`)}
        title={tag}
      >
        {tag}
      </a>
    </li>
  {/each}
</ul>
