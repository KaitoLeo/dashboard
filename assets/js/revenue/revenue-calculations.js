/**
 * Revenue Calculations Module
 * Tập trung tất cả công thức tính toán Revenue
 * Tuân thủ chuẩn ISO 25010 - Accuracy & Precision
 */

(function (window) {
  "use strict";

  class RevenueCalculations {
    constructor() {
      this.cache = new Map();
    }

    /**
     * Calculate MTD (Month-To-Date) Revenue
     * @param {Array} revenue - Revenue data array
     * @param {Date} currentDate - Current date
     * @returns {number} Total MTD revenue
     */
    calculateMTDRevenue(revenue, currentDate = new Date()) {
      const cacheKey = `mtd_${currentDate.getMonth()}_${currentDate.getFullYear()}`;

      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const mtdRevenue = revenue
        .filter((r) => this.isCurrentMonth(r.date, currentDate))
        .reduce((sum, r) => sum + (r.amount || 0), 0);

      this.cache.set(cacheKey, mtdRevenue);
      return mtdRevenue;
    }

    /**
     * Calculate Daily Revenue
     * @param {Array} revenue - Revenue data array
     * @param {Date} date - Target date
     * @returns {number} Daily revenue
     */
    calculateDailyRevenue(revenue, date = new Date()) {
      const targetDate = this.formatDate(date);

      return revenue
        .filter((r) => this.formatDate(r.date) === targetDate)
        .reduce((sum, r) => sum + (r.amount || 0), 0);
    }

    /**
     * Calculate Revenue Growth Rate
     * @param {number} currentRevenue - Current period revenue
     * @param {number} previousRevenue - Previous period revenue
     * @returns {number} Growth rate percentage
     */
    calculateRevenueGrowth(currentRevenue, previousRevenue) {
      if (previousRevenue === 0) return 0;
      return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    }

    /**
     * Calculate Revenue by Service
     * @param {Array} revenue - Revenue data array
     * @param {Array} services - List of services
     * @returns {Object} Revenue grouped by service
     */
    calculateRevenueByService(revenue, services) {
      const revenueByService = {};

      services.forEach((service) => {
        revenueByService[service] = revenue
          .filter((r) => r.service === service)
          .reduce((sum, r) => sum + (r.amount || 0), 0);
      });

      return revenueByService;
    }

    /**
     * Calculate Revenue by Location
     * @param {Array} revenue - Revenue data array
     * @param {Array} locations - List of locations
     * @returns {Object} Revenue grouped by location
     */
    calculateRevenueByLocation(revenue, locations) {
      const revenueByLocation = {};

      locations.forEach((location) => {
        revenueByLocation[location] = revenue
          .filter((r) => r.location === location)
          .reduce((sum, r) => sum + (r.amount || 0), 0);
      });

      return revenueByLocation;
    }

    /**
     * Calculate Revenue by Payment Method
     * @param {Array} revenue - Revenue data array
     * @param {Array} paymentMethods - List of payment methods
     * @returns {Object} Revenue grouped by payment method
     */
    calculateRevenueByPayment(revenue, paymentMethods) {
      const revenueByPayment = {};

      paymentMethods.forEach((method) => {
        revenueByPayment[method] = revenue
          .filter((r) => r.paymentMethod === method)
          .reduce((sum, r) => sum + (r.amount || 0), 0);
      });

      return revenueByPayment;
    }

    /**
     * Calculate Revenue by Staff
     * @param {Array} revenue - Revenue data array
     * @returns {Object} Revenue grouped by staff with metrics
     */
    calculateRevenueByStaff(revenue) {
      const revenueByStaff = {};

      revenue.forEach((r) => {
        if (!revenueByStaff[r.staff]) {
          revenueByStaff[r.staff] = {
            totalRevenue: 0,
            transactions: 0,
            avgTransaction: 0,
          };
        }

        revenueByStaff[r.staff].totalRevenue += r.amount || 0;
        revenueByStaff[r.staff].transactions += 1;
      });

      // Calculate average transaction for each staff
      Object.keys(revenueByStaff).forEach((staff) => {
        const data = revenueByStaff[staff];
        data.avgTransaction =
          data.transactions > 0 ? data.totalRevenue / data.transactions : 0;
      });

      return revenueByStaff;
    }

    /**
     * Calculate Target Progress
     * @param {number} actualRevenue - Actual revenue achieved
     * @param {number} targetRevenue - Target revenue
     * @returns {Object} Target progress metrics
     */
    calculateTargetProgress(actualRevenue, targetRevenue) {
      const completionRate =
        targetRevenue > 0 ? (actualRevenue / targetRevenue) * 100 : 0;
      const remaining = targetRevenue - actualRevenue;

      return {
        actual: actualRevenue,
        target: targetRevenue,
        completionRate: Math.round(completionRate * 10) / 10, // Round to 1 decimal
        remaining: remaining,
        achieved: actualRevenue >= targetRevenue,
      };
    }

    /**
     * Calculate Daily Average Revenue
     * @param {number} mtdRevenue - MTD revenue
     * @param {Date} currentDate - Current date
     * @returns {number} Daily average revenue
     */
    calculateDailyAverage(mtdRevenue, currentDate = new Date()) {
      const daysPassed = currentDate.getDate();
      return daysPassed > 0 ? mtdRevenue / daysPassed : 0;
    }

    /**
     * Calculate Days Remaining in Month
     * @param {Date} currentDate - Current date
     * @returns {number} Days remaining
     */
    calculateDaysRemaining(currentDate = new Date()) {
      const lastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      return lastDay - currentDate.getDate();
    }

    /**
     * Calculate Daily Target to Reach Monthly Goal
     * @param {number} remainingRevenue - Remaining revenue to reach target
     * @param {Date} currentDate - Current date
     * @returns {number} Daily target needed
     */
    calculateDailyTarget(remainingRevenue, currentDate = new Date()) {
      const daysRemaining = this.calculateDaysRemaining(currentDate);
      return daysRemaining > 0 ? remainingRevenue / daysRemaining : 0;
    }

    /**
     * Forecast Revenue for End of Month
     * @param {number} mtdRevenue - MTD revenue
     * @param {Date} currentDate - Current date
     * @returns {number} Forecasted end-of-month revenue
     */
    forecastRevenue(mtdRevenue, currentDate = new Date()) {
      const daysPassed = currentDate.getDate();
      const totalDaysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      if (daysPassed === 0) return 0;

      const dailyAverage = mtdRevenue / daysPassed;
      return dailyAverage * totalDaysInMonth;
    }

    /**
     * Calculate Estimated Completion Date
     * @param {number} mtdRevenue - MTD revenue
     * @param {number} targetRevenue - Target revenue
     * @param {Date} currentDate - Current date
     * @returns {Date|null} Estimated completion date or null if already achieved/unreachable
     */
    calculateCompletionDate(
      mtdRevenue,
      targetRevenue,
      currentDate = new Date()
    ) {
      if (mtdRevenue >= targetRevenue) return null; // Already achieved

      const daysPassed = currentDate.getDate();
      if (daysPassed === 0) return null;

      const dailyAverage = mtdRevenue / daysPassed;
      if (dailyAverage === 0) return null; // No revenue, can't estimate

      const remaining = targetRevenue - mtdRevenue;
      const daysNeeded = Math.ceil(remaining / dailyAverage);

      const completionDate = new Date(currentDate);
      completionDate.setDate(currentDate.getDate() + daysNeeded);

      return completionDate;
    }

    /**
     * Calculate Percentage Distribution
     * @param {Object} revenueByCategory - Revenue grouped by category
     * @returns {Object} Percentage distribution
     */
    calculatePercentageDistribution(revenueByCategory) {
      const totalRevenue = Object.values(revenueByCategory).reduce(
        (sum, amount) => sum + amount,
        0
      );

      const distribution = {};

      Object.keys(revenueByCategory).forEach((category) => {
        distribution[category] =
          totalRevenue > 0
            ? (revenueByCategory[category] / totalRevenue) * 100
            : 0;
      });

      return distribution;
    }

    /**
     * Calculate Revenue Comparison with Previous Period
     * @param {Array} currentRevenue - Current period revenue
     * @param {Array} previousRevenue - Previous period revenue
     * @returns {Object} Comparison metrics
     */
    calculateComparison(currentRevenue, previousRevenue) {
      const current = currentRevenue.reduce(
        (sum, r) => sum + (r.amount || 0),
        0
      );
      const previous = previousRevenue.reduce(
        (sum, r) => sum + (r.amount || 0),
        0
      );

      const difference = current - previous;
      const growthRate = this.calculateRevenueGrowth(current, previous);

      return {
        current,
        previous,
        difference,
        growthRate,
        increased: difference > 0,
      };
    }

    // Helper Methods

    /**
     * Check if date is in current month
     * @param {Date|string} date - Date to check
     * @param {Date} currentDate - Current date
     * @returns {boolean}
     */
    isCurrentMonth(date, currentDate = new Date()) {
      const checkDate = typeof date === "string" ? new Date(date) : date;
      return (
        checkDate.getMonth() === currentDate.getMonth() &&
        checkDate.getFullYear() === currentDate.getFullYear()
      );
    }

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
     * Format currency (VNĐ)
     * @param {number} amount - Amount to format
     * @returns {string}
     */
    formatCurrency(amount) {
      return Math.round(amount).toLocaleString("vi-VN");
    }

    /**
     * Clear cache
     */
    clearCache() {
      this.cache.clear();
    }
  }

  // Export to global scope
  window.RevenueCalculations = RevenueCalculations;

  // Create global instance
  window.revenueCalc = new RevenueCalculations();
})(window);
