/**
 * API Services
 * Specific API endpoints for each module
 */

(function (window) {
  "use strict";

  /**
   * Revenue API Service
   */
  class RevenueAPI {
    constructor(apiClient) {
      this.client = apiClient;
    }

    // Get MTD revenue
    async getMTD(filters = {}) {
      return this.client.get("/revenue/mtd", { params: filters });
    }

    // Get daily revenue
    async getDaily(date) {
      return this.client.get(`/revenue/daily/${date}`);
    }

    // Get revenue by service
    async getByService(dateRange = {}) {
      return this.client.get("/revenue/by-service", { params: dateRange });
    }

    // Get revenue by location
    async getByLocation(dateRange = {}) {
      return this.client.get("/revenue/by-location", { params: dateRange });
    }

    // Get revenue by payment
    async getByPayment(dateRange = {}) {
      return this.client.get("/revenue/by-payment", { params: dateRange });
    }

    // Get revenue by staff
    async getByStaff(dateRange = {}) {
      return this.client.get("/revenue/by-staff", { params: dateRange });
    }

    // Get revenue target progress
    async getTargetProgress() {
      return this.client.get("/revenue/target-progress");
    }
  }

  /**
   * Booking API Service
   */
  class BookingAPI {
    constructor(apiClient) {
      this.client = apiClient;
    }

    // Get today's bookings
    async getToday() {
      return this.client.get("/bookings/today");
    }

    // Get yesterday's bookings
    async getYesterday() {
      return this.client.get("/bookings/yesterday");
    }

    // Get this week's bookings
    async getThisWeek() {
      return this.client.get("/bookings/this-week");
    }

    // Get MTD bookings
    async getMTD() {
      return this.client.get("/bookings/mtd");
    }

    // Get bookings by date range
    async getByDateRange(startDate, endDate) {
      return this.client.get("/bookings/range", {
        params: { start: startDate, end: endDate },
      });
    }

    // Get booking details
    async getDetails(bookingId) {
      return this.client.get(`/bookings/${bookingId}`);
    }

    // Create booking
    async create(bookingData) {
      return this.client.post("/bookings", bookingData);
    }

    // Update booking
    async update(bookingId, bookingData) {
      return this.client.put(`/bookings/${bookingId}`, bookingData);
    }

    // Cancel booking
    async cancel(bookingId) {
      return this.client.post(`/bookings/${bookingId}/cancel`);
    }
  }

  /**
   * Checkin API Service
   */
  class CheckinAPI {
    constructor(apiClient) {
      this.client = apiClient;
    }

    // Get today's check-ins
    async getToday() {
      return this.client.get("/checkins/today");
    }

    // Get yesterday's check-ins
    async getYesterday() {
      return this.client.get("/checkins/yesterday");
    }

    // Get MTD check-ins
    async getMTD() {
      return this.client.get("/checkins/mtd");
    }

    // Get check-ins by service
    async getByService(service, dateRange = {}) {
      return this.client.get(`/checkins/service/${service}`, {
        params: dateRange,
      });
    }

    // Get check-ins by location
    async getByLocation(location, dateRange = {}) {
      return this.client.get(`/checkins/location/${location}`, {
        params: dateRange,
      });
    }

    // Record check-in
    async recordCheckin(checkinData) {
      return this.client.post("/checkins", checkinData);
    }
  }

  /**
   * Visitor API Service
   */
  class VisitorAPI {
    constructor(apiClient) {
      this.client = apiClient;
    }

    // Get today's visitors
    async getToday() {
      return this.client.get("/visitors/today");
    }

    // Get yesterday's visitors
    async getYesterday() {
      return this.client.get("/visitors/yesterday");
    }

    // Get MTD visitors
    async getMTD() {
      return this.client.get("/visitors/mtd");
    }

    // Get visitor stats
    async getStats(dateRange = {}) {
      return this.client.get("/visitors/stats", { params: dateRange });
    }

    // Get conversion metrics
    async getConversionMetrics(dateRange = {}) {
      return this.client.get("/visitors/conversion", { params: dateRange });
    }

    // Record visitor
    async recordVisitor(visitorData) {
      return this.client.post("/visitors", visitorData);
    }

    // Update visitor
    async updateVisitor(visitorId, visitorData) {
      return this.client.put(`/visitors/${visitorId}`, visitorData);
    }
  }

  // Initialize services with default API client
  if (typeof window.apiClient !== "undefined") {
    window.revenueAPI = new RevenueAPI(window.apiClient);
    window.bookingAPI = new BookingAPI(window.apiClient);
    window.checkinAPI = new CheckinAPI(window.apiClient);
    window.visitorAPI = new VisitorAPI(window.apiClient);

    console.log("✅ API Services initialized:");
    console.log("   💰 Revenue API ready");
    console.log("   📅 Booking API ready");
    console.log("   ✅ Checkin API ready");
    console.log("   👥 Visitor API ready");
  } else {
    console.error("❌ APIClient not found. Load api-client.js first!");
  }
})(window);
