import { queryData } from "$lib/db.js";

export const load = ({ params }) => {
  const datasetsCount = queryData(`
      SELECT count(*) AS count
      FROM datasets
      INNER JOIN tags ON datasets.name = tags.name
      WHERE tags.tag = '${params.tag}'
    `)[0].count;

  const datasets = queryData(`
    SELECT
      datasets.name,
      title,
      notes,
      organization_name,
      organization_title
    FROM datasets
    INNER JOIN tags ON datasets.name = tags.name
    WHERE tags.tag = '${params.tag}'
    ORDER BY datasets.name
    LIMIT 200
  `);

  return {
    tag: params.tag,
    datasets,
    totalItems: datasetsCount,
  };
};
