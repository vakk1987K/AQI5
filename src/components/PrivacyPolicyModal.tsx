import { useState } from 'react';
import { ShieldCheck, Copy, Check, X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const policyText = `# Privacy Policy for AQI-App: Air Quality & Weather
Package Name: app.vercel.aqi_app3.twa
Effective Date: September 16, 2026

AQI-App ("we", "our", or "us") provides real-time Air Quality Index (AQI), weather forecasts, and environmental health advisories. We are deeply committed to protecting your privacy.

## 1. Information We Collect
- **Location Data (Optional)**: If you choose to use the "Locate Me" or GPS feature, our application requests access to your approximate or precise geographical coordinates (latitude and longitude). This information is used strictly to locate the nearest air quality monitoring station and retrieve current ambient meteorological conditions.
- **Ephemeral Processing**: Your location coordinates are processed in real-time to query meteorological API endpoints and are NEVER stored on remote servers, logged in databases, or associated with your personal identity.
- **No Personal Identification**: AQI-App does NOT require you to create an account, register, or provide your name, phone number, email address, contacts, or financial details.

## 2. Third-Party Meteorological Services
To fetch reliable public atmospheric data, our application queries:
- Open-Meteo Air Quality & Weather API (open-meteo.com)
All data transmission occurs over secure Transport Layer Security (HTTPS/TLS) encrypted connections.

## 3. Data Sharing & Selling
We do NOT sell, rent, trade, or share your location data or personal information with third-party advertisers or data brokers under any circumstances.

## 4. Permissions & User Control
- You can grant or revoke location permissions at any time via your device settings (Android Settings -> Apps -> AQI-App -> Permissions -> Location).
- You can fully use the application without location permissions by searching for your desired city or region manually.

## 5. Security
All communications between AQI-App and meteorological data providers are secured using industry-standard SSL/TLS encryption.

## 6. Contact Us
For any privacy questions or inquiries regarding AQI-App, please contact:
Developer Support: support@vercel.aqi_app3.twa`;

  const handleCopy = () => {
    navigator.clipboard.writeText(policyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Privacy Policy & Data Safety Declaration
              </h3>
              <p className="text-[11px] text-slate-400">
                Official policy for <code>app.vercel.aqi_app3.twa</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Policy URL/Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="font-semibold text-white block mb-1">
              Google Play Console Store Presence Notice:
            </span>
            <span>
              Google requires this policy to be accessible both within the app and via a public URL entered into your Play Console under <strong>App Content → Privacy Policy</strong>. You can copy this exact text to paste into your hosted web page.
            </span>
          </div>

          <div className="space-y-3 font-mono text-[11px] bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap">
            {policyText}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
