<script>
  let { dataset } = $props();
</script>

{#snippet link(icon, href, label)}
  <li>
    <a
      class="block w-full text-inherit text-base no-underline border border-slate-800 rounded-md py-3 px-4 before:content-['{icon}'] before:font-material-icons before:relative before:top-0.5 before:right-1.5 before:mr-0.5 mb-1.5 text-center"
      {href}
      target="_blank"
    >
      {label}
    </a>
  </li>
{/snippet}

<ul class="my-4">
  {@render link(
    "\\eb2c",
    `https://source.coop/harvard-lil/gov-data/collections/data_gov/${dataset.name}`,
    "Dataset & Metadata (ZIP)"
  )}
  {@render link(
    "\\ead3",
    `https://source.coop/harvard-lil/gov-data/metadata/data_gov/${dataset.name}`,
    "Metadata Only (JSON)"
  )}
  {@render link("\\f8ef", `https://catalog.data.gov/dataset/${dataset.name}`, "Data.gov Source")}
</ul>
