import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const datasets = await queryData(`
    SELECT
      datasets.name,
      title,
      notes,
      organization_name,
      organization_title
    FROM datasets
    LEFT JOIN tags ON datasets.name = tags.name
    LIMIT 200
  `);

  return {
    tag: params.tag,
    datasets,
  };
};
