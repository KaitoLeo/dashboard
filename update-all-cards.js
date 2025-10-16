// Script to make all metric cards clickable in all detail pages
const fs = require("fs");
const path = require("path");

// Get all HTML files in pages directory
const pagesDir = path.join(__dirname, "pages");
const files = fs.readdirSync(pagesDir).filter((file) => file.endsWith(".html"));

// Function to add clickable functionality to a card
function makeCardClickable(cardHtml, detailPage = "generic-detail.html") {
  // Check if card already has onclick
  if (cardHtml.includes("onclick=")) {
    return cardHtml;
  }

  // Add clickable classes and onclick
  return cardHtml
    .replace(/class="card([^"]*)"/g, 'class="card$1 clickable-card"')
    .replace(
      /<div class="card([^"]*)"([^>]*)>/g,
      `<div class="card$1"$2 onclick="showDetail('${detailPage}')" style="cursor: pointer">`
    );
}

// Function to add CSS and JavaScript to a file
function addClickableSupport(content) {
  // Add CSS if not exists
  if (!content.includes(".clickable-card")) {
    content = content.replace(
      /<link href="\.\.\/assets\/css\/style\.css" rel="stylesheet" \/>/,
      `<link href="../assets/css/style.css" rel="stylesheet" />
    <style>
      .clickable-card {
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .clickable-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }
    </style>`
    );
  }

  // Add JavaScript function if not exists
  if (!content.includes("function showDetail")) {
    content = content.replace(
      /<\/script>\s*<\/body>\s*<\/html>/,
      `      // Function for clickable metric cards
      function showDetail(detailType) {
        alert('Chi tiết ' + detailType + ' đang được phát triển!');
      }
    </script>
  </body>
</html>`
    );
  }

  return content;
}

// Process each file
files.forEach((file) => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Skip if file is index.html or auto-daily-report.html
  if (file === "index.html" || file === "auto-daily-report.html") {
    return;
  }

  // Add clickable support
  content = addClickableSupport(content);

  // Find and update metric cards
  const cardPattern =
    /<div class="card bg-(primary|success|info|warning|danger|secondary|dark|light) text-white[^>]*>[\s\S]*?<h6[^>]*>[^<]*<\/h6>[\s\S]*?<h3[^>]*>[^<]*<\/h3>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;

  content = content.replace(cardPattern, (match) => {
    return makeCardClickable(match, "chi tiết");
  });

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, "utf8");

  console.log(`Updated ${file}`);
});

console.log("All metric cards in detail pages have been made clickable!");

