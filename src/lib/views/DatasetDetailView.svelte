<script>
  import DatasetDetail from "$lib/components/DatasetDetail.svelte";
  import { base } from "$app/paths";

  let { data, resource, buildUrl } = $props();

  // Create custom breadcrumbs for dataset detail view
  let breadcrumbs = $derived(() => {
    if (!data.dataset) return [];

    return [
      {
        label: "Home",
        url: buildUrl({}),
      },
      {
        label: "Organizations",
        url: buildUrl({ type: "organization" }),
      },
      {
        label: data.dataset.organization_title,
        url: buildUrl({ type: "organization", id: data.dataset.organization_title }),
      },
    ];
  });
</script>

{#if data.isLoading}
  <p>Loading dataset…</p>
{:else if data.dataset}
  <!-- Custom breadcrumb navigation for dataset detail -->
  <nav aria-label="Breadcrumb" class="mb-4 text-sm flex min-w-0 w-full">
    <ol class="list-none p-0 m-0 flex min-w-0 flex-nowrap w-full">
      {#each breadcrumbs() as crumb, index}
        <li class="flex shrink-0 min-w-0" class:flex-1={index === breadcrumbs().length - 1}>
          <a
            href={crumb.url}
            class="text-inherit no-underline hover:underline min-w-0"
            class:block={index === breadcrumbs().length - 1}
            class:overflow-hidden={index === breadcrumbs().length - 1}
            class:text-ellipsis={index === breadcrumbs().length - 1}
            class:whitespace-nowrap={index === breadcrumbs().length - 1}
            class:w-full={index === breadcrumbs().length - 1}
            title={index === breadcrumbs().length - 1 ? crumb.label : undefined}>{crumb.label}</a
          >
        </li>
        {#if index < breadcrumbs().length - 1}
          <li class="flex select-none mx-2 shrink-0" aria-hidden="true">/</li>
        {/if}
      {/each}
    </ol>
  </nav>
  <DatasetDetail dataset={data.dataset} />
{/if}
