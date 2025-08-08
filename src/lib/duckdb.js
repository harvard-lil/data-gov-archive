import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

import { browser } from "$app/environment";
import { DuckDBDataProtocol } from "@duckdb/duckdb-wasm";

const bucketUrl = "https://gov-data-search.s3.us-west-2.amazonaws.com";
const datasetsUrl = `${bucketUrl}/datasets.parquet`;
const tagsUrl = `${bucketUrl}/tags.parquet`;

let db = null;

export const instantiateDuckDB = async () => {
  if (!browser) {
    Error("Can only instantiate DuckDB from browser.");
  } else if (db) {
    return db;
  }
  const duckdb = await import("@duckdb/duckdb-wasm");
  const bundles = {
    mvp: {
      mainModule: duckdb_wasm,
      mainWorker: mvp_worker,
    },
    eh: {
      mainModule: duckdb_wasm_eh,
      mainWorker: eh_worker,
    },
  };

  // Select a bundle based on browser checks
  const bundle = await duckdb.selectBundle(bundles);

  // Instantiate the async version of DuckDB-Wasm
  const worker = new Worker(bundle.mainWorker);
  const logger = new duckdb.ConsoleLogger();
  db = new duckdb.AsyncDuckDB(logger, worker);

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  // Register files
  await db.registerFileURL("datasets.parquet", datasetsUrl, DuckDBDataProtocol.HTTP, false);
  await db.registerFileURL("tags.parquet", tagsUrl, DuckDBDataProtocol.HTTP, false);

  return db;
};
