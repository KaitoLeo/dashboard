(function () {
  "use strict";

  const STATE = {
    data: [],
    filtered: [],
    page: 1,
    perPage: 20,
    charts: {
      classType: null,
      hourlyTrend: null,
    },
  };

  const DOM = {};

  /**
   * Entry point
   */
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    STATE.data = generateSampleData(52);
    STATE.filtered = [...STATE.data];

    bindEvents();
    updateClock();
    render();
    setInterval(updateClock, 1000);
  }

  function cacheDom() {
    DOM.time = document.getElementById("currentTime");
    DOM.date = document.getElementById("currentDate");
    DOM.tableBody = document.getElementById("ptFitnessCheckinTableBody");
    DOM.pagination = document.getElementById("pagination");
    DOM.metricTotal = document.getElementById("totalCheckins");
    DOM.metric1v1 = document.getElementById("class1v1Count");
    DOM.metric1v2 = document.getElementById("class1v2Count");
    DOM.metricGroup = document.getElementById("classGroupCount");

    DOM.filters = {
      location: document.getElementById("locationFilter"),
      classType: document.getElementById("classTypeFilter"),
      service: document.getElementById("serviceFilter"),
      instructor: document.getElementById("instructorFilter"),
      staff: document.getElementById("staffFilter"),
    };
  }

  function bindEvents() {
    const applyBtn = document.getElementById("applyFilterBtn");
    const resetBtn = document.getElementById("resetFilterBtn");

    if (applyBtn) {
      applyBtn.addEventListener("click", applyFilters);
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", resetFilters);
    }

    if (DOM.pagination) {
      DOM.pagination.addEventListener("click", onPaginationClick);
    }
  }

  function render() {
    updateMetrics();
    renderTable();
    renderPagination();
    renderCharts();
  }

  function updateClock() {
    const now = new Date();
    if (DOM.time) {
      DOM.time.textContent = now.toLocaleTimeString("vi-VN");
    }
    if (DOM.date) {
      DOM.date.textContent = now.toLocaleDateString("vi-VN");
    }
  }

  function applyFilters() {
    const filters = getFilters();
    STATE.filtered = STATE.data.filter((item) => {
      const locationMatch =
        filters.location === "all" || item.locationKey === filters.location;
      const classTypeMatch =
        filters.classType === "all" || item.classTypeKey === filters.classType;
      const serviceMatch =
        filters.service === "all" || item.serviceKey === filters.service;
      const instructorMatch =
        filters.instructor === "all" || item.instructor === filters.instructor;
      const staffMatch =
        filters.staff === "all" || item.staffInCharge === filters.staff;

      return (
        locationMatch &&
        classTypeMatch &&
        serviceMatch &&
        instructorMatch &&
        staffMatch
      );
    });

    STATE.page = 1;
    render();
  }

  function resetFilters() {
    Object.values(DOM.filters).forEach((select) => {
      if (select) {
        select.value = "all";
      }
    });

    STATE.filtered = [...STATE.data];
    STATE.page = 1;
    render();
  }

  function getFilters() {
    return {
      location: DOM.filters.location?.value ?? "all",
      classType: DOM.filters.classType?.value ?? "all",
      service: DOM.filters.service?.value ?? "all",
      instructor: DOM.filters.instructor?.value ?? "all",
      staff: DOM.filters.staff?.value ?? "all",
    };
  }

  function renderTable() {
    if (!DOM.tableBody) return;

    DOM.tableBody.innerHTML = "";
    const start = (STATE.page - 1) * STATE.perPage;
    const pageData = STATE.filtered.slice(start, start + STATE.perPage);

    if (pageData.length === 0) {
      DOM.tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted py-4">
            Không có dữ liệu phù hợp bộ lọc.
          </td>
        </tr>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    pageData.forEach((checkin, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${start + index + 1}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="avatar-sm bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-2">
              ${checkin.memberName.charAt(0)}
            </div>
            <div>
              <div class="fw-bold">${checkin.memberName}</div>
              <small class="text-muted">ID: ${checkin.id}</small>
            </div>
          </div>
        </td>
        <td>${checkin.location}</td>
        <td>
          <span class="badge ${getClassBadge(checkin.classType)}">${checkin.classType}</span>
        </td>
        <td>
          <span class="badge ${getServiceBadge(checkin.service)}">${checkin.service}</span>
        </td>
        <td>${checkin.instructor}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="avatar-sm bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 24px; height: 24px; font-size: 10px;">
              ${getStaffInitial(checkin.staffInCharge)}
            </div>
            <div class="fw-bold small">${
              checkin.staffInCharge || "Chưa phân công"
            }</div>
          </div>
        </td>
        <td><span class="text-warning fw-bold">${checkin.checkinTime}</span></td>`;
      fragment.appendChild(row);
    });

    DOM.tableBody.appendChild(fragment);
  }

  function renderPagination() {
    if (!DOM.pagination) return;

    DOM.pagination.innerHTML = "";
    const totalPages = Math.ceil(STATE.filtered.length / STATE.perPage);
    if (totalPages <= 1) return;

    DOM.pagination.appendChild(createPageButton(
      "Trước",
      STATE.page - 1,
      STATE.page === 1
    ));

    for (let page = 1; page <= totalPages; page += 1) {
      DOM.pagination.appendChild(createPageButton(String(page), page, false, page === STATE.page));
    }

    DOM.pagination.appendChild(createPageButton(
      "Tiếp",
      STATE.page + 1,
      STATE.page === totalPages
    ));
  }

  function createPageButton(label, page, disabled, active) {
    const li = document.createElement("li");
    li.className = `page-item${active ? " active" : ""}${disabled ? " disabled" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "page-link";
    button.textContent = label;
    button.dataset.page = String(page);
    button.disabled = disabled;

    li.appendChild(button);
    return li;
  }

  function onPaginationClick(event) {
    const button = event.target.closest("button[data-page]");
    if (!button) return;

    const targetPage = Number.parseInt(button.dataset.page, 10);
    if (Number.isNaN(targetPage)) return;
    if (button.disabled || targetPage === STATE.page) return;

    STATE.page = targetPage;
    renderTable();
    renderPagination();
  }

  function renderCharts() {
    const counts = getClassTypeCounts(STATE.filtered);
    const hourly = getHourlyTrend(STATE.filtered);

    renderClassTypeChart(counts);
    renderHourlyChart(hourly);
  }

  function renderClassTypeChart(counts) {
    const canvas = document.getElementById("classTypeChart");
    if (!canvas || typeof Chart === "undefined") return;

    const data = [counts["Lớp nhóm"], counts["Lớp 1:1"], counts["Lớp 1:2"]];

    if (!STATE.charts.classType) {
      STATE.charts.classType = new Chart(canvas.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ["Lớp nhóm", "Lớp 1:1", "Lớp 1:2"],
          datasets: [
            {
              data,
              backgroundColor: ["#ffc107", "#28a745", "#20c997"],
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                padding: 18,
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
          },
        },
      });
      return;
    }

    STATE.charts.classType.data.datasets[0].data = data;
    STATE.charts.classType.update();
  }

  function renderHourlyChart(hourly) {
    const canvas = document.getElementById("hourlyTrendChart");
    if (!canvas || typeof Chart === "undefined") return;

    const labels = hourly.labels.length ? hourly.labels : ["--:--"];
    const values = hourly.labels.length ? hourly.values : [0];

    if (!STATE.charts.hourlyTrend) {
      STATE.charts.hourlyTrend = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Số lượng check-in",
              data: values,
              backgroundColor: "#ffc107",
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 },
            },
          },
        },
      });
      return;
    }

    STATE.charts.hourlyTrend.data.labels = labels;
    STATE.charts.hourlyTrend.data.datasets[0].data = values;
    STATE.charts.hourlyTrend.update();
  }

  function updateMetrics() {
    const total = STATE.filtered.length;
    const counts = getClassTypeCounts(STATE.filtered);

    if (DOM.metricTotal) DOM.metricTotal.textContent = total;
    if (DOM.metric1v1) DOM.metric1v1.textContent = counts["Lớp 1:1"];
    if (DOM.metric1v2) DOM.metric1v2.textContent = counts["Lớp 1:2"];
    if (DOM.metricGroup) DOM.metricGroup.textContent = counts["Lớp nhóm"];
  }

  function getClassTypeCounts(records) {
    return records.reduce(
      (acc, item) => {
        if (acc[item.classType] !== undefined) {
          acc[item.classType] += 1;
        }
        return acc;
      },
      {
        "Lớp nhóm": 0,
        "Lớp 1:1": 0,
        "Lớp 1:2": 0,
      }
    );
  }

  function getHourlyTrend(records) {
    const bucket = new Map();

    records.forEach((item) => {
      const hour = item.checkinTime.slice(0, 2);
      const label = `${hour}:00`;
      bucket.set(label, (bucket.get(label) || 0) + 1);
    });

    const labels = Array.from(bucket.keys()).sort();
    const values = labels.map((label) => bucket.get(label) || 0);

    return { labels, values };
  }

  function generateSampleData(count) {
    const locations = [
      { name: "Tôn Thất Thuyết", key: "ton-that-thuyet" },
      { name: "Huỳnh Thúc Kháng", key: "huynh-thuc-khang" },
      { name: "Giảng Võ", key: "giang-vo" },
      { name: "Hào Nam", key: "hao-nam" },
      { name: "Nguyễn Tuân", key: "nguyen-tuan" },
    ];

    const classTypes = [
      { name: "Lớp 1:1", key: "1-1" },
      { name: "Lớp 1:2", key: "1-2" },
      { name: "Lớp nhóm", key: "group" },
    ];

    const services = [
      { name: "PT Gym", key: "pt-gym" },
      { name: "PT kickfit", key: "pt-kickfit" },
      { name: "Streching", key: "streching" },
      { name: "EMS", key: "ems" },
      { name: "MIX", key: "mix" },
    ];

    const instructors = [
      "Thầy Minh",
      "Cô Lan",
      "Thầy Tuấn",
      "Cô Hương",
      "Thầy Nam",
      "Cô Mai",
      "Thầy Đức",
      "Cô Linh",
      "Thầy Hùng",
      "Cô Nga",
    ];

    const staffMembers = [
      "Nguyễn Thị Lan",
      "Lê Văn Minh",
      "Phạm Thị Hoa",
      "Hoàng Văn Đức",
      "Vũ Thị Mai",
      "Ngô Văn Tùng",
      "Lý Thị Hương",
      "Trần Văn Đức",
      "Bùi Thị Hoa",
      "Đặng Văn Minh",
      "Nguyễn Thị Mai",
      "Lê Văn Hùng",
    ];

    const hours = [
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
    ];

    const minutes = ["00", "15", "30", "45"];

    const records = [];
    for (let i = 1; i <= count; i += 1) {
      const location = pickRandom(locations);
      const classType = pickRandom(classTypes);
      const service = pickRandom(services);
      const instructor = pickRandom(instructors);
      const staff = pickRandom(staffMembers);
      const hour = pickRandom(hours);
      const minute = pickRandom(minutes);

      records.push({
        id: i,
        memberName: `Hội viên PT ${String(i).padStart(3, "0")}`,
        location: location.name,
        locationKey: location.key,
        classType: classType.name,
        classTypeKey: classType.key,
        service: service.name,
        serviceKey: service.key,
        instructor,
        staffInCharge: staff,
        checkinTime: `${hour}:${minute}`,
      });
    }

    return records;
  }

  function pickRandom(collection) {
    return collection[Math.floor(Math.random() * collection.length)];
  }

  function getClassBadge(classType) {
    switch (classType) {
      case "Lớp nhóm":
        return "bg-primary";
      case "Lớp 1:1":
        return "bg-success";
      case "Lớp 1:2":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  }

  function getServiceBadge(service) {
    switch (service) {
      case "PT Gym":
        return "bg-success";
      case "PT kickfit":
        return "bg-warning text-dark";
      case "Streching":
        return "bg-info";
      case "EMS":
        return "bg-danger";
      case "MIX":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  }

  function getStaffInitial(name) {
    if (!name) return "N/A";
    const lastWord = name.trim().split(" ").pop();
    return lastWord ? lastWord.charAt(0) : "N";
  }
})();
