// Preferences Page Component
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings, Plus, Trash2, AlertCircle } from 'lucide-react';
import authService from '../services/authService';
import alertService from '../services/alertService';
import { updateUserPreferences } from '../redux/slices/authSlice';
import { setAlerts, addAlert, updateAlert, deleteAlert } from '../redux/slices/alertsSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const PreferencesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { alerts } = useSelector(state => state.alerts);
  const [preferences, setPreferences] = useState(user?.preferences || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    category: 'general',
    frequency: 'daily',
    keywords: '',
    notificationMethods: { email: true, push: false },
  });
  const [successMessage, setSuccessMessage] = useState('');

  const categories = ['general', 'politics', 'sports', 'technology', 'science', 'business', 'health', 'entertainment'];
  const frequencies = ['immediate', 'hourly', 'daily'];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setIsLoadingAlerts(true);
    try {
      const result = await alertService.getAlerts();
      if (result.success) {
        dispatch(setAlerts(result.data));
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
    setSuccessMessage('');
  };

  const handleNotificationMethodChange = (method) => {
    setPreferences(prev => ({
      ...prev,
      notificationMethods: {
        ...prev.notificationMethods,
        [method]: !prev.notificationMethods?.[method],
      },
    }));
  };

  const handleCategoryToggle = (category) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...(prev.categories || []), category],
    }));
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      const result = await authService.updatePreferences(preferences);
      if (result.success) {
        dispatch(updateUserPreferences(result.preferences));
        setSuccessMessage('Preferences updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const keywords = newAlert.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k);

      const result = await alertService.createAlert(
        newAlert.category,
        newAlert.frequency,
        keywords,
        newAlert.notificationMethods
      );

      if (result.success) {
        dispatch(addAlert(result.data));
        setNewAlert({
          category: 'general',
          frequency: 'daily',
          keywords: '',
          notificationMethods: { email: true, push: false },
        });
        setShowNewAlert(false);
        setSuccessMessage('Alert created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const handleDeleteAlert = async (id) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      const result = await alertService.deleteAlert(id);
      if (result.success) {
        dispatch(deleteAlert(id));
        setSuccessMessage('Alert deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleToggleAlert = async (id, currentStatus) => {
    try {
      const result = await alertService.toggleAlert(id);
      if (result.success) {
        dispatch(updateAlert(result.data));
      }
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
            <Settings className="w-8 h-8" />
            <span>Alert Preferences</span>
          </h1>
          <p className="text-gray-600">Customize your news alerts and notification settings</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Preferences Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>General Preferences</span>
          </h2>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Interested Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.categories?.includes(category) || false}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-gray-700 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Alert Frequency</label>
              <div className="flex gap-3">
                {frequencies.map(freq => (
                  <label key={freq} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={preferences.frequency === freq}
                      onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 capitalize">{freq}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notification Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Notification Methods</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notificationMethods?.email || false}
                    onChange={() => handleNotificationMethodChange('email')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notificationMethods?.push || false}
                    onChange={() => handleNotificationMethodChange('push')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700">Push Notifications</span>
                </label>
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={preferences.timezone || 'UTC'}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="input"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Standard Time</option>
                <option value="CST">Central Standard Time</option>
                <option value="MST">Mountain Standard Time</option>
                <option value="PST">Pacific Standard Time</option>
                <option value="IST">Indian Standard Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Custom Alerts Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <AlertCircle className="w-6 h-6" />
              <span>Custom Alerts</span>
            </h2>
            {!showNewAlert && (
              <button
                onClick={() => setShowNewAlert(true)}
                className="btn btn-primary btn-small flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>New Alert</span>
              </button>
            )}
          </div>

          {/* Create New Alert Form */}
          {showNewAlert && (
            <form onSubmit={handleCreateAlert} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newAlert.category}
                    onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
                    className="input"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={newAlert.frequency}
                    onChange={(e) => setNewAlert({ ...newAlert, frequency: e.target.value })}
                    className="input"
                  >
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={newAlert.keywords}
                    onChange={(e) => setNewAlert({ ...newAlert, keywords: e.target.value })}
                    className="input"
                    placeholder="e.g., python, javascript, web development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Methods</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAlert.notificationMethods.email}
                        onChange={(e) =>
                          setNewAlert({
                            ...newAlert,
                            notificationMethods: {
                              ...newAlert.notificationMethods,
                              email: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAlert.notificationMethods.push}
                        onChange={(e) =>
                          setNewAlert({
                            ...newAlert,
                            notificationMethods: {
                              ...newAlert.notificationMethods,
                              push: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-gray-700">Push</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewAlert(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Alerts List */}
          {isLoadingAlerts ? (
            <LoadingSpinner />
          ) : alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 capitalize">{alert.category}</p>
                    <p className="text-sm text-gray-600">
                      {alert.keywords?.length > 0 ? `Keywords: ${alert.keywords.join(', ')}` : 'No specific keywords'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Frequency: {alert.frequency}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alert.isActive}
                        onChange={() => handleToggleAlert(alert._id, alert.isActive)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <button
                      onClick={() => handleDeleteAlert(alert._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">No custom alerts yet. Create your first alert!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
