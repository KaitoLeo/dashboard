(function (global) {
  const App = global.App || {};
  const domain = (App.utils && App.utils.domain) || {};

  const getLocationName =
    domain.getLocationName || ((locationId) => locationId || "all");
  const getDepartmentName =
    domain.getDepartmentName || ((departmentId) => departmentId || "all");

  function updateCompletionRatePage(data, filters) {
    console.log("Updating completion rate page with filters:", filters);
    // Placeholder for future contract completion logic
  }

  function updateBurnRatePage(data, filters) {
    console.log("Updating burn rate page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-fire me-2"></i>
        Chi tiet Burn Rate - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const burnRateValue = document.querySelector(
      "#percentageValue, #metricValue"
    );
    if (burnRateValue && data?.burnRate?.avgBurnRate != null) {
      burnRateValue.textContent = data.burnRate.avgBurnRate + "%";
    }
  }

  const handlers = {
    "completion-rate": updateCompletionRatePage,
    "burn-rate": updateBurnRatePage,
  };

  App.modules = App.modules || {};
  App.modules.register?.("03-02-contract", {
    name: "Contract Management",
    pages: [{ code: "03-02", patterns: ["contract", "burn-rate", "completion"] }],
    handlers,
  });

  global.App.controllers = global.App.controllers || {};
  global.App.controllers.contractDetails = {
    updateCompletionRatePage,
    updateBurnRatePage,
  };
})(window);
