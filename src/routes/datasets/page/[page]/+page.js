import { error } from "@sveltejs/kit";

import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const pageNumber = parseInt(params.page);
  const pageSize = 200;
  const totalPages = Math.ceil(sample.length / pageSize);

  if (pageNumber <= 0 || pageNumber > totalPages) {
    error(404, {
      message: "No datasets found for this page",
    });
  }

  return {
    pageNumber: parseInt(params.page),
    datasets: sample,
  };
};
