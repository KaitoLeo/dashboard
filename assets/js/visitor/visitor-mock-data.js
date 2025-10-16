/**
 * Visitor Mock Data Generator
 * Generate realistic visitor data
 */

(function (window) {
  "use strict";

  function generateVisitorData(options = {}) {
    const {
      startDate = new Date(),
      endDate = new Date(),
      departments = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"],
      sources = [
        "Walk-in",
        "Hotline",
        "Marketing Web",
        "Marketing Facebook",
        "Refer",
      ],
    } = options;

    const visitorData = [];
    const currentDate = new Date(startDate);

    const names = [
      "Nguyễn Văn A",
      "Trần Thị B",
      "Lê Văn C",
      "Phạm Thị D",
      "Hoàng Văn E",
    ];

    while (currentDate <= endDate) {
      // Random 10-25 visitors per day
      const numVisitors = Math.floor(Math.random() * 15) + 10;

      for (let i = 0; i < numVisitors; i++) {
        const dept =
          departments[Math.floor(Math.random() * departments.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const name = names[Math.floor(Math.random() * names.length)];

        const hour = 8 + Math.floor(Math.random() * 10);
        const minute = Math.floor(Math.random() * 60);

        visitorData.push({
          id: visitorData.length + 1,
          date: new Date(currentDate),
          time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
            2,
            "0"
          )}`,
          name: name,
          phone: `090${Math.floor(Math.random() * 10000000)}`,
          department: dept,
          source: source,
          converted: Math.random() > 0.4, // 60% conversion
          inbody: Math.random() > 0.7, // 30% inbody
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return visitorData;
  }

  function generateTodayVisitors() {
    const today = new Date();
    return generateVisitorData({ startDate: today, endDate: today });
  }

  function generateYesterdayVisitors() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return generateVisitorData({ startDate: yesterday, endDate: yesterday });
  }

  function generateMTDVisitors() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return generateVisitorData({ startDate: firstDay, endDate: today });
  }

  // Export
  window.VisitorMockData = {
    generateVisitorData,
    generateTodayVisitors,
    generateYesterdayVisitors,
    generateMTDVisitors,
  };

  // Generate default data
  window.todayVisitors = generateTodayVisitors();
  window.yesterdayVisitors = generateYesterdayVisitors();
  window.mtdVisitors = generateMTDVisitors();

  console.log("✅ Visitor Mock Data Generated:");
  console.log(`   👥 Today: ${window.todayVisitors.length} visitors`);
  console.log(`   👥 Yesterday: ${window.yesterdayVisitors.length} visitors`);
  console.log(`   👥 MTD: ${window.mtdVisitors.length} visitors`);
})(window);
