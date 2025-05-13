import sample from "../../../data/sample.json";

export const load = ({ params }) => {
  const tags = Array.from(
    new Set(
      sample
        .map((dataset) => {
          if (dataset.tags) {
            return dataset.tags.split(/, /);
          } else {
            return [];
          }
        })
        .flat()
    )
  ).sort();
  return {
    tags,
  };
};
