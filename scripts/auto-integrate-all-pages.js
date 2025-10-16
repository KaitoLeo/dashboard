/**
 * Auto Integration Script
 * Automatically add calculation modules to all remaining pages
 */

const fs = require("fs");
const path = require("path");

console.log("🤖 AUTO-INTEGRATION SCRIPT");
console.log("=".repeat(70));

// Define pages to integrate
const pagesToIntegrate = {
  revenue: [
    "pages/03-03-01-01-revenue-reports.html",
    "pages/03-03-01-03-daily-revenue-detail.html",
    "pages/03-03-01-05-daily-revenue-yesterday-detail.html",
    "pages/03-03-01-05-total-revenue-mtd-detail.html",
    "pages/03-03-02-02-revenue-service-filtered.html",
    "pages/03-03-03-03-revenue-club-filtered.html",
    "pages/03-03-04-02-revenue-staff-filtered.html",
  ],
  booking: [
    "pages/03-05-01-06-booking-ytd-detail.html",
    "pages/03-05-01-07-booking-last-month-detail.html",
    "pages/03-05-01-08-booking-this-month-detail.html",
  ],
  checkin: [
    "pages/03-01-01-01-checkin-today-detail.html",
    "pages/03-01-01-02-checkin-yesterday-detail.html",
    "pages/03-01-01-03-checkin-mtd-detail.html",
    "pages/03-01-02-01-membership-checkin-detail.html",
    "pages/03-01-03-01-pilates-checkin-detail.html",
    "pages/03-01-05-01-swimming-checkin-detail.html",
  ],
  visitor: [
    "pages/03-01-08-01-visitors-today-detail.html",
    "pages/03-01-08-02-visitors-yesterday-detail.html",
    "pages/03-01-08-03-visitors-detail.html",
    "pages/03-01-08-05-visitor-stats-detail.html",
    "pages/03-01-08-06-visitor-yesterday-detail.html",
    "pages/03-01-08-07-visitor-today-detail.html",
  ],
};

// Module imports templates
const moduleImports = {
  revenue: `
    <!-- Revenue Calculation Modules -->
    <script src="../assets/js/revenue/revenue-calculations.js"></script>
    <script src="../assets/js/revenue/revenue-mock-data.js"></script>
    <!-- API Layer -->
    <script src="../assets/js/api/api-client.js"></script>
    <script src="../assets/js/api/api-services.js"></script>
    <script src="../assets/js/api/data-adapter.js"></script>`,

  booking: `
    <!-- Booking Calculation Modules -->
    <script src="../assets/js/booking/booking-calculations.js"></script>
    <script src="../assets/js/booking/booking-mock-data.js"></script>
    <!-- API Layer -->
    <script src="../assets/js/api/api-client.js"></script>
    <script src="../assets/js/api/api-services.js"></script>
    <script src="../assets/js/api/data-adapter.js"></script>`,

  checkin: `
    <!-- Checkin Calculation Modules -->
    <script src="../assets/js/checkin/checkin-calculations.js"></script>
    <script src="../assets/js/checkin/checkin-mock-data.js"></script>
    <!-- API Layer -->
    <script src="../assets/js/api/api-client.js"></script>
    <script src="../assets/js/api/api-services.js"></script>
    <script src="../assets/js/api/data-adapter.js"></script>`,

  visitor: `
    <!-- Visitor Calculation Modules -->
    <script src="../assets/js/visitor/visitor-calculations.js"></script>
    <script src="../assets/js/visitor/visitor-mock-data.js"></script>
    <!-- API Layer -->
    <script src="../assets/js/api/api-client.js"></script>
    <script src="../assets/js/api/api-services.js"></script>
    <script src="../assets/js/api/data-adapter.js"></script>`,
};

// Track results
let processed = 0;
let integrated = 0;
let skipped = 0;
let errors = 0;

// Process each category
Object.keys(pagesToIntegrate).forEach((category) => {
  console.log(`\n📁 Processing ${category.toUpperCase()} pages...`);

  pagesToIntegrate[category].forEach((filePath) => {
    processed++;
    const fileName = path.basename(filePath);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`   ⏭️ ${fileName} - File not found, skipping`);
        skipped++;
        return;
      }

      let content = fs.readFileSync(filePath, "utf8");

      // Check if already integrated
      if (content.includes(`${category}-calculations.js`)) {
        console.log(`   ⏭️ ${fileName} - Already integrated, skipping`);
        skipped++;
        return;
      }

      // Find insertion point (before </head>)
      const headCloseIndex = content.indexOf("</head>");
      if (headCloseIndex === -1) {
        console.log(`   ❌ ${fileName} - No </head> tag found`);
        errors++;
        return;
      }

      // Insert module imports
      const beforeHead = content.substring(0, headCloseIndex);
      const afterHead = content.substring(headCloseIndex);

      const newContent =
        beforeHead + moduleImports[category] + "\n  " + afterHead;

      // Write back to file
      fs.writeFileSync(filePath, newContent, "utf8");

      console.log(`   ✅ ${fileName} - Integrated`);
      integrated++;
    } catch (error) {
      console.log(`   ❌ ${fileName} - Error: ${error.message}`);
      errors++;
    }
  });
});

// Summary
console.log("\n" + "=".repeat(70));
console.log("📊 INTEGRATION SUMMARY");
console.log("=".repeat(70));
console.log(`\n✅ Integrated: ${integrated} pages`);
console.log(`⏭️ Skipped: ${skipped} pages (already done or not found)`);
console.log(`❌ Errors: ${errors} pages`);
console.log(`📊 Total Processed: ${processed} pages`);
console.log(`📈 Success Rate: ${((integrated / processed) * 100).toFixed(1)}%`);

console.log("\n🎯 Next Steps:");
console.log("1. Review integrated pages");
console.log("2. Test in browser");
console.log("3. Configure backend API URL");
console.log("4. Test with real backend");

console.log("\n✨ Auto-integration completed! 🚀\n");
