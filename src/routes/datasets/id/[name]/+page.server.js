import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const datasets = await queryData(`
    SELECT *
    FROM datasets
    WHERE name = '${params.name}'
    LIMIT 1
  `);
  return { dataset: datasets[0] };
};
