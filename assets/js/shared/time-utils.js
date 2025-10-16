(function (w) {
  function normalizeTimeKey(key) {
    const map = {
      today: "today",
      yesterday: "yesterday",
      week: "week",
      mtd: "mtd",
      month: "month",
      ytd: "ytd",
      year: "year",
    };
    return map[(key || "").toLowerCase()] || "today";
  }

  function getDateRange(timeKey, from, to) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (timeKey) {
      case "today":
        return {
          from: today,
          to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        };

      case "yesterday":
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return {
          from: yesterday,
          to: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
        };

      case "week":
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
        startOfWeek.setDate(diff);
        const endOfWeek = new Date(
          startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1
        );
        return {
          from: startOfWeek,
          to: endOfWeek,
        };

      case "mtd":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          from: startOfMonth,
          to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        };

      case "month":
        const startOfCurrentMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const endOfCurrentMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        return {
          from: startOfCurrentMonth,
          to: endOfCurrentMonth,
        };

      case "ytd":
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return {
          from: startOfYear,
          to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        };

      case "year":
        const startOfCurrentYear = new Date(today.getFullYear(), 0, 1);
        const endOfCurrentYear = new Date(
          today.getFullYear(),
          11,
          31,
          23,
          59,
          59
        );
        return {
          from: startOfCurrentYear,
          to: endOfCurrentYear,
        };

      default:
        if (from && to) {
          return {
            from: new Date(from),
            to: new Date(to),
          };
        }
        return {
          from: today,
          to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        };
    }
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function formatDateTime(date) {
    return date.toISOString();
  }

  function isDateInRange(date, from, to) {
    const d = new Date(date);
    return d >= from && d <= to;
  }

  function getTimeKeyLabel(timeKey) {
    const labels = {
      today: "Hôm nay",
      yesterday: "Hôm qua",
      week: "Tuần này",
      mtd: "Tháng này (MTD)",
      month: "Tháng này",
      ytd: "Năm nay (YTD)",
      year: "Năm nay",
    };
    return labels[timeKey] || "Hôm nay";
  }

  w.TimeUtils = {
    normalizeTimeKey,
    getDateRange,
    formatDate,
    formatDateTime,
    isDateInRange,
    getTimeKeyLabel,
  };
})(window);









