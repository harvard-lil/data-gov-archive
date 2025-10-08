<script>
  import { onMount, onDestroy } from "svelte";

  // Start with reduced motion to avoid flash during SSR/hydration
  let prefersReducedMotion = true;
  let mounted = false;
  let containerElement;
  let focusTrap = null;

  // Focus trap functionality
  function createFocusTrap(container, fallbackElement) {
    if (!container) {
      console.warn("Focus trap: container element is required");
      return null;
    }

    if (focusTrap) {
      focusTrap.destroy();
    }

    const trap = {
      container,
      fallbackElement: fallbackElement || container,
      previouslyFocusedElement: document.activeElement,

      handleKeyDown: (event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          event.stopPropagation();
          // Keep focus on the fallback element
          trap.fallbackElement?.focus();
        }
      },

      handleFocusIn: (event) => {
        // If focus moves outside the container, bring it back
        if (!container.contains(event.target)) {
          event.preventDefault();
          event.stopPropagation();
          trap.fallbackElement?.focus();
        }
      },

      destroy: () => {
        container.removeEventListener("keydown", trap.handleKeyDown, true);
        container.removeEventListener("focusin", trap.handleFocusIn, true);
        // Restore focus to the previously focused element if it's still in the DOM
        if (
          trap.previouslyFocusedElement &&
          trap.previouslyFocusedElement.focus &&
          document.contains(trap.previouslyFocusedElement)
        ) {
          try {
            trap.previouslyFocusedElement.focus();
          } catch (e) {
            // Element might not be focusable, ignore the error
            console.warn("Could not restore focus to previous element:", e);
          }
        }
      },
    };

    // Add event listeners with capture to ensure they run first
    container.addEventListener("keydown", trap.handleKeyDown, true);
    container.addEventListener("focusin", trap.handleFocusIn, true);

    // Focus the fallback element
    try {
      trap.fallbackElement?.focus();
    } catch (e) {
      console.warn("Could not focus fallback element:", e);
    }

    return trap;
  }

  onMount(() => {
    mounted = true;
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion = mediaQuery.matches;

    // Listen for changes to the preference
    const handleChange = (e) => {
      prefersReducedMotion = e.matches;
    };

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on component destroy
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });

  // Create focus trap when container element becomes available
  $: if (containerElement && mounted) {
    if (focusTrap) {
      focusTrap.destroy();
    }
    focusTrap = createFocusTrap(containerElement, containerElement);
  }

  onDestroy(() => {
    // Clean up focus trap when component is destroyed
    if (focusTrap) {
      focusTrap.destroy();
      focusTrap = null;
    }
  });
</script>

<div
  bind:this={containerElement}
  class="fixed top-0 left-0 w-[100vw] h-[100vh] bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-2xs flex justify-center items-center z-50"
  tabindex="-1"
  role="dialog"
  aria-modal="true"
  aria-label="Loading content"
>
  {#if prefersReducedMotion}
    <div class="font-extralight text-4xl">Loading…</div>
  {:else}
    <svg width="72" height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      ><style>
        .spinner_6kVp {
          transform-origin: center;
          animation: spinner_irSm 0.75s infinite linear;
        }
        @keyframes spinner_irSm {
          100% {
            transform: rotate(360deg);
          }
        }
      </style><path
        fill="currentColor"
        d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
        class="spinner_6kVp"
      /></svg
    >
  {/if}
</div>
