<script>
  import DatasetList from "$lib/components/listing/DatasetList.svelte";
  import PageNav from "$lib/components/navigation/PageNav.svelte";

  let { data, resource } = $props();
</script>

<div aria-busy={data.isLoading}>
  {#if data.showSkeleton || data.totalItems > 0}
    <PageNav
      loading={data.showSkeleton}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
      isTop={true}
    />

    <DatasetList loading={data.showSkeleton} datasets={data.datasets} />

    <PageNav
      loading={data.showSkeleton}
      pageNumber={data.pageNumber}
      totalItems={data.totalItems}
      {resource}
    />
  {:else}
    <p>No datasets found</p>
  {/if}
</div>
