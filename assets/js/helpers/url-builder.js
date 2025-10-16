/**
 * URL Builder Helper
 * Tạo URL và slug cho hệ thống routing
 */

class URLBuilder {
  constructor() {
    this.mapping = URL_MAPPING;
  }

  /**
   * Tạo slug từ tiêu đề
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
   * Tạo URL đầy đủ cho trang chi tiết
   */
  buildDetailURL(group, category, slug, params = {}) {
    const basePath = `${group}/${category}/${slug}.html`;
    const queryString = this.buildQueryString(params);
    return `/${basePath}${queryString}`;
  }

  /**
   * Tạo URL cho trang danh mục
   */
  buildCategoryURL(group, category, params = {}) {
    const basePath = `${group}/${category}`;
    const queryString = this.buildQueryString(params);
    return `/${basePath}${queryString}`;
  }

  /**
   * Tạo URL cho trang nhóm
   */
  buildGroupURL(group, params = {}) {
    const basePath = group;
    const queryString = this.buildQueryString(params);
    return `/${basePath}${queryString}`;
  }

  /**
   * Tạo query string từ object params
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
   * Lấy URL mapping cho một trang cụ thể
   */
  getPageMapping(pageId) {
    // Tìm trong tất cả các cấp
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
   * Tạo navigation data cho metric cards
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
   * Lấy breadcrumb path cho một trang
   */
  getBreadcrumbPath(group, category, slug) {
    const breadcrumb = [{ name: "Trang chủ", path: "index.html" }];

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
   * Kiểm tra URL có phải legacy không
   */
  isLegacyURL(url) {
    const filename = url.split("/").pop();
    return this.mapping.redirects.hasOwnProperty(filename);
  }

  /**
   * Lấy redirect URL cho legacy URL
   */
  getRedirectURL(legacyURL) {
    const filename = legacyURL.split("/").pop();
    return this.mapping.redirects[filename] || null;
  }

  /**
   * Tạo canonical URL
   */
  getCanonicalURL(group, category, slug) {
    return `${window.location.origin}/${group}/${category}/${slug}.html`;
  }

  /**
   * Tạo meta tags cho SEO
   */
  generateMetaTags(pageData) {
    const { name, description, keywords } = pageData;

    return {
      title: `${name} - Actiwell Dashboard`,
      description: description || `Chi tiết về ${name} trong hệ thống Actiwell`,
      keywords: keywords || "actiwell, dashboard, báo cáo, thống kê",
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
