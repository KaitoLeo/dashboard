/**
 * Master Initialization Script
 * Load all calculation modules, API layer, and real-time sync
 * Add this script to pages that need full integration
 */

(function (window) {
  "use strict";

  console.log("🚀 Initializing Actiwell Dashboard - All Modules");
  console.log("=".repeat(60));

  // Track loading status
  const loadStatus = {
    calculationModules: false,
    mockData: false,
    apiLayer: false,
    realtimeSync: false,
  };

  /**
   * Check if all modules are loaded
   */
  function checkModulesLoaded() {
    const modules = [
      // Calculation modules
      { name: "RevenueCalculations", obj: window.revenueCalc },
      { name: "BookingCalculations", obj: window.bookingCalc },
      { name: "CheckinCalculations", obj: window.checkinCalc },
      { name: "VisitorCalculations", obj: window.visitorCalc },

      // Mock data
      { name: "RevenueMockData", obj: window.RevenueMockData },
      { name: "BookingMockData", obj: window.BookingMockData },
      { name: "CheckinMockData", obj: window.CheckinMockData },
      { name: "VisitorMockData", obj: window.VisitorMockData },

      // API layer
      { name: "APIClient", obj: window.apiClient },
      { name: "DataAdapter", obj: window.dataAdapter },
      { name: "RevenueAPI", obj: window.revenueAPI },
      { name: "BookingAPI", obj: window.bookingAPI },
      { name: "CheckinAPI", obj: window.checkinAPI },
      { name: "VisitorAPI", obj: window.visitorAPI },
    ];

    console.log("\n📦 Module Status:");
    let allLoaded = true;

    modules.forEach((module) => {
      if (module.obj) {
        console.log(`   ✅ ${module.name}`);
      } else {
        console.log(`   ❌ ${module.name} - Not loaded`);
        allLoaded = false;
      }
    });

    return allLoaded;
  }

  /**
   * Initialize configuration
   */
  function initializeConfiguration() {
    // API Configuration
    window.API_CONFIG = {
      baseURL: window.API_BASE_URL || "http://localhost:8000/api",
      timeout: 10000,
      useMockData: true, // Set to false when backend is ready
      cacheTimeout: 60000,
    };

    // Real-time Sync Configuration
    window.SYNC_CONFIG = {
      useWebSocket: false, // Set to true when WebSocket server is ready
      wsURL: window.WS_URL || "ws://localhost:8000/ws",
      pollingInterval: 30000, // 30 seconds
    };

    console.log("\n⚙️ Configuration:");
    console.log(`   🌐 API Base URL: ${window.API_CONFIG.baseURL}`);
    console.log(
      `   📦 Use Mock Data: ${window.API_CONFIG.useMockData ? "Yes" : "No"}`
    );
    console.log(
      `   🔌 WebSocket: ${
        window.SYNC_CONFIG.useWebSocket ? "Enabled" : "Disabled"
      }`
    );
    console.log(
      `   📡 Polling Interval: ${window.SYNC_CONFIG.pollingInterval / 1000}s`
    );
  }

  /**
   * Setup global event bus
   */
  function setupEventBus() {
    window.EventBus = {
      subscribers: {},

      subscribe(event, callback) {
        if (!this.subscribers[event]) {
          this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);

        return () => {
          const index = this.subscribers[event].indexOf(callback);
          if (index > -1) {
            this.subscribers[event].splice(index, 1);
          }
        };
      },

      publish(event, data) {
        if (this.subscribers[event]) {
          this.subscribers[event].forEach((callback) => {
            try {
              callback(data);
            } catch (error) {
              console.error(`❌ Error in ${event} subscriber:`, error);
            }
          });
        }
      },
    };

    console.log("\n📢 Event Bus initialized");
  }

  /**
   * Setup error handling
   */
  function setupErrorHandling() {
    window.addEventListener("error", function (event) {
      console.error("❌ Global error:", event.error);
    });

    window.addEventListener("unhandledrejection", function (event) {
      console.error("❌ Unhandled promise rejection:", event.reason);
    });

    console.log("\n🛡️ Global error handling setup");
  }

  /**
   * Main initialization
   */
  window.addEventListener("load", function () {
    console.log("\n🎯 Running Master Initialization...\n");

    // Initialize configuration
    initializeConfiguration();

    // Setup event bus
    setupEventBus();

    // Setup error handling
    setupErrorHandling();

    // Check if all modules are loaded
    const allModulesLoaded = checkModulesLoaded();

    if (allModulesLoaded) {
      console.log("\n✅ All modules loaded successfully!");
    } else {
      console.warn(
        "\n⚠️ Some modules failed to load. Check console for details."
      );
    }

    // Publish ready event
    window.EventBus.publish("system:ready", {
      modulesLoaded: allModulesLoaded,
      config: window.API_CONFIG,
    });

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Actiwell Dashboard - Ready!");
    console.log("=".repeat(60));
  });
})(window);
