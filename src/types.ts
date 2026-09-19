export type Language = 'en' | 'hi' | 'te' | 'mr' | 'ta' | 'es';

export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface AQILevelInfo {
  category: AQICategory;
  range: [number, number];
  color: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  generalAdvice: string;
  sensitiveAdvice: string;
  outdoorExerciseAdvice: string;
  ventilationAdvice: string;
  maskAdvice: string;
}

export interface PollutantDetail {
  code: 'pm2_5' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co';
  name: string;
  formula: string;
  value: number;
  unit: string;
  category: AQICategory;
  whoLimit: number;
  pctOfLimit: number;
  description: string;
  mainSources: string;
}

export interface WeatherMetrics {
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  humidity: number;
  windSpeedKmH: number;
  windDirectionDeg: number;
  windDirectionText: string;
  uvIndex: number;
  pressureHpa: number;
  visibilityKm: number;
  dewPointC: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  sunrise: string;
  sunset: string;
}

export interface HourlyDataPoint {
  time: string;
  displayTime: string;
  aqi: number;
  tempC: number;
  tempF: number;
  pm2_5: number;
  weatherCode: number;
  weatherDescription: string;
  precipitationProbability?: number; // % chance of rain
  precipitationMm?: number; // rain amount in mm
}

export interface DailyDataPoint {
  date: string;
  dayName: string;
  maxTempC: number;
  minTempC: number;
  maxTempF: number;
  minTempF: number;
  avgAqi: number;
  category: AQICategory;
  weatherCode: number;
  weatherDescription: string;
  precipitationProbabilityMax?: number; // max % rain chance
  precipitationSumMm?: number; // total rain in mm
}

export interface RainForecastInfo {
  isRainingNow: boolean;
  currentPrecipitationMm: number;
  currentProbability: number;
  nextRainExpectedTime: string | null; // e.g. "Today at 3:00 PM"
  nextRainHoursAway: number | null; // hours away
  rainExpectedSummary: string; // e.g. "Light rain expected in 2 hours"
  todayMaxRainChance: number; // 0-100%
  expectedTotalMmToday: number;
}

export interface LocationData {
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface FullAQIData {
  location: LocationData;
  aqi: number;
  levelInfo: AQILevelInfo;
  dominantPollutant: string;
  pollutants: PollutantDetail[];
  weather: WeatherMetrics;
  rainForecast?: RainForecastInfo;
  hourly: HourlyDataPoint[];
  daily: DailyDataPoint[];
  lastUpdated: string;
  stationName: string;
  isLiveApi: boolean;
}

// Google Play Console Closed Testing & Policy types
export interface ClosedTester {
  id: string;
  name: string;
  email: string;
  status: 'invited' | 'opted_in' | 'active_testing';
  invitedAt: string;
  optedInAt?: string;
  device?: string;
  feedback?: string;
}

export interface ClosedTestingTracker {
  packageName: string;
  temporaryAppName: string;
  actualAppName: string;
  testers: ClosedTester[];
  requiredTesters: number;
  testingDaysElapsed: number;
  requiredDays: number;
  testStartDate: string;
  status: 'rejected_needs_fixes' | 'in_testing' | 'ready_for_production';
}

export interface PolicyCheckItem {
  id: string;
  title: string;
  category: 'Privacy' | 'Functionality' | 'Metadata' | 'Permissions' | 'Testing';
  status: 'pass' | 'warning' | 'fail';
  description: string;
  resolution: string;
}
