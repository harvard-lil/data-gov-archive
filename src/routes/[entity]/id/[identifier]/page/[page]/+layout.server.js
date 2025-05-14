import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";
import { entities } from "$lib/entities.js";

export const load = ({ params }) => {
  const entity = entities.find((entity) => entity.route == params.entity);
  if (!entity) error(404);

  const count = queryData(`
      SELECT count(*) AS count FROM datasets WHERE ${entity.identifier} = '${params.identifier}'
    `)[0].count;

  return { entity, count };
};
