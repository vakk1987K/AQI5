import { useState, useEffect } from 'react';
import { CloudRain, Bell, BellOff, BellRing, Droplets, Clock, Umbrella, AlertCircle, CheckCircle2, Volume2 } from 'lucide-react';
import { RainForecastInfo, LocationData } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface RainForecastBannerProps {
  rainForecast?: RainForecastInfo;
  location: LocationData;
  t: TranslationStrings;
}

export function RainForecastBanner({ rainForecast, location, t }: RainForecastBannerProps) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [activePopupAlert, setActivePopupAlert] = useState<{
    id: string;
    title: string;
    body: string;
    type: 'rain_now' | 'rain_upcoming' | 'test';
    timestamp: string;
  } | null>(null);

  // Sync notification permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Whenever rain status changes and is urgent, display or trigger popup
  useEffect(() => {
    if (!rainForecast) return;

    if (rainForecast.isRainingNow) {
      // Auto pop up notification banner for active rainfall
      setActivePopupAlert({
        id: `rain-${Date.now()}`,
        title: `🌧️ ${t.rainForecast.notificationAlertTitle}: ${location.name}`,
        body: `${t.rainForecast.rainingNow}! Precipitation: ${rainForecast.currentPrecipitationMm}mm/hr. Don't forget an umbrella!`,
        type: 'rain_now',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else if (rainForecast.nextRainHoursAway !== null && rainForecast.nextRainHoursAway <= 2) {
      // Auto pop up notification banner for rain in next 1-2 hours
      setActivePopupAlert({
        id: `rain-upcoming-${Date.now()}`,
        title: `🌦️ ${t.rainForecast.simulatedAlert}: ${location.name}`,
        body: `${rainForecast.rainExpectedSummary}. Scheduled around ${rainForecast.nextRainExpectedTime}.`,
        type: 'rain_upcoming',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }, [rainForecast?.isRainingNow, rainForecast?.nextRainExpectedTime, location.name]);

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('System Web Notifications are not supported in this browser environment, but the in-app popup notifications are fully functional!');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        new Notification(`AQI-App: ${t.rainForecast.alertsEnabled}`, {
          body: `You will now receive automatic notifications for rain in ${location.name}.`,
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.warn('Notification permission request error:', e);
    }
  };

  const triggerTestNotification = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isNow = rainForecast?.isRainingNow;
    const title = isNow
      ? `🌧️ ${t.rainForecast.notificationAlertTitle}: ${location.name}`
      : `🌦️ ${t.rainForecast.simulatedAlert}: ${location.name}`;
    const body = isNow
      ? `${t.rainForecast.rainingNow}. Current rate: ${rainForecast?.currentPrecipitationMm || 1.2}mm.`
      : rainForecast?.nextRainExpectedTime
        ? `${rainForecast.rainExpectedSummary}. Grab an umbrella before heading out!`
        : `Simulated Alert: Rain expected in ${location.name} in approximately 45 minutes (70% probability).`;

    // 1. Show interactive in-app popup banner
    setActivePopupAlert({
      id: `test-${Date.now()}`,
      title,
      body,
      type: 'test',
      timestamp: timeNow,
    });

    // 2. Trigger browser system notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('System notification error:', e);
      }
    }
  };

  if (!rainForecast) return null;

  return (
    <>
      {/* 1. In-App Interactive Toast / Popup Notification banner if alert triggered */}
      {activePopupAlert && (
        <div
          id="rain-popup-notification"
          className="relative overflow-hidden bg-gradient-to-r from-sky-900/95 via-blue-950/95 to-slate-900/95 border-2 border-sky-400/80 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-sky-950/70 text-white animate-in slide-in-from-top-4 duration-300 ring-4 ring-sky-500/20 mb-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/30 text-sky-300 border border-sky-400/40 shrink-0 mt-0.5 animate-bounce">
                <CloudRain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-500 text-white shadow-sm">
                    {activePopupAlert.type === 'rain_now' ? 'Live Alert' : 'Upcoming Shower'}
                  </span>
                  <span className="text-xs font-mono text-sky-200">
                    {activePopupAlert.timestamp}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {activePopupAlert.title}
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                  {activePopupAlert.body}
                </p>
              </div>
            </div>

            <button
              id="dismiss-rain-popup"
              onClick={() => setActivePopupAlert(null)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-sky-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition border border-sky-400/30 shrink-0"
            >
              {t.rainForecast.dismiss}
            </button>
          </div>
        </div>
      )}

      {/* 2. Persistent Rain Radar & Forecast Card */}
      <div
        id="rain-forecast-card"
        className="bg-slate-900/95 border border-sky-500/30 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden"
      >
        {/* Subtle rain background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border shrink-0 ${
              rainForecast.isRainingNow
                ? 'bg-sky-500/25 border-sky-400/50 text-sky-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-sky-400'
            }`}>
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold tracking-tight text-white">
                  {t.rainForecast.title}
                </h2>
                {rainForecast.isRainingNow ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                    🌧️ {t.rainForecast.now}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {location.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {rainForecast.rainExpectedSummary}
              </p>
            </div>
          </div>

          {/* Action buttons: Browser notifications & Test alert */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {notificationPermission === 'granted' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.rainForecast.alertsEnabled}</span>
              </span>
            ) : notificationPermission === 'denied' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium">
                <BellOff className="w-3.5 h-3.5" />
                <span>{t.rainForecast.alertsBlocked}</span>
              </span>
            ) : (
              <button
                id="enable-rain-alerts-btn"
                onClick={requestNotificationPermission}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{t.rainForecast.enableAlerts}</span>
              </button>
            )}

            <button
              id="test-rain-notification-btn"
              onClick={triggerTestNotification}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-medium transition"
              title="Test rain notification popup"
            >
              <BellRing className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.rainForecast.testAlertBtn}</span>
            </button>
          </div>
        </div>

        {/* Rain Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.rainForecast.expectedAt}</span>
            </div>
            <div className="text-sm font-bold font-mono text-white">
              {rainForecast.nextRainExpectedTime || 'None within 24h'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {rainForecast.nextRainHoursAway !== null
                ? rainForecast.nextRainHoursAway === 0
                  ? 'Active now'
                  : `In ~${rainForecast.nextRainHoursAway} ${t.rainForecast.hoursAway}`
                : 'Clear skies'}
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.rainForecast.todayMaxChance}</span>
            </div>
            <div className="text-sm font-bold font-mono text-sky-400">
              {rainForecast.todayMaxRainChance}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {rainForecast.todayMaxRainChance >= 60 ? 'High probability' : rainForecast.todayMaxRainChance >= 30 ? 'Moderate chance' : 'Low probability'}
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Umbrella className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.rainForecast.totalExpectedToday}</span>
            </div>
            <div className="text-sm font-bold font-mono text-white">
              {rainForecast.expectedTotalMmToday} mm
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {rainForecast.expectedTotalMmToday > 5 ? 'Heavy precipitation' : rainForecast.expectedTotalMmToday > 0 ? 'Light to moderate shower' : 'Dry day'}
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Status</span>
            </div>
            <div className="text-sm font-bold text-slate-200">
              {rainForecast.isRainingNow
                ? '🌧️ Raining'
                : rainForecast.todayMaxRainChance > 40
                  ? '🌦️ Rain likely'
                  : '☀️ Dry conditions'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Current: {rainForecast.currentPrecipitationMm} mm
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
