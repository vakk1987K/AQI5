import { useState, useRef, useEffect } from 'react';
import { Wind, Search, MapPin, Navigation, RefreshCw, Smartphone, ShieldCheck, Check, Globe, ChevronDown } from 'lucide-react';
import { LocationData, Language } from '../types';
import { POPULAR_LOCATIONS, searchLocations } from '../services/weatherAqiService';
import { SUPPORTED_LANGUAGES, TranslationStrings } from '../i18n/translations';

interface HeaderProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onUseGeolocation: () => void;
  isLocating: boolean;
  tempUnit: 'C' | 'F';
  onToggleTempUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

export function Header({
  currentLocation,
  onSelectLocation,
  onUseGeolocation,
  isLocating,
  tempUnit,
  onToggleTempUnit,
  onRefresh,
  isRefreshing,
  currentLanguage,
  onSelectLanguage,
  t,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(POPULAR_LOCATIONS);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results.length > 0 ? results : POPULAR_LOCATIONS);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const currentLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-colors">
      {/* Top Banner: Prominent Multi-Language Identification & Quick Switcher */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Label indicating supported languages */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Languages / भाषा / భాష / भाषा / மொழி:</span>
            </span>
          </div>

          {/* Side-by-side visible language pills for instant identification & switching */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectLanguage(lang.code)}
                  id={`top-lang-pill-${lang.code}`}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/25 ring-2 ring-sky-300/60 scale-[1.02]'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80'
                  }`}
                  title={`Switch language to ${lang.label} (${lang.nativeName})`}
                  aria-label={`Select ${lang.label}`}
                >
                  <span className="text-sm leading-none">{lang.flag}</span>
                  <span className="font-semibold">{lang.nativeName}</span>
                  <span className={`text-[10px] hidden md:inline ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                    ({lang.label})
                  </span>
                  {isActive && <Check className="w-3 h-3 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand and App title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Wind className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  {t.appTitle}
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/80">
                  {t.appSubtitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="font-medium text-slate-200 truncate max-w-[170px] sm:max-w-xs">
                  {currentLocation.name}
                  {currentLocation.region ? `, ${currentLocation.region}` : ''}
                </span>
              </p>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Mobile Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1"
                title={t.languageSelect}
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{currentLangOption.flag}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-700/60">
                    {t.languageSelect}
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/80 transition ${
                        currentLanguage === lang.code ? 'bg-sky-500/15 text-sky-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onToggleTempUnit}
              id="mobile-unit-toggle-btn"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              °{tempUnit}
            </button>
          </div>
        </div>

        {/* Search bar & Controls */}
        <div className="flex items-center gap-2.5 flex-1 md:max-w-md lg:max-w-lg">
          <div className="relative flex-1" ref={dropdownRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={t.searchPlaceholder}
                id="location-search-input"
                className="w-full pl-9 pr-8 py-2 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition"
              />
              {isSearching && (
                <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>

            {/* Dropdown for search results */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                <div className="p-2 border-b border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  <span>{searchQuery.trim().length >= 2 ? t.searchResults : t.popularStations}</span>
                  <button
                    onClick={onUseGeolocation}
                    className="text-sky-400 hover:text-sky-300 normal-case font-normal flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" /> {t.useGps}
                  </button>
                </div>
                <div className="py-1">
                  {searchResults.map((loc, idx) => (
                    <button
                      key={`${loc.name}-${loc.latitude}-${idx}`}
                      onClick={() => handleSelect(loc)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-700/70 flex items-center justify-between text-sm transition"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-200">{loc.name}</span>
                        <span className="text-xs text-slate-400 truncate">
                          {loc.region ? `${loc.region}, ` : ''}{loc.country}
                        </span>
                      </div>
                      {loc.name === currentLocation.name && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current location GPS */}
          <button
            onClick={onUseGeolocation}
            id="gps-locate-btn"
            disabled={isLocating}
            title={t.useGps}
            aria-label={t.useGps}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center justify-center shrink-0"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse text-sky-400' : ''}`} />
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            id="refresh-data-btn"
            disabled={isRefreshing}
            title="Refresh AQI & Weather"
            aria-label="Refresh data"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center justify-center shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Desktop temperature unit switch */}
          <button
            onClick={onToggleTempUnit}
            id="desktop-unit-toggle-btn"
            title="Switch temperature unit"
            className="hidden md:flex px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition items-center justify-center shrink-0"
          >
            °{tempUnit}
          </button>

          {/* Desktop Language Selector */}
          <div className="hidden md:block relative" ref={langRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              id="desktop-language-selector-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
              title={t.languageSelect}
              aria-label={t.languageSelect}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentLangOption.flag}</span>
              <span className="font-medium">{currentLangOption.nativeName}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-700/60">
                  {t.languageSelect}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/80 transition ${
                      currentLanguage === lang.code ? 'bg-sky-500/15 text-sky-300 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">({lang.label})</span>
                    </div>
                    {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
