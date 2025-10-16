// assets/js/shared/page-initializer.js
(function (w) {
  "use strict";

  // Universal page initializer - works with ANY page
  // Automatically applies state from URL parameters without breaking existing functionality

  let isInitialized = false;
  const pageConfig = {
    hasSharedDataLayer: false,
    hasExistingInitialization: false,
    originalOnLoad: null,
  };

  // Initialize page with state awareness
  function initializePage(options = {}) {
    if (isInitialized) {
      console.log("Page already initialized");
      return;
    }

    console.log("🚀 Initializing Universal Page State Handler...");

    // Detect page capabilities
    detectPageCapabilities();

    // Apply state from URL parameters
    applyStateFromURL();

    // Setup state change handlers
    setupStateChangeHandlers();

    // Preserve existing page functionality
    preserveExistingFunctionality();

    isInitialized = true;
    console.log("✅ Universal Page State Handler initialized");
    console.log("📊 Page capabilities:", pageConfig);
  }

  // Detect what the page supports
  function detectPageCapabilities() {
    // Check for shared data layer
    pageConfig.hasSharedDataLayer = !!(
      w.SharedState &&
      w.DataSource &&
      w.ComputeKPI &&
      w.Reconcile
    );

    // Check for existing initialization
    pageConfig.hasExistingInitialization = !!(
      document.querySelector("script") &&
      document.querySelector("script").textContent.includes("DOMContentLoaded")
    );

    console.log("🔍 Page capabilities detected:", pageConfig);
  }

  // Apply state from URL parameters to current page
  function applyStateFromURL() {
    if (!pageConfig.hasSharedDataLayer) {
      console.log(
        "⚠️ Shared data layer not available, skipping state application"
      );
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const stateFromURL = {};

      // Extract state from URL
      if (urlParams.has("time")) {
        stateFromURL.timeKey = urlParams.get("time");
      }
      if (urlParams.has("location")) {
        stateFromURL.location = urlParams.get("location");
      }
      if (urlParams.has("service")) {
        stateFromURL.service = urlParams.get("service");
      }
      if (urlParams.has("department")) {
        stateFromURL.department = urlParams.get("department");
      }

      // Apply state if any parameters found
      if (Object.keys(stateFromURL).length > 0) {
        console.log("📥 Applying state from URL:", stateFromURL);
        w.SharedState.setState(stateFromURL);

        // Update page filters if they exist
        updatePageFilters(stateFromURL);

        console.log("✅ State applied from URL parameters");
      } else {
        console.log("ℹ️ No state parameters in URL");
      }
    } catch (error) {
      console.error("❌ Failed to apply state from URL:", error);
    }
  }

  // Update page filters based on state
  function updatePageFilters(state) {
    // Update time filter dropdowns
    if (state.timeKey) {
      const timeSelects = document.querySelectorAll(
        'select[id*="time"], select[id*="Time"]'
      );
      timeSelects.forEach((select) => {
        const option = select.querySelector(`option[value="${state.timeKey}"]`);
        if (option) {
          select.value = state.timeKey;
          console.log(
            `🔄 Updated time filter: ${select.id} = ${state.timeKey}`
          );
        }
      });
    }

    // Update location filter dropdowns
    if (state.location) {
      const locationSelects = document.querySelectorAll(
        'select[id*="location"], select[id*="Location"], select[id*="club"], select[id*="Club"]'
      );
      locationSelects.forEach((select) => {
        const option = select.querySelector(
          `option[value="${state.location}"]`
        );
        if (option) {
          select.value = state.location;
          console.log(
            `🔄 Updated location filter: ${select.id} = ${state.location}`
          );
        }
      });
    }

    // Update service filter dropdowns
    if (state.service) {
      const serviceSelects = document.querySelectorAll(
        'select[id*="service"], select[id*="Service"], select[id*="department"], select[id*="Department"]'
      );
      serviceSelects.forEach((select) => {
        const option = select.querySelector(`option[value="${state.service}"]`);
        if (option) {
          select.value = state.service;
          console.log(
            `🔄 Updated service filter: ${select.id} = ${state.service}`
          );
        }
      });
    }
  }

  // Setup state change handlers
  function setupStateChangeHandlers() {
    if (!pageConfig.hasSharedDataLayer) return;

    try {
      // Subscribe to state changes
      w.SharedState.subscribe((newState, oldState) => {
        console.log(
          "🔄 State changed, updating page filters:",
          w.SharedState.getStateDiff(oldState, newState)
        );
        updatePageFilters(newState);

        // Trigger existing filter functions if they exist
        triggerExistingFilters(newState);
      });

      console.log("✅ State change handlers setup complete");
    } catch (error) {
      console.error("❌ Failed to setup state change handlers:", error);
    }
  }

  // Trigger existing filter functions
  function triggerExistingFilters(state) {
    const commonFilterFunctions = [
      "applyFilters",
      "filterData",
      "loadData",
      "refreshData",
      "updateTable",
      "loadVisitorsTable",
      "loadCheckinData",
      "loadRevenueData",
    ];

    commonFilterFunctions.forEach((funcName) => {
      if (typeof w[funcName] === "function") {
        try {
          console.log(`🔄 Triggering existing filter function: ${funcName}`);
          w[funcName]();
        } catch (error) {
          console.warn(`⚠️ Failed to trigger ${funcName}:`, error);
        }
      }
    });
  }

  // Preserve existing page functionality
  function preserveExistingFunctionality() {
    // Don't interfere with existing DOMContentLoaded handlers
    // Just add our state handling alongside existing functionality

    if (pageConfig.hasExistingInitialization) {
      console.log("ℹ️ Existing initialization detected, preserving it");
    }

    // Add our initialization to the existing flow
    document.addEventListener("DOMContentLoaded", function () {
      console.log("📄 DOM loaded, page ready for state handling");

      // Small delay to let existing initialization complete
      setTimeout(() => {
        console.log("⏰ Page initialization complete, state handler ready");
      }, 100);
    });
  }

  // Get page status
  function getPageStatus() {
    return {
      initialized: isInitialized,
      capabilities: pageConfig,
      currentState: pageConfig.hasSharedDataLayer
        ? w.SharedState.getState()
        : null,
      urlParams: Object.fromEntries(
        new URLSearchParams(window.location.search)
      ),
    };
  }

  // Auto-initialize when script loads
  function autoInitialize() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializePage);
    } else {
      // DOM already ready
      setTimeout(initializePage, 100);
    }
  }

  // Expose API
  w.PageInitializer = {
    init: initializePage,
    status: getPageStatus,
    updateFilters: updatePageFilters,
  };

  // Auto-initialize
  autoInitialize();
})(window);

