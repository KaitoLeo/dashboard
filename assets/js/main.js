// Main JavaScript for Actiwell Report System

// Global variables
let currentSection = "dashboard";
let currentFilters = {
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  timeRange: "month",
  location: "all",
  department: "all",
};

// Initialize Lambda integration
let lambdaIntegration = null;

// Database Analytics Helper Functions
const DatabaseAnalytics = {
  // Tương đương SQL: SELECT location_id, date_trunc('month', created_at) AS year_month, COUNT(*) FROM bookings WHERE status IN (1,2,3) GROUP BY 1,2
  getMonthlyBookingsByLocation: function () {
    if (!window.SampleData || !window.SampleData.analytics) return [];
    return window.SampleData.analytics.getMonthlyBookingsByLocation();
  },

  // Tương đương SQL: SELECT COUNT(*) FROM bookings WHERE status = 1 (PENDING)
  getPendingBookingsCount: function () {
    if (!window.SampleData || !window.SampleData.analytics) return 0;
    return window.SampleData.analytics.getPendingBookingsCount();
  },

  // Tương đương SQL: SELECT COUNT(*) FROM bookings WHERE status = 3 (COMPLETED)
  getCompletedBookingsCount: function () {
    if (!window.SampleData || !window.SampleData.analytics) return 0;
    return window.SampleData.analytics.getCompletedBookingsCount();
  },

  // Tương đương SQL: SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURDATE()
  getTodayBookingsCount: function () {
    if (!window.SampleData || !window.SampleData.analytics) return 0;
    return window.SampleData.analytics.getTodayBookingsCount();
  },

  // Tương đương SQL: SELECT location_id, COUNT(*) FROM bookings WHERE status = 2 GROUP BY 1
  getConfirmedBookingsByLocation: function () {
    if (!window.SampleData || !window.SampleData.analytics) return [];
    return window.SampleData.analytics.getConfirmedBookingsByLocation();
  },

  // Tương đương SQL: SELECT location_id, department_id, COUNT(*) FROM bookings b JOIN departments d ON b.location_id = d.location_id GROUP BY 1,2
  getBookingsByLocationAndDepartment: function () {
    if (!window.SampleData || !window.SampleData.analytics) return [];
    return window.SampleData.analytics.getBookingsByLocationAndDepartment();
  },

  // Tương đương SQL: SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)
  getCancellationRate: function () {
    if (!window.SampleData || !window.SampleData.analytics) return 0;
    return window.SampleData.analytics.getCancellationRate();
  },

  // Tương đương SQL: SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0) GROUP BY location_id
  getCancellationRateByLocation: function () {
    if (!window.SampleData || !window.SampleData.analytics) return [];
    return window.SampleData.analytics.getCancellationRateByLocation();
  },

  // Tương đương SQL: COUNT(*) WHERE status = 4
  getCancelledBookingsCount: function () {
    if (!window.SampleData || !window.SampleData.analytics) return 0;
    return window.SampleData.analytics.getCancelledBookingsCount();
  },
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  initializeLambdaIntegration();
  // loadDashboardData() is called in showSection("dashboard") in initializeApp()
});

// Initialize application
function initializeApp() {
  // Set current date as default end date using Vietnam time
  const vietnamTime = getVietnamTime();
  const firstDay = new Date(
    vietnamTime.getFullYear(),
    vietnamTime.getMonth(),
    1
  );

  const startDate = firstDay.toISOString().split("T")[0];
  const endDate = vietnamTime.toISOString().split("T")[0];

  // Only set date inputs if they exist
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  if (startDateInput) {
    startDateInput.value = startDate;
  }
  if (endDateInput) {
    endDateInput.value = endDate;
  }

  // Update currentFilters with the date values
  currentFilters.startDate = startDate;
  currentFilters.endDate = endDate;

  // Show dashboard by default
  showSection("dashboard");

  // Load dashboard data after a short delay to ensure DOM is ready
  setTimeout(() => {
    loadDashboardData();
  }, 100);
}

// Setup event listeners
function setupEventListeners() {
  // Navigation links
  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.getAttribute("data-section");

      // Handle navigation to detail pages
      if (section === "revenue-club") {
        window.location.href = "pages/revenue-club-detail.html";
      } else if (section === "revenue-service") {
        window.location.href = "pages/revenue-service-detail.html";
      } else if (section === "revenue-staff") {
        window.location.href = "pages/revenue-staff-detail.html";
      } else if (section === "revenue-payment") {
        window.location.href = "pages/revenue-payment-detail.html";
      } else if (section === "contract-member") {
        window.location.href = "pages/contract-member-detail.html";
      } else if (section === "contract-trainer") {
        window.location.href = "pages/contract-trainer-detail.html";
      } else if (section === "operation-member") {
        window.location.href = "pages/operation-member-detail.html";
      } else if (section === "operation-pt") {
        window.location.href = "pages/operation-pt-detail.html";
      } else if (section === "crm") {
        window.location.href = "pages/crm-detail.html";
      } else {
        showSection(section);
      }
    });
  });

  // Filter dropdowns
  document.querySelectorAll("[data-location]").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      currentFilters.location = this.getAttribute("data-location");
      // console.log("Location changed to:", currentFilters.location);
      updateActiveFilter(this, "location");
      // Apply filters immediately
      loadDashboardData();
    });
  });

  document.querySelectorAll("[data-department]").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      currentFilters.department = this.getAttribute("data-department");
      // console.log("Department changed to:", currentFilters.department);
      updateActiveFilter(this, "department");
      // Apply filters immediately
      loadDashboardData();
    });
  });

  // Time range selector
  document.getElementById("timeRange").addEventListener("change", function () {
    currentFilters.timeRange = this.value;
    applyFilters();
  });

  // Date inputs
  document.getElementById("startDate").addEventListener("change", function () {
    currentFilters.startDate = this.value;
    applyFilters();
  });

  document.getElementById("endDate").addEventListener("change", function () {
    currentFilters.endDate = this.value;
    applyFilters();
  });
}

// Show specific section
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show selected section
  const targetSection = document.getElementById(sectionName + "-section");
  if (targetSection) {
    targetSection.classList.add("active");
    currentSection = sectionName;

    // Update navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    const navLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (navLink) {
      navLink.classList.add("active");
    }

    // Load section data
    loadSectionData(sectionName);
  } else {
    // If no section found, just load dashboard data
    if (sectionName === "dashboard") {
      loadDashboardData();
    }
  }
}

// Load section data
function loadSectionData(sectionName) {
  switch (sectionName) {
    case "dashboard":
      loadDashboardData();
      break;
    case "revenue-club":
      loadRevenueClubData();
      break;
    case "revenue-service":
      loadRevenueServiceData();
      break;
    case "revenue-staff":
      loadRevenueStaffData();
      break;
    case "revenue-payment":
      loadRevenuePaymentData();
      break;
    case "contract-member":
      loadContractMemberData();
      break;
    case "contract-trainer":
      loadContractTrainerData();
      break;
    case "operation-member":
      loadOperationMemberData();
      break;
    case "operation-pt":
      loadOperationPTData();
      break;
    case "crm":
      loadCRMData();
      break;
  }
}

