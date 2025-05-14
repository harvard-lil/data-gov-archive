import { queryData } from "$lib/db.js";

export const load = ({ params }) => {
  const sqlParams = { $tag: params.tag };

  const datasetsCount = queryData(
    `
      SELECT count(*) AS count
      FROM datasets
      INNER JOIN tags ON datasets.name = tags.name
      WHERE tags.tag = $tag
    `,
    sqlParams
  )[0].count;

  const datasets = queryData(
    `
      SELECT
        datasets.name,
        title,
        notes,
        organization_name,
        organization_title
      FROM datasets
      INNER JOIN tags ON datasets.name = tags.name
      WHERE tags.tag = $tag
      ORDER BY datasets.name
      LIMIT 200
    `,
    sqlParams
  );

  return {
    tag: params.tag,
    datasets,
    totalItems: datasetsCount,
  };
};
