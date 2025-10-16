// check-duplicate-fix.js
// Script to check if duplicate issue is fixed

const fs = require("fs");

function checkDuplicateFix() {
  console.log("🔍 Checking Duplicate Fix...");

  try {
    const content = fs.readFileSync(
      "pages/03-03-01-04-daily-revenue-today-detail.html",
      "utf8"
    );

    // Count occurrences of key elements
    const doctypeCount = (content.match(/<!DOCTYPE html>/g) || []).length;
    const htmlCount = (content.match(/<html/g) || []).length;
    const headCount = (content.match(/<head>/g) || []).length;
    const bodyCount = (content.match(/<body/g) || []).length;
    const scriptCount = (content.match(/<script/g) || []).length;
    const chartJsCount = (content.match(/chart\.js/g) || []).length;
    const bootstrapCount = (content.match(/bootstrap/g) || []).length;

    console.log("📊 Element Counts:");
    console.log(`  • DOCTYPE: ${doctypeCount}`);
    console.log(`  • HTML tags: ${htmlCount}`);
    console.log(`  • HEAD tags: ${headCount}`);
    console.log(`  • BODY tags: ${bodyCount}`);
    console.log(`  • SCRIPT tags: ${scriptCount}`);
    console.log(`  • Chart.js references: ${chartJsCount}`);
    console.log(`  • Bootstrap references: ${bootstrapCount}`);

    // Check for duplicate patterns
    const hasDuplicate =
      doctypeCount > 1 || htmlCount > 1 || headCount > 1 || bodyCount > 1;

    console.log(`\n📊 Duplicate Check:`);
    console.log(`  • Has duplicates: ${hasDuplicate ? "❌ Yes" : "✅ No"}`);

    // Check file structure
    const hasProperStructure =
      doctypeCount === 1 &&
      htmlCount === 1 &&
      headCount === 1 &&
      bodyCount === 1;
    console.log(
      `  • Proper structure: ${hasProperStructure ? "✅ Yes" : "❌ No"}`
    );

    // Check for reasonable script count (should be around 8-10)
    const reasonableScriptCount = scriptCount >= 8 && scriptCount <= 15;
    console.log(
      `  • Reasonable script count: ${
        reasonableScriptCount ? "✅ Yes" : "❌ No"
      }`
    );

    return {
      doctypeCount,
      htmlCount,
      headCount,
      bodyCount,
      scriptCount,
      chartJsCount,
      bootstrapCount,
      hasDuplicate,
      hasProperStructure,
      reasonableScriptCount,
    };
  } catch (error) {
    console.error("❌ Error checking duplicate fix:", error.message);
    return null;
  }
}

// Run the check
if (require.main === module) {
  const result = checkDuplicateFix();

  if (result) {
    console.log("\n📊 SUMMARY:");
    console.log(
      `File structure: ${
        result.hasProperStructure ? "✅ Fixed" : "❌ Still has issues"
      }`
    );
    console.log(
      `Duplicates: ${result.hasDuplicate ? "❌ Still present" : "✅ Removed"}`
    );
    console.log(
      `Script count: ${result.scriptCount} (${
        result.reasonableScriptCount ? "✅ Reasonable" : "❌ Unusual"
      })`
    );

    if (result.hasProperStructure && !result.hasDuplicate) {
      console.log("\n🎉 Duplicate issue has been successfully fixed!");
    } else {
      console.log("\n⚠️  File may still have structural issues.");
    }
  }
}

