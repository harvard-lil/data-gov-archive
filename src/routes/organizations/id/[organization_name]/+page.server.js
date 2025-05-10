import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const datasets = await queryData(`
    SELECT *
    FROM datasets
    WHERE organization_name = '${params.organization_name}'
    ORDER BY name
    LIMIT 200
  `);
  return {
    organization_name: datasets[0].organization_name,
    organization_title: datasets[0].organization_title,
    datasets,
  };
};
