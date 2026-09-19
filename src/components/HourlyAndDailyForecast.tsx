import { useState } from 'react';
import { Clock, Calendar, Sun, CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import { HourlyDataPoint, DailyDataPoint } from '../types';
import { getAQILevel } from '../services/aqiConstants';
import { TranslationStrings } from '../i18n/translations';

interface ForecastProps {
  hourly: HourlyDataPoint[];
  daily: DailyDataPoint[];
  tempUnit: 'C' | 'F';
  t: TranslationStrings;
}

export function HourlyAndDailyForecast({ hourly, daily, tempUnit, t }: ForecastProps) {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');

  const renderWeatherIcon = (code: number, className = 'w-4 h-4') => {
    switch (code) {
      case 0:
      case 1:
        return <Sun className={`${className} text-amber-400`} />;
      case 2:
        return <CloudSun className={`${className} text-amber-300`} />;
      case 3:
        return <Cloud className={`${className} text-slate-300`} />;
      case 45:
      case 48:
        return <CloudFog className={`${className} text-slate-400`} />;
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        return <CloudRain className={`${className} text-sky-400`} />;
      case 71:
      case 73:
      case 75:
        return <CloudSnow className={`${className} text-sky-200`} />;
      case 95:
      case 96:
      case 99:
        return <CloudLightning className={`${className} text-violet-400`} />;
      default:
        return <CloudSun className={`${className} text-amber-300`} />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
      {/* Header with Hourly / 7-Day tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-slate-800 text-sky-400">
            {activeTab === 'hourly' ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">
              {activeTab === 'hourly' ? t.hourlyTrends : t.weeklyForecast}
            </h2>
            <p className="text-xs text-slate-400">
              {activeTab === 'hourly' ? t.hourlySubtitle : t.weeklySubtitle}
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-slate-800/90 p-1 border border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'hourly'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.hourlyTab}
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'daily'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.dailyTab}
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {activeTab === 'hourly' && (
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-end gap-3 min-w-[720px] pt-4 pb-2 px-1">
            {hourly.slice(0, 16).map((point, idx) => {
              const info = getAQILevel(point.aqi);
              const heightPct = Math.max(15, Math.min(100, (point.aqi / 250) * 100));
              const tempVal = tempUnit === 'C' ? point.tempC : point.tempF;

              return (
                <div
                  key={`${point.time}-${idx}`}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-white transition">
                    {point.displayTime}
                  </span>

                  <div className="my-1">
                    {renderWeatherIcon(point.weatherCode, 'w-4 h-4')}
                  </div>

                  <span className="text-xs font-bold font-mono text-slate-200">
                    {tempVal}°
                  </span>

                  {/* Rain Chance Pill if > 0 */}
                  {point.precipitationProbability != null && point.precipitationProbability > 0 ? (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-mono font-semibold" title={`${point.precipitationProbability}% chance of rain (${point.precipitationMm || 0}mm)`}>
                      <CloudRain className="w-2.5 h-2.5" />
                      <span>{point.precipitationProbability}%</span>
                    </div>
                  ) : (
                    <div className="h-[18px]" />
                  )}

                  {/* Vertical bar showing AQI */}
                  <div className="w-8 h-28 bg-slate-800/80 rounded-lg p-1 flex flex-col justify-end items-center relative overflow-hidden border border-slate-700/50">
                    <div
                      className="w-full rounded-md transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: info.color,
                      }}
                    />
                    <span className="absolute top-1 text-[10px] font-black font-mono text-white/90">
                      {point.aqi}
                    </span>
                  </div>

                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: info.color }}
                    title={`${info.category} (${point.aqi})`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily View */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {daily.map((day) => {
            const info = getAQILevel(day.avgAqi);
            const maxT = tempUnit === 'C' ? day.maxTempC : day.maxTempF;
            const minT = tempUnit === 'C' ? day.minTempC : day.minTempF;

            return (
              <div
                key={day.date}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between items-center text-center hover:bg-slate-800 transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {day.dayName}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {day.date.slice(5)}
                  </span>
                </div>

                <div className="my-2.5 p-2 rounded-xl bg-slate-700/40">
                  {renderWeatherIcon(day.weatherCode, 'w-6 h-6')}
                </div>

                <div className="text-xs font-mono font-semibold text-slate-200">
                  <span>{maxT}°</span> / <span className="text-slate-400">{minT}°</span>
                </div>

                {day.precipitationProbabilityMax != null && day.precipitationProbabilityMax > 0 && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                    <CloudRain className="w-2.5 h-2.5" />
                    <span>{day.precipitationProbabilityMax}%</span>
                    {day.precipitationSumMm != null && day.precipitationSumMm > 0 && (
                      <span className="text-slate-400">({day.precipitationSumMm}mm)</span>
                    )}
                  </div>
                )}

                <div className="mt-2.5 w-full pt-2 border-t border-slate-700/50 flex flex-col items-center gap-1">
                  <span
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: info.color }}
                  >
                    AQI {day.avgAqi}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                    {t.categories[info.category] || info.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
