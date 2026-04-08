// Alerts Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [],
  loading: false,
  error: null,
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
    addAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    updateAlert: (state, action) => {
      const alert = state.alerts.find(a => a._id === action.payload._id);
      if (alert) {
        Object.assign(alert, action.payload);
      }
    },
    deleteAlert: (state, action) => {
      state.alerts = state.alerts.filter(a => a._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAlerts, addAlert, updateAlert, deleteAlert, setLoading, setError } = alertsSlice.actions;
export default alertsSlice.reducer;
