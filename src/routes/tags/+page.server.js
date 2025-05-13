import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const tagsCount = (
    await queryData(`
      SELECT count(DISTINCT tag) AS count FROM tags
    `)
  )[0].count;

  const tags = (
    await queryData(`
      SELECT DISTINCT tag
      FROM tags
      ORDER BY tag
      LIMIT 500
  `)
  ).map((tag) => tag.tag);

  return {
    tags,
    totalItems: tagsCount,
  };
};
