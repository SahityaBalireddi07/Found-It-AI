import React, { useState, useEffect, useMemo } from 'react';
import { Item, ActivePage, ItemType, MatchResult } from './types';
import { loadItemsFromStorage, saveItemsToStorage, resetToSampleData } from './utils/storage';
import { findAllCampusMatches, findMatchesForItem } from './utils/aiMatching';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { BrowseView } from './views/BrowseView';
import { ReportView } from './views/ReportView';
import { AIMatchHubView } from './views/AIMatchHubView';
import { LocationsView } from './views/LocationsView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AIChatWidget } from './components/AIChatWidget';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<Item[]>(() => loadItemsFromStorage());
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [reportInitialType, setReportInitialType] = useState<ItemType>('lost');
  
  // Selected item for modal
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute all campus matches whenever items change
  const matches = useMemo(() => {
    return findAllCampusMatches(items);
  }, [items]);

  // Sync to storage on state change
  const updateItems = (newItems: Item[]) => {
    setItems(newItems);
    saveItemsToStorage(newItems);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Open Report Page/View with specific initial type
  const handleOpenReport = (type: ItemType = 'lost') => {
    setReportInitialType(type);
    setActivePage('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle new item report submission
  const handleSubmitReport = (newItem: Item): MatchResult[] => {
    const updated = [newItem, ...items];
    updateItems(updated);
    
    // Calculate immediate matches for this new item
    const instantMatches = findMatchesForItem(newItem, updated);
    showToast(
      instantMatches.length > 0
        ? `Report published! AI found ${instantMatches.length} potential match suggestion(s).`
        : 'Report published to the campus directory.'
    );
    return instantMatches;
  };

  // Toggle reunited status
  const handleToggleReunited = (itemToToggle: Item) => {
    const isNowReunited = itemToToggle.status !== 'reunited';
    const updated = items.map((i) => {
      if (i.id === itemToToggle.id) {
        return {
          ...i,
          status: isNowReunited ? ('reunited' as const) : ('active' as const),
        };
      }
      return i;
    });

    updateItems(updated);
    if (selectedItem?.id === itemToToggle.id) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              status: isNowReunited ? 'reunited' : 'active',
            }
          : null
      );
    }

    showToast(
      isNowReunited
        ? `Item "${itemToToggle.name}" has been marked as Reunited!`
        : `Item "${itemToToggle.name}" reopened as Active.`
    );
  };

  // Reset to original campus sample items
  const handleResetData = () => {
    const reset = resetToSampleData();
    setItems(reset);
    showToast('Campus reports reset to default sample dataset.');
  };

  // Navigate to Browse with location filter
  const handleFilterByLocation = (location: string) => {
    setActivePage('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute matches for currently selected item in modal
  const selectedItemMatches = useMemo(() => {
    if (!selectedItem) return [];
    return findMatchesForItem(selectedItem, items);
  }, [selectedItem, items]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        matchesCount={matches.length}
        totalActiveCount={items.filter((i) => i.status !== 'reunited').length}
        onOpenReportModal={handleOpenReport}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'home' && (
          <HomeView
            items={items}
            matches={matches}
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReport={handleOpenReport}
            onSelectItem={(item) => setSelectedItem(item)}
            onViewMatchesForItem={(item) => setSelectedItem(item)}
          />
        )}

        {activePage === 'browse' && (
          <BrowseView
            items={items}
            matches={matches}
            onSelectItem={(item) => setSelectedItem(item)}
            onViewMatchesForItem={(item) => setSelectedItem(item)}
            onOpenReport={() => handleOpenReport('lost')}
          />
        )}

        {activePage === 'report' && (
          <ReportView
            initialType={reportInitialType}
            onSubmitReport={handleSubmitReport}
            onViewItem={(item) => {
              setSelectedItem(item);
              setActivePage('browse');
            }}
            onCancel={() => setActivePage('browse')}
          />
        )}

        {activePage === 'matches' && (
          <AIMatchHubView
            items={items}
            matches={matches}
            onSelectItem={(item) => setSelectedItem(item)}
            onOpenReport={() => handleOpenReport('lost')}
          />
        )}

        {activePage === 'locations' && (
          <LocationsView
            items={items}
            onFilterByLocation={handleFilterByLocation}
            onOpenReport={() => handleOpenReport('found')}
          />
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          matches={selectedItemMatches}
          onSelectCandidate={(candidate) => setSelectedItem(candidate)}
          onToggleReunited={handleToggleReunited}
        />
      )}

      {/* Campus Footer */}
      <Footer
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetData={handleResetData}
      />

      {/* Floating n8n AI Chat Assistant */}
      <AIChatWidget items={items} />
    </div>
  );
}
