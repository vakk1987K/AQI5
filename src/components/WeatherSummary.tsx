import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { WeatherMetrics } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface WeatherSummaryProps {
  weather: WeatherMetrics;
  tempUnit: 'C' | 'F';
  t: TranslationStrings;
}

export function WeatherSummary({ weather, tempUnit, t }: WeatherSummaryProps) {
  const currentTemp = tempUnit === 'C' ? weather.tempC : weather.tempF;
  const feelsLike = tempUnit === 'C' ? weather.feelsLikeC : weather.feelsLikeF;

  const renderWeatherIcon = (code: number, className = 'w-8 h-8') => {
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

  const getUvCategory = (uv: number) => {
    if (uv <= 2) return { text: t.uvRisk.low, color: 'text-emerald-400' };
    if (uv <= 5) return { text: t.uvRisk.moderate, color: 'text-amber-400' };
    if (uv <= 7) return { text: t.uvRisk.high, color: 'text-orange-400' };
    if (uv <= 10) return { text: t.uvRisk.veryHigh, color: 'text-rose-400' };
    return { text: t.uvRisk.extreme, color: 'text-purple-400' };
  };

  const uvCat = getUvCategory(weather.uvIndex);

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 text-white shadow-xl flex flex-col justify-between">
      {/* Top weather condition block */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              {t.weatherSummary}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
              {currentTemp}°
            </span>
            <span className="text-lg font-semibold text-slate-400">
              {tempUnit}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              {t.feelsLike} <strong className="text-slate-200">{feelsLike}°{tempUnit}</strong>
            </span>
          </div>
          <p className="text-sm font-medium text-slate-300 mt-1">
            {weather.weatherDescription}
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
          {renderWeatherIcon(weather.weatherCode, 'w-9 h-9')}
        </div>
      </div>

      {/* Grid of weather metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
        {/* Humidity */}
        <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Droplets className="w-5 h-5 text-sky-400 shrink-0" />
          <div className="truncate">
            <span className="text-[11px] text-slate-400 block leading-tight">{t.humidity}</span>
            <span className="text-sm font-bold font-mono text-slate-100">{weather.humidity}%</span>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Wind className="w-5 h-5 text-teal-400 shrink-0" />
          <div className="truncate">
            <span className="text-[11px] text-slate-400 block leading-tight">{t.windSpeed}</span>
            <span className="text-sm font-bold font-mono text-slate-100">
              {weather.windSpeedKmH} <span className="text-[11px] font-normal text-slate-400">km/h</span> {weather.windDirectionText}
            </span>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Sun className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-[11px] text-slate-400 block leading-tight">{t.uvIndex}</span>
            <span className="text-sm font-bold font-mono text-slate-100">
              {weather.uvIndex} <span className={`text-xs font-semibold ${uvCat.color}`}>({uvCat.text})</span>
            </span>
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Gauge className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="truncate">
            <span className="text-[11px] text-slate-400 block leading-tight">{t.pressure}</span>
            <span className="text-sm font-bold font-mono text-slate-100">
              {weather.pressureHpa} <span className="text-[11px] font-normal text-slate-400">hPa</span>
            </span>
          </div>
        </div>

        {/* Dew Point */}
        <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-cyan-400 shrink-0" />
          <div className="truncate">
            <span className="text-[11px] text-slate-400 block leading-tight">{t.dewPoint}</span>
            <span className="text-sm font-bold font-mono text-slate-100">
              {weather.dewPointC}°C
            </span>
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Sunrise className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-[11px] text-slate-400 block leading-tight">{t.sunrise} / {t.sunset}</span>
            <span className="text-xs font-bold font-mono text-slate-100 truncate">
              {weather.sunrise} • {weather.sunset}
            </span>
          </div>
        </div>
      </div>

      {/* Sun times footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sunrise className="w-4 h-4 text-amber-400" />
          <span>{t.sunrise}: <strong className="text-slate-200">{weather.sunrise}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunset className="w-4 h-4 text-orange-400" />
          <span>{t.sunset}: <strong className="text-slate-200">{weather.sunset}</strong></span>
        </div>
      </div>
    </div>
  );
}
