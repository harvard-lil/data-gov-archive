import sample from "../../data/sample.json";

export const load = ({ params }) => {
  return {
    datasets: sample.slice(0, 200),
  };
};
