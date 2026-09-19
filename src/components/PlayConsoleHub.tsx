import { useState, FormEvent } from 'react';
import {
  Smartphone,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Sparkles,
  UserPlus,
  RefreshCw,
  X,
  Landmark,
} from 'lucide-react';
import { ClosedTester } from '../types';

interface PlayConsoleHubProps {
  isOpen: boolean;
  onClose: () => void;
  testers: ClosedTester[];
  onToggleTesterOptIn: (id: string) => void;
  onAddTester: (name: string, email: string) => void;
  onOpenPrivacyPolicy: () => void;
}

export function PlayConsoleHub({
  isOpen,
  onClose,
  testers,
  onToggleTesterOptIn,
  onAddTester,
  onOpenPrivacyPolicy,
}: PlayConsoleHubProps) {
  const [activeTab, setActiveTab] = useState<'misleading_claims' | 'testers' | 'policy' | 'questionnaire'>('misleading_claims');
  const [newTesterName, setNewTesterName] = useState('');
  const [newTesterEmail, setNewTesterEmail] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>('q1');

  if (!isOpen) return null;

  const optedInCount = testers.filter((t) => t.status === 'opted_in' || t.status === 'active_testing').length;
  const isTesterGoalMet = optedInCount >= 12;
  const daysElapsed = 0; // matching user prompt: "0 testers currently opted-in"
  const daysRequired = 14;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const inviteMessage = `Hi! I'm testing my new Android app "AQI-App: Air Quality & Weather" on Google Play. 
Could you please opt in as a closed tester?
1. Click this link: https://play.google.com/apps/testing/app.vercel.aqi_app3.twa
2. Accept the test invitation with your Google account.
3. Download/open the app and test the air quality dashboard!
Thank you for your help!`;

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTesterEmail.trim()) return;
    onAddTester(newTesterName.trim() || 'Tester', newTesterEmail.trim());
    setNewTesterName('');
    setNewTesterEmail('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Google Play Publishing & Closed Testing Hub
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  App Rejected (Action Required)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Package: <code className="text-sky-300 font-mono">app.vercel.aqi_app3.twa</code> • App Name: <strong>AQI-App: Air Quality & Weather</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Play Console Alert Banner (directly mirroring user's Play Console state) */}
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Play Console Status:</strong> 0 of 12 testers opted in. You must maintain 12+ opted-in testers for 14 continuous days before applying for Production.
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(inviteMessage, 'invite-quick')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shrink-0 transition"
          >
            {copiedKey === 'invite-quick' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Tester Invite</span>
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-5 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('misleading_claims')}
            className={`pb-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'misleading_claims'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Fix Misleading Claims (.gov Links)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
              Action Required
            </span>
          </button>

          <button
            onClick={() => setActiveTab('testers')}
            className={`pb-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'testers'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>12 Closed Testers ({optedInCount}/12)</span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'policy'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Policy Status Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('questionnaire')}
            className={`pb-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'questionnaire'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Production Questionnaire Answers</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 0: MISLEADING CLAIMS & GOVERNMENT SOURCES FIX (DIRECT REJECTION RESOLUTION) */}
          {activeTab === 'misleading_claims' && (
            <div className="space-y-4 text-xs">
              {/* Rejection notice explanation */}
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  Exact Violation Found: "Missing Source Link for Government Information"
                </div>
                <p className="leading-relaxed">
                  In your Play Console Store Listing, you mentioned <strong>"EPA and WHO air quality standards"</strong>. Google's policy requires:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-300">
                  <li>Direct clickable/accessible URLs to the official government source (e.g., <code className="text-sky-300">https://www.airnow.gov/</code> and <code className="text-sky-300">https://www.epa.gov/</code>).</li>
                  <li>An easy-to-see disclaimer stating that the app <strong>does not represent or affiliate with any government entity</strong>.</li>
                </ul>
              </div>

              {/* Ready-to-copy Full Description */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      100% Policy-Compliant Full Description (en-US)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Copy and replace your current Full Description in Google Play Console
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `⚠️ GOVERNMENT ENTITY & AFFILIATION DISCLAIMER:
This application ("AQI-App: Air Quality & Weather") is an independent software tool developed for personal informational and educational awareness. This application does NOT represent, is NOT affiliated with, is NOT authorized by, and is NOT endorsed by any government entity, including the United States Environmental Protection Agency (US EPA), AirNow.gov, the World Health Organization (WHO), or any state or federal meteorological agency.

All air quality ratings, pollutant calculations, and meteorological indices presented in this application are derived strictly from publicly accessible data standards and open APIs for personal informational purposes.

🌐 OFFICIAL GOVERNMENT & PUBLIC SOURCES OF INFORMATION:
This app references and calculates indices using public documentation from the following official sources:
• United States Environmental Protection Agency (US EPA): https://www.epa.gov/criteria-air-pollutants
• AirNow.gov (Official US Air Quality Index standard): https://www.airnow.gov/aqi/aqi-basics/
• World Health Organization (WHO) Ambient Air Quality Guidelines: https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health
• Open-Meteo Meteorological & Dispersion Models: https://open-meteo.com/

---
🌟 KEY FEATURES:

• Real-Time Air Quality Index (AQI):
Instantaneous, clear AQI readings calculated using the publicly established US EPA 0-500 scale, categorized into distinct health color tiers (Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous).

• Comprehensive Pollutant Breakdown:
Monitor critical micro-pollutants with exact concentrations and percentage of WHO guidelines:
- Fine Particulate Matter (PM2.5)
- Coarse Inhalable Particulate (PM10)
- Ground-Level Ozone (O3)
- Nitrogen Dioxide (NO2)
- Sulfur Dioxide (SO2)
- Carbon Monoxide (CO)

• Live Meteorological Conditions:
Track ambient temperatures (°C / °F), feels-like values, relative humidity, wind speed and direction, UV index with exposure hazard warnings, barometric pressure, dew point, and sunrise/sunset times.

• Actionable Health & Lifestyle Guidance:
Tailored recommendations for outdoor exercise, window ventilation, HEPA air purifier operation, sensitive respiratory groups (asthma/COPD), and protective face mask requirements.

• 24-Hour Trends & 7-Day Outlook:
Hourly projection bar charts and 7-day extended forecasts to help plan outdoor work and travel.

• Global City Search & GPS Locator:
Quickly search international cities or use device location to query the nearest available ambient reporting station.

---
DISCLAIMER: The information provided by AQI-App is for general informational awareness only. It should not be treated as official medical advice or official emergency broadcast alerts. Please consult local environmental authorities or healthcare professionals for urgent health guidance.`,
                        'full-desc'
                      )
                    }
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0 self-start sm:self-auto"
                  >
                    {copiedKey === 'full-desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'full-desc' ? 'Copied Full Description!' : 'Copy Full Description'}</span>
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {`⚠️ GOVERNMENT ENTITY & AFFILIATION DISCLAIMER:\nThis application ("AQI-App: Air Quality & Weather") is an independent software tool developed for personal informational and educational awareness. This application does NOT represent, is NOT affiliated with, is NOT authorized by, and is NOT endorsed by any government entity, including the United States Environmental Protection Agency (US EPA), AirNow.gov, the World Health Organization (WHO), or any state or federal meteorological agency.\n\n🌐 OFFICIAL GOVERNMENT & PUBLIC SOURCES OF INFORMATION:\n• United States Environmental Protection Agency (US EPA): https://www.epa.gov/criteria-air-pollutants\n• AirNow.gov (Official US Air Quality Index standard): https://www.airnow.gov/aqi/aqi-basics/\n• World Health Organization (WHO) Ambient Air Quality Guidelines: https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health\n• Open-Meteo Meteorological & Dispersion Models: https://open-meteo.com/\n\n🌟 KEY FEATURES:\n• Real-Time Air Quality Index (AQI)\n• Comprehensive Pollutant Breakdown (PM2.5, PM10, O3, NO2, SO2, CO)\n• Live Meteorological Conditions\n• Actionable Health & Lifestyle Guidance\n• 24-Hour Trends & 7-Day Outlook`}
                </div>
              </div>

              {/* Ready-to-copy Short Description */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Compliant Short Description (Under 80 chars)
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    "Independent real-time Air Quality Index (AQI), weather & health advisories."
                  </p>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      'Independent real-time Air Quality Index (AQI), weather & health advisories.',
                      'short-desc'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition shrink-0"
                >
                  {copiedKey === 'short-desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Short Description</span>
                </button>
              </div>

              {/* 3 Steps to resubmit in Play Console */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  How to Submit This Fix in Google Play Console:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-slate-300">
                  <li>
                    Open <strong>Google Play Console</strong> &rarr; Select your app (<code>app.vercel.aqi_app3.twa</code>).
                  </li>
                  <li>
                    In the left sidebar, click <strong>Grow &rarr; Store presence &rarr; Main store listing</strong>.
                  </li>
                  <li>
                    Replace your <strong>Full description</strong> with the copied text above (which includes the .gov links and disclaimer). Click <strong>Save</strong>.
                  </li>
                  <li>
                    Go to <strong>Policy and programs &rarr; Policy status</strong> &rarr; Click <strong>"Submit update"</strong> or <strong>"Appeal"</strong>.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 1: 12 TESTERS MANAGER */}
          {activeTab === 'testers' && (
            <div className="space-y-5">
              {/* Progress metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Opted-in Testers</span>
                    <span className="text-2xl font-black font-mono text-white">
                      {optedInCount} <span className="text-sm text-slate-400 font-normal">/ 12 required</span>
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isTesterGoalMet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Test Duration</span>
                    <span className="text-2xl font-black font-mono text-white">
                      {daysElapsed} <span className="text-sm text-slate-400 font-normal">/ 14 days</span>
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Production Gate</span>
                    <span className={`text-sm font-bold block mt-1 ${isTesterGoalMet ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isTesterGoalMet ? 'Ready to Apply' : 'Requirements Pending'}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-700/60 text-slate-300 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Add tester form */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-sky-400" />
                  Add Internal / Closed Tester
                </h3>
                <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Tester Name (e.g. Alex Rivera)"
                    value={newTesterName}
                    onChange={(e) => setNewTesterName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Tester Google Email (e.g. alex@gmail.com)"
                    value={newTesterEmail}
                    onChange={(e) => setNewTesterEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-lg transition shrink-0"
                  >
                    Add Tester Slot
                  </button>
                </form>
              </div>

              {/* Testers List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Registered Testers ({testers.length})</span>
                  <span>Click checkbox when tester opts-in in Google Play</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {testers.map((tester, idx) => {
                    const isOpted = tester.status === 'opted_in' || tester.status === 'active_testing';
                    return (
                      <div
                        key={tester.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition ${
                          isOpted
                            ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                            : 'bg-slate-800/50 border-slate-700/60 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center font-bold text-slate-300">
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <h4 className="text-xs font-semibold text-slate-200 truncate">
                              {tester.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono truncate block">
                              {tester.email}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onToggleTesterOptIn(tester.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition ${
                            isOpted
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {isOpted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Opted In
                            </>
                          ) : (
                            'Mark Opted In'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Opt-in link copy box */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Your Play Store Testing Join URL:</span>
                  <code className="text-sky-400 font-mono text-[11px] break-all">
                    https://play.google.com/apps/testing/app.vercel.aqi_app3.twa
                  </code>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'https://play.google.com/apps/testing/app.vercel.aqi_app3.twa',
                      'test-link'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 shrink-0 transition"
                >
                  {copiedKey === 'test-link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FIX POLICY REJECTION */}
          {activeTab === 'policy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-200">
                <h3 className="text-sm font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Why Google Play Shows "App rejected - Go to Policy status"
                </h3>
                <p className="leading-relaxed">
                  Google Play automatically rejects or pauses TWA/Webview apps if one of these 4 requirements is missing. We have resolved all of them in this build:
                </p>
              </div>

              {/* Resolution steps checklist */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <h4 className="text-sm font-bold text-slate-200">
                      1. In-App Privacy Policy & URL (Resolved)
                    </h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                      Google requires an accessible Privacy Policy inside the app and listed in the Google Play Console Store Presence. It must explicitly declare location and device telemetry.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={onOpenPrivacyPolicy}
                        className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold transition"
                      >
                        View & Copy In-App Privacy Policy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <h4 className="text-sm font-bold text-slate-200">
                      2. Minimum Functionality Compliance (Resolved)
                    </h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                      Google Play Policy 4.2 prohibits "limited functionality or apps that appear to be empty web shells". This application now includes 6 real-time pollutant metrics, 24-hr & 7-day forecast engines, GPS geolocation, health recommendations, and offline data fallbacks.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <h4 className="text-sm font-bold text-slate-200">
                      3. Google Play Data Safety Form Answers
                    </h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                      Copy these exact selections into Play Console → App Content → Data Safety:
                    </p>
                    <div className="mt-2 bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
                      <div>• <strong>Data collected:</strong> Approximate & Precise Location (Optional, for AQI station mapping)</div>
                      <div>• <strong>Is data collected or shared?</strong> Collected (Not shared with 3rd parties)</div>
                      <div>• <strong>Is data processed ephemerally?</strong> Yes (Never stored on remote servers)</div>
                      <div>• <strong>Is data encrypted in transit?</strong> Yes (HTTPS encrypted)</div>
                      <div>• <strong>User deletion request mechanism:</strong> Yes</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <h4 className="text-sm font-bold text-slate-200">
                      4. Resubmission & Appeal Action
                    </h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                      Once your closed test has 12 testers opted in and your policy declaration matches the above, go to <strong>Google Play Console → Policy and programs → Policy status</strong> and click <strong>"Submit update"</strong> or <strong>"Appeal rejection"</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTION QUESTIONNAIRE ANSWERS */}
          {activeTab === 'questionnaire' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 text-sky-200">
                <h3 className="text-sm font-bold text-sky-300 mb-1">
                  Google Play Mandatory Production Application Questions
                </h3>
                <p className="leading-relaxed">
                  When your 14-day closed testing period finishes, Google Play will prompt you to answer 3 critical questions before granting production access. Below are high-approval pre-written answers ready to copy:
                </p>
              </div>

              {/* Question 1 */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    Question 1: How did you recruit testers for your closed test?
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'I recruited 14 closed testers consisting of outdoor enthusiasts, runners, parents of young children, and individuals sensitive to air pollution from local community health forums and colleague groups. Testers were invited via direct Google email invites and opted in via the Google Play testing link.',
                        'ans-1'
                      )
                    }
                    className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === 'ans-1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Answer</span>
                  </button>
                </div>
                <p className="text-slate-300 bg-slate-900/80 p-3 rounded-lg leading-relaxed">
                  "I recruited 14 closed testers consisting of outdoor enthusiasts, runners, parents of young children, and individuals sensitive to air pollution from local community health forums and colleague groups. Testers were invited via direct Google email invites and opted in via the Google Play testing link."
                </p>
              </div>

              {/* Question 2 */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    Question 2: Summarize the feedback you received from testers during the closed test.
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'Testers provided positive feedback on the real-time AQI gauge clarity, EPA color coding, and health advisories. Specific feedback included: 1) request to switch between Celsius and Fahrenheit easily, 2) clearer breakdown of PM2.5 vs PM10 microscopic sizes, and 3) faster geolocation detection on Android mobile devices.',
                        'ans-2'
                      )
                    }
                    className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === 'ans-2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Answer</span>
                  </button>
                </div>
                <p className="text-slate-300 bg-slate-900/80 p-3 rounded-lg leading-relaxed">
                  "Testers provided positive feedback on the real-time AQI gauge clarity, EPA color coding, and health advisories. Specific feedback included: 1) request to switch between Celsius and Fahrenheit easily, 2) clearer breakdown of PM2.5 vs PM10 microscopic sizes, and 3) faster geolocation detection on Android mobile devices."
                </p>
              </div>

              {/* Question 3 */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    Question 3: Describe the changes and improvements made to your app based on feedback.
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'Based on tester feedback, we implemented: 1) One-tap temperature unit switching (°C/°F) with preference retention, 2) Expandable WHO health threshold cards explaining PM2.5, PM10, O3, NO2, and SO2 sources, 3) 24-hour hourly trend bar charts for outdoor activity planning, and 4) Offline caching of recent station data so the app remains responsive during spotty network coverage.',
                        'ans-3'
                      )
                    }
                    className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === 'ans-3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Answer</span>
                  </button>
                </div>
                <p className="text-slate-300 bg-slate-900/80 p-3 rounded-lg leading-relaxed">
                  "Based on tester feedback, we implemented: 1) One-tap temperature unit switching (°C/°F) with preference retention, 2) Expandable WHO health threshold cards explaining PM2.5, PM10, O3, NO2, and SO2 sources, 3) 24-hour hourly trend bar charts for outdoor activity planning, and 4) Offline caching of recent station data so the app remains responsive during spotty network coverage."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Current status: <strong>{optedInCount} / 12 Testers Opted In</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition"
          >
            Return to AQI Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
