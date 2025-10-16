/**
 * Data Adapter
 * Transform between backend API format and frontend format
 */

(function (window) {
  "use strict";

  class DataAdapter {
    /**
     * Transform revenue data from backend
     */
    transformRevenue(backendData) {
      if (!backendData || !Array.isArray(backendData)) {
        return [];
      }

      return backendData.map((item) => ({
        id: item.id,
        date: new Date(item.transaction_date || item.date),
        time: item.transaction_time || item.time,
        service: this.mapServiceName(item.service_name || item.service),
        location: this.mapLocationName(item.branch_name || item.location),
        paymentMethod: item.payment_method || item.paymentMethod,
        staff: item.staff_name || item.staff,
        amount: parseFloat(item.amount || item.revenue || 0),
        target: parseFloat(item.target || 0),
        transactions: parseInt(item.transaction_count || 1),
        status: item.status || "completed",
        description: item.description || item.note || "",
      }));
    }

    /**
     * Transform booking data from backend
     */
    transformBooking(backendData) {
      if (!backendData || !Array.isArray(backendData)) {
        return [];
      }

      return backendData.map((item) => ({
        id: item.id,
        date: new Date(item.booking_date || item.date),
        time: item.booking_time || item.time,
        customer: item.customer_name || item.customer || item.member_name,
        phone: item.phone_number || item.phone,
        service: this.mapServiceName(item.service_name || item.service),
        location: this.mapLocationName(item.branch_name || item.location),
        status: this.mapBookingStatus(item.status),
        note: item.notes || item.note || "",
      }));
    }

    /**
     * Transform checkin data from backend
     */
    transformCheckin(backendData) {
      if (!backendData || !Array.isArray(backendData)) {
        return [];
      }

      return backendData.map((item) => ({
        id: item.id,
        date: new Date(item.checkin_date || item.date),
        time: item.checkin_time || item.time,
        member: item.member_name || item.member,
        membershipId: item.membership_id || item.membershipId,
        service: this.mapServiceName(item.service_name || item.service),
        location: this.mapLocationName(item.branch_name || item.location),
        classType: item.class_type || item.classType,
      }));
    }

    /**
     * Transform visitor data from backend
     */
    transformVisitor(backendData) {
      if (!backendData || !Array.isArray(backendData)) {
        return [];
      }

      return backendData.map((item) => ({
        id: item.id,
        date: new Date(item.visit_date || item.date),
        time: item.visit_time || item.time,
        name: item.visitor_name || item.name,
        phone: item.phone_number || item.phone,
        department: this.mapServiceName(item.department || item.service),
        source: item.source_channel || item.source,
        converted: item.is_converted || item.converted || false,
        inbody: item.has_inbody || item.inbody || false,
        staff: item.staff_name || item.staff,
      }));
    }

    /**
     * Map service names from backend to frontend
     */
    mapServiceName(serviceName) {
      const serviceMap = {
        membership: "Membership",
        "pt-fitness": "PT Fitness",
        pt_fitness: "PT Fitness",
        pt: "PT Fitness",
        fitness: "PT Fitness",
        pilates: "Pilates",
        "swimming-coach": "Swimming Coach",
        swimming_coach: "Swimming Coach",
        swimming: "Swimming Coach",
        pool: "Swimming Coach",
      };

      const key = (serviceName || "").toLowerCase().trim();
      return serviceMap[key] || serviceName;
    }

    /**
     * Map location names from backend to frontend
     */
    mapLocationName(locationName) {
      const locationMap = {
        "ton-that-thuyet": "Tôn Thất Thuyết",
        "huynh-thuc-khang": "Huỳnh Thúc Kháng",
        "giang-vo": "Giảng Võ",
        "hao-nam": "Hào Nam",
        "nguyen-tuan": "Nguyễn Tuân",
      };

      const key = (locationName || "").toLowerCase().trim();
      return locationMap[key] || locationName;
    }

    /**
     * Map booking status from backend to frontend
     */
    mapBookingStatus(status) {
      const statusMap = {
        confirmed: "completed",
        pending: "pending",
        canceled: "cancelled",
        cancelled: "cancelled",
        "no-show": "no-show",
        noshow: "no-show",
      };

      const key = (status || "").toLowerCase().trim();
      return statusMap[key] || status;
    }

    /**
     * Transform data to backend format (for POST/PUT)
     */
    toBackendFormat(frontendData, type) {
      switch (type) {
        case "booking":
          return this.bookingToBackend(frontendData);
        case "visitor":
          return this.visitorToBackend(frontendData);
        default:
          return frontendData;
      }
    }

    /**
     * Transform booking to backend format
     */
    bookingToBackend(booking) {
      return {
        booking_date: booking.date,
        booking_time: booking.time,
        customer_name: booking.customer,
        phone_number: booking.phone,
        service_name: booking.service,
        branch_name: booking.location,
        status: booking.status,
        notes: booking.note,
      };
    }

    /**
     * Transform visitor to backend format
     */
    visitorToBackend(visitor) {
      return {
        visit_date: visitor.date,
        visit_time: visitor.time,
        visitor_name: visitor.name,
        phone_number: visitor.phone,
        department: visitor.department,
        source_channel: visitor.source,
        is_converted: visitor.converted,
        has_inbody: visitor.inbody,
      };
    }
  }

  // Export to global scope
  window.DataAdapter = DataAdapter;

  // Create global instance
  window.dataAdapter = new DataAdapter();

  console.log("✅ Data Adapter initialized");
})(window);
