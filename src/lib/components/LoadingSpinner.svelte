<script>
  import { onMount } from "svelte";

  // Start with reduced motion to avoid flash during SSR/hydration
  let prefersReducedMotion = true;
  let mounted = false;

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
</script>

{#if prefersReducedMotion}
  <div class="loading-text">Loading…</div>
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
      fill="#222"
      d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
      class="spinner_6kVp"
    /></svg
  >
{/if}

<style>
  .loading-text {
    color: #222;
    font-size: 1.2em;
    font-weight: 300;
  }

  :global(.loading-container) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em;
  }
</style>
