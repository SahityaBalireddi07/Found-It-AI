import React, { useState } from 'react';
import { Item, ItemType, ItemCategory, MatchResult } from '../types';
import { CAMPUS_LOCATIONS, ITEM_CATEGORIES } from '../data/sampleItems';
import { 
  PlusCircle, 
  Upload, 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  MapPin,
  Tag,
  ArrowRight
} from 'lucide-react';

interface ReportViewProps {
  initialType?: ItemType;
  onSubmitReport: (newItem: Item) => MatchResult[];
  onViewItem: (item: Item) => void;
  onCancel: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  initialType = 'lost',
  onSubmitReport,
  onViewItem,
  onCancel,
}) => {
  const [type, setType] = useState<ItemType>(initialType);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [specificLocation, setSpecificLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Contact details
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'email' | 'phone' | 'in_app'>('email');
  const [affiliation, setAffiliation] = useState<'Undergraduate' | 'Graduate' | 'Faculty' | 'Staff' | 'Campus Guest'>('Undergraduate');

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<Item | null>(null);
  const [detectedMatches, setDetectedMatches] = useState<MatchResult[]>([]);

  // Handle image upload from computer
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be under 4MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
        setErrors(prev => {
          const next = { ...prev };
          delete next.image;
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide an item title.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Title should be at least 3 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe the item (color, model, condition).';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Please provide a bit more detail (at least 10 characters).';
    }

    if (!location.trim()) {
      newErrors.location = 'Please select a campus location.';
    }

    if (!date) {
      newErrors.date = 'Please specify the date.';
    }

    if (!contactName.trim()) {
      newErrors.contactName = 'Please enter your name.';
    }

    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Please enter your email.';
    } else if (!contactEmail.includes('@')) {
      newErrors.contactEmail = 'Please provide a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newItem: Item = {
      id: `item-${Date.now().toString().slice(-6)}`,
      type,
      name: name.trim(),
      category,
      location: location.trim(),
      specificLocation: specificLocation.trim() || undefined,
      date,
      description: description.trim(),
      distinctiveFeatures: distinctiveFeatures.trim() || undefined,
      imageUrl: imageUrl || undefined,
      status: 'active',
      contact: {
        name: contactName.trim(),
        email: contactEmail.trim(),
        phone: contactPhone.trim() || undefined,
        preferredMethod,
        affiliation,
      },
      createdAt: Date.now(),
    };

    // Simulate quick processing
    setTimeout(() => {
      const instantMatches = onSubmitReport(newItem);
      setSubmittedItem(newItem);
      setDetectedMatches(instantMatches);
      setIsSubmitting(false);
    }, 400);
  };

  if (submittedItem) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">
              Report Submitted Successfully!
            </h2>
            <p className="text-xs text-slate-500">
              Your {submittedItem.type === 'lost' ? 'lost item report' : 'found item report'} is now active across campus.
            </p>
          </div>

          {/* AI Instant Match Feedback */}
          {detectedMatches.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  AI Match Engine Alert
                </h3>
              </div>
              <p className="text-xs text-blue-900">
                We detected <span className="font-bold">{detectedMatches.length} possible matching report{detectedMatches.length > 1 ? 's' : ''}</span> already on file!
              </p>

              <div className="space-y-2 pt-1">
                {detectedMatches.slice(0, 2).map((match) => {
                  const candidate = submittedItem.type === 'lost' ? match.foundItem : match.lostItem;
                  return (
                    <div
                      key={candidate.id}
                      className="p-3 bg-white rounded-lg border border-blue-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">
                          {candidate.name} ({match.overallScore}% match)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {candidate.location} · {candidate.date}
                        </div>
                      </div>
                      <button
                        onClick={() => onViewItem(candidate)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700"
                      >
                        Inspect
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 text-left flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">AI Background Scanner:</span> No immediate counterpart was found right now, but our heuristic algorithm will continuously scan any new reports filed by students or campus desks.
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onViewItem(submittedItem)}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              View Your Item Card
            </button>
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Report a Campus Item
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the details below. Our AI matching model will cross-check existing reports immediately.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* Step 1: Type Selection (Segmented Control) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            1. Report Category
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                type === 'lost'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>I Lost Something</span>
            </button>

            <button
              type="button"
              onClick={() => setType('found')}
              className={`py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                type === 'found'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>I Found Something</span>
            </button>
          </div>
        </div>

        {/* Step 2: Item Information */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            2. Item Information
          </label>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Name / Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apple AirPods Pro in White Case, TI-84 Calculator, Navy Hydro Flask"
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date {type === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Location / Building <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Spot (Optional)
              </label>
              <input
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g. 3rd Floor quiet cubicle, Table 4 near cafe, Room 204"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Visual Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, brand, condition, stickers, contents, or circumstances..."
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden resize-none ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Distinctive Features / Ownership Verification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Distinctive Markings (Optional Secret Verification)
            </label>
            <input
              type="text"
              value={distinctiveFeatures}
              onChange={(e) => setDistinctiveFeatures(e.target.value)}
              placeholder="e.g. Scratched initial 'M' on bottom, Yosemite sticker on lid, orange lanyard"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Helps our AI algorithm distinguish your item from identical models and verify rightful ownership.
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Photo (Optional)
            </label>
            {imageUrl ? (
              <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden group">
                <img
                  src={imageUrl}
                  alt="Item preview"
                  className="w-48 h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center cursor-pointer space-y-1"
                >
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    Upload an item photo from device
                  </span>
                  <span className="text-[11px] text-slate-400">
                    PNG, JPG up to 4MB. If not provided, a category visual is used automatically.
                  </span>
                </label>
              </div>
            )}
            {errors.image && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Step 3: Contact Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            3. Contact Information (For Secure Inquiries)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Maya Lin or Library Desk"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                  errors.contactName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.contactName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. yourname@campus.edu"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-hidden ${
                  errors.contactEmail ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.contactEmail && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.contactEmail}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. (555) 234-8901"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Affiliation
              </label>
              <select
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Graduate">Graduate Student</option>
                <option value="Faculty">Faculty / Professor</option>
                <option value="Staff">Campus Staff / Facility Desk</option>
                <option value="Campus Guest">Visitor / Guest</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Privacy First:</span> Direct phone numbers and emails are only shared when you choose to respond to a student inquiry.
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Publishing & running AI check...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>Publish Report & Scan Matches</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
