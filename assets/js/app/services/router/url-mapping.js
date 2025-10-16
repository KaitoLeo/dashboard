/**
 * URL Mapping System for Actiwell Dashboard
 * Chuáº©n hÃ³a URL phÃ¢n cáº¥p cha/con cho toÃ n bá»™ danh má»¥c & chi tiáº¿t
 */

window.App = window.App || {};
window.App.services = window.App.services || {};
window.App.services.router = window.App.services.router || {};


// URL Structure: /{group}/{category}/{slug}.html
const URL_MAPPING = {
  // Cáº¥p 1: Groups
  groups: {
    checkin: {
      name: "Check-in",
      path: "checkin",
      icon: "fas fa-clock",
    },
    members: {
      name: "Há»™i viÃªn",
      path: "members",
      icon: "fas fa-users",
    },
    reports: {
      name: "BÃ¡o cÃ¡o",
      path: "reports",
      icon: "fas fa-chart-line",
    },
    test: {
      name: "Test",
      path: "test",
      icon: "fas fa-flask",
    },
  },

  // Cáº¥p 2: Categories
  categories: {
    checkin: {
      overview: {
        name: "Tá»•ng quan",
        path: "overview",
        parent: "checkin",
      },
      frequency: {
        name: "Táº§n suáº¥t",
        path: "frequency",
        parent: "checkin",
      },
      "late-checkin": {
        name: "Check-in sai giá»",
        path: "late-checkin",
        parent: "checkin",
      },
      mtd: {
        name: "ThÃ¡ng nÃ y",
        path: "mtd",
        parent: "checkin",
      },
    },
    members: {
      list: {
        name: "Danh sÃ¡ch",
        path: "list",
        parent: "members",
      },
      analytics: {
        name: "PhÃ¢n tÃ­ch",
        path: "analytics",
        parent: "members",
      },
    },
    test: {
      breadcrumb: {
        name: "Breadcrumb",
        path: "breadcrumb",
        parent: "test",
      },
    },
  },

  // Cáº¥p 3: Detail Pages (Slugs)
  details: {
    checkin: {
      frequency: {
        today: {
          name: "Check-in HÃ´m nay",
          slug: "checkin-hom-nay",
          path: "checkin/frequency/checkin-hom-nay.html",
          parent: "checkin/frequency",
        },
        yesterday: {
          name: "Check-in HÃ´m qua",
          slug: "checkin-hom-qua",
          path: "checkin/frequency/checkin-hom-qua.html",
          parent: "checkin/frequency",
        },
        mtd: {
          name: "Check-in ThÃ¡ng nÃ y",
          slug: "checkin-thang-nay",
          path: "checkin/mtd/checkin-thang-nay.html",
          parent: "checkin/mtd",
        },
      },
      "late-checkin": {
        today: {
          name: "Check-in sai giá» HÃ´m nay",
          slug: "checkin-sai-gio-hom-nay",
          path: "checkin/late-checkin/checkin-sai-gio-hom-nay.html",
          parent: "checkin/late-checkin",
        },
        yesterday: {
          name: "Check-in sai giá» HÃ´m qua",
          slug: "checkin-sai-gio-hom-qua",
          path: "checkin/late-checkin/checkin-sai-gio-hom-qua.html",
          parent: "checkin/late-checkin",
        },
        mtd: {
          name: "Check-in sai giá» ThÃ¡ng nÃ y",
          slug: "checkin-sai-gio-thang-nay",
          path: "checkin/late-checkin/checkin-sai-gio-thang-nay.html",
          parent: "checkin/late-checkin",
        },
      },
      departments: {
        "pt-fitness": {
          today: {
            name: "PT Fitness HÃ´m nay",
            slug: "pt-fitness-hom-nay",
            path: "checkin/departments/pt-fitness-hom-nay.html",
            parent: "checkin/departments",
          },
          yesterday: {
            name: "PT Fitness HÃ´m qua",
            slug: "pt-fitness-hom-qua",
            path: "checkin/departments/pt-fitness-hom-qua.html",
            parent: "checkin/departments",
          },
          mtd: {
            name: "PT Fitness ThÃ¡ng nÃ y",
            slug: "pt-fitness-thang-nay",
            path: "checkin/departments/pt-fitness-thang-nay.html",
            parent: "checkin/departments",
          },
        },
        pilates: {
          today: {
            name: "Pilates HÃ´m nay",
            slug: "pilates-hom-nay",
            path: "checkin/departments/pilates-hom-nay.html",
            parent: "checkin/departments",
          },
          yesterday: {
            name: "Pilates HÃ´m qua",
            slug: "pilates-hom-qua",
            path: "checkin/departments/pilates-hom-qua.html",
            parent: "checkin/departments",
          },
          mtd: {
            name: "Pilates ThÃ¡ng nÃ y",
            slug: "pilates-thang-nay",
            path: "checkin/departments/pilates-thang-nay.html",
            parent: "checkin/departments",
          },
        },
        "swimming-coach": {
          today: {
            name: "Swimming Coach HÃ´m nay",
            slug: "swimming-coach-hom-nay",
            path: "checkin/departments/swimming-coach-hom-nay.html",
            parent: "checkin/departments",
          },
          yesterday: {
            name: "Swimming Coach HÃ´m qua",
            slug: "swimming-coach-hom-qua",
            path: "checkin/departments/swimming-coach-hom-qua.html",
            parent: "checkin/departments",
          },
          mtd: {
            name: "Swimming Coach ThÃ¡ng nÃ y",
            slug: "swimming-coach-thang-nay",
            path: "checkin/departments/swimming-coach-thang-nay.html",
            parent: "checkin/departments",
          },
        },
        membership: {
          today: {
            name: "Membership HÃ´m nay",
            slug: "membership-hom-nay",
            path: "checkin/departments/membership-hom-nay.html",
            parent: "checkin/departments",
          },
          yesterday: {
            name: "Membership HÃ´m qua",
            slug: "membership-hom-qua",
            path: "checkin/departments/membership-hom-qua.html",
            parent: "checkin/departments",
          },
          mtd: {
            name: "Membership ThÃ¡ng nÃ y",
            slug: "membership-thang-nay",
            path: "checkin/departments/membership-thang-nay.html",
            parent: "checkin/departments",
          },
        },
      },
    },
    members: {
      list: {
        all: {
          name: "Danh sÃ¡ch Há»™i viÃªn",
          slug: "danh-sach-hoi-vien",
          path: "members/list/danh-sach-hoi-vien.html",
          parent: "members/list",
        },
      },
    },
    test: {
      breadcrumb: {
        name: "Test Breadcrumb",
        slug: "test-breadcrumb",
        path: "test/breadcrumb.html",
        parent: "test",
      },
    },
  },

  // Legacy URL redirects (old â†’ new)
  redirects: {
    "checkin-frequency-detail.html": "checkin/frequency/checkin-hom-nay.html",
    "checkin-yesterday-detail.html": "checkin/frequency/checkin-hom-qua.html",
    "checkin-mtd-detail.html": "checkin/mtd/checkin-thang-nay.html",
    "late-checkin-today-detail.html":
      "checkin/late-checkin/checkin-sai-gio-hom-nay.html",
    "late-checkin-detail.html":
      "checkin/late-checkin/checkin-sai-gio-hom-qua.html",
    "late-checkin-mtd-detail.html":
      "checkin/late-checkin/checkin-sai-gio-thang-nay.html",
    "pt-fitness-checkin-today-detail.html":
      "checkin/departments/pt-fitness-hom-nay.html",
    "pt-fitness-checkin-detail.html":
      "checkin/departments/pt-fitness-hom-qua.html",
    "pt-fitness-checkin-mtd-detail.html":
      "checkin/departments/pt-fitness-thang-nay.html",
    "pilates-checkin-today-detail.html":
      "checkin/departments/pilates-hom-nay.html",
    "pilates-checkin-detail.html": "checkin/departments/pilates-hom-qua.html",
    "pilates-checkin-mtd-detail.html":
      "checkin/departments/pilates-thang-nay.html",
    "swimming-coach-checkin-today-detail.html":
      "checkin/departments/swimming-coach-hom-nay.html",
    "swimming-coach-checkin-detail.html":
      "checkin/departments/swimming-coach-hom-qua.html",
    "swimming-coach-checkin-mtd-detail.html":
      "checkin/departments/swimming-coach-thang-nay.html",
    "membership-checkin-today-detail.html":
      "checkin/departments/membership-hom-nay.html",
    "membership-checkin-detail.html":
      "checkin/departments/membership-hom-qua.html",
    "membership-checkin-mtd-detail.html":
      "checkin/departments/membership-thang-nay.html",
    "members-list-detail.html": "members/list/danh-sach-hoi-vien.html",
    "test-breadcrumb.html": "test/breadcrumb.html",
  },
};

