<script>
  import BreadcrumbNav from "$lib/components/BreadcrumbNav.svelte";
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";

  let { data, resource, buildUrl } = $props();
</script>

{#if data.entity && data.identifier}
  <BreadcrumbNav {resource} searchQuery={null} {buildUrl} pageNumber={data.pageNumber} />

  {#if data.isLoading}
    <p>Loading datasets…</p>
  {:else if data.totalItems > 0}
    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />

    <DatasetList datasets={data.datasets} showOrganization={data.entity?.showOrganization} />

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />
  {:else}
    <p>No datasets found.</p>
  {/if}
{/if}

<style lang="scss">
  h2 {
    font-weight: inherit;

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    span.tag {
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted #222;
      margin-left: 0.25em;
      padding: 0.5em 0.75em;

      font-family: monospace;
      font-weight: 400;
    }
  }
</style>
