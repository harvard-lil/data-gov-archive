import { redirect, error } from "@sveltejs/kit";

export const load = ({ params }) => {
  redirect(308, `/tags/page/1`);
};
