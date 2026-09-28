import React, { useState } from 'react';
import { Item, ActivePage, MatchResult } from '../types';
import { ItemCard } from '../components/ItemCard';
import { 
  Search, 
  PlusCircle, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Building
} from 'lucide-react';

interface HomeViewProps {
  items: Item[];
  matches: MatchResult[];
  onNavigate: (page: ActivePage) => void;
  onOpenReport: (initialType?: 'lost' | 'found') => void;
  onSelectItem: (item: Item) => void;
  onViewMatchesForItem: (item: Item) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  matches,
  onNavigate,
  onOpenReport,
  onSelectItem,
  onViewMatchesForItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');

  // Stats calculation
  const totalReports = items.length;
  const activeReports = items.filter(i => i.status !== 'reunited').length;
  const reunitedCount = items.filter(i => i.status === 'reunited').length;
  const highConfidenceMatches = matches.filter(m => m.overallScore >= 70).length;

  // Filter recently reported items
  const filteredRecentItems = items
    .filter(item => {
      if (typeFilter === 'lost' && item.type !== 'lost') return false;
      if (typeFilter === 'found' && item.type !== 'found') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .slice(0, 6);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 border border-blue-800/40 shadow-xl">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-800/60 border border-blue-700/60 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI-Assisted Campus Lost & Found System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
            Lost something on campus? We’ll help you find it.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Report lost belongings or items you’ve discovered around university halls. Our intelligent matching system cross-references descriptions, campus locations, and timestamps to reunite students with their property.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenReport('lost')}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={() => onOpenReport('found')}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </button>

            <button
              onClick={() => onNavigate('matches')}
              className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>View AI Matches ({matches.length})</span>
            </button>
          </div>

          {/* Quick Search Bar within Hero */}
          <div className="pt-4 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item name, AirPods, hydro flask, library..."
                className="w-full pl-10 pr-4 py-3 bg-white/95 text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400 shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Campus Metric Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {activeReports}
            </div>
            <div className="text-xs text-slate-400">Active Campus Reports</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-sky-400 tabular-nums">
              {matches.length}
            </div>
            <div className="text-xs text-slate-400">AI Match Suggestions</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
              {reunitedCount}
            </div>
            <div className="text-xs text-slate-400">Belongings Reunited</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              10
            </div>
            <div className="text-xs text-slate-400">Campus Drop-off Spots</div>
          </div>
        </div>
      </section>

      {/* AI Matches Highlight Banner */}
      {matches.length > 0 && (
        <section className="bg-blue-50 border border-blue-200/80 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {highConfidenceMatches > 0
                    ? `${highConfidenceMatches} High-Confidence AI Matches Found`
                    : `${matches.length} Potential Campus Matches Detected`}
                </h3>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-sm">
                  Active Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Our algorithm identified {matches[0].overallScore}% similarity between "{matches[0].lostItem.name}" and "{matches[0].foundItem.name}" at {matches[0].lostItem.location}.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('matches')}
            className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Review All {matches.length} Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* Recently Reported Items Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recently Reported Items
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates from student halls, libraries, and campus facilities.
            </p>
          </div>

          {/* Interactive filter control (allowed button group) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Recent ({items.length})
            </button>
            <button
              onClick={() => setTypeFilter('lost')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === 'lost'
                  ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost ({items.filter(i => i.type === 'lost').length})
            </button>
            <button
              onClick={() => setTypeFilter('found')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === 'found'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found ({items.filter(i => i.type === 'found').length})
            </button>
          </div>
        </div>

        {/* Item Cards Grid */}
        {filteredRecentItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">
              No matching items found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No reports match your search query "{searchQuery}". Try different keywords or report an item.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecentItems.map((item) => {
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

        <div className="flex justify-center pt-2">
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <span>View All {items.length} Campus Items</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </section>

      {/* Campus Drop-off Spot Guide */}
      <section className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Official Campus Lost & Found Desks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Items found unattended are frequently handed over to these central university service desks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('locations')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Building className="w-4 h-4" />
              <span>Central Library Desk</span>
            </div>
            <p className="text-xs text-slate-600">
              1st Floor Circulation counter. Electronics and personal items held for 30 days.
            </p>
            <div className="text-[11px] text-slate-400">
              Open Daily: 8:00 AM – 11:00 PM
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Building className="w-4 h-4" />
              <span>Student Union Info Hub</span>
            </div>
            <p className="text-xs text-slate-600">
              Main atrium concourse desk. Handles lost keys, IDs, wallets, and bags.
            </p>
            <div className="text-[11px] text-slate-400">
              Mon–Fri: 9:00 AM – 8:00 PM
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Building className="w-4 h-4" />
              <span>Campus Recreation Center</span>
            </div>
            <p className="text-xs text-slate-600">
              Equipment rental desk by basketball courts. Locker room and court recoveries.
            </p>
            <div className="text-[11px] text-slate-400">
              Mon–Sun: 6:00 AM – 10:00 PM
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
