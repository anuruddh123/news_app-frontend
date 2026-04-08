// Notifications Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  dashboardData: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        if (!n.isRead) {
          n.isRead = true;
        }
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setUnreadCount,
  setDashboardData,
  setLoading,
  setError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
