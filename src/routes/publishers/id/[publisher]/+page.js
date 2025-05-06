import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample.filter((dataset) => dataset.publisher === params.publisher).slice(0, 200);
  return {
    publisher: datasets[0].publisher,
    datasets,
  };
};
