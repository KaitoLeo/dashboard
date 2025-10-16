/**
 * Visitor Calculations Module
 * Calculate visitor statistics and conversion rates
 */

(function (window) {
  "use strict";

  class VisitorCalculations {
    constructor() {
      this.cache = new Map();
    }

    /**
     * Calculate total visitors
     * @param {Array} visitors - Visitor data array
     * @returns {number} Total visitors
     */
    calculateTotalVisitors(visitors) {
      return visitors.length;
    }

    /**
     * Calculate visitors by department
     * @param {Array} visitors - Visitor data array
     * @param {Array} departments - List of departments
     * @returns {Object} Visitors grouped by department
     */
    calculateByDepartment(visitors, departments) {
      const byDepartment = {};

      departments.forEach((dept) => {
        byDepartment[dept] = visitors.filter(
          (v) => v.department === dept
        ).length;
      });

      return byDepartment;
    }

    /**
     * Calculate visitors by source
     * @param {Array} visitors - Visitor data array
     * @param {Array} sources - List of sources
     * @returns {Object} Visitors grouped by source
     */
    calculateBySource(visitors, sources) {
      const bySource = {};

      sources.forEach((source) => {
        bySource[source] = visitors.filter((v) => v.source === source).length;
      });

      return bySource;
    }

    /**
     * Calculate conversion rates
     * @param {Array} visitors - Visitor data array
     * @returns {Object} Conversion metrics
     */
    calculateConversionRates(visitors) {
      const total = visitors.length;
      const converted = visitors.filter((v) => v.converted === true).length;
      const ptTiep = visitors.filter(
        (v) => v.department === "PT Fitness"
      ).length;
      const saleTiep = visitors.filter(
        (v) => v.department === "Membership"
      ).length;
      const inbody = visitors.filter((v) => v.inbody === true).length;

      return {
        total,
        converted,
        conversionRate: total > 0 ? (converted / total) * 100 : 0,
        ptTiep,
        saleTiep,
        ptTiepRate: saleTiep > 0 ? (ptTiep / saleTiep) * 100 : 0,
        inbody,
        inbodyRate: total > 0 ? (inbody / total) * 100 : 0,
      };
    }

    /**
     * Calculate daily visitors
     * @param {Array} visitors - Visitor data array
     * @param {Date} date - Target date
     * @returns {Array} Visitors for that date
     */
    calculateDailyVisitors(visitors, date = new Date()) {
      const targetDate = this.formatDate(date);
      return visitors.filter((v) => this.formatDate(v.date) === targetDate);
    }

    /**
     * Calculate average visitors per day
     * @param {Array} visitors - Visitor data array
     * @param {number} days - Number of days
     * @returns {number} Average visitors per day
     */
    calculateAveragePerDay(visitors, days) {
      return days > 0 ? visitors.length / days : 0;
    }

    /**
     * Calculate percentage distribution
     * @param {Object} visitorsByCategory - Visitors grouped by category
     * @returns {Object} Percentage distribution
     */
    calculatePercentageDistribution(visitorsByCategory) {
      const total = Object.values(visitorsByCategory).reduce(
        (sum, count) => sum + count,
        0
      );

      const distribution = {};

      Object.keys(visitorsByCategory).forEach((category) => {
        distribution[category] =
          total > 0 ? (visitorsByCategory[category] / total) * 100 : 0;
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
  window.VisitorCalculations = VisitorCalculations;

  // Create global instance
  window.visitorCalc = new VisitorCalculations();

  console.log("✅ Visitor Calculations Module loaded");
})(window);