// Initialize Lambda integration
function initializeLambdaIntegration() {
  // Check if Lambda integration is available
  if (typeof ActiwellLambdaIntegration !== "undefined") {
    lambdaIntegration = new ActiwellLambdaIntegration();
    console.log("Lambda integration initialized");
  } else {
    console.log("Lambda integration not available, using mock data");
  }
}

// Load dashboard data
async function loadDashboardData() {
  console.log("Loading dashboard data with filters:", currentFilters);

  try {
    let dashboardData;

    // Try to get data from Lambda functions first
    if (lambdaIntegration) {
      const locationId = getLocationIdFromFilter();
      dashboardData = await lambdaIntegration.getDashboardSummary(locationId);
      console.log("Data loaded from Lambda functions:", dashboardData);
    } else {
      // Fallback to local data
      console.log("Using local mock data");

      // Get real-time data from database analytics
      const dbData = getDatabaseAnalyticsData();

      // Filter data based on current filters
      const filteredData = getFilteredDashboardData();

      // Merge database data with filtered data
      dashboardData = mergeDatabaseData(filteredData, dbData);
    }

    // Update dashboard with data
    updateDashboardMetrics(dashboardData);

    // Show filter status
    showFilterStatus();

    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (typeof initializeCharts === "function") {
        initializeCharts();
      } else {
        console.log("initializeCharts function not found");
      }
    }, 500);
  } catch (error) {
    console.error("Error loading dashboard data:", error);

    // Fallback to local data on error
    const dbData = getDatabaseAnalyticsData();
    const filteredData = getFilteredDashboardData();
    const mergedData = mergeDatabaseData(filteredData, dbData);
    updateDashboardMetrics(mergedData);
    showFilterStatus();
  }
}

// Get location ID from current filter
function getLocationIdFromFilter() {
  const locationMap = {
    all: 0,
    "ton-that-thuyet": 1,
    "huynh-thuc-khang": 2,
    "giang-vo": 3,
    "hao-nam": 4,
    "nguyen-tuan": 5,
  };
  return locationMap[currentFilters.location] || 1;
}

// Get data from database analytics
function getDatabaseAnalyticsData() {
  return {
    // Booking statistics from database
    bookings: {
      pending: DatabaseAnalytics.getPendingBookingsCount(),
      completed: DatabaseAnalytics.getCompletedBookingsCount(),
      today: DatabaseAnalytics.getTodayBookingsCount(),
      confirmed: DatabaseAnalytics.getConfirmedBookingsByLocation(),
      monthly: DatabaseAnalytics.getMonthlyBookingsByLocation(),
      byLocationAndDept: DatabaseAnalytics.getBookingsByLocationAndDepartment(),
    },

    // Location data
    locations: window.SampleData?.locations || [],

    // Department data
    departments: window.SampleData?.departments || [],

    // Total locations count
    totalLocations: window.SampleData?.locations?.length || 5,
  };
}

// Merge database data with existing filtered data
function mergeDatabaseData(filteredData, dbData) {
  // Update total clubs count from database
  if (filteredData.facilities) {
    filteredData.facilities.totalClubs = dbData.totalLocations;
  }

  // Update booking-related metrics
  if (filteredData.pt) {
    filteredData.pt.today = dbData.bookings.today;
    filteredData.pt.pending = dbData.bookings.pending;
    filteredData.pt.completed = dbData.bookings.completed;
  }

  // Add database analytics to the data
  filteredData.databaseAnalytics = dbData;

  return filteredData;
}

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem("actiwellSettings");
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return null;
}

