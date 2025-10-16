/**
 * Booking Calculations Module
 * Calculate booking statistics and metrics
 */

(function (window) {
  "use strict";

  class BookingCalculations {
    constructor() {
      this.cache = new Map();
    }

    /**
     * Calculate total bookings
     * @param {Array} bookings - Booking data array
     * @returns {number} Total bookings
     */
    calculateTotalBookings(bookings) {
      return bookings.length;
    }

    /**
     * Calculate bookings by status
     * @param {Array} bookings - Booking data array
     * @returns {Object} Bookings grouped by status
     */
    calculateByStatus(bookings) {
      const byStatus = {
        completed: 0,
        pending: 0,
        cancelled: 0,
        total: bookings.length,
      };

      bookings.forEach((b) => {
        if (b.status === "completed") byStatus.completed++;
        else if (b.status === "pending") byStatus.pending++;
        else if (b.status === "cancelled") byStatus.cancelled++;
      });

      return byStatus;
    }

    /**
     * Calculate bookings for a specific date
     * @param {Array} bookings - Booking data array
     * @param {Date} date - Target date
     * @returns {Array} Bookings for that date
     */
    calculateDailyBookings(bookings, date = new Date()) {
      const targetDate = this.formatDate(date);
      return bookings.filter((b) => this.formatDate(b.date) === targetDate);
    }

    /**
     * Calculate bookings by service
     * @param {Array} bookings - Booking data array
     * @param {Array} services - List of services
     * @returns {Object} Bookings grouped by service
     */
    calculateByService(bookings, services) {
      const byService = {};

      services.forEach((service) => {
        byService[service] = bookings.filter(
          (b) => b.service === service
        ).length;
      });

      return byService;
    }

    /**
     * Calculate bookings by location
     * @param {Array} bookings - Booking data array
     * @param {Array} locations - List of locations
     * @returns {Object} Bookings grouped by location
     */
    calculateByLocation(bookings, locations) {
      const byLocation = {};

      locations.forEach((location) => {
        byLocation[location] = bookings.filter(
          (b) => b.location === location
        ).length;
      });

      return byLocation;
    }

    /**
     * Calculate bookings by time slot
     * @param {Array} bookings - Booking data array
     * @returns {Object} Bookings grouped by time slot
     */
    calculateByTimeSlot(bookings) {
      const byTimeSlot = {};

      bookings.forEach((b) => {
        const hour = parseInt(b.time.split(":")[0]);
        const slot = `${hour}:00`;

        if (!byTimeSlot[slot]) {
          byTimeSlot[slot] = 0;
        }
        byTimeSlot[slot]++;
      });

      return byTimeSlot;
    }

    /**
     * Calculate peak hours
     * @param {Array} bookings - Booking data array
     * @param {number} topN - Number of top hours to return
     * @returns {Array} Top N peak hours
     */
    calculatePeakHours(bookings, topN = 5) {
      const byTimeSlot = this.calculateByTimeSlot(bookings);

      return Object.entries(byTimeSlot)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([time, count]) => ({ time, count }));
    }

    /**
     * Calculate average bookings per day
     * @param {Array} bookings - Booking data array
     * @param {number} days - Number of days
     * @returns {number} Average bookings per day
     */
    calculateAveragePerDay(bookings, days) {
      return days > 0 ? bookings.length / days : 0;
    }

    /**
     * Calculate booking completion rate
     * @param {Array} bookings - Booking data array
     * @returns {number} Completion rate percentage
     */
    calculateCompletionRate(bookings) {
      const completed = bookings.filter((b) => b.status === "completed").length;
      return bookings.length > 0 ? (completed / bookings.length) * 100 : 0;
    }

    /**
     * Calculate no-show rate
     * @param {Array} bookings - Booking data array
     * @returns {number} No-show rate percentage
     */
    calculateNoShowRate(bookings) {
      const noShows = bookings.filter((b) => b.status === "no-show").length;
      return bookings.length > 0 ? (noShows / bookings.length) * 100 : 0;
    }

    /**
     * Calculate cancellation rate
     * @param {Array} bookings - Booking data array
     * @returns {number} Cancellation rate percentage
     */
    calculateCancellationRate(bookings) {
      const cancelled = bookings.filter((b) => b.status === "cancelled").length;
      return bookings.length > 0 ? (cancelled / bookings.length) * 100 : 0;
    }

    /**
     * Calculate bookings for current week
     * @param {Array} bookings - Booking data array
     * @param {Date} currentDate - Current date
     * @returns {Array} Week bookings
     */
    calculateWeeklyBookings(bookings, currentDate = new Date()) {
      const weekStart = this.getWeekStart(currentDate);
      const weekEnd = this.getWeekEnd(currentDate);

      return bookings.filter((b) => {
        const bookingDate = new Date(b.date);
        return bookingDate >= weekStart && bookingDate <= weekEnd;
      });
    }

    /**
     * Calculate bookings for current month
     * @param {Array} bookings - Booking data array
     * @param {Date} currentDate - Current date
     * @returns {Array} Month bookings
     */
    calculateMonthlyBookings(bookings, currentDate = new Date()) {
      return bookings.filter((b) => this.isCurrentMonth(b.date, currentDate));
    }

    /**
     * Calculate percentage distribution
     * @param {Object} bookingsByCategory - Bookings grouped by category
     * @returns {Object} Percentage distribution
     */
    calculatePercentageDistribution(bookingsByCategory) {
      const total = Object.values(bookingsByCategory).reduce(
        (sum, count) => sum + count,
        0
      );

      const distribution = {};

      Object.keys(bookingsByCategory).forEach((category) => {
        distribution[category] =
          total > 0 ? (bookingsByCategory[category] / total) * 100 : 0;
      });

      return distribution;
    }

    // Helper Methods

    /**
     * Get start of week (Monday)
     * @param {Date} date - Reference date
     * @returns {Date} Start of week
     */
    getWeekStart(date) {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      return new Date(d.setDate(diff));
    }

    /**
     * Get end of week (Sunday)
     * @param {Date} date - Reference date
     * @returns {Date} End of week
     */
    getWeekEnd(date) {
      const weekStart = this.getWeekStart(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return weekEnd;
    }

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
     * Clear cache
     */
    clearCache() {
      this.cache.clear();
    }
  }

  // Export to global scope
  window.BookingCalculations = BookingCalculations;

  // Create global instance
  window.bookingCalc = new BookingCalculations();
})(window);
