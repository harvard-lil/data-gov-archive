<script>
  import DatasetList from "$lib/components/DatasetList.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  export let data;
  export let resource;
  export let buildUrl;
</script>

{#if data.isLoading}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
{:else if data.entity && data.identifier}
  <h2>
    <b>{data.entity.title}:</b>
    {#if data.entity.type === "tag"}
      <span class="tag">
        {#if data.pageNumber > 1}
          <a href={buildUrl({ type: data.entity.type, id: data.identifier, page: 1 })}
            >{data.label}</a
          >
        {:else}
          {data.label}
        {/if}
      </span>
    {:else if data.pageNumber > 1}
      <a href={buildUrl({ type: data.entity.type, id: data.identifier, page: 1 })}>{data.label}</a>
    {:else}
      {data.label}
    {/if}
  </h2>

  {#if data.totalItems > 0}
    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />

    <DatasetList datasets={data.datasets} showOrganization={data.entity?.showOrganization} />

    <PageNav pageNumber={data.pageNumber} totalItems={data.totalItems} {resource} />
  {:else}
    <p>No datasets found.</p>
  {/if}
{:else}
  <div class="loading-container">
    <LoadingSpinner />
  </div>
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
