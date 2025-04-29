import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const dataset = sample.find((dataset) => dataset.name === params.name);
  return { dataset };
};
