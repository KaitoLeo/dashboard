// mass-integration-script.js
// Automated script to add page-initializer.js to all HTML files

const fs = require("fs");
const path = require("path");

// Configuration
const PAGES_DIR = "./pages";
const INITIALIZER_SCRIPT =
  '<script src="../assets/js/shared/page-initializer.js"></script>';
const EXCLUDE_FILES = [
  "_EXAMPLE_REFACTORED_PAGE.html",
  "universal-page-template.html",
];

// Files that already have page-initializer.js (to avoid duplicates)
const ALREADY_INTEGRATED = [
  "03-01-01-04-checkin-mtd-detail.html",
  "03-01-08-06-visitor-yesterday-detail.html",
];

function addPageInitializerToFile(filePath) {
  try {
    console.log(`📄 Processing: ${filePath}`);

    // Read file content
    let content = fs.readFileSync(filePath, "utf8");

    // Check if already has page-initializer.js
    if (content.includes("page-initializer.js")) {
      console.log(`✅ Already has page-initializer.js: ${filePath}`);
      return { status: "already_exists", file: filePath };
    }

    // Find the best insertion point (before closing </body> tag)
    const bodyCloseIndex = content.lastIndexOf("</body>");
    if (bodyCloseIndex === -1) {
      console.log(`⚠️ No </body> tag found: ${filePath}`);
      return { status: "no_body_tag", file: filePath };
    }

    // Insert the script before </body>
    const beforeBody = content.substring(0, bodyCloseIndex);
    const afterBody = content.substring(bodyCloseIndex);

    const newContent =
      beforeBody +
      "\n    <!-- Universal Page Initializer -->\n    " +
      INITIALIZER_SCRIPT +
      "\n  " +
      afterBody;

    // Write back to file
    fs.writeFileSync(filePath, newContent, "utf8");

    console.log(`✅ Added page-initializer.js to: ${filePath}`);
    return { status: "success", file: filePath };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { status: "error", file: filePath, error: error.message };
  }
}

function scanAndIntegrate() {
  console.log("🚀 Starting Mass Integration...");
  console.log(`📁 Scanning directory: ${PAGES_DIR}`);

  const results = {
    success: [],
    already_exists: [],
    no_body_tag: [],
    error: [],
    total: 0,
  };

  try {
    // Get all HTML files
    const files = fs
      .readdirSync(PAGES_DIR)
      .filter((file) => file.endsWith(".html"))
      .filter((file) => !EXCLUDE_FILES.includes(file))
      .sort();

    results.total = files.length;
    console.log(`📊 Found ${files.length} HTML files to process`);

    // Process each file
    files.forEach((file) => {
      const filePath = path.join(PAGES_DIR, file);
      const result = addPageInitializerToFile(filePath);
      results[result.status].push(result);
    });

    // Print summary
    console.log("\n📊 INTEGRATION SUMMARY:");
    console.log(`✅ Successfully integrated: ${results.success.length}`);
    console.log(`ℹ️ Already had initializer: ${results.already_exists.length}`);
    console.log(`⚠️ No </body> tag: ${results.no_body_tag.length}`);
    console.log(`❌ Errors: ${results.error.length}`);
    console.log(`📊 Total processed: ${results.total}`);

    // List files that need manual attention
    if (results.no_body_tag.length > 0) {
      console.log("\n⚠️ Files without </body> tag (need manual attention):");
      results.no_body_tag.forEach((result) =>
        console.log(`  - ${result.file}`)
      );
    }

    if (results.error.length > 0) {
      console.log("\n❌ Files with errors:");
      results.error.forEach((result) =>
        console.log(`  - ${result.file}: ${result.error}`)
      );
    }

    console.log("\n🎉 Mass Integration Complete!");
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
  }
}

// Run the integration
if (require.main === module) {
  scanAndIntegrate();
}

module.exports = { addPageInitializerToFile, scanAndIntegrate };

