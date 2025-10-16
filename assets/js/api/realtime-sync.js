/**
 * Real-time Sync System
 * WebSocket and Polling support for live updates
 */

(function (window) {
  "use strict";

  class RealtimeSync {
    constructor(config = {}) {
      this.useWebSocket = config.useWebSocket !== false;
      this.wsURL = config.wsURL || "ws://localhost:8000/ws";
      this.pollingInterval = config.pollingInterval || 30000; // 30 seconds
      this.ws = null;
      this.pollingTimers = new Map();
      this.subscribers = new Map();
      this.isConnected = false;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectDelay = 3000; // 3 seconds
    }

    /**
     * Initialize real-time sync
     */
    init() {
      if (this.useWebSocket) {
        this.initWebSocket();
      } else {
        console.log("📡 Using polling for real-time updates");
      }
    }

    /**
     * Initialize WebSocket connection
     */
    initWebSocket() {
      try {
        console.log(`🔌 Connecting to WebSocket: ${this.wsURL}`);
        this.ws = new WebSocket(this.wsURL);

        this.ws.onopen = () => {
          console.log("✅ WebSocket connected");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.notifySubscribers("connection", { status: "connected" });
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error("❌ Error parsing WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          this.isConnected = false;
        };

        this.ws.onclose = () => {
          console.warn("⚠️ WebSocket disconnected");
          this.isConnected = false;
          this.attemptReconnect();
        };
      } catch (error) {
        console.error("❌ Failed to initialize WebSocket:", error);
        this.fallbackToPolling();
      }
    }

    /**
     * Attempt to reconnect WebSocket
     */
    attemptReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(
          `🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );

        setTimeout(() => {
          this.initWebSocket();
        }, this.reconnectDelay * this.reconnectAttempts);
      } else {
        console.error(
          "❌ Max reconnect attempts reached. Falling back to polling."
        );
        this.fallbackToPolling();
      }
    }

    /**
     * Fallback to polling when WebSocket fails
     */
    fallbackToPolling() {
      this.useWebSocket = false;
      console.log("📡 Switched to polling mode");
    }

    /**
     * Handle incoming WebSocket message
     */
    handleMessage(message) {
      const { type, data } = message;

      console.log(`📨 Received ${type} update`);

      // Notify subscribers
      this.notifySubscribers(type, data);

      // Update global data based on type
      switch (type) {
        case "revenue":
          this.updateRevenueData(data);
          break;
        case "booking":
          this.updateBookingData(data);
          break;
        case "checkin":
          this.updateCheckinData(data);
          break;
        case "visitor":
          this.updateVisitorData(data);
          break;
        default:
          console.warn(`⚠️ Unknown message type: ${type}`);
      }
    }

    /**
     * Subscribe to real-time updates
     * @param {string} type - Update type (revenue, booking, checkin, visitor)
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(type, callback) {
      if (!this.subscribers.has(type)) {
        this.subscribers.set(type, []);
      }

      this.subscribers.get(type).push(callback);

      console.log(`✅ Subscribed to ${type} updates`);

      // Return unsubscribe function
      return () => {
        const callbacks = this.subscribers.get(type);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
          console.log(`🔕 Unsubscribed from ${type} updates`);
        }
      };
    }

    /**
     * Notify subscribers
     */
    notifySubscribers(type, data) {
      if (this.subscribers.has(type)) {
        this.subscribers.get(type).forEach((callback) => {
          try {
            callback(data);
          } catch (error) {
            console.error(`❌ Error in ${type} subscriber:`, error);
          }
        });
      }
    }

    /**
     * Start polling for a specific endpoint
     */
    startPolling(type, endpoint, callback) {
      if (this.pollingTimers.has(type)) {
        console.warn(`⚠️ Polling already started for ${type}`);
        return;
      }

      console.log(
        `📡 Starting polling for ${type} (${this.pollingInterval}ms)`
      );

      const poll = async () => {
        try {
          const response = await window.apiClient.get(endpoint);
          callback(response.data);
        } catch (error) {
          console.error(`❌ Polling error for ${type}:`, error);
        }
      };

      // Initial poll
      poll();

      // Set interval
      const timer = setInterval(poll, this.pollingInterval);
      this.pollingTimers.set(type, timer);
    }

    /**
     * Stop polling
     */
    stopPolling(type) {
      if (this.pollingTimers.has(type)) {
        clearInterval(this.pollingTimers.get(type));
        this.pollingTimers.delete(type);
        console.log(`🛑 Stopped polling for ${type}`);
      }
    }

    /**
     * Update revenue data
     */
    updateRevenueData(data) {
      if (data.period === "mtd") {
        window.currentMonthRevenue = data.items || [];
      } else if (data.period === "today") {
        window.todayRevenue = data.items || [];
      } else if (data.period === "yesterday") {
        window.yesterdayRevenue = data.items || [];
      }
      console.log(`✅ Revenue data updated (${data.period})`);
    }

    /**
     * Update booking data
     */
    updateBookingData(data) {
      if (data.period === "today") {
        window.todayBookings = data.items || [];
      } else if (data.period === "yesterday") {
        window.yesterdayBookings = data.items || [];
      } else if (data.period === "week") {
        window.thisWeekBookings = data.items || [];
      } else if (data.period === "mtd") {
        window.mtdBookings = data.items || [];
      }
      console.log(`✅ Booking data updated (${data.period})`);
    }

    /**
     * Update checkin data
     */
    updateCheckinData(data) {
      if (data.period === "today") {
        window.todayCheckins = data.items || [];
      } else if (data.period === "yesterday") {
        window.yesterdayCheckins = data.items || [];
      } else if (data.period === "mtd") {
        window.mtdCheckins = data.items || [];
      }
      console.log(`✅ Checkin data updated (${data.period})`);
    }

    /**
     * Update visitor data
     */
    updateVisitorData(data) {
      if (data.period === "today") {
        window.todayVisitors = data.items || [];
      } else if (data.period === "yesterday") {
        window.yesterdayVisitors = data.items || [];
      } else if (data.period === "mtd") {
        window.mtdVisitors = data.items || [];
      }
      console.log(`✅ Visitor data updated (${data.period})`);
    }

    /**
     * Cleanup
     */
    destroy() {
      // Stop all polling
      this.pollingTimers.forEach((timer, type) => {
        clearInterval(timer);
      });
      this.pollingTimers.clear();

      // Close WebSocket
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      // Clear subscribers
      this.subscribers.clear();

      console.log("🗑️ Real-time sync destroyed");
    }
  }

  // Export to global scope
  window.RealtimeSync = RealtimeSync;

  // Initialize services if API client exists
  if (typeof window.apiClient !== "undefined") {
    window.revenueAPI = new RevenueAPI(window.apiClient);
    window.bookingAPI = new BookingAPI(window.apiClient);
    window.checkinAPI = new CheckinAPI(window.apiClient);
    window.visitorAPI = new VisitorAPI(window.apiClient);

    // Initialize real-time sync
    window.realtimeSync = new RealtimeSync({
      useWebSocket: false, // Disable WebSocket by default (use polling)
      pollingInterval: 30000, // 30 seconds
    });

    console.log("✅ API Services & Real-time Sync initialized");
  }
})(window);
