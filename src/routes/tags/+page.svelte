<script>
  let { data } = $props();
</script>

<h2>Tags</h2>

<ul>
  {#each data.tags as tag}
    <li>
      <a href="/tags/{encodeURIComponent(tag)}">{tag}</a>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      font-size: large;
      display: inline-block;
      border-radius: 0.25em;
      border: 1px dotted;
      padding: 0.5em 0.75em;
      margin: 0 0.25em 0.25em 0;
      font-family: monospace;

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
