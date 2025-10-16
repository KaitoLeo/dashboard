// Script to make all metric cards clickable
const fs = require("fs");
const path = require("path");

// Read the index.html file
const indexPath = path.join(__dirname, "index.html");
let content = fs.readFileSync(indexPath, "utf8");

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
      `<div class="card$1"$2 onclick="window.location.href='pages/${detailPage}'" style="cursor: pointer">`
    );
}

// Patterns to match different types of cards
const cardPatterns = [
  // Revenue cards
  {
    pattern:
      /<div class="card bg-primary text-white[^>]*>[\s\S]*?Doanh thu[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "revenue-mtd-detail.html",
  },
  {
    pattern:
      /<div class="card bg-success text-white[^>]*>[\s\S]*?Doanh thu[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "revenue-mtd-detail.html",
  },
  {
    pattern:
      /<div class="card bg-info text-white[^>]*>[\s\S]*?Doanh thu[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "daily-revenue-detail.html",
  },
  {
    pattern:
      /<div class="card bg-warning text-white[^>]*>[\s\S]*?Tỉ lệ[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "completion-rate-detail.html",
  },

  // Check-in cards
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Check-in[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "checkin-today-detail.html",
  },

  // PT Sessions cards
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?PT[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "pt-detail.html",
  },
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Fit shows[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "pt-detail.html",
  },

  // Customer cards
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Khách[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "visitors-detail.html",
  },

  // Contract cards
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Hợp đồng[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "contract-member-detail.html",
  },
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Thành viên[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "contract-member-detail.html",
  },

  // Report cards
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Báo cáo[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "generic-detail.html",
  },
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?CSR[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "csr-reports.html",
  },
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Audit[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "audit-reports.html",
  },
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Biên nhận[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "receipt-reports.html",
  },
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?CRM[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "crm-detail.html",
  },

  // Auto report cards
  {
    pattern:
      /<div class="card bg-light[^>]*>[\s\S]*?Auto[^<]*<\/h6>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
    page: "auto-daily-report.html",
  },
];

// Apply patterns to make cards clickable
cardPatterns.forEach(({ pattern, page }) => {
  content = content.replace(pattern, (match) => {
    return makeCardClickable(match, page);
  });
});

// Write the updated content back to the file
fs.writeFileSync(indexPath, content, "utf8");

console.log("All metric cards have been made clickable!");

