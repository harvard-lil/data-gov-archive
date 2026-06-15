<script>
  import { resolve } from "$app/paths";
  import TagList from "./TagList.svelte";
  // import Timestamp from "./Timestamp.svelte";

  let { dataset } = $props();
</script>

<dl>
  <!-- <dt>Metadata Modified:</dt>
  <dd><Timestamp timestamp={dataset.metadata_modified} /></dd> -->
  {#if dataset.publisher}
    <div class="block mb-0.5">
      <dt class="font-bold inline">Publisher:</dt>
      <dd class="inline">
        <a
          class="text-inherit no-underline hover:underline"
          href={resolve(`/?resource=publishers/${encodeURIComponent(dataset.publisher)}`)}
          >{dataset.publisher}</a
        >
      </dd>
    </div>
  {/if}
  {#if dataset.bureau_name}
    <div class="block mb-0.5">
      <dt class="font-bold inline">Bureau:</dt>
      <dd class="inline">
        <a
          class="text-inherit no-underline hover:underline"
          href={resolve(`/?resource=bureaus/${encodeURIComponent(dataset.bureau_name)}`)}
          >{dataset.bureau_name}</a
        >
      </dd>
    </div>
  {/if}
  {#if dataset.tags && dataset.tags.length > 0}
    <dt class="font-bold block mb-1">Tags:</dt>
    <dd class="block"><TagList tags={dataset.tags} /></dd>
  {/if}
</dl>
