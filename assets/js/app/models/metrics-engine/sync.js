/**
 * Metrics Engine - Data Synchronization
 * Đồng bộ dữ liệu giữa các trang và đảm bảo tính nhất quán
 */

class DataSynchronizer {
  constructor() {
    this.syncInterval = null;
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.syncListeners = [];
  }

  /**
   * Bắt đầu đồng bộ dữ liệu
   */
  startSync() {
    if (this.syncInterval) return;

    // Đồng bộ ngay lập tức
    this.syncData();

    // Đồng bộ định kỳ mỗi 30 giây
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, 30000);

    console.log("Data synchronization started");
  }

  /**
   * Dừng đồng bộ dữ liệu
   */
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    console.log("Data synchronization stopped");
  }

  /**
   * Đồng bộ dữ liệu
   */
  async syncData() {
    if (this.isSyncing) return;

    this.isSyncing = true;
    this.lastSyncTime = new Date();

    try {
      // Lấy dữ liệu từ tất cả các nguồn
      const allData = this.collectAllData();

      // Chuẩn hóa dữ liệu
      const normalizedData = this.normalizeAllData(allData);

      // Cập nhật metrics engine
      if (window.MetricsEngine) {
        await window.MetricsEngine.initialize(normalizedData);
      }

      // Thông báo cho các listeners
      this.notifySyncListeners("dataSynced", normalizedData);

      console.log("Data synchronized successfully");
    } catch (error) {
      console.error("Failed to sync data:", error);
      this.notifySyncListeners("syncError", error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Thu thập dữ liệu từ tất cả các nguồn
   * @returns {Object} Dữ liệu từ tất cả các nguồn
   */
  collectAllData() {
    const data = {
      checkins: [],
    };

    // Thu thập dữ liệu từ các trang khác nhau
    if (window.lateCheckinData) {
      data.checkins = data.checkins.concat(window.lateCheckinData);
    }

    if (window.lateCheckinMTDData) {
      data.checkins = data.checkins.concat(window.lateCheckinMTDData);
    }

    if (window.detailCheckinData) {
      data.checkins = data.checkins.concat(window.detailCheckinData);
    }

    // Loại bỏ trùng lặp dựa trên ID
    const uniqueCheckins = this.removeDuplicates(data.checkins, "id");
    data.checkins = uniqueCheckins;

    return data;
  }

  /**
   * Loại bỏ trùng lặp dữ liệu
   * @param {Array} data - Dữ liệu
   * @param {string} key - Trường key để so sánh
   * @returns {Array} Dữ liệu đã loại bỏ trùng lặp
   */
  removeDuplicates(data, key) {
    const seen = new Set();
    return data.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  /**
   * Chuẩn hóa tất cả dữ liệu
   * @param {Object} data - Dữ liệu thô
   * @returns {Object} Dữ liệu đã chuẩn hóa
   */
  normalizeAllData(data) {
    if (window.DataSelector) {
      // Sử dụng DataSelector để chuẩn hóa
      window.DataSelector.addRawData(
        MetricsTypes.RawDataTypes.CHECKIN,
        data.checkins
      );
      return {
        checkins: window.DataSelector.getNormalizedData(
          MetricsTypes.RawDataTypes.CHECKIN
        ),
      };
    }

    return data;
  }

  /**
   * Thêm listener cho sync events
   * @param {string} event - Tên event
   * @param {Function} callback - Callback function
   */
  addSyncListener(event, callback) {
    this.syncListeners.push({ event, callback });
  }

  /**
   * Xóa listener
   * @param {string} event - Tên event
   * @param {Function} callback - Callback function
   */
  removeSyncListener(event, callback) {
    this.syncListeners = this.syncListeners.filter(
      (listener) =>
        !(listener.event === event && listener.callback === callback)
    );
  }

  /**
   * Thông báo cho sync listeners
   * @param {string} event - Tên event
   * @param {Object} data - Dữ liệu
   */
  notifySyncListeners(event, data) {
    this.syncListeners
      .filter((listener) => listener.event === event)
      .forEach((listener) => {
        try {
          listener.callback(data);
        } catch (error) {
          console.error(`Error in sync listener for event ${event}:`, error);
        }
      });
  }

  /**
   * Lấy trạng thái sync
   * @returns {Object} Trạng thái sync
   */
  getSyncStatus() {
    return {
      isRunning: !!this.syncInterval,
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      listenersCount: this.syncListeners.length,
    };
  }

  /**
   * Force sync ngay lập tức
   */
  forceSync() {
    this.syncData();
  }
}

// Tạo instance global
window.DataSynchronizer = new DataSynchronizer();

// Tự động bắt đầu sync khi trang load
document.addEventListener("DOMContentLoaded", function () {
  // Chờ một chút để đảm bảo tất cả script đã load
  setTimeout(() => {
    window.DataSynchronizer.startSync();
  }, 1000);
});

// Dừng sync khi trang unload
window.addEventListener("beforeunload", function () {
  window.DataSynchronizer.stopSync();
});
