<script>
  import sanitizeHtml from "sanitize-html";
  import { base } from "$app/paths";

  let { dataset, showOrganization = true } = $props();

  let notes = sanitizeHtml(dataset.notes, { allowedTags: [] });
</script>

<li class="py-6 last:border-b border-t border-dotted border-slate-800 wrap-break-word">
  <div class="mb-2">
    <a
      class="text-inherit text-lg font-bold no-underline hover:underline"
      href={`${base}/?resource=datasets/${encodeURIComponent(dataset.name)}`}>{dataset.title}</a
    >
  </div>
  {#if showOrganization === true}
    <div class:mb-4={notes.trim() ? true : false}>
      <a
        class="text-inherit text-lg no-underline hover:underline"
        href={`${base}/?resource=organizations/${encodeURIComponent(dataset.organization_title)}`}
        >{dataset.organization_title}</a
      >
    </div>
  {/if}
  <p class="text-base italic hyphens-auto">
    {notes}
  </p>
</li>
