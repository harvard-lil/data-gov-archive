import { AGGREGATIONS_INIT_URL, DATASETS_INIT_URL, AGGREGATION_COUNT } from "$lib/config.js";

let aggregationsPromise = null;
let datasetsPromise = null;

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const topN = (rows, aggregation) =>
  rows
    .filter((row) => row.aggregation === aggregation)
    .sort((a, b) => b.count - a.count)
    .slice(0, AGGREGATION_COUNT);

export const loadInitAggregations = () => {
  if (!aggregationsPromise) {
    aggregationsPromise = fetchJson(AGGREGATIONS_INIT_URL)
      .then((rows) => ({
        organizations: topN(rows, "organizations"),
        publishers: topN(rows, "publishers"),
        bureaus: topN(rows, "bureaus"),
        datasetsCount: Number(rows.find((row) => row.aggregation === "datasets")?.count ?? 0),
      }))
      .catch((error) => {
        // Allow later retry; don't cache the failure
        aggregationsPromise = null;
        throw error;
      });
  }
  return aggregationsPromise;
};

// First 100 datasets
export const loadInitDatasets = () => {
  if (!datasetsPromise) {
    datasetsPromise = fetchJson(DATASETS_INIT_URL).catch((error) => {
      datasetsPromise = null;
      throw error;
    });
  }
  return datasetsPromise;
};
