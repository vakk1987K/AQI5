import { HeartPulse, Dumbbell, ShieldAlert, Home, Fan, Baby } from 'lucide-react';
import { AQILevelInfo } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface HealthAdvisoriesProps {
  levelInfo: AQILevelInfo;
  aqi: number;
  t: TranslationStrings;
}

export function HealthAdvisories({ levelInfo, aqi, t }: HealthAdvisoriesProps) {
  const cardKeys: Array<{
    id: 'exercise' | 'ventilation' | 'mask' | 'purifier' | 'sensitive' | 'children';
    icon: typeof Dumbbell;
  }> = [
    { id: 'exercise', icon: Dumbbell },
    { id: 'ventilation', icon: Home },
    { id: 'mask', icon: ShieldAlert },
    { id: 'purifier', icon: Fan },
    { id: 'sensitive', icon: HeartPulse },
    { id: 'children', icon: Baby },
  ];

  const cards = cardKeys.map((item) => {
    const adv = t.advisories[item.id];
    let advice = adv.cautionAdvice;
    let badge = adv.cautionBadge;
    let badgeColor = 'text-rose-400 border-rose-500/30';

    if (aqi <= 50) {
      advice = adv.safeAdvice;
      badge = adv.safeBadge;
      badgeColor = 'text-emerald-400 border-emerald-500/30';
    } else if (aqi <= 100) {
      advice = adv.moderateAdvice;
      badge = adv.moderateBadge;
      badgeColor = 'text-amber-400 border-amber-500/30';
    }

    return {
      id: item.id,
      title: adv.title,
      icon: item.icon,
      advice,
      badge,
      badgeColor,
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 rounded-lg bg-slate-800 text-sky-400">
          <HeartPulse className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-sm font-bold tracking-tight text-white">
            {t.healthAdvisories}
          </h2>
          <p className="text-xs text-slate-400">
            {t.healthSubtitle} ({t.categories[levelInfo.category] || levelInfo.category})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-700/60 text-sky-300">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-200">{card.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-800 ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {card.advice}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
