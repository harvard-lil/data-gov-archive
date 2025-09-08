<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { entities } from "$lib/entities.js";

  // Redirect to page 1 when entity route is accessed
  $effect(() => {
    const entityRoute = $page.params.entity;
    const entity = entities.find((entity) => entity.route == entityRoute);

    if (entity) {
      goto(`/${entity.route}/page/1`, { replaceState: true });
    }
  });
</script>

<p>Redirecting...</p>
