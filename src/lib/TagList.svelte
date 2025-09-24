<script>
  import { base } from "$app/paths";
  let { tags } = $props();
</script>

<ul>
  {#each tags as tag}
    <li>
      <a href={`${base}/?type=tag&id=${encodeURIComponent(tag)}`} title={tag}>
        {tag}
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      display: inline-block;
      margin: 0 0.5em 0.25em 0;
    }

    a {
      color: inherit;
      text-decoration: none;
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted #222;
      padding: 0.5em 0.75em;
      font-family: monospace;
      max-width: 20em;
      text-wrap-mode: nowrap;
      text-wrap-style: pretty;
      overflow: hidden;
      text-overflow: nowrap;
      text-overflow: ellipsis;
    }

    a:hover {
      text-decoration: underline;
    }
  }
</style>