// Get filtered dashboard data
function getFilteredDashboardData() {
  // console.log("Getting filtered data for location:", currentFilters.location);

  // Load settings
  const settings = loadSettings();

  // Sample data for each location
  const locationData = {
    all: {
      revenue: {
        mtd: 1850000000,
        today: 75000000,
        yesterday: 68500000,
        target: settings?.global?.monthlyTarget || 2500000000,
        remaining: (settings?.global?.monthlyTarget || 2500000000) - 1850000000,
        growth: settings?.global?.growthTarget || 12.5,
        avgDaily: Math.round(1850000000 / 30),
        completionRate: Math.round(
          (1850000000 / (settings?.global?.monthlyTarget || 2500000000)) * 100
        ),
      },
      checkin: {
        today: 245,
        yesterday: 238,
        mtd: 5880,
        onTime: 198,
        lateCheckin: 47, // Hội viên check-in sai giờ
        manual: 47,
        peakHour: "18:00-19:00",
        avgDuration: 85,
      },
      pt: {
        today: 45,
        yesterday: 42,
        mtd: 1250,
        online: 8,
        group: 12,
        individual: 33,
        avgRevenue: 50000,
      },
      swimming_coach: {
        today: 32,
        yesterday: 28,
        mtd: 850,
        group_sessions: 20,
        individual_sessions: 12,
        avgRevenue: 45000,
      },
      pilates: {
        today: 28,
        yesterday: 25,
        mtd: 720,
        group_classes: 15,
        private_sessions: 13,
        avgRevenue: 40000,
      },
      fit: {
        today: 28,
        yesterday: 25,
        mtd: 780,
        yoga: 8,
        pilates: 6,
        zumba: 5,
        aerobic: 9,
        participants: 420,
      },
      customers: {
        visitors: window.ConsistentData
          ? window.ConsistentData.getVisitorsData("today", "all").count
          : 10,
        trial: window.ConsistentData
          ? window.ConsistentData.getVisitorsData("today", "all").trialGuests
          : 8,
        newMembers: 15,
        renewals: 8,
        cancellations: 3,
        retentionRate: 85.2,
      },
      staff: {
        activeTrainers: 12,
        activeStaff: 45,
        avgSessions: 3.2,
        topPerformer: "Nguyễn Văn A",
      },
      equipment: {
        totalMachines: 156,
        maintenance: 8,
        utilization: 78.5,
        avgUsage: 4.2,
      },
      facilities: {
        totalClubs: 5,
        avgOccupancy: 65.8,
        peakCapacity: 85.2,
        maintenance: 3,
        gymOccupancy: 82.3,
        poolOccupancy: 65.8,
        pilatesOccupancy: 71.2,
      },
      burnRate: {
        avgBurnRate: 4.2,
        highBurnRate: 156,
        lowBurnRate: 89,
        silentMembers: 25,
      },
    },
    "ton-that-thuyet": {
      revenue: {
        mtd: 450000000,
        today: 18000000,
        yesterday: 16500000,
        target: settings?.locations?.["ton-that-thuyet"]?.revenue || 600000000,
        remaining:
          (settings?.locations?.["ton-that-thuyet"]?.revenue || 600000000) -
          450000000,
        growth: 8.5,
        avgDaily: Math.round(450000000 / 30),
        completionRate: Math.round(
          (450000000 /
            (settings?.locations?.["ton-that-thuyet"]?.revenue || 600000000)) *
            100
        ),
      },
      checkin: {
        today: 65,
        yesterday: 62,
        mtd: 1350,
        onTime: 52,
        manual: 13,
        peakHour: "18:00-19:00",
        avgDuration: 90,
      },
      pt: {
        today: 12,
        yesterday: 11,
        mtd: 320,
        online: 2,
        group: 3,
        individual: 9,
        avgRevenue: 55000,
      },
      fit: {
        today: 8,
        yesterday: 7,
        mtd: 220,
        yoga: 2,
        pilates: 2,
        zumba: 2,
        aerobic: 2,
        participants: 120,
      },
      customers: {
        visitors: 3,
        trial: 2,
        newMembers: 4,
        renewals: 2,
        cancellations: 1,
        retentionRate: 88.5,
      },
      staff: {
        activeTrainers: 3,
        activeStaff: 12,
        avgSessions: 3.5,
        topPerformer: "Nguyễn Văn A",
      },
      equipment: {
        totalMachines: 35,
        maintenance: 2,
        utilization: 82.3,
        avgUsage: 4.5,
      },
      facilities: {
        totalClubs: 1,
        avgOccupancy: 75.2,
        peakCapacity: 88.5,
        maintenance: 0,
      },
    },
    "huynh-thuc-khang": {
      revenue: {
        mtd: 380000000,
        today: 15500000,
        yesterday: 14200000,
        target: 500000000,
        remaining: 120000000,
        growth: 15.2,
        avgDaily: 12666667,
        completionRate: 76.0,
      },
      checkin: {
        today: 55,
        yesterday: 52,
        mtd: 1150,
        onTime: 44,
        manual: 11,
        peakHour: "17:00-18:00",
        avgDuration: 85,
      },
      pt: {
        today: 10,
        yesterday: 9,
        mtd: 280,
        online: 2,
        group: 2,
        individual: 8,
        avgRevenue: 52000,
      },
      fit: {
        today: 6,
        yesterday: 5,
        mtd: 180,
        yoga: 2,
        pilates: 1,
        zumba: 1,
        aerobic: 2,
        participants: 95,
      },
      customers: {
        visitors: 2,
        trial: 1,
        newMembers: 3,
        renewals: 2,
        cancellations: 0,
        retentionRate: 92.3,
      },
      staff: {
        activeTrainers: 2,
        activeStaff: 10,
        avgSessions: 3.8,
        topPerformer: "Trần Thị B",
      },
      equipment: {
        totalMachines: 30,
        maintenance: 1,
        utilization: 78.9,
        avgUsage: 4.2,
      },
      facilities: {
        totalClubs: 1,
        avgOccupancy: 68.5,
        peakCapacity: 82.1,
        maintenance: 1,
        gymOccupancy: 85.2,
        poolOccupancy: 62.3,
        pilatesOccupancy: 75.8,
      },
      burnRate: {
        avgBurnRate: 4.8,
        highBurnRate: 45,
        lowBurnRate: 12,
        silentMembers: 8,
      },
    },
    "giang-vo": {
      revenue: {
        mtd: 320000000,
        today: 13000000,
        yesterday: 11800000,
        target: 400000000,
        remaining: 80000000,
        growth: 6.8,
        avgDaily: 10666667,
        completionRate: 80.0,
      },
      checkin: {
        today: 45,
        yesterday: 42,
        mtd: 950,
        onTime: 36,
        manual: 9,
        peakHour: "19:00-20:00",
        avgDuration: 80,
      },
      pt: {
        today: 8,
        yesterday: 7,
        mtd: 220,
        online: 1,
        group: 2,
        individual: 6,
        avgRevenue: 48000,
      },
      fit: {
        today: 5,
        yesterday: 4,
        mtd: 150,
        yoga: 1,
        pilates: 2,
        zumba: 1,
        aerobic: 1,
        participants: 75,
      },
      customers: {
        visitors: 2,
        trial: 1,
        newMembers: 2,
        renewals: 1,
        cancellations: 1,
        retentionRate: 83.3,
      },
      staff: {
        activeTrainers: 2,
        activeStaff: 8,
        avgSessions: 3.0,
        topPerformer: "Lê Văn C",
      },
      equipment: {
        totalMachines: 25,
        maintenance: 2,
        utilization: 75.2,
        avgUsage: 3.8,
      },
      facilities: {
        totalClubs: 1,
        avgOccupancy: 62.3,
        peakCapacity: 78.9,
        maintenance: 1,
        gymOccupancy: 78.5,
        poolOccupancy: 58.2,
        pilatesOccupancy: 68.9,
      },
      burnRate: {
        avgBurnRate: 3.8,
        highBurnRate: 28,
        lowBurnRate: 15,
        silentMembers: 5,
      },
    },
    "hao-nam": {
      revenue: {
        mtd: 290000000,
        today: 12000000,
        yesterday: 11000000,
        target: 350000000,
        remaining: 60000000,
        growth: 4.2,
        avgDaily: 9666667,
        completionRate: 82.9,
      },
      checkin: {
        today: 40,
        yesterday: 38,
        mtd: 850,
        onTime: 32,
        manual: 8,
        peakHour: "18:30-19:30",
        avgDuration: 75,
      },
      pt: {
        today: 7,
        yesterday: 6,
        mtd: 190,
        online: 1,
        group: 2,
        individual: 5,
        avgRevenue: 45000,
      },
      fit: {
        today: 4,
        yesterday: 3,
        mtd: 120,
        yoga: 1,
        pilates: 1,
        zumba: 1,
        aerobic: 1,
        participants: 60,
      },
      customers: {
        visitors: 2,
        trial: 1,
        newMembers: 2,
        renewals: 1,
        cancellations: 0,
        retentionRate: 90.0,
      },
      staff: {
        activeTrainers: 2,
        activeStaff: 7,
        avgSessions: 2.8,
        topPerformer: "Phạm Thị D",
      },
      equipment: {
        totalMachines: 22,
        maintenance: 1,
        utilization: 72.1,
        avgUsage: 3.5,
      },
      facilities: {
        totalClubs: 1,
        avgOccupancy: 58.7,
        peakCapacity: 75.3,
        maintenance: 0,
        gymOccupancy: 72.1,
        poolOccupancy: 55.8,
        pilatesOccupancy: 62.4,
      },
      burnRate: {
        avgBurnRate: 3.5,
        highBurnRate: 22,
        lowBurnRate: 18,
        silentMembers: 6,
      },
    },
    "nguyen-tuan": {
      revenue: {
        mtd: 200000000,
        today: 8000000,
        yesterday: 7500000,
        target: 300000000,
        remaining: 100000000,
        growth: -2.1,
        avgDaily: 6666667,
        completionRate: 66.7,
      },
      checkin: {
        today: 30,
        yesterday: 28,
        mtd: 650,
        onTime: 24,
        manual: 6,
        peakHour: "17:30-18:30",
        avgDuration: 70,
      },
      pt: {
        today: 5,
        yesterday: 4,
        mtd: 140,
        online: 1,
        group: 1,
        individual: 4,
        avgRevenue: 40000,
      },
      fit: {
        today: 3,
        yesterday: 2,
        mtd: 90,
        yoga: 1,
        pilates: 0,
        zumba: 1,
        aerobic: 1,
        participants: 45,
      },
      customers: {
        visitors: 1,
        trial: 1,
        newMembers: 1,
        renewals: 0,
        cancellations: 1,
        retentionRate: 75.0,
      },
      staff: {
        activeTrainers: 1,
        activeStaff: 5,
        avgSessions: 2.5,
        topPerformer: "Hoàng Văn E",
      },
      equipment: {
        totalMachines: 18,
        maintenance: 2,
        utilization: 65.8,
        avgUsage: 3.2,
      },
      facilities: {
        totalClubs: 1,
        avgOccupancy: 52.1,
        peakCapacity: 68.7,
        maintenance: 1,
        gymOccupancy: 65.3,
        poolOccupancy: 48.9,
        pilatesOccupancy: 55.7,
      },
      burnRate: {
        avgBurnRate: 3.2,
        highBurnRate: 18,
        lowBurnRate: 22,
        silentMembers: 8,
      },
    },
  };

  // Get data for selected location
  let selectedData = locationData[currentFilters.location] || locationData.all;
  console.log("Selected data for location:", selectedData);

  // Apply department filter if needed
  if (currentFilters.department !== "all") {
    console.log("Filtering by department:", currentFilters.department);
    // Create a copy of the data and apply department-specific adjustments
    selectedData = JSON.parse(JSON.stringify(selectedData)); // Deep copy

    // Apply department-specific multipliers (example logic)
    const departmentMultipliers = {
      membership: 1.0, // Full data
      fitness: 0.8, // 80% of data
      pool: 0.6, // 60% of data
      pilates: 0.4, // 40% of data
      operation: 0.9, // 90% of data
    };

    const multiplier = departmentMultipliers[currentFilters.department] || 1.0;

    // Apply multiplier to all numeric values
    if (selectedData.revenue) {
      Object.keys(selectedData.revenue).forEach((key) => {
        if (typeof selectedData.revenue[key] === "number") {
          selectedData.revenue[key] = Math.round(
            selectedData.revenue[key] * multiplier
          );
        }
      });
    }

    if (selectedData.checkin) {
      Object.keys(selectedData.checkin).forEach((key) => {
        if (typeof selectedData.checkin[key] === "number") {
          selectedData.checkin[key] = Math.round(
            selectedData.checkin[key] * multiplier
          );
        }
      });
    }

    if (selectedData.pt) {
      Object.keys(selectedData.pt).forEach((key) => {
        if (typeof selectedData.pt[key] === "number") {
          selectedData.pt[key] = Math.round(selectedData.pt[key] * multiplier);
        }
      });
    }

    if (selectedData.fit) {
      Object.keys(selectedData.fit).forEach((key) => {
        if (typeof selectedData.fit[key] === "number") {
          selectedData.fit[key] = Math.round(
            selectedData.fit[key] * multiplier
          );
        }
      });
    }

    if (selectedData.customers) {
      Object.keys(selectedData.customers).forEach((key) => {
        if (typeof selectedData.customers[key] === "number") {
          selectedData.customers[key] = Math.round(
            selectedData.customers[key] * multiplier
          );
        }
      });
    }

    if (selectedData.facilities) {
      Object.keys(selectedData.facilities).forEach((key) => {
        if (typeof selectedData.facilities[key] === "number") {
          selectedData.facilities[key] = Math.round(
            selectedData.facilities[key] * multiplier
          );
        }
      });
    }

    if (selectedData.burnRate) {
      Object.keys(selectedData.burnRate).forEach((key) => {
        if (typeof selectedData.burnRate[key] === "number") {
          selectedData.burnRate[key] = Math.round(
            selectedData.burnRate[key] * multiplier
          );
        }
      });
    }
  }

  // Apply date range filter
  if (currentFilters.startDate && currentFilters.endDate) {
    // In real app, filter by date range
    console.log(
      "Filtering by date range:",
      currentFilters.startDate,
      "to",
      currentFilters.endDate
    );
  }

  return selectedData;
}

