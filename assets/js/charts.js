// Charts JavaScript for Actiwell Report System

// Chart instances
let revenueChart = null;
let departmentChart = null;

// Initialize all charts
function initializeCharts() {
  console.log("Initializing charts...");
  initializeRevenueChart();
  initializeDepartmentChart();
  console.log("Charts initialized successfully");
}

// Initialize revenue chart
function initializeRevenueChart() {
  const ctx = document.getElementById("revenueChart");
  if (!ctx) {
    console.log("Revenue chart canvas not found");
    return;
  }
  console.log("Initializing revenue chart...");

  const data = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Doanh thu thực tế (VNĐ)",
        data: [
          185000000, 210000000, 195000000, 235000000, 255000000, 220000000,
          240000000, 265000000, 215000000, 285000000, 275000000, 320000000,
        ],
        borderColor: "rgb(40, 167, 69)",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgb(40, 167, 69)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: "Mục tiêu (VNĐ)",
        data: [
          200000000, 200000000, 200000000, 200000000, 200000000, 200000000,
          200000000, 200000000, 200000000, 200000000, 200000000, 200000000,
        ],
        borderColor: "rgb(220, 53, 69)",
        backgroundColor: "rgba(220, 53, 69, 0.1)",
        tension: 0,
        fill: false,
        borderDash: [8, 4],
        pointStyle: "dash",
      },
      {
        label: "Doanh thu năm trước (VNĐ)",
        data: [
          165000000, 180000000, 175000000, 190000000, 205000000, 185000000,
          195000000, 210000000, 180000000, 220000000, 215000000, 240000000,
        ],
        borderColor: "rgb(108, 117, 125)",
        backgroundColor: "rgba(108, 117, 125, 0.1)",
        tension: 0.3,
        fill: false,
        borderDash: [2, 2],
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Biểu đồ doanh thu theo tháng (2024)",
          font: {
            size: 16,
            weight: "bold",
          },
        },
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ${formatCurrency(value)} VNĐ`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0,0,0,0.1)",
          },
          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
            font: {
              size: 11,
            },
          },
          title: {
            display: true,
            text: "Doanh thu (VNĐ)",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
        x: {
          grid: {
            color: "rgba(0,0,0,0.1)",
          },
          ticks: {
            font: {
              size: 11,
            },
          },
          title: {
            display: true,
            text: "Tháng",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart",
      },
    },
  };

  revenueChart = new Chart(ctx, config);
}

// Initialize department chart
function initializeDepartmentChart() {
  const ctx = document.getElementById("departmentChart");
  if (!ctx) {
    console.log("Department chart canvas not found");
    return;
  }
  console.log("Initializing department chart...");

  const rawLabels = [
    "Membership (Hội viên)",
    "Fitness (Tập luyện)",
    "Swimming Coach (Bơi lội)",
    "Pilates",
    "Operation (Vận hành)",
    "PT (Personal Training)",
    "Spa & Wellness",
  ];

  const data = {
    labels: ServiceOrder.sortByServiceOrder(rawLabels, (label) => {
      // Extract service name from label for sorting
      if (label.includes("Membership")) return "Membership";
      if (label.includes("Fitness") || label.includes("PT"))
        return "PT Fitness";
      if (label.includes("Pilates")) return "Pilates";
      if (label.includes("Swimming")) return "Swimming Coach";
      return label;
    }),
    datasets: [
      {
        data: [45.2, 28.5, 12.3, 8.7, 3.2, 1.8, 0.3],
        backgroundColor: [
          "rgba(40, 167, 69, 0.8)", // Membership - Green
          "rgba(0, 123, 255, 0.8)", // Fitness - Blue
          "rgba(23, 162, 184, 0.8)", // Swimming Coach - Cyan
          "rgba(255, 193, 7, 0.8)", // Pilates - Yellow
          "rgba(108, 117, 125, 0.8)", // Operation - Gray
          "rgba(220, 53, 69, 0.8)", // PT - Red
          "rgba(111, 66, 193, 0.8)", // Spa - Purple
        ],
        borderColor: [
          "rgba(40, 167, 69, 1)",
          "rgba(0, 123, 255, 1)",
          "rgba(23, 162, 184, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(108, 117, 125, 1)",
          "rgba(220, 53, 69, 1)",
          "rgba(111, 66, 193, 1)",
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Tỉ trọng doanh thu theo bộ phận (%)",
          font: {
            size: 16,
            weight: "bold",
          },
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed;
              return `${label}: ${value}%`;
            },
          },
        },
      },
      cutout: "60%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
      },
    },
  };

  departmentChart = new Chart(ctx, config);
}

// Create bar chart for revenue comparison
function createRevenueComparisonChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return;

  const config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "So sánh doanh thu",
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },
    },
  };

  return new Chart(ctx, config);
}

// Create pie chart for payment methods
function createPaymentMethodChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return;

  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Phân bố hình thức thanh toán",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  };

  return new Chart(ctx, config);
}

// Create line chart for trends
function createTrendChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return;

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Xu hướng theo thời gian",
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  };

  return new Chart(ctx, config);
}

// Update chart data
function updateChartData(chart, newData) {
  if (chart) {
    chart.data = newData;
    chart.update();
  }
}

// Destroy chart
function destroyChart(chart) {
  if (chart) {
    chart.destroy();
  }
}

// Utility function to format currency for charts
function formatCurrency(value) {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + "B";
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
}

// Sample data generators
function generateRevenueData() {
  return {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Doanh thu thực tế",
        data: [150, 180, 165, 200, 220, 195, 210, 230, 185, 250, 240, 280],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        fill: true,
      },
      {
        label: "Mục tiêu",
        data: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };
}

function generateDepartmentData() {
  return {
    labels: ["Membership", "Fitness", "Swimming Coach", "Pilates", "Operation"],
    datasets: [
      {
        data: [65, 25, 5, 3, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };
}

function generatePaymentMethodData() {
  return {
    labels: ["Tiền mặt", "Chuyển khoản", "MPOS/Card"],
    datasets: [
      {
        data: [43.2, 37.8, 18.9],
        backgroundColor: [
          "rgba(40, 167, 69, 0.8)",
          "rgba(23, 162, 184, 0.8)",
          "rgba(255, 193, 7, 0.8)",
        ],
        borderColor: [
          "rgba(40, 167, 69, 1)",
          "rgba(23, 162, 184, 1)",
          "rgba(255, 193, 7, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };
}

// Export functions for use in other files
window.ChartUtils = {
  createRevenueComparisonChart,
  createPaymentMethodChart,
  createTrendChart,
  updateChartData,
  destroyChart,
  formatCurrency,
  generateRevenueData,
  generateDepartmentData,
  generatePaymentMethodData,
};

// Auto-initialize charts when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing charts...");
  setTimeout(() => {
    initializeCharts();
  }, 500);
});
