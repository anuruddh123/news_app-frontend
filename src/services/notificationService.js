// Notifications Service
import api from './api';

const notificationService = {
  getNotifications: async (limit = 20, skip = 0) => {
    try {
      const response = await api.get('/notifications', {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getNotificationsByCategory: async (category, limit = 20, skip = 0) => {
    try {
      const response = await api.get(`/notifications/category/${category}`, {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/mark-all-as-read');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getDashboardData: async () => {
    try {
      const response = await api.get('/notifications/dashboard');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};

export default notificationService;
