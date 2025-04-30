import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample
    .filter((dataset) => {
      if (dataset.tags) {
        return dataset.tags.split(/, /).includes(params.tag);
      } else {
        return false;
      }
    })
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
    tag: params.tag,
    datasets,
  };
};
