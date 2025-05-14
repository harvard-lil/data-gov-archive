import { redirect, error } from "@sveltejs/kit";

import { entities } from "$lib/entities.js";

export const load = ({ params }) => {
  const entity = entities.find((entity) => entity.route == params.entity);
  if (!entity) error(404);

  redirect(308, `/${entity.route}/page/1`);
};
