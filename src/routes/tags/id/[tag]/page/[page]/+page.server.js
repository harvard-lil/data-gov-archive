import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const pageNumber = parseInt(params.page);

  const datasetsCount = (
    await queryData(`
      SELECT count(*) AS count
      FROM datasets
      INNER JOIN tags ON datasets.name = tags.name
      WHERE tags.tag = '${params.tag}'
    `)
  )[0].count;
  const totalPages = Math.ceil(datasetsCount / 200);
  const offset = (pageNumber - 1) * 200;

  if (pageNumber <= 0 || pageNumber > totalPages) {
    error(404, {
      message: "No tags found for this page",
    });
  }

  const datasets = await queryData(`
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
    OFFSET ${offset}
  `);

  return {
    tag: params.tag,
    datasets,
    totalItems: datasetsCount,
    pageNumber,
  };
};
