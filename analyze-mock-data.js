// analyze-mock-data.js
// Script to analyze mock data usage in dashboard pages

const fs = require("fs");

function analyzeMockData() {
  console.log("🔍 Analyzing Mock Data Usage...");

  const pages = [
    "pages/03-03-01-04-daily-revenue-today-detail.html",
    "pages/03-05-01-03-booking-yesterday-detail.html",
    "pages/03-05-01-04-booking-this-week-detail.html",
    "index.html",
  ];

  const results = {};

  pages.forEach((page) => {
    try {
      const content = fs.readFileSync(page, "utf8");

      // Check for hardcoded data arrays
      const hardcodedData = content.match(/data:\s*\[[\d\s,\.]+\]/g) || [];
      const mockValues = content.match(/\d{4,}/g) || []; // Numbers with 4+ digits (likely mock values)

      // Check for shared data layer usage
      const hasDataSync = content.includes("DataSync");
      const hasSharedState = content.includes("SharedState");
      const hasCompute = content.includes("Compute");
      const hasUpdateRevenueData = content.includes("updateRevenueData");

      // Check for API calls
      const hasFetch = content.includes("fetch(");
      const hasAxios = content.includes("axios");
      const hasAPI = content.includes("/api/");

      results[page] = {
        hardcodedDataCount: hardcodedData.length,
        mockValuesCount: mockValues.length,
        hasDataSync,
        hasSharedState,
        hasCompute,
        hasUpdateRevenueData,
        hasFetch,
        hasAxios,
        hasAPI,
        isUsingMockData: hardcodedData.length > 0,
        isConnectedToDataLayer: hasDataSync && hasSharedState && hasCompute,
      };
    } catch (error) {
      console.error(`❌ Error analyzing ${page}:`, error.message);
      results[page] = { error: error.message };
    }
  });

  return results;
}

function printAnalysis(results) {
  console.log("\n📊 MOCK DATA ANALYSIS:");
  console.log("=".repeat(60));

  Object.keys(results).forEach((page) => {
    const result = results[page];

    if (result.error) {
      console.log(`\n❌ ${page}: ERROR - ${result.error}`);
      return;
    }

    console.log(`\n📄 ${page}:`);
    console.log(`  • Hardcoded data arrays: ${result.hardcodedDataCount}`);
    console.log(`  • Mock values (4+ digits): ${result.mockValuesCount}`);
    console.log(
      `  • Using mock data: ${result.isUsingMockData ? "❌ Yes" : "✅ No"}`
    );
    console.log(
      `  • Connected to data layer: ${
        result.isConnectedToDataLayer ? "✅ Yes" : "❌ No"
      }`
    );
    console.log(
      `  • Has API calls: ${
        result.hasFetch || result.hasAxios || result.hasAPI ? "✅ Yes" : "❌ No"
      }`
    );

    if (result.isUsingMockData && result.isConnectedToDataLayer) {
      console.log(
        `  ⚠️  ISSUE: Connected to data layer but still using mock data!`
      );
    }
  });

  console.log("\n📊 SUMMARY:");
  const totalPages = Object.keys(results).length;
  const pagesWithMockData = Object.values(results).filter(
    (r) => !r.error && r.isUsingMockData
  ).length;
  const pagesConnected = Object.values(results).filter(
    (r) => !r.error && r.isConnectedToDataLayer
  ).length;
  const pagesWithAPI = Object.values(results).filter(
    (r) => !r.error && (r.hasFetch || r.hasAxios || r.hasAPI)
  ).length;

  console.log(`  • Total pages analyzed: ${totalPages}`);
  console.log(
    `  • Pages using mock data: ${pagesWithMockData} (${Math.round(
      (pagesWithMockData / totalPages) * 100
    )}%)`
  );
  console.log(
    `  • Pages connected to data layer: ${pagesConnected} (${Math.round(
      (pagesConnected / totalPages) * 100
    )}%)`
  );
  console.log(
    `  • Pages with API calls: ${pagesWithAPI} (${Math.round(
      (pagesWithAPI / totalPages) * 100
    )}%)`
  );

  if (pagesWithMockData > 0) {
    console.log("\n⚠️  RECOMMENDATIONS:");
    console.log(
      "  1. Replace hardcoded data arrays with dynamic data from shared data layer"
    );
    console.log("  2. Implement proper API integration for real data");
    console.log(
      "  3. Use computed data from Compute.computeAll() instead of mock values"
    );
    console.log(
      "  4. Update chart creation functions to use data.revenue.stats"
    );
  }
}

// Run the analysis
if (require.main === module) {
  const results = analyzeMockData();
  printAnalysis(results);
}

