/**
 * Checkin Calculations Module
 * Calculate check-in statistics and metrics
 */

(function (window) {
  "use strict";

  class CheckinCalculations {
    constructor() {
      this.cache = new Map();
    }

    /**
     * Calculate total check-ins
     * @param {Array} checkins - Checkin data array
     * @returns {number} Total check-ins
     */
    calculateTotalCheckins(checkins) {
      return checkins.length;
    }

    /**
     * Calculate check-ins by service
     * @param {Array} checkins - Checkin data array
     * @param {Array} services - List of services
     * @returns {Object} Check-ins grouped by service
     */
    calculateByService(checkins, services) {
      const byService = {};

      services.forEach((service) => {
        byService[service] = checkins.filter(
          (c) => c.service === service
        ).length;
      });

      return byService;
    }

    /**
     * Calculate check-ins by location
     * @param {Array} checkins - Checkin data array
     * @param {Array} locations - List of locations
     * @returns {Object} Check-ins grouped by location
     */
    calculateByLocation(checkins, locations) {
      const byLocation = {};

      locations.forEach((location) => {
        byLocation[location] = checkins.filter(
          (c) => c.location === location
        ).length;
      });

      return byLocation;
    }

    /**
     * Calculate check-ins by time slot
     * @param {Array} checkins - Checkin data array
     * @returns {Object} Check-ins grouped by time slot
     */
    calculateByTimeSlot(checkins) {
      const byTimeSlot = {};

      checkins.forEach((c) => {
        const hour = parseInt(c.time.split(":")[0]);
        const slot = `${hour}:00`;

        if (!byTimeSlot[slot]) {
          byTimeSlot[slot] = 0;
        }
        byTimeSlot[slot]++;
      });

      return byTimeSlot;
    }

    /**
     * Calculate peak check-in hours
     * @param {Array} checkins - Checkin data array
     * @param {number} topN - Number of top hours
     * @returns {Array} Top N peak hours
     */
    calculatePeakHours(checkins, topN = 5) {
      const byTimeSlot = this.calculateByTimeSlot(checkins);

      return Object.entries(byTimeSlot)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([time, count]) => ({ time, count }));
    }

    /**
     * Calculate average check-ins per day
     * @param {Array} checkins - Checkin data array
     * @param {number} days - Number of days
     * @returns {number} Average check-ins per day
     */
    calculateAveragePerDay(checkins, days) {
      return days > 0 ? checkins.length / days : 0;
    }

    /**
     * Calculate daily check-ins
     * @param {Array} checkins - Checkin data array
     * @param {Date} date - Target date
     * @returns {Array} Check-ins for that date
     */
    calculateDailyCheckins(checkins, date = new Date()) {
      const targetDate = this.formatDate(date);
      return checkins.filter((c) => this.formatDate(c.date) === targetDate);
    }

    /**
     * Calculate percentage distribution
     * @param {Object} checkinsByCategory - Check-ins grouped by category
     * @returns {Object} Percentage distribution
     */
    calculatePercentageDistribution(checkinsByCategory) {
      const total = Object.values(checkinsByCategory).reduce(
        (sum, count) => sum + count,
        0
      );

      const distribution = {};

      Object.keys(checkinsByCategory).forEach((category) => {
        distribution[category] =
          total > 0 ? (checkinsByCategory[category] / total) * 100 : 0;
      });

      return distribution;
    }

    // Helper Methods

    /**
     * Format date to YYYY-MM-DD
     * @param {Date|string} date - Date to format
     * @returns {string}
     */
    formatDate(date) {
      const d = typeof date === "string" ? new Date(date) : date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    /**
     * Clear cache
     */
    clearCache() {
      this.cache.clear();
    }
  }

  // Export to global scope
  window.CheckinCalculations = CheckinCalculations;

  // Create global instance
  window.checkinCalc = new CheckinCalculations();

  console.log("✅ Checkin Calculations Module loaded");
})(window);
