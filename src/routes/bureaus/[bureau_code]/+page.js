import sample from "../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample.filter((dataset) => dataset.bureau_code === params.bureau_code);
  return {
    bureau_code: datasets[0].bureau_code,
    bureau_name: datasets[0].bureau_name,
    datasets,
  };
};
