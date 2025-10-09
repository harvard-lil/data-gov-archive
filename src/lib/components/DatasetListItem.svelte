<script>
  import sanitizeHtml from "sanitize-html";
  import { base } from "$app/paths";

  let { dataset, showOrganization = true } = $props();
</script>

<li class="py-6 last:border-b border-t border-dotted border-slate-800 wrap-break-word">
  <div class="mb-2">
    <a
      class="text-inherit text-lg font-bold no-underline hover:underline"
      href={`${base}/?resource=datasets/${encodeURIComponent(dataset.name)}`}>{dataset.title}</a
    >
  </div>
  {#if showOrganization === true}
    <div class="mb-4">
      <a
        class="text-inherit text-lg no-underline hover:underline"
        href={`${base}/?resource=organizations/${encodeURIComponent(dataset.organization_title)}`}
        >{dataset.organization_title}</a
      >
    </div>
  {/if}
  <p class="text-base italic hyphens-auto">
    {sanitizeHtml(dataset.notes, { allowedTags: [] })}
  </p>
</li>
