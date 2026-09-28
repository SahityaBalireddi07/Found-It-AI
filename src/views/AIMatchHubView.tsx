import React, { useState } from 'react';
import { Item, MatchResult } from '../types';
import { ImageFallback } from '../components/ImageFallback';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  Mail,
  ExternalLink
} from 'lucide-react';

interface AIMatchHubViewProps {
  items: Item[];
  matches: MatchResult[];
  onSelectItem: (item: Item) => void;
  onOpenReport: () => void;
}

export const AIMatchHubView: React.FC<AIMatchHubViewProps> = ({
  items,
  matches,
  onSelectItem,
  onOpenReport,
}) => {
  const [filterConfidence, setFilterConfidence] = useState<'all' | 'high' | 'medium'>('all');
  const [selectedTargetItemId, setSelectedTargetItemId] = useState<string>('all');

  // Filter matches based on user selection
  const filteredMatches = matches.filter((match) => {
    if (filterConfidence === 'high' && match.overallScore < 70) return false;
    if (filterConfidence === 'medium' && (match.overallScore < 50 || match.overallScore >= 70)) return false;

    if (selectedTargetItemId !== 'all') {
      if (match.lostItem.id !== selectedTargetItemId && match.foundItem.id !== selectedTargetItemId) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-800/80 border border-blue-700 text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Campus Intelligence Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Report Matching Hub
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our algorithm analyzes titles, descriptions, campus locations, and dates to identify pairs of lost and found belongings.
          </p>

          <div className="flex items-center gap-2 text-xs text-blue-200 pt-2">
            <Info className="w-4 h-4 text-sky-300 shrink-0" />
            <span>
              Disclaimer: Matches are algorithmic suggestions, not guaranteed ownership. Always verify distinctive details before meeting.
            </span>
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Matches:</span>
          
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterConfidence('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterConfidence === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              onClick={() => setFilterConfidence('high')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterConfidence === 'high'
                  ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Confidence (≥70%)
            </button>
            <button
              onClick={() => setFilterConfidence('medium')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterConfidence === 'medium'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Possible (50–69%)
            </button>
          </div>
        </div>

        {/* Filter by specific item */}
        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-500 font-medium">Focus Item:</label>
          <select
            value={selectedTargetItemId}
            onChange={(e) => setSelectedTargetItemId(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 outline-hidden max-w-xs truncate"
          >
            <option value="all">All Campus Items</option>
            {items
              .filter(i => i.status !== 'reunited')
              .map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.type.toUpperCase()}] {item.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              No matching pairs found for current filters
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching your confidence filter to "All Matches" or select a different item.
            </p>
          </div>
          <button
            onClick={() => {
              setFilterConfidence('all');
              setSelectedTargetItemId('all');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatches.map((match, idx) => {
            const lost = match.lostItem;
            const found = match.foundItem;
            const scoreColor =
              match.overallScore >= 75
                ? 'text-blue-700 bg-blue-50 border-blue-200'
                : 'text-amber-700 bg-amber-50 border-amber-200';

            return (
              <div
                key={`${lost.id}-${found.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:border-blue-300 transition-all"
              >
                {/* Match Score Header */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-lg border font-bold text-sm tabular-nums flex items-center gap-1.5 ${scoreColor}`}>
                      <Sparkles className="w-4 h-4" />
                      <span>{match.overallScore}% Match Likelihood</span>
                    </div>

                    <span className="text-xs font-semibold text-slate-600">
                      Suggestion #{idx + 1}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Category:</span>
                    <span>{lost.category}</span>
                  </div>
                </div>

                {/* Side-by-side Items Comparison */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Lost Item */}
                  <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-md shadow-2xs">
                        Reported Lost
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lost.date}
                      </span>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <ImageFallback
                          imageUrl={lost.imageUrl}
                          category={lost.category}
                          type={lost.type}
                          name={lost.name}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {lost.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {lost.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{lost.location}</span>
                      </div>
                      {lost.distinctiveFeatures && (
                        <div className="text-[11px] text-amber-900 bg-amber-100/60 px-2 py-1 rounded-md">
                          <span className="font-semibold">Note:</span> {lost.distinctiveFeatures}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectItem(lost)}
                      className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View Full Lost Report</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Right Column: Found Item */}
                  <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-md shadow-2xs">
                        Reported Found
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {found.date}
                      </span>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <ImageFallback
                          imageUrl={found.imageUrl}
                          category={found.category}
                          type={found.type}
                          name={found.name}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {found.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {found.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200/60 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{found.location}</span>
                      </div>
                      {found.distinctiveFeatures && (
                        <div className="text-[11px] text-blue-900 bg-blue-100/60 px-2 py-1 rounded-md">
                          <span className="font-semibold">Finder note:</span> {found.distinctiveFeatures}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectItem(found)}
                      className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View Full Found Report</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Explanation and Factor Breakdown */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        AI Reasoning & Explanation:
                      </h5>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                        {match.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Factor Progress Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px]">
                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Keywords / Text</span>
                        <span className="font-bold tabular-nums text-slate-700">{match.factors.textSimilarityScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${match.factors.textSimilarityScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Category</span>
                        <span className="font-bold tabular-nums text-slate-700">{match.factors.categoryScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${match.factors.categoryScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Location Cluster</span>
                        <span className="font-bold tabular-nums text-slate-700">{match.factors.locationScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${match.factors.locationScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>Time Proximity</span>
                        <span className="font-bold tabular-nums text-slate-700">{match.factors.dateProximityScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${match.factors.dateProximityScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
