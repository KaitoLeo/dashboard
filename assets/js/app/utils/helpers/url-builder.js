/**
 * URL Builder Helper
 * Táº¡o URL vÃ  slug cho há»‡ thá»‘ng routing
 */

window.App = window.App || {};
window.App.utils = window.App.utils || {};
window.App.utils.helpers = window.App.utils.helpers || {};


class URLBuilder {
  constructor() {
    this.mapping = URL_MAPPING;
  }

  /**
   * Táº¡o slug tá»« tiÃªu Ä‘á»
   */
  createSlug(title) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim();
  }

  /**
   * Táº¡o URL Ä‘áº§y Ä‘á»§ cho trang chi tiáº¿t
   */
  buildDetailURL(group, category, slug, params = {}) {
    const basePath = `${group}/${category}/${slug}.html`;
    const queryString = this.buildQueryString(params);
    return `/${basePath}${queryString}`;
  }

  /**
   * Táº¡o URL cho trang danh má»¥c
   */
  buildCategoryURL(group, category, params = {}) {
    const basePath = `${group}/${category}`;
    const queryString = this.buildQueryString(params);
    return `/${basePath}${queryString}`;
  }

  /**
   * Táº¡o URL cho trang nhÃ³m
   */
  buildGroupURL(group, params = {}) {
    const basePath = group;
    const queryString = this.buildQueryString(params);
    return `/${basePath}${queryString}`;
  }

  /**
   * Táº¡o query string tá»« object params
   */
  buildQueryString(params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  /**
   * Láº¥y URL mapping cho má»™t trang cá»¥ thá»ƒ
   */
  getPageMapping(pageId) {
    // TÃ¬m trong táº¥t cáº£ cÃ¡c cáº¥p
    for (const groupKey in this.mapping.details) {
      const group = this.mapping.details[groupKey];
      for (const categoryKey in group) {
        const category = group[categoryKey];
        for (const detailKey in category) {
          const detail = category[detailKey];
          if (detail.id === pageId || detail.slug === pageId) {
            return {
              group: groupKey,
              category: categoryKey,
              detail: detailKey,
              ...detail,
            };
          }
        }
      }
    }
    return null;
  }

  /**
   * Táº¡o navigation data cho metric cards
   */
  createNavigationData(cards) {
    return cards.map((card) => {
      const mapping = this.getPageMapping(card.id);
      if (mapping) {
        return {
          ...card,
          url: this.buildDetailURL(
            mapping.group,
            mapping.category,
            mapping.slug
          ),
          breadcrumb: this.getBreadcrumbPath(
            mapping.group,
            mapping.category,
            mapping.slug
          ),
        };
      }
      return card;
    });
  }

  /**
   * Láº¥y breadcrumb path cho má»™t trang
   */
  getBreadcrumbPath(group, category, slug) {
    const breadcrumb = [{ name: "Trang chá»§", path: "index.html" }];

    // Add group
    const groupData = this.mapping.groups[group];
    if (groupData) {
      breadcrumb.push({
        name: groupData.name,
        path: group,
      });
    }

    // Add category
    const categoryData = this.mapping.categories[group]?.[category];
    if (categoryData) {
      breadcrumb.push({
        name: categoryData.name,
        path: `${group}/${category}`,
      });
    }

    // Add detail page
    const detailData = this.mapping.details[group]?.[category]?.[slug];
    if (detailData) {
      breadcrumb.push({
        name: detailData.name,
        path: `${group}/${category}/${slug}.html`,
      });
    }

    return breadcrumb;
  }

  /**
   * Kiá»ƒm tra URL cÃ³ pháº£i legacy khÃ´ng
   */
  isLegacyURL(url) {
    const filename = url.split("/").pop();
    return this.mapping.redirects.hasOwnProperty(filename);
  }

  /**
   * Láº¥y redirect URL cho legacy URL
   */
  getRedirectURL(legacyURL) {
    const filename = legacyURL.split("/").pop();
    return this.mapping.redirects[filename] || null;
  }

  /**
   * Táº¡o canonical URL
   */
  getCanonicalURL(group, category, slug) {
    return `${window.location.origin}/${group}/${category}/${slug}.html`;
  }

  /**
   * Táº¡o meta tags cho SEO
   */
  generateMetaTags(pageData) {
    const { name, description, keywords } = pageData;

    return {
      title: `${name} - Actiwell Dashboard`,
      description: description || `Chi tiáº¿t vá» ${name} trong há»‡ thá»‘ng Actiwell`,
      keywords: keywords || "actiwell, dashboard, bÃ¡o cÃ¡o, thá»‘ng kÃª",
      canonical: this.getCanonicalURL(
        pageData.group,
        pageData.category,
        pageData.slug
      ),
    };
  }
}

// Export for use in other modules
window.URLBuilder = URLBuilder;
window.App.utils.helpers.URLBuilder = URLBuilder;
