import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const datasets = await queryData(`
    SELECT *
    FROM datasets
    WHERE name = '${params.name}'
    LIMIT 1
  `);

  const tags = (
    await queryData(`
    SELECT tag
    FROM tags
    WHERE name = '${params.name}'
    ORDER BY tag
  `)
  ).map((tag) => tag.tag);

  return {
    dataset: datasets[0],
    tags,
  };
};
