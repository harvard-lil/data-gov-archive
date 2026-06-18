<script>
  import { resolve } from "$app/paths";
  import Skeleton from "$lib/components/ui/Skeleton.svelte";

  let { entity, instances = [], loading = false, count = 8 } = $props();
</script>

<ul aria-hidden={loading ? "true" : undefined}>
  {#if loading}
    {#each Array.from({ length: count }, (_, i) => i) as i (i)}
      <li class="py-6 last:border-b border-t border-dotted border-gray-800">
        <Skeleton class="h-6 w-2/3 mb-2" />
        <Skeleton class="h-4 w-32" />
      </li>
    {/each}
  {:else}
    {#each instances as instance (instance.identifier)}
      <li class="py-6 last:border-b border-t border-dotted border-gray-800 wrap-break-word">
        <div class="mb-2">
          <a
            class="text-inherit text-xl font-bold no-underline hover:underline"
            href={resolve(`/?resource=${entity.route}/${encodeURIComponent(instance.identifier)}`)}
          >
            {instance.identifier}
          </a>
        </div>
        <p class="text-base italic">
          {Number(instance.count[0]).toLocaleString("en-US")} dataset{#if Number(instance.count[0]) != 1}s{/if}
        </p>
      </li>
    {/each}
  {/if}
</ul>
