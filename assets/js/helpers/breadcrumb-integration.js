/**
 * Breadcrumb Integration Helper
 * Tích hợp breadcrumb vào tất cả các trang
 */

class BreadcrumbIntegration {
  constructor() {
    this.breadcrumb = null;
    this.init();
  }

  init() {
    this.setupBreadcrumbContainer();
    this.initializeBreadcrumb();
  }

  /**
   * Setup breadcrumb container in header
   */
  setupBreadcrumbContainer() {
    // Check if breadcrumb container already exists
    let breadcrumbContainer = document.getElementById("breadcrumb-container");
    if (breadcrumbContainer) {
      // Container already exists, no need to create
      return;
    }

    // Find existing header or nav
    const header =
      document.querySelector("header") || document.querySelector("nav");
    if (!header) {
      console.warn("Header or nav not found, cannot setup breadcrumb");
      return;
    }

    // Find title element in header or main content
    let titleElement = header.querySelector("h1, h2, h3, h4, h5, h6");
    if (!titleElement) {
      // Look in main content area
      const mainContent = document.querySelector(
        ".container-fluid, main, .main-content"
      );
      if (mainContent) {
        titleElement = mainContent.querySelector("h1, h2, h3, h4, h5, h6");
      }
    }

    if (!titleElement) {
      console.warn("Title element not found, cannot setup breadcrumb");
      return;
    }

    // Create breadcrumb container
    breadcrumbContainer = document.createElement("div");
    breadcrumbContainer.id = "breadcrumb-container";
    breadcrumbContainer.className = "mt-2";

    // Insert after title element
    titleElement.parentNode.insertBefore(
      breadcrumbContainer,
      titleElement.nextSibling
    );
  }

  /**
   * Initialize breadcrumb component
   */
  initializeBreadcrumb() {
    const container = document.getElementById("breadcrumb-container");
    if (!container) {
      console.warn("Breadcrumb container not found");
      return;
    }

    this.breadcrumb = new HeaderBreadcrumbs("breadcrumb-container");
  }

  /**
   * Update breadcrumb (call this when navigating)
   */
  update() {
    if (this.breadcrumb) {
      this.breadcrumb.update();
    }
  }

  /**
   * Get current breadcrumb data
   */
  getCurrentBreadcrumb() {
    return this.breadcrumb ? this.breadcrumb.getCurrentBreadcrumb() : [];
  }
}

// Auto-initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.breadcrumbIntegration = new BreadcrumbIntegration();
});

// Export for manual use
window.BreadcrumbIntegration = BreadcrumbIntegration;
