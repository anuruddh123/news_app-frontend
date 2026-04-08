// Main App Component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from './redux/slices/authSlice';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewsPage from './pages/NewsPage';
import PreferencesPage from './pages/PreferencesPage';
import NotificationsPage from './pages/NotificationsPage';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Services
import socketService from './services/socketService';
import { addNotification, setUnreadCount } from './redux/slices/notificationsSlice';

import './styles/global.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        dispatch(setUser(JSON.parse(savedUser)));
      } catch (error) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect Socket.io
      socketService.connect(user._id);

      // Listen for new alerts
      socketService.onNewAlert((data) => {
        dispatch(addNotification({
          _id: Date.now(),
          title: data.title,
          description: data.notification?.description,
          imageUrl: data.notification?.image,
          url: data.notification?.url,
          category: data.category,
          isRead: false,
          createdAt: new Date(),
        }));
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
