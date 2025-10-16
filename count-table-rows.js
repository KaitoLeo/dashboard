// count-table-rows.js
// Script to count table rows in booking-yesterday-detail.html

const fs = require("fs");

function countTableRows() {
  console.log("🔍 Counting table rows in Booking Yesterday Detail...");

  try {
    const content = fs.readFileSync(
      "pages/03-05-01-03-booking-yesterday-detail.html",
      "utf8"
    );

    // Count table rows with data-status attribute
    const rowMatches = content.match(/<tr[\s\S]*?data-status[\s\S]*?<\/tr>/g);
    const rowCount = rowMatches ? rowMatches.length : 0;

    console.log(`📊 Total table rows: ${rowCount}`);

    // Count by service type
    const serviceCounts = {
      "PT Fitness": 0,
      Membership: 0,
      Pilates: 0,
      "Swimming Coach": 0,
    };

    if (rowMatches) {
      rowMatches.forEach((row) => {
        const serviceMatch = row.match(/data-service="([^"]+)"/);
        if (serviceMatch) {
          const service = serviceMatch[1];
          if (serviceCounts.hasOwnProperty(service)) {
            serviceCounts[service]++;
          }
        }
      });
    }

    console.log(`📊 Service breakdown:`, serviceCounts);

    const totalFromTable = Object.values(serviceCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    console.log(`📊 Total from table: ${totalFromTable}`);

    // Check consistency
    const isConsistent = rowCount === totalFromTable;
    console.log(
      `📊 Table rows = Service sum: ${isConsistent ? "✅ Yes" : "❌ No"}`
    );

    return {
      rowCount,
      serviceCounts,
      totalFromTable,
      isConsistent,
    };
  } catch (error) {
    console.error("❌ Error counting rows:", error.message);
    return null;
  }
}

// Run count
const result = countTableRows();

if (result) {
  console.log("\n📊 SUMMARY:");
  console.log(`Table rows: ${result.rowCount}`);
  console.log(`Service sum: ${result.totalFromTable}`);
  console.log(`Consistent: ${result.isConsistent ? "✅ Yes" : "❌ No"}`);
}

