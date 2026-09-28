import React, { useState } from 'react';
import { Item, MatchResult } from '../types';
import { ImageFallback } from './ImageFallback';
import { SafeContactModal } from './SafeContactModal';
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  Tag,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ItemDetailModalProps {
  item: Item;
  onClose: () => void;
  matches: MatchResult[];
  onSelectCandidate: (item: Item) => void;
  onToggleReunited: (item: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  matches,
  onSelectCandidate,
  onToggleReunited,
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';

  const formattedDate = new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
          {/* Top Bar of Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md text-white ${
                  isReunited
                    ? 'bg-emerald-600'
                    : isLost
                    ? 'bg-amber-500'
                    : 'bg-blue-600'
                }`}
              >
                {isReunited ? 'Reunited on Campus' : isLost ? 'Reported Lost' : 'Reported Found'}
              </span>
              <span className="text-xs text-slate-500">
                Item ID: <span className="font-mono text-slate-700">{item.id}</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Visual & Key Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <ImageFallback
                  imageUrl={item.imageUrl}
                  category={item.category}
                  type={item.type}
                  name={item.name}
                  className="w-full h-56"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{item.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formattedDate}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h2>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">General Zone: </span>
                      {item.location}
                      {item.specificLocation && (
                        <p className="text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-700">Specific spot:</span> {item.specificLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">Reported by: </span>
                      {item.contact.name} ({item.contact.affiliation || 'Campus Member'})
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col gap-2 pt-1">
                  {!isReunited ? (
                    <>
                      <button
                        onClick={() => setShowContactModal(true)}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact {isLost ? 'Owner' : 'Finder'} Safely</span>
                      </button>
                      <button
                        onClick={() => onToggleReunited(item)}
                        className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Mark Item as Reunited</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>This item has been successfully reunited with its owner!</span>
                      </div>
                      <button
                        onClick={() => onToggleReunited(item)}
                        className="text-emerald-700 underline text-[11px] hover:text-emerald-900"
                      >
                        Reopen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Distinctive Features */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Detailed Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {item.description}
                </p>
              </div>

              {item.distinctiveFeatures && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg">
                  <h4 className="text-xs font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
                    <Tag className="w-3.5 h-3.5 text-amber-700" />
                    Distinctive Identifying Markings
                  </h4>
                  <p className="text-xs text-amber-950">
                    {item.distinctiveFeatures}
                  </p>
                </div>
              )}
            </div>

            {/* AI Matching Feature Section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Possible AI Matches on Campus
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      AI heuristic comparison against opposing reports. Results are suggestions, not confirmed matches.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                  {matches.length} Suggestion{matches.length === 1 ? '' : 's'}
                </span>
              </div>

              {matches.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No high-probability counterpart reports detected yet. We'll continue matching against newly submitted reports.
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => {
                    const candidate = isLost ? match.foundItem : match.lostItem;
                    return (
                      <div
                        key={candidate.id}
                        className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-900 bg-white border border-blue-200 px-2 py-0.5 rounded-md">
                              {match.overallScore}% Match
                            </span>
                            <span className="text-xs font-semibold text-slate-800">
                              {candidate.name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-semibold text-slate-700">Reasoning: </span>
                            {match.explanation}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span>{candidate.location}</span>
                            <span>·</span>
                            <span>{candidate.date}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectCandidate(candidate)}
                          className="shrink-0 px-3 py-1.5 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>Compare Item</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Free campus utility · No login required
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {showContactModal && (
        <SafeContactModal item={item} onClose={() => setShowContactModal(false)} />
      )}
    </>
  );
};
