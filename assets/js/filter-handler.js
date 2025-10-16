// Filter Handler for Detail Pages
// This script handles filter integration for all detail pages

// Get filter parameters from URL
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    location: urlParams.get("location") || "all",
    department: urlParams.get("department") || "all",
    startDate: urlParams.get("startDate") || "",
    endDate: urlParams.get("endDate") || "",
  };
}

// Apply filters to any detail page
function applyFiltersToDetailPage() {
  const filters = getUrlParams();
  console.log("Applying filters to detail page:", filters);

  // Initialize currentFilters if not defined
  if (typeof currentFilters === "undefined") {
    window.currentFilters = {
      location: filters.location,
      department: filters.department,
      startDate: filters.startDate,
      endDate: filters.endDate,
      timeRange: "month",
    };
    console.log("Initialized currentFilters:", window.currentFilters);
  } else {
    // Update currentFilters if main.js is loaded
    currentFilters.location = filters.location;
    currentFilters.department = filters.department;
    currentFilters.startDate = filters.startDate;
    currentFilters.endDate = filters.endDate;
  }

  // Get filtered data
  let filteredData = null;
  if (typeof getFilteredDashboardData === "function") {
    filteredData = getFilteredDashboardData();
  }

  // Update page content based on page type
  updatePageContent(filteredData, filters);
}

// Update page content based on page type
function updatePageContent(data, filters) {
  const currentPage = getCurrentPageType();

  switch (currentPage) {
    case "revenue-target":
      updateRevenueTargetPage(data, filters);
      break;
    case "revenue-mtd":
      updateRevenueMTDPage(data, filters);
      break;
    case "total-revenue-mtd":
      updateTotalRevenueMTDPage(data, filters);
      break;
    case "growth-comparison":
      updateGrowthComparisonPage(data, filters);
      break;
    case "daily-average":
      updateDailyAveragePage(data, filters);
      break;
    case "remaining-days":
      updateRemainingDaysPage(data, filters);
      break;
    case "daily-revenue":
      updateDailyRevenuePage(data, filters);
      break;
    case "completion-rate":
      updateCompletionRatePage(data, filters);
      break;
    case "checkin-today":
      updateCheckinTodayPage(data, filters);
      break;
    case "checkin-mtd":
      updateCheckinMTDPage(data, filters);
      break;
    case "visitors":
      updateVisitorsPage(data, filters);
      break;
    case "trial-guests":
      updateTrialGuestsPage(data, filters);
      break;
    case "pt":
      updatePTPage(data, filters);
      break;
    case "member-movement":
      updateMemberMovementPage(data, filters);
      break;
    case "checkin-frequency":
      updateCheckinFrequencyPage(data, filters);
      break;
    case "facility-utilization":
      updateFacilityUtilizationPage(data, filters);
      break;
    case "burn-rate":
      updateBurnRatePage(data, filters);
      break;
    default:
      console.log("Unknown page type:", currentPage);
  }
}

// Get current page type from URL
function getCurrentPageType() {
  const path = window.location.pathname;
  const filename = path.split("/").pop();

  if (filename.includes("revenue-target")) return "revenue-target";
  if (filename.includes("revenue-mtd")) return "revenue-mtd";
  if (filename.includes("total-revenue-mtd")) return "total-revenue-mtd";
  if (filename.includes("growth-comparison")) return "growth-comparison";
  if (filename.includes("daily-average")) return "daily-average";
  if (filename.includes("remaining-days")) return "remaining-days";
  if (filename.includes("daily-revenue")) return "daily-revenue";
  if (filename.includes("completion-rate")) return "completion-rate";
  if (filename.includes("checkin-today")) return "checkin-today";
  if (filename.includes("checkin-mtd")) return "checkin-mtd";
  if (filename.includes("visitors")) return "visitors";
  if (filename.includes("trial-guests")) return "trial-guests";
  if (filename.includes("pt-detail")) return "pt";
  if (filename.includes("member-movement")) return "member-movement";
  if (filename.includes("checkin-frequency")) return "checkin-frequency";
  if (filename.includes("facility-utilization")) return "facility-utilization";
  if (filename.includes("burn-rate")) return "burn-rate";

  return "unknown";
}

