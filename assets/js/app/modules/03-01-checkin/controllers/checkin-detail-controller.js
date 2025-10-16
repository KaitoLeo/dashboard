(function (global) {
  const App = global.App || {};
  const domain = (App.utils && App.utils.domain) || {};

  const getLocationName =
    domain.getLocationName || ((locationId) => locationId || "all");
  const getDepartmentName =
    domain.getDepartmentName || ((departmentId) => departmentId || "all");

  function updateCheckinTodayPage(data, filters) {
    console.log("Updating checkin today page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-calendar-day me-2"></i>
        Chi tiet Check-in Hom nay - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const checkinValue = document.querySelector("#countValue, #metricValue");
    if (checkinValue && data?.checkin?.today) {
      checkinValue.textContent = data.checkin.today;
    }
  }

  function updateCheckinMTDPage(data, filters) {
    console.log("Updating checkin MTD page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-calendar-alt me-2"></i>
        Chi tiet Check-in MTD - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const checkinValue = document.querySelector("#countValue, #metricValue");
    if (checkinValue && data?.checkin?.mtd) {
      checkinValue.textContent = data.checkin.mtd;
    }
  }

  function updateVisitorsPage(data, filters) {
    console.log("Updating visitors page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-users me-2"></i>
        Chi tiet Khach tham quan - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const visitorsValue = document.querySelector(
      "#countValue, #metricValue, #totalVisitors"
    );
    if (visitorsValue) {
      if (global.ConsistentData) {
        const visitorsData = global.ConsistentData.getVisitorsData(
          "today",
          filters.location
        );
        visitorsValue.textContent = visitorsData.count;
      } else if (data?.visitors?.today) {
        visitorsValue.textContent = data.visitors.today;
      }
    }
  }

  function updateTrialGuestsPage(data, filters) {
    console.log("Updating trial guests page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-dumbbell me-2 text-warning"></i>
        Chi tiet Khach tap thu - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const totalTrialsElement = document.getElementById("totalTrials");
    if (totalTrialsElement && data?.customers?.trial) {
      totalTrialsElement.textContent = data.customers.trial;
    }

    const recordCountElement = document.getElementById("recordCount");
    if (recordCountElement && data?.customers?.trial) {
      recordCountElement.textContent = data.customers.trial;
    }

    if (typeof global.loadTrialGuestsData === "function") {
      setTimeout(() => {
        global.loadTrialGuestsData();
      }, 100);
    }
  }

  function updatePTPage(data, filters) {
    console.log("Updating PT page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-dumbbell me-2"></i>
        Chi tiet PT Sessions - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const ptValue = document.querySelector("#countValue, #metricValue");
    if (ptValue && data?.pt?.today) {
      ptValue.textContent = data.pt.today;
    }
  }

  function updateCheckinFrequencyPage(data, filters) {
    console.log("Updating checkin frequency page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-chart-bar me-2"></i>
        Chi tiet Tan suat Check-in - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const frequencyValue = document.querySelector("#countValue, #metricValue");
    if (frequencyValue && data?.checkinFrequency?.avgPerWeek) {
      frequencyValue.textContent = data.checkinFrequency.avgPerWeek;
    }
  }

  const handlers = {
    "checkin-today": updateCheckinTodayPage,
    "checkin-mtd": updateCheckinMTDPage,
    visitors: updateVisitorsPage,
    "trial-guests": updateTrialGuestsPage,
    pt: updatePTPage,
    "checkin-frequency": updateCheckinFrequencyPage,
  };

  App.modules = App.modules || {};
  App.modules.register?.("03-01-checkin", {
    name: "Check-in Management",
    pages: [
      { code: "03-01-01", patterns: ["checkin-"] },
      { code: "03-01-08", patterns: ["visitors", "trial"] },
    ],
    handlers,
  });

  global.App.controllers = global.App.controllers || {};
  global.App.controllers.checkinDetails = {
    updateCheckinTodayPage,
    updateCheckinMTDPage,
    updateVisitorsPage,
    updateTrialGuestsPage,
    updatePTPage,
    updateCheckinFrequencyPage,
  };
})(window);
