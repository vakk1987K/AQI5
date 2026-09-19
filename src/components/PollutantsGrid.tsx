import { useState } from 'react';
import { PollutantDetail } from '../types';
import { Layers, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { TranslationStrings } from '../i18n/translations';

interface PollutantsGridProps {
  pollutants: PollutantDetail[];
  t: TranslationStrings;
}

export function PollutantsGrid({ pollutants, t }: PollutantsGridProps) {
  const [selectedPollutant, setSelectedPollutant] = useState<PollutantDetail | null>(null);

  const getStatusColor = (category: string) => {
    switch (category) {
      case 'Good':
        return {
          bar: 'bg-emerald-500',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'Moderate':
        return {
          bar: 'bg-amber-500',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'Unhealthy for Sensitive Groups':
        return {
          bar: 'bg-orange-500',
          text: 'text-orange-400',
          badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        };
      case 'Unhealthy':
        return {
          bar: 'bg-rose-500',
          text: 'text-rose-400',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
      default:
        return {
          bar: 'bg-purple-500',
          text: 'text-purple-400',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-slate-800 text-sky-400">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">
              {t.keyPollutants}
            </h2>
            <p className="text-xs text-slate-400">
              {t.pollutantSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 6 pollutants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pollutants.map((p) => {
          const color = getStatusColor(p.category);
          const progressWidth = Math.min(100, Math.max(8, p.pctOfLimit));

          return (
            <div
              key={p.code}
              onClick={() => setSelectedPollutant(p)}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl p-3.5 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono tracking-tight text-white bg-slate-700/60 px-2 py-0.5 rounded-md border border-slate-600">
                      {p.formula}
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition">
                        {p.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 block">WHO: {p.whoLimit} {p.unit}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color.badge}`}
                  >
                    {t.categories[p.category] || p.category}
                  </span>
                </div>

                {/* Main reading value */}
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black font-mono text-white">
                      {p.value}
                    </span>
                    <span className="text-xs text-slate-400 ml-1 font-mono">{p.unit}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    <strong className={color.text}>{p.pctOfLimit}%</strong> {t.ofWhoLimit}
                  </span>
                </div>

                {/* Progress bar vs WHO standard */}
                <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${color.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[180px]">{p.description}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0 ml-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Pollutant Detail Modal */}
      {selectedPollutant && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setSelectedPollutant(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-black font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 px-3 py-1 rounded-lg">
                {selectedPollutant.formula}
              </span>
              <div>
                <h3 className="text-lg font-bold">{selectedPollutant.name}</h3>
                <span className="text-xs text-slate-400">
                  Standard Unit: {selectedPollutant.unit}
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Current Concentration</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {selectedPollutant.value} {selectedPollutant.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">WHO Health Guideline</span>
                  <span className="text-sm font-semibold text-slate-200">
                    ≤ {selectedPollutant.whoLimit} {selectedPollutant.unit}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Health Effects & Risk
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedPollutant.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Primary Emission Sources
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  {selectedPollutant.mainSources}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPollutant(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
