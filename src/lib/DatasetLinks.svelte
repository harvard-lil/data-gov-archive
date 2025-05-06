<script>
  let { dataset } = $props();
</script>

<nav>
  <ul>
    <li id="collection-archive">
      <a
        href="https://source.coop/harvard-lil/gov-data/collections/data_gov/{dataset.name}"
        target="_blank"
      >
        Collection Archive
      </a>
    </li>
    <li id="metadata-archive">
      <a
        href="https://source.coop/harvard-lil/gov-data/metadata/data_gov/{dataset.name}"
        target="_blank"
      >
        Metadata Archive
      </a>
    </li>
    <li id="data-gov-source">
      <a href="https://catalog.data.gov/dataset/{dataset.name}" target="_blank">
        Data.gov Source
      </a>
    </li>
  </ul>
</nav>

<style lang="scss">
  ul {
    padding: 0;
    list-style: none;
    list-style-position: unset;

    li {
      display: inline-block;
      margin: 0.125em;
      padding: 0.75em 1em;
      background-color: #ccc;
      color: #333;
      border-radius: 0.25em;
      border: 1px dotted;

      a {
        color: inherit;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    }

    li:before {
      position: relative;
      top: 0.15em;
      right: 0.25em;
      font-family: "Material Icons";
      margin-right: 0.2em;
    }
    li:nth-child(1):before {
      content: "\eb2c";
    }
    li:nth-child(2):before {
      content: "\ead3";
    }
    li:nth-child(3):before {
      content: "\f8ef";
    }
  }
</style>
