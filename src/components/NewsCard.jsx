// News Card Component
import { ExternalLink } from 'lucide-react';

const NewsCard = ({ news, onReadMore }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text, length) => {
    return text?.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      {news.imageUrl && (
        <div className="relative h-48 bg-gray-200 overflow-hidden rounded-lg mb-4">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-news.jpg';
            }}
          />
          {news.isBreaking && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              🚨 BREAKING
            </div>
          )}
        </div>
      )}

      {/* Category Badge */}
      <div className="mb-2">
        <span className={`badge badge-${news.category === 'politics' ? 'primary' : news.category === 'technology' ? 'info' : 'warning'}`}>
          {news.category?.charAt(0).toUpperCase() + news.category?.slice(1)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-2 text-gray-800 hover:text-primary transition">
        {truncateText(news.title, 60)}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {truncateText(news.description, 120)}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>{news.source}</span>
        <span>{formatDate(news.publishedAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onReadMore ? (
          <button
            type="button"
            onClick={() => onReadMore(news)}
            className="btn btn-primary flex-1 flex items-center justify-center space-x-2 btn-small"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Read More</span>
          </button>
        ) : (
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-1 flex items-center justify-center space-x-2 btn-small"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Read More</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
