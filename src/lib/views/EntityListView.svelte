<script>
  import BreadcrumbNav from "$lib/components/BreadcrumbNav.svelte";
  import EntityList from "$lib/components/EntityList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";

  let { data, resource, buildUrl } = $props();
</script>

{#if data.entity}
  <BreadcrumbNav {resource} searchQuery={null} {buildUrl} pageNumber={data.pageNumber} />

  {#if data.isLoading}
    <p>Loading {data.entity.title.toLowerCase()}s…</p>
  {:else if data.totalItems > 0}
    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} isTop={true} />

    <EntityList entity={data.entity} instances={data.entities} />

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />
  {:else}
    <p>No {data.entity.title.toLowerCase()}s found.</p>
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
  }
</style>
