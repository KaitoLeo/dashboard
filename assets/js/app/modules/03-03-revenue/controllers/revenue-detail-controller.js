(function (global) {
  const App = global.App || {};
  const domain = (App.utils && App.utils.domain) || {};

  const getLocationName =
    domain.getLocationName || ((locationId) => locationId || "all");
  const getDepartmentName =
    domain.getDepartmentName || ((departmentId) => departmentId || "all");
  const formatNumber =
    domain.formatNumber || ((value) => (value == null ? "" : value));

  function updateRevenueTargetPage(data, filters) {
    console.log("Updating revenue target page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-bullseye me-2"></i>
        Chi tiet Muc tieu Doanh so - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const targetValue = document.querySelector("#targetValue");
    if (targetValue && data?.revenue?.target) {
      targetValue.textContent = formatNumber(data.revenue.target);
    }

    const mtdValue = document.querySelector("#mtdValue");
    if (mtdValue && data?.revenue?.mtd) {
      mtdValue.textContent = formatNumber(data.revenue.mtd);
    }

    const remainingValue = document.querySelector("#remainingValue");
    if (remainingValue && data?.revenue?.remaining) {
      remainingValue.textContent = formatNumber(data.revenue.remaining);
    }

    const completionValue = document.querySelector("#completionValue");
    if (completionValue && data?.revenue?.completionRate) {
      completionValue.textContent = data.revenue.completionRate + "%";
    }

    if (filters.location !== "all") {
      const tableBody = document.querySelector("#targetTable tbody");
      if (tableBody && data) {
        const locationName = getLocationName(filters.location);
        const target = data.revenue ? data.revenue.target : 0;
        const mtd = data.revenue ? data.revenue.mtd : 0;
        const remaining = data.revenue ? data.revenue.remaining : 0;
        const completionRate = data.revenue
          ? data.revenue.completionRate
          : 0;

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
                    ? "Tot"
                    : completionRate >= 60
                    ? "Trung binh"
                    : "Can cai thien"
                }
              </span>
            </td>
          </tr>
        `;
      }
    }
  }

  function updateRevenueMTDPage(data, filters) {
    console.log("Updating revenue MTD page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-chart-line me-2"></i>
        Chi tiet Doanh thu MTD - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const mtdValue = document.querySelector("#mtdValue");
    if (mtdValue && data?.revenue?.mtd) {
      mtdValue.textContent = formatNumber(data.revenue.mtd);
    }

    const growthValue = document.querySelector("#growthValue");
    if (growthValue && data?.revenue?.growth) {
      growthValue.textContent = data.revenue.growth + "%";
    }

    const dailyAvgValue = document.querySelector("#dailyAvgValue");
    if (dailyAvgValue && data?.revenue?.avgDaily) {
      dailyAvgValue.textContent = formatNumber(data.revenue.avgDaily);
    }

    const remainingDaysValue = document.querySelector("#remainingDaysValue");
    if (
      remainingDaysValue &&
      data?.revenue?.remaining &&
      data.revenue.avgDaily
    ) {
      const remainingDays = Math.ceil(
        data.revenue.remaining / data.revenue.avgDaily
      );
      remainingDaysValue.textContent = remainingDays + " ngay";
    }
  }

  function updateTotalRevenueMTDPage(data, filters) {
    console.log("Updating total revenue MTD page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-chart-line me-2"></i>
        Chi tiet Tong Doanh thu MTD - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const mtdValue = document.querySelector("#mtdValue");
    if (mtdValue && data?.revenue?.mtd) {
      mtdValue.textContent = formatNumber(data.revenue.mtd);
    }
  }

  function updateGrowthComparisonPage(data, filters) {
    console.log("Updating growth comparison page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-chart-line me-2"></i>
        Chi tiet Tang truong - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const growthValue = document.querySelector("#growthValue");
    if (growthValue && data?.revenue?.growth) {
      growthValue.textContent = data.revenue.growth + "%";
    }
  }

  function updateDailyAveragePage(data, filters) {
    console.log("Updating daily average page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-chart-line me-2"></i>
        Chi tiet Trung binh Ngay - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const dailyAvgValue = document.querySelector("#dailyAvgValue");
    if (dailyAvgValue && data?.revenue?.avgDaily) {
      dailyAvgValue.textContent = formatNumber(data.revenue.avgDaily);
    }
  }

  function updateRemainingDaysPage(data, filters) {
    console.log("Updating remaining days page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-chart-line me-2"></i>
        Chi tiet Ngay Con thieu - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const remainingDaysValue = document.querySelector("#remainingDaysValue");
    if (
      remainingDaysValue &&
      data?.revenue?.remaining &&
      data.revenue.avgDaily
    ) {
      const remainingDays = Math.ceil(
        data.revenue.remaining / data.revenue.avgDaily
      );
      remainingDaysValue.textContent = remainingDays + " ngay";
    }
  }

  function updateDailyRevenuePage(data, filters) {
    console.log("Updating daily revenue page with filters:", filters);
    // Placeholder for future implementation
  }

  function updateFacilityUtilizationPage(data, filters) {
    console.log("Updating facility utilization page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-building me-2"></i>
        Chi tiet Su dung Co so - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const utilizationValue = document.querySelector(
      "#percentageValue, #metricValue"
    );
    if (utilizationValue && data?.facilities?.avgOccupancy) {
      utilizationValue.textContent = data.facilities.avgOccupancy + "%";
    }
  }

  const handlers = {
    "revenue-target": updateRevenueTargetPage,
    "revenue-mtd": updateRevenueMTDPage,
    "total-revenue-mtd": updateTotalRevenueMTDPage,
    "growth-comparison": updateGrowthComparisonPage,
    "daily-average": updateDailyAveragePage,
    "remaining-days": updateRemainingDaysPage,
    "daily-revenue": updateDailyRevenuePage,
    "facility-utilization": updateFacilityUtilizationPage,
  };

  App.modules = App.modules || {};
  App.modules.register?.("03-03-revenue", {
    name: "Revenue Management",
    pages: [
      { code: "03-03-01", patterns: ["revenue-"] },
      { code: "03-03-08", patterns: ["facility-utilization"] },
      { code: "03-03-12", patterns: ["remaining-days"] },
    ],
    handlers,
  });

  global.App.controllers = global.App.controllers || {};
  global.App.controllers.revenueDetails = {
    updateRevenueTargetPage,
    updateRevenueMTDPage,
    updateTotalRevenueMTDPage,
    updateGrowthComparisonPage,
    updateDailyAveragePage,
    updateRemainingDaysPage,
    updateDailyRevenuePage,
    updateFacilityUtilizationPage,
  };
})(window);
