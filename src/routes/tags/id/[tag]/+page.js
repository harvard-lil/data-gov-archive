import sample from "../../../../../data/sample.json";

export const load = ({ params }) => {
  const datasets = sample.filter((dataset) => {
    if (dataset.tags) {
      return dataset.tags.split(/, /).includes(params.tag);
    } else {
      return false;
    }
  });
  return {
    tag: params.tag,
    datasets,
  };
};
