// check-booking-consistency.js
// Script to check booking data consistency between main page and detail pages

const fs = require("fs");

function checkBookingConsistency() {
  console.log("🔍 Checking Booking Data Consistency...");

  try {
    // Read main page
    const mainPageContent = fs.readFileSync("index.html", "utf8");

    // Extract booking values from main page
    const mainPageBookings = {
      today: extractBookingValue(mainPageContent, "Booking Hôm nay"),
      yesterday: extractBookingValue(mainPageContent, "Booking Hôm qua"),
      thisWeek: extractBookingValue(mainPageContent, "Booking Tuần này"),
      mtd: extractBookingValue(mainPageContent, "Booking MTD"),
    };

    console.log("📊 Main Page Booking Values:");
    console.log(`  • Booking Hôm nay: ${mainPageBookings.today}`);
    console.log(`  • Booking Hôm qua: ${mainPageBookings.yesterday}`);
    console.log(`  • Booking Tuần này: ${mainPageBookings.thisWeek}`);
    console.log(`  • Booking MTD: ${mainPageBookings.mtd}`);

    // Check yesterday detail page
    const yesterdayDetailContent = fs.readFileSync(
      "pages/03-05-01-03-booking-yesterday-detail.html",
      "utf8"
    );
    const yesterdayDetailTotal = extractBookingValue(
      yesterdayDetailContent,
      "Tổng check-in Hôm qua"
    );

    console.log("\n📊 Yesterday Detail Page:");
    console.log(`  • Tổng check-in Hôm qua: ${yesterdayDetailTotal}`);

    // Check consistency
    const isYesterdayConsistent =
      mainPageBookings.yesterday === yesterdayDetailTotal;
    console.log(`\n📊 Consistency Check:`);
    console.log(
      `  • Yesterday: ${
        isYesterdayConsistent ? "✅ Consistent" : "❌ Inconsistent"
      }`
    );

    if (!isYesterdayConsistent) {
      console.log(
        `    Main page: ${mainPageBookings.yesterday} vs Detail page: ${yesterdayDetailTotal}`
      );
    }

    // Check if we need to update any values
    const needsUpdate = !isYesterdayConsistent;

    return {
      mainPageBookings,
      yesterdayDetailTotal,
      isYesterdayConsistent,
      needsUpdate,
    };
  } catch (error) {
    console.error("❌ Error checking booking consistency:", error.message);
    return null;
  }
}

function extractBookingValue(content, label) {
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

// Run the check
if (require.main === module) {
  const result = checkBookingConsistency();

  if (result) {
    console.log("\n📊 SUMMARY:");
    console.log(`Main page yesterday: ${result.mainPageBookings.yesterday}`);
    console.log(`Detail page yesterday: ${result.yesterdayDetailTotal}`);
    console.log(
      `Consistent: ${result.isYesterdayConsistent ? "✅ Yes" : "❌ No"}`
    );

    if (result.needsUpdate) {
      console.log("\n🔧 RECOMMENDATION:");
      console.log(
        "Update main page to match detail page values for consistency."
      );
    } else {
      console.log("\n✅ All booking values are consistent!");
    }
  }
}

