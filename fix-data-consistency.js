// fix-data-consistency.js
// Script to automatically fix data consistency issues across all pages

const fs = require("fs");
const path = require("path");

const PAGES_DIR = "./pages";
const EXCLUDE_FILES = [
  "_EXAMPLE_REFACTORED_PAGE.html",
  "universal-page-template.html",
  "test-integration.html",
  "comprehensive-test.html",
  "verify-links.html",
];

// Common data consistency patterns to fix
const CONSISTENCY_FIXES = [
  {
    // Pattern: Total should equal sum of services
    pattern: /<h6>(Tổng|Total).*?<\/h6>\s*<h[1-6]>(\d+)<\/h[1-6]>/gi,
    services: [
      /<h6>(PT Fitness|Membership|Pilates|Swimming Coach|Gym|Yoga|Aerobic).*?<\/h6>\s*<h[1-6]>(\d+)<\/h[1-6]>/gi,
    ],
    fix: function (match, totalText, totalValue, content) {
      // Extract service values
      const serviceValues = [];
      let serviceMatch;

      // Reset regex
      this.services[0].lastIndex = 0;
      while ((serviceMatch = this.services[0].exec(content)) !== null) {
        const value = parseInt(serviceMatch[2]);
        if (!isNaN(value)) {
          serviceValues.push(value);
        }
      }

      const serviceSum = serviceValues.reduce((sum, val) => sum + val, 0);
      const currentTotal = parseInt(totalValue);

      if (currentTotal !== serviceSum && serviceSum > 0) {
        console.log(
          `  📊 Fixing consistency: ${currentTotal} → ${serviceSum} (services: ${serviceValues.join(
            "+"
          )})`
        );
        return match.replace(totalValue, serviceSum.toString());
      }

      return match;
    },
  },
];

function scanAndFixFile(filePath) {
  try {
    console.log(`📄 Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, "utf8");
    let hasChanges = false;
    let changesCount = 0;

    // Apply each consistency fix
    CONSISTENCY_FIXES.forEach((fix) => {
      let match;
      fix.pattern.lastIndex = 0; // Reset regex

      while ((match = fix.pattern.exec(content)) !== null) {
        const fixedMatch = fix.fix(match[0], match[1], match[2], content);

        if (fixedMatch !== match[0]) {
          content = content.replace(match[0], fixedMatch);
          hasChanges = true;
          changesCount++;
        }
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`  ✅ Fixed ${changesCount} consistency issues`);
      return { status: "fixed", file: filePath, changes: changesCount };
    } else {
      console.log(`  ✅ No consistency issues found`);
      return { status: "clean", file: filePath, changes: 0 };
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { status: "error", file: filePath, error: error.message };
  }
}

function scanAndFixAllPages() {
  console.log("🔍 Starting Data Consistency Fix...");
  console.log(`📁 Scanning directory: ${PAGES_DIR}`);

  const results = {
    fixed: [],
    clean: [],
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
      const result = scanAndFixFile(filePath);
      results[result.status].push(result);
    });

    // Print summary
    console.log("\n📊 CONSISTENCY FIX SUMMARY:");
    console.log(`✅ Files fixed: ${results.fixed.length}`);
    console.log(`✅ Files clean: ${results.clean.length}`);
    console.log(`❌ Errors: ${results.error.length}`);
    console.log(`📊 Total processed: ${results.total}`);

    // Show total changes
    const totalChanges = results.fixed.reduce(
      (sum, result) => sum + result.changes,
      0
    );
    console.log(`🔧 Total consistency fixes applied: ${totalChanges}`);

    // List files that were fixed
    if (results.fixed.length > 0) {
      console.log("\n✅ Files with fixes applied:");
      results.fixed.forEach((result) => {
        console.log(`  - ${result.file}: ${result.changes} fixes`);
      });
    }

    // List files with errors
    if (results.error.length > 0) {
      console.log("\n❌ Files with errors:");
      results.error.forEach((result) => {
        console.log(`  - ${result.file}: ${result.error}`);
      });
    }

    console.log("\n🎉 Data Consistency Fix Complete!");

    if (totalChanges > 0) {
      console.log("\n💡 Next Steps:");
      console.log("  1. Test the fixed pages in browser");
      console.log("  2. Verify all totals match service sums");
      console.log("  3. Check that percentages are recalculated correctly");
      console.log("  4. Run DataConsistencyChecker on each page");
    }
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
  }
}

// Manual consistency check function
function manualConsistencyCheck(filePath) {
  console.log(`🔍 Manual consistency check for: ${filePath}`);

  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Extract total value
    const totalMatch = content.match(
      /<h6>(Tổng|Total).*?<\/h6>\s*<h[1-6]>(\d+)<\/h[1-6]>/i
    );
    if (!totalMatch) {
      console.log("  ⚠️ No total metric found");
      return;
    }

    const totalValue = parseInt(totalMatch[2]);
    console.log(`  📊 Total value: ${totalValue}`);

    // Extract service values
    const serviceMatches = content.match(
      /<h6>(PT Fitness|Membership|Pilates|Swimming Coach|Gym|Yoga|Aerobic).*?<\/h6>\s*<h[1-6]>(\d+)<\/h[1-6]>/gi
    );
    if (!serviceMatches) {
      console.log("  ⚠️ No service metrics found");
      return;
    }

    const serviceValues = serviceMatches.map((match) => {
      const valueMatch = match.match(/<h[1-6]>(\d+)<\/h[1-6]>/);
      return valueMatch ? parseInt(valueMatch[1]) : 0;
    });

    const serviceSum = serviceValues.reduce((sum, val) => sum + val, 0);

    console.log(`  📊 Service values: ${serviceValues.join(", ")}`);
    console.log(`  📊 Service sum: ${serviceSum}`);
    console.log(`  📊 Difference: ${totalValue - serviceSum}`);

    if (totalValue === serviceSum) {
      console.log("  ✅ Data is consistent!");
    } else {
      console.log("  ❌ Data inconsistency detected!");
    }
  } catch (error) {
    console.error(`❌ Error checking ${filePath}:`, error.message);
  }
}

// Export functions for use as module
module.exports = {
  scanAndFixAllPages,
  scanAndFixFile,
  manualConsistencyCheck,
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length > 0 && args[0] === "check") {
    // Manual check mode
    const filePath = args[1];
    if (filePath) {
      manualConsistencyCheck(filePath);
    } else {
      console.log("Usage: node fix-data-consistency.js check <file-path>");
    }
  } else {
    // Full fix mode
    scanAndFixAllPages();
  }
}

