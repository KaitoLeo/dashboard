// Script to update all sub-detail pages with filter integration
const fs = require("fs");
const path = require("path");

const pagesDir = "./pages";
const subDetailPages = [
  "growth-comparison-detail.html",
  "daily-average-detail.html",
  "remaining-days-detail.html",
];

const filterScript = `
    <!-- Filter Integration Script -->
    <script src="../assets/js/main.js"></script>
    <script src="../assets/js/filter-handler.js"></script>`;

subDetailPages.forEach((pageName) => {
  const filePath = path.join(pagesDir, pageName);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if filter script already exists
    if (!content.includes("filter-handler.js")) {
      // Find the closing </script> and </body> tags
      const scriptEndPattern = /<\/script>\s*<\/body>\s*<\/html>/;

      if (scriptEndPattern.test(content)) {
        // Insert filter script before closing body tag
        content = content.replace(
          scriptEndPattern,
          `</script>${filterScript}\n  </body>\n</html>`
        );

        fs.writeFileSync(filePath, content, "utf8");
        console.log(`Updated ${pageName}`);
      } else {
        console.log(`Could not find insertion point in ${pageName}`);
      }
    } else {
      console.log(`${pageName} already has filter script`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log("Update complete!");

