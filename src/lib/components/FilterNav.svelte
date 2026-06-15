<script>
  import { resolve } from "$app/paths";

  let { organizations, publishers, bureaus } = $props();
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

<nav id="filters" aria-label="Filters">
  <h2 class="sr-only">Filters</h2>

  {@render filterList(organizations, "organizations", "Organizations")}
  {@render filterList(publishers, "publishers", "Publishers")}
  {@render filterList(bureaus, "bureaus", "Bureaus")}
</nav>
