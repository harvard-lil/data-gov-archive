import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample
    .filter((dataset) => dataset.publisher === params.publisher)
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
    publisher: datasets[0].publisher,
    datasets,
  };
};
