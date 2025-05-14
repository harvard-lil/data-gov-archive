import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";

export const load = ({ params }) => {
  const pageNumber = parseInt(params.page);

  const tagsCount = queryData(`
      SELECT count(DISTINCT tag) AS count FROM tags
    `)[0].count;
  const totalPages = Math.ceil(tagsCount / 500);
  const offset = (pageNumber - 1) * 500;

  if (pageNumber <= 0 || pageNumber > totalPages) {
    error(404, {
      message: "No tags found for this page",
    });
  }

  const tags = queryData(
    `
      SELECT DISTINCT tag
      FROM tags
      ORDER BY tag
      LIMIT 500
      OFFSET ${offset}
    `
  ).map((tag) => tag.tag);

  return {
    tags,
    totalItems: tagsCount,
    pageNumber,
  };
};
