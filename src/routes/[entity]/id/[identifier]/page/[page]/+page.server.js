import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";
import { entities } from "$lib/entities.js";

export const load = ({ params }) => {
  const entity = entities.find((entity) => entity.route == params.entity);
  if (!entity) error(404);

  const page = parseInt(params.page);
  const offset = Math.ceil((page - 1) * 200);

  const datasets = queryData(`
    SELECT *
    FROM datasets
    WHERE ${entity.identifier} = '${params.identifier}'
    ORDER BY name
    LIMIT 200
    OFFSET ${offset}
  `);

  return {
    entity,
    page,
    datasets,
  };
};
