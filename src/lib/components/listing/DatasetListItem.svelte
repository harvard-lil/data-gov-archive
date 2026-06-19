<script>
  import sanitizeHtml from "sanitize-html";
  import { resolve } from "$app/paths";
  import Skeleton from "$lib/components/ui/Skeleton.svelte";

  let { dataset = null, showOrganization = true, loading = false } = $props();

  let notes = $derived(loading ? "" : sanitizeHtml(dataset.notes, { allowedTags: [] }));
</script>

<li class="py-6 last:border-b border-t border-dotted border-gray-800 dark:border-gray-200 wrap-break-word">
  {#if loading}
    <div class="mb-2"><Skeleton class="h-6 w-3/4" /></div>
    {#if showOrganization === true}
      <div class="mb-4"><Skeleton class="h-5 w-1/2" /></div>
    {/if}
    <Skeleton class="h-4 w-full mb-2" />
    <Skeleton class="h-4 w-5/6" />
  {:else}
    <div class="mb-2">
      <a
        class="text-inherit text-xl font-bold no-underline hover:underline"
        href={resolve(`/?resource=datasets/${encodeURIComponent(dataset.name)}`)}>{dataset.title}</a
      >
    </div>
    {#if showOrganization === true}
      <div class:mb-4={notes.trim() ? true : false}>
        <a
          class="text-inherit text-lg no-underline hover:underline"
          href={resolve(
            `/?resource=organizations/${encodeURIComponent(dataset.organization_title)}`
          )}>{dataset.organization_title}</a
        >
      </div>
    {/if}
    <p class="text-base italic hyphens-auto">
      {notes}
    </p>
  {/if}
</li>
