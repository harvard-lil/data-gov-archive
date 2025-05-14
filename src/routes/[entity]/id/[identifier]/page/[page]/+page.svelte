<script>
  import { page } from "$app/stores";

  import DatasetList from "$lib/DatasetList.svelte";
  import PageNav from "$lib/PageNav.svelte";

  let { data } = $props();

  let identifier = $derived(encodeURIComponent(data.datasets[0][data.entity.identifier]));
  let label = $derived(
    data.datasets[0][data.entity.label] ? data.datasets[0][data.entity.label] : identifier
  );
</script>

<svelte:head>
  <title>Archive of Data.gov: {label}</title>
</svelte:head>

<h2>
  <b>{data.entity.title}:</b>
  {#if data.page > 1}
    <a href="./1">{label}</a>
  {:else}
    {label}
  {/if}
</h2>

<PageNav
  pageNumber={data.page}
  totalItems={data.count}
  route="{data.entity.route}/id/{identifier}"
/>

<DatasetList datasets={data.datasets} showOrganization={!(data.entity.route === "organizations")} />

<PageNav
  pageNumber={data.page}
  totalItems={data.count}
  route="{data.entity.route}/id/{identifier}"
/>

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
