// Redux Store
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import newsSlice from './slices/newsSlice';
import alertsSlice from './slices/alertsSlice';
import notificationsSlice from './slices/notificationsSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    news: newsSlice,
    alerts: alertsSlice,
    notifications: notificationsSlice,
  },
});

export default store;