// Update revenue target page
function updateRevenueTargetPage(data, filters) {
  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-bullseye me-2"></i>
      Chi tiết Mục tiêu Doanh số - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update target value
  const targetValue = document.querySelector("#targetValue");
  if (targetValue && data && data.revenue && data.revenue.target) {
    targetValue.textContent = formatNumber(data.revenue.target);
  }

  // Update MTD value
  const mtdValue = document.querySelector("#mtdValue");
  if (mtdValue && data && data.revenue && data.revenue.mtd) {
    mtdValue.textContent = formatNumber(data.revenue.mtd);
  }

  // Update remaining value
  const remainingValue = document.querySelector("#remainingValue");
  if (remainingValue && data && data.revenue && data.revenue.remaining) {
    remainingValue.textContent = formatNumber(data.revenue.remaining);
  }

  // Update completion rate
  const completionValue = document.querySelector("#completionValue");
  if (completionValue && data && data.revenue && data.revenue.completionRate) {
    completionValue.textContent = data.revenue.completionRate + "%";
  }

  // Update table data if filtering by specific location
  if (filters.location !== "all") {
    const tableBody = document.querySelector("#targetTable tbody");
    if (tableBody && data) {
      const locationName = getLocationName(filters.location);
      const target = data.revenue ? data.revenue.target : 0;
      const mtd = data.revenue ? data.revenue.mtd : 0;
      const remaining = data.revenue ? data.revenue.remaining : 0;
      const completionRate = data.revenue ? data.revenue.completionRate : 0;

      tableBody.innerHTML = `
        <tr>
          <td>${locationName}</td>
          <td class="text-end">${formatNumber(target)}</td>
          <td class="text-end">${formatNumber(mtd)}</td>
          <td class="text-end">${formatNumber(remaining)}</td>
          <td class="text-end">${completionRate}%</td>
          <td class="text-center">
            <span class="badge ${
              completionRate >= 80
                ? "bg-success"
                : completionRate >= 60
                ? "bg-warning"
                : "bg-danger"
            }">
              ${
                completionRate >= 80
                  ? "Tốt"
                  : completionRate >= 60
                  ? "Trung bình"
                  : "Cần cải thiện"
              }
            </span>
          </td>
        </tr>
      `;
    }
  }
}

