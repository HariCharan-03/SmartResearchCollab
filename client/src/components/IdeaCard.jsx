import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, User, CheckCircle, ArrowRight } from 'lucide-react';

const statusColors = {
  'Open': 'bg-green-500/10 text-green-400 border-green-500/20',
  'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Completed': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const IdeaCard = ({ idea }) => {
  return (
    <div className="glass-panel p-6 rounded-xl flex flex-col h-full hover:border-primary/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
          {idea.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[idea.status] || statusColors['Open']}`}>
          {idea.status}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
        {idea.description}
      </p>

      <div className="space-y-4 mt-auto">
        <div className="flex flex-wrap gap-2">
          {idea.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs text-gray-300 bg-surface px-2 py-1 rounded">
              <Tag size={12} /> {tag}
            </span>
          ))}
          {idea.tags?.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">+{idea.tags.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User size={14} />
            <span className="truncate max-w-[120px]">{idea.createdBy?.name || 'Anonymous'}</span>
          </div>
          <Link 
            to={`/ideas/${idea._id}`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-indigo-400 transition-colors"
          >
            View Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
