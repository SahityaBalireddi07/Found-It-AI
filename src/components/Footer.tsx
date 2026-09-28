import React from 'react';
import { ShieldCheck, MapPin, RefreshCw, HelpCircle } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onResetData }) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-base font-bold text-slate-900 tracking-tight block">
              Lost & Found AI
            </span>
            <p className="text-slate-500 text-xs leading-relaxed">
              Student-first lost property network designed for college campuses. Connecting lost belongings with their rightful owners using intelligent heuristic matching.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 text-xs uppercase tracking-wider block">
              Quick Navigation
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-600 transition-colors text-slate-600"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse')}
                  className="hover:text-blue-600 transition-colors text-slate-600"
                >
                  Browse Reported Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('matches')}
                  className="hover:text-blue-600 transition-colors text-slate-600"
                >
                  AI Match Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locations')}
                  className="hover:text-blue-600 transition-colors text-slate-600"
                >
                  Campus Drop-off Spots
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 text-xs uppercase tracking-wider block">
              Campus Safety Guidelines
            </span>
            <ul className="space-y-1.5 text-xs text-slate-500 leading-normal">
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Meet in well-lit public campus hubs (Library, Union, Campus Police desk).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Ask claimant to describe hidden stickers or unlock devices before handover.</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <span className="font-semibold text-slate-900 text-xs uppercase tracking-wider block">
              Demo Environment
            </span>
            <p className="text-slate-500 text-xs">
              Data is stored securely in your browser's local storage. No student credentials required for demo access.
            </p>
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Reports</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© 2026 Lost & Found AI · University Student Project</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Student Privacy Protected</span>
            <span>·</span>
            <span>Local Storage Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
