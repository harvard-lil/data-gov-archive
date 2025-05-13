<script>
  import EntityList from "$lib/EntityList.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Archive of Data.gov: {data.entity.title}</title>
</svelte:head>

<h2>{data.entity.title}s</h2>

<PageNav pageNumber={data.page} totalItems={data.count} route={data.entity.route} />

<EntityList entity={data.entity} instances={data.instances} />

<PageNav pageNumber={data.page} totalItems={data.count} route={data.entity.route} />
