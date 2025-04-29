import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample.filter((dataset) => dataset.publisher === params.publisher);
  return {
    publisher: datasets[0].publisher,
    datasets,
  };
};
