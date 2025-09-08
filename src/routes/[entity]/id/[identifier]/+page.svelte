<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { entities } from "$lib/entities.js";

  // Redirect to page 1 when entity detail route is accessed
  $effect(() => {
    const entityRoute = $page.params.entity;
    const identifier = $page.params.identifier;
    const entity = entities.find((entity) => entity.route == entityRoute);

    if (entity) {
      goto(`/${entity.route}/id/${encodeURIComponent(identifier)}/page/1`, { replaceState: true });
    }
  });
</script>

<p>Redirecting...</p>
