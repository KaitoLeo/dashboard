/**
 * Checkin Mock Data Generator
 * Generate realistic check-in data
 */

(function (window) {
  "use strict";

  function generateCheckinData(options = {}) {
    const {
      startDate = new Date(),
      endDate = new Date(),
      services = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"],
      locations = [
        "Tôn Thất Thuyết",
        "Huỳnh Thúc Kháng",
        "Giảng Võ",
        "Hào Nam",
        "Nguyễn Tuân",
      ],
    } = options;

    const checkinData = [];
    const currentDate = new Date(startDate);

    const members = [
      "Nguyễn Văn A",
      "Trần Thị B",
      "Lê Văn C",
      "Phạm Thị D",
      "Hoàng Văn E",
    ];

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // More check-ins on weekdays
      const numCheckins = isWeekend
        ? Math.floor(Math.random() * 80) + 100
        : Math.floor(Math.random() * 120) + 150;

      for (let i = 0; i < numCheckins; i++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const location =
          locations[Math.floor(Math.random() * locations.length)];
        const member = members[Math.floor(Math.random() * members.length)];

        const hour = 6 + Math.floor(Math.random() * 14);
        const minute = Math.floor(Math.random() * 60);

        checkinData.push({
          id: checkinData.length + 1,
          date: new Date(currentDate),
          time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
            2,
            "0"
          )}`,
          member: member,
          service: service,
          location: location,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return checkinData;
  }

  function generateTodayCheckins() {
    const today = new Date();
    return generateCheckinData({ startDate: today, endDate: today });
  }

  function generateYesterdayCheckins() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return generateCheckinData({ startDate: yesterday, endDate: yesterday });
  }

  function generateMTDCheckins() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return generateCheckinData({ startDate: firstDay, endDate: today });
  }

  // Export
  window.CheckinMockData = {
    generateCheckinData,
    generateTodayCheckins,
    generateYesterdayCheckins,
    generateMTDCheckins,
  };

  // Generate default data
  window.todayCheckins = generateTodayCheckins();
  window.yesterdayCheckins = generateYesterdayCheckins();
  window.mtdCheckins = generateMTDCheckins();

  console.log("✅ Checkin Mock Data Generated:");
  console.log(`   ✔️ Today: ${window.todayCheckins.length} check-ins`);
  console.log(`   ✔️ Yesterday: ${window.yesterdayCheckins.length} check-ins`);
  console.log(`   ✔️ MTD: ${window.mtdCheckins.length} check-ins`);
})(window);
