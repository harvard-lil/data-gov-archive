<script>
  let {
    resource,
    searchQuery,
    buildUrl,
    pageNumber = 1,
    totalItems = null,
    isLoading = false,
  } = $props();

  // Parse the resource to determine breadcrumb structure
  let breadcrumbs = $derived(() => {
    const crumbs = [];

    // Handle search view
    if (searchQuery) {
      crumbs.push({
        label: "Home",
        url: buildUrl({}),
      });
      crumbs.push({
        label: searchQuery,
        url: pageNumber > 1 ? buildUrl({ q: searchQuery, page: 1 }) : null,
        isSearchQuery: true,
        resultCount: totalItems,
      });
      return crumbs;
    }

    // Parse resource for other views
    if (!resource) {
      // Home page - show just "Home"
      crumbs.push({
        label: "Home",
        url: null,
      });
      return crumbs;
    }

    const parts = resource.split("/");
    const resourceType = parts[0];
    const resourceId = parts.length > 1 ? parts.slice(1).join("/") : null;

    // Map resource types to display labels
    const labelMap = {
      datasets: "Datasets",
      organizations: "Organizations",
      bureaus: "Bureaus",
      publishers: "Publishers",
      tags: "Tags",
    };

    // Map resource types to internal types for buildUrl
    const typeMap = {
      datasets: "dataset",
      organizations: "organization",
      bureaus: "bureau",
      publishers: "publisher",
      tags: "tag",
    };

    const displayLabel = labelMap[resourceType];
    const internalType = typeMap[resourceType];

    if (displayLabel && internalType) {
      // Add "Home" link
      crumbs.push({
        label: "Home",
        url: buildUrl({}),
      });

      // Add the resource type (e.g., "Organizations")
      // Only link if it's not a tag (tags don't have a list view)
      if (resourceType === "tags") {
        crumbs.push({
          label: displayLabel,
          url: null, // Tags don't have a list view
        });
      } else {
        crumbs.push({
          label: displayLabel,
          url: resourceId
            ? buildUrl({ type: internalType })
            : pageNumber > 1
              ? buildUrl({ type: internalType, page: 1 })
              : null,
        });
      }

      // Add the specific resource (e.g., "State of California")
      if (resourceId) {
        const isTag = resourceType === "tags";
        crumbs.push({
          label: resourceId,
          url: pageNumber > 1 ? buildUrl({ type: internalType, id: resourceId, page: 1 }) : null,
          isTag: isTag,
          // Tags should be monospace even when they are links
          tagLink: isTag && pageNumber > 1,
        });
      }
    }

    return crumbs;
  });
</script>

<nav aria-label="Breadcrumb" class="mb-4 text-sm flex min-w-0 w-full">
  <ol class="list-none p-0 m-0 flex min-w-0 flex-nowrap w-full">
    {#each breadcrumbs() as crumb, index}
      <li class="flex shrink-0 min-w-0" class:flex-1={index === breadcrumbs().length - 1}>
        {#if crumb.tagLink}
          <a
            href={crumb.url}
            class="text-inherit no-underline hover:underline font-mono min-w-0"
            class:block={index === breadcrumbs().length - 1}
            class:overflow-hidden={index === breadcrumbs().length - 1}
            class:text-ellipsis={index === breadcrumbs().length - 1}
            class:whitespace-nowrap={index === breadcrumbs().length - 1}
            class:w-full={index === breadcrumbs().length - 1}
            title={index === breadcrumbs().length - 1 ? crumb.label : undefined}>{crumb.label}</a
          >
        {:else if crumb.isTag}
          <span
            class="font-mono min-w-0"
            class:block={index === breadcrumbs().length - 1}
            class:overflow-hidden={index === breadcrumbs().length - 1}
            class:text-ellipsis={index === breadcrumbs().length - 1}
            class:whitespace-nowrap={index === breadcrumbs().length - 1}
            class:w-full={index === breadcrumbs().length - 1}
            title={index === breadcrumbs().length - 1 ? crumb.label : undefined}>{crumb.label}</span
          >
        {:else if crumb.isSearchQuery && crumb.url}
          <span
            class="min-w-0"
            class:block={index === breadcrumbs().length - 1}
            class:overflow-hidden={index === breadcrumbs().length - 1}
            class:w-full={index === breadcrumbs().length - 1}
            title={index === breadcrumbs().length - 1 ? `Search: ${crumb.label}` : undefined}
          >
            Search:
            <a href={crumb.url} class="italic text-inherit no-underline hover:underline"
              >{crumb.label}</a
            >
            {#if crumb.resultCount !== null && !isLoading}
              ({crumb.resultCount.toLocaleString("en-US")} result{crumb.resultCount === 1
                ? ""
                : "s"})
            {/if}
          </span>
        {:else if crumb.isSearchQuery}
          <span
            class="min-w-0"
            class:block={index === breadcrumbs().length - 1}
            class:overflow-hidden={index === breadcrumbs().length - 1}
            class:text-ellipsis={index === breadcrumbs().length - 1}
            class:whitespace-nowrap={index === breadcrumbs().length - 1}
            class:w-full={index === breadcrumbs().length - 1}
            title={index === breadcrumbs().length - 1 ? `Search: ${crumb.label}` : undefined}
          >
            Search: <span class="italic">{crumb.label}</span>
            {#if crumb.resultCount !== null && !isLoading}
              ({crumb.resultCount.toLocaleString("en-US")} result{crumb.resultCount === 1
                ? ""
                : "s"})
            {/if}
          </span>
        {:else if crumb.url}
          <a
            href={crumb.url}
            class="text-inherit no-underline hover:underline min-w-0"
            class:block={index === breadcrumbs().length - 1}
            class:overflow-hidden={index === breadcrumbs().length - 1}
            class:text-ellipsis={index === breadcrumbs().length - 1}
            class:whitespace-nowrap={index === breadcrumbs().length - 1}
            class:w-full={index === breadcrumbs().length - 1}
            title={index === breadcrumbs().length - 1 ? crumb.label : undefined}>{crumb.label}</a
          >
        {:else}
          <span
            class="min-w-0"
            class:block={index === breadcrumbs().length - 1}
            class:overflow-hidden={index === breadcrumbs().length - 1}
            class:text-ellipsis={index === breadcrumbs().length - 1}
            class:whitespace-nowrap={index === breadcrumbs().length - 1}
            class:w-full={index === breadcrumbs().length - 1}
            title={index === breadcrumbs().length - 1 ? crumb.label : undefined}>{crumb.label}</span
          >
        {/if}
      </li>
      {#if index < breadcrumbs().length - 1}
        <li class="flex select-none mx-2 shrink-0" aria-hidden="true">/</li>
      {/if}
    {/each}
  </ol>
</nav>
