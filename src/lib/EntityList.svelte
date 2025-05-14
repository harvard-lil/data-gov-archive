<script>
  import Timestamp from "./Timestamp.svelte";

  let { entity, instances } = $props();
</script>

<ul>
  {#each instances as instance}
    <li>
      <h2>
        <a href="/{entity.route}/id/{encodeURIComponent(instance[entity.identifier])}">
          {instance[entity.label] ? instance[entity.label] : instance[entity.identifier]}
        </a>
      </h2>
      <p>
        {instance.count.toLocaleString("en-US")} dataset{#if instance.count != 1}s{/if}, last
        updated <Timestamp timestamp={instance.last_updated} />
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
      border-top: 1px dotted #222;

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
    li:last-of-type {
      border-bottom: 1px dotted #222;
      padding-bottom: 0.5em;
    }
  }
</style>
