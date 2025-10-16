// verify-all-booking-values.js
// Script to verify all booking values across the system

const fs = require("fs");

function verifyAllBookingValues() {
  console.log("🔍 Verifying All Booking Values Across System...");

  try {
    // Read main page
    const mainPageContent = fs.readFileSync("index.html", "utf8");

    // Extract all booking values from main page
    const mainPageValues = {
      today: extractValue(mainPageContent, "Booking Hôm nay"),
      yesterday: extractValue(mainPageContent, "Booking Hôm qua"),
      thisWeek: extractValue(mainPageContent, "Booking Tuần này"),
      mtd: extractValue(mainPageContent, "Booking MTD"),
    };

    console.log("📊 Main Page Values:");
    console.log(`  • Booking Hôm nay: ${mainPageValues.today}`);
    console.log(`  • Booking Hôm qua: ${mainPageValues.yesterday}`);
    console.log(`  • Booking Tuần này: ${mainPageValues.thisWeek}`);
    console.log(`  • Booking MTD: ${mainPageValues.mtd}`);

    // Check yesterday detail page
    const yesterdayContent = fs.readFileSync(
      "pages/03-05-01-03-booking-yesterday-detail.html",
      "utf8"
    );
    const yesterdayDetail = extractValue(
      yesterdayContent,
      "Tổng check-in Hôm qua"
    );

    console.log("\n📊 Yesterday Detail Page:");
    console.log(`  • Tổng check-in Hôm qua: ${yesterdayDetail}`);

    // Check this week detail page
    const thisWeekContent = fs.readFileSync(
      "pages/03-05-01-04-booking-this-week-detail.html",
      "utf8"
    );
    const thisWeekDetail = extractValue(thisWeekContent, "Tổng booking tuần");

    console.log("\n📊 This Week Detail Page:");
    console.log(`  • Tổng booking tuần: ${thisWeekDetail}`);

    // Check consistency
    const consistency = {
      yesterday: mainPageValues.yesterday === yesterdayDetail,
      thisWeek: mainPageValues.thisWeek === thisWeekDetail,
    };

    console.log("\n📊 Consistency Check:");
    console.log(
      `  • Yesterday: ${
        consistency.yesterday ? "✅ Consistent" : "❌ Inconsistent"
      }`
    );
    console.log(
      `  • This Week: ${
        consistency.thisWeek ? "✅ Consistent" : "❌ Inconsistent"
      }`
    );

    // Calculate totals for verification
    const totalFromMainPage =
      mainPageValues.today +
      mainPageValues.yesterday +
      mainPageValues.thisWeek +
      mainPageValues.mtd;
    console.log(`\n📊 Total from main page: ${totalFromMainPage}`);

    // Check if values make sense
    const logicalChecks = {
      yesterdayLessThanToday: mainPageValues.yesterday <= mainPageValues.today,
      thisWeekGreaterThanToday: mainPageValues.thisWeek >= mainPageValues.today,
      mtdGreaterThanThisWeek: mainPageValues.mtd >= mainPageValues.thisWeek,
    };

    console.log("\n📊 Logical Checks:");
    console.log(
      `  • Yesterday ≤ Today: ${
        logicalChecks.yesterdayLessThanToday ? "✅" : "❌"
      }`
    );
    console.log(
      `  • This Week ≥ Today: ${
        logicalChecks.thisWeekGreaterThanToday ? "✅" : "❌"
      }`
    );
    console.log(
      `  • MTD ≥ This Week: ${
        logicalChecks.mtdGreaterThanThisWeek ? "✅" : "❌"
      }`
    );

    return {
      mainPageValues,
      yesterdayDetail,
      thisWeekDetail,
      consistency,
      logicalChecks,
    };
  } catch (error) {
    console.error("❌ Error verifying booking values:", error.message);
    return null;
  }
}

function extractValue(content, label) {
  // Look for the pattern: <h6>Label</h6> followed by <h4>value</h4> or <h3>value</h3>
  const patterns = [
    new RegExp(`<h6>${label}</h6>[\\s\\S]*?<h4[^>]*>([0-9]+)</h4>`),
    new RegExp(`<h6>${label}</h6>[\\s\\S]*?<h3[^>]*>([0-9]+)</h3>`),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }

  return 0;
}

// Run the verification
if (require.main === module) {
  const result = verifyAllBookingValues();

  if (result) {
    console.log("\n📊 FINAL SUMMARY:");
    console.log(`Main page yesterday: ${result.mainPageValues.yesterday}`);
    console.log(`Detail page yesterday: ${result.yesterdayDetail}`);
    console.log(
      `Yesterday consistent: ${result.consistency.yesterday ? "✅" : "❌"}`
    );

    console.log(`Main page this week: ${result.mainPageValues.thisWeek}`);
    console.log(`Detail page this week: ${result.thisWeekDetail}`);
    console.log(
      `This week consistent: ${result.consistency.thisWeek ? "✅" : "❌"}`
    );

    const allConsistent =
      result.consistency.yesterday && result.consistency.thisWeek;
    console.log(
      `\nOverall consistency: ${
        allConsistent
          ? "✅ All values are consistent!"
          : "❌ Some values need fixing"
      }`
    );
  }
}

