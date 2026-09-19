import { MapPin } from 'lucide-react';
import { LocationData } from '../types';
import { POPULAR_LOCATIONS } from '../services/weatherAqiService';
import { TranslationStrings } from '../i18n/translations';

interface CityPillsProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  t: TranslationStrings;
}

export function CityPills({ currentLocation, onSelectLocation, t }: CityPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
        <MapPin className="w-3 h-3 text-slate-400" /> {t.popularStations}:
      </span>
      {POPULAR_LOCATIONS.map((loc) => {
        const isSelected = loc.name === currentLocation.name;
        return (
          <button
            key={loc.name}
            onClick={() => onSelectLocation(loc)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition shrink-0 ${
              isSelected
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            {loc.name}
          </button>
        );
      })}
    </div>
  );
}
