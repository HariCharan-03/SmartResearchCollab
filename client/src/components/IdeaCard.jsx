import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, User, ArrowUpRight } from 'lucide-react';

const IdeaCard = ({ idea }) => {
  return (
    <div className="liquid-glass p-8 rounded-3xl flex flex-col h-full hover:bg-white/5 transition-all group relative overflow-hidden">
      
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <h3 className="text-2xl font-heading italic text-white line-clamp-2 pr-4 tracking-tight leading-snug">
          {idea.title}
        </h3>
        <span className="px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase bg-white/10 text-white shrink-0 mt-1">
          {idea.status || 'Open'}
        </span>
      </div>
      
      <p className="text-white/60 text-sm font-light leading-relaxed mb-8 line-clamp-3 flex-grow relative z-10">
        {idea.description}
      </p>

      <div className="space-y-6 mt-auto relative z-10">
        <div className="flex flex-wrap gap-2">
          {idea.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1.5 text-xs text-white/50 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-lg font-light">
              <Tag size={10} className="opacity-50" /> {tag}
            </span>
          ))}
          {idea.tags?.length > 3 && (
            <span className="text-xs text-white/40 px-2 py-1.5 font-light">
              +{idea.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/50 font-light">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
               <User size={12} className="text-white/70" />
            </div>
            <span className="truncate max-w-[120px]">{idea.createdBy?.name || 'Anonymous'}</span>
          </div>
          <Link 
            to={`/ideas/${idea._id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-white/70 transition-colors"
          >
            Details <ArrowUpRight size={14} className="opacity-70" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
