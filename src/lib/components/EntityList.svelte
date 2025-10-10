<script>
  import { base } from "$app/paths";

  let { entity, instances } = $props();
</script>

<ul>
  {#each instances as instance}
    <li class="py-6 last:border-b border-t border-dotted border-slate-800 wrap-break-word">
      <div class="mb-2">
        <a
          class="text-inherit text-xl font-bold no-underline hover:underline"
          href={`${base}/?resource=${entity.route}/${encodeURIComponent(instance.identifier)}`}
        >
          {instance.identifier}
        </a>
      </div>
      <p class="text-base italic">
        {Number(instance.count[0]).toLocaleString("en-US")} dataset{#if Number(instance.count[0]) != 1}s{/if}
      </p>
    </li>
  {/each}
</ul>
