import { AQICategory, AQILevelInfo } from '../types';

export const AQI_LEVELS: Record<AQICategory, AQILevelInfo> = {
  'Good': {
    category: 'Good',
    range: [0, 50],
    color: '#10b981', // emerald-500
    textColor: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    generalAdvice: 'Great day to be active outside! Open windows for fresh air ventilation.',
    sensitiveAdvice: 'No special health precautions are necessary for sensitive individuals.',
    outdoorExerciseAdvice: 'Ideal conditions for all outdoor sports, running, and cycling.',
    ventilationAdvice: 'Recommended to ventilate home and office spaces naturally.',
    maskAdvice: 'No face mask needed outdoors.',
  },
  'Moderate': {
    category: 'Moderate',
    range: [51, 100],
    color: '#eab308', // yellow-500
    textColor: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    description: 'Air quality is acceptable; however, some pollutants may pose a moderate health concern for a very small number of individuals.',
    generalAdvice: 'Air quality is generally fine for most people. Sensitive groups should watch for symptoms.',
    sensitiveAdvice: 'People unusually sensitive to ozone or particle pollution should consider reducing prolonged outdoor exertion.',
    outdoorExerciseAdvice: 'Outdoor exercise is safe for the general public; sensitive individuals should pace themselves.',
    ventilationAdvice: 'Moderate natural ventilation is safe during morning and early afternoon.',
    maskAdvice: 'Mask is optional for the general public, recommended only for hypersensitive individuals.',
  },
  'Unhealthy for Sensitive Groups': {
    category: 'Unhealthy for Sensitive Groups',
    range: [101, 150],
    color: '#f97316', // orange-500
    textColor: 'text-orange-700 dark:text-orange-400',
    badgeBg: 'bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-800',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    generalAdvice: 'Active children and adults with respiratory disease (like asthma) should limit outdoor exertion.',
    sensitiveAdvice: 'People with asthma, lung, or heart disease, children, and elderly should reduce strenuous outdoor activities.',
    outdoorExerciseAdvice: 'Take more breaks during outdoor activities. Consider shifting vigorous workouts indoors.',
    ventilationAdvice: 'Keep windows closed during peak traffic hours. Consider running an indoor air purifier.',
    maskAdvice: 'N95 / KN95 mask recommended for elderly, children, and sensitive individuals outdoors.',
  },
  'Unhealthy': {
    category: 'Unhealthy',
    range: [151, 200],
    color: '#ef4444', // red-500
    textColor: 'text-rose-700 dark:text-rose-400',
    badgeBg: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    description: 'Some members of the general public may experience health effects; sensitive groups may experience more serious health effects.',
    generalAdvice: 'Everyone may begin to experience health effects. Limit prolonged or heavy outdoor exertion.',
    sensitiveAdvice: 'Sensitive groups must avoid prolonged outdoor exertion; stay in clean, filtered indoor air.',
    outdoorExerciseAdvice: 'Avoid strenuous outdoor running or cardio. Move workouts indoors with air filtration.',
    ventilationAdvice: 'Keep windows and doors closed. Use air purifiers with HEPA filters.',
    maskAdvice: 'N95 / KN95 or equivalent particulate mask recommended for anyone spending extended time outside.',
  },
  'Very Unhealthy': {
    category: 'Very Unhealthy',
    range: [201, 300],
    color: '#a855f7', // purple-500
    textColor: 'text-purple-700 dark:text-purple-400',
    badgeBg: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    description: 'Health alert: The risk of health effects is increased for everyone in the population.',
    generalAdvice: 'Avoid outdoor activities. Keep indoor air as clean as possible.',
    sensitiveAdvice: 'People with respiratory or heart conditions must stay indoors in sealed spaces with air filtration.',
    outdoorExerciseAdvice: 'Strictly avoid any outdoor exercise.',
    ventilationAdvice: 'Do not open windows. Run air purifiers on high setting.',
    maskAdvice: 'Well-fitted N95/KF94 mask is strongly necessary if going outdoors is unavoidable.',
  },
  'Hazardous': {
    category: 'Hazardous',
    range: [301, 500],
    color: '#881337', // rose-900 / maroon
    textColor: 'text-rose-950 dark:text-rose-200',
    badgeBg: 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-200',
    badgeBorder: 'border-rose-300 dark:border-rose-900',
    description: 'Health warning of emergency conditions: Everyone is more likely to be seriously affected.',
    generalAdvice: 'Emergency health warnings. Everyone should stay indoors with filtered air and minimize physical activity.',
    sensitiveAdvice: 'Remain strictly indoors with air purifiers; seek medical advice if breathing difficulties arise.',
    outdoorExerciseAdvice: 'Strictly prohibited. Stay inside in air-conditioned or HEPA-filtered rooms.',
    ventilationAdvice: 'Keep all windows and openings strictly sealed.',
    maskAdvice: 'Certified N95/P100 respirator mandatory if outdoors.',
  }
};

export function getAQILevel(aqi: number): AQILevelInfo {
  if (aqi <= 50) return AQI_LEVELS['Good'];
  if (aqi <= 100) return AQI_LEVELS['Moderate'];
  if (aqi <= 150) return AQI_LEVELS['Unhealthy for Sensitive Groups'];
  if (aqi <= 200) return AQI_LEVELS['Unhealthy'];
  if (aqi <= 300) return AQI_LEVELS['Very Unhealthy'];
  return AQI_LEVELS['Hazardous'];
}

export function calculateEPApm25AQI(pm25: number): number {
  // US EPA PM2.5 calculation breakpoints (ug/m3 to AQI)
  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ];

  const c = Math.max(0, Math.min(pm25, 500));
  for (const b of breakpoints) {
    if (c >= b.cLow && c <= b.cHigh) {
      return Math.round(((b.iHigh - b.iLow) / (b.cHigh - b.cLow)) * (c - b.cLow) + b.iLow);
    }
  }
  return 500;
}

export function translateWeatherCode(code: number): { text: string; icon: string } {
  switch (code) {
    case 0:
      return { text: 'Clear Sky', icon: 'Sun' };
    case 1:
      return { text: 'Mainly Clear', icon: 'Sun' };
    case 2:
      return { text: 'Partly Cloudy', icon: 'CloudSun' };
    case 3:
      return { text: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { text: 'Fog & Mist', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { text: 'Light Drizzle', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { text: 'Rain', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
      return { text: 'Snow', icon: 'CloudSnow' };
    case 80:
    case 81:
    case 82:
      return { text: 'Rain Showers', icon: 'CloudRain' };
    case 95:
    case 96:
    case 99:
      return { text: 'Thunderstorm', icon: 'CloudLightning' };
    default:
      return { text: 'Partly Cloudy', icon: 'CloudSun' };
  }
}

export function degToCompass(num: number): string {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[val % 16];
}
