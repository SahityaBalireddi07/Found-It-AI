import React, { useState } from 'react';
import { ActivePage } from '../types';
import { Sparkles, Menu, X, PlusCircle, Compass } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  matchesCount: number;
  totalActiveCount: number;
  onOpenReportModal?: (type?: 'lost' | 'found') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  matchesCount,
  onOpenReportModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand Zone */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-blue-700 transition-colors">
              LF
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Lost & Found AI
              </span>
            </div>
          </button>

          {/* Zone 2: Clean text navigation links (single line, no pill badges) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${
                activePage === 'home' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('browse')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${
                activePage === 'browse' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => handleNavClick('matches')}
              className={`relative hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activePage === 'matches' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <span>AI Matches</span>
              {matchesCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 rounded-sm">
                  {matchesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('locations')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${
                activePage === 'locations' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Campus Spots
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenReportModal) {
                  onOpenReportModal();
                } else {
                  handleNavClick('report');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePage === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('browse')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePage === 'browse' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Browse Items
          </button>
          <button
            onClick={() => handleNavClick('matches')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
              activePage === 'matches' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>AI Matches</span>
            {matchesCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-sm">
                {matchesCount} found
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('locations')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePage === 'locations' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Campus Spots
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenReportModal) {
                  onOpenReportModal();
                } else {
                  handleNavClick('report');
                }
              }}
              className="w-full text-center px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              + File a New Report
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
