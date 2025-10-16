/**
 * Compute KPI - All KPI Formulas (Single Source of Truth)
 * All calculations follow standardized formulas to ensure consistency
 */
(function (window) {
  "use strict";

  // Safe division to avoid divide-by-zero
  function safeDivide(numerator, denominator, defaultValue = 0) {
    if (!denominator || denominator === 0) return defaultValue;
    return numerator / denominator;
  }

  // Calculate average with safe handling
  function average(values) {
    if (!values || values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (val || 0), 0);
    return sum / values.length;
  }

  // Calculate median
  function median(values) {
    if (!values || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
  }

  /**
   * ========================================
   * BOOKING KPIs
   * ========================================
   */

  /**
   * Total Bookings = confirmed + pending + cancelled
   */
  function totalBookings(bookings) {
    if (!bookings) return 0;
    return bookings.filter((b) =>
      ["confirmed", "pending", "cancelled"].includes(b.status)
    ).length;
  }

  /**
   * Confirmation Ratio = confirmed / (confirmed + pending + cancelled)
   * Returns value between 0 and 1 (multiply by 100 for percentage)
   */
  function confirmationRatio(bookings) {
    if (!bookings || bookings.length === 0) return 0;

    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const total = confirmed + pending + cancelled;

    return safeDivide(confirmed, total, 0);
  }

  /**
   * Cancellation Rate = cancelled / (confirmed + pending + cancelled)
   */
  function cancellationRate(bookings) {
    if (!bookings || bookings.length === 0) return 0;

    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const total = confirmed + pending + cancelled;

    return safeDivide(cancelled, total, 0);
  }

  /**
   * No-Show Rate = noShow / (noShow + attended)
   * Note: We map 'noshow' status and 'completed' as attended
   */
  function noShowRate(bookings) {
    if (!bookings || bookings.length === 0) return 0;

    const noShow = bookings.filter((b) => b.status === "noshow").length;
    const attended = bookings.filter((b) => b.status === "completed").length;
    const total = noShow + attended;

    return safeDivide(noShow, total, 0);
  }

  /**
   * Utilization = sum(attended) / sum(capacity)
   * This requires capacity data, which we don't have yet, so we'll estimate
   */
  function utilization(bookings, capacityData) {
    if (!bookings || bookings.length === 0) return 0;

    const attended = bookings.filter((b) => b.status === "completed").length;

    // If we have capacity data, use it
    if (capacityData && capacityData.totalCapacity) {
      return safeDivide(attended, capacityData.totalCapacity, 0);
    }

    // Otherwise, estimate: assume 80% capacity means full
    // This is a placeholder until we have real capacity data
    const estimatedCapacity = attended / 0.7; // Assume 70% utilization
    return safeDivide(attended, estimatedCapacity, 0);
  }

  /**
   * Average Lead Time (hours) = AVG((startTime - bookingTime) in hours)
   */
  function avgLeadHours(bookings) {
    if (!bookings || bookings.length === 0) return 0;

    const leadTimes = bookings
      .filter((b) => b.date && b.bookingTime)
      .map((b) => {
        const startTime = b.date.getTime();
        const bookingTime = b.bookingTime.getTime();
        const diffMs = startTime - bookingTime;
        return diffMs / (1000 * 60 * 60); // Convert to hours
      })
      .filter((hours) => hours >= 0); // Only positive lead times

    return average(leadTimes);
  }

  /**
   * Get bookings count by status
   */
  function bookingsByStatus(bookings) {
    if (!bookings) {
      return {
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0,
        noshow: 0,
      };
    }

    return {
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      noshow: bookings.filter((b) => b.status === "noshow").length,
    };
  }

  /**
   * Get bookings by service
   */
  function bookingsByService(bookings) {
    if (!bookings) return {};

    const byService = {};
    bookings.forEach((b) => {
      const service = b.serviceName || "Other";
      byService[service] = (byService[service] || 0) + 1;
    });

    return byService;
  }

  /**
   * ========================================
   * CHECK-IN KPIs
   * ========================================
   */

  /**
   * Total Check-ins
   */
  function totalCheckins(checkins) {
    return checkins ? checkins.length : 0;
  }

  /**
   * Day-over-Day Change = (today - yesterday) / yesterday
   */
  function dayOverDay(checkinsToday, checkinsYesterday) {
    return safeDivide(checkinsToday - checkinsYesterday, checkinsYesterday, 0);
  }

  /**
   * Peak Hour = hour with maximum check-ins
   */
  function peakHour(checkins) {
    if (!checkins || checkins.length === 0) return null;

    const byHour = {};
    checkins.forEach((c) => {
      if (c.date) {
        const hour = c.date.getHours();
        byHour[hour] = (byHour[hour] || 0) + 1;
      } else if (c.time) {
        const hour = parseInt(c.time.split(":")[0]);
        byHour[hour] = (byHour[hour] || 0) + 1;
      }
    });

    let maxHour = null;
    let maxCount = 0;

    Object.entries(byHour).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = parseInt(hour);
      }
    });

    return maxHour;
  }

  /**
   * Peak Index = MAX(countByHour) / MEDIAN(countByHour)
   */
  function peakIndex(checkins) {
    if (!checkins || checkins.length === 0) return 0;

    const byHour = {};
    checkins.forEach((c) => {
      if (c.date) {
        const hour = c.date.getHours();
        byHour[hour] = (byHour[hour] || 0) + 1;
      } else if (c.time) {
        const hour = parseInt(c.time.split(":")[0]);
        byHour[hour] = (byHour[hour] || 0) + 1;
      }
    });

    const counts = Object.values(byHour);
    if (counts.length === 0) return 0;

    const maxCount = Math.max(...counts);
    const medianCount = median(counts);

    return safeDivide(maxCount, medianCount, 0);
  }

  /**
   * New vs Returning Members
   */
  function newVsReturning(checkins) {
    if (!checkins || checkins.length === 0) {
      return { new: 0, returning: 0 };
    }

    const total = checkins.length;
    const newMembers = checkins.filter((c) => c.isNew).length;
    const returning = total - newMembers;

    return { new: newMembers, returning };
  }

  /**
   * Check-ins by hour
   */
  function checkinsByHour(checkins) {
    if (!checkins) return {};

    const byHour = {};
    checkins.forEach((c) => {
      let hour;
      if (c.date) {
        hour = c.date.getHours();
      } else if (c.time) {
        hour = parseInt(c.time.split(":")[0]);
      } else {
        return;
      }
      byHour[hour] = (byHour[hour] || 0) + 1;
    });

    return byHour;
  }

  /**
   * Check-ins by service
   */
  function checkinsByService(checkins) {
    if (!checkins) return {};

    const byService = {};
    checkins.forEach((c) => {
      const service = c.serviceName || "Other";
      byService[service] = (byService[service] || 0) + 1;
    });

    return byService;
  }

  /**
   * ========================================
   * REVENUE KPIs
   * ========================================
   */

  /**
   * Total Revenue
   */
  function totalRevenue(revenues) {
    if (!revenues || revenues.length === 0) return 0;
    return revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  /**
   * MTD Completion = revenueMTD / targetMonth
   */
  function completionMTD(revenueMTD, targetMonth) {
    return safeDivide(revenueMTD, targetMonth, 0);
  }

  /**
   * Remaining to Target = targetMonth - revenueMTD
   */
  function remainingToTarget(revenueMTD, targetMonth) {
    return Math.max(0, targetMonth - revenueMTD);
  }

  /**
   * ARPB (Average Revenue Per Booking) = revenue / confirmedBookings
   */
  function arpb(revenue, confirmedBookings) {
    return safeDivide(revenue, confirmedBookings, 0);
  }

  /**
   * ARPM (Average Revenue Per Member) = revenue / activeMembers
   */
  function arpm(revenue, activeMembers) {
    return safeDivide(revenue, activeMembers, 0);
  }

  /**
   * Service Mix % = revenueByService[s] / totalRevenue
   */
  function serviceMixPercent(revenueByService, totalRev) {
    if (!revenueByService || totalRev === 0) return {};

    const mixPercent = {};
    Object.entries(revenueByService).forEach(([service, amount]) => {
      mixPercent[service] = safeDivide(amount, totalRev, 0) * 100;
    });

    return mixPercent;
  }

  /**
   * MTD Projection = (revenueMTD / elapsedDays) * totalDaysInMonth
   */
  function projectionMTD(revenueMTD, elapsedDays, totalDaysInMonth) {
    const dailyAverage = safeDivide(revenueMTD, elapsedDays, 0);
    return dailyAverage * totalDaysInMonth;
  }

  /**
   * Gap to Target = targetMonth - projectionMTD
   */
  function gapToTarget(targetMonth, projection) {
    return targetMonth - projection;
  }

  /**
   * Revenue by service
   */
  function revenueByService(revenues) {
    if (!revenues) return {};

    const byService = {};
    revenues.forEach((r) => {
      const service = r.serviceName || "Other";
      byService[service] = (byService[service] || 0) + r.amount;
    });

    return byService;
  }

  /**
   * Revenue by location
   */
  function revenueByLocation(revenues) {
    if (!revenues) return {};

    const byLocation = {};
    revenues.forEach((r) => {
      const locationId = r.locationId || "unknown";
      byLocation[locationId] = (byLocation[locationId] || 0) + (r.amount || 0);
    });

    return byLocation;
  }

  /**
   * ========================================
   * MEMBERSHIP KPIs (without session deduction)
   * ========================================
   */

  /**
   * Active Members Count
   */
  function activeCount(members) {
    if (!members) return 0;
    return members.filter((m) => m.status === "active").length;
  }

  /**
   * Frozen Members Count
   */
  function frozenCount(members) {
    if (!members) return 0;
    return members.filter((m) => m.status === "frozen").length;
  }

  /**
   * Expired Members Count
   */
  function expiredCount(members) {
    if (!members) return 0;
    return members.filter(
      (m) => m.status === "expired" || m.status === "inactive"
    ).length;
  }

  /**
   * Retention Rate = retained / lastPeriodActive
   * This requires historical data
   */
  function retention(currentActive, lastPeriodActive, newMembers) {
    const retained = currentActive - newMembers;
    return safeDivide(retained, lastPeriodActive, 0);
  }

  /**
   * Churn Rate = lost / lastPeriodActive
   */
  function churn(lost, lastPeriodActive) {
    return safeDivide(lost, lastPeriodActive, 0);
  }

  /**
   * Members by status
   */
  function membersByStatus(members) {
    if (!members) {
      return { active: 0, frozen: 0, expired: 0, inactive: 0 };
    }

    return {
      active: activeCount(members),
      frozen: frozenCount(members),
      expired: expiredCount(members),
      inactive: members.filter((m) => m.status === "inactive").length,
    };
  }

  /**
   * ========================================
   * AGGREGATED COMPUTE FUNCTION
   * Computes all KPIs for a given state
   * ========================================
   */
  function computeAllKPIs(state) {
    // Get data source
    const dataSource = window.DataSource;
    if (!dataSource) {
      console.error("DataSource not available");
      return null;
    }

    // Filter data by state
    const bookings = dataSource.filterByState(dataSource.bookings, state);
    const checkins = dataSource.filterByState(dataSource.checkins, state);
    const revenues = dataSource.filterByState(dataSource.revenues, state);
    const members = dataSource.members; // Members are not time-filtered

    // Booking KPIs
    const bookingKPIs = {
      totalBookings: totalBookings(bookings),
      byStatus: bookingsByStatus(bookings),
      byService: bookingsByService(bookings),
      confirmationRatio: confirmationRatio(bookings),
      cancellationRate: cancellationRate(bookings),
      noShowRate: noShowRate(bookings),
      utilization: utilization(bookings),
      avgLeadHours: avgLeadHours(bookings),
    };

    // Check-in KPIs
    const checkinKPIs = {
      totalCheckins: totalCheckins(checkins),
      byHour: checkinsByHour(checkins),
      byService: checkinsByService(checkins),
      peakHour: peakHour(checkins),
      peakIndex: peakIndex(checkins),
      newVsReturning: newVsReturning(checkins),
    };

    // Revenue KPIs
    const totalRev = totalRevenue(revenues);
    const byService = revenueByService(revenues);
    const byLocation = revenueByLocation(revenues);

    // Calculate MTD values
    const now = new Date();
    const elapsedDays = now.getDate();
    const totalDaysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    // Default target: 100M VND per month (adjust as needed)
    const targetMonth = 100000000;
    const projection = projectionMTD(totalRev, elapsedDays, totalDaysInMonth);

    const revenueKPIs = {
      totalRevenue: totalRev,
      byService: byService,
      byLocation: byLocation,
      completionMTD: completionMTD(totalRev, targetMonth),
      remainingToTarget: remainingToTarget(totalRev, targetMonth),
      arpb: arpb(totalRev, bookingKPIs.byStatus.confirmed),
      arpm: arpm(totalRev, activeCount(members)),
      serviceMixPercent: serviceMixPercent(byService, totalRev),
      projectionMTD: projection,
      gapToTarget: gapToTarget(targetMonth, projection),
      targetMonth: targetMonth,
    };

    // Membership KPIs
    const membershipKPIs = {
      byStatus: membersByStatus(members),
      activeCount: activeCount(members),
      frozenCount: frozenCount(members),
      expiredCount: expiredCount(members),
      // Retention and churn require historical data
      // For now, we'll provide placeholders
      retention: 0,
      churn: 0,
    };

    return {
      booking: bookingKPIs,
      checkin: checkinKPIs,
      revenue: revenueKPIs,
      membership: membershipKPIs,
      metadata: {
        state: state,
        dateRange: dataSource.getDateRange(state),
        generatedAt: new Date().toISOString(),
      },
    };
  }

  // Expose to window
  window.ComputeKPI = {
    // Booking functions
    totalBookings,
    confirmationRatio,
    cancellationRate,
    noShowRate,
    utilization,
    avgLeadHours,
    bookingsByStatus,
    bookingsByService,

    // Check-in functions
    totalCheckins,
    dayOverDay,
    peakHour,
    peakIndex,
    newVsReturning,
    checkinsByHour,
    checkinsByService,

    // Revenue functions
    totalRevenue,
    completionMTD,
    remainingToTarget,
    arpb,
    arpm,
    serviceMixPercent,
    projectionMTD,
    gapToTarget,
    revenueByService,
    revenueByLocation,

    // Membership functions
    activeCount,
    frozenCount,
    expiredCount,
    retention,
    churn,
    membersByStatus,

    // Main compute function
    computeAllKPIs,
  };

  console.log("✅ ComputeKPI module ready");
})(window);

