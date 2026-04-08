// News Page Component
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search } from 'lucide-react';
import newsService from '../services/newsService';
import { setNews, setCategory, setPagination } from '../redux/slices/newsSlice';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const NewsPage = () => {
  const dispatch = useDispatch();
  const { news, selectedCategory, loading, pagination } = useSelector(state => state.news);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const categories = ['general', 'politics', 'sports', 'technology', 'science', 'business', 'health', 'entertainment'];

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const fetchNews = async (category, skip = 0) => {
    try {
      const result = await newsService.getNews(category, 20, skip);
      if (result.success) {
        dispatch(setNews(result.data));
        dispatch(setPagination(result.pagination));
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await newsService.searchNews(searchQuery, 20);
      if (result.success) {
        dispatch(setNews(result.data));
      }
    } catch (error) {
      console.error('Error searching news:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSearchQuery('');
    dispatch(setCategory(category));
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">News & Updates</h1>
          <p className="text-gray-600">Stay updated with the latest news from around the world</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 pr-20"
              placeholder="Search news..."
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 btn btn-primary btn-small"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'btn btn-primary'
                    : 'btn btn-secondary hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {news.map(item => (
                <NewsCard
                  key={item._id}
                  news={item}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => fetchNews(selectedCategory, (page - 1) * pagination.limit)}
                    className={`px-3 py-2 rounded-lg font-medium transition ${
                      pagination.skip / pagination.limit === page - 1
                        ? 'btn btn-primary'
                        : 'btn btn-secondary hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No news found. Try searching or selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
