/**
 * Integrate ALL Remaining Pages
 * Automatically add calculation modules to ALL pages
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 INTEGRATING ALL REMAINING PAGES");
console.log("=".repeat(70));

// Module imports for each type
const moduleImports = {
  booking: `
    <!-- Booking Calculation Modules -->
    <script src="../assets/js/booking/booking-calculations.js"></script>
    <script src="../assets/js/booking/booking-mock-data.js"></script>
    <script src="../assets/js/api/api-client.js"></script>
    <script src="../assets/js/api/api-services.js"></script>
    <script src="../assets/js/api/data-adapter.js"></script>`,

  checkin: `
    <!-- Checkin Calculation Modules -->
    <script src="../assets/js/checkin/checkin-calculations.js"></script>
    <script src="../assets/js/checkin/checkin-mock-data.js"></script>
    <script src="../assets/js/api/api-client.js"></script>
    <script src="../assets/js/api/api-services.js"></script>
    <script src="../assets/js/api/data-adapter.js"></script>`,

  visitor: `
    <!-- Visitor Calculation Modules -->
    <script src="../assets/js/visitor/visitor-calculations.js"></script>
    <script src="../assets/js/visitor/visitor-mock-data.js"></script>
    <script src="../assets/js/api/api-client.js"></script>
    <script src="../assets/js/api/api-services.js"></script>
    <script src="../assets/js/api/data-adapter.js"></script>`,
};

// Get all pages
const pagesDir = "pages";
const allPages = fs
  .readdirSync(pagesDir)
  .filter((f) => f.endsWith(".html"))
  .map((f) => path.join(pagesDir, f));

// Categorize pages
const pagesToIntegrate = {
  booking: allPages.filter((p) => p.includes("booking")),
  checkin: allPages.filter((p) => p.includes("checkin")),
  visitor: allPages.filter((p) => p.includes("visitor")),
};

// Track results
let stats = {
  booking: { integrated: 0, skipped: 0, errors: 0 },
  checkin: { integrated: 0, skipped: 0, errors: 0 },
  visitor: { integrated: 0, skipped: 0, errors: 0 },
};

// Process each category
Object.keys(pagesToIntegrate).forEach((category) => {
  console.log(`\n📁 Processing ${category.toUpperCase()} pages...`);
  console.log("-".repeat(70));

  pagesToIntegrate[category].forEach((filePath) => {
    const fileName = path.basename(filePath);

    try {
      if (!fs.existsSync(filePath)) {
        console.log(`   ⏭️ ${fileName} - Not found`);
        stats[category].skipped++;
        return;
      }

      let content = fs.readFileSync(filePath, "utf8");

      // Check if already integrated
      if (content.includes(`${category}-calculations.js`)) {
        console.log(`   ⏭️ ${fileName} - Already integrated`);
        stats[category].skipped++;
        return;
      }

      // Find insertion point
      const headCloseIndex = content.indexOf("</head>");
      if (headCloseIndex === -1) {
        console.log(`   ❌ ${fileName} - No </head> tag`);
        stats[category].errors++;
        return;
      }

      // Insert modules
      const beforeHead = content.substring(0, headCloseIndex);
      const afterHead = content.substring(headCloseIndex);
      const newContent =
        beforeHead +
        "\n    " +
        moduleImports[category].trim() +
        "\n  " +
        afterHead;

      // Write back
      fs.writeFileSync(filePath, newContent, "utf8");

      console.log(`   ✅ ${fileName}`);
      stats[category].integrated++;
    } catch (error) {
      console.log(`   ❌ ${fileName} - Error: ${error.message}`);
      stats[category].errors++;
    }
  });
});

// Summary
console.log("\n" + "=".repeat(70));
console.log("📊 INTEGRATION SUMMARY");
console.log("=".repeat(70));

let totalIntegrated = 0;
let totalSkipped = 0;
let totalErrors = 0;

Object.keys(stats).forEach((category) => {
  const s = stats[category];
  totalIntegrated += s.integrated;
  totalSkipped += s.skipped;
  totalErrors += s.errors;

  console.log(`\n${category.toUpperCase()}:`);
  console.log(`   ✅ Integrated: ${s.integrated}`);
  console.log(`   ⏭️ Skipped: ${s.skipped}`);
  console.log(`   ❌ Errors: ${s.errors}`);
});

console.log(`\n${"=".repeat(70)}`);
console.log(`✅ Total Integrated: ${totalIntegrated} pages`);
console.log(`⏭️ Total Skipped: ${totalSkipped} pages`);
console.log(`❌ Total Errors: ${totalErrors} pages`);
console.log(
  `📊 Total Processed: ${totalIntegrated + totalSkipped + totalErrors} pages`
);

// Calculate new totals
const previouslyIntegrated = 22; // Revenue (14) + Booking (2) + Checkin (2) + Visitor (4)
const newlyIntegrated = totalIntegrated;
const grandTotal = previouslyIntegrated + newlyIntegrated;

console.log(`\n📈 OVERALL PROGRESS:`);
console.log(`   Previously integrated: ${previouslyIntegrated} pages`);
console.log(`   Newly integrated: ${newlyIntegrated} pages`);
console.log(`   Grand Total: ${grandTotal}/42 pages`);
console.log(`   Progress: ${((grandTotal / 42) * 100).toFixed(1)}%`);

console.log("\n✨ Integration completed! 🚀\n");
