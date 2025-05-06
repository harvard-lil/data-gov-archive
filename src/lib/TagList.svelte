<script>
  let { tags, showTagsLink = false } = $props();
</script>

<ul>
  {#each tags as tag}
    <li>
      <a href="/tags/id/{encodeURIComponent(tag)}" title={tag}>{tag}</a>
    </li>
  {/each}
  {#if showTagsLink === true}
    <li><a href="/tags">[all tags]</a></li>
  {/if}
</ul>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted;
      padding: 0.5em 0.75em;
      margin: 0 0.5em 0.25em 0;
      font-family: monospace;
      max-width: 20em;
      text-wrap-mode: nowrap;
      text-wrap-style: pretty;
      overflow: hidden;
      text-overflow: nowrap;
      text-overflow: ellipsis;
      a {
        color: inherit;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    }
  }
</style>
