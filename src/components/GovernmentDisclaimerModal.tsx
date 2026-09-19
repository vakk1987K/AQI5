import { useState } from 'react';
import { Landmark, ExternalLink, Copy, Check, X, ShieldAlert } from 'lucide-react';

interface GovernmentDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GovernmentDisclaimerModal({ isOpen, onClose }: GovernmentDisclaimerModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fullDisclaimerText = `DISCLAIMER: This application ("AQI-App: Air Quality & Weather") is an independent tool developed for educational and personal informational purposes. This application does not represent, is not affiliated with, is not authorized by, and is not endorsed by the United States Environmental Protection Agency (EPA), the World Health Organization (WHO), or any government agency or official meteorological bureau.

All air quality ratings and calculations are derived using publicly published mathematical index formulas from the United States EPA (AirNow) and ambient atmospheric guidelines from the WHO.

Official Government & Public Information Sources:
• United States Environmental Protection Agency (US EPA): https://www.epa.gov/
• EPA AirNow Air Quality Index Standards: https://www.airnow.gov/aqi/aqi-basics/
• World Health Organization (WHO) Ambient Air Quality Guidelines: https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health
• Open-Meteo Meteorological & Air Quality Data: https://open-meteo.com/`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Government Entity Disclaimer & Official Sources
              </h3>
              <p className="text-[11px] text-slate-400">
                Compliance with Google Play Misleading Claims & Government Apps Policy
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Prominent Disclaimer Notice */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              Non-Government Representation Notice
            </div>
            <p className="leading-relaxed text-slate-200">
              <strong>AQI-App: Air Quality & Weather</strong> is an independent software application and <strong>does NOT represent, act on behalf of, or maintain any affiliation with any government agency or official department</strong>, including the United States Environmental Protection Agency (EPA) or international public health bodies.
            </p>
          </div>

          {/* Official Sources Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Original Official Sources (.gov and official public bodies):
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-semibold text-slate-200 text-xs">
                    United States Environmental Protection Agency (US EPA)
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Source for federal National Ambient Air Quality Standards (NAAQS)
                  </p>
                </div>
                <a
                  href="https://www.epa.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-mono text-[11px] flex items-center gap-1 transition shrink-0"
                >
                  <span>epa.gov</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-semibold text-slate-200 text-xs">
                    AirNow.gov (US Government AQI Standard)
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Official formulas for 0–500 AQI breakpoints and health ranges
                  </p>
                </div>
                <a
                  href="https://www.airnow.gov/aqi/aqi-basics/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-mono text-[11px] flex items-center gap-1 transition shrink-0"
                >
                  <span>airnow.gov</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-semibold text-slate-200 text-xs">
                    World Health Organization (WHO) Guidelines
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Global reference limits for PM2.5, PM10, Ozone, and NO2
                  </p>
                </div>
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-mono text-[11px] flex items-center gap-1 transition shrink-0"
                >
                  <span>who.int</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-semibold text-slate-200 text-xs">
                    Open-Meteo Meteorological & Air Quality Models
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Open-source global weather forecasts and atmospheric dispersion API
                  </p>
                </div>
                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-mono text-[11px] flex items-center gap-1 transition shrink-0"
                >
                  <span>open-meteo.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => copyText(fullDisclaimerText, 'full-disclaimer')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition border border-slate-700"
          >
            {copiedKey === 'full-disclaimer' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Disclaimer Text</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Disclaimer & Sources</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
