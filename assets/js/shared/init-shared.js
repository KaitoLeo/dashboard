/**
 * Initialize Shared Modules
 * Loads all shared modules in correct order and provides unified API
 */
(function (window) {
  "use strict";

  // Check dependencies
  function checkDependency(name) {
    if (!window[name]) {
      console.error(`❌ Required dependency not loaded: ${name}`);
      return false;
    }
    return true;
  }

  // Wait for all dependencies to be ready
  function waitForDependencies(callback) {
    const requiredModules = [
      "SampleData",
      "DataSource",
      "SharedState",
      "ComputeKPI",
      "Reconcile",
      "Labels",
      "ServiceOrder",
    ];

    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait

    const checkInterval = setInterval(() => {
      attempts++;

      const allReady = requiredModules.every((module) => window[module]);

      if (allReady) {
        clearInterval(checkInterval);
        console.log("✅ All shared modules loaded");
        if (callback) callback();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error("❌ Timeout waiting for shared modules");
        const missing = requiredModules.filter((m) => !window[m]);
        console.error("Missing modules:", missing);
      }
    }, 100);
  }

  // Initialize the unified data layer
  function initDataLayer(state) {
    if (!checkDependency("DataSource")) return null;
    if (!checkDependency("ComputeKPI")) return null;

    // Validate state
    if (window.Reconcile) {
      window.Reconcile.validateState(state);
    }

    // Compute all KPIs
    const kpis = window.ComputeKPI.computeAllKPIs(state);

    // Validate data integrity
    if (window.Reconcile) {
      window.Reconcile.validateDataIntegrity(window.DataSource);
    }

    return kpis;
  }

  // Subscribe to state changes and auto-recompute
  function setupAutoUpdate(onUpdate) {
    if (!checkDependency("SharedState")) return;

    window.SharedState.subscribe((newState, oldState) => {
      console.log("🔄 State changed, recomputing...", {
        old: oldState.timeKey,
        new: newState.timeKey,
      });

      // Recompute KPIs
      const kpis = initDataLayer(newState);

      // Call callback
      if (onUpdate && typeof onUpdate === "function") {
        onUpdate(kpis, newState);
      }
    });
  }

  // Update UI elements with KPIs
  function updateUIElements(kpis, selectors = {}) {
    if (!kpis) return;

    // Booking updates
    if (kpis.booking && selectors.booking) {
      const { booking } = kpis;
      const sel = selectors.booking;

      if (sel.total) {
        document.querySelectorAll(sel.total).forEach((el) => {
          el.textContent = window.Labels.formatNumber(booking.totalBookings);
        });
      }

      if (sel.confirmed) {
        document.querySelectorAll(sel.confirmed).forEach((el) => {
          el.textContent = window.Labels.formatNumber(
            booking.byStatus.confirmed
          );
        });
      }

      if (sel.pending) {
        document.querySelectorAll(sel.pending).forEach((el) => {
          el.textContent = window.Labels.formatNumber(booking.byStatus.pending);
        });
      }

      if (sel.cancelled) {
        document.querySelectorAll(sel.cancelled).forEach((el) => {
          el.textContent = window.Labels.formatNumber(
            booking.byStatus.cancelled
          );
        });
      }

      if (sel.confirmationRate) {
        document.querySelectorAll(sel.confirmationRate).forEach((el) => {
          el.textContent = window.Labels.formatPercent(
            booking.confirmationRatio
          );
        });
      }

      if (sel.cancellationRate) {
        document.querySelectorAll(sel.cancellationRate).forEach((el) => {
          el.textContent = window.Labels.formatPercent(
            booking.cancellationRate
          );
        });
      }
    }

    // Revenue updates
    if (kpis.revenue && selectors.revenue) {
      const { revenue } = kpis;
      const sel = selectors.revenue;

      if (sel.total) {
        document.querySelectorAll(sel.total).forEach((el) => {
          el.textContent = window.Labels.formatCurrency(revenue.totalRevenue);
        });
      }

      if (sel.target) {
        document.querySelectorAll(sel.target).forEach((el) => {
          el.textContent = window.Labels.formatCurrency(revenue.targetMonth);
        });
      }

      if (sel.completion) {
        document.querySelectorAll(sel.completion).forEach((el) => {
          el.textContent = window.Labels.formatPercent(revenue.completionMTD);
        });
      }

      if (sel.arpb) {
        document.querySelectorAll(sel.arpb).forEach((el) => {
          el.textContent = window.Labels.formatCurrency(revenue.arpb);
        });
      }
    }

    // Check-in updates
    if (kpis.checkin && selectors.checkin) {
      const { checkin } = kpis;
      const sel = selectors.checkin;

      if (sel.total) {
        document.querySelectorAll(sel.total).forEach((el) => {
          el.textContent = window.Labels.formatNumber(checkin.totalCheckins);
        });
      }

      if (sel.peakHour) {
        document.querySelectorAll(sel.peakHour).forEach((el) => {
          el.textContent = checkin.peakHour
            ? window.Labels.formatTime(checkin.peakHour * 60)
            : "N/A";
        });
      }
    }

    // Membership updates
    if (kpis.membership && selectors.membership) {
      const { membership } = kpis;
      const sel = selectors.membership;

      if (sel.active) {
        document.querySelectorAll(sel.active).forEach((el) => {
          el.textContent = window.Labels.formatNumber(membership.activeCount);
        });
      }

      if (sel.frozen) {
        document.querySelectorAll(sel.frozen).forEach((el) => {
          el.textContent = window.Labels.formatNumber(membership.frozenCount);
        });
      }

      if (sel.expired) {
        document.querySelectorAll(sel.expired).forEach((el) => {
          el.textContent = window.Labels.formatNumber(membership.expiredCount);
        });
      }
    }
  }

  // Run consistency checks
  function runConsistencyChecks(kpis) {
    if (!window.Reconcile || !kpis) return;

    // Build modules object for reconciliation
    const modules = {
      booking: {
        dashboard: {
          totalBookings: kpis.booking.totalBookings,
          confirmed: kpis.booking.byStatus.confirmed,
          pending: kpis.booking.byStatus.pending,
          cancelled: kpis.booking.byStatus.cancelled,
        },
      },
      revenue: {
        dashboard: {
          totalRevenue: kpis.revenue.totalRevenue,
          revenueMTD: kpis.revenue.totalRevenue,
          targetMonth: kpis.revenue.targetMonth,
          completionMTD: kpis.revenue.completionMTD,
        },
        breakdown: {
          totalRevenue: kpis.revenue.totalRevenue,
          byService: kpis.revenue.byService,
        },
        bookingCount: kpis.booking.byStatus.confirmed,
      },
      checkin: {
        dashboard: {
          totalCheckins: kpis.checkin.totalCheckins,
          byService: kpis.checkin.byService,
        },
      },
      membership: {
        dashboard: {
          totalMembers:
            kpis.membership.activeCount +
            kpis.membership.frozenCount +
            kpis.membership.expiredCount,
          activeCount: kpis.membership.activeCount,
          frozenCount: kpis.membership.frozenCount,
          expiredCount: kpis.membership.expiredCount,
        },
      },
    };

    window.Reconcile.assertConsistency(modules);
  }

  // Main initialization function
  function init(options = {}) {
    console.group("🚀 Initializing Shared Data Layer");

    // Get initial state
    const state = window.SharedState ? window.SharedState.getState() : {};

    // Initialize data layer
    const kpis = initDataLayer(state);

    // Setup auto-update if callback provided
    if (options.onUpdate) {
      setupAutoUpdate(options.onUpdate);
    }

    // Update UI if selectors provided
    if (options.selectors) {
      updateUIElements(kpis, options.selectors);
    }

    // Run consistency checks if requested
    if (options.runChecks !== false) {
      runConsistencyChecks(kpis);
    }

    console.groupEnd();

    return kpis;
  }

  // Expose unified API
  window.SharedDataLayer = {
    init,
    initDataLayer,
    setupAutoUpdate,
    updateUIElements,
    runConsistencyChecks,
    waitForDependencies,
  };

  // Auto-init on DOM ready if data-auto-init attribute present
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.body.hasAttribute("data-auto-init-shared")) {
        waitForDependencies(() => {
          init({ runChecks: true });
        });
      }
    });
  } else {
    if (document.body.hasAttribute("data-auto-init-shared")) {
      waitForDependencies(() => {
        init({ runChecks: true });
      });
    }
  }

  console.log("✅ SharedDataLayer module ready");
})(window);

