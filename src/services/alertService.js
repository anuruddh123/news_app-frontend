// Alerts Service
import api from './api';

const alertService = {
  createAlert: async (category, frequency, keywords, notificationMethods) => {
    try {
      const response = await api.post('/alerts', {
        category,
        frequency,
        keywords,
        notificationMethods,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getUserActiveAlerts: async () => {
    try {
      const response = await api.get('/alerts/active');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getAlertById: async (id) => {
    try {
      const response = await api.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  updateAlert: async (id, frequency, keywords, notificationMethods, isActive) => {
    try {
      const response = await api.put(`/alerts/${id}`, {
        frequency,
        keywords,
        notificationMethods,
        isActive,
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteAlert: async (id) => {
    try {
      const response = await api.delete(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  toggleAlert: async (id) => {
    try {
      const response = await api.patch(`/alerts/${id}/toggle`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};

export default alertService;
