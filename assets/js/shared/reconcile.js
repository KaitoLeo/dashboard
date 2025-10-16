/**
 * Reconcile - Data Consistency Checker
 * Ensures card/table/chart numbers match across all modules
 */
(function (window) {
  "use strict";

  const TOLERANCE = 0.01; // Allow 1% tolerance for floating point

  /**
   * Assert that two numbers are equal (with tolerance for floats)
   */
  function assertEqual(actual, expected, label) {
    if (typeof actual === "number" && typeof expected === "number") {
      const diff = Math.abs(actual - expected);
      const maxVal = Math.max(Math.abs(actual), Math.abs(expected));
      const tolerance = maxVal * TOLERANCE;

      if (diff > tolerance) {
        console.warn(`❌ ${label}: expected ${expected}, got ${actual}`);
        return false;
      }
    } else if (actual !== expected) {
      console.warn(`❌ ${label}: expected ${expected}, got ${actual}`);
      return false;
    }
    console.log(`✅ ${label}: ${actual}`);
    return true;
  }

  /**
   * Assert consistency across modules
   * Checks that the same calculation in different places returns the same result
   */
  function assertConsistency(modules = {}) {
    console.group("🔍 Data Consistency Checks");

    let allPassed = true;

    // Booking consistency checks
    if (modules.booking) {
      console.group("📅 Booking Module");

      const { dashboard, overview, detail } = modules.booking;

      if (dashboard && overview) {
        allPassed &= assertEqual(
          dashboard.totalBookings,
          overview.totalBookings,
          "Dashboard vs Overview: Total Bookings"
        );
      }

      if (dashboard && detail) {
        allPassed &= assertEqual(
          dashboard.confirmed,
          detail.confirmed,
          "Dashboard vs Detail: Confirmed Bookings"
        );
      }

      // Check sum of status categories equals total
      if (dashboard) {
        const sumByStatus =
          (dashboard.confirmed || 0) +
          (dashboard.pending || 0) +
          (dashboard.cancelled || 0);
        allPassed &= assertEqual(
          dashboard.totalBookings,
          sumByStatus,
          "Total Bookings = Sum of Status Categories"
        );
      }

      console.groupEnd();
    }

    // Revenue consistency checks
    if (modules.revenue) {
      console.group("💰 Revenue Module");

      const { dashboard, breakdown, detail } = modules.revenue;

      if (dashboard && breakdown) {
        allPassed &= assertEqual(
          dashboard.totalRevenue,
          breakdown.totalRevenue,
          "Dashboard vs Breakdown: Total Revenue"
        );
      }

      // Check sum by service equals total
      if (breakdown && breakdown.byService) {
        const sumByService = Object.values(breakdown.byService).reduce(
          (sum, val) => sum + val,
          0
        );
        allPassed &= assertEqual(
          breakdown.totalRevenue,
          sumByService,
          "Total Revenue = Sum by Service"
        );
      }

      // Check MTD completion percentage
      if (dashboard && dashboard.revenueMTD && dashboard.targetMonth) {
        const expectedCompletion =
          (dashboard.revenueMTD / dashboard.targetMonth) * 100;
        if (dashboard.completionMTD !== undefined) {
          allPassed &= assertEqual(
            dashboard.completionMTD,
            expectedCompletion,
            "MTD Completion % matches calculation"
          );
        }
      }

      console.groupEnd();
    }

    // Check-in consistency checks
    if (modules.checkin) {
      console.group("✅ Check-in Module");

      const { dashboard, timeline, detail } = modules.checkin;

      if (dashboard && timeline) {
        allPassed &= assertEqual(
          dashboard.totalCheckins,
          timeline.totalCheckins,
          "Dashboard vs Timeline: Total Check-ins"
        );
      }

      // Check sum by service equals total
      if (dashboard && dashboard.byService) {
        const sumByService = Object.values(dashboard.byService).reduce(
          (sum, val) => sum + val,
          0
        );
        allPassed &= assertEqual(
          dashboard.totalCheckins,
          sumByService,
          "Total Check-ins = Sum by Service"
        );
      }

      console.groupEnd();
    }

    // Membership consistency checks
    if (modules.membership) {
      console.group("👥 Membership Module");

      const { dashboard, detail } = modules.membership;

      if (dashboard && detail) {
        // Check sum of status categories
        const sumByStatus =
          (dashboard.activeCount || 0) +
          (dashboard.frozenCount || 0) +
          (dashboard.expiredCount || 0);
        if (dashboard.totalMembers !== undefined) {
          allPassed &= assertEqual(
            dashboard.totalMembers,
            sumByStatus,
            "Total Members = Sum of Status Categories"
          );
        }
      }

      console.groupEnd();
    }

    // Cross-module consistency checks
    console.group("🔄 Cross-Module Checks");

    // Check that revenue booking count matches booking count
    if (modules.revenue && modules.booking) {
      const revenueBookingCount = modules.revenue.bookingCount;
      const bookingCompleted = modules.booking.dashboard?.completed;

      if (revenueBookingCount !== undefined && bookingCompleted !== undefined) {
        allPassed &= assertEqual(
          revenueBookingCount,
          bookingCompleted,
          "Revenue Booking Count = Completed Bookings"
        );
      }
    }

    // Check that checkin count matches completed bookings
    if (modules.checkin && modules.booking) {
      const checkinCount = modules.checkin.dashboard?.totalCheckins;
      const bookingCompleted = modules.booking.dashboard?.completed;

      if (checkinCount !== undefined && bookingCompleted !== undefined) {
        // Note: This might not always be 1:1, but should be close
        const diff = Math.abs(checkinCount - bookingCompleted);
        const tolerance = Math.max(checkinCount, bookingCompleted) * 0.1; // 10% tolerance

        if (diff <= tolerance) {
          console.log(
            `✅ Check-ins (${checkinCount}) ≈ Completed Bookings (${bookingCompleted})`
          );
        } else {
          console.warn(
            `⚠️ Check-ins (${checkinCount}) differs from Completed Bookings (${bookingCompleted})`
          );
        }
      }
    }

    console.groupEnd();

    console.groupEnd();

    if (allPassed) {
      console.log("✅ All consistency checks passed");
    } else {
      console.warn("⚠️ Some consistency checks failed");
    }

    return allPassed;
  }

  /**
   * Validate data integrity
   * Checks that data arrays are not corrupted
   */
  function validateDataIntegrity(dataSource) {
    console.group("🔍 Data Integrity Validation");

    let valid = true;

    // Check bookings
    if (!Array.isArray(dataSource.bookings)) {
      console.error("❌ Bookings is not an array");
      valid = false;
    } else {
      console.log(`✅ Bookings: ${dataSource.bookings.length} records`);

      // Check for null/undefined in critical fields
      const invalidBookings = dataSource.bookings.filter(
        (b) => !b.id || !b.status
      );
      if (invalidBookings.length > 0) {
        console.warn(
          `⚠️ Found ${invalidBookings.length} bookings with missing id or status`
        );
      }
    }

    // Check checkins
    if (!Array.isArray(dataSource.checkins)) {
      console.error("❌ Check-ins is not an array");
      valid = false;
    } else {
      console.log(`✅ Check-ins: ${dataSource.checkins.length} records`);
    }

    // Check revenues
    if (!Array.isArray(dataSource.revenues)) {
      console.error("❌ Revenues is not an array");
      valid = false;
    } else {
      console.log(`✅ Revenues: ${dataSource.revenues.length} records`);
    }

    // Check members
    if (!Array.isArray(dataSource.members)) {
      console.error("❌ Members is not an array");
      valid = false;
    } else {
      console.log(`✅ Members: ${dataSource.members.length} records`);
    }

    console.groupEnd();

    return valid;
  }

  /**
   * Check filter state validity
   */
  function validateState(state) {
    console.group("🔍 State Validation");

    let valid = true;

    if (!state) {
      console.error("❌ State is undefined");
      return false;
    }

    // Check required fields
    if (!state.timeKey) {
      console.warn("⚠️ timeKey is missing");
    } else {
      console.log(`✅ timeKey: ${state.timeKey}`);
    }

    // Check date range consistency
    if (state.from && state.to) {
      const from = new Date(state.from);
      const to = new Date(state.to);

      if (from > to) {
        console.error("❌ from date is after to date");
        valid = false;
      } else {
        console.log(`✅ Date range: ${state.from} to ${state.to}`);
      }
    }

    // Check filter values
    console.log(`✅ location: ${state.location}`);
    console.log(`✅ service: ${state.service}`);

    console.groupEnd();

    return valid;
  }

  /**
   * Log computed results for debugging
   */
  function logComputedResults(results, moduleName) {
    console.group(`📊 ${moduleName} Computed Results`);

    Object.entries(results).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        console.group(key);
        Object.entries(value).forEach(([k, v]) => {
          console.log(`  ${k}: ${v}`);
        });
        console.groupEnd();
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    console.groupEnd();
  }

  // Expose to window
  window.Reconcile = {
    assertConsistency,
    validateDataIntegrity,
    validateState,
    logComputedResults,
  };

  console.log("✅ Reconcile module ready");
})(window);

