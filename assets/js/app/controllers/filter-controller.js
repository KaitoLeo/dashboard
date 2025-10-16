// Filter Handler for Detail Pages
// Delegates page-specific rendering logic to registered business modules

(function (global) {
  global.App = global.App || {};
  global.App.controllers = global.App.controllers || {};

  function getUrlParams() {
    const urlParams = new URLSearchParams(global.location.search);
    return {
      location: urlParams.get("location") || "all",
      department: urlParams.get("department") || "all",
      startDate: urlParams.get("startDate") || "",
      endDate: urlParams.get("endDate") || "",
    };
  }

  function applyFiltersToDetailPage() {
    const filters = getUrlParams();
    console.log("Applying filters to detail page:", filters);

    if (typeof global.currentFilters === "undefined") {
      global.currentFilters = {
        location: filters.location,
        department: filters.department,
        startDate: filters.startDate,
        endDate: filters.endDate,
        timeRange: "month",
      };
      console.log("Initialized currentFilters:", global.currentFilters);
    } else {
      global.currentFilters.location = filters.location;
      global.currentFilters.department = filters.department;
      global.currentFilters.startDate = filters.startDate;
      global.currentFilters.endDate = filters.endDate;
    }

    let filteredData = null;
    if (typeof global.getFilteredDashboardData === "function") {
      filteredData = global.getFilteredDashboardData();
    }

    updatePageContent(filteredData, filters);
  }

  function updatePageContent(data, filters) {
    const currentPage = getCurrentPageType();
    const handler = resolvePageHandler(currentPage);

    if (typeof handler === "function") {
      handler(data, filters);
    } else {
      console.log("No handler registered for page type:", currentPage);
    }
  }

  function getCurrentPageType() {
    const filename = global.location.pathname.split("/").pop() || "";

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

  function resolvePageHandler(pageType) {
    if (!pageType || pageType === "unknown") {
      return null;
    }

    const modules = (global.App && global.App.modules) || {};
    return Object.keys(modules).reduce((matched, moduleId) => {
      if (matched) {
        return matched;
      }
      const moduleDef = modules[moduleId];
      const handlers = moduleDef && moduleDef.handlers;
      if (handlers && typeof handlers[pageType] === "function") {
        return handlers[pageType];
      }
      return null;
    }, null);
  }

  function boot() {
    console.log("Filter handler loaded, applying filters to detail page...");
    const currentPage = getCurrentPageType();
    console.log("Current page type:", currentPage);

    if (currentPage !== "unknown") {
      applyFiltersToDetailPage();
    } else {
      console.log("Unknown page type, skipping filter application");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  global.App.controllers.filters = {
    getUrlParams,
    applyFiltersToDetailPage,
    updatePageContent,
    getCurrentPageType,
    resolvePageHandler,
  };
})(window);
