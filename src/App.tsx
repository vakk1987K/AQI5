import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CityPills } from './components/CityPills';
import { AqiGauge } from './components/AqiGauge';
import { WeatherSummary } from './components/WeatherSummary';
import { PollutantsGrid } from './components/PollutantsGrid';
import { HealthAdvisories } from './components/HealthAdvisories';
import { HourlyAndDailyForecast } from './components/HourlyAndDailyForecast';
import { RainForecastBanner } from './components/RainForecastBanner';
import { PlayConsoleHub } from './components/PlayConsoleHub';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AqiScaleModal } from './components/AqiScaleModal';
import { GovernmentDisclaimerModal } from './components/GovernmentDisclaimerModal';
import { FullAQIData, LocationData, ClosedTester, Language } from './types';
import { POPULAR_LOCATIONS, fetchFullAQIData, getFallbackAQIData } from './services/weatherAqiService';
import { getTranslation } from './i18n/translations';
import { ShieldCheck, Sparkles, Smartphone, ArrowRight, Heart, Landmark } from 'lucide-react';

const INITIAL_TESTERS: ClosedTester[] = [
  { id: '1', name: 'Marcus Vance', email: 'marcus.vance88@gmail.com', status: 'invited', invitedAt: '2026-09-14' },
  { id: '2', name: 'Elena Rostova', email: 'elena.rostova@gmail.com', status: 'invited', invitedAt: '2026-09-14' },
  { id: '3', name: 'David Chen', email: 'chen.david.aqi@gmail.com', status: 'invited', invitedAt: '2026-09-14' },
  { id: '4', name: 'Sarah Jenkins', email: 'sarah.j.runner@gmail.com', status: 'invited', invitedAt: '2026-09-14' },
  { id: '5', name: 'Tariq Al-Mansoor', email: 'tariq.mansoor.dev@gmail.com', status: 'invited', invitedAt: '2026-09-15' },
  { id: '6', name: 'Chloe Dubois', email: 'chloe.dubois75@gmail.com', status: 'invited', invitedAt: '2026-09-15' },
  { id: '7', name: 'Kenji Takahashi', email: 'kenji.tokyo.test@gmail.com', status: 'invited', invitedAt: '2026-09-15' },
  { id: '8', name: 'Priya Sharma', email: 'priya.s.delhi@gmail.com', status: 'invited', invitedAt: '2026-09-15' },
  { id: '9', name: 'Liam O’Connor', email: 'liam.oconnor.aus@gmail.com', status: 'invited', invitedAt: '2026-09-16' },
  { id: '10', name: 'Sofia Rodriguez', email: 'sofia.rodriguez.test@gmail.com', status: 'invited', invitedAt: '2026-09-16' },
  { id: '11', name: 'Lukas Meyer', email: 'lukas.meyer.berlin@gmail.com', status: 'invited', invitedAt: '2026-09-16' },
  { id: '12', name: 'Amara Nwosu', email: 'amara.nwosu.test@gmail.com', status: 'invited', invitedAt: '2026-09-16' },
];

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationData>(POPULAR_LOCATIONS[0]);
  const [aqiData, setAqiData] = useState<FullAQIData>(() => getFallbackAQIData(POPULAR_LOCATIONS[0]));
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('aqi_preferred_language');
      if (saved && ['en', 'hi', 'te', 'mr', 'ta', 'es'].includes(saved)) {
        return saved as Language;
      }
    } catch {}
    return 'en';
  });

  const t = getTranslation(language);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('aqi_preferred_language', lang);
    } catch {}
  };

  // Modals & Hubs
  const [isPlayConsoleOpen, setIsPlayConsoleOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isAqiScaleOpen, setIsAqiScaleOpen] = useState(false);
  const [isGovDisclaimerOpen, setIsGovDisclaimerOpen] = useState(false);

  // Closed testers management
  const [testers, setTesters] = useState<ClosedTester[]>(() => {
    try {
      const saved = localStorage.getItem('aqi_testers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TESTERS;
  });

  const optedInCount = testers.filter((t) => t.status === 'opted_in' || t.status === 'active_testing').length;

  const loadData = useCallback(async (loc: LocationData, isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await fetchFullAQIData(loc);
      setAqiData(data);
    } catch (err) {
      console.error('Failed to load data', err);
      setAqiData(getFallbackAQIData(loc));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(currentLocation);
  }, [currentLocation, loadData]);

  const handleSelectLocation = (loc: LocationData) => {
    setCurrentLocation(loc);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc: LocationData = {
          name: 'Current Location',
          region: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
          country: 'Local Device GPS',
          latitude,
          longitude,
        };
        setCurrentLocation(loc);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed or denied', err);
        setIsLocating(false);
        alert('Could not access current location. Please select a city manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleToggleTempUnit = () => {
    setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleToggleTesterOptIn = (id: string) => {
    setTesters((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const isOpted = t.status === 'opted_in' || t.status === 'active_testing';
          return {
            ...t,
            status: isOpted ? ('invited' as const) : ('opted_in' as const),
            optedInAt: isOpted ? undefined : new Date().toISOString().slice(0, 10),
          };
        }
        return t;
      });
      try {
        localStorage.setItem('aqi_testers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAddTester = (name: string, email: string) => {
    const newTester: ClosedTester = {
      id: Date.now().toString(),
      name,
      email,
      status: 'invited',
      invitedAt: new Date().toISOString().slice(0, 10),
    };
    setTesters((prev) => {
      const updated = [...prev, newTester];
      try {
        localStorage.setItem('aqi_testers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        onUseGeolocation={handleGeolocation}
        isLocating={isLocating}
        tempUnit={tempUnit}
        onToggleTempUnit={handleToggleTempUnit}
        onRefresh={() => loadData(currentLocation, true)}
        isRefreshing={isRefreshing}
        onOpenPlayConsoleHub={() => setIsPlayConsoleOpen(true)}
        optedInCount={optedInCount}
        currentLanguage={language}
        onSelectLanguage={handleSelectLanguage}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick city selection pills */}
        <CityPills
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          t={t}
        />

        {/* Primary Dashboard Grid: AQI Gauge + Live Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col">
            <AqiGauge
              aqi={aqiData.aqi}
              levelInfo={aqiData.levelInfo}
              dominantPollutant={aqiData.dominantPollutant}
              stationName={aqiData.stationName}
              lastUpdated={aqiData.lastUpdated}
              isLiveApi={aqiData.isLiveApi}
              onOpenInfoModal={() => setIsAqiScaleOpen(true)}
              t={t}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <WeatherSummary
              weather={aqiData.weather}
              tempUnit={tempUnit}
              t={t}
            />
          </div>
        </div>

        {/* Health & Lifestyle Advisories */}
        <HealthAdvisories
          levelInfo={aqiData.levelInfo}
          aqi={aqiData.aqi}
          t={t}
        />

        {/* Atmospheric Pollutants Breakdown (PM2.5, PM10, O3, NO2, SO2, CO) */}
        <PollutantsGrid
          pollutants={aqiData.pollutants}
          t={t}
        />

        {/* Rain Radar, Precipitation Forecast & Smart Notification Alert */}
        <RainForecastBanner
          rainForecast={aqiData.rainForecast}
          location={currentLocation}
          t={t}
        />

        {/* 24-Hour and 7-Day Forecast */}
        <HourlyAndDailyForecast
          hourly={aqiData.hourly}
          daily={aqiData.daily}
          tempUnit={tempUnit}
          t={t}
        />

        {/* Release & Policy Action Card (Quick in-app CTA) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Google Play Production Readiness Status
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  {optedInCount} of 12 Testers Opted In
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                Track your 14-day closed test window, recruit required testers, access pre-written production questionnaire answers, and resolve policy status for <code className="text-sky-300 font-mono">app.vercel.aqi_app3.twa</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsGovDisclaimerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition flex items-center gap-1.5"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Gov Disclaimer</span>
            </button>
            <button
              onClick={() => setIsPrivacyPolicyOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setIsPlayConsoleOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <span>Play Console Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Non-Government Entity Official Transparency Notice */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>Non-Government Entity Notice:</strong> AQI-App is an independent application and does not represent or affiliate with any government agency or the US EPA. Atmospheric indices are calculated from public technical documentation.
            </p>
          </div>
          <button
            onClick={() => setIsGovDisclaimerOpen(true)}
            className="text-[11px] text-sky-400 hover:text-sky-300 whitespace-nowrap font-medium transition underline underline-offset-2 shrink-0"
          >
            View Official Sources (.gov) & Disclaimer
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AQI-App: Air Quality & Weather</span>
            <span>•</span>
            <span>Independent Weather & AQI Service</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGovDisclaimerOpen(true)}
              className="hover:text-amber-300 transition text-amber-400/90"
            >
              Government Disclaimer & Sources (.gov)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPrivacyPolicyOpen(true)}
              className="hover:text-slate-200 transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAqiScaleOpen(true)}
              className="hover:text-slate-200 transition"
            >
              EPA AQI Scale
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPlayConsoleOpen(true)}
              className="hover:text-amber-300 text-amber-400 font-semibold transition"
            >
              Testing Hub ({optedInCount}/12)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PlayConsoleHub
        isOpen={isPlayConsoleOpen}
        onClose={() => setIsPlayConsoleOpen(false)}
        testers={testers}
        onToggleTesterOptIn={handleToggleTesterOptIn}
        onAddTester={handleAddTester}
        onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />

      <AqiScaleModal
        isOpen={isAqiScaleOpen}
        onClose={() => setIsAqiScaleOpen(false)}
        t={t}
      />

      <GovernmentDisclaimerModal
        isOpen={isGovDisclaimerOpen}
        onClose={() => setIsGovDisclaimerOpen(false)}
      />
    </div>
  );
}
