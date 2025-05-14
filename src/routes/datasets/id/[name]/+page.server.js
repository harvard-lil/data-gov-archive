import { queryData } from "$lib/db.js";

export const load = ({ params }) => {
  const sqlParams = { $name: params.name };

  const datasets = queryData(
    `
      SELECT *
      FROM datasets
      WHERE name = $name
      LIMIT 1
    `,
    sqlParams
  );

  const tags = queryData(
    `
      SELECT tag
      FROM tags
      WHERE name = $name
      ORDER BY tag
    `,
    sqlParams
  ).map((tag) => tag.tag);

  return {
    dataset: datasets[0],
    tags,
  };
};
