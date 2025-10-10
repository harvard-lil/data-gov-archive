<script>
  import { base } from "$app/paths";
  import SkipLink from "./SkipLink.svelte";

  let { organizations, publishers, bureaus, tags } = $props();

  function buildEntityListUrl(entityType) {
    const resourceMap = {
      organization: "organizations",
      bureau: "bureaus",
      publisher: "publishers",
    };
    return `${base}/?resource=${resourceMap[entityType]}`;
  }

  function buildEntityDetailUrl(entityType, id) {
    const resourceMap = {
      organization: "organizations",
      bureau: "bureaus",
      publisher: "publishers",
    };
    return `${base}/?resource=${resourceMap[entityType]}/${encodeURIComponent(id)}`;
  }
</script>

{#snippet filterList(entities, entityName, entityLabel, idField)}
  <div class="mb-1 flex justify-between">
    <a
      class="block text-base font-bold text-inherit no-underline hover:underline"
      href={buildEntityListUrl(entityName)}
    >
      {entityLabel}
    </a>
  </div>
  <ol class="text-sm mb-2">
    {#each entities as entity}
      <li
        class="flex justify-between border-b-1 border-dotted border-gray-800 py-1 last:border-none dark:border-gray-200"
      >
        <a
          class="text-inherit no-underline hover:underline truncate"
          href={buildEntityDetailUrl(entityName, entity[idField])}
          title={entity[idField]}
        >
          {entity[idField]}
        </a>
        <b class="font-mono text-xs ml-1">{entity.count.toLocaleString("en-US")}</b>
      </li>
    {/each}
  </ol>
{/snippet}

<nav id="filters" aria-label="Filters">
  <h2 class="sr-only">Filters</h2>

  {@render filterList(organizations, "organization", "Organizations", "organization_title")}
  {@render filterList(publishers, "publisher", "Publishers", "publisher")}
  {@render filterList(bureaus, "bureau", "Bureaus", "bureau_name")}
</nav>
