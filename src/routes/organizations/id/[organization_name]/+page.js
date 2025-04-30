import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample
    .filter((dataset) => dataset.organization_name === params.organization_name)
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  return {
    organization_name: datasets[0].organization_name,
    organization_title: datasets[0].organization_title,
    datasets,
  };
};
