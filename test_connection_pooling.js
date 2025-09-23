#!/usr/bin/env node
/**
 * Test script to verify connection pooling implementation
 * This simulates the browser environment for testing
 */

// Mock browser environment
global.window = global;
global.performance = {
  now: () => Date.now(),
};

// Mock SvelteKit environment
process.env.NODE_ENV = "development";

// Import the database module
import { queryData, cleanup } from "./src/lib/db.js";

async function testConnectionPooling() {
  console.log("🧪 Testing Connection Pooling Implementation\n");

  try {
    console.log("1. Testing initial connection...");
    const startTime = Date.now();

    // First query - should create connection
    const result1 = await queryData(`
      SELECT count(*) as count
      FROM read_parquet('data/datasets.parquet')
      LIMIT 1
    `);

    const firstQueryTime = Date.now() - startTime;
    console.log(`   ✅ First query completed in ${firstQueryTime}ms`);
    console.log(`   📊 Result: ${result1[0].count} datasets`);

    console.log("\n2. Testing connection reuse...");
    const startTime2 = Date.now();

    // Second query - should reuse connection
    const result2 = await queryData(`
      SELECT count(*) as count
      FROM read_parquet('data/tags.parquet')
      LIMIT 1
    `);

    const secondQueryTime = Date.now() - startTime2;
    console.log(`   ✅ Second query completed in ${secondQueryTime}ms`);
    console.log(`   📊 Result: ${result2[0].count} tags`);

    console.log("\n3. Testing tag route optimization...");
    const startTime3 = Date.now();

    // Test the optimized tag query
    const tagCount = await queryData(`
      SELECT count
      FROM read_parquet('data/aggregations.parquet')
      WHERE aggregation = 'tags' AND identifier = 'oceans'
    `);

    const tagQueryTime = Date.now() - startTime3;
    console.log(`   ✅ Tag count query completed in ${tagQueryTime}ms`);
    console.log(`   📊 Result: ${tagCount[0]?.count || 0} datasets with 'oceans' tag`);

    console.log("\n4. Testing cleanup...");
    await cleanup();
    console.log(`   ✅ Cleanup completed`);

    console.log("\n🎉 Connection pooling test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testConnectionPooling().catch(console.error);
