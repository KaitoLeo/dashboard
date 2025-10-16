/**
 * Booking Mock Data Generator
 * Generate realistic booking data for testing
 */

(function (window) {
  "use strict";

  /**
   * Generate Booking Data
   * @param {Object} options - Generation options
   * @returns {Array} Booking data array
   */
  function generateBookingData(options = {}) {
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
      statuses = ["completed", "pending", "cancelled"],
      statusWeights = [0.7, 0.2, 0.1], // 70% completed, 20% pending, 10% cancelled
    } = options;

    const bookingData = [];
    const currentDate = new Date(startDate);

    const customers = [
      "Nguyễn Văn A",
      "Trần Thị B",
      "Lê Văn C",
      "Phạm Thị D",
      "Hoàng Văn E",
      "Vũ Thị F",
      "Đặng Văn G",
      "Bùi Thị H",
      "Phan Văn I",
      "Ngô Thị J",
    ];

    const phones = [
      "0901234567",
      "0901234568",
      "0901234569",
      "0901234570",
      "0901234571",
      "0901234572",
      "0901234573",
      "0901234574",
      "0901234575",
      "0901234576",
    ];

    // Generate bookings for each day
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // More bookings on weekdays
      const numBookings = isWeekend
        ? Math.floor(Math.random() * 20) + 15
        : Math.floor(Math.random() * 40) + 30;

      for (let i = 0; i < numBookings; i++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const location =
          locations[Math.floor(Math.random() * locations.length)];
        const customer =
          customers[Math.floor(Math.random() * customers.length)];
        const phone = phones[Math.floor(Math.random() * phones.length)];

        // Weighted random status
        const rand = Math.random();
        let status;
        if (rand < statusWeights[0]) status = statuses[0]; // completed
        else if (rand < statusWeights[0] + statusWeights[1])
          status = statuses[1]; // pending
        else status = statuses[2]; // cancelled

        // Generate random time (6:00 - 20:00)
        const hour = 6 + Math.floor(Math.random() * 14);
        const minute = Math.floor(Math.random() * 60);

        const notes = {
          completed: "Thành công",
          pending: "Chờ xác nhận",
          cancelled: "Khách hủy",
        };

        bookingData.push({
          id: bookingData.length + 1,
          date: new Date(currentDate),
          time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
            2,
            "0"
          )}`,
          customer: customer,
          phone: phone,
          service: service,
          location: location,
          status: status,
          note: notes[status] || "",
        });
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return bookingData;
  }

  /**
   * Generate Today Bookings
   * @returns {Array} Today booking data
   */
  function generateTodayBookings() {
    const today = new Date();
    return generateBookingData({
      startDate: today,
      endDate: today,
    });
  }

  /**
   * Generate Yesterday Bookings
   * @returns {Array} Yesterday booking data
   */
  function generateYesterdayBookings() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return generateBookingData({
      startDate: yesterday,
      endDate: yesterday,
    });
  }

  /**
   * Generate This Week Bookings
   * @returns {Array} This week booking data
   */
  function generateThisWeekBookings() {
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(today);

    return generateBookingData({
      startDate: weekStart,
      endDate: weekEnd,
    });
  }

  /**
   * Generate MTD Bookings
   * @returns {Array} Month-to-date booking data
   */
  function generateMTDBookings() {
    return generateBookingData();
  }

  /**
   * Generate Bookings by Date Range
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @returns {Array} Booking data
   */
  function generateBookingsByDateRange(start, end) {
    return generateBookingData({
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
   * Get start of week (Monday)
   * @param {Date} date - Reference date
   * @returns {Date}
   */
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
  }

  /**
   * Get end of week (Sunday)
   * @param {Date} date - Reference date
   * @returns {Date}
   */
  function getWeekEnd(date) {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }

  /**
   * Group bookings by service
   * @param {Array} bookings - Booking data
   * @returns {Object} Grouped by service
   */
  function groupByService(bookings) {
    return bookings.reduce((acc, b) => {
      if (!acc[b.service]) {
        acc[b.service] = [];
      }
      acc[b.service].push(b);
      return acc;
    }, {});
  }

  /**
   * Group bookings by location
   * @param {Array} bookings - Booking data
   * @returns {Object} Grouped by location
   */
  function groupByLocation(bookings) {
    return bookings.reduce((acc, b) => {
      if (!acc[b.location]) {
        acc[b.location] = [];
      }
      acc[b.location].push(b);
      return acc;
    }, {});
  }

  /**
   * Group bookings by status
   * @param {Array} bookings - Booking data
   * @returns {Object} Grouped by status
   */
  function groupByStatus(bookings) {
    return bookings.reduce((acc, b) => {
      if (!acc[b.status]) {
        acc[b.status] = [];
      }
      acc[b.status].push(b);
      return acc;
    }, {});
  }

  /**
   * Group bookings by date
   * @param {Array} bookings - Booking data
   * @returns {Object} Grouped by date
   */
  function groupByDate(bookings) {
    return bookings.reduce((acc, b) => {
      const dateKey = b.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(b);
      return acc;
    }, {});
  }

  // Export to global scope
  window.BookingMockData = {
    generateBookingData,
    generateTodayBookings,
    generateYesterdayBookings,
    generateThisWeekBookings,
    generateMTDBookings,
    generateBookingsByDateRange,
    groupByService,
    groupByLocation,
    groupByStatus,
    groupByDate,
  };

  // Generate default data on load
  window.todayBookings = generateTodayBookings();
  window.yesterdayBookings = generateYesterdayBookings();
  window.thisWeekBookings = generateThisWeekBookings();
  window.mtdBookings = generateMTDBookings();

  console.log("✅ Booking Mock Data Generated:");
  console.log(`   📅 Today: ${window.todayBookings.length} bookings`);
  console.log(`   📅 Yesterday: ${window.yesterdayBookings.length} bookings`);
  console.log(`   📅 This Week: ${window.thisWeekBookings.length} bookings`);
  console.log(`   📅 MTD: ${window.mtdBookings.length} bookings`);
})(window);
