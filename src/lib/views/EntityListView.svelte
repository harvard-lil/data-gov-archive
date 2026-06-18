<script>
  import BreadcrumbNav from "$lib/components/navigation/BreadcrumbNav.svelte";
  import EntityList from "$lib/components/listing/EntityList.svelte";
  import PageNav from "$lib/components/navigation/PageNav.svelte";

  let { data, resource, buildUrl } = $props();
</script>

<BreadcrumbNav
  {resource}
  searchQuery={null}
  {buildUrl}
  pageNumber={data.pageNumber}
  loading={data.isLoading}
/>

<div aria-busy={data.isLoading}>
  {#if data.isLoading || (data.entity && data.totalItems > 0)}
    <PageNav
      loading={data.isLoading}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
      isTop={true}
    />

    <EntityList loading={data.isLoading} entity={data.entity} instances={data.entities} />

    <PageNav
      loading={data.isLoading}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
    />
  {:else if data.entity}
    <p>No {data.entity.title.toLowerCase()}s found.</p>
  {/if}
</div>
