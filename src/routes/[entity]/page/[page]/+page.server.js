import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";
import { entities } from "$lib/entities.js";

export const load = async ({ params }) => {
  const entity = entities.find((entity) => entity.route == params.entity);
  if (!entity) error(404);

  const page = parseInt(params.page);
  const offset = Math.ceil((page - 1) * 200);

  const instances = await queryData(`
    SELECT
      ${entity.identifier},
      ${entity.label},
      count(*) AS count,
      max(metadata_modified) AS last_modified
    FROM datasets
    WHERE ${entity.identifier} IS NOT NULL
    GROUP BY ${entity.identifier}
    ORDER BY ${entity.identifier}
    LIMIT 200
    OFFSET ${offset}
  `);

  return {
    entity,
    page,
    instances,
  };
};
