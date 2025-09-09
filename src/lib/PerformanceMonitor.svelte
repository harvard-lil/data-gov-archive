<script>
  import { getPerformanceStats, resetPerformanceStats } from "$lib/db.js";
  import { onMount } from "svelte";

  let stats = { queryCount: 0, totalQueryTime: 0, averageQueryTime: 0, isConnected: false };
  let isVisible = false;

  onMount(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      isVisible = true;
      updateStats();

      // Update stats every 2 seconds
      const interval = setInterval(updateStats, 2000);

      return () => clearInterval(interval);
    }
  });

  function updateStats() {
    stats = getPerformanceStats();
  }

  function resetStats() {
    resetPerformanceStats();
    updateStats();
  }
</script>

{#if isVisible}
  <div class="performance-monitor">
    <div class="header">
      <h4>Database Performance</h4>
      <button on:click={resetStats} class="reset-btn">Reset</button>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="label">Queries:</span>
        <span class="value">{stats.queryCount}</span>
      </div>

      <div class="stat">
        <span class="label">Avg Time:</span>
        <span class="value">{stats.averageQueryTime.toFixed(1)}ms</span>
      </div>

      <div class="stat">
        <span class="label">Total Time:</span>
        <span class="value">{stats.totalQueryTime.toFixed(0)}ms</span>
      </div>

      <div class="stat">
        <span class="label">Status:</span>
        <span class="value {stats.isConnected ? 'connected' : 'disconnected'}">
          {stats.isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  </div>
{/if}

<style>
  .performance-monitor {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 1000;
    min-width: 200px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .header h4 {
    margin: 0;
    font-size: 14px;
  }

  .reset-btn {
    background: #333;
    color: white;
    border: 1px solid #555;
    padding: 2px 6px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 10px;
  }

  .reset-btn:hover {
    background: #555;
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }

  .stat {
    display: flex;
    justify-content: space-between;
  }

  .label {
    color: #ccc;
  }

  .value {
    font-weight: bold;
  }

  .value.connected {
    color: #4caf50;
  }

  .value.disconnected {
    color: #f44336;
  }
</style>
