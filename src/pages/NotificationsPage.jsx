// Notifications Page Component
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, ExternalLink, Trash2, CheckCircle } from 'lucide-react';
import notificationService from '../services/notificationService';
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setUnreadCount,
} from '../redux/slices/notificationsSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await notificationService.getNotifications(50, 0);
      if (result.success) {
        dispatch(setNotifications(result.data));
        setPagination(result.pagination);
      }

      const countResult = await notificationService.getUnreadCount();
      if (countResult.success) {
        dispatch(setUnreadCount(countResult.unreadCount));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const result = await notificationService.markAsRead(id);
      if (result.success) {
        dispatch(markAsRead(id));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await notificationService.markAllAsRead();
      if (result.success) {
        dispatch(markAllAsRead());
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await notificationService.deleteNotification(id);
      if (result.success) {
        dispatch(deleteNotification(id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                <Bell className="w-8 h-8" />
                <span>Notifications</span>
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : 'All notifications read'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="btn btn-primary btn-small">
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <LoadingSpinner />
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border transition ${
                  notification.isRead
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-200 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 truncate">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                      )}
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full capitalize">
                        {notification.category || 'general'}
                      </span>
                    </div>

                    {/* Description */}
                    {notification.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {notification.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex gap-3">
                        {notification.source && <span>{notification.source}</span>}
                        <span>{formatDate(notification.createdAt)}</span>
                      </div>
                      {notification.notificationType && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                          {notification.notificationType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-primary hover:bg-blue-100 rounded-lg transition"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {notification.url && (
                      <a
                        href={notification.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-primary hover:bg-blue-100 rounded-lg transition"
                        title="Read article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Image if available */}
                {notification.imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden max-h-40">
                    <img
                      src={notification.imageUrl}
                      alt="Notification"
                      className="w-full h-48 object-cover hover:scale-105 transition"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Notifications</h2>
            <p className="text-gray-600">
              You're all caught up! Check back later for latest news updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
