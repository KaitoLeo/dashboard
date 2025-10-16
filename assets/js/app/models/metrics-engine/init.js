/**
 * Metrics Engine - Initialization
 * Khởi tạo metrics engine với dữ liệu mẫu
 */

// Khởi tạo metrics engine khi trang load
document.addEventListener("DOMContentLoaded", async function () {
  try {
    console.log("Initializing Metrics Engine...");

    // Chờ dữ liệu mẫu load xong
    if (typeof window.lateCheckinData === "undefined") {
      console.warn("Sample data not loaded yet, retrying...");
      setTimeout(initializeMetricsEngine, 1000);
      return;
    }

    await initializeMetricsEngine();
  } catch (error) {
    console.error("Failed to initialize Metrics Engine:", error);
  }
});

async function initializeMetricsEngine() {
  try {
    // Chuẩn bị dữ liệu mẫu
    const sampleData = {
      checkins: window.lateCheckinData || [],
    };

    // Khởi tạo metrics engine
    await window.MetricsEngine.initialize(sampleData);

    // Thêm listeners để cập nhật UI
    setupMetricsListeners();

    // Cập nhật UI ban đầu
    updateUIFromMetrics();

    console.log("Metrics Engine initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Metrics Engine:", error);
  }
}

function setupMetricsListeners() {
  // Listener cho khi metrics được cập nhật
  window.MetricsEngine.addListener("metricsUpdated", function () {
    updateUIFromMetrics();
  });

  // Listener cho khi filters được cập nhật
  window.MetricsEngine.addListener("filtersUpdated", function (data) {
    console.log("Filters updated:", data);
    updateUIFromMetrics();
  });
}

function updateUIFromMetrics() {
  try {
    // Cập nhật các metric cards
    updateMetricCards();

    // Cập nhật charts
    updateCharts();

    // Cập nhật tables
    updateTables();
  } catch (error) {
    console.error("Failed to update UI from metrics:", error);
  }
}

function updateMetricCards() {
  // Cập nhật metric card "Check-in sai giờ"
  const lateCheckinsMetric = window.MetricsEngine.getMetric("lateCheckins");
  const lateCheckinElement = document.querySelector(
    '[data-metric="lateCheckins"]'
  );
  if (lateCheckinElement) {
    const valueElement = lateCheckinElement.querySelector(".metric-value");
    if (valueElement) {
      valueElement.textContent = lateCheckinsMetric.formattedValue;
    }
  }

  // Cập nhật metric card "Tổng check-in"
  const totalCheckinsMetric = window.MetricsEngine.getMetric("totalCheckins");
  const totalCheckinElement = document.querySelector(
    '[data-metric="totalCheckins"]'
  );
  if (totalCheckinElement) {
    const valueElement = totalCheckinElement.querySelector(".metric-value");
    if (valueElement) {
      valueElement.textContent = totalCheckinsMetric.formattedValue;
    }
  }

  // Cập nhật các metric cards khác
  updateOtherMetricCards();
}

function updateOtherMetricCards() {
  // Cập nhật metric cards cho các bộ phận
  const departmentMetrics = window.MetricsEngine.getMetric(
    "checkinsByDepartment"
  );
  if (departmentMetrics && departmentMetrics.value) {
    Object.entries(departmentMetrics.value).forEach(([department, count]) => {
      const element = document.querySelector(
        `[data-metric="${department.toLowerCase()}"]`
      );
      if (element) {
        const valueElement = element.querySelector(".metric-value");
        if (valueElement) {
          valueElement.textContent = new Intl.NumberFormat("vi-VN").format(
            count
          );
        }
      }
    });
  }
}

function updateCharts() {
  // Cập nhật biểu đồ phân bố theo bộ phận
  const departmentMetrics = window.MetricsEngine.getMetric(
    "checkinsByDepartment"
  );
  if (departmentMetrics && departmentMetrics.value) {
    updateDepartmentChart(departmentMetrics.value);
  }

  // Cập nhật biểu đồ phân bố theo cơ sở
  const locationMetrics = window.MetricsEngine.getMetric("checkinsByLocation");
  if (locationMetrics && locationMetrics.value) {
    updateLocationChart(locationMetrics.value);
  }
}

function updateDepartmentChart(data) {
  const canvas = document.getElementById("departmentChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Xóa chart cũ nếu có
  if (window.departmentChart) {
    window.departmentChart.destroy();
  }

  // Tạo chart mới
  window.departmentChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

function updateLocationChart(data) {
  const canvas = document.getElementById("locationChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Xóa chart cũ nếu có
  if (window.locationChart) {
    window.locationChart.destroy();
  }

  // Tạo chart mới
  window.locationChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Số lượt check-in",
          data: Object.values(data),
          backgroundColor: "#36A2EB",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateTables() {
  // Cập nhật bảng thống kê check-in sai giờ
  const lateCheckinStats = window.MetricsEngine.getMetric(
    "lateCheckinStatistics"
  );
  if (lateCheckinStats && lateCheckinStats.value) {
    updateLateCheckinTable(lateCheckinStats.value);
  }
}

function updateLateCheckinTable(data) {
  const tableBody = document.getElementById("lateCheckinTableBody");
  if (!tableBody) return;

  // Xóa nội dung cũ
  tableBody.innerHTML = "";

  // Thêm các hàng dữ liệu
  data.locations.forEach((location) => {
    const row = document.createElement("tr");

    // Cột cơ sở
    const locationCell = document.createElement("td");
    locationCell.className = "fw-bold";
    locationCell.textContent = location;
    row.appendChild(locationCell);

    // Các cột bộ phận
    data.departments.forEach((department) => {
      const cell = document.createElement("td");
      cell.className = "text-center";
      cell.textContent = data.statistics[location][department] || 0;
      row.appendChild(cell);
    });

    // Cột tổng cộng
    const totalCell = document.createElement("td");
    totalCell.className = "fw-bold text-center";
    totalCell.textContent = data.totals.byLocation[location] || 0;
    row.appendChild(totalCell);

    tableBody.appendChild(row);
  });

  // Thêm hàng tổng cộng
  const totalRow = document.createElement("tr");
  totalRow.className = "table-info";

  const totalLabelCell = document.createElement("td");
  totalLabelCell.className = "fw-bold";
  totalLabelCell.textContent = "Tổng cộng";
  totalRow.appendChild(totalLabelCell);

  data.departments.forEach((department) => {
    const cell = document.createElement("td");
    cell.className = "fw-bold text-center";
    cell.textContent = data.totals.byDepartment[department] || 0;
    totalRow.appendChild(cell);
  });

  const grandTotalCell = document.createElement("td");
  grandTotalCell.className = "fw-bold text-center";
  grandTotalCell.textContent = data.totals.grandTotal || 0;
  totalRow.appendChild(grandTotalCell);

  tableBody.appendChild(totalRow);
}

// Export functions để sử dụng từ bên ngoài
window.MetricsEngineInit = {
  initialize: initializeMetricsEngine,
  updateUI: updateUIFromMetrics,
  updateMetricCards,
  updateCharts,
  updateTables,
};
