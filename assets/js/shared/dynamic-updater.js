(function (w) {
  "use strict";

  // Dynamic Data Updater for existing pages
  const DynamicUpdater = {
    // Update metric cards dynamically
    updateMetricCards: function (data, cardConfigs) {
      cardConfigs.forEach((config) => {
        const element = document.getElementById(config.id);
        if (!element) return;

        let value = 0;

        if (config.type === "count") {
          value = data.length;
        } else if (config.type === "sum") {
          value = data.reduce(
            (sum, item) => sum + (item[config.field] || 0),
            0
          );
        } else if (config.type === "filter") {
          value = data.filter((item) => {
            if (config.filter.field && config.filter.value) {
              return item[config.filter.field] === config.filter.value;
            }
            return true;
          }).length;
        } else if (config.type === "custom") {
          value = config.calculate(data);
        }

        // Format value if needed
        if (config.format === "number") {
          element.textContent = value.toLocaleString();
        } else if (config.format === "currency") {
          element.textContent = value.toLocaleString("vi-VN") + " VNĐ";
        } else if (config.format === "percentage") {
          element.textContent = value.toFixed(1) + "%";
        } else {
          element.textContent = value;
        }
      });
    },

    // Update table data dynamically
    updateTable: function (data, tableId, columns) {
      const tbody = document.getElementById(tableId);
      if (!tbody) return;

      tbody.innerHTML = "";

      data.forEach((item, index) => {
        const row = document.createElement("tr");

        columns.forEach((column) => {
          const cell = document.createElement("td");

          if (column.type === "text") {
            cell.textContent = item[column.field] || "";
          } else if (column.type === "badge") {
            const badge = document.createElement("span");
            badge.className = `badge ${column.badgeClass || "bg-secondary"}`;
            badge.textContent = item[column.field] || "";
            cell.appendChild(badge);
          } else if (column.type === "avatar") {
            const avatar = document.createElement("div");
            avatar.className = "d-flex align-items-center";
            avatar.innerHTML = `
              <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                ${(item[column.field] || "").charAt(0)}
              </div>
              <div>
                <div class="fw-bold">${item[column.field] || ""}</div>
                <small class="text-muted">ID: ${item.id || ""}</small>
              </div>
            `;
            cell.appendChild(avatar);
          } else if (column.type === "custom") {
            cell.innerHTML = column.render(item, index);
          }

          row.appendChild(cell);
        });

        tbody.appendChild(row);
      });
    },

    // Update chart data dynamically
    updateChart: function (chartId, data, chartConfig) {
      const canvas = document.getElementById(chartId);
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Destroy existing chart if it exists
      if (window[chartId + "Chart"]) {
        window[chartId + "Chart"].destroy();
      }

      // Calculate chart data
      const chartData = this.calculateChartData(data, chartConfig);

      // Create new chart
      window[chartId + "Chart"] = new Chart(ctx, {
        type: chartConfig.type,
        data: chartData,
        options: chartConfig.options || {},
      });
    },

    // Calculate chart data from dataset
    calculateChartData: function (data, config) {
      const labels = [];
      const datasets = [];

      if (config.groupBy) {
        // Group data by specified field
        const grouped = {};
        data.forEach((item) => {
          const key = item[config.groupBy];
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(item);
        });

        // Create labels and data
        Object.keys(grouped).forEach((key) => {
          labels.push(key);
        });

        // Create datasets
        if (config.datasets) {
          config.datasets.forEach((datasetConfig) => {
            const dataset = {
              label: datasetConfig.label,
              data: [],
              backgroundColor: datasetConfig.backgroundColor,
              borderColor: datasetConfig.borderColor,
            };

            labels.forEach((label) => {
              const groupData = grouped[label] || [];
              let value = 0;

              if (datasetConfig.calculate === "count") {
                value = groupData.length;
              } else if (datasetConfig.calculate === "sum") {
                value = groupData.reduce(
                  (sum, item) => sum + (item[datasetConfig.field] || 0),
                  0
                );
              } else if (datasetConfig.calculate === "average") {
                const sum = groupData.reduce(
                  (sum, item) => sum + (item[datasetConfig.field] || 0),
                  0
                );
                value = groupData.length > 0 ? sum / groupData.length : 0;
              }

              dataset.data.push(value);
            });

            datasets.push(dataset);
          });
        }
      }

      return {
        labels: labels,
        datasets: datasets,
      };
    },

    // Update pagination
    updatePagination: function (data, currentPage, itemsPerPage, paginationId) {
      const pagination = document.getElementById(paginationId);
      if (!pagination) return;

      const totalPages = Math.ceil(data.length / itemsPerPage);
      pagination.innerHTML = "";

      if (totalPages <= 1) return;

      // Previous button
      const prevLi = document.createElement("li");
      prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
      prevLi.innerHTML = `
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1})" 
           ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ""}>
          <i class="fas fa-chevron-left"></i>
        </a>
      `;
      pagination.appendChild(prevLi);

      // Page numbers
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        const firstLi = document.createElement("li");
        firstLi.className = "page-item";
        firstLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(1)">1</a>`;
        pagination.appendChild(firstLi);

        if (startPage > 2) {
          const ellipsisLi = document.createElement("li");
          ellipsisLi.className = "page-item disabled";
          ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
          pagination.appendChild(ellipsisLi);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsisLi = document.createElement("li");
          ellipsisLi.className = "page-item disabled";
          ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
          pagination.appendChild(ellipsisLi);
        }

        const lastLi = document.createElement("li");
        lastLi.className = "page-item";
        lastLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>`;
        pagination.appendChild(lastLi);
      }

      // Next button
      const nextLi = document.createElement("li");
      nextLi.className = `page-item ${
        currentPage === totalPages ? "disabled" : ""
      }`;
      nextLi.innerHTML = `
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1})" 
           ${
             currentPage === totalPages
               ? 'tabindex="-1" aria-disabled="true"'
               : ""
           }>
          <i class="fas fa-chevron-right"></i>
        </a>
      `;
      pagination.appendChild(nextLi);
    },

    // Initialize page with dynamic data
    initializePage: function (config) {
      const {
        dataType = "checkin",
        dataCount = 100,
        dataOptions = {},
        metricCards = [],
        table = null,
        charts = [],
        pagination = null,
      } = config;

      // Generate data
      let data = [];
      if (dataType === "checkin") {
        data = w.DataGenerator.generateCheckinData(dataCount, dataOptions);
      } else if (dataType === "revenue") {
        data = w.DataGenerator.generateRevenueData(dataCount, dataOptions);
      } else if (dataType === "booking") {
        data = w.DataGenerator.generateBookingData(dataCount, dataOptions);
      } else if (dataType === "trial") {
        data = w.DataGenerator.generateTrialData(dataCount, dataOptions);
      }

      // Update metric cards
      if (metricCards.length > 0) {
        this.updateMetricCards(data, metricCards);
      }

      // Update table
      if (table) {
        this.updateTable(data, table.id, table.columns);
      }

      // Update charts
      charts.forEach((chart) => {
        this.updateChart(chart.id, data, chart.config);
      });

      // Update pagination
      if (pagination) {
        this.updatePagination(
          data,
          pagination.currentPage,
          pagination.itemsPerPage,
          pagination.id
        );
      }

      return data;
    },
  };

  // Export to window
  w.DynamicUpdater = DynamicUpdater;
})(window);








