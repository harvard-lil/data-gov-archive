import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";

export const load = ({ params }) => {
  const pageNumber = parseInt(params.page);

  const datasetsCount = queryData("SELECT count(*) AS count FROM datasets")[0].count;
  const totalPages = Math.ceil(datasetsCount / 200);
  const offset = (pageNumber - 1) * 200;

  if (pageNumber <= 0 || pageNumber > totalPages) {
    error(404, {
      message: "No datasets found for this page",
    });
  }

  const datasets = queryData(
    `
      SELECT *
      FROM datasets
      ORDER BY name
      LIMIT 200
      OFFSET ${offset}
    `
  );

  return {
    pageNumber,
    totalItems: datasetsCount,
    datasets: datasets,
  };
};
