<script>
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { error } from "@sveltejs/kit";

  // Reactive query parameters - only available in browser
  let resource = $state(null);
  let pageNumber = $state(1);
  let searchQuery = $state(null);

  $effect(() => {
    if (browser) {
      resource = $page.url.searchParams.get("resource");
      pageNumber = parseInt($page.url.searchParams.get("page") || "1");
      searchQuery = $page.url.searchParams.get("q");
    }
  });

  // Parse resource parameter to extract type and id
  let type = $state(null);
  let id = $state(null);

  $effect(() => {
    if (!resource) {
      type = null;
      id = null;
      return;
    }

    const parts = resource.split("/");
    if (parts.length < 1) {
      type = null;
      id = null;
      return;
    }

    const resourceType = parts[0];
    const resourceId = parts.length > 1 ? parts.slice(1).join("/") : null;

    // Map resource paths to internal types
    const typeMap = {
      datasets: "dataset",
      organizations: "organization",
      bureau: "bureau",
      publishers: "publisher",
      tags: "tag",
    };

    type = typeMap[resourceType] || null;
    id = resourceId;
  });

  // Handle 404 for tag list (not supported)
  $effect(() => {
    if (type === "tag" && !id) {
      error(404, "Tag list not available");
    }
  });

  // Determine view based on type and search
  const view = $derived(() => {
    const currentType = type;
    const currentId = id;

    // If there's a search query, show search results
    if (searchQuery) {
      return "search";
    }

    if (!currentType) {
      return "home";
    }
    if (currentType === "dataset" && !currentId) return "datasets-list";
    if (currentType === "dataset" && currentId) return "dataset-detail";
    if (["organization", "bureau", "publisher"].includes(currentType) && !currentId)
      return "entity-list";
    if (["organization", "bureau", "publisher"].includes(currentType) && currentId)
      return "entity-detail";
    if (currentType === "tag" && currentId) return "entity-detail";
    return "home";
  });

  // Debug: Log the current state
  $effect(() => {
    if (browser) {
      console.log("Debug state:", { resource, type, id, view: view() });
    }
  });

  // Helper function to build URLs
  function buildUrl(params = {}) {
    if (!browser) return "#";
    const url = new URL($page.url);
    url.search = "";

    // Handle resource parameter
    if (params.type && params.id) {
      const resourceMap = {
        dataset: "datasets",
        organization: "organizations",
        bureau: "bureaus",
        publisher: "publishers",
        tag: "tags",
      };
      const resourcePath = `${resourceMap[params.type]}/${params.id}`;
      url.searchParams.set("resource", resourcePath);
    } else if (params.type && !params.id) {
      const resourceMap = {
        dataset: "datasets",
        organization: "organizations",
        bureau: "bureaus",
        publisher: "publishers",
        tag: "tags",
      };
      url.searchParams.set("resource", resourceMap[params.type]);
    }

    // Handle other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "type" && key !== "id" && value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, value.toString());
      }
    });
    return url.toString();
  }

  // Dynamic title
  let pageTitle = $state("Data.gov Archive");

  // Export reactive values for child components
  export { resource, pageNumber, searchQuery, type, id, view, buildUrl, pageTitle };
</script>

<!-- This component doesn't render anything, it just manages state -->
