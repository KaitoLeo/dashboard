(function (w) {
  "use strict";

  // Data Generator for Dynamic Content
  const DataGenerator = {
    // Base data pools
    names: [
      "Nguyễn Văn An",
      "Trần Thị Bình",
      "Lê Văn Cường",
      "Phạm Thị Dung",
      "Hoàng Văn Em",
      "Vũ Thị Phương",
      "Đặng Văn Giang",
      "Bùi Thị Hoa",
      "Ngô Văn Ích",
      "Lý Thị Kim",
      "Võ Văn Long",
      "Đinh Thị Mai",
      "Bùi Văn Nam",
      "Phan Thị Oanh",
      "Tôn Văn Phúc",
      "Lê Thị Quỳnh",
      "Nguyễn Văn Sơn",
      "Trần Thị Tuyết",
      "Lê Văn Uyên",
      "Phạm Thị Vân",
      "Hoàng Văn Xuyên",
      "Vũ Thị Yến",
      "Đặng Văn Zũ",
      "Bùi Thị Anh",
      "Ngô Văn Bình",
    ],

    phones: [
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
      "0901234577",
      "0901234578",
      "0901234579",
      "0901234580",
      "0901234581",
      "0901234582",
      "0901234583",
      "0901234584",
      "0901234585",
      "0901234586",
    ],

    locations: [
      { name: "Tôn Thất Thuyết", key: "ton-that-thuyet" },
      { name: "Huỳnh Thúc Kháng", key: "huynh-thuc-khang" },
      { name: "Giảng Võ", key: "giang-vo" },
      { name: "Hào Nam", key: "hao-nam" },
      { name: "Nguyễn Tuân", key: "nguyen-tuan" },
    ],

    departments: [
      { name: "Membership", key: "membership" },
      { name: "PT Fitness", key: "pt-fitness" },
      { name: "Pilates", key: "pilates" },
      { name: "Swimming Coach", key: "swimming-coach" },
    ],

    serviceTypes: [
      { name: "Gym", key: "gym" },
      { name: "Yoga", key: "yoga" },
      { name: "Group X", key: "group-x" },
      { name: "Pool", key: "pool" },
      { name: "Lớp 1:1", key: "1-1" },
      { name: "Lớp 1:2", key: "1-2" },
      { name: "Lớp nhóm", key: "group" },
    ],

    staffMembers: [
      "Nguyễn Thị Lan",
      "Trần Văn Minh",
      "Lê Thị Hương",
      "Phạm Văn Đức",
      "Hoàng Thị Mai",
      "Võ Văn Sơn",
      "Ngô Thị Linh",
      "Lý Văn Tùng",
      "Đỗ Thị Nga",
      "Bùi Văn Hùng",
      "Vũ Thị Mai",
      "Đinh Văn Quang",
      "Trần Thị Y",
      "Lê Văn Z",
      "Phạm Thị Hoa",
    ],

    // Time ranges
    timeRanges: {
      morning: { start: 6, end: 12 },
      afternoon: { start: 12, end: 18 },
      evening: { start: 18, end: 22 },
    },

    // Utility functions
    randomChoice: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    randomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat: function (min, max, decimals = 2) {
      return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    },

    formatTime: function (hour, minute) {
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
    },

    generateTime: function (timeRange = "morning") {
      const range = this.timeRanges[timeRange];
      const hour = this.randomInt(range.start, range.end - 1);
      const minute = this.randomInt(0, 59);
      return this.formatTime(hour, minute);
    },

    generatePhone: function () {
      return this.randomChoice(this.phones);
    },

    generateName: function () {
      return this.randomChoice(this.names);
    },

    generateLocation: function () {
      return this.randomChoice(this.locations);
    },

    generateDepartment: function () {
      return this.randomChoice(this.departments);
    },

    generateServiceType: function () {
      return this.randomChoice(this.serviceTypes);
    },

    generateStaff: function () {
      return this.randomChoice(this.staffMembers);
    },

    // Data generators for specific types
    generateCheckinData: function (count = 100, options = {}) {
      const data = [];
      const {
        timeRange = "morning",
        includeLate = true,
        includeEarly = true,
        departments = this.departments,
        locations = this.locations,
      } = options;

      for (let i = 1; i <= count; i++) {
        const location = this.randomChoice(locations);
        const department = this.randomChoice(departments);
        const serviceType = this.randomChoice(this.serviceTypes);
        const staff = this.generateStaff();

        // Generate time with some variation
        let checkinTime = this.generateTime(timeRange);
        let timeDifference = 0;

        if (includeLate && Math.random() < 0.15) {
          // 15% chance of being late
          const lateMinutes = this.randomInt(5, 60);
          const [hour, minute] = checkinTime.split(":").map(Number);
          const totalMinutes = hour * 60 + minute + lateMinutes;
          const newHour = Math.floor(totalMinutes / 60);
          const newMinute = totalMinutes % 60;
          checkinTime = this.formatTime(newHour, newMinute);
          timeDifference = lateMinutes;
        } else if (includeEarly && Math.random() < 0.1) {
          // 10% chance of being early
          const earlyMinutes = this.randomInt(5, 30);
          const [hour, minute] = checkinTime.split(":").map(Number);
          const totalMinutes = hour * 60 + minute - earlyMinutes;
          const newHour = Math.floor(totalMinutes / 60);
          const newMinute = totalMinutes % 60;
          checkinTime = this.formatTime(newHour, newMinute);
          timeDifference = -earlyMinutes;
        }

        data.push({
          id: i,
          memberName: this.generateName(),
          memberId: `HV${String(i).padStart(3, "0")}`,
          phone: this.generatePhone(),
          location: location.name,
          locationKey: location.key,
          department: department.name,
          departmentKey: department.key,
          serviceType: serviceType.name,
          serviceTypeKey: serviceType.key,
          staffInCharge: staff,
          checkinTime: checkinTime,
          timeDifference: timeDifference,
          isLate: timeDifference > 0,
          isEarly: timeDifference < 0,
          createdAt: new Date().toISOString(),
        });
      }

      return data;
    },

    generateRevenueData: function (count = 50, options = {}) {
      const data = [];
      const {
        minAmount = 100000,
        maxAmount = 5000000,
        departments = this.departments,
        locations = this.locations,
      } = options;

      for (let i = 1; i <= count; i++) {
        const location = this.randomChoice(locations);
        const department = this.randomChoice(departments);
        const amount = this.randomInt(minAmount, maxAmount);
        const paymentMethod = this.randomChoice([
          "Tiền mặt",
          "Chuyển khoản",
          "Thẻ tín dụng",
        ]);

        data.push({
          id: i,
          memberName: this.generateName(),
          memberId: `HV${String(i).padStart(3, "0")}`,
          location: location.name,
          locationKey: location.key,
          department: department.name,
          departmentKey: department.key,
          amount: amount,
          paymentMethod: paymentMethod,
          staffInCharge: this.generateStaff(),
          createdAt: new Date().toISOString(),
        });
      }

      return data;
    },

    generateBookingData: function (count = 30, options = {}) {
      const data = [];
      const { locations = this.locations, departments = this.departments } =
        options;

      for (let i = 1; i <= count; i++) {
        const location = this.randomChoice(locations);
        const department = this.randomChoice(departments);
        const status = this.randomChoice([
          "Hoàn thành",
          "Đang diễn ra",
          "Đã hủy",
          "Chờ xác nhận",
        ]);
        const bookingTime = this.generateTime("morning");

        data.push({
          id: i,
          memberName: this.generateName(),
          memberId: `HV${String(i).padStart(3, "0")}`,
          location: location.name,
          locationKey: location.key,
          department: department.name,
          departmentKey: department.key,
          bookingTime: bookingTime,
          status: status,
          staffInCharge: this.generateStaff(),
          createdAt: new Date().toISOString(),
        });
      }

      return data;
    },

    generateTrialData: function (count = 20, options = {}) {
      const data = [];
      const { locations = this.locations, departments = this.departments } =
        options;

      for (let i = 1; i <= count; i++) {
        const location = this.randomChoice(locations);
        const department = this.randomChoice(departments);
        const result = this.randomChoice([
          "Đã đăng ký",
          "Quan tâm",
          "Chưa quyết định",
          "Không quan tâm",
        ]);
        const duration = this.randomInt(30, 120);

        data.push({
          id: i,
          name: this.generateName(),
          phone: this.generatePhone(),
          time: this.generateTime("morning"),
          club: location.name,
          locationKey: location.key,
          session: `${department.name} Trial`,
          department: department.name,
          departmentKey: department.key,
          duration: `${duration} phút`,
          result: result,
          staffInCharge: this.generateStaff(),
          createdAt: new Date().toISOString(),
        });
      }

      return data;
    },

    generateLiveMembersData: function (count = 50, options = {}) {
      const data = [];
      const {
        locations = this.locations,
        departments = this.departments,
        includeOffline = true,
      } = options;

      for (let i = 1; i <= count; i++) {
        const location = this.randomChoice(locations);
        const department = this.randomChoice(departments);
        const staff = this.generateStaff();

        // Generate start time (within last 2 hours)
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - this.randomInt(0, 120));

        // Generate duration (15-120 minutes)
        const duration = this.randomInt(15, 120);

        // Generate status (90% online, 10% offline)
        const status = Math.random() > 0.1 ? "online" : "offline";

        data.push({
          id: i,
          memberName: this.generateName(),
          memberId: `HV${String(i).padStart(3, "0")}`,
          phone: this.generatePhone(),
          location: location.name,
          locationKey: location.key,
          department: department.name,
          departmentKey: department.key,
          staffInCharge: staff,
          startTime: startTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          duration: duration,
          status: status,
          createdAt: startTime.toISOString(),
        });
      }

      return data;
    },

    // Statistics calculation
    calculateStats: function (data, groupBy = "department") {
      const stats = {};

      data.forEach((item) => {
        const key = item[groupBy] || "Unknown";
        if (!stats[key]) {
          stats[key] = { count: 0, total: 0 };
        }
        stats[key].count++;
        if (item.amount) {
          stats[key].total += item.amount;
        }
      });

      return stats;
    },

    // Filter data
    filterData: function (data, filters = {}) {
      return data.filter((item) => {
        let match = true;

        if (filters.location && filters.location !== "all") {
          match = match && item.locationKey === filters.location;
        }

        if (filters.department && filters.department !== "all") {
          match = match && item.departmentKey === filters.department;
        }

        if (filters.serviceType && filters.serviceType !== "all") {
          match = match && item.serviceTypeKey === filters.serviceType;
        }

        if (filters.status && filters.status !== "all") {
          match = match && item.status === filters.status;
        }

        if (filters.staff && filters.staff !== "all") {
          match = match && item.staffInCharge === filters.staff;
        }

        if (filters.dateFrom && item.createdAt) {
          match =
            match && new Date(item.createdAt) >= new Date(filters.dateFrom);
        }

        if (filters.dateTo && item.createdAt) {
          match = match && new Date(item.createdAt) <= new Date(filters.dateTo);
        }

        return match;
      });
    },
  };

  // Export to window
  w.DataGenerator = DataGenerator;
})(window);
