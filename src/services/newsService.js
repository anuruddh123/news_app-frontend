// News Service
import api from './api';

const newsService = {
  getNews: async (category, limit = 20, skip = 0) => {
    try {
      const response = await api.get('/news', {
        params: { category, limit, skip },
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getBreakingNews: async () => {
    try {
      const response = await api.get('/news/breaking');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getNewsById: async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  searchNews: async (keyword, limit = 20) => {
    try {
      const response = await api.get('/news/search', {
        params: { keyword, limit },
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getCategoryNews: async (category, limit = 20, skip = 0) => {
    try {
      const response = await api.get(`/news/category/${category}`, {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  shareNews: async (id) => {
    try {
      const response = await api.post(`/news/${id}/share`);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  fetchAndSaveNews: async () => {
    try {
      const response = await api.post('/news/fetch-and-save');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getNewsStats: async () => {
    try {
      const response = await api.get('/news/stats');
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};

export default newsService;
