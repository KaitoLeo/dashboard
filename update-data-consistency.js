// Script to update all detail pages to use consistent data
const fs = require("fs");
const path = require("path");

const pagesDir = "./pages";
const detailPages = [
  "visitors-detail.html",
  "trial-guests-detail.html",
  "checkin-frequency-detail.html",
  "checkin-today-detail.html",
  "checkin-yesterday-detail.html",
  "checkin-mtd-detail.html",
  "membership-checkin-detail.html",
  "membership-checkin-today-detail.html",
  "membership-checkin-mtd-detail.html",
  "pt-fitness-checkin-detail.html",
  "pt-fitness-checkin-today-detail.html",
  "pt-fitness-checkin-mtd-detail.html",
  "pilates-checkin-detail.html",
  "pilates-checkin-today-detail.html",
  "pilates-checkin-mtd-detail.html",
  "swimming-coach-checkin-detail.html",
  "swimming-coach-checkin-today-detail.html",
  "swimming-coach-checkin-mtd-detail.html",
  "late-checkin-detail.html",
  "late-checkin-today-detail.html",
  "late-checkin-mtd-detail.html",
  "manual-checkin-detail.html",
  "contract-activation-detail.html",
  "member-movement-detail.html",
  "revenue-club-detail.html",
  "revenue-service-detail.html",
  "revenue-staff-detail.html",
  "revenue-payment-detail.html",
  "revenue-target-detail.html",
  "revenue-mtd-detail.html",
  "total-revenue-mtd-detail.html",
  "growth-comparison-detail.html",
  "daily-average-detail.html",
  "remaining-days-detail.html",
  "daily-revenue-detail.html",
  "completion-rate-detail.html",
  "facility-utilization-detail.html",
  "facility-utilization-overview.html",
  "gym-occupancy-detail.html",
  "pilates-occupancy-detail.html",
  "swimming-coach-occupancy-detail.html",
  "burn-rate-detail.html",
  "crm-detail.html",
  "pt-detail.html",
  "pt-today-detail.html",
  "pt-yesterday-detail.html",
  "pt-mtd-detail.html",
  "fit-today-detail.html",
  "fit-mtd-detail.html",
  "membership-detail.html",
  "pilates-detail.html",
  "swimming-coach-detail.html",
  "fitness-detail.html",
  "club-detail.html",
  "members-list-detail.html",
  "birthday-members-detail.html",
];

function updatePage(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if data-consistency.js is already included
    if (content.includes("data-consistency.js")) {
      console.log(`✓ ${filePath} already has data-consistency.js`);
      return;
    }

    // Find the script section and add data-consistency.js
    const scriptPattern =
      /(<script src="\.\.\/assets\/js\/main\.js"><\/script>)/;
    if (scriptPattern.test(content)) {
      content = content.replace(
        scriptPattern,
        '<script src="../assets/js/data-consistency.js"></script>\n    $1'
      );
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✓ Updated ${filePath}`);
    } else {
      console.log(`⚠ Could not find main.js script in ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
}

console.log("Updating detail pages to use consistent data...\n");

detailPages.forEach((page) => {
  const filePath = path.join(pagesDir, page);
  if (fs.existsSync(filePath)) {
    updatePage(filePath);
  } else {
    console.log(`⚠ File not found: ${filePath}`);
  }
});

console.log("\nData consistency update completed!");