// Update dashboard metrics
function updateDashboardMetrics(data) {
  console.log("Updating dashboard metrics with data:", data);

  // Update revenue metrics
  const revenueElements = document.querySelectorAll('[data-metric="revenue"]');
  console.log("Found revenue elements:", revenueElements.length);
  revenueElements.forEach((element) => {
    const metric = element.getAttribute("data-type");
    console.log("Processing revenue metric:", metric);
    if (data.revenue[metric] !== undefined) {
      const valueElement = element.querySelector("h3, h4");
      if (valueElement) {
        if (metric === "completionRate") {
          valueElement.textContent = data.revenue[metric] + "%";
        } else {
          valueElement.textContent = formatNumber(data.revenue[metric]);
        }
        console.log(`Updated revenue ${metric}:`, data.revenue[metric]);
      } else {
        console.log("No value element found for revenue metric:", metric);
      }
    } else {
      console.log("No data found for revenue metric:", metric);
    }
  });

  // Update checkin metrics
  const checkinElements = document.querySelectorAll('[data-metric="checkin"]');
  console.log("Found checkin elements:", checkinElements.length);
  checkinElements.forEach((element) => {
    const metric = element.getAttribute("data-type");
    if (data.checkin[metric] !== undefined) {
      const valueElement = element.querySelector("h3");
      if (valueElement) {
        valueElement.textContent = data.checkin[metric];
        console.log(`Updated checkin ${metric}:`, data.checkin[metric]);
      }
    }
  });

  // Update PT metrics
  const ptElements = document.querySelectorAll('[data-metric="pt"]');
  console.log("Found pt elements:", ptElements.length);
  ptElements.forEach((element) => {
    const metric = element.getAttribute("data-type");
    if (data.pt[metric] !== undefined) {
      const valueElement = element.querySelector("h3");
      if (valueElement) {
        valueElement.textContent = data.pt[metric];
        console.log(`Updated pt ${metric}:`, data.pt[metric]);
      }
    }
  });

  // Update Fit metrics
  const fitElements = document.querySelectorAll('[data-metric="fit"]');
  console.log("Found fit elements:", fitElements.length);
  fitElements.forEach((element) => {
    const metric = element.getAttribute("data-type");
    if (data.fit[metric] !== undefined) {
      const valueElement = element.querySelector("h3");
      if (valueElement) {
        valueElement.textContent = data.fit[metric];
        console.log(`Updated fit ${metric}:`, data.fit[metric]);
      }
    }
  });

  // Update customer metrics
  const customerElements = document.querySelectorAll(
    '[data-metric="customers"]'
  );
  console.log("Found customer elements:", customerElements.length);
  customerElements.forEach((element) => {
    const metric = element.getAttribute("data-type");
    if (data.customers[metric] !== undefined) {
      const valueElement = element.querySelector("h3, h4");
      if (valueElement) {
        if (
          metric === "churnRate" ||
          metric === "renewalRate" ||
          metric === "retentionRate" ||
          metric === "newExistingRatio"
        ) {
          valueElement.textContent = data.customers[metric] + "%";
        } else {
          valueElement.textContent = data.customers[metric];
        }
        console.log(`Updated customer ${metric}:`, data.customers[metric]);
      }
    }
  });

  // Update facilities metrics
  const facilitiesElements = document.querySelectorAll(
    '[data-metric="facilities"]'
  );
  console.log("Found facilities elements:", facilitiesElements.length);
  facilitiesElements.forEach((element) => {
    const metric = element.getAttribute("data-type");
    if (data.facilities[metric] !== undefined) {
      const valueElement = element.querySelector("h3, h4");
      if (valueElement) {
        if (
          metric === "avgOccupancy" ||
          metric === "gymOccupancy" ||
          metric === "poolOccupancy" ||
          metric === "pilatesOccupancy"
        ) {
          valueElement.textContent = data.facilities[metric] + "%";
        } else {
          valueElement.textContent = data.facilities[metric];
        }
        console.log(`Updated facilities ${metric}:`, data.facilities[metric]);
      }
    }
  });

  // Update burn rate metrics
  const burnRateElements = document.querySelectorAll(
    '[data-metric="burnRate"]'
  );
  console.log("Found burn rate elements:", burnRateElements.length);
  burnRateElements.forEach((element) => {
    const metric = element.getAttribute("data-type");
    if (data.burnRate && data.burnRate[metric] !== undefined) {
      const valueElement = element.querySelector("h3, h4");
      if (valueElement) {
        valueElement.textContent = data.burnRate[metric];
        console.log(`Updated burn rate ${metric}:`, data.burnRate[metric]);
      }
    }
  });
}

