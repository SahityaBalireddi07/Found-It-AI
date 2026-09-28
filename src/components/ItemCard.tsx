import React from 'react';
import { Item, MatchResult } from '../types';
import { ImageFallback } from './ImageFallback';
import { MapPin, Calendar, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onViewMatches?: (item: Item) => void;
  matches?: MatchResult[];
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onViewMatches,
  matches = [],
}) => {
  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';
  const hasMatches = matches.length > 0 && !isReunited;
  const bestMatch = hasMatches ? matches[0] : null;

  // Format date nicely
  const formattedDate = new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col text-left cursor-pointer"
    >
      {/* Visual Slot */}
      <div className="relative">
        <ImageFallback
          imageUrl={item.imageUrl}
          category={item.category}
          type={item.type}
          name={item.name}
          className="w-full h-44"
        />

        {/* Status Indicator (Clean badge in corner) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isReunited ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-md shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reunited
            </span>
          ) : isLost ? (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white rounded-md shadow-xs">
              Lost
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md shadow-xs">
              Found
            </span>
          )}
        </div>

        {/* AI Match Flag if high-probability match exists */}
        {hasMatches && bestMatch && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-blue-900/90 text-white rounded-md shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-sky-300" />
              <span>{bestMatch.overallScore}% Match</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            <span>{item.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>
        </div>

        <div>
          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 pt-2 border-t border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          {/* Bottom Card Actions */}
          <div className="flex items-center justify-between pt-1">
            {hasMatches ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onViewMatches) {
                    onViewMatches(item);
                  } else {
                    onSelect(item);
                  }
                }}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 group/btn"
              >
                <span>{matches.length} AI Suggestion{matches.length > 1 ? 's' : ''}</span>
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <span className="text-xs text-slate-400">
                No active matches
              </span>
            )}

            <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600 flex items-center gap-0.5 ml-auto">
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
