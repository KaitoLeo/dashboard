(function (w) {
  // Seeded Random Number Generator for Consistent Data
  class SeededRandom {
    constructor(seed = 12345) {
      this.seed = seed;
    }

    next() {
      this.seed = (this.seed * 9301 + 49297) % 233280;
      return this.seed / 233280;
    }

    nextInt(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    }

    nextFloat(min, max, decimals = 2) {
      return parseFloat((this.next() * (max - min) + min).toFixed(decimals));
    }

    choice(array) {
      return array[this.nextInt(0, array.length - 1)];
    }
  }

  // Generate seed based on date and state parameters
  function generateSeed(state, date) {
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const stateStr = JSON.stringify({
      timeKey: state.timeKey,
      location: state.location,
      department: state.department,
      service: state.service,
    });

    // Create a simple hash from the combined string
    let hash = 0;
    const combined = dateStr + stateStr;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash);
  }

  // Mock data generators for demonstration
  function generateMockBookingData(state) {
    const { timeKey, from, to, location, department, service } = state;
    const dateRange = TimeUtils.getDateRange(timeKey, from, to);

    // Generate sample booking data based on filters
    const bookings = [];
    const services =
      service === "all"
        ? ["Membership", "PT Fitness", "Pilates", "Swimming Coach"]
        : [service];
    const locations =
      location === "all"
        ? [
            "Tôn Thất Thuyết",
            "Huỳnh Thúc Kháng",
            "Giảng Võ",
            "Hào Nam",
            "Nguyễn Tuân",
          ]
        : [LOCATIONS[location] || location];

    // Generate data for each day in range
    const currentDate = new Date(dateRange.from);
    while (currentDate <= dateRange.to) {
      // Create seeded random generator for this specific day
      const daySeed = generateSeed(state, currentDate);
      const rng = new SeededRandom(daySeed);

      // Generate consistent number of bookings for this day
      const dayBookings = rng.nextInt(10, 40); // 10-40 bookings per day

      for (let i = 0; i < dayBookings; i++) {
        // Generate consistent time based on day and index
        const hour = rng.nextInt(6, 18); // 6 AM to 6 PM
        const minute = rng.nextInt(0, 59);
        const time = `${hour}:${minute.toString().padStart(2, "0")}`;

        // Generate consistent service and location based on day and index
        const service = rng.choice(services);
        const location = rng.choice(locations);

        // Generate status with weighted probability (more completed)
        const statusRand = rng.next();
        let status;
        if (statusRand < 0.8) status = "completed";
        else if (statusRand < 0.95) status = "pending";
        else status = "cancelled";

        // Generate consistent rating (4-5 stars)
        const rating = rng.nextInt(4, 5);

        // Generate consistent amount based on service type
        let baseAmount = 100000; // 100k base
        if (service === "PT Fitness") baseAmount = 300000;
        else if (service === "Pilates") baseAmount = 200000;
        else if (service === "Swimming Coach") baseAmount = 250000;

        const amount = baseAmount + rng.nextInt(0, 200000); // Add variation

        bookings.push({
          id: `booking_${currentDate.getTime()}_${i}`,
          date: TimeUtils.formatDate(currentDate),
          time: time,
          member: `Hội viên ${String.fromCharCode(65 + (i % 26))}`,
          service: service,
          location: location,
          status: status,
          rating: rating,
          amount: amount,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return bookings;
  }

  function generateMockCheckinData(state) {
    const { timeKey, from, to, location, department, service } = state;
    const dateRange = TimeUtils.getDateRange(timeKey, from, to);

    const checkins = [];
    const services =
      service === "all"
        ? ["Membership", "PT Fitness", "Pilates", "Swimming Coach"]
        : [service];
    const locations =
      location === "all"
        ? [
            "Tôn Thất Thuyết",
            "Huỳnh Thúc Kháng",
            "Giảng Võ",
            "Hào Nam",
            "Nguyễn Tuân",
          ]
        : [LOCATIONS[location] || location];

    // Generate hourly checkin data
    const currentDate = new Date(dateRange.from);
    while (currentDate <= dateRange.to) {
      // Create seeded random generator for this specific day
      const daySeed = generateSeed(state, currentDate);
      const rng = new SeededRandom(daySeed);

      for (let hour = 5; hour < 22; hour++) {
        // Generate consistent checkins per hour with peak hours
        let baseCheckins = 10;
        if (hour >= 6 && hour <= 8) baseCheckins = 25; // Morning peak
        else if (hour >= 17 && hour <= 19) baseCheckins = 30; // Evening peak
        else if (hour >= 12 && hour <= 14) baseCheckins = 15; // Lunch time

        const hourlyCheckins = baseCheckins + rng.nextInt(0, 20); // Add variation

        for (let i = 0; i < hourlyCheckins; i++) {
          const service = rng.choice(services);
          const location = rng.choice(locations);
          const type = rng.choice(["checkin", "checkout"]);

          checkins.push({
            id: `checkin_${currentDate.getTime()}_${hour}_${i}`,
            date: TimeUtils.formatDate(currentDate),
            hour: hour,
            member: `Hội viên ${String.fromCharCode(65 + (i % 26))}`,
            service: service,
            location: location,
            type: type,
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return checkins;
  }

  function generateMockRevenueData(state) {
    const { timeKey, from, to, location, department, service } = state;
    const dateRange = TimeUtils.getDateRange(timeKey, from, to);

    const revenue = [];
    const services =
      service === "all"
        ? ["Membership", "PT Fitness", "Pilates", "Swimming Coach"]
        : [service];
    const locations =
      location === "all"
        ? [
            "Tôn Thất Thuyết",
            "Huỳnh Thúc Kháng",
            "Giảng Võ",
            "Hào Nam",
            "Nguyễn Tuân",
          ]
        : [LOCATIONS[location] || location];

    // Generate daily revenue data
    const currentDate = new Date(dateRange.from);
    while (currentDate <= dateRange.to) {
      // Create seeded random generator for this specific day
      const daySeed = generateSeed(state, currentDate);
      const rng = new SeededRandom(daySeed);

      services.forEach((svc) => {
        locations.forEach((loc) => {
          // Generate consistent revenue based on service and location
          let baseAmount = 1000000; // 1M base
          let baseTarget = 5000000; // 5M base

          // Adjust based on service type
          if (svc === "PT Fitness") {
            baseAmount = 3000000;
            baseTarget = 8000000;
          } else if (svc === "Pilates") {
            baseAmount = 2000000;
            baseTarget = 6000000;
          } else if (svc === "Swimming Coach") {
            baseAmount = 2500000;
            baseTarget = 7000000;
          }

          // Adjust based on location (some locations are busier)
          const locationMultiplier =
            loc === "Tôn Thất Thuyết"
              ? 1.2
              : loc === "Huỳnh Thúc Kháng"
              ? 1.1
              : 1.0;

          const amount = Math.floor(
            (baseAmount + rng.nextInt(0, 2000000)) * locationMultiplier
          );
          const target = Math.floor(
            (baseTarget + rng.nextInt(0, 3000000)) * locationMultiplier
          );
          const transactions = rng.nextInt(10, 50);

          revenue.push({
            date: TimeUtils.formatDate(currentDate),
            service: svc,
            location: loc,
            amount: amount,
            target: target,
            transactions: transactions,
          });
        });
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return revenue;
  }

  // Compute booking statistics
  function computeBookingStats(bookings) {
    const total = bookings.length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

    const byService = {};
    const byLocation = {};
    const byHour = {};

    bookings.forEach((booking) => {
      // By service
      byService[booking.service] = (byService[booking.service] || 0) + 1;

      // By location
      byLocation[booking.location] = (byLocation[booking.location] || 0) + 1;

      // By hour
      const hour = parseInt(booking.time.split(":")[0]);
      byHour[hour] = (byHour[hour] || 0) + 1;
    });

    return {
      total,
      completed,
      pending,
      cancelled,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
      byService,
      byLocation,
      byHour,
      averageRating:
        bookings.filter((b) => b.rating).reduce((sum, b) => sum + b.rating, 0) /
          bookings.filter((b) => b.rating).length || 0,
    };
  }

  // Compute checkin statistics
  function computeCheckinStats(checkins) {
    const total = checkins.length;
    const byService = {};
    const byLocation = {};
    const byHour = {};
    const byDay = {};

    checkins.forEach((checkin) => {
      // By service
      byService[checkin.service] = (byService[checkin.service] || 0) + 1;

      // By location
      byLocation[checkin.location] = (byLocation[checkin.location] || 0) + 1;

      // By hour
      byHour[checkin.hour] = (byHour[checkin.hour] || 0) + 1;

      // By day
      byDay[checkin.date] = (byDay[checkin.date] || 0) + 1;
    });

    return {
      total,
      byService,
      byLocation,
      byHour,
      byDay,
      peakHour: Object.keys(byHour).reduce(
        (a, b) => (byHour[a] > byHour[b] ? a : b),
        "0"
      ),
      peakDay: Object.keys(byDay).reduce(
        (a, b) => (byDay[a] > byDay[b] ? a : b),
        ""
      ),
    };
  }

  // Compute revenue statistics
  function computeRevenueStats(revenue) {
    const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
    const totalTarget = revenue.reduce((sum, r) => sum + r.target, 0);
    const totalTransactions = revenue.reduce(
      (sum, r) => sum + r.transactions,
      0
    );

    const byService = {};
    const byLocation = {};
    const byDay = {};

    revenue.forEach((r) => {
      // By service
      if (!byService[r.service])
        byService[r.service] = { amount: 0, target: 0, transactions: 0 };
      byService[r.service].amount += r.amount;
      byService[r.service].target += r.target;
      byService[r.service].transactions += r.transactions;

      // By location
      if (!byLocation[r.location])
        byLocation[r.location] = { amount: 0, target: 0, transactions: 0 };
      byLocation[r.location].amount += r.amount;
      byLocation[r.location].target += r.target;
      byLocation[r.location].transactions += r.transactions;

      // By day
      if (!byDay[r.date])
        byDay[r.date] = { amount: 0, target: 0, transactions: 0 };
      byDay[r.date].amount += r.amount;
      byDay[r.date].target += r.target;
      byDay[r.date].transactions += r.transactions;
    });

    return {
      totalRevenue,
      totalTarget,
      totalTransactions,
      achievementRate:
        totalTarget > 0 ? ((totalRevenue / totalTarget) * 100).toFixed(1) : 0,
      averageTransaction:
        totalTransactions > 0
          ? (totalRevenue / totalTransactions).toFixed(0)
          : 0,
      byService,
      byLocation,
      byDay,
    };
  }

  // Main compute function
  function computeAll(state) {
    const bookings = generateMockBookingData(state);
    const checkins = generateMockCheckinData(state);
    const revenue = generateMockRevenueData(state);

    return {
      booking: {
        data: bookings,
        stats: computeBookingStats(bookings),
      },
      checkin: {
        data: checkins,
        stats: computeCheckinStats(checkins),
      },
      revenue: {
        data: revenue,
        stats: computeRevenueStats(revenue),
      },
      // Additional computed data
      timeRange: TimeUtils.getDateRange(state.timeKey, state.from, state.to),
      timeKeyLabel: TimeUtils.getTimeKeyLabel(state.timeKey),
      filters: {
        location: state.location,
        department: state.department,
        service: state.service,
      },
    };
  }

  // Async version for future use
  async function computeAllAsync(state) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(computeAll(state));
      }, 100); // Simulate async operation
    });
  }

  w.Compute = {
    computeAll,
    computeAllAsync,
    computeBookingStats,
    computeCheckinStats,
    computeRevenueStats,
  };
})(window);
