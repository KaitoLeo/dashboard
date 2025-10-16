/**
 * Revenue Mock Data Generator
 * Generate realistic revenue data for testing and demo
 */

(function (window) {
  "use strict";

  /**
   * Generate Revenue Data
   * @param {Object} options - Generation options
   * @returns {Array} Revenue data array
   */
  function generateRevenueData(options = {}) {
    const {
      startDate = getFirstDayOfMonth(),
      endDate = new Date(),
      services = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"],
      locations = [
        "Tôn Thất Thuyết",
        "Huỳnh Thúc Kháng",
        "Giảng Võ",
        "Hào Nam",
        "Nguyễn Tuân",
      ],
      paymentMethods = [
        "Tiền mặt",
        "Chuyển khoản",
        "Thẻ tín dụng",
        "Ví điện tử",
      ],
      staff = [
        "Nguyễn Văn A",
        "Trần Thị B",
        "Lê Văn C",
        "Phạm Thị D",
        "Hoàng Văn E",
      ],
      targetMonthly = 3000000000, // 3 tỷ VNĐ
    } = options;

    const revenueData = [];
    const currentDate = new Date(startDate);

    // Base amounts for each service (monthly average)
    const serviceAmounts = {
      Membership: 12000000, // 12 triệu/transaction
      "PT Fitness": 8000000, // 8 triệu/transaction
      Pilates: 6000000, // 6 triệu/transaction
      "Swimming Coach": 5000000, // 5 triệu/transaction
    };

    // Location multipliers
    const locationMultipliers = {
      "Tôn Thất Thuyết": 1.2,
      "Huỳnh Thúc Kháng": 1.1,
      "Giảng Võ": 1.0,
      "Hào Nam": 0.9,
      "Nguyễn Tuân": 0.8,
    };

    // Generate revenue for each day
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // More transactions on weekdays
      const numTransactions = isWeekend
        ? Math.floor(Math.random() * 15) + 10
        : Math.floor(Math.random() * 25) + 20;

      for (let i = 0; i < numTransactions; i++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const location =
          locations[Math.floor(Math.random() * locations.length)];
        const paymentMethod =
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const staffMember = staff[Math.floor(Math.random() * staff.length)];

        // Calculate amount with variations
        const baseAmount = serviceAmounts[service];
        const locationMultiplier = locationMultipliers[location];
        const randomVariation = 0.8 + Math.random() * 0.4; // ±20% variation

        const amount = Math.round(
          baseAmount * locationMultiplier * randomVariation
        );

        // Generate random time
        const hour = 6 + Math.floor(Math.random() * 14); // 6:00 - 20:00
        const minute = Math.floor(Math.random() * 60);

        revenueData.push({
          id: revenueData.length + 1,
          date: new Date(currentDate),
          time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
            2,
            "0"
          )}`,
          service: service,
          location: location,
          paymentMethod: paymentMethod,
          staff: staffMember,
          amount: amount,
          target: Math.round(targetMonthly / getDaysInMonth(currentDate)),
          transactions: 1,
          status: "completed",
          description: `${service} - ${location}`,
        });
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return revenueData;
  }

  /**
   * Generate Last Month Revenue Data
   * @returns {Array} Last month revenue data
   */
  function generateLastMonthRevenue() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return generateRevenueData({
      startDate: lastMonth,
      endDate: lastDayOfLastMonth,
      targetMonthly: 2800000000, // 2.8 tỷ (lower than current month)
    });
  }

  /**
   * Generate Yesterday Revenue Data
   * @returns {Array} Yesterday revenue data
   */
  function generateYesterdayRevenue() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return generateRevenueData({
      startDate: yesterday,
      endDate: yesterday,
    });
  }

  /**
   * Generate Today Revenue Data
   * @returns {Array} Today revenue data
   */
  function generateTodayRevenue() {
    const today = new Date();

    return generateRevenueData({
      startDate: today,
      endDate: today,
    });
  }

  /**
   * Generate Revenue by Date Range
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @returns {Array} Revenue data
   */
  function generateRevenueByDateRange(start, end) {
    return generateRevenueData({
      startDate: start,
      endDate: end,
    });
  }

  // Helper Functions

  /**
   * Get first day of current month
   * @returns {Date}
   */
  function getFirstDayOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  /**
   * Get number of days in month
   * @param {Date} date - Date in target month
   * @returns {number}
   */
  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  /**
   * Group revenue by service
   * @param {Array} revenue - Revenue data
   * @returns {Object} Grouped by service
   */
  function groupByService(revenue) {
    return revenue.reduce((acc, r) => {
      if (!acc[r.service]) {
        acc[r.service] = [];
      }
      acc[r.service].push(r);
      return acc;
    }, {});
  }

  /**
   * Group revenue by location
   * @param {Array} revenue - Revenue data
   * @returns {Object} Grouped by location
   */
  function groupByLocation(revenue) {
    return revenue.reduce((acc, r) => {
      if (!acc[r.location]) {
        acc[r.location] = [];
      }
      acc[r.location].push(r);
      return acc;
    }, {});
  }

  /**
   * Group revenue by payment method
   * @param {Array} revenue - Revenue data
   * @returns {Object} Grouped by payment method
   */
  function groupByPayment(revenue) {
    return revenue.reduce((acc, r) => {
      if (!acc[r.paymentMethod]) {
        acc[r.paymentMethod] = [];
      }
      acc[r.paymentMethod].push(r);
      return acc;
    }, {});
  }

  /**
   * Group revenue by staff
   * @param {Array} revenue - Revenue data
   * @returns {Object} Grouped by staff
   */
  function groupByStaff(revenue) {
    return revenue.reduce((acc, r) => {
      if (!acc[r.staff]) {
        acc[r.staff] = [];
      }
      acc[r.staff].push(r);
      return acc;
    }, {});
  }

  /**
   * Group revenue by date
   * @param {Array} revenue - Revenue data
   * @returns {Object} Grouped by date
   */
  function groupByDate(revenue) {
    return revenue.reduce((acc, r) => {
      const dateKey = r.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(r);
      return acc;
    }, {});
  }

  // Export to global scope
  window.RevenueMockData = {
    generateRevenueData,
    generateLastMonthRevenue,
    generateYesterdayRevenue,
    generateTodayRevenue,
    generateRevenueByDateRange,
    groupByService,
    groupByLocation,
    groupByPayment,
    groupByStaff,
    groupByDate,
  };

  // Generate default data on load
  window.currentMonthRevenue = generateRevenueData();
  window.lastMonthRevenue = generateLastMonthRevenue();
  window.yesterdayRevenue = generateYesterdayRevenue();
  window.todayRevenue = generateTodayRevenue();

  console.log("✅ Revenue Mock Data Generated:");
  console.log(
    `   📊 Current Month: ${window.currentMonthRevenue.length} transactions`
  );
  console.log(
    `   📊 Last Month: ${window.lastMonthRevenue.length} transactions`
  );
  console.log(
    `   📊 Yesterday: ${window.yesterdayRevenue.length} transactions`
  );
  console.log(`   📊 Today: ${window.todayRevenue.length} transactions`);
})(window);
