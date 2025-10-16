/**
 * Navigation Initialization
 * Khởi tạo breadcrumb và cập nhật navigation cho metric cards
 */
window.App = window.App || {};
window.App.controllers = window.App.controllers || {};

document.addEventListener("DOMContentLoaded", function () {
  // Initialize breadcrumb
  const breadcrumb = new HeaderBreadcrumbs("breadcrumb-container");

  // Initialize URL builder
  const urlBuilder = new URLBuilder();

  // Update metric cards with new navigation
  updateMetricCardsNavigation();

  // Setup global navigation handlers
  setupGlobalNavigation();
});

/**
 * Update metric cards with new navigation system
 */
function updateMetricCardsNavigation() {
  // Check-in cards
  updateCheckinCards();

  // Member cards
  updateMemberCards();

  // Other metric cards
  updateOtherCards();
}

/**
 * Update check-in related cards
 */
function updateCheckinCards() {
  // Check-in hôm qua
  const yesterdayCard = document.querySelector(
    '[data-metric="checkinYesterday"]'
  );
  if (yesterdayCard) {
    yesterdayCard.setAttribute(
      "data-navigate",
      "checkin/frequency/checkin-hom-qua.html"
    );
    yesterdayCard.classList.add("clickable-card");
  }

  // Check-in hôm nay
  const todayCard = document.querySelector('[data-metric="checkinToday"]');
  if (todayCard) {
    todayCard.setAttribute(
      "data-navigate",
      "checkin/frequency/checkin-hom-nay.html"
    );
    todayCard.classList.add("clickable-card");
  }

  // Check-in MTD
  const mtdCard = document.querySelector('[data-metric="checkinMTD"]');
  if (mtdCard) {
    mtdCard.setAttribute("data-navigate", "checkin/mtd/checkin-thang-nay.html");
    mtdCard.classList.add("clickable-card");
  }

  // Tỷ lệ check-in
  const rateCard = document.querySelector('[data-metric="checkinRate"]');
  if (rateCard) {
    rateCard.setAttribute(
      "data-navigate",
      "checkin/frequency/checkin-hom-nay.html"
    );
    rateCard.classList.add("clickable-card");
  }

  // Phân tích tần suất
  const frequencyCard = document.querySelector(
    '[data-metric="frequencyAnalysis"]'
  );
  if (frequencyCard) {
    frequencyCard.setAttribute(
      "data-navigate",
      "checkin/frequency/checkin-hom-nay.html"
    );
    frequencyCard.classList.add("clickable-card");
  }

  // Tổng hội viên
  const totalMembersCard = document.querySelector(
    '[data-metric="totalMembers"]'
  );
  if (totalMembersCard) {
    totalMembersCard.setAttribute(
      "data-navigate",
      "members/list/danh-sach-hoi-vien.html"
    );
    totalMembersCard.classList.add("clickable-card");
  }
}

/**
 * Update member related cards
 */
function updateMemberCards() {
  // This will be implemented when member cards are added
}

/**
 * Update other metric cards
 */
function updateOtherCards() {
  // Revenue cards, etc.
}

/**
 * Setup global navigation handlers
 */
function setupGlobalNavigation() {
  // Handle all navigation clicks
  document.addEventListener("click", function (e) {
    const navElement = e.target.closest("[data-navigate]");
    if (navElement) {
      e.preventDefault();
      const targetPath = navElement.getAttribute("data-navigate");

      // Preserve query parameters
      const currentQuery = window.location.search;
      const newUrl = `${window.location.origin}/${targetPath}${currentQuery}`;

      // Navigate using router
      if (window.URLRouter) {
        const router = new URLRouter();
        router.navigateTo(targetPath, true);
      } else {
        // Fallback to direct navigation
        window.location.href = newUrl;
      }
    }
  });

  // Handle back button clicks
  document.addEventListener("click", function (e) {
    const backElement = e.target.closest("[data-go-back]");
    if (backElement) {
      e.preventDefault();

      if (window.URLRouter) {
        const router = new URLRouter();
        router.goBack();
      } else {
        window.history.back();
      }
    }
  });
}

/**
 * Update page title and meta tags based on current route
 */
function updatePageMeta() {
  const currentPath = window.location.pathname;
  const pathParts = currentPath
    .split("/")
    .filter((part) => part && part !== "index.html");

  if (pathParts.length === 0) {
    // Home page
    document.title = "Actiwell Report System - Dashboard";
    return;
  }

  // Find page data in mapping
  const urlBuilder = new URLBuilder();
  const pageData = urlBuilder.getPageMapping(pathParts[pathParts.length - 1]);

  if (pageData) {
    const metaTags = urlBuilder.generateMetaTags(pageData);
    document.title = metaTags.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = metaTags.description;

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = metaTags.canonical;
  }
}

// Initialize page meta on load
document.addEventListener("DOMContentLoaded", updatePageMeta);

// Update meta on navigation
window.addEventListener("popstate", updatePageMeta);

window.App.controllers.navigation = {
  updateMetricCardsNavigation,
  setupGlobalNavigation,
  updateBreadcrumb,
  updatePageMeta,
};
