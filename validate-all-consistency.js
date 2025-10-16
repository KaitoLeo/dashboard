#!/usr/bin/env node
// validate-all-consistency.js
// Comprehensive validation script for data consistency
// Run this before commits or deployments

const fs = require("fs");
const path = require("path");
const chalk = require("chalk"); // Optional: npm install chalk for colored output

// Validation rules based on TODO.md
const VALIDATION_RULES = {
  // Time labels must be capitalized correctly
  timeLabelCapitalization: {
    name: "Time Label Capitalization",
    pattern:
      /(?:hôm nay|hôm qua|tháng này|tháng trước|năm nay|năm trước|tuần này|tuần trước)/gi,
    correct: [
      "Hôm nay",
      "Hôm qua",
      "Tháng này",
      "Tháng trước",
      "Năm nay",
      "Năm trước",
      "Tuần này",
      "Tuần trước",
    ],
    errorMessage: "Time label not properly capitalized",
  },

  // Service order must follow: Membership → PT Fitness → Pilates → Swimming Coach
  serviceOrder: {
    name: "Service Order",
    services: ["Membership", "PT Fitness", "Pilates", "Swimming Coach"],
    errorMessage: "Services not in correct order",
  },

  // Total must equal sum of services
  totalEqualsSum: {
    name: "Total Equals Service Sum",
    errorMessage: "Total value does not match sum of services",
  },

  // No hardcoded data in components
  noHardcodedData: {
    name: "No Hardcoded Data",
    patterns: [
      /const\s+\w+\s*=\s*\d+\s*;.*(?:visitors|checkin|booking|revenue)/i,
      /let\s+\w+\s*=\s*\d+\s*;.*(?:visitors|checkin|booking|revenue)/i,
    ],
    whitelist: [
      "data-consistency.js",
      "sample-data.js",
      "mock-data.js",
      "test",
    ],
    errorMessage: "Hardcoded data found - should use ConsistentData",
  },
};

// Color helpers (fallback if chalk not available)
const colors = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

// Results tracker
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
  warnings: [],
};

// Main validation function
async function validateAll() {
  console.log(
    colors.cyan("🔍 Starting Comprehensive Data Consistency Validation...\n")
  );

  // 1. Validate HTML pages
  console.log(colors.blue("📄 Validating HTML pages..."));
  await validateHTMLPages();

  // 2. Validate JavaScript files
  console.log(colors.blue("\n📜 Validating JavaScript files..."));
  await validateJavaScriptFiles();

  // 3. Check utilities are loaded
  console.log(colors.blue("\n🔧 Checking utility files..."));
  await checkUtilityFiles();

  // 4. Run automated tests
  console.log(colors.blue("\n🧪 Running automated tests..."));
  await runAutomatedTests();

  // 5. Check for duplicate utilities
  console.log(colors.blue("\n🔍 Checking for duplicate utilities..."));
  await checkDuplicates();

  // Print summary
  printSummary();

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Validate HTML pages
async function validateHTMLPages() {
  const pagesDir = "./pages";
  const files = fs
    .readdirSync(pagesDir)
    .filter((f) => f.endsWith(".html"))
    .filter(
      (f) =>
        ![
          "_EXAMPLE_REFACTORED_PAGE.html",
          "universal-page-template.html",
        ].includes(f)
    );

  results.total += files.length;

  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    // Check time label capitalization
    const timeLabelIssues = checkTimeLabelCapitalization(content, file);
    if (timeLabelIssues.length > 0) {
      results.failed++;
      results.errors.push({
        file,
        rule: "Time Label Capitalization",
        issues: timeLabelIssues,
      });
    } else {
      results.passed++;
    }

    // Check if utility files are loaded
    if (
      !content.includes("time-label-vi.js") &&
      !content.includes("service-order.js")
    ) {
      results.warnings++;
      results.warnings.push({
        file,
        message:
          "Missing utility file imports (time-label-vi.js or service-order.js)",
      });
    }
  }

  console.log(
    `  ✅ Validated ${files.length} HTML files: ${colors.green(
      results.passed + " passed"
    )}, ${colors.red(results.failed + " failed")}`
  );
}

