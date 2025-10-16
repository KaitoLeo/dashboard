// assets/js/shared/navigation-wrapper.js
(function (w) {
  "use strict";

  // Backward-compatible navigation wrapper
  // Giữ nguyên TẤT CẢ onclick functions hiện tại + thêm state sync

  let isInitialized = false;
  const originalFunctions = {};
  const stateAwarePaths = new Map();

  // Initialize navigation wrapper
  function initializeNavigationWrapper() {
    if (isInitialized) {
      console.log("Navigation wrapper already initialized");
      return;
    }

    console.log("🔗 Initializing Navigation Wrapper...");

    // Backup original functions before overriding
    backupOriginalFunctions();

    // Override navigation functions with state-aware versions
    overrideNavigationFunctions();

    // Setup state-aware path mapping
    setupStateAwarePaths();

    isInitialized = true;
    console.log("✅ Navigation wrapper initialized successfully");
  }

  // Backup all original navigation functions
  function backupOriginalFunctions() {
    const functions = [
      "openRevenueTargetDetail",
      "openRevenueMTDDetail",
      "openDailyRevenueDetail",
      "openCompletionRateDetail",
      "openYesterdayRevenueDetail",
      "openCheckinOverview",
      "openCheckinFrequencyDetail",
      "openCheckinMTDDetail",
      "openManualCheckinDetail",
      "openLiveMembersDetail",
      "openVisitorStatsDetail",
      "openTrialGuestsDetail",
      "openMemberMovementDetail",
      "openBirthdayMembersDetail",
      "openContractActivationDetail",
      "openPTDetail",
      "openBookingTodayDetail",
      "openBookingYesterdayDetail",
      "openBookingThisWeekDetail",
      "openBookingMTDDetail",
      "openFacilityUtilizationDetail",
      "openGymOccupancyDetail",
      "openSwimmingCoachOccupancyDetail",
      "openPilatesOccupancyDetail",
      "openBurnRateDetail",
      "openVisitorsDetail",
      "openVisitorYesterdayDetail",
      "openVisitorTodayDetail",
    ];

    functions.forEach((funcName) => {
      if (typeof w[funcName] === "function") {
        originalFunctions[funcName] = w[funcName];
        console.log(`📋 Backed up original function: ${funcName}`);
      }
    });
  }

  // Setup state-aware path mapping
  function setupStateAwarePaths() {
    // Revenue paths
    stateAwarePaths.set(
      "openRevenueTargetDetail",
      "pages/03-03-01-01-revenue-target-detail.html"
    );
    stateAwarePaths.set(
      "openRevenueMTDDetail",
      "pages/03-03-01-04-revenue-mtd-detail.html"
    );
    stateAwarePaths.set(
      "openDailyRevenueDetail",
      "pages/03-03-01-03-daily-revenue-detail.html"
    );
    stateAwarePaths.set(
      "openCompletionRateDetail",
      "pages/03-03-01-02-completion-rate-detail.html"
    );
    stateAwarePaths.set(
      "openYesterdayRevenueDetail",
      "pages/03-03-01-05-daily-revenue-yesterday-detail.html"
    );

    // Check-in paths
    stateAwarePaths.set(
      "openCheckinOverview",
      "pages/03-01-01-01-checkin-overview.html"
    );
    stateAwarePaths.set(
      "openCheckinFrequencyDetail",
      "pages/03-01-01-06-checkin-frequency-analysis.html"
    );
    stateAwarePaths.set(
      "openCheckinMTDDetail",
      "pages/03-01-01-04-checkin-mtd-detail.html"
    );
    stateAwarePaths.set(
      "openManualCheckinDetail",
      "pages/03-01-08-01-manual-checkin-detail.html"
    );

    // Customer paths
    stateAwarePaths.set(
      "openLiveMembersDetail",
      "pages/03-01-09-01-live-members-detail.html"
    );
    stateAwarePaths.set(
      "openVisitorStatsDetail",
      "pages/03-01-08-05-visitor-stats-detail.html"
    );
    stateAwarePaths.set(
      "openTrialGuestsDetail",
      "pages/03-01-08-04-trial-guests-detail.html"
    );
    stateAwarePaths.set(
      "openMemberMovementDetail",
      "pages/03-04-04-01-member-movement-detail.html"
    );
    stateAwarePaths.set(
      "openBirthdayMembersDetail",
      "pages/03-04-05-01-birthday-members-detail.html"
    );

    // Contract paths
    stateAwarePaths.set(
      "openContractActivationDetail",
      "pages/03-02-04-01-contract-activation-detail.html"
    );

    // PT paths
    stateAwarePaths.set(
      "openPTDetail",
      "pages/03-01-03-01-pt-checkin-overview.html"
    );

    // Booking paths
    stateAwarePaths.set(
      "openBookingTodayDetail",
      "pages/03-05-01-02-booking-today-detail.html"
    );
    stateAwarePaths.set(
      "openBookingYesterdayDetail",
      "pages/03-05-01-03-booking-yesterday-detail.html"
    );
    stateAwarePaths.set(
      "openBookingThisWeekDetail",
      "pages/03-05-01-04-booking-this-week-detail.html"
    );
    stateAwarePaths.set(
      "openBookingMTDDetail",
      "pages/03-05-01-05-booking-mtd-detail.html"
    );

    // Facility paths
    stateAwarePaths.set(
      "openFacilityUtilizationDetail",
      "pages/03-03-08-01-facility-utilization-detail.html"
    );
    stateAwarePaths.set(
      "openGymOccupancyDetail",
      "pages/03-03-11-04-gym-occupancy-detail.html"
    );
    stateAwarePaths.set(
      "openSwimmingCoachOccupancyDetail",
      "pages/03-03-11-03-swimming-occupancy-detail.html"
    );
    stateAwarePaths.set(
      "openPilatesOccupancyDetail",
      "pages/03-03-11-02-pilates-occupancy-detail.html"
    );

    // Analysis paths
    stateAwarePaths.set(
      "openBurnRateDetail",
      "pages/03-02-05-01-burn-rate-detail.html"
    );

    // Visitor paths
    stateAwarePaths.set(
      "openVisitorsDetail",
      "pages/03-01-08-03-visitors-detail.html"
    );
    stateAwarePaths.set(
      "openVisitorYesterdayDetail",
      "pages/03-01-08-06-visitor-yesterday-detail.html"
    );
    stateAwarePaths.set(
      "openVisitorTodayDetail",
      "pages/03-01-08-07-visitor-today-detail.html"
    );
  }

  // Override navigation functions with state-aware versions
  function overrideNavigationFunctions() {
    stateAwarePaths.forEach((path, functionName) => {
      w[functionName] = function (...args) {
        console.log(`🔄 ${functionName} called with args:`, args);

        // Call original function first (preserve existing behavior)
        if (originalFunctions[functionName]) {
          try {
            const result = originalFunctions[functionName].apply(this, args);
            console.log(`✅ Original ${functionName} executed successfully`);
          } catch (error) {
            console.warn(`⚠️ Original ${functionName} failed:`, error);
          }
        }

        // Then add state-aware navigation
        try {
          navigateWithState(path, args);
        } catch (error) {
          console.error(
            `❌ State-aware navigation failed for ${functionName}:`,
            error
          );
          // Fallback to original navigation
          if (originalFunctions[functionName]) {
            originalFunctions[functionName].apply(this, args);
          }
        }
      };

      console.log(`🔄 Overrode function: ${functionName} -> ${path}`);
    });
  }

  // Navigate with current state injected
  function navigateWithState(targetPath, originalArgs = []) {
    if (!w.SharedState) {
      console.warn("SharedState not available, using direct navigation");
      window.location.href = targetPath;
      return;
    }

    try {
      // Get current state
      const currentState = w.SharedState.getState();
      console.log("Current state for navigation:", currentState);

      // Build URL with state parameters
      const url = new URL(targetPath, window.location.origin);

      // Inject state parameters
      if (currentState.timeKey && currentState.timeKey !== "today") {
        url.searchParams.set("time", currentState.timeKey);
      }
      if (currentState.location && currentState.location !== "all") {
        url.searchParams.set("location", currentState.location);
      }
      if (currentState.service && currentState.service !== "all") {
        url.searchParams.set("service", currentState.service);
      }
      if (currentState.department && currentState.department !== "all") {
        url.searchParams.set("department", currentState.department);
      }

      // Handle original arguments (for functions that take parameters)
      if (originalArgs.length > 0) {
        originalArgs.forEach((arg, index) => {
          if (arg && typeof arg === "string") {
            url.searchParams.set(`arg${index}`, arg);
          }
        });
      }

      const finalUrl = url.pathname + url.search;
      console.log(`🔗 Navigating to: ${finalUrl}`);

      // Navigate
      window.location.href = finalUrl;
    } catch (error) {
      console.error("Navigation with state failed:", error);
      // Fallback to direct navigation
      window.location.href = targetPath;
    }
  }

  // Restore original functions (for debugging)
  function restoreOriginalFunctions() {
    Object.keys(originalFunctions).forEach((funcName) => {
      w[funcName] = originalFunctions[funcName];
    });
    console.log("🔄 Restored all original functions");
  }

  // Get navigation status
  function getNavigationStatus() {
    return {
      initialized: isInitialized,
      backedUpFunctions: Object.keys(originalFunctions).length,
      stateAwarePaths: stateAwarePaths.size,
      availableFunctions: Object.keys(w).filter(
        (key) =>
          typeof w[key] === "function" &&
          key.startsWith("open") &&
          key.endsWith("Detail")
      ).length,
    };
  }

  // Expose API
  w.NavigationWrapper = {
    init: initializeNavigationWrapper,
    restore: restoreOriginalFunctions,
    status: getNavigationStatus,
    navigateWithState: navigateWithState,
  };
})(window);

