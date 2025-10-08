<script>
  let { dataset } = $props();
</script>

{#snippet link(icon, href, label)}
  <li>
    <a
      class="flex items-center justify-center gap-2 w-full text-inherit text-base no-underline border border-slate-800 rounded-md py-3 px-4 mb-1.5"
      {href}
      target="_blank"
    >
      <span class="font-material-icons select-none relative">{icon}</span>
      <span>{label}</span>
    </a>
  </li>
{/snippet}

<ul class="my-4">
  {@render link(
    "\ueb2c",
    `https://source.coop/harvard-lil/gov-data/collections/data_gov/${dataset.name}`,
    "Dataset & Metadata (ZIP)"
  )}
  {@render link(
    "\uead3",
    `https://source.coop/harvard-lil/gov-data/metadata/data_gov/${dataset.name}`,
    "Metadata Only (JSON)"
  )}
  {@render link("\uf8ef", `https://catalog.data.gov/dataset/${dataset.name}`, "Data.gov Source")}
</ul>