// Update other pages (placeholder functions)
function updateRevenueMTDPage(data, filters) {
  console.log("Updating revenue MTD page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-chart-line me-2"></i>
      Chi tiết Doanh thu MTD - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update MTD value
  const mtdValue = document.querySelector("#mtdValue");
  if (mtdValue && data && data.revenue && data.revenue.mtd) {
    mtdValue.textContent = formatNumber(data.revenue.mtd);
  }

  // Update growth value
  const growthValue = document.querySelector("#growthValue");
  if (growthValue && data && data.revenue && data.revenue.growth) {
    growthValue.textContent = data.revenue.growth + "%";
  }

  // Update daily average
  const dailyAvgValue = document.querySelector("#dailyAvgValue");
  if (dailyAvgValue && data && data.revenue && data.revenue.avgDaily) {
    dailyAvgValue.textContent = formatNumber(data.revenue.avgDaily);
  }

  // Update remaining days
  const remainingDaysValue = document.querySelector("#remainingDaysValue");
  if (remainingDaysValue && data && data.revenue && data.revenue.remaining) {
    const remainingDays = Math.ceil(
      data.revenue.remaining / data.revenue.avgDaily
    );
    remainingDaysValue.textContent = remainingDays + " ngày";
  }
}

// Update total revenue MTD page
function updateTotalRevenueMTDPage(data, filters) {
  console.log("Updating total revenue MTD page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-chart-line me-2"></i>
      Chi tiết Tổng Doanh thu MTD - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update MTD value
  const mtdValue = document.querySelector("#mtdValue");
  if (mtdValue && data && data.revenue && data.revenue.mtd) {
    mtdValue.textContent = formatNumber(data.revenue.mtd);
  }
}

// Update growth comparison page
function updateGrowthComparisonPage(data, filters) {
  console.log("Updating growth comparison page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-chart-line me-2"></i>
      Chi tiết Tăng trưởng - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update growth value
  const growthValue = document.querySelector("#growthValue");
  if (growthValue && data && data.revenue && data.revenue.growth) {
    growthValue.textContent = data.revenue.growth + "%";
  }
}

// Update daily average page
function updateDailyAveragePage(data, filters) {
  console.log("Updating daily average page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-chart-line me-2"></i>
      Chi tiết Trung bình Ngày - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update daily average value
  const dailyAvgValue = document.querySelector("#dailyAvgValue");
  if (dailyAvgValue && data && data.revenue && data.revenue.avgDaily) {
    dailyAvgValue.textContent = formatNumber(data.revenue.avgDaily);
  }
}

// Update remaining days page
function updateRemainingDaysPage(data, filters) {
  console.log("Updating remaining days page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-chart-line me-2"></i>
      Chi tiết Ngày Còn thiếu - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update remaining days value
  const remainingDaysValue = document.querySelector("#remainingDaysValue");
  if (remainingDaysValue && data && data.revenue && data.revenue.remaining) {
    const remainingDays = Math.ceil(
      data.revenue.remaining / data.revenue.avgDaily
    );
    remainingDaysValue.textContent = remainingDays + " ngày";
  }
}

function updateDailyRevenuePage(data, filters) {
  console.log("Updating daily revenue page with filters:", filters);
  // Implementation for daily revenue page
}

function updateCompletionRatePage(data, filters) {
  console.log("Updating completion rate page with filters:", filters);
  // Implementation for completion rate page
}

function updateCheckinTodayPage(data, filters) {
  console.log("Updating checkin today page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-calendar-day me-2"></i>
      Chi tiết Check-in Hôm nay - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update checkin count
  const checkinValue = document.querySelector("#countValue, #metricValue");
  if (checkinValue && data && data.checkin && data.checkin.today) {
    checkinValue.textContent = data.checkin.today;
  }
}

function updateCheckinMTDPage(data, filters) {
  console.log("Updating checkin MTD page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-calendar-alt me-2"></i>
      Chi tiết Check-in MTD - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update checkin MTD count
  const checkinValue = document.querySelector("#countValue, #metricValue");
  if (checkinValue && data && data.checkin && data.checkin.mtd) {
    checkinValue.textContent = data.checkin.mtd;
  }
}

function updateVisitorsPage(data, filters) {
  console.log("Updating visitors page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-users me-2"></i>
      Chi tiết Khách tham quan - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update visitors count
  const visitorsValue = document.querySelector(
    "#countValue, #metricValue, #totalVisitors"
  );
  if (visitorsValue) {
    if (window.ConsistentData) {
      const visitorsData = window.ConsistentData.getVisitorsData(
        "today",
        filters.location
      );
      visitorsValue.textContent = visitorsData.count;
    } else if (data && data.visitors && data.visitors.today) {
      visitorsValue.textContent = data.visitors.today;
    }
  }
}

function updateTrialGuestsPage(data, filters) {
  console.log("Updating trial guests page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-dumbbell me-2 text-warning"></i>
      Chi tiết Khách tập thử - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update trial guests count in summary cards
  const totalTrialsElement = document.getElementById("totalTrials");
  if (totalTrialsElement && data && data.customers && data.customers.trial) {
    totalTrialsElement.textContent = data.customers.trial;
  }

  // Update record count badge
  const recordCountElement = document.getElementById("recordCount");
  if (recordCountElement && data && data.customers && data.customers.trial) {
    recordCountElement.textContent = data.customers.trial;
  }

  // Don't interfere with the existing trial data loading
  // The page has its own loadTrialGuestsData() function that handles the table
  // Just trigger a reload of the trial guests data
  if (typeof loadTrialGuestsData === "function") {
    setTimeout(() => {
      loadTrialGuestsData();
    }, 100);
  }
}

function updatePTPage(data, filters) {
  console.log("Updating PT page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-dumbbell me-2"></i>
      Chi tiết PT Sessions - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update PT count
  const ptValue = document.querySelector("#countValue, #metricValue");
  if (ptValue && data && data.pt && data.pt.today) {
    ptValue.textContent = data.pt.today;
  }
}

function updateMemberMovementPage(data, filters) {
  console.log("Updating member movement page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-exchange-alt me-2"></i>
      Chi tiết Member Movement - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update member movement values
  const newJoinersValue = document.querySelector("#countValue, #metricValue");
  if (
    newJoinersValue &&
    data &&
    data.memberMovement &&
    data.memberMovement.newJoiners
  ) {
    newJoinersValue.textContent = data.memberMovement.newJoiners;
  }
}

function updateCheckinFrequencyPage(data, filters) {
  console.log("Updating checkin frequency page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-chart-bar me-2"></i>
      Chi tiết Tần suất Check-in - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update checkin frequency values
  const frequencyValue = document.querySelector("#countValue, #metricValue");
  if (
    frequencyValue &&
    data &&
    data.checkinFrequency &&
    data.checkinFrequency.avgPerWeek
  ) {
    frequencyValue.textContent = data.checkinFrequency.avgPerWeek;
  }
}

function updateFacilityUtilizationPage(data, filters) {
  console.log("Updating facility utilization page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-building me-2"></i>
      Chi tiết Sử dụng Cơ sở - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update facility utilization values
  const utilizationValue = document.querySelector(
    "#percentageValue, #metricValue"
  );
  if (
    utilizationValue &&
    data &&
    data.facilities &&
    data.facilities.avgOccupancy
  ) {
    utilizationValue.textContent = data.facilities.avgOccupancy + "%";
  }
}

function updateBurnRatePage(data, filters) {
  console.log("Updating burn rate page with filters:", filters);

  // Update header with filter info
  const headerTitle = document.querySelector(".card-title");
  if (headerTitle) {
    const locationName = getLocationName(filters.location);
    const departmentName = getDepartmentName(filters.department);
    headerTitle.innerHTML = `
      <i class="fas fa-fire me-2"></i>
      Chi tiết Burn Rate - ${locationName}
      ${filters.department !== "all" ? ` | ${departmentName}` : ""}
    `;
  }

  // Update burn rate values
  const burnRateValue = document.querySelector(
    "#percentageValue, #metricValue"
  );
  if (burnRateValue && data && data.burnRate && data.burnRate.avgBurnRate) {
    burnRateValue.textContent = data.burnRate.avgBurnRate + "%";
  }
}

// Helper functions (if not available from main.js)
function getLocationName(locationId) {
  const locations = {
    all: "Tất cả trung tâm",
    "ton-that-thuyet": "Tôn Thất Thuyết",
    "huynh-thuc-khang": "Huỳnh Thúc Kháng",
    "giang-vo": "Giảng Võ",
    "hao-nam": "Hào Nam",
    "nguyen-tuan": "Nguyễn Tuân",
  };
  return locations[locationId] || "Tất cả trung tâm";
}

function getDepartmentName(departmentId) {
  const departments = {
    all: "Tất cả bộ phận",
    membership: "Membership",
    fitness: "Fitness",
    pool: "Swimming Coach",
    pilates: "Pilates",
    operation: "Operation",
  };
  return departments[departmentId] || "Tất cả bộ phận";
}

function formatNumber(number) {
  if (typeof number !== "number") return number;
  return new Intl.NumberFormat("vi-VN").format(number);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Filter handler loaded, applying filters to detail page...");

  // Get current page type and apply filters
  const currentPage = getCurrentPageType();
  console.log("Current page type:", currentPage);

  if (currentPage !== "unknown") {
    applyFiltersToDetailPage();
  } else {
    console.log("Unknown page type, skipping filter application");
  }
});
