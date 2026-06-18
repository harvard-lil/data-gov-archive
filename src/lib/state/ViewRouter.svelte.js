import { browser } from "$app/environment";
import { page } from "$app/state";

export function createViewRouter() {
  // Reactive query parameters
  const resource = $derived(browser ? page.url.searchParams.get("resource") : null);
  const pageNumber = $derived(browser ? parseInt(page.url.searchParams.get("page") || "1") : 1);
  const searchQuery = $derived(browser ? page.url.searchParams.get("q") : null);

  // Parse the resource parameter into an internal type + id
  const parsed = $derived.by(() => {
    if (!resource) {
      return { type: null, id: null };
    }

    const parts = resource.split("/");
    const resourceType = parts[0];
    const resourceId = parts.length > 1 ? parts.slice(1).join("/") : null;

    // Map resource paths to internal types
    const typeMap = {
      datasets: "dataset",
      organizations: "organization",
      bureaus: "bureau",
      publishers: "publisher",
      tags: "tag",
    };

    return { type: typeMap[resourceType] || null, id: resourceId };
  });

  // Determine the current view based on type and search
  const view = $derived.by(() => {
    const currentType = parsed.type;
    const currentId = parsed.id;

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

  // Build a base-relative URL with query parameters
  function buildUrl(params = {}) {
    const resourceMap = {
      dataset: "datasets",
      organization: "organizations",
      bureau: "bureaus",
      publisher: "publishers",
      tag: "tags",
    };

    const entries = [];

    // Handle resource parameter
    if (params.type && params.id) {
      entries.push(["resource", `${resourceMap[params.type]}/${params.id}`]);
    } else if (params.type && !params.id) {
      entries.push(["resource", resourceMap[params.type]]);
    }

    // Handle other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "type" && key !== "id" && value !== null && value !== undefined && value !== "") {
        entries.push([key, value.toString()]);
      }
    });

    const query = entries
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return query ? `/?${query}` : "/";
  }

  return {
    get resource() {
      return resource;
    },
    get pageNumber() {
      return pageNumber;
    },
    get searchQuery() {
      return searchQuery;
    },
    get type() {
      return parsed.type;
    },
    get id() {
      return parsed.id;
    },
    get view() {
      return view;
    },
    buildUrl,
  };
}