// Load revenue club data
function loadRevenueClubData() {
  const clubData = [
    {
      name: "Tôn Thất Thuyết",
      target: 500000000,
      mtd: 375000000,
      daily: 18500000,
      ratio: 75,
      weight: 20.3,
      status: "success",
    },
    {
      name: "Huỳnh Thúc Kháng",
      target: 600000000,
      mtd: 450000000,
      daily: 22000000,
      ratio: 75,
      weight: 24.3,
      status: "success",
    },
    {
      name: "Giảng Võ",
      target: 550000000,
      mtd: 412500000,
      daily: 20500000,
      ratio: 75,
      weight: 22.3,
      status: "success",
    },
    {
      name: "Hào Nam",
      target: 450000000,
      mtd: 337500000,
      daily: 16500000,
      ratio: 75,
      weight: 18.2,
      status: "success",
    },
    {
      name: "Nguyễn Tuân",
      target: 400000000,
      mtd: 275000000,
      daily: 14000000,
      ratio: 69,
      weight: 14.9,
      status: "warning",
    },
  ];

  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-chart-line me-2"></i>Doanh số theo CLB
                            <span class="badge bg-primary ms-2">${
                              clubData.length
                            } CLB</span>
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped data-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên CLB</th>
                                        <th>Mục tiêu (VNĐ)</th>
                                        <th>Doanh thu MTD (VNĐ)</th>
                                        <th>Doanh thu ngày (VNĐ)</th>
                                        <th>Tỉ lệ hoàn thành (%)</th>
                                        <th>Tỉ trọng (%)</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${clubData
                                      .map(
                                        (club, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td><strong>${
                                              club.name
                                            }</strong></td>
                                            <td>${formatNumber(
                                              club.target
                                            )}</td>
                                            <td>${formatNumber(club.mtd)}</td>
                                            <td>${formatNumber(club.daily)}</td>
                                            <td><span class="badge bg-${
                                              club.status
                                            }">${club.ratio}%</span></td>
                                            <td>${club.weight}%</td>
                                            <td>
                                                ${
                                                  club.ratio >= 75
                                                    ? '<span class="badge bg-success">Đạt mục tiêu</span>'
                                                    : club.ratio >= 65
                                                    ? '<span class="badge bg-warning">Cần cải thiện</span>'
                                                    : '<span class="badge bg-danger">Chưa đạt</span>'
                                                }
                                            </td>
                                        </tr>
                                    `
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load revenue service data
function loadRevenueServiceData() {
  const rawServiceData = [
    {
      name: "Membership",
      revenue: 1200000000,
      weight: 64.9,
      contracts: 1650,
      avgValue: 727273,
      color: "primary",
    },
    {
      name: "Fitness",
      revenue: 450000000,
      weight: 24.3,
      contracts: 450,
      avgValue: 1000000,
      color: "success",
    },
    {
      name: "Swimming Coach",
      revenue: 150000000,
      weight: 8.1,
      contracts: 200,
      avgValue: 750000,
      color: "info",
    },
    {
      name: "Pilates",
      revenue: 50000000,
      weight: 2.7,
      contracts: 100,
      avgValue: 500000,
      color: "warning",
    },
  ];

  // Apply service order sorting
  const serviceData = ServiceOrder.sortByServiceOrder(
    rawServiceData,
    (item) => item.name
  );

  const packageData = [
    {
      name: "Gói 1 tháng",
      revenue: 600000000,
      weight: 32.4,
      contracts: 1200,
      avgValue: 500000,
      color: "primary",
    },
    {
      name: "Gói 3 tháng",
      revenue: 450000000,
      weight: 24.3,
      contracts: 300,
      avgValue: 1500000,
      color: "success",
    },
    {
      name: "Gói 6 tháng",
      revenue: 300000000,
      weight: 16.2,
      contracts: 100,
      avgValue: 3000000,
      color: "info",
    },
    {
      name: "Gói 12 tháng",
      revenue: 500000000,
      weight: 27.0,
      contracts: 50,
      avgValue: 10000000,
      color: "warning",
    },
    {
      name: "Gói 24 tháng",
      revenue: 200000000,
      weight: 10.8,
      contracts: 20,
      avgValue: 10000000,
      color: "danger",
    },
  ];

  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-concierge-bell me-2"></i>Doanh số theo dịch vụ
                            <span class="badge bg-primary ms-2">${
                              serviceData.length
                            } dịch vụ</span>
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            ${serviceData
                              .map(
                                (service) => `
                                <div class="col-md-3 mb-3">
                                    <div class="card bg-${
                                      service.color
                                    } text-white">
                                        <div class="card-body text-center">
                                            <h4>${service.name}</h4>
                                            <h2>${formatNumber(
                                              service.revenue
                                            )}</h2>
                                            <small>VNĐ (${
                                              service.weight
                                            }%)</small>
                                        </div>
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped data-table">
                                <thead>
                                    <tr>
                                        <th>Dịch vụ</th>
                                        <th>Doanh thu (VNĐ)</th>
                                        <th>Tỉ trọng (%)</th>
                                        <th>Số hợp đồng</th>
                                        <th>Giá trị TB/HĐ (VNĐ)</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${packageData
                                      .map(
                                        (pkg) => `
                                        <tr>
                                            <td><strong>${
                                              pkg.name
                                            }</strong></td>
                                            <td>${formatNumber(
                                              pkg.revenue
                                            )}</td>
                                            <td>${pkg.weight}%</td>
                                            <td><span class="badge bg-info">${
                                              pkg.contracts
                                            }</span></td>
                                            <td>${formatNumber(
                                              pkg.avgValue
                                            )}</td>
                                            <td>
                                                ${
                                                  pkg.weight >= 25
                                                    ? '<span class="badge bg-success">Phổ biến</span>'
                                                    : pkg.weight >= 15
                                                    ? '<span class="badge bg-warning">Trung bình</span>'
                                                    : '<span class="badge bg-secondary">Ít</span>'
                                                }
                                            </td>
                                        </tr>
                                    `
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load revenue staff data
function loadRevenueStaffData() {
  const staffData = [
    {
      id: "NV001",
      name: "Nguyễn Văn A",
      deposit: 50000000,
      full: 200000000,
      debt: 100000000,
      total: 350000000,
      contracts: 25,
      rank: 1,
      performance: "excellent",
    },
    {
      id: "NV002",
      name: "Trần Thị B",
      deposit: 30000000,
      full: 180000000,
      debt: 80000000,
      total: 290000000,
      contracts: 20,
      rank: 2,
      performance: "good",
    },
    {
      id: "NV003",
      name: "Lê Văn C",
      deposit: 40000000,
      full: 150000000,
      debt: 60000000,
      total: 250000000,
      contracts: 18,
      rank: 3,
      performance: "good",
    },
    {
      id: "NV004",
      name: "Phạm Thị D",
      deposit: 25000000,
      full: 120000000,
      debt: 50000000,
      total: 195000000,
      contracts: 15,
      rank: 4,
      performance: "average",
    },
    {
      id: "NV005",
      name: "Hoàng Văn E",
      deposit: 20000000,
      full: 100000000,
      debt: 40000000,
      total: 160000000,
      contracts: 12,
      rank: 5,
      performance: "average",
    },
    {
      id: "NV006",
      name: "Vũ Thị F",
      deposit: 15000000,
      full: 80000000,
      debt: 30000000,
      total: 125000000,
      contracts: 10,
      rank: 6,
      performance: "below",
    },
    {
      id: "NV007",
      name: "Đặng Văn G",
      deposit: 10000000,
      full: 60000000,
      debt: 20000000,
      total: 90000000,
      contracts: 8,
      rank: 7,
      performance: "below",
    },
    {
      id: "NV008",
      name: "Bùi Thị H",
      deposit: 8000000,
      full: 50000000,
      debt: 15000000,
      total: 73000000,
      contracts: 6,
      rank: 8,
      performance: "poor",
    },
  ];

  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-user-tie me-2"></i>Doanh số theo nhân viên bán hàng
                            <span class="badge bg-primary ms-2">${
                              staffData.length
                            } nhân viên</span>
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped data-table">
                                <thead>
                                    <tr>
                                        <th>Xếp hạng</th>
                                        <th>Mã NV</th>
                                        <th>Tên nhân viên</th>
                                        <th>Đặt cọc (VNĐ)</th>
                                        <th>Thu đủ (VNĐ)</th>
                                        <th>Thu nợ (VNĐ)</th>
                                        <th>Tổng doanh số (VNĐ)</th>
                                        <th>Số HĐ</th>
                                        <th>Hiệu suất</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${staffData
                                      .map(
                                        (staff) => `
                                        <tr>
                                            <td>
                                                ${
                                                  staff.rank <= 3
                                                    ? `<span class="badge bg-warning">#${staff.rank}</span>`
                                                    : `<span class="badge bg-secondary">#${staff.rank}</span>`
                                                }
                                            </td>
                                            <td><strong>${
                                              staff.id
                                            }</strong></td>
                                            <td>${staff.name}</td>
                                            <td>${formatNumber(
                                              staff.deposit
                                            )}</td>
                                            <td>${formatNumber(staff.full)}</td>
                                            <td>${formatNumber(staff.debt)}</td>
                                            <td><strong>${formatNumber(
                                              staff.total
                                            )}</strong></td>
                                            <td><span class="badge bg-info">${
                                              staff.contracts
                                            }</span></td>
                                            <td>
                                                ${
                                                  staff.performance ===
                                                  "excellent"
                                                    ? '<span class="badge bg-success">Xuất sắc</span>'
                                                    : staff.performance ===
                                                      "good"
                                                    ? '<span class="badge bg-primary">Tốt</span>'
                                                    : staff.performance ===
                                                      "average"
                                                    ? '<span class="badge bg-warning">Trung bình</span>'
                                                    : staff.performance ===
                                                      "below"
                                                    ? '<span class="badge bg-info">Dưới TB</span>'
                                                    : '<span class="badge bg-danger">Kém</span>'
                                                }
                                            </td>
                                        </tr>
                                    `
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load revenue payment data
function loadRevenuePaymentData() {
  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Doanh số theo hình thức thanh toán</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <div class="card bg-success text-white">
                                    <div class="card-body text-center">
                                        <h4>Tiền mặt</h4>
                                        <h2>800,000,000</h2>
                                        <small>43.2%</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-info text-white">
                                    <div class="card-body text-center">
                                        <h4>Chuyển khoản</h4>
                                        <h2>700,000,000</h2>
                                        <small>37.8%</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-warning text-white">
                                    <div class="card-body text-center">
                                        <h4>MPOS/Card</h4>
                                        <h2>350,000,000</h2>
                                        <small>18.9%</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load contract member data
function loadContractMemberData() {
  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Thống kê hợp đồng hội viên</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-3">
                                <div class="card bg-primary text-white">
                                    <div class="card-body text-center">
                                        <h4>Hợp đồng mới</h4>
                                        <h2>125</h2>
                                        <small>tháng này</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-success text-white">
                                    <div class="card-body text-center">
                                        <h4>Còn hiệu lực</h4>
                                        <h2>1,850</h2>
                                        <small>hợp đồng</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-warning text-white">
                                    <div class="card-body text-center">
                                        <h4>Hết hiệu lực</h4>
                                        <h2>45</h2>
                                        <small>tháng này</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-info text-white">
                                    <div class="card-body text-center">
                                        <h4>Chưa kích hoạt</h4>
                                        <h2>12</h2>
                                        <small>hợp đồng</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped data-table">
                                <thead>
                                    <tr>
                                        <th>Loại hợp đồng</th>
                                        <th>Số lượng</th>
                                        <th>Doanh thu (VNĐ)</th>
                                        <th>Tỉ lệ (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Đăng ký mới</td>
                                        <td>85</td>
                                        <td>425,000,000</td>
                                        <td>68%</td>
                                    </tr>
                                    <tr>
                                        <td>Tái ký</td>
                                        <td>30</td>
                                        <td>150,000,000</td>
                                        <td>24%</td>
                                    </tr>
                                    <tr>
                                        <td>Nâng cấp</td>
                                        <td>10</td>
                                        <td>50,000,000</td>
                                        <td>8%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load contract trainer data
function loadContractTrainerData() {
  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Thống kê hợp đồng huấn luyện viên</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped data-table">
                                <thead>
                                    <tr>
                                        <th>Loại hợp đồng</th>
                                        <th>Số lượng</th>
                                        <th>Tổng buổi tập</th>
                                        <th>Doanh thu (VNĐ)</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Đăng ký mới</td>
                                        <td>45</td>
                                        <td>1,350</td>
                                        <td>270,000,000</td>
                                        <td><span class="badge bg-success">Hiệu lực</span></td>
                                    </tr>
                                    <tr>
                                        <td>Tái ký</td>
                                        <td>20</td>
                                        <td>600</td>
                                        <td>120,000,000</td>
                                        <td><span class="badge bg-success">Hiệu lực</span></td>
                                    </tr>
                                    <tr>
                                        <td>Nâng cấp</td>
                                        <td>8</td>
                                        <td>240</td>
                                        <td>48,000,000</td>
                                        <td><span class="badge bg-success">Hiệu lực</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load operation member data
function loadOperationMemberData() {
  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Báo cáo vận hành hội viên</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <div class="card bg-primary text-white">
                                    <div class="card-body text-center">
                                        <h4>Check-in ${TimeLabelVi.capitalize(
                                          "hôm nay"
                                        )}</h4>
                                        <h2>245</h2>
                                        <small>lượt</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-success text-white">
                                    <div class="card-body text-center">
                                        <h4>Check-in MTD</h4>
                                        <h2>1,850</h2>
                                        <small>lượt</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-info text-white">
                                    <div class="card-body text-center">
                                        <h4>Khách tham quan</h4>
                                        <h2>10</h2>
                                        <small>lượt</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped data-table">
                                <thead>
                                    <tr>
                                        <th>Thời gian</th>
                                        <th>Check-in</th>
                                        <th>Khách tham quan</th>
                                        <th>Khách tập thử</th>
                                        <th>Tổng lượt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${TimeLabelVi.capitalize(
                                          "hôm nay"
                                        )}</td>
                                        <td>245</td>
                                        <td>12</td>
                                        <td>8</td>
                                        <td>265</td>
                                    </tr>
                                    <tr>
                                        <td>${TimeLabelVi.capitalize(
                                          "hôm qua"
                                        )}</td>
                                        <td>230</td>
                                        <td>15</td>
                                        <td>6</td>
                                        <td>251</td>
                                    </tr>
                                    <tr>
                                        <td>${TimeLabelVi.capitalize(
                                          "tuần này"
                                        )}</td>
                                        <td>1,680</td>
                                        <td>85</td>
                                        <td>45</td>
                                        <td>1,810</td>
                                    </tr>
                                    <tr>
                                        <td>${TimeLabelVi.capitalize(
                                          "tháng này"
                                        )}</td>
                                        <td>7,250</td>
                                        <td>350</td>
                                        <td>180</td>
                                        <td>7,780</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load operation PT data
function loadOperationPTData() {
  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Báo cáo tập PT</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-3">
                                <div class="card bg-primary text-white">
                                    <div class="card-body text-center">
                                        <h4>PT hôm nay</h4>
                                        <h2>45</h2>
                                        <small>buổi</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-success text-white">
                                    <div class="card-body text-center">
                                        <h4>PT MTD</h4>
                                        <h2>1,250</h2>
                                        <small>buổi</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-info text-white">
                                    <div class="card-body text-center">
                                        <h4>Fit hôm nay</h4>
                                        <h2>28</h2>
                                        <small>buổi</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-warning text-white">
                                    <div class="card-body text-center">
                                        <h4>Fit MTD</h4>
                                        <h2>780</h2>
                                        <small>buổi</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped data-table">
                                <thead>
                                    <tr>
                                        <th>HLV</th>
                                        <th>PT Sessions</th>
                                        <th>Fit Sessions</th>
                                        <th>Tổng buổi</th>
                                        <th>Doanh thu (VNĐ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Nguyễn Văn A</td>
                                        <td>120</td>
                                        <td>80</td>
                                        <td>200</td>
                                        <td>40,000,000</td>
                                    </tr>
                                    <tr>
                                        <td>Trần Thị B</td>
                                        <td>95</td>
                                        <td>65</td>
                                        <td>160</td>
                                        <td>32,000,000</td>
                                    </tr>
                                    <tr>
                                        <td>Lê Văn C</td>
                                        <td>110</td>
                                        <td>70</td>
                                        <td>180</td>
                                        <td>36,000,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Load CRM data
function loadCRMData() {
  const content = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Báo cáo CRM và tỉ lệ chuyển đổi</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h6>Thống kê theo nguồn khách</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Nguồn khách</th>
                                                <th>Số lượng</th>
                                                <th>Tỉ lệ (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Facebook Ads</td>
                                                <td>150</td>
                                                <td>35%</td>
                                            </tr>
                                            <tr>
                                                <td>Zalo Ads</td>
                                                <td>80</td>
                                                <td>19%</td>
                                            </tr>
                                            <tr>
                                                <td>Website</td>
                                                <td>60</td>
                                                <td>14%</td>
                                            </tr>
                                            <tr>
                                                <td>Giới thiệu</td>
                                                <td>90</td>
                                                <td>21%</td>
                                            </tr>
                                            <tr>
                                                <td>Walk-in</td>
                                                <td>40</td>
                                                <td>9%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6>Tỉ lệ chuyển đổi</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Giai đoạn</th>
                                                <th>Số lượng</th>
                                                <th>Tỉ lệ (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Khách hàng mới</td>
                                                <td>420</td>
                                                <td>100%</td>
                                            </tr>
                                            <tr>
                                                <td>Đã hẹn</td>
                                                <td>280</td>
                                                <td>67%</td>
                                            </tr>
                                            <tr>
                                                <td>Đã tham quan</td>
                                                <td>200</td>
                                                <td>48%</td>
                                            </tr>
                                            <tr>
                                                <td>Đã tập thử</td>
                                                <td>120</td>
                                                <td>29%</td>
                                            </tr>
                                            <tr>
                                                <td>Chốt hợp đồng</td>
                                                <td>85</td>
                                                <td>20%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("content-sections").innerHTML = content;
}

// Update active filter
function updateActiveFilter(element, type) {
  // Remove active class from siblings
  element.parentNode.querySelectorAll(".dropdown-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Add active class to selected item
  element.classList.add("active");
}

// Apply filters
function applyFilters() {
  currentFilters.startDate = document.getElementById("startDate").value;
  currentFilters.endDate = document.getElementById("endDate").value;
  currentFilters.timeRange = document.getElementById("timeRange").value;

  console.log("Applying filters:", currentFilters);

  // Show filter status
  showFilterStatus();

  // Reload current section with new filters
  loadSectionData(currentSection);
}

// Show filter status
function showFilterStatus() {
  const statusText = `Đang lọc: ${getLocationName(
    currentFilters.location
  )} | ${getDepartmentName(currentFilters.department)} | ${
    currentFilters.startDate
  } - ${currentFilters.endDate}`;

  // Create or update filter status element
  let statusElement = document.getElementById("filterStatus");
  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.id = "filterStatus";
    statusElement.className = "alert alert-info alert-dismissible fade show";
    statusElement.style.position = "fixed";
    statusElement.style.top = "80px";
    statusElement.style.right = "20px";
    statusElement.style.zIndex = "1050";
    statusElement.style.maxWidth = "400px";
    document.body.appendChild(statusElement);
  }

  statusElement.innerHTML = `
    <i class="fas fa-filter me-2"></i>${statusText}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // Auto hide after 3 seconds
  setTimeout(() => {
    if (statusElement) {
      statusElement.remove();
    }
  }, 3000);
}

// Get location name
function getLocationName(locationId) {
  const locations = {
    all: "Tất cả trung tâm",
    "ton-that-thuyet": "Tôn Thất Thuyết",
    "huynh-thuc-khang": "Huỳnh Thúc Kháng",
    "giang-vo": "Giảng Võ",
    "hao-nam": "Hào Nam",
    "nguyen-tuan": "Nguyễn Tuân",
  };
  return locations[locationId] || "Tất cả trung tâm";
}

// Get department name
function getDepartmentName(departmentId) {
  const departments = {
    all: "Tất cả bộ phận",
    membership: "Membership",
    fitness: "Fitness",
    pool: "Swimming Coach",
    pilates: "Pilates",
    operation: "Operation",
  };
  return departments[departmentId] || "Tất cả bộ phận";
}

// Apply filters
function applyFilters() {
  // Only update date and time filters from DOM, keep location and department from current state
  currentFilters.startDate = document.getElementById("startDate").value;
  currentFilters.endDate = document.getElementById("endDate").value;
  currentFilters.timeRange = document.getElementById("timeRange").value;

  console.log("Applying filters:", currentFilters);

  // Show filter status
  showFilterStatus();

  // Reload current section with new filters
  if (currentSection === "dashboard") {
    loadDashboardData();
  } else {
    loadSectionData(currentSection);
  }
}

// Update active filter visual state
function updateActiveFilter(element, type) {
  // Remove active class from all items of the same type
  const parent = element.closest(".dropdown-menu");
  const allItems = parent.querySelectorAll(`[data-${type}]`);
  allItems.forEach((item) => item.classList.remove("active"));

  // Add active class to selected item
  element.classList.add("active");

  // Update button text to show selected filter
  const button = document.querySelector(".dropdown-toggle, #locationDropdown");
  if (button) {
    const locationName = getLocationName(currentFilters.location);
    const departmentName = getDepartmentName(currentFilters.department);
    button.innerHTML = `<i class="fas fa-filter me-1"></i>Bộ lọc: ${locationName} | ${departmentName}`;
  }
}

// Show filter status
function showFilterStatus() {
  const statusText = `Đang lọc: ${getLocationName(
    currentFilters.location
  )} | ${getDepartmentName(currentFilters.department)} | ${
    currentFilters.startDate
  } - ${currentFilters.endDate}`;

  // Create or update filter status element
  let statusElement = document.getElementById("filterStatus");
  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.id = "filterStatus";
    statusElement.className = "alert alert-info alert-dismissible fade show";
    statusElement.style.position = "fixed";
    statusElement.style.top = "80px";
    statusElement.style.right = "20px";
    statusElement.style.zIndex = "1050";
    statusElement.style.maxWidth = "400px";
    document.body.appendChild(statusElement);
  }

  statusElement.innerHTML = `
    <i class="fas fa-filter me-2"></i>${statusText}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // Auto hide after 3 seconds
  setTimeout(() => {
    if (statusElement) {
      statusElement.remove();
    }
  }, 3000);
}

// Get Vietnam time
function getVietnamTime() {
  const now = new Date();
  return new Date(now.getTime() + 7 * 60 * 60 * 1000);
}

// Format Vietnam time
function formatVietnamTime(date, options = {}) {
  const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return vietnamTime.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    ...options,
  });
}

// Export report
function exportReport() {
  console.log("Exporting report...");
  // This would typically generate and download a report
  alert("Chức năng xuất báo cáo sẽ được triển khai!");
}

// Open revenue target detail with current filters
function openRevenueTargetDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/revenue-target-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open revenue MTD detail with current filters
function openRevenueMTDDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/revenue-mtd-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open daily revenue detail with current filters
function openDailyRevenueDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/daily-revenue-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open completion rate detail with current filters
function openCompletionRateDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/completion-rate-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open check-in today detail with current filters
function openCheckinTodayDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/checkin-today-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open check-in MTD detail with current filters
function openCheckinMTDDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/checkin-mtd-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open visitors detail with current filters
function openVisitorsDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/visitors-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open trial guests detail with current filters
function openTrialGuestsDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/trial-guests-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open PT detail with current filters
function openPTDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/pt-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open member movement detail with current filters
function openMemberMovementDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/member-movement-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open check-in frequency detail with current filters
function openCheckinFrequencyDetail(type) {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);
  if (type) {
    params.set("type", type);
  }

  const url = `pages/checkin-frequency-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open facility utilization detail with current filters
function openFacilityUtilizationDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/facility-utilization-overview.html?${params.toString()}`;
  window.location.href = url;
}

// Open gym occupancy detail
function openGymOccupancyDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", "fitness");
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);
  const url = `pages/gym-occupancy-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open swimming coach occupancy detail
function openSwimmingCoachOccupancyDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", "swimming");
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);
  const url = `pages/swimming-coach-occupancy-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open pilates occupancy detail
function openPilatesOccupancyDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", "pilates");
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);
  const url = `pages/pilates-occupancy-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open burn rate detail with current filters
function openBurnRateDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  const url = `pages/burn-rate-detail.html?${params.toString()}`;
  window.location.href = url;
}

// Open total revenue MTD detail with current filters
function openTotalRevenueMTDDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  // Check if we're in a pages subdirectory
  const currentPath = window.location.pathname;
  const isInPages = currentPath.includes("/pages/");

  let url;
  if (isInPages) {
    // If we're already in pages directory, go up one level first
    url = `../pages/total-revenue-mtd-detail.html?${params.toString()}`;
  } else {
    // If we're in root directory
    url = `pages/total-revenue-mtd-detail.html?${params.toString()}`;
  }

  console.log("Current path:", currentPath);
  console.log("Is in pages:", isInPages);
  console.log("Navigating to:", url);
  window.location.href = url;
}

// Open growth comparison detail with current filters
function openGrowthComparisonDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  // Check if we're in a pages subdirectory
  const currentPath = window.location.pathname;
  const isInPages = currentPath.includes("/pages/");

  let url;
  if (isInPages) {
    url = `../pages/growth-comparison-detail.html?${params.toString()}`;
  } else {
    url = `pages/growth-comparison-detail.html?${params.toString()}`;
  }

  console.log("Navigating to:", url);
  window.location.href = url;
}

// Open daily average detail with current filters
function openDailyAverageDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  // Check if we're in a pages subdirectory
  const currentPath = window.location.pathname;
  const isInPages = currentPath.includes("/pages/");

  let url;
  if (isInPages) {
    // If we're already in pages directory, go up one level first
    url = `../pages/daily-average-detail.html?${params.toString()}`;
  } else {
    // If we're in root directory
    url = `pages/daily-average-detail.html?${params.toString()}`;
  }

  console.log("Current path:", currentPath);
  console.log("Is in pages:", isInPages);
  console.log("Navigating to:", url);
  window.location.href = url;
}

// Open remaining days detail with current filters
function openRemainingDaysDetail() {
  const params = new URLSearchParams();
  params.set("location", currentFilters.location);
  params.set("department", currentFilters.department);
  params.set("startDate", currentFilters.startDate);
  params.set("endDate", currentFilters.endDate);

  // Check if we're in a pages subdirectory
  const currentPath = window.location.pathname;
  const isInPages = currentPath.includes("/pages/");

  let url;
  if (isInPages) {
    // If we're already in pages directory, go up one level first
    url = `../pages/remaining-days-detail.html?${params.toString()}`;
  } else {
    // If we're in root directory
    url = `pages/remaining-days-detail.html?${params.toString()}`;
  }

  console.log("Current path:", currentPath);
  console.log("Is in pages:", isInPages);
  console.log("Navigating to:", url);
  window.location.href = url;
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatNumber(number) {
  return new Intl.NumberFormat("vi-VN").format(number);
}

function formatPercentage(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Get Vietnam time (UTC+7)
function getVietnamTime() {
  const now = new Date();
  const vietnamTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  return vietnamTime;
}