// Check time label capitalization
function checkTimeLabelCapitalization(content, file) {
  const issues = [];
  const pattern =
    /(?:hôm nay|hôm qua|tháng này|tháng trước|năm nay|năm trước|tuần này|tuần trước)/gi;
  const correctLabels = [
    "Hôm nay",
    "Hôm qua",
    "Tháng này",
    "Tháng trước",
    "Năm nay",
    "Năm trước",
    "Tuần này",
    "Tuần trước",
  ];

  let match;
  while ((match = pattern.exec(content)) !== null) {
    const found = match[0];
    const normalized =
      found.charAt(0).toUpperCase() + found.slice(1).toLowerCase();

    if (!correctLabels.includes(found)) {
      // Check if it's in a comment or script tag
      const context = content.substring(
        Math.max(0, match.index - 50),
        Math.min(content.length, match.index + 50)
      );

      if (!context.includes("<!--") && !context.includes("<script")) {
        issues.push({
          found,
          expected: normalized,
          position: match.index,
          context: context.trim(),
        });
      }
    }
  }

  return issues;
}

// Validate JavaScript files
async function validateJavaScriptFiles() {
  const jsFiles = [
    "assets/js/data-consistency.js",
    "assets/js/common/time-label-vi.js",
    "assets/js/common/service-order.js",
    "assets/js/shared/data-consistency-checker.js",
  ];

  for (const file of jsFiles) {
    if (fs.existsSync(file)) {
      console.log(colors.green(`  ✅ ${file} exists`));
      results.passed++;
    } else {
      console.log(colors.red(`  ❌ ${file} missing`));
      results.failed++;
      results.errors.push({
        file,
        rule: "File Existence",
        message: "Required utility file is missing",
      });
    }
    results.total++;
  }
}

// Check utility files
async function checkUtilityFiles() {
  const indexPath = "./index.html";
  if (!fs.existsSync(indexPath)) {
    console.log(colors.red("  ❌ index.html not found"));
    results.failed++;
    results.total++;
    return;
  }

  const content = fs.readFileSync(indexPath, "utf8");
  const requiredUtilities = [
    "time-label-vi.js",
    "service-order.js",
    "data-consistency.js",
  ];

  for (const utility of requiredUtilities) {
    if (content.includes(utility)) {
      console.log(colors.green(`  ✅ ${utility} loaded in index.html`));
      results.passed++;
    } else {
      console.log(colors.red(`  ❌ ${utility} not loaded in index.html`));
      results.failed++;
      results.errors.push({
        file: "index.html",
        rule: "Utility Loading",
        message: `${utility} is not loaded`,
      });
    }
    results.total++;
  }
}

// Run automated tests
async function runAutomatedTests() {
  const tests = [
    {
      name: "verify-data-consistency.js",
      description: "Booking yesterday consistency",
    },
    {
      name: "check-booking-consistency.js",
      description: "Main vs detail page consistency",
    },
  ];

  for (const test of tests) {
    try {
      const { execSync } = require("child_process");
      const output = execSync(`node ${test.name}`, {
        encoding: "utf8",
        stdio: "pipe",
      });

      if (output.includes("✅")) {
        console.log(colors.green(`  ✅ ${test.name}: ${test.description}`));
        results.passed++;
      } else {
        console.log(colors.red(`  ❌ ${test.name}: ${test.description}`));
        results.failed++;
        results.errors.push({
          test: test.name,
          rule: "Automated Test",
          output: output.substring(0, 200),
        });
      }
    } catch (error) {
      console.log(colors.red(`  ❌ ${test.name}: Failed to run`));
      results.failed++;
      results.errors.push({
        test: test.name,
        rule: "Automated Test",
        error: error.message,
      });
    }
    results.total++;
  }
}

