/**
 * Actiwell Dashboard Configuration
 * Configure API endpoints, features, and environment settings
 */

(function (window) {
  "use strict";

  // Environment detection
  const hostname = window.location.hostname;
  const isProduction = hostname !== "localhost" && hostname !== "127.0.0.1";
  const isDevelopment = !isProduction;

  // API Configuration
  window.API_BASE_URL = isDevelopment
    ? "http://localhost:8000/api" // Development
    : "https://api.actiwell.com/api"; // Production

  window.WS_URL = isDevelopment
    ? "ws://localhost:8000/ws" // Development
    : "wss://api.actiwell.com/ws"; // Production

  // Feature Flags
  window.FEATURES = {
    // Use mock data when backend is not available
    useMockData: true, // Set to false when backend is ready

    // Enable WebSocket for real-time updates
    useWebSocket: false, // Set to true when WebSocket server is ready

    // Enable polling fallback
    usePolling: true,
    pollingInterval: 30000, // 30 seconds

    // Enable auto-refresh for pages
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes

    // Enable debug logging
    debugMode: isDevelopment,

    // Enable API caching
    enableCache: true,
    cacheTimeout: 60000, // 1 minute

    // Enable error reporting
    errorReporting: isProduction,
  };

  // Service Configuration
  window.SERVICES = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"];

  window.LOCATIONS = [
    "Tôn Thất Thuyết",
    "Huỳnh Thúc Kháng",
    "Giảng Võ",
    "Hào Nam",
    "Nguyễn Tuân",
  ];

  window.PAYMENT_METHODS = [
    "Tiền mặt",
    "Chuyển khoản",
    "Thẻ tín dụng",
    "Ví điện tử",
  ];

  // Timezone & Currency
  window.TIMEZONE = "Asia/Bangkok";
  window.CURRENCY = "VNĐ";

  // Targets
  window.TARGETS = {
    monthlyRevenue: 3000000000, // 3 billion VND
    yearlyRevenue: 30000000000, // 30 billion VND
    monthlyGrowth: 15, // 15%
    memberRetention: 85, // 85%
  };

  // Log configuration
  if (window.FEATURES.debugMode) {
    console.log("⚙️ Actiwell Dashboard Configuration");
    console.log("=".repeat(60));
    console.log(`Environment: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
    console.log(`API Base URL: ${window.API_BASE_URL}`);
    console.log(`WebSocket URL: ${window.WS_URL}`);
    console.log(`Use Mock Data: ${window.FEATURES.useMockData ? "Yes" : "No"}`);
    console.log(
      `Use WebSocket: ${window.FEATURES.useWebSocket ? "Yes" : "No"}`
    );
    console.log(`Timezone: ${window.TIMEZONE}`);
    console.log(`Currency: ${window.CURRENCY}`);
    console.log("=".repeat(60));
  }
})(window);
