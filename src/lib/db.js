import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

import { browser } from "$app/environment";
import { DuckDBDataProtocol } from "@duckdb/duckdb-wasm";

const bucketUrl = "https://gov-data-search.s3.us-west-2.amazonaws.com";
const datasetsUrl = `${bucketUrl}/datasets.parquet`;
const tagsUrl = `${bucketUrl}/tags.parquet`;
const aggregationsUrl = `${bucketUrl}/aggregations.parquet`;

// Connection pooling state
let db = null;
let connection = null;
let isInitializing = false;
let initPromise = null;
let queryCount = 0;
let totalQueryTime = 0;

export const instantiateDuckDB = async () => {
  if (!browser) {
    throw new Error("Can only instantiate DuckDB from browser.");
  }

  // Return existing database if already initialized
  if (db) {
    return db;
  }

  // If already initializing, wait for the existing promise
  if (isInitializing && initPromise) {
    return initPromise;
  }

  // Start initialization
  isInitializing = true;
  initPromise = initializeDuckDB();

  try {
    const result = await initPromise;
    return result;
  } finally {
    isInitializing = false;
  }
};

const initializeDuckDB = async () => {
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
  await db.registerFileURL("aggregations.parquet", aggregationsUrl, DuckDBDataProtocol.HTTP, false);

  return db;
};

// Check if connection is still valid
const isConnectionValid = async (conn) => {
  try {
    // Try a simple query to test the connection
    const testStatement = await conn.prepare("SELECT 1 AS test");
    await testStatement.close();
    return true;
  } catch (error) {
    return false;
  }
};

// Get or create a persistent connection
const getConnection = async () => {
  if (!connection) {
    const db = await instantiateDuckDB();
    connection = await db.connect();
  } else {
    // Check if existing connection is still valid
    const isValid = await isConnectionValid(connection);
    if (!isValid) {
      console.log("Connection is stale, creating new connection...");
      try {
        await connection.close();
      } catch (error) {
        // Ignore close errors
      }
      const db = await instantiateDuckDB();
      connection = await db.connect();
    }
  }
  return connection;
};

// Close the persistent connection (for cleanup)
export const closeConnection = async () => {
  if (connection) {
    try {
      await connection.close();
    } catch (error) {
      console.error("Error closing database connection:", error);
    } finally {
      connection = null;
    }
  }
};

// Reset connection (useful for error recovery)
export const resetConnection = async () => {
  await closeConnection();
  // Connection will be recreated on next query
};

export const queryData = async (query, params) => {
  const startTime = performance.now();
  let conn = null;
  let statement = null;

  try {
    conn = await getConnection();
    statement = await conn.prepare(query);
    const arrowResult = await statement.query(...(params || []));
    const result = arrowResult.toArray().map((row) => row.toJSON());

    // Update performance stats
    queryCount++;
    const queryTime = performance.now() - startTime;
    totalQueryTime += queryTime;

    // Log slow queries in development
    if (queryTime > 1000) {
      // Log queries taking more than 1 second
      console.warn(
        `Slow query detected (${queryTime.toFixed(2)}ms):`,
        query.substring(0, 100) + "..."
      );
    }

    return result;
  } catch (error) {
    console.error("Query error:", error);

    // If connection error, reset and retry once
    if (
      error.message.includes("connection") ||
      error.message.includes("closed") ||
      error.message.includes("Connection") ||
      error.message.includes("Invalid connection") ||
      error.message.includes("Connection is closed")
    ) {
      console.log("Connection error detected, resetting connection...");
      await resetConnection();

      // Retry once with fresh connection
      try {
        conn = await getConnection();
        statement = await conn.prepare(query);
        const arrowResult = await statement.query(...(params || []));
        const result = arrowResult.toArray().map((row) => row.toJSON());
        return result;
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        throw retryError;
      }
    }

    throw error;
  } finally {
    // Close statement but keep connection alive
    if (statement) {
      try {
        await statement.close();
      } catch (error) {
        console.error("Error closing statement:", error);
      }
    }
  }
};

// Get performance statistics
export const getPerformanceStats = () => {
  return {
    queryCount,
    totalQueryTime,
    averageQueryTime: queryCount > 0 ? totalQueryTime / queryCount : 0,
    isConnected: connection !== null,
  };
};

// Reset performance statistics
export const resetPerformanceStats = () => {
  queryCount = 0;
  totalQueryTime = 0;
};

// Cleanup function for app shutdown
export const cleanup = async () => {
  console.log("Cleaning up database connections...");
  await closeConnection();
  console.log("Database cleanup complete");
};
