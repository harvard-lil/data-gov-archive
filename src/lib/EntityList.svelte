<script>
  import { base } from "$app/paths";
  import Timestamp from "./Timestamp.svelte";

  let { entity, instances } = $props();
</script>

<ul>
  {#each instances as instance}
    <li>
      <h2>
        <a href={`${base}/?type=${entity.type}&id=${encodeURIComponent(instance.identifier)}`}>
          {instance.label ? instance.label : instance.identifier}
        </a>
      </h2>
      <p>
        {Number(instance.count[0]).toLocaleString("en-US")} dataset{#if Number(instance.count[0]) != 1}s{/if},
        last updated <Timestamp timestamp={instance.last_updated} />
      </p>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      margin: 1em 0;

      h2 {
        font-weight: 700;
      }

      p {
        font-style: italic;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    }
    li:not(:first-child) {
      border-top: 1px dotted #222;
    }
  }
</style>
