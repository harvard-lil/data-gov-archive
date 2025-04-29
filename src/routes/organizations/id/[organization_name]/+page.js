import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample.filter(
    (dataset) => dataset.organization_name === params.organization_name
  );
  return {
    organization_name: datasets[0].organization_name,
    organization_title: datasets[0].organization_title,
    datasets,
  };
};
