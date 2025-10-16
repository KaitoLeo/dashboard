// Sample Data for Actiwell CMS Mockup
const SampleData = {
  // Dashboard Statistics
  dashboardStats: {
    totalCustomers: 1247,
    monthlyRevenue: 45680,
    todayAppointments: 23,
    totalStaff: 15,
    activePackages: 8,
    completedSessions: 156,
  },

  // Customer Data
  customers: [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      phone: "0901234567",
      joinDate: "2024-01-15",
      status: "active",
      totalSpent: 2500000,
      lastVisit: "2024-12-20",
      avatar: "A",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranthibinh@email.com",
      phone: "0901234568",
      joinDate: "2024-02-20",
      status: "active",
      totalSpent: 1800000,
      lastVisit: "2024-12-19",
      avatar: "B",
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "levancuong@email.com",
      phone: "0901234569",
      joinDate: "2024-03-10",
      status: "inactive",
      totalSpent: 1200000,
      lastVisit: "2024-11-15",
      avatar: "C",
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "phamthidung@email.com",
      phone: "0901234570",
      joinDate: "2024-04-05",
      status: "active",
      totalSpent: 3200000,
      lastVisit: "2024-12-21",
      avatar: "D",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      email: "hoangvanem@email.com",
      phone: "0901234571",
      joinDate: "2024-05-12",
      status: "active",
      totalSpent: 2100000,
      lastVisit: "2024-12-18",
      avatar: "E",
    },
  ],

  // Staff Data
  staff: [
    {
      id: 1,
      name: "Nguyễn Thị Hoa",
      position: "Fitness Trainer",
      email: "nguyenthihoa@actiwell.com",
      phone: "0901234572",
      joinDate: "2023-06-01",
      status: "active",
      salary: 15000000,
      avatar: "H",
    },
    {
      id: 2,
      name: "Trần Văn Khoa",
      position: "Spa Therapist",
      email: "tranvankhoa@actiwell.com",
      phone: "0901234573",
      joinDate: "2023-08-15",
      status: "active",
      salary: 12000000,
      avatar: "K",
    },
    {
      id: 3,
      name: "Lê Thị Lan",
      position: "Swimming Instructor",
      email: "lethilan@actiwell.com",
      phone: "0901234574",
      joinDate: "2023-09-20",
      status: "active",
      salary: 13000000,
      avatar: "L",
    },
    {
      id: 4,
      name: "Phạm Văn Minh",
      position: "Yoga Instructor",
      email: "phamvanminh@actiwell.com",
      phone: "0901234575",
      joinDate: "2024-01-10",
      status: "active",
      salary: 14000000,
      avatar: "M",
    },
  ],

  // Locations Data (5 cơ sở)
  locations: [
    { id: 1, name: "Cơ sở Quận 1", address: "123 Nguyễn Huệ, Q1, TP.HCM" },
    {
      id: 2,
      name: "Cơ sở Quận 2",
      address: "456 Nguyễn Thị Minh Khai, Q2, TP.HCM",
    },
    { id: 3, name: "Cơ sở Quận 3", address: "789 Lê Văn Sỹ, Q3, TP.HCM" },
    { id: 4, name: "Cơ sở Quận 7", address: "321 Nguyễn Thị Thập, Q7, TP.HCM" },
    {
      id: 5,
      name: "Cơ sở Quận 10",
      address: "654 Cách Mạng Tháng 8, Q10, TP.HCM",
    },
  ],

  // Departments Data
  departments: [
    { id: 1, name: "Fitness", location_id: 1 },
    { id: 2, name: "Swimming Coach", location_id: 1 },
    { id: 3, name: "Pilates", location_id: 2 },
    { id: 4, name: "PT", location_id: 2 },
    { id: 5, name: "Membership", location_id: 3 },
    { id: 6, name: "Fitness", location_id: 4 },
    { id: 7, name: "Swimming Coach", location_id: 5 },
    { id: 8, name: "Pilates", location_id: 5 },
  ],

  // Booking Status Constants (dựa trên database)
  bookingStatus: {
    PENDING: 1, // Chờ xác nhận
    CONFIRMED: 2, // Đã xác nhận
    COMPLETED: 3, // Hoàn thành
    CANCELLED: 4, // Đã hủy
    NO_SHOW: 5, // Không đến
  },

  // Class Bookings Data (theo cấu trúc database)
  bookings: [
    {
      id: 1,
      class_schedule_id: 1,
      class_schedule_time_id: 1,
      customer_id: 1,
      source_id: 1,
      package_id: 1,
      location_id: 1,
      booking_number: 202501001,
      remaining_sessions: 8,
      status: 2, // CONFIRMED
      note: "Khách hàng VIP",
      created_at: "2025-01-15T08:30:00Z",
      updated_at: "2025-01-15T08:30:00Z",
    },
    {
      id: 2,
      class_schedule_id: 2,
      class_schedule_time_id: 2,
      customer_id: 2,
      source_id: 1,
      package_id: 2,
      location_id: 1,
      booking_number: 202501002,
      remaining_sessions: 12,
      status: 3, // COMPLETED
      note: "Đã hoàn thành",
      created_at: "2025-01-14T09:15:00Z",
      updated_at: "2025-01-15T10:00:00Z",
    },
    {
      id: 3,
      class_schedule_id: 3,
      class_schedule_time_id: 3,
      customer_id: 3,
      source_id: 2,
      package_id: 1,
      location_id: 2,
      booking_number: 202501003,
      remaining_sessions: 6,
      status: 1, // PENDING
      note: "Chờ xác nhận",
      created_at: "2025-01-16T14:20:00Z",
      updated_at: "2025-01-16T14:20:00Z",
    },
    {
      id: 4,
      class_schedule_id: 4,
      class_schedule_time_id: 4,
      customer_id: 4,
      source_id: 1,
      package_id: 3,
      location_id: 2,
      booking_number: 202501004,
      remaining_sessions: 10,
      status: 2, // CONFIRMED
      note: "Lịch cố định",
      created_at: "2025-01-13T16:45:00Z",
      updated_at: "2025-01-13T16:45:00Z",
    },
    {
      id: 5,
      class_schedule_id: 5,
      class_schedule_time_id: 5,
      customer_id: 5,
      source_id: 1,
      package_id: 2,
      location_id: 3,
      booking_number: 202501005,
      remaining_sessions: 4,
      status: 3, // COMPLETED
      note: "Buổi tập tốt",
      created_at: "2025-01-12T11:30:00Z",
      updated_at: "2025-01-15T12:00:00Z",
    },
    {
      id: 6,
      class_schedule_id: 6,
      class_schedule_time_id: 6,
      customer_id: 6,
      source_id: 1,
      package_id: 1,
      location_id: 1,
      booking_number: 202501006,
      remaining_sessions: 0,
      status: 4, // CANCELLED
      note: "Khách hàng hủy lịch",
      created_at: "2025-01-14T10:00:00Z",
      updated_at: "2025-01-15T14:00:00Z",
    },
    {
      id: 7,
      class_schedule_id: 7,
      class_schedule_time_id: 7,
      customer_id: 7,
      source_id: 2,
      package_id: 2,
      location_id: 2,
      booking_number: 202501007,
      remaining_sessions: 0,
      status: 4, // CANCELLED
      note: "Hủy do bận việc",
      created_at: "2025-01-13T15:30:00Z",
      updated_at: "2025-01-14T09:00:00Z",
    },
  ],

  // PT Bookings Data (theo cấu trúc database)
  pt_bookings: [
    {
      id: 1,
      customer_id: 1,
      staff_id: 1,
      source_id: 1,
      package_id: 1,
      location_id: 1,
      sale_order_id: 1001,
      sale_package_detail_id: 2001,
      sale_package_detail_code: "PKG001",
      date: "2025-01-15T09:00:00Z",
      start_time: 540, // 9:00 AM in minutes
      end_time: 600, // 10:00 AM in minutes
      booking_number: 202501101,
      remaining_sessions: 8,
      status: 2, // CONFIRMED
      note: "PT session với trainer chuyên nghiệp",
      is_charge: false,
      confirmed: true,
      created_at: "2025-01-14T10:00:00Z",
      updated_at: "2025-01-14T10:00:00Z",
    },
    {
      id: 2,
      customer_id: 2,
      staff_id: 2,
      source_id: 1,
      package_id: 2,
      location_id: 2,
      sale_order_id: 1002,
      sale_package_detail_id: 2002,
      sale_package_detail_code: "PKG002",
      date: "2025-01-15T14:00:00Z",
      start_time: 840, // 2:00 PM in minutes
      end_time: 900, // 3:00 PM in minutes
      booking_number: 202501102,
      remaining_sessions: 12,
      status: 3, // COMPLETED
      note: "Session hoàn thành tốt",
      is_charge: true,
      confirmed: true,
      checked_in_at: "2025-01-15T14:05:00Z",
      created_at: "2025-01-13T15:30:00Z",
      updated_at: "2025-01-15T15:00:00Z",
    },
    {
      id: 3,
      customer_id: 3,
      staff_id: 3,
      source_id: 2,
      package_id: 1,
      location_id: 3,
      sale_order_id: 1003,
      sale_package_detail_id: 2003,
      sale_package_detail_code: "PKG003",
      date: "2025-01-16T16:00:00Z",
      start_time: 960, // 4:00 PM in minutes
      end_time: 1020, // 5:00 PM in minutes
      booking_number: 202501103,
      remaining_sessions: 6,
      status: 1, // PENDING
      note: "Chờ xác nhận từ trainer",
      is_charge: false,
      confirmed: false,
      created_at: "2025-01-15T12:00:00Z",
      updated_at: "2025-01-15T12:00:00Z",
    },
  ],

  // Legacy Appointments Data (để tương thích)
  appointments: [
    {
      id: 1,
      customerId: 1,
      customerName: "Nguyễn Văn An",
      service: "Fitness Training",
      staffId: 1,
      staffName: "Nguyễn Thị Hoa",
      date: "2025-01-15",
      time: "09:00",
      duration: 60,
      status: "confirmed",
      price: 500000,
      location_id: 1,
      created_at: "2025-01-14T10:00:00Z",
    },
    {
      id: 2,
      customerId: 2,
      customerName: "Trần Thị Bình",
      service: "Spa Massage",
      staffId: 2,
      staffName: "Trần Văn Khoa",
      date: "2025-01-15",
      time: "14:00",
      duration: 90,
      status: "completed",
      price: 800000,
      location_id: 2,
      created_at: "2025-01-13T15:30:00Z",
    },
    {
      id: 3,
      customerId: 4,
      customerName: "Phạm Thị Dung",
      service: "Swimming Lesson",
      staffId: 3,
      staffName: "Lê Thị Lan",
      date: "2025-01-16",
      time: "16:00",
      duration: 45,
      status: "pending",
      price: 400000,
      location_id: 3,
      created_at: "2025-01-15T12:00:00Z",
    },
    {
      id: 4,
      customerId: 5,
      customerName: "Hoàng Văn Em",
      service: "Yoga Class",
      staffId: 4,
      staffName: "Phạm Văn Minh",
      date: "2025-01-15",
      time: "18:30",
      duration: 60,
      status: "confirmed",
      price: 300000,
      location_id: 4,
      created_at: "2025-01-14T08:45:00Z",
    },
  ],

  // Services Data
  services: [
    {
      id: 1,
      name: "Fitness Training",
      category: "Fitness",
      price: 500000,
      duration: 60,
      description: "Personal training session with certified trainer",
      status: "active",
      bookings: 45,
    },
    {
      id: 2,
      name: "Spa Massage",
      category: "Spa",
      price: 800000,
      duration: 90,
      description: "Relaxing full body massage therapy",
      status: "active",
      bookings: 30,
    },
    {
      id: 3,
      name: "Swimming Lesson",
      category: "Aquatics",
      price: 400000,
      duration: 45,
      description: "Private swimming instruction",
      status: "active",
      bookings: 25,
    },
    {
      id: 4,
      name: "Yoga Class",
      category: "Wellness",
      price: 300000,
      duration: 60,
      description: "Group yoga session for all levels",
      status: "active",
      bookings: 40,
    },
  ],

  // Packages Data
  packages: [
    {
      id: 1,
      name: "Basic Fitness Package",
      price: 2000000,
      duration: 30,
      services: ["Fitness Training", "Gym Access"],
      description: "Basic fitness package for beginners",
      status: "active",
      sales: 15,
    },
    {
      id: 2,
      name: "Premium Wellness Package",
      price: 5000000,
      duration: 60,
      services: ["Fitness Training", "Spa Massage", "Yoga Class"],
      description: "Complete wellness package with all services",
      status: "active",
      sales: 8,
    },
    {
      id: 3,
      name: "Aqua Fitness Package",
      price: 3000000,
      duration: 45,
      services: ["Swimming Lesson", "Aqua Aerobics"],
      description: "Water-based fitness activities",
      status: "active",
      sales: 12,
    },
  ],

  // Revenue Data (Monthly)
  monthlyRevenue: [
    { month: "Jan", revenue: 42000, customers: 45 },
    { month: "Feb", revenue: 38000, customers: 42 },
    { month: "Mar", revenue: 45000, customers: 48 },
    { month: "Apr", revenue: 52000, customers: 55 },
    { month: "May", revenue: 48000, customers: 52 },
    { month: "Jun", revenue: 55000, customers: 58 },
    { month: "Jul", revenue: 60000, customers: 62 },
    { month: "Aug", revenue: 58000, customers: 60 },
    { month: "Sep", revenue: 62000, customers: 65 },
    { month: "Oct", revenue: 65000, customers: 68 },
    { month: "Nov", revenue: 68000, customers: 70 },
    { month: "Dec", revenue: 45680, customers: 73 },
  ],

  // Service Statistics
  serviceStats: [
    { name: "Fitness", percentage: 45, color: "#556ee6", bookings: 45 },
    { name: "Spa", percentage: 30, color: "#34c38f", bookings: 30 },
    { name: "Swimming", percentage: 15, color: "#50a5f1", bookings: 15 },
    { name: "Yoga", percentage: 10, color: "#f1b44c", bookings: 10 },
  ],

  // Recent Activities
  recentActivities: [
    {
      id: 1,
      type: "booking",
      message: "Nguyễn Văn An đã đặt lịch Fitness Training",
      time: "2 phút trước",
      icon: "bx-calendar-plus",
    },
    {
      id: 2,
      type: "payment",
      message: "Thanh toán 800,000đ từ Trần Thị Bình",
      time: "15 phút trước",
      icon: "bx-credit-card",
    },
    {
      id: 3,
      type: "registration",
      message: "Khách hàng mới: Phạm Thị Dung đã đăng ký",
      time: "1 giờ trước",
      icon: "bx-user-plus",
    },
    {
      id: 4,
      type: "completion",
      message: "Hoàn thành session Yoga Class",
      time: "2 giờ trước",
      icon: "bx-check-circle",
    },
    {
      id: 5,
      type: "cancellation",
      message: "Hủy lịch Swimming Lesson - Lý do: Bận việc",
      time: "3 giờ trước",
      icon: "bx-x-circle",
    },
  ],

  // Notifications
  notifications: [
    {
      id: 1,
      title: "Lịch hẹn sắp tới",
      message: "Bạn có 3 lịch hẹn trong 2 giờ tới",
      time: "10:30",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      title: "Thanh toán thành công",
      message: "Khách hàng Nguyễn Văn An đã thanh toán 500,000đ",
      time: "09:15",
      type: "success",
      read: true,
    },
    {
      id: 3,
      title: "Báo cáo tháng",
      message: "Báo cáo doanh thu tháng 12 đã sẵn sàng",
      time: "08:00",
      type: "info",
      read: false,
    },
  ],

  // Customer Reviews
  reviews: [
    {
      id: 1,
      customerName: "Nguyễn Văn An",
      service: "Fitness Training",
      rating: 5,
      comment: "Rất hài lòng với dịch vụ, huấn luyện viên chuyên nghiệp",
      date: "2024-12-20",
      status: "approved",
    },
    {
      id: 2,
      customerName: "Trần Thị Bình",
      service: "Spa Massage",
      rating: 4,
      comment: "Dịch vụ massage rất tốt, không gian thoải mái",
      date: "2024-12-19",
      status: "approved",
    },
    {
      id: 3,
      customerName: "Lê Văn Cường",
      service: "Swimming Lesson",
      rating: 5,
      comment: "Học bơi rất hiệu quả, giáo viên nhiệt tình",
      date: "2024-12-18",
      status: "pending",
    },
  ],

  // Settings
  settings: {
    businessName: "Actiwell Fitness & Spa",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "028 1234 5678",
    email: "info@actiwell.com",
    website: "www.actiwell.com",
    workingHours: {
      monday: "06:00 - 22:00",
      tuesday: "06:00 - 22:00",
      wednesday: "06:00 - 22:00",
      thursday: "06:00 - 22:00",
      friday: "06:00 - 22:00",
      saturday: "07:00 - 21:00",
      sunday: "08:00 - 20:00",
    },
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
  },

  // Database Analytics Functions (tương tự SQL queries)
  analytics: {
    // Tương đương: SELECT location_id, date_trunc('month', created_at) AS year_month, COUNT(*) FROM bookings WHERE status IN (1,2,3) GROUP BY 1,2
    getMonthlyBookingsByLocation: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      const monthlyStats = {};

      allBookings.forEach((booking) => {
        // Chỉ tính các booking có status: PENDING(1), CONFIRMED(2), COMPLETED(3)
        if ([1, 2, 3].includes(booking.status)) {
          const createdDate = new Date(booking.created_at);
          const yearMonth =
            createdDate.getFullYear() +
            "-" +
            String(createdDate.getMonth() + 1).padStart(2, "0");
          const key = `${booking.location_id}_${yearMonth}`;

          if (!monthlyStats[key]) {
            monthlyStats[key] = {
              location_id: booking.location_id,
              location_name:
                this.locations.find((loc) => loc.id === booking.location_id)
                  ?.name || "Unknown",
              year_month: yearMonth,
              count: 0,
            };
          }
          monthlyStats[key].count++;
        }
      });

      return Object.values(monthlyStats);
    },

    // Tương đương: SELECT location_id, COUNT(*) FROM bookings WHERE status = 2 GROUP BY 1
    getConfirmedBookingsByLocation: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      const locationStats = {};

      allBookings.forEach((booking) => {
        if (booking.status === 2) {
          // CONFIRMED
          if (!locationStats[booking.location_id]) {
            locationStats[booking.location_id] = {
              location_id: booking.location_id,
              location_name:
                this.locations.find((loc) => loc.id === booking.location_id)
                  ?.name || "Unknown",
              count: 0,
            };
          }
          locationStats[booking.location_id].count++;
        }
      });

      return Object.values(locationStats);
    },

    // Tương đương: SELECT COUNT(*) FROM bookings WHERE status = 1 (PENDING)
    getPendingBookingsCount: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      return allBookings.filter((booking) => booking.status === 1).length;
    },

    // Tương đương: SELECT COUNT(*) FROM bookings WHERE status = 3 (COMPLETED)
    getCompletedBookingsCount: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      return allBookings.filter((booking) => booking.status === 3).length;
    },

    // Tương đương: SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURDATE()
    getTodayBookingsCount: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      const today = new Date().toISOString().split("T")[0];

      return allBookings.filter((booking) => {
        const bookingDate = new Date(booking.created_at)
          .toISOString()
          .split("T")[0];
        return bookingDate === today;
      }).length;
    },

    // Tương đương: SELECT location_id, department_id, COUNT(*) FROM bookings b JOIN departments d ON b.location_id = d.location_id GROUP BY 1,2
    getBookingsByLocationAndDepartment: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      const stats = {};

      allBookings.forEach((booking) => {
        const department = this.departments.find(
          (dept) => dept.location_id === booking.location_id
        );
        if (department) {
          const key = `${booking.location_id}_${department.id}`;
          if (!stats[key]) {
            stats[key] = {
              location_id: booking.location_id,
              location_name:
                this.locations.find((loc) => loc.id === booking.location_id)
                  ?.name || "Unknown",
              department_id: department.id,
              department_name: department.name,
              count: 0,
            };
          }
          stats[key].count++;
        }
      });

      return Object.values(stats);
    },

    // Tương đương: SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)
    getCancellationRate: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];

      if (allBookings.length === 0) return 0;

      const cancelledCount = allBookings.filter(
        (booking) => booking.status === 4
      ).length;
      const totalCount = allBookings.length;

      return totalCount > 0 ? (cancelledCount / totalCount) * 100 : 0;
    },

    // Tương đương: SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0) GROUP BY location_id
    getCancellationRateByLocation: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      const locationStats = {};

      allBookings.forEach((booking) => {
        if (!locationStats[booking.location_id]) {
          locationStats[booking.location_id] = {
            location_id: booking.location_id,
            location_name:
              this.locations.find((loc) => loc.id === booking.location_id)
                ?.name || "Unknown",
            total: 0,
            cancelled: 0,
            rate: 0,
          };
        }
        locationStats[booking.location_id].total++;
        if (booking.status === 4) {
          locationStats[booking.location_id].cancelled++;
        }
      });

      // Calculate rate for each location
      Object.values(locationStats).forEach((stat) => {
        stat.rate = stat.total > 0 ? (stat.cancelled / stat.total) * 100 : 0;
      });

      return Object.values(locationStats);
    },

    // Tương đương: COUNT(*) WHERE status = 4
    getCancelledBookingsCount: function () {
      const allBookings = [...this.bookings, ...this.pt_bookings];
      return allBookings.filter((booking) => booking.status === 4).length;
    },
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = SampleData;
} else {
  window.SampleData = SampleData;
}
