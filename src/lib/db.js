import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import { LRUCache } from "lru-cache";

import { browser } from "$app/environment";

// Connection pooling state
let db = null;
let connection = null;
let isInitializing = false;
let initPromise = null;

// Query cache
const queryCache = new LRUCache({
  max: 128,
  // maxSize: 1024 * 1024 * 10, // 10 MB
  ttl: 1000 * 60 * 30, // 30 minutes
});

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
    // Ensure the global db variable is set
    if (result && !db) {
      db = result;
    }
    return result;
  } finally {
    isInitializing = false;
  }
};

const initializeDuckDB = async () => {
  try {
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
    const dbInstance = new duckdb.AsyncDuckDB(logger, worker);

    await dbInstance.instantiate(bundle.mainModule, bundle.pthreadWorker);

    // Wait for the database to be fully instantiated
    if (!dbInstance) {
      throw new Error("Database instance is null after instantiation");
    }

    // Set the global db variable
    db = dbInstance;
    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize DuckDB:", error);
    // Reset global state on error
    db = null;
    isInitializing = false;
    initPromise = null;
    throw error;
  }
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
    const dbInstance = await instantiateDuckDB();
    if (!dbInstance) {
      throw new Error("Failed to initialize DuckDB database");
    }
    connection = await dbInstance.connect();
  } else {
    // Check if existing connection is still valid
    const isValid = await isConnectionValid(connection);
    if (!isValid) {
      try {
        await connection.close();
      } catch (error) {
        // Ignore close errors
      }
      const dbInstance = await instantiateDuckDB();
      if (!dbInstance) {
        throw new Error("Failed to reinitialize DuckDB database");
      }
      connection = await dbInstance.connect();
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
  // Check if we're in browser environment
  if (!browser) {
    throw new Error("Database queries can only be executed in the browser.");
  }

  // Generate cache key
  const paramsStr = params ? JSON.stringify(params) : "";
  const cacheKey = `${query}|${paramsStr}`;

  // Check cache first
  const cachedResult = queryCache.get(cacheKey);
  if (cachedResult !== undefined) {
    // console.log(`Cache hit for query: ${query.substring(0, 50)}…`);
    return cachedResult;
  }

  // Always ensure DuckDB is initialized before running queries
  if (!db) {
    await instantiateDuckDB();
  }

  // Double-check that db is initialized
  if (!db) {
    throw new Error("DuckDB failed to initialize");
  }

  let conn = null;
  let statement = null;

  try {
    conn = await getConnection();
    statement = await conn.prepare(query);
    const arrowResult = await statement.query(...(params || []));
    const result = arrowResult.toArray().map((row) => row.toJSON());

    // Store result in cache
    queryCache.set(cacheKey, result);
    // console.log(
    //   `Cache miss - stored result for query: ${query.substring(0, 50)}… (cache size: ${
    //     queryCache.size
    //   })`
    // );

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
      console.log("Connection error detected, resetting connection…");
      await resetConnection();

      // Retry once with fresh connection
      try {
        conn = await getConnection();
        statement = await conn.prepare(query);
        const arrowResult = await statement.query(...(params || []));
        const result = arrowResult.toArray().map((row) => row.toJSON());

        // Store result in cache after successful retry
        queryCache.set(cacheKey, result);
        // console.log(
        //   `Cache miss (retry) - stored result for query: ${query.substring(0, 50)}… (cache size: ${
        //     queryCache.size
        //   })`
        // );

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

// Cleanup function for app shutdown
export const cleanup = async () => {
  await closeConnection();
  queryCache.clear();
};
