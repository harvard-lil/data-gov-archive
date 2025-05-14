import fs from "fs";

import initSqlJs from "sql.js";

const buffer = fs.readFileSync("./data/data.db");
const sqlJs = await initSqlJs();
const db = new sqlJs.Database(buffer);

const zipResults = (results) => {
  const [result] = results;
  if (!result) {
    return [];
  }
  return result.values.map((values) => {
    const record = {};
    result.columns.forEach((column, index) => (record[column] = values[index]));
    return record;
  });
};

export const queryData = (query, params) => {
  const results = db.exec(query, params);
  return zipResults(results);
};
