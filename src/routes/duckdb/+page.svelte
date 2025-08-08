<script>
  import { DuckDBDataProtocol } from "@duckdb/duckdb-wasm";

  import { instantiateDuckDB } from "$lib/duckdb";
  import DatasetList from "$lib/DatasetList.svelte";

  const loadDB = async () => {
    console.log("Loading DuckDB…");

    const duckdb = await instantiateDuckDB();

    const conn = await duckdb.connect();
    return conn;
  };

  const queryDuckDB = async () => {
    const conn = await loadDB();
    const statement = await conn.prepare(
      `
        SELECT name, title, notes, organization_name, organization_title
        FROM parquet_scan('datasets.parquet')
        LIMIT ?
        OFFSET ?;
      `
    );
    const results = await statement.query(200, 0);
    await statement.close();
    await conn.close();

    return results;
  };

  let results = queryDuckDB();
</script>

{#await results}
  <p>Loading…</p>
{:then results}
  <DatasetList datasets={results} />
{/await}
