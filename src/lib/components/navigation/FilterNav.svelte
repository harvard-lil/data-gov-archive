<script>
  import { resolve } from "$app/paths";
  import { AGGREGATION_COUNT } from "$lib/data/config.js";
  import Skeleton from "$lib/components/ui/Skeleton.svelte";

  let { organizations = [], publishers = [], bureaus = [], loading = false } = $props();

  // Varied width for skeleton labels
  const skeletonWidths = [
    "w-3/4",
    "w-1/2",
    "w-5/6",
    "w-2/3",
    "w-7/12",
    "w-4/5",
    "w-1/2",
    "w-11/12",
  ];
</script>

{#snippet filterList(entities, entityName, entityLabel)}
  <div class="mb-1">
    <a
      class="block text-base font-bold text-inherit no-underline hover:underline"
      href={resolve(`/?resource=${entityName}`)}
    >
      {entityLabel}
    </a>
  </div>
  <ol class="text-sm mb-2">
    {#each entities as entity (entity.identifier)}
      <li
        class="flex justify-between border-b border-dotted border-gray-800 py-1 last:border-none dark:border-gray-200"
      >
        <a
          class="text-inherit no-underline hover:underline truncate"
          href={resolve(`/?resource=${entityName}/${encodeURIComponent(entity.identifier)}`)}
          title={entity.identifier}
        >
          {entity.identifier}
        </a>
        <b class="font-mono text-xs ml-1">{entity.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ol>
{/snippet}

{#snippet loadingList()}
  <Skeleton class="h-5 w-32 mb-2" />
  <ol class="text-sm mb-2">
    {#each Array.from({ length: AGGREGATION_COUNT }, (_, i) => i) as i (i)}
      <li
        class="flex justify-between border-b border-dotted border-gray-800 py-1 last:border-none dark:border-gray-200"
      >
        <Skeleton class="h-4 {skeletonWidths[i % skeletonWidths.length]}" />
        <Skeleton class="h-4 w-8 ml-1" />
      </li>
    {/each}
  </ol>
{/snippet}

<nav id="filters" aria-label="Filters" aria-busy={loading ? "true" : undefined}>
  <h2 class="sr-only">Filters</h2>

  {#if loading}
    <div aria-hidden="true">
      {@render loadingList()}
      {@render loadingList()}
      {@render loadingList()}
    </div>
  {:else}
    {@render filterList(organizations, "organizations", "Organizations")}
    {@render filterList(publishers, "publishers", "Publishers")}
    {@render filterList(bureaus, "bureaus", "Bureaus")}
  {/if}
</nav>
