<script>
  import { base } from "$app/paths";
  let { tags } = $props();
</script>

<ul>
  {#each tags as tag}
    <a href={`${base}/tags/${encodeURIComponent(tag)}`} title={tag}
      ><li>
        {tag}
      </li></a
    >
  {/each}
</ul>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      li {
        text-decoration: underline;
      }
    }

    li {
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted #222;
      padding: 0.5em 0.75em;
      margin: 0 0.5em 0.25em 0;
      font-family: monospace;
      max-width: 20em;
      text-wrap-mode: nowrap;
      text-wrap-style: pretty;
      overflow: hidden;
      text-overflow: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
