import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const datasets = await queryData(`
    SELECT *
    FROM datasets
    WHERE bureau_code = '${params.bureau_code}'
    ORDER BY name
    LIMIT 200
  `);
  return {
    bureau_code: datasets[0].bureau_code,
    bureau_name: datasets[0].bureau_name,
    datasets,
  };
};