// Check for duplicate utilities
async function checkDuplicates() {
  const filesToCheck = [
    { path: "assets/js/common/time-label-vi.js", type: "TimeLabelVi" },
    {
      path: "assets/js/app/utils/common/time-label-vi.js",
      type: "TimeLabelVi",
    },
    { path: "assets/js/common/service-order.js", type: "ServiceOrder" },
    {
      path: "assets/js/app/utils/common/service-order.js",
      type: "ServiceOrder",
    },
    { path: "assets/js/shared/service-order.js", type: "ServiceOrder" },
  ];

  const found = {};
  for (const file of filesToCheck) {
    if (fs.existsSync(file.path)) {
      if (!found[file.type]) {
        found[file.type] = [];
      }
      found[file.type].push(file.path);
    }
  }

  for (const [type, paths] of Object.entries(found)) {
    if (paths.length > 1) {
      console.log(
        colors.yellow(`  ⚠️  Multiple ${type} files found: ${paths.length}`)
      );
      paths.forEach((p) => console.log(`      - ${p}`));
      results.warnings++;
      results.warnings.push({
        type: "Duplicate Utilities",
        utility: type,
        paths: paths,
        message: "Consider consolidating to single file",
      });
    } else {
      console.log(colors.green(`  ✅ Single ${type} file: ${paths[0]}`));
      results.passed++;
    }
    results.total++;
  }
}

// Print summary
function printSummary() {
  console.log(colors.cyan("\n" + "=".repeat(80)));
  console.log(colors.cyan("📊 VALIDATION SUMMARY"));
  console.log(colors.cyan("=".repeat(80)));

  console.log(`\n📈 Statistics:`);
  console.log(`  Total checks: ${results.total}`);
  console.log(colors.green(`  ✅ Passed: ${results.passed}`));
  console.log(colors.red(`  ❌ Failed: ${results.failed}`));
  console.log(colors.yellow(`  ⚠️  Warnings: ${results.warnings.length}`));

  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`  Pass rate: ${passRate}%`);

  if (results.failed > 0) {
    console.log(colors.red("\n❌ ERRORS:"));
    results.errors.slice(0, 10).forEach((error, i) => {
      console.log(colors.red(`\n${i + 1}. ${error.file || error.test}`));
      console.log(`   Rule: ${error.rule}`);
      if (error.issues) {
        error.issues.slice(0, 3).forEach((issue) => {
          console.log(
            `   - Found: "${issue.found}" (expected: "${issue.expected}")`
          );
        });
        if (error.issues.length > 3) {
          console.log(`   ... and ${error.issues.length - 3} more issues`);
        }
      } else if (error.message) {
        console.log(`   ${error.message}`);
      }
    });
    if (results.errors.length > 10) {
      console.log(
        colors.red(`\n... and ${results.errors.length - 10} more errors`)
      );
    }
  }

  if (results.warnings.length > 0) {
    console.log(colors.yellow("\n⚠️  WARNINGS:"));
    results.warnings.slice(0, 5).forEach((warning, i) => {
      console.log(colors.yellow(`\n${i + 1}. ${warning.file || warning.type}`));
      console.log(`   ${warning.message}`);
      if (warning.paths) {
        warning.paths.forEach((p) => console.log(`   - ${p}`));
      }
    });
    if (results.warnings.length > 5) {
      console.log(
        colors.yellow(`\n... and ${results.warnings.length - 5} more warnings`)
      );
    }
  }

  console.log(colors.cyan("\n" + "=".repeat(80)));

  if (results.failed === 0) {
    console.log(colors.green("\n🎉 All validations passed!"));
    console.log(
      colors.green("✅ Data consistency is maintained across the project.\n")
    );
  } else {
    console.log(colors.red("\n❌ Validation failed!"));
    console.log(
      colors.red(`Please fix ${results.failed} error(s) before proceeding.\n`)
    );
  }
}

// Run if called directly
if (require.main === module) {
  validateAll().catch((error) => {
    console.error(colors.red("Fatal error:"), error);
    process.exit(1);
  });
}

module.exports = { validateAll, checkTimeLabelCapitalization };
