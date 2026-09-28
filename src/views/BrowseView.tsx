import React, { useState, useMemo } from 'react';
import { Item, ItemType, ItemCategory, MatchResult } from '../types';
import { CAMPUS_LOCATIONS, ITEM_CATEGORIES } from '../data/sampleItems';
import { ItemCard } from '../components/ItemCard';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Sparkles, 
  ArrowUpDown, 
  AlertCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

interface BrowseViewProps {
  items: Item[];
  matches: MatchResult[];
  onSelectItem: (item: Item) => void;
  onViewMatchesForItem: (item: Item) => void;
  onOpenReport: () => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  items,
  matches,
  onSelectItem,
  onViewMatchesForItem,
  onOpenReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found' | 'reunited'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'matches'>('newest');

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Status & Type filter
        if (selectedType === 'lost' && (item.type !== 'lost' || item.status === 'reunited')) return false;
        if (selectedType === 'found' && (item.type !== 'found' || item.status === 'reunited')) return false;
        if (selectedType === 'reunited' && item.status !== 'reunited') return false;

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

        // Location filter
        if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchDistinctive = (item.distinctiveFeatures || '').toLowerCase().includes(q);
          return matchTitle || matchDesc || matchLoc || matchCat || matchDistinctive;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'matches') {
          const matchesA = matches.filter(m => m.lostItem.id === a.id || m.foundItem.id === a.id);
          const matchesB = matches.filter(m => m.lostItem.id === b.id || m.foundItem.id === b.id);
          const topScoreA = matchesA[0]?.overallScore || 0;
          const topScoreB = matchesB[0]?.overallScore || 0;
          return topScoreB - topScoreA;
        }
        // Default newest
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [items, matches, searchQuery, selectedType, selectedCategory, selectedLocation, sortBy]);

  const activeFilterCount =
    (selectedType !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Item Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and review active lost and found reports submitted across campus.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report Item</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        {/* Row 1: Search input and Segmented Type Control */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. AirPods, Hydro Flask, keys, jacket)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Segmented type buttons */}
          <div className="lg:col-span-6 flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === 'lost'
                  ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost ({items.filter(i => i.type === 'lost' && i.status !== 'reunited').length})
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === 'found'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found ({items.filter(i => i.type === 'found' && i.status !== 'reunited').length})
            </button>
            <button
              onClick={() => setSelectedType('reunited')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === 'reunited'
                  ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reunited ({items.filter(i => i.status === 'reunited').length})
            </button>
          </div>
        </div>

        {/* Row 2: Category, Location, Sort dropdowns and Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg focus:ring-1 focus:ring-blue-500 outline-hidden"
            >
              <option value="all">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Campus Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg focus:ring-1 focus:ring-blue-500 outline-hidden"
            >
              <option value="all">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg focus:ring-1 focus:ring-blue-500 outline-hidden"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="matches">AI Match Likelihood</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetAllFilters}
              disabled={activeFilterCount === 0}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Directory Count and Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <span className="font-bold text-slate-800 tabular-nums">{filteredItems.length}</span> of{' '}
          <span className="tabular-nums">{items.length}</span> total items
        </span>
        {activeFilterCount > 0 && (
          <span className="text-blue-600 font-medium">
            {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''} applied
          </span>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              No reports match your filters
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category, location, or search keywords. You can also file a new report if your item is missing.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={onOpenReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + File a New Report
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemMatches = matches.filter(
              m => m.lostItem.id === item.id || m.foundItem.id === item.id
            );
            return (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                onViewMatches={onViewMatchesForItem}
                matches={itemMatches}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
