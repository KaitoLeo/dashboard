/**
 * Universal Page Integration Template
 * Quick integration for any page with minimal code
 */

(function (window) {
  "use strict";

  class UniversalPageIntegration {
    constructor(config) {
      this.pageType = config.pageType; // 'revenue', 'booking', 'checkin', 'visitor'
      this.period = config.period; // 'today', 'yesterday', 'week', 'mtd'
      this.elements = config.elements || {}; // Element IDs to update
      this.charts = config.charts || []; // Chart configurations
      this.autoRefresh = config.autoRefresh !== false;
      this.refreshInterval = config.refreshInterval || 300000; // 5 minutes
    }

    /**
     * Initialize page with dynamic data
     */
    async init() {
      console.log(
        `🚀 Initializing ${this.pageType} ${this.period} page with Universal Integration`
      );

      try {
        // Load data
        const data = await this.loadData();

        // Update metrics
        this.updateMetrics(data);

        // Update charts if any
        if (this.charts.length > 0) {
          this.updateCharts(data);
        }

        // Setup auto-refresh
        if (this.autoRefresh) {
          this.setupAutoRefresh();
        }

        console.log(`✅ Page initialized successfully`);
      } catch (error) {
        console.error(`❌ Error initializing page:`, error);
      }
    }

    /**
     * Load data based on page type and period
     */
    async loadData() {
      const dataKey = this.getDataKey();

      // Try to get from global mock data first
      if (window[dataKey]) {
        console.log(`📦 Using mock data: ${dataKey}`);
        return window[dataKey];
      }

      // Try to fetch from API
      try {
        const apiMethod = this.getAPIMethod();
        if (apiMethod) {
          console.log(`🌐 Fetching from API...`);
          const response = await apiMethod();
          return window.dataAdapter.transformRevenue(response.data);
        }
      } catch (error) {
        console.warn(`⚠️ API fetch failed, using mock data:`, error.message);
      }

      // Fallback to empty array
      return [];
    }

    /**
     * Get data key for global mock data
     */
    getDataKey() {
      const keyMap = {
        revenue: {
          today: "todayRevenue",
          yesterday: "yesterdayRevenue",
          mtd: "currentMonthRevenue",
          month: "currentMonthRevenue",
        },
        booking: {
          today: "todayBookings",
          yesterday: "yesterdayBookings",
          week: "thisWeekBookings",
          mtd: "mtdBookings",
        },
        checkin: {
          today: "todayCheckins",
          yesterday: "yesterdayCheckins",
          mtd: "mtdCheckins",
        },
        visitor: {
          today: "todayVisitors",
          yesterday: "yesterdayVisitors",
          mtd: "mtdVisitors",
        },
      };

      return keyMap[this.pageType]?.[this.period] || null;
    }

    /**
     * Get API method based on page type and period
     */
    getAPIMethod() {
      const apiMap = {
        revenue: window.revenueAPI,
        booking: window.bookingAPI,
        checkin: window.checkinAPI,
        visitor: window.visitorAPI,
      };

      const api = apiMap[this.pageType];
      if (!api) return null;

      const methodMap = {
        today: "getToday",
        yesterday: "getYesterday",
        week: "getThisWeek",
        mtd: "getMTD",
      };

      const methodName = methodMap[this.period];
      return methodName && api[methodName] ? api[methodName].bind(api) : null;
    }

    /**
     * Update page metrics
     */
    updateMetrics(data) {
      const calc = this.getCalculator();
      if (!calc) {
        console.warn(`⚠️ Calculator not found for ${this.pageType}`);
        return;
      }

      // Calculate metrics based on page type
      let metrics = {};

      if (this.pageType === "revenue") {
        metrics = this.calculateRevenueMetrics(data, calc);
      } else if (this.pageType === "booking") {
        metrics = this.calculateBookingMetrics(data, calc);
      } else if (this.pageType === "checkin") {
        metrics = this.calculateCheckinMetrics(data, calc);
      } else if (this.pageType === "visitor") {
        metrics = this.calculateVisitorMetrics(data, calc);
      }

      // Update DOM elements
      Object.keys(this.elements).forEach((key) => {
        const elementId = this.elements[key];
        const value = metrics[key];

        if (value !== undefined) {
          this.updateElement(elementId, value);
        }
      });
    }

    /**
     * Calculate revenue metrics
     */
    calculateRevenueMetrics(data, calc) {
      return {
        total: calc.formatCurrency(data.reduce((sum, r) => sum + r.amount, 0)),
        count: data.length,
        average: calc.formatCurrency(
          data.reduce((sum, r) => sum + r.amount, 0) / data.length || 0
        ),
      };
    }

    /**
     * Calculate booking metrics
     */
    calculateBookingMetrics(data, calc) {
      const byStatus = calc.calculateByStatus(data);
      return {
        total: byStatus.total,
        completed: byStatus.completed,
        pending: byStatus.pending,
        cancelled: byStatus.cancelled,
        completionRate: calc.calculateCompletionRate(data).toFixed(1) + "%",
      };
    }

    /**
     * Calculate checkin metrics
     */
    calculateCheckinMetrics(data, calc) {
      return {
        total: calc.calculateTotalCheckins(data),
        average: calc.calculateAveragePerDay(data, 1).toFixed(0),
      };
    }

    /**
     * Calculate visitor metrics
     */
    calculateVisitorMetrics(data, calc) {
      const conversion = calc.calculateConversionRates(data);
      return {
        total: conversion.total,
        converted: conversion.converted,
        conversionRate: conversion.conversionRate.toFixed(1) + "%",
        ptTiepRate: conversion.ptTiepRate.toFixed(1) + "%",
        inbodyRate: conversion.inbodyRate.toFixed(1) + "%",
      };
    }

    /**
     * Get calculator instance
     */
    getCalculator() {
      const calcMap = {
        revenue: window.revenueCalc,
        booking: window.bookingCalc,
        checkin: window.checkinCalc,
        visitor: window.visitorCalc,
      };

      return calcMap[this.pageType];
    }

    /**
     * Update DOM element
     */
    updateElement(elementId, value) {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = value;
      }
    }

    /**
     * Update charts (placeholder for now)
     */
    updateCharts(data) {
      console.log(`📊 Updating ${this.charts.length} charts`);
      // Chart update logic would go here
    }

    /**
     * Setup auto-refresh
     */
    setupAutoRefresh() {
      setInterval(() => {
        console.log(`🔄 Auto-refreshing ${this.pageType} ${this.period} page`);
        this.init();
      }, this.refreshInterval);

      console.log(
        `✅ Auto-refresh enabled (${this.refreshInterval / 1000}s interval)`
      );
    }
  }

  // Export to global scope
  window.UniversalPageIntegration = UniversalPageIntegration;

  /**
   * Helper function to quickly integrate a page
   */
  window.quickIntegrate = function (config) {
    const integration = new UniversalPageIntegration(config);
    window.addEventListener("load", () => integration.init());
    return integration;
  };

  console.log("✅ Universal Page Integration Template loaded");
})(window);
