import sample from "../../data/sample.json";

const getTopN = (datasets, n, keyAttribute, attributes) => {
  return Object.values(
    datasets.reduce((previousValue, currentValue) => {
      const key = currentValue[keyAttribute];
      if (!key) {
        return previousValue;
      }
      if (!previousValue[key]) {
        previousValue[key] = { count: 0 };
        attributes.forEach((attribute) => {
          previousValue[key][attribute] = currentValue[attribute];
        });
      }
      previousValue[key].count++;
      return previousValue;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
};

const getTopNTags = (datasets, n) => {
  const tags = datasets
    .map((dataset) => (dataset.tags ? dataset.tags.split(/, /) : null))
    .flat()
    .filter((tag) => !!tag);

  return Object.values(
    tags.reduce((previousValue, currentValue) => {
      const key = currentValue;
      if (!previousValue[key]) {
        previousValue[key] = { tag: currentValue, count: 0 };
      }
      previousValue[key].count++;
      return previousValue;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
};

export const load = ({ params }) => {
  const datasets = sample.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });

  const n = 7;

  const organizations = getTopN(datasets, n, "organization_name", [
    "organization_name",
    "organization_title",
  ]);
  const publishers = getTopN(datasets, n, "publisher", ["publisher"]);
  const bureaus = getTopN(datasets, n, "bureau_code", ["bureau_code", "bureau_name"]);
  const tags = getTopNTags(datasets, n);

  return { organizations, publishers, bureaus, tags };
};
