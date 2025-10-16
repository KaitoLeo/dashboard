// Script to apply TimeLabelVi.capitalize() to all time labels
const fs = require("fs");
const path = require("path");

// Files to process
const files = [
  "assets/js/main.js",
  "assets/js/filter-handler.js",
  "assets/js/charts.js",
  "assets/js/navigation-init.js",
  "assets/js/router/url-mapping.js",
];

// Time label patterns to replace
const timePatterns = [
  { pattern: /"hôm nay"/g, replacement: 'TimeLabelVi.capitalize("hôm nay")' },
  { pattern: /"hôm qua"/g, replacement: 'TimeLabelVi.capitalize("hôm qua")' },
  {
    pattern: /"tháng này"/g,
    replacement: 'TimeLabelVi.capitalize("tháng này")',
  },
  {
    pattern: /"tháng trước"/g,
    replacement: 'TimeLabelVi.capitalize("tháng trước")',
  },
  { pattern: /"năm nay"/g, replacement: 'TimeLabelVi.capitalize("năm nay")' },
  {
    pattern: /"năm trước"/g,
    replacement: 'TimeLabelVi.capitalize("năm trước")',
  },
  { pattern: /"tuần này"/g, replacement: 'TimeLabelVi.capitalize("tuần này")' },
  {
    pattern: /"tuần trước"/g,
    replacement: 'TimeLabelVi.capitalize("tuần trước")',
  },
  { pattern: /'hôm nay'/g, replacement: "TimeLabelVi.capitalize('hôm nay')" },
  { pattern: /'hôm qua'/g, replacement: "TimeLabelVi.capitalize('hôm qua')" },
  {
    pattern: /'tháng này'/g,
    replacement: "TimeLabelVi.capitalize('tháng này')",
  },
  {
    pattern: /'tháng trước'/g,
    replacement: "TimeLabelVi.capitalize('tháng trước')",
  },
  { pattern: /'năm nay'/g, replacement: "TimeLabelVi.capitalize('năm nay')" },
  {
    pattern: /'năm trước'/g,
    replacement: "TimeLabelVi.capitalize('năm trước')",
  },
  { pattern: /'tuần này'/g, replacement: "TimeLabelVi.capitalize('tuần này')" },
  {
    pattern: /'tuần trước'/g,
    replacement: "TimeLabelVi.capitalize('tuần trước')",
  },
];

// Process each file
files.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    timePatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated: ${filePath}`);
    }
  }
});

console.log("Time label updates completed!");

