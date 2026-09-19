import { Info, X } from 'lucide-react';
import { AQI_LEVELS } from '../services/aqiConstants';
import { AQICategory } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface AqiScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationStrings;
}

export function AqiScaleModal({ isOpen, onClose, t }: AqiScaleModalProps) {
  if (!isOpen) return null;

  const categories: AQICategory[] = [
    'Good',
    'Moderate',
    'Unhealthy for Sensitive Groups',
    'Unhealthy',
    'Very Unhealthy',
    'Hazardous',
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.epaScaleTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.scaleGuide}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3 text-xs">
          {categories.map((cat) => {
            const item = AQI_LEVELS[cat];
            return (
              <div
                key={cat}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-mono shrink-0 shadow-md"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-xs font-black">{item.range[0]}</span>
                    <span className="text-[9px] opacity-80">-</span>
                    <span className="text-xs font-black">{item.range[1]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{t.categories[cat] || item.category}</h4>
                    </div>
                    <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                      {t.categoryDescriptions[cat] || item.description}
                    </p>
                    <p className="text-slate-400 mt-1 text-[10px]">
                      <strong>Advice:</strong> {item.generalAdvice}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
