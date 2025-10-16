// Script to add IDs to all detail pages for filter integration
const fs = require("fs");
const path = require("path");

const pagesDir = "./pages";
const detailPages = [
  "checkin-today-detail.html",
  "checkin-mtd-detail.html",
  "visitors-detail.html",
  "trial-guests-detail.html",
  "pt-detail.html",
  "member-movement-detail.html",
  "checkin-frequency-detail.html",
  "facility-utilization-detail.html",
  "burn-rate-detail.html",
];

// Function to add IDs to metric cards
function addMetricIds(content) {
  // Add ID to main metric values in cards
  content = content.replace(
    /<h3[^>]*class="[^"]*mb-0[^"]*"[^>]*>([^<]+)<\/h3>/g,
    (match, value) => {
      if (match.includes("id=")) return match; // Already has ID

      // Determine ID based on context
      let id = "";
      if (value.includes("%")) id = "percentageValue";
      else if (value.includes("VNĐ") || value.includes(","))
        id = "revenueValue";
      else if (value.includes("ngày")) id = "daysValue";
      else if (value.includes("lượt") || value.includes("buổi"))
        id = "countValue";
      else id = "metricValue";

      return match.replace("<h3", `<h3 id="${id}"`);
    }
  );

  return content;
}

detailPages.forEach((pageName) => {
  const filePath = path.join(pagesDir, pageName);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    // Add IDs to metric cards
    content = addMetricIds(content);

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated IDs in ${pageName}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log("ID update complete!");


