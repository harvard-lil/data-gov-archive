import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const pageNumber = parseInt(params.page);

  const datasetsCount = (
    await queryData(`
      SELECT count(*) AS count
      FROM datasets
      WHERE organization_name = '${params.organization_name}'
    `)
  )[0].count;
  const totalPages = Math.ceil(datasetsCount / 200);
  const offset = (pageNumber - 1) * 200;

  if (pageNumber <= 0 || pageNumber > totalPages) {
    error(404, {
      message: "No datasets found for this page",
    });
  }

  const datasets = await queryData(`
    SELECT *
    FROM datasets
    WHERE organization_name = '${params.organization_name}'
    ORDER BY name
    LIMIT 200
    OFFSET ${offset}
  `);

  return {
    organization_name: datasets[0].organization_name,
    organization_title: datasets[0].organization_title,
    datasets: datasets,
    totalItems: datasetsCount,
    pageNumber,
  };
};
