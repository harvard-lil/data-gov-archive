import { error } from "@sveltejs/kit";

import { queryData } from "$lib/db.js";
import { entities } from "$lib/entities.js";

export const load = ({ params }) => {
  const entity = entities.find((entity) => entity.route == params.entity);
  if (!entity) error(404);

  const count = queryData(`
      SELECT count(DISTINCT ${entity.identifier}) AS count FROM datasets
    `)[0].count;

  return { entity, count };
};
