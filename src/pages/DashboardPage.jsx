// Dashboard Page Component
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, Newspaper } from 'lucide-react';
import newsService from '../services/newsService';
import { setNews } from '../redux/slices/newsSlice';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { news, loading } = useSelector(state => state.news);
  const { user } = useSelector(state => state.auth);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [newsStats, setNewsStats] = useState({ totalArticles: 0, topCategory: 'N/A' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoadingDashboard(true);
    try {
      // Fetch breaking news
      const newsResult = await newsService.getNews(null, 6);
      if (newsResult.success) {
        dispatch(setNews(newsResult.data));
      }

      // Fetch news stats
      const statsResult = await newsService.getNewsStats();
      if (statsResult.success) {
        setNewsStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const handleReadMore = async (newsItem) => {
    const newTab = window.open('', '_blank', 'noopener,noreferrer');

    try {
      const result = await newsService.getNewsById(newsItem._id);
      if (!result.success) {
        console.error('Failed to track news view:', result.message || result);
      }
    } catch (error) {
      console.error('Error tracking news view:', error);
    } finally {
      if (newTab) {
        newTab.location = newsItem.url;
      } else {
        window.open(newsItem.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const stats = [
    {
      icon: Newspaper,
      label: 'Total Articles',
      value: newsStats.totalArticles,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: TrendingUp,
      label: 'Top Category',
      value: newsStats.topCategory,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Get your personalized news updates and alerts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Distribution */}

        {/* Latest News */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest News</h2>
          {isLoadingDashboard ? (
            <LoadingSpinner />
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map(item => (
                <NewsCard
                  key={item._id}
                  news={item}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No news available. Try refreshing or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
