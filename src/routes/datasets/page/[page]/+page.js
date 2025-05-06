import { error } from "@sveltejs/kit";

import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const pageSize = 200;
  const totalPages = Math.ceil(sample.length / pageSize);

  // Use 0-indexed page number for slicing
  const pageNumber = parseInt(params.page) - 1;
  const sliceStart = pageNumber * pageSize;
  const datasets = sample.slice(sliceStart, sliceStart + pageSize);

  if (pageNumber < 0 || pageNumber >= totalPages) {
    error(404, {
      message: "No datasets found for this page",
    });
  }

  return {
    page: pageNumber + 1,
    totalPages,
    datasets,
  };
};
