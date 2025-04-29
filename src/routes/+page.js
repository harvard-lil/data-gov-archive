import sample from "../../data/sample.json";

export const load = ({ params }) => {
  return {
    datasets: sample
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      })
      .slice(0, 200),
  };
};
