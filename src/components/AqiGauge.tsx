import { motion } from 'motion/react';
import { AQILevelInfo } from '../types';
import { Activity, Info } from 'lucide-react';
import { TranslationStrings } from '../i18n/translations';

interface AqiGaugeProps {
  aqi: number;
  levelInfo: AQILevelInfo;
  dominantPollutant: string;
  stationName: string;
  lastUpdated: string;
  isLiveApi: boolean;
  onOpenInfoModal: () => void;
  t: TranslationStrings;
}

export function AqiGauge({
  aqi,
  levelInfo,
  dominantPollutant,
  stationName,
  lastUpdated,
  isLiveApi,
  onOpenInfoModal,
  t,
}: AqiGaugeProps) {
  // SVG Gauge calculations
  // Angle spans from -180 deg to 0 deg (semi-circle)
  const clampedAqi = Math.max(0, Math.min(500, aqi));
  const normalizedProgress = clampedAqi / 500; // 0 to 1
  const radius = 96;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // half circle circumference
  const strokeDashoffset = circumference * (1 - normalizedProgress);

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Subtle background glow based on AQI level */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: levelInfo.color }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-slate-800 text-sky-400">
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              {t.epaScaleTitle}
            </h2>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              {stationName}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenInfoModal}
          title={t.scaleGuide}
          id="aqi-scale-info-btn"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Main Gauge Graphic */}
      <div className="relative flex flex-col items-center justify-center my-3 sm:my-4 z-10">
        <div className="relative w-56 h-32 flex items-end justify-center">
          <svg className="w-56 h-36 overflow-visible" viewBox="0 0 220 120">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="25%" stopColor="#eab308" />
                <stop offset="45%" stopColor="#f97316" />
                <stop offset="65%" stopColor="#ef4444" />
                <stop offset="85%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>

            {/* Background track */}
            <path
              d="M 14 110 A 96 96 0 0 1 206 110"
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Value stroke */}
            <motion.path
              d="M 14 110 A 96 96 0 0 1 206 110"
              fill="none"
              stroke={levelInfo.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>

          {/* Centered Readout inside gauge */}
          <div className="absolute bottom-1 flex flex-col items-center text-center">
            <motion.span
              key={aqi}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white font-mono"
            >
              {aqi}
            </motion.span>
            <span className="text-[11px] font-medium tracking-wide text-slate-400 mt-1">
              AQI POINTS
            </span>
          </div>
        </div>

        {/* Level Badge */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelInfo.badgeBg} ${levelInfo.badgeBorder}`}
          >
            {t.categories[levelInfo.category] || levelInfo.category}
          </span>
          <span className="text-xs text-slate-400">
            {t.primary}: <strong className="text-slate-200">{dominantPollutant}</strong>
          </span>
        </div>

        {/* Health Description One-Liner */}
        <p className="text-xs text-slate-300 text-center max-w-sm mt-2 line-clamp-2 px-2">
          {t.categoryDescriptions[levelInfo.category] || levelInfo.description}
        </p>
      </div>

      {/* EPA Scale Spectrum Bar */}
      <div className="z-10 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
          <span>0 ({t.categories.Good})</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>500 ({t.categories.Hazardous})</span>
        </div>

        {/* Color segmented gradient bar with position marker */}
        <div className="relative h-2 rounded-full overflow-visible bg-slate-800">
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                'linear-gradient(to right, #10b981 0%, #10b981 10%, #eab308 20%, #f97316 35%, #ef4444 50%, #a855f7 70%, #881337 100%)',
            }}
          />
          {/* Active pointer marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-700 pointer-events-none"
            style={{
              left: `${Math.max(2, Math.min(98, (clampedAqi / 500) * 100))}%`,
              backgroundColor: levelInfo.color,
            }}
          />
        </div>

        {/* Footer info: updated & live source status */}
        <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
            />
            {isLiveApi ? t.liveReading : t.baselineReading}
          </span>
          <span>{t.updatedAt} {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
