/**
 * HeaderBreadcrumbs Component
 * Hiá»ƒn thá»‹ breadcrumb navigation trong header vá»›i Ä‘áº§y Ä‘á»§ tÃ­nh nÄƒng
 */

window.App = window.App || {};
window.App.views = window.App.views || {};
window.App.views.components = window.App.views.components || {};


class HeaderBreadcrumbs {
  constructor(containerId = "breadcrumb-container") {
    this.containerId = containerId;
    this.router = new URLRouter();
    this.urlBuilder = new URLBuilder();
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.setupRouteListener();
  }

  /**
   * Build breadcrumb data from current path
   */
  buildBreadcrumbs() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath
      .split("/")
      .filter((part) => part && part !== "index.html");

    const breadcrumbs = [
      {
        name: "Trang chá»§",
        path: "index.html",
        isLink: true,
        level: 0,
      },
    ];

    if (pathParts.length === 0) {
      return breadcrumbs;
    }

    // Build breadcrumb from path
    let currentPath = "";
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath += (currentPath ? "/" : "") + part;
      const isLast = i === pathParts.length - 1;

      if (i === 0) {
        // Group level
        const group = URL_MAPPING.groups[part];
        if (group) {
          breadcrumbs.push({
            name: group.name,
            path: currentPath,
            isLink: !isLast,
            level: i + 1,
          });
        }
      } else if (i === 1) {
        // Category level
        const group = pathParts[0];
        const category = URL_MAPPING.categories[group]?.[part];
        if (category) {
          breadcrumbs.push({
            name: category.name,
            path: currentPath,
            isLink: !isLast,
            level: i + 1,
          });
        }
      } else if (i === 2) {
        // Detail level
        const group = pathParts[0];
        const category = pathParts[1];
        const slug = part.replace(".html", "");

        // Find detail page
        const detail = this.findDetailPage(group, category, slug);
        if (detail) {
          breadcrumbs.push({
            name: detail.name,
            path: currentPath,
            isLink: false,
            level: i + 1,
          });
        } else {
          // Fallback from slug
          const fallbackName = this.slugToTitle(slug);
          breadcrumbs.push({
            name: fallbackName,
            path: currentPath,
            isLink: false,
            level: i + 1,
          });
        }
      } else {
        // Additional levels - fallback from slug
        const fallbackName = this.slugToTitle(part.replace(".html", ""));
        breadcrumbs.push({
          name: fallbackName,
          path: currentPath,
          isLink: !isLast,
          level: i + 1,
        });
      }
    }

    return this.smartTruncate(breadcrumbs);
  }

  /**
   * Find detail page by group, category, and slug
   */
  findDetailPage(group, category, slug) {
    const details = URL_MAPPING.details[group];
    if (!details) return null;

    // Search through all categories in the group
    for (const catKey in details) {
      const catDetails = details[catKey];
      for (const detailKey in catDetails) {
        const detail = catDetails[detailKey];
        if (detail.slug === slug) {
          return detail;
        }
      }
    }

    return null;
  }

  /**
   * Convert slug to readable title
   */
  slugToTitle(slug) {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Smart truncate for long breadcrumbs
   */
  smartTruncate(breadcrumbs) {
    if (breadcrumbs.length <= 6) {
      return breadcrumbs;
    }

    // Keep: Home + ... + last 3 levels
    const truncated = [
      breadcrumbs[0], // Home
      { name: "...", path: "", isLink: false, level: -1 }, // Ellipsis
      ...breadcrumbs.slice(-3), // Last 3 levels
    ];

    return truncated;
  }

  /**
   * Render breadcrumb HTML
   */
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn("Breadcrumb container not found:", this.containerId);
      return;
    }

    const breadcrumbs = this.buildBreadcrumbs();

    // Don't show breadcrumb if only home page
    if (breadcrumbs.length <= 1) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = this.generateBreadcrumbHTML(breadcrumbs);
    this.generateJSONLD(breadcrumbs);
  }

  /**
   * Generate breadcrumb HTML
   */
  generateBreadcrumbHTML(breadcrumbs) {
    const items = breadcrumbs
      .map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isEllipsis = item.level === -1;
        const separator =
          index < breadcrumbs.length - 1
            ? '<span class="breadcrumb-separator">â†’</span>'
            : "";

        if (isEllipsis) {
          return `
            <span class="breadcrumb-item breadcrumb-ellipsis">
              ${item.name}
            </span>
            ${separator}
          `;
        } else if (isLast) {
          // Last item - not clickable, gray color
          return `
            <span class="breadcrumb-item breadcrumb-current" aria-current="page">
              ${item.name}
            </span>
          `;
        } else {
          // Clickable item
          return `
            <a href="/${item.path}" 
               class="breadcrumb-item breadcrumb-link" 
               data-navigate="${item.path}"
               tabindex="0">
              ${item.name}
            </a>
            ${separator}
          `;
        }
      })
      .join("");

    return `
      <nav class="breadcrumb-nav" aria-label="Breadcrumb">
        ${items}
      </nav>
    `;
  }

  /**
   * Generate JSON-LD schema for SEO
   */
  generateJSONLD(breadcrumbs) {
    if (breadcrumbs.length <= 1) return;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs
        .filter((item) => item.level >= 0) // Exclude ellipsis
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.isLink
            ? `${window.location.origin}/${item.path}`
            : window.location.href,
        })),
    };

    // Remove existing JSON-LD
    const existingScript = document.querySelector(
      'script[type="application/ld+json"][data-breadcrumb]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-breadcrumb", "true");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Handle breadcrumb link clicks
    document.addEventListener("click", (e) => {
      const link = e.target.closest(".breadcrumb-link");
      if (link) {
        e.preventDefault();
        const path = link.getAttribute("data-navigate");

        // Preserve query parameters
        const currentQuery = window.location.search;
        this.router.navigateTo(path, true);
      }
    });

    // Handle keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const link = e.target.closest(".breadcrumb-link");
        if (link) {
          e.preventDefault();
          link.click();
        }
      }
    });
  }

  /**
   * Setup route change listener
   */
  setupRouteListener() {
    // Listen for route changes
    window.addEventListener("popstate", () => {
      this.render();
    });

    // Listen for programmatic navigation
    window.addEventListener("routechange", () => {
      this.render();
    });
  }

  /**
   * Update breadcrumb (call this when navigating programmatically)
   */
  update() {
    this.render();
  }

  /**
   * Get current breadcrumb data
   */
  getCurrentBreadcrumb() {
    return this.buildBreadcrumbs();
  }
}

