<script>
  import EntityList from "$lib/components/EntityList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";

  export let data;
  export let resource;
</script>

{#if data.entity}
  <h2><b>{data.entity.title}s</b></h2>

  {#if data.isLoading}
    <p>Loading {data.entity.title.toLowerCase()}s…</p>
  {:else if data.totalItems > 0}
    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />

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
