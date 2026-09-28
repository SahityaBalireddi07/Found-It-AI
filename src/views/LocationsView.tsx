import React from 'react';
import { Item } from '../types';
import { CAMPUS_LOCATIONS } from '../data/sampleItems';
import { 
  Building, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface LocationsViewProps {
  items: Item[];
  onFilterByLocation: (location: string) => void;
  onOpenReport: () => void;
}

interface CampusSpot {
  name: string;
  building: string;
  room: string;
  hours: string;
  phone: string;
  description: string;
  recommendedFor: string;
}

const SPOT_DETAILS: Record<string, CampusSpot> = {
  'Central Library': {
    name: 'Central Library Circulation & Lost Property Desk',
    building: 'Main Quadrangle',
    room: '1st Floor Main Atrium',
    hours: 'Mon–Sun: 7:30 AM – 11:30 PM',
    phone: '(555) 019-4400',
    description: 'Central collection point for all materials found in study halls, stacks, computer labs, and cafe areas.',
    recommendedFor: 'Electronics, textbooks, notebooks, glasses, chargers.',
  },
  'Student Union & Food Court': {
    name: 'Student Union Information Services Hub',
    building: 'Student Life Center',
    room: 'Main Concourse Desk (Level 1)',
    hours: 'Mon–Fri: 8:00 AM – 9:00 PM · Sat–Sun: 10:00 AM – 6:00 PM',
    phone: '(555) 014-2211',
    description: 'Busiest hub on campus. Handles high volumes of dining hall drop-offs, event items, and club room belongings.',
    recommendedFor: 'IDs, keys, wallets, hydro flasks, backpacks, jackets.',
  },
  'Science & Engineering Hall': {
    name: 'STEM Academic Support Desk',
    building: 'Science Complex West',
    room: 'Room 210 (Main Dept Office)',
    hours: 'Mon–Fri: 8:30 AM – 5:00 PM',
    phone: '(555) 018-9902',
    description: 'Holds items found in lecture halls 101-105, chemistry/physics wet labs, and computing centers.',
    recommendedFor: 'Calculators, lab goggles, USB drives, laptops, class notes.',
  },
  'Campus Recreation & Gym': {
    name: 'Recreation Equipment & Safety Desk',
    building: 'Athletic Center',
    room: 'Front Lobby Entrance',
    hours: 'Mon–Fri: 6:00 AM – 11:00 PM · Sat–Sun: 8:00 AM – 8:00 PM',
    phone: '(555) 017-3320',
    description: 'Lockers, fitness center, basketball court, and pool area recoveries.',
    recommendedFor: 'Car keys with gym tags, water bottles, sports apparel, headphones.',
  },
  'North Quad & Dining Hall': {
    name: 'North Dining Management Office',
    building: 'North Commons',
    room: 'Cashier Station 1',
    hours: 'Daily: 7:00 AM – 9:00 PM',
    phone: '(555) 012-7711',
    description: 'Covers the north residence quad lawn, pathway benches, and dining hall seating.',
    recommendedFor: 'Student meal cards, dorm room keys, umbrellas, hats.',
  },
};

export const LocationsView: React.FC<LocationsViewProps> = ({
  items,
  onFilterByLocation,
  onOpenReport,
}) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Drop-off & Retrieval Desks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official secure locations where found items are held by university staff.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          + File a New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAMPUS_LOCATIONS.map((loc) => {
          const detail = SPOT_DETAILS[loc] || {
            name: `${loc} Information Station`,
            building: loc,
            room: 'Main Desk',
            hours: 'Mon–Fri: 9:00 AM – 5:00 PM',
            phone: '(555) 010-0000',
            description: 'Campus facility desk assisting students with lost and found property.',
            recommendedFor: 'General belongings.',
          };

          const itemsAtLocation = items.filter(
            (i) => i.location.toLowerCase() === loc.toLowerCase()
          );

          return (
            <div
              key={loc}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:border-blue-300 shadow-2xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {detail.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {detail.building} · {detail.room}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums shrink-0">
                    {itemsAtLocation.length} report{itemsAtLocation.length === 1 ? '' : 's'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {detail.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{detail.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{detail.phone}</span>
                  </div>
                </div>

                <div className="text-[11px] text-blue-800 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                  <span className="font-semibold">Common items turned in here: </span>
                  {detail.recommendedFor}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onFilterByLocation(loc)}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Browse Items at {loc} ({itemsAtLocation.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
