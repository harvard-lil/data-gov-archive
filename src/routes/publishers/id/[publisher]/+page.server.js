import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const datasets = await queryData(`
    SELECT *
    FROM datasets
    WHERE publisher = '${params.publisher}'
    ORDER BY name
    LIMIT 200
  `);
  return {
    publisher: datasets[0].publisher,
    datasets,
  };
};