// CSS styles for breadcrumb
const breadcrumbStyles = `
<style>
.breadcrumb-nav {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 14px;
  margin: 0;
  padding: 0;
  max-width: 100%;
  overflow: hidden;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #6c757d;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.breadcrumb-link {
  color: #007bff;
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 2px;
}

.breadcrumb-link:hover {
  color: #0056b3;
  text-decoration: underline;
  background-color: rgba(0, 123, 255, 0.1);
}

.breadcrumb-link:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.breadcrumb-current {
  color: #6c757d;
  font-weight: 500;
  flex-shrink: 0;
}

.breadcrumb-ellipsis {
  color: #6c757d;
  font-weight: 500;
  flex-shrink: 0;
  padding: 0 4px;
}

.breadcrumb-separator {
  margin: 0 6px;
  color: #6c757d;
  font-weight: 500;
  flex-shrink: 0;
}

/* Smart truncate for long breadcrumbs */
.breadcrumb-nav.truncated .breadcrumb-item:not(.breadcrumb-current):not(.breadcrumb-ellipsis):not(:last-child) {
  display: none;
}

.breadcrumb-nav.truncated .breadcrumb-item:last-child,
.breadcrumb-nav.truncated .breadcrumb-item:nth-last-child(2),
.breadcrumb-nav.truncated .breadcrumb-item:nth-last-child(3),
.breadcrumb-nav.truncated .breadcrumb-ellipsis {
  display: inline-flex;
}

/* Responsive design */
@media (max-width: 1200px) {
  .breadcrumb-nav {
    font-size: 13px;
  }
  
  .breadcrumb-separator {
    margin: 0 4px;
  }
  
  .breadcrumb-item {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 768px) {
  .breadcrumb-nav {
    font-size: 12px;
    flex-wrap: wrap;
  }
  
  .breadcrumb-separator {
    margin: 0 3px;
  }
  
  .breadcrumb-item {
    max-width: 80px;
  }
  
  .breadcrumb-link {
    padding: 1px 3px;
    margin: 0 1px;
  }
}

@media (max-width: 576px) {
  .breadcrumb-nav {
    font-size: 11px;
  }
  
  .breadcrumb-item {
    max-width: 60px;
  }
  
  .breadcrumb-separator {
    margin: 0 2px;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .breadcrumb-item {
    color: #adb5bd;
  }
  
  .breadcrumb-link {
    color: #4dabf7;
  }
  
  .breadcrumb-link:hover {
    color: #74c0fc;
    background-color: rgba(77, 171, 247, 0.1);
  }
  
  .breadcrumb-link:focus-visible {
    outline-color: #4dabf7;
  }
  
  .breadcrumb-current {
    color: #adb5bd;
  }
  
  .breadcrumb-ellipsis {
    color: #adb5bd;
  }
  
  .breadcrumb-separator {
    color: #adb5bd;
  }
}

/* Animation for smooth transitions */
.breadcrumb-nav {
  transition: all 0.3s ease;
}

.breadcrumb-item {
  transition: all 0.2s ease;
}

/* Ensure breadcrumb doesn't break header layout */
.breadcrumb-nav {
  min-width: 0;
  flex: 1;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .breadcrumb-link {
    border: 1px solid transparent;
  }
  
  .breadcrumb-link:hover,
  .breadcrumb-link:focus {
    border-color: currentColor;
  }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML("beforeend", breadcrumbStyles);

// Export for use in other modules
window.HeaderBreadcrumbs = HeaderBreadcrumbs;
window.App.views.components.HeaderBreadcrumbs = HeaderBreadcrumbs;
