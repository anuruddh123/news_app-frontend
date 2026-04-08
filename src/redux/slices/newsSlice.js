// News Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  news: [],
  breakingNews: [],
  selectedNews: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    skip: 0,
    pages: 0,
  },
  selectedCategory: 'general',
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action) => {
      state.news = action.payload;
    },
    setBreakingNews: (state, action) => {
      state.breakingNews = action.payload;
    },
    setSelectedNews: (state, action) => {
      state.selectedNews = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    addNews: (state, action) => {
      state.news = [action.payload, ...state.news];
    },
    updateNewsViews: (state, action) => {
      const news = state.news.find(n => n._id === action.payload.id);
      if (news) {
        news.views = action.payload.views;
      }
    },
  },
});

export const {
  setNews,
  setBreakingNews,
  setSelectedNews,
  setLoading,
  setError,
  setCategory,
  setPagination,
  addNews,
  updateNewsViews,
} = newsSlice.actions;

export default newsSlice.reducer;