/**
 * URL Router Class
 */
class URLRouter {
  constructor() {
    this.currentPath = window.location.pathname;
    this.queryParams = new URLSearchParams(window.location.search);
    this.init();
  }

  init() {
    this.handleRedirects();
    this.setupNavigation();
  }

  /**
   * Handle legacy URL redirects
   */
  handleRedirects() {
    const currentFile = this.currentPath.split("/").pop();

    if (URL_MAPPING.redirects[currentFile]) {
      const newPath = URL_MAPPING.redirects[currentFile];
      const newUrl = `${window.location.origin}/${newPath}${window.location.search}`;

      // 301 redirect
      window.history.replaceState(null, "", newUrl);
      window.location.href = newUrl;
      return;
    }
  }

  /**
   * Setup navigation event listeners
   */
  setupNavigation() {
    // Handle metric card clicks
    document.addEventListener("click", (e) => {
      const card = e.target.closest("[data-navigate]");
      if (card) {
        e.preventDefault();
        const targetPath = card.getAttribute("data-navigate");
        this.navigateTo(targetPath);
      }
    });

    // Handle back button
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-go-back]")) {
        e.preventDefault();
        this.goBack();
      }
    });
  }

  /**
   * Navigate to a specific path
   */
  navigateTo(path, preserveQuery = true) {
    const queryString = preserveQuery ? window.location.search : "";
    const newUrl = `${window.location.origin}/${path}${queryString}`;

    // Update URL without reload
    window.history.pushState(null, "", newUrl);

    // Dispatch route change event
    window.dispatchEvent(
      new CustomEvent("routechange", {
        detail: { path, newUrl },
      })
    );

    // Load the page
    this.loadPage(path);
  }

  /**
   * Go back to previous page
   */
  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateTo("index.html");
    }
  }

  /**
   * Load page content
   */
  async loadPage(path) {
    try {
      const response = await fetch(`/${path}`);
      if (response.ok) {
        const html = await response.text();
        document.documentElement.innerHTML = html;

        // Re-initialize the router for the new page
        new URLRouter();
      } else {
        console.error("Page not found:", path);
        this.navigateTo("index.html");
      }
    } catch (error) {
      console.error("Error loading page:", error);
      this.navigateTo("index.html");
    }
  }

  /**
   * Get breadcrumb data for current path
   */
  getBreadcrumb() {
    const pathParts = this.currentPath
      .split("/")
      .filter((part) => part && part !== "index.html");
    const breadcrumb = [
      { name: "Trang chá»§", path: "index.html", isLink: true },
    ];

    if (pathParts.length === 0) {
      return breadcrumb;
    }

    // Build breadcrumb from path
    let currentPath = "";
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath += (currentPath ? "/" : "") + part;

      if (i === 0) {
        // Group level
        const group = URL_MAPPING.groups[part];
        if (group) {
          breadcrumb.push({
            name: group.name,
            path: currentPath,
            isLink: i < pathParts.length - 1,
          });
        }
      } else if (i === 1) {
        // Category level
        const group = pathParts[0];
        const category = URL_MAPPING.categories[group]?.[part];
        if (category) {
          breadcrumb.push({
            name: category.name,
            path: currentPath,
            isLink: i < pathParts.length - 1,
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
          breadcrumb.push({
            name: detail.name,
            path: currentPath,
            isLink: false,
          });
        }
      }
    }

    return breadcrumb;
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
   * Get navigation data for a specific page
   */
  getNavigationData(pageId) {
    // This would be used to get navigation data for metric cards
    // Implementation depends on your specific page structure
    return URL_MAPPING.details[pageId] || null;
  }
}

// Export for use in other modules
window.URLRouter = URLRouter;
window.URL_MAPPING = URL_MAPPING;

// Initialize router when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new URLRouter();
});
window.App.services.router.URLRouter = URLRouter;
window.App.services.router.mapping = URL_MAPPING;
