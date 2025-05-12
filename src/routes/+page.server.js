import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const datasetsCount = (await queryData("SELECT count(*) AS count FROM datasets"))[0].count;
  const datasets = await queryData(`
    SELECT
      name,
      title,
      organization_name,
      organization_title,
      substr(notes, 1, 320) AS notes
    FROM datasets
    ORDER BY name
    LIMIT 200
  `);
  return {
    datasets,
    totalItems: datasetsCount,
  };
};
