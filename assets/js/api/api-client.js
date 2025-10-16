/**
 * API Client Module
 * Centralized API integration layer for backend communication
 * Supports both mock data (development) and real backend (production)
 */

(function (window) {
  "use strict";

  class APIClient {
    constructor(config = {}) {
      this.baseURL = config.baseURL || "http://localhost:8000/api";
      this.timeout = config.timeout || 10000; // 10 seconds
      this.useMockData = config.useMockData !== false; // Default to true for dev
      this.headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.headers,
      };
      this.cache = new Map();
      this.cacheTimeout = config.cacheTimeout || 60000; // 1 minute
    }

    /**
     * Generic HTTP request
     * @param {string} method - HTTP method
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise} Response data
     */
    async request(method, endpoint, data = null, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const cacheKey = `${method}:${endpoint}:${JSON.stringify(data)}`;

      // Check cache first for GET requests
      if (method === "GET" && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log(`📦 Cache hit for ${endpoint}`);
          return cached.data;
        }
      }

      const config = {
        method,
        headers: { ...this.headers, ...options.headers },
        ...options,
      };

      if (data && method !== "GET") {
        config.body = JSON.stringify(data);
      }

      try {
        console.log(`🌐 ${method} ${endpoint}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Cache successful GET requests
        if (method === "GET") {
          this.cache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now(),
          });
        }

        console.log(`✅ ${method} ${endpoint} - Success`);
        return responseData;
      } catch (error) {
        console.error(`❌ ${method} ${endpoint} - Error:`, error.message);

        // Fallback to mock data if enabled
        if (this.useMockData) {
          console.warn(`⚠️ Falling back to mock data for ${endpoint}`);
          return this.getMockData(endpoint, method);
        }

        throw error;
      }
    }

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
      return this.request("GET", endpoint, null, options);
    }

    /**
     * POST request
     */
    async post(endpoint, data, options = {}) {
      return this.request("POST", endpoint, data, options);
    }

    /**
     * PUT request
     */
    async put(endpoint, data, options = {}) {
      return this.request("PUT", endpoint, data, options);
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
      return this.request("DELETE", endpoint, null, options);
    }

    /**
     * Get mock data fallback
     */
    getMockData(endpoint, method) {
      // Revenue endpoints
      if (endpoint.includes("/revenue")) {
        if (endpoint.includes("/mtd")) {
          return { data: window.currentMonthRevenue || [] };
        } else if (endpoint.includes("/today")) {
          return { data: window.todayRevenue || [] };
        } else if (endpoint.includes("/yesterday")) {
          return { data: window.yesterdayRevenue || [] };
        }
        return { data: window.currentMonthRevenue || [] };
      }

      // Booking endpoints
      if (endpoint.includes("/booking")) {
        if (endpoint.includes("/today")) {
          return { data: window.todayBookings || [] };
        } else if (endpoint.includes("/yesterday")) {
          return { data: window.yesterdayBookings || [] };
        } else if (endpoint.includes("/week")) {
          return { data: window.thisWeekBookings || [] };
        } else if (endpoint.includes("/mtd")) {
          return { data: window.mtdBookings || [] };
        }
        return { data: window.mtdBookings || [] };
      }

      // Checkin endpoints
      if (endpoint.includes("/checkin")) {
        if (endpoint.includes("/today")) {
          return { data: window.todayCheckins || [] };
        } else if (endpoint.includes("/yesterday")) {
          return { data: window.yesterdayCheckins || [] };
        } else if (endpoint.includes("/mtd")) {
          return { data: window.mtdCheckins || [] };
        }
        return { data: window.mtdCheckins || [] };
      }

      // Visitor endpoints
      if (endpoint.includes("/visitor")) {
        if (endpoint.includes("/today")) {
          return { data: window.todayVisitors || [] };
        } else if (endpoint.includes("/yesterday")) {
          return { data: window.yesterdayVisitors || [] };
        } else if (endpoint.includes("/mtd")) {
          return { data: window.mtdVisitors || [] };
        }
        return { data: window.mtdVisitors || [] };
      }

      // Default empty response
      return { data: [] };
    }

    /**
     * Clear cache
     */
    clearCache() {
      this.cache.clear();
      console.log("🗑️ API cache cleared");
    }

    /**
     * Set auth token
     */
    setAuthToken(token) {
      this.headers["Authorization"] = `Bearer ${token}`;
    }

    /**
     * Remove auth token
     */
    removeAuthToken() {
      delete this.headers["Authorization"];
    }

    /**
     * Enable/Disable mock data
     */
    setUseMockData(useMock) {
      this.useMockData = useMock;
      console.log(`🔧 Mock data ${useMock ? "enabled" : "disabled"}`);
    }
  }

  // Export to global scope
  window.APIClient = APIClient;

  // Create default instance
  window.apiClient = new APIClient({
    baseURL: window.API_BASE_URL || "http://localhost:8000/api",
    useMockData: true, // Enable mock data by default
  });

  console.log("✅ API Client initialized");
  console.log(`   🌐 Base URL: ${window.apiClient.baseURL}`);
  console.log(
    `   📦 Mock Data: ${window.apiClient.useMockData ? "Enabled" : "Disabled"}`
  );
})(window);
