// Actiwell CMS Mockup JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize components
  initPreloader();
  initSidebar();
  initDropdowns();
  initTooltips();

  // Hide preloader after page load
  setTimeout(() => {
    hidePreloader();
  }, 1000);
});

// Preloader functions
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "block";
  }
}

function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
}

// Sidebar functions
function initSidebar() {
  const menuBtn = document.getElementById("vertical-menu-btn");
  const body = document.body;

  if (menuBtn) {
    menuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleSidebar();
    });
  }

  // Handle sidebar menu clicks
  const menuItems = document.querySelectorAll("#sidebar-menu .has-arrow");
  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      toggleSubmenu(this);
    });
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    handleResponsiveSidebar();
  });
}

function toggleSidebar() {
  const body = document.body;
  const isCollapsed = body.classList.contains("vertical-collpsed");

  if (window.innerWidth <= 991) {
    // Mobile: toggle sidebar overlay
    body.classList.toggle("sidebar-enable");
  } else {
    // Desktop: toggle collapsed state
    body.classList.toggle("vertical-collpsed");
  }

  // Dispatch custom event
  window.dispatchEvent(new Event("sidebar-toggled"));
}

function toggleSubmenu(element) {
  const submenu = element.nextElementSibling;
  const parent = element.parentElement;

  if (submenu && submenu.classList.contains("sub-menu")) {
    // Close other submenus
    const allSubmenus = document.querySelectorAll(".sub-menu");
    allSubmenus.forEach((menu) => {
      if (menu !== submenu) {
        menu.style.display = "none";
        menu.parentElement.classList.remove("mm-active");
      }
    });

    // Toggle current submenu
    if (submenu.style.display === "block") {
      submenu.style.display = "none";
      parent.classList.remove("mm-active");
    } else {
      submenu.style.display = "block";
      parent.classList.add("mm-active");
    }
  }
}

function handleResponsiveSidebar() {
  const body = document.body;

  if (window.innerWidth <= 991) {
    // Mobile: ensure sidebar is hidden by default
    body.classList.remove("vertical-collpsed");
    body.classList.remove("sidebar-enable");
  }
}

// Dropdown functions
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll(
    '[data-bs-toggle="dropdown"]'
  );

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = this.nextElementSibling;
      if (dropdown && dropdown.classList.contains("dropdown-menu")) {
        toggleDropdown(dropdown);
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    const openDropdowns = document.querySelectorAll(".dropdown-menu.show");
    openDropdowns.forEach((dropdown) => {
      if (!dropdown.parentElement.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  });
}

function toggleDropdown(dropdown) {
  const isOpen = dropdown.classList.contains("show");

  // Close all other dropdowns
  const allDropdowns = document.querySelectorAll(".dropdown-menu.show");
  allDropdowns.forEach((menu) => {
    if (menu !== dropdown) {
      menu.classList.remove("show");
    }
  });

  // Toggle current dropdown
  if (isOpen) {
    dropdown.classList.remove("show");
  } else {
    dropdown.classList.add("show");
  }
}

// Tooltip functions
function initTooltips() {
  const tooltipElements = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      showTooltip(this);
    });

    element.addEventListener("mouseleave", function () {
      hideTooltip(this);
    });
  });
}

function showTooltip(element) {
  const tooltipText =
    element.getAttribute("data-bs-original-title") ||
    element.getAttribute("title");
  if (!tooltipText) return;

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip bs-tooltip-top show";
  tooltip.innerHTML = `
        <div class="tooltip-arrow"></div>
        <div class="tooltip-inner">${tooltipText}</div>
    `;

  document.body.appendChild(tooltip);

  // Position tooltip
  const rect = element.getBoundingClientRect();
  tooltip.style.position = "absolute";
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";
  tooltip.style.left =
    rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
  tooltip.style.zIndex = "9999";

  element._tooltip = tooltip;
}

function hideTooltip(element) {
  if (element._tooltip) {
    element._tooltip.remove();
    delete element._tooltip;
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Chart placeholder functions
function initCharts() {
  // This would be replaced with actual chart library integration
  const chartContainers = document.querySelectorAll('[id$="-chart"]');

  chartContainers.forEach((container) => {
    // Add loading animation
    container.innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mt-2">Đang tải biểu đồ...</p>
                </div>
            </div>
        `;

    // Simulate chart loading
    setTimeout(() => {
      container.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100">
                    <div class="text-center">
                        <i class="bx bx-bar-chart-alt-2 font-size-48 text-muted"></i>
                        <p class="text-muted mt-2">Biểu đồ sẽ được hiển thị ở đây</p>
                    </div>
                </div>
            `;
    }, 2000);
  });
}

// Table functions
function initTables() {
  const tables = document.querySelectorAll(".table");

  tables.forEach((table) => {
    // Add hover effects
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "var(--bs-gray-50)";
      });

      row.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "";
      });
    });
  });
}

// Form functions
function initForms() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Handle form submission
      console.log("Form submitted");
    });
  });
}

// Notification functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Initialize all components
function initAll() {
  initCharts();
  initTables();
  initForms();
}

// Call initAll when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}

// Export functions for global access
window.ActiwellMockup = {
  toggleSidebar,
  showNotification,
  initCharts,
  initTables,
  initForms,
};

