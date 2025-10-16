/**
 * Data Source - Single Source of Truth for sample data
 * Loads and normalizes sample-data.js into standardized arrays
 */
(function (window) {
  "use strict";

  // Safely load sample data or provide empty defaults
  const rawData = window.SampleData || {};

  /**
   * Normalize bookings data from multiple sources
   * Combines class bookings and PT bookings into a unified format
   */
  function normalizeBookings() {
    const bookings = [];

    // Class bookings
    const classBookings = rawData.bookings || [];
    classBookings.forEach((b) => {
      bookings.push({
        id: b.id || b.booking_number,
        type: "class",
        bookingNumber: b.booking_number,
        customerId: b.customer_id,
        staffId: null,
        locationId: b.location_id,
        serviceId: b.package_id,
        serviceName: getServiceName(b.package_id),
        status: normalizeStatus(b.status),
        statusCode: b.status,
        date: b.created_at ? new Date(b.created_at) : null,
        startTime: null,
        endTime: null,
        bookingTime: b.created_at ? new Date(b.created_at) : null,
        remainingSessions: b.remaining_sessions || 0,
        amount: 0, // Not available in class bookings
        note: b.note || "",
      });
    });

    // PT bookings
    const ptBookings = rawData.pt_bookings || [];
    ptBookings.forEach((b) => {
      bookings.push({
        id: b.id || b.booking_number,
        type: "pt",
        bookingNumber: b.booking_number,
        customerId: b.customer_id,
        staffId: b.staff_id,
        locationId: b.location_id,
        serviceId: b.package_id,
        serviceName: getServiceName(b.package_id),
        status: normalizeStatus(b.status),
        statusCode: b.status,
        date: b.date ? new Date(b.date) : null,
        startTime: b.start_time,
        endTime: b.end_time,
        bookingTime: b.created_at ? new Date(b.created_at) : null,
        remainingSessions: b.remaining_sessions || 0,
        amount: 0, // Calculate based on service
        note: b.note || "",
        isCharge: b.is_charge || false,
        confirmed: b.confirmed || false,
        checkedInAt: b.checked_in_at ? new Date(b.checked_in_at) : null,
      });
    });

    // Legacy appointments for backward compatibility
    const appointments = rawData.appointments || [];
    appointments.forEach((a) => {
      bookings.push({
        id: a.id,
        type: "appointment",
        bookingNumber: null,
        customerId: a.customerId,
        staffId: a.staffId,
        locationId: a.location_id,
        serviceId: null,
        serviceName: a.service,
        status: a.status,
        statusCode: mapLegacyStatus(a.status),
        date: a.date ? new Date(a.date + "T" + a.time) : null,
        startTime: a.time,
        endTime: null,
        bookingTime: a.created_at ? new Date(a.created_at) : null,
        remainingSessions: 0,
        amount: a.price || 0,
        note: "",
      });
    });

    return bookings;
  }

  /**
   * Normalize checkins data
   * For now, we generate mock checkins based on completed bookings
   */
  function normalizeCheckins() {
    const checkins = [];
    const bookings = normalizeBookings();

    // Create checkins from completed bookings
    bookings
      .filter((b) => b.status === "completed" && b.date)
      .forEach((b) => {
        checkins.push({
          id: `checkin_${b.id}`,
          bookingId: b.id,
          customerId: b.customerId,
          locationId: b.locationId,
          serviceName: b.serviceName,
          date: b.date,
          time: b.startTime || "09:00",
          type: "checkin",
          isNew: false, // We don't have this data yet
        });
      });

    return checkins;
  }

  /**
   * Normalize revenue data
   * Calculates revenue from bookings and services
   */
  function normalizeRevenues() {
    const revenues = [];
    const bookings = normalizeBookings();
    const services = rawData.services || [];

    // Group bookings by date, location, service
    const revenueMap = {};

    bookings
      .filter((b) => b.status === "completed")
      .forEach((b) => {
        const dateKey = b.date ? b.date.toISOString().split("T")[0] : "unknown";
        const locationKey = b.locationId || "unknown";
        const serviceKey = b.serviceName || "unknown";
        const key = `${dateKey}_${locationKey}_${serviceKey}`;

        if (!revenueMap[key]) {
          revenueMap[key] = {
            date: b.date,
            locationId: b.locationId,
            serviceName: b.serviceName,
            amount: 0,
            transactions: 0,
            target: 0,
          };
        }

        // Calculate amount from service or use booking amount
        let amount = b.amount;
        if (!amount) {
          const service = services.find((s) => s.name === b.serviceName);
          amount = service ? service.price : 0;
        }

        revenueMap[key].amount += amount;
        revenueMap[key].transactions += 1;
      });

    // Convert map to array
    Object.values(revenueMap).forEach((r) => revenues.push(r));

    // Add monthly revenue data if available
    const monthlyRevenue = rawData.monthlyRevenue || [];
    monthlyRevenue.forEach((m) => {
      // This is aggregated monthly data, we can use it for targets
      // but for now we'll skip it to avoid confusion with daily data
    });

    return revenues;
  }

  /**
   * Normalize members/customers data
   */
  function normalizeMembers() {
    const members = [];
    const customers = rawData.customers || [];

    customers.forEach((c) => {
      members.push({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        joinDate: c.joinDate ? new Date(c.joinDate) : null,
        status: c.status,
        totalSpent: c.totalSpent || 0,
        lastVisit: c.lastVisit ? new Date(c.lastVisit) : null,
        avatar: c.avatar || "",
      });
    });

    return members;
  }

  /**
   * Get locations data
   */
  function getLocations() {
    return rawData.locations || [];
  }

  /**
   * Get services data
   */
  function getServices() {
    return rawData.services || [];
  }

  /**
   * Get departments data
   */
  function getDepartments() {
    return rawData.departments || [];
  }

  // Helper functions
  function normalizeStatus(statusCode) {
    const statusMap = {
      1: "pending",
      2: "confirmed",
      3: "completed",
      4: "cancelled",
      5: "noshow",
    };
    return statusMap[statusCode] || "unknown";
  }

  function mapLegacyStatus(status) {
    const legacyMap = {
      pending: 1,
      confirmed: 2,
      completed: 3,
      cancelled: 4,
    };
    return legacyMap[status] || 0;
  }

  function getServiceName(packageId) {
    // Map package IDs to service names
    // This is a simplified mapping, should be enhanced with actual data
    const serviceMap = {
      1: "Membership",
      2: "PT Fitness",
      3: "Pilates",
      4: "Swimming Coach",
    };
    return serviceMap[packageId] || "Other";
  }

  // Main data object
  const DataSource = {
    // Normalized data arrays
    get bookings() {
      return normalizeBookings();
    },
    get checkins() {
      return normalizeCheckins();
    },
    get revenues() {
      return normalizeRevenues();
    },
    get members() {
      return normalizeMembers();
    },

    // Reference data
    get locations() {
      return getLocations();
    },
    get services() {
      return getServices();
    },
    get departments() {
      return getDepartments();
    },

    // Helper to filter data by state
    filterByState(dataArray, state) {
      if (!dataArray || !Array.isArray(dataArray)) return [];

      let filtered = [...dataArray];

      // Filter by date range
      if (state.timeKey || (state.from && state.to)) {
        const dateRange = this.getDateRange(state);
        filtered = filtered.filter((item) => {
          const itemDate = item.date || item.bookingTime;
          if (!itemDate) return false;
          return itemDate >= dateRange.from && itemDate <= dateRange.to;
        });
      }

      // Filter by location
      if (state.location && state.location !== "all") {
        const locationId = parseInt(state.location);
        if (!isNaN(locationId)) {
          filtered = filtered.filter((item) => item.locationId === locationId);
        }
      }

      // Filter by service
      if (state.service && state.service !== "all") {
        filtered = filtered.filter(
          (item) => item.serviceName === state.service
        );
      }

      return filtered;
    },

    // Get date range from state
    getDateRange(state) {
      // If we have explicit from/to, use them
      if (state.from && state.to) {
        return {
          from: new Date(state.from),
          to: new Date(state.to),
        };
      }

      // Otherwise, calculate from timeKey
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let from, to;

      switch (state.timeKey) {
        case "today":
          from = new Date(today);
          to = new Date(today);
          to.setHours(23, 59, 59, 999);
          break;
        case "yesterday":
          from = new Date(today);
          from.setDate(from.getDate() - 1);
          to = new Date(from);
          to.setHours(23, 59, 59, 999);
          break;
        case "week":
        case "thisweek":
          from = new Date(today);
          from.setDate(from.getDate() - from.getDay()); // Start of week (Sunday)
          to = new Date(today);
          to.setHours(23, 59, 59, 999);
          break;
        case "month":
        case "thismonth":
          from = new Date(now.getFullYear(), now.getMonth(), 1);
          to = new Date(today);
          to.setHours(23, 59, 59, 999);
          break;
        case "mtd":
          from = new Date(now.getFullYear(), now.getMonth(), 1);
          to = new Date(today);
          to.setHours(23, 59, 59, 999);
          break;
        case "year":
        case "thisyear":
          from = new Date(now.getFullYear(), 0, 1);
          to = new Date(today);
          to.setHours(23, 59, 59, 999);
          break;
        default:
          from = new Date(today);
          to = new Date(today);
          to.setHours(23, 59, 59, 999);
      }

      return { from, to };
    },

    // Reload data (for future API integration)
    reload() {
      // Clear any cached data
      // In the future, this would trigger an API call
      console.log("✅ Data layer reloaded");
    },
  };

  // Expose to window
  window.DataSource = DataSource;

  // Log on init
  console.log("✅ Data layer ready", {
    bookings: DataSource.bookings.length,
    checkins: DataSource.checkins.length,
    revenues: DataSource.revenues.length,
    members: DataSource.members.length,
  });
})(window);

