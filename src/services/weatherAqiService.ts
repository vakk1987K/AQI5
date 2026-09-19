import { FullAQIData, LocationData, PollutantDetail, HourlyDataPoint, DailyDataPoint, RainForecastInfo } from '../types';
import { getAQILevel, translateWeatherCode, degToCompass } from './aqiConstants';

export const POPULAR_LOCATIONS: LocationData[] = [
  { name: 'Mumbai', region: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Chennai', region: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Delhi', region: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Los Angeles', region: 'California', country: 'United States', latitude: 34.0522, longitude: -118.2437 },
  { name: 'New York', region: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London', region: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', region: 'Kanto', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', region: 'Île-de-France', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', region: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
];

export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];
    return data.results.map((item: any) => ({
      name: item.name,
      region: item.admin1 || item.admin2 || '',
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  } catch (error) {
    console.warn('Geocoding search network error, falling back to filtered popular list', error);
    return POPULAR_LOCATIONS.filter(l =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.country.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchFullAQIData(location: LocationData): Promise<FullAQIData> {
  const { latitude, longitude, name } = location;

  try {
    const [aqiRes, weatherRes] = await Promise.all([
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5,pm10&forecast_days=3`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,precipitation_probability_max,sunrise,sunset&timezone=auto`
      ),
    ]);

    if (!aqiRes.ok || !weatherRes.ok) {
      throw new Error('Air quality or weather data fetch failed');
    }

    const aqiJson = await aqiRes.json();
    const weatherJson = await weatherRes.json();

    const currAqi = aqiJson.current || {};
    const currWeather = weatherJson.current || {};
    const dailyWeather = weatherJson.daily || {};
    const hourlyWeather = weatherJson.hourly || {};
    const hourlyAqi = aqiJson.hourly || {};

    const rawAqi = currAqi.us_aqi ? Math.round(currAqi.us_aqi) : 42;
    const aqi = Math.max(0, Math.min(500, rawAqi));
    const levelInfo = getAQILevel(aqi);

    const pm25Val = Number((currAqi.pm2_5 || 10.2).toFixed(1));
    const pm10Val = Number((currAqi.pm10 || 18.5).toFixed(1));
    const o3Val = Number((currAqi.ozone || 45.0).toFixed(1));
    const no2Val = Number((currAqi.nitrogen_dioxide || 14.3).toFixed(1));
    const so2Val = Number((currAqi.sulphur_dioxide || 3.1).toFixed(1));
    const coVal = Number(((currAqi.carbon_monoxide || 350) / 1000).toFixed(2)); // convert ug to mg/m3 approx

    const pollutants: PollutantDetail[] = [
      {
        code: 'pm2_5',
        name: 'Fine Particles',
        formula: 'PM2.5',
        value: pm25Val,
        unit: 'µg/m³',
        category: pm25Val <= 12 ? 'Good' : pm25Val <= 35.4 ? 'Moderate' : pm25Val <= 55.4 ? 'Unhealthy for Sensitive Groups' : 'Unhealthy',
        whoLimit: 15, // 24hr WHO guideline
        pctOfLimit: Math.round((pm25Val / 15) * 100),
        description: 'Microscopic inhalable droplets from smoke, exhaust, and industrial combustion.',
        mainSources: 'Vehicle emissions, wildfire smoke, industrial burning.',
      },
      {
        code: 'pm10',
        name: 'Coarse Dust',
        formula: 'PM10',
        value: pm10Val,
        unit: 'µg/m³',
        category: pm10Val <= 54 ? 'Good' : pm10Val <= 154 ? 'Moderate' : 'Unhealthy for Sensitive Groups',
        whoLimit: 45,
        pctOfLimit: Math.round((pm10Val / 45) * 100),
        description: 'Inhalable particulate matter such as pollen, road dust, mold, and construction debris.',
        mainSources: 'Road dust, construction, windblown soil, agricultural tilling.',
      },
      {
        code: 'o3',
        name: 'Surface Ozone',
        formula: 'O₃',
        value: o3Val,
        unit: 'µg/m³',
        category: o3Val <= 100 ? 'Good' : o3Val <= 160 ? 'Moderate' : 'Unhealthy for Sensitive Groups',
        whoLimit: 100,
        pctOfLimit: Math.round((o3Val / 100) * 100),
        description: 'Ground-level ozone formed by chemical reactions between sunlight and VOCs / NOx.',
        mainSources: 'Chemical solvent vapors, urban motor vehicle exhaust under intense sunlight.',
      },
      {
        code: 'no2',
        name: 'Nitrogen Dioxide',
        formula: 'NO₂',
        value: no2Val,
        unit: 'µg/m³',
        category: no2Val <= 40 ? 'Good' : no2Val <= 100 ? 'Moderate' : 'Unhealthy for Sensitive Groups',
        whoLimit: 25,
        pctOfLimit: Math.round((no2Val / 25) * 100),
        description: 'Gaseous pollutant causing respiratory inflammation, bronchial spasms, and haze.',
        mainSources: 'Diesel combustion, power plant emissions, domestic gas stoves.',
      },
      {
        code: 'so2',
        name: 'Sulfur Dioxide',
        formula: 'SO₂',
        value: so2Val,
        unit: 'µg/m³',
        category: so2Val <= 40 ? 'Good' : 'Moderate',
        whoLimit: 40,
        pctOfLimit: Math.round((so2Val / 40) * 100),
        description: 'Toxic pungent gas produced by burning fossil fuels and smelting mineral ores.',
        mainSources: 'Coal plants, oil refineries, cargo ships, volcano plumes.',
      },
      {
        code: 'co',
        name: 'Carbon Monoxide',
        formula: 'CO',
        value: coVal,
        unit: 'mg/m³',
        category: coVal <= 4 ? 'Good' : 'Moderate',
        whoLimit: 4,
        pctOfLimit: Math.round((coVal / 4) * 100),
        description: 'Colorless, odorless asphyxiant gas from incomplete combustion.',
        mainSources: 'Defective heaters, vehicle engines, indoor tobacco smoke.',
      },
    ];

    // Determine dominant pollutant
    let dominantPollutant = 'PM2.5';
    let maxPct = -1;
    for (const p of pollutants) {
      if (p.pctOfLimit > maxPct) {
        maxPct = p.pctOfLimit;
        dominantPollutant = p.formula;
      }
    }

    const tempC = Math.round(currWeather.temperature_2m ?? 21);
    const tempF = Math.round((tempC * 9) / 5 + 32);
    const feelsLikeC = Math.round(currWeather.apparent_temperature ?? tempC);
    const feelsLikeF = Math.round((feelsLikeC * 9) / 5 + 32);
    const weatherCode = currWeather.weather_code ?? 1;
    const weatherTrans = translateWeatherCode(weatherCode);

    const uvToday = dailyWeather.uv_index_max?.[0] ?? 4.5;
    const sunriseStr = dailyWeather.sunrise?.[0] ? formatTimeStr(dailyWeather.sunrise[0]) : '06:22 AM';
    const sunsetStr = dailyWeather.sunset?.[0] ? formatTimeStr(dailyWeather.sunset[0]) : '07:45 PM';

    const weather = {
      tempC,
      tempF,
      feelsLikeC,
      feelsLikeF,
      humidity: Math.round(currWeather.relative_humidity_2m ?? 55),
      windSpeedKmH: Math.round(currWeather.wind_speed_10m ?? 12),
      windDirectionDeg: currWeather.wind_direction_10m ?? 180,
      windDirectionText: degToCompass(currWeather.wind_direction_10m ?? 180),
      uvIndex: Number(uvToday.toFixed(1)),
      pressureHpa: Math.round(currWeather.surface_pressure ?? 1013),
      visibilityKm: 10,
      dewPointC: Math.round(tempC - (100 - (currWeather.relative_humidity_2m ?? 55)) / 5),
      weatherCode,
      weatherDescription: weatherTrans.text,
      isDay: currWeather.is_day !== 0,
      sunrise: sunriseStr,
      sunset: sunsetStr,
    };

    // Hourly projection (next 24 hours)
    const hourly: HourlyDataPoint[] = [];
    const hourlyTimes: string[] = hourlyWeather.time || [];
    const nowIso = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
    let startIndex = hourlyTimes.findIndex((t: string) => t.startsWith(nowIso));
    if (startIndex === -1) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, hourlyTimes.length); i++) {
      const timeRaw = hourlyTimes[i];
      const hAqi = hourlyAqi.us_aqi?.[i] ? Math.round(hourlyAqi.us_aqi[i]) : aqi;
      const hTempC = hourlyWeather.temperature_2m?.[i] ? Math.round(hourlyWeather.temperature_2m[i]) : tempC;
      const hPm25 = hourlyAqi.pm2_5?.[i] ? Number(hourlyAqi.pm2_5[i].toFixed(1)) : pm25Val;
      const hCode = hourlyWeather.weather_code?.[i] ?? weatherCode;
      const hPrecipProb = hourlyWeather.precipitation_probability?.[i] != null ? Math.round(hourlyWeather.precipitation_probability[i]) : 0;
      const hPrecipMm = hourlyWeather.precipitation?.[i] != null ? Number(hourlyWeather.precipitation[i].toFixed(1)) : 0;

      hourly.push({
        time: timeRaw,
        displayTime: formatHourDisplay(timeRaw),
        aqi: Math.max(5, Math.min(450, hAqi)),
        tempC: hTempC,
        tempF: Math.round((hTempC * 9) / 5 + 32),
        pm2_5: hPm25,
        weatherCode: hCode,
        weatherDescription: translateWeatherCode(hCode).text,
        precipitationProbability: hPrecipProb,
        precipitationMm: hPrecipMm,
      });
    }

    // Calculate smart RainForecastInfo
    const currentPrecipMm = currWeather.precipitation != null ? Number(currWeather.precipitation.toFixed(1)) : 0;
    const isRainingNow = currentPrecipMm > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
    const todayMaxProb = dailyWeather.precipitation_probability_max?.[0] != null
      ? Math.round(dailyWeather.precipitation_probability_max[0])
      : Math.max(...hourly.slice(0, 12).map(h => h.precipitationProbability || 0), 0);
    const todayTotalMm = dailyWeather.precipitation_sum?.[0] != null
      ? Number(dailyWeather.precipitation_sum[0].toFixed(1))
      : Number(hourly.slice(0, 12).reduce((sum, h) => sum + (h.precipitationMm || 0), 0).toFixed(1));

    // Find the next hour rain is expected (> 35% probability or precipitation > 0.1 mm)
    let nextRainExpectedTime: string | null = null;
    let nextRainHoursAway: number | null = null;
    let rainExpectedSummary = 'No rain expected in the next 24 hours';

    if (isRainingNow) {
      rainExpectedSummary = 'Rain is currently falling in this area';
      nextRainExpectedTime = 'Now';
      nextRainHoursAway = 0;
    } else {
      for (let hIdx = 0; hIdx < hourly.length; hIdx++) {
        const h = hourly[hIdx];
        if ((h.precipitationProbability && h.precipitationProbability >= 35) || (h.precipitationMm && h.precipitationMm >= 0.2)) {
          nextRainExpectedTime = h.displayTime;
          nextRainHoursAway = hIdx === 0 ? 1 : hIdx;
          const probText = h.precipitationProbability ? ` (${h.precipitationProbability}% chance)` : '';
          rainExpectedSummary = nextRainHoursAway <= 1
            ? `Rain is expected within the next hour${probText}`
            : `Rain expected around ${h.displayTime} (in ~${nextRainHoursAway} hrs)${probText}`;
          break;
        }
      }
    }

    const rainForecast: RainForecastInfo = {
      isRainingNow,
      currentPrecipitationMm: currentPrecipMm,
      currentProbability: hourly[0]?.precipitationProbability ?? (isRainingNow ? 100 : 0),
      nextRainExpectedTime,
      nextRainHoursAway,
      rainExpectedSummary,
      todayMaxRainChance: todayMaxProb,
      expectedTotalMmToday: todayTotalMm,
    };

    // Daily projection (next 7 days)
    const daily: DailyDataPoint[] = [];
    const dailyDates: string[] = dailyWeather.time || [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
      const dateStr = dailyDates[i];
      const d = new Date(dateStr);
      const dayName = i === 0 ? 'Today' : dayNames[d.getDay()];
      const maxC = Math.round(dailyWeather.temperature_2m_max?.[i] ?? tempC + 3);
      const minC = Math.round(dailyWeather.temperature_2m_min?.[i] ?? tempC - 4);
      const code = dailyWeather.weather_code?.[i] ?? weatherCode;
      const dayProbMax = dailyWeather.precipitation_probability_max?.[i] != null ? Math.round(dailyWeather.precipitation_probability_max[i]) : 0;
      const dayPrecipSum = dailyWeather.precipitation_sum?.[i] != null ? Number(dailyWeather.precipitation_sum[i].toFixed(1)) : 0;
      
      // Slight simulated daily variation around current aqi
      const variance = (i * 7) % 25 - 10;
      const dayAqi = Math.max(15, Math.min(300, aqi + variance));

      daily.push({
        date: dateStr,
        dayName,
        maxTempC: maxC,
        minTempC: minC,
        maxTempF: Math.round((maxC * 9) / 5 + 32),
        minTempF: Math.round((minC * 9) / 5 + 32),
        avgAqi: dayAqi,
        category: getAQILevel(dayAqi).category,
        weatherCode: code,
        weatherDescription: translateWeatherCode(code).text,
        precipitationProbabilityMax: dayProbMax,
        precipitationSumMm: dayPrecipSum,
      });
    }

    return {
      location,
      aqi,
      levelInfo,
      dominantPollutant,
      pollutants,
      weather,
      rainForecast,
      hourly,
      daily,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stationName: `${name} Ambient Air Monitoring Station`,
      isLiveApi: true,
    };
  } catch (err) {
    console.warn('Using robust fallback data for location:', location.name, err);
    return getFallbackAQIData(location);
  }
}

function formatTimeStr(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '06:00 AM';
  }
}

function formatHourDisplay(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch {
    return '12 PM';
  }
}

export function getFallbackAQIData(location: LocationData): FullAQIData {
  // Deterministic values based on city name for consistency
  let baseAqi = 48;
  if (location.name === 'Delhi' || location.name === 'Beijing') baseAqi = 168;
  else if (location.name === 'Los Angeles') baseAqi = 68;
  else if (location.name === 'London') baseAqi = 38;
  else if (location.name === 'New York') baseAqi = 52;
  else if (location.name === 'Tokyo') baseAqi = 32;

  const levelInfo = getAQILevel(baseAqi);

  const pollutants: PollutantDetail[] = [
    {
      code: 'pm2_5',
      name: 'Fine Particles',
      formula: 'PM2.5',
      value: baseAqi > 100 ? 58.4 : 12.2,
      unit: 'µg/m³',
      category: baseAqi > 100 ? 'Unhealthy' : 'Good',
      whoLimit: 15,
      pctOfLimit: baseAqi > 100 ? 389 : 81,
      description: 'Microscopic inhalable droplets from smoke, exhaust, and combustion.',
      mainSources: 'Vehicle emissions, wildfire smoke, industrial burning.',
    },
    {
      code: 'pm10',
      name: 'Coarse Dust',
      formula: 'PM10',
      value: baseAqi > 100 ? 112.0 : 22.4,
      unit: 'µg/m³',
      category: baseAqi > 100 ? 'Moderate' : 'Good',
      whoLimit: 45,
      pctOfLimit: baseAqi > 100 ? 248 : 50,
      description: 'Inhalable particulate matter such as pollen, road dust, and construction.',
      mainSources: 'Road dust, construction, windblown soil.',
    },
    {
      code: 'o3',
      name: 'Surface Ozone',
      formula: 'O₃',
      value: 62.0,
      unit: 'µg/m³',
      category: 'Moderate',
      whoLimit: 100,
      pctOfLimit: 62,
      description: 'Ground-level ozone formed by chemical reactions in sunlight.',
      mainSources: 'Solvent vapors, vehicular exhaust, power plants.',
    },
    {
      code: 'no2',
      name: 'Nitrogen Dioxide',
      formula: 'NO₂',
      value: 28.5,
      unit: 'µg/m³',
      category: 'Good',
      whoLimit: 25,
      pctOfLimit: 114,
      description: 'Respiratory irritant from fossil fuel burning.',
      mainSources: 'Vehicle engines, furnaces, power generation.',
    },
    {
      code: 'so2',
      name: 'Sulfur Dioxide',
      formula: 'SO₂',
      value: 6.2,
      unit: 'µg/m³',
      category: 'Good',
      whoLimit: 40,
      pctOfLimit: 15,
      description: 'Gaseous pollutant from industrial coal and fuel refining.',
      mainSources: 'Coal combustion, refineries, marine diesel.',
    },
    {
      code: 'co',
      name: 'Carbon Monoxide',
      formula: 'CO',
      value: 0.68,
      unit: 'mg/m³',
      category: 'Good',
      whoLimit: 4,
      pctOfLimit: 17,
      description: 'Colorless toxic gas from incomplete fuel combustion.',
      mainSources: 'Vehicle exhaust, stoves, tobacco smoke.',
    },
  ];

  const hourly: HourlyDataPoint[] = [];
  const hours = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
  for (let i = 0; i < 8; i++) {
    hourly.push({
      time: `2026-09-16T${i * 3}:00:00`,
      displayTime: hours[i],
      aqi: Math.max(15, baseAqi + (i % 3) * 8 - 10),
      tempC: 20 + (i > 3 && i < 7 ? 5 : 0),
      tempF: 68 + (i > 3 && i < 7 ? 9 : 0),
      pm2_5: Number((12 + (i % 4) * 3).toFixed(1)),
      weatherCode: 1,
      weatherDescription: 'Mainly Clear',
    });
  }

  const daily: DailyDataPoint[] = [
    { date: '2026-09-16', dayName: 'Today', maxTempC: 24, minTempC: 16, maxTempF: 75, minTempF: 61, avgAqi: baseAqi, category: levelInfo.category, weatherCode: 1, weatherDescription: 'Sunny' },
    { date: '2026-09-17', dayName: 'Thu', maxTempC: 25, minTempC: 17, maxTempF: 77, minTempF: 63, avgAqi: baseAqi + 5, category: getAQILevel(baseAqi + 5).category, weatherCode: 2, weatherDescription: 'Partly Cloudy' },
    { date: '2026-09-18', dayName: 'Fri', maxTempC: 23, minTempC: 15, maxTempF: 73, minTempF: 59, avgAqi: Math.max(20, baseAqi - 10), category: getAQILevel(baseAqi - 10).category, weatherCode: 0, weatherDescription: 'Clear' },
    { date: '2026-09-19', dayName: 'Sat', maxTempC: 22, minTempC: 14, maxTempF: 72, minTempF: 57, avgAqi: baseAqi, category: levelInfo.category, weatherCode: 3, weatherDescription: 'Overcast' },
    { date: '2026-09-20', dayName: 'Sun', maxTempC: 21, minTempC: 15, maxTempF: 70, minTempF: 59, avgAqi: baseAqi + 12, category: getAQILevel(baseAqi + 12).category, weatherCode: 61, weatherDescription: 'Light Rain' },
    { date: '2026-09-21', dayName: 'Mon', maxTempC: 23, minTempC: 16, maxTempF: 73, minTempF: 61, avgAqi: baseAqi - 5, category: getAQILevel(baseAqi - 5).category, weatherCode: 1, weatherDescription: 'Clear' },
    { date: '2026-09-22', dayName: 'Tue', maxTempC: 26, minTempC: 18, maxTempF: 79, minTempF: 64, avgAqi: baseAqi + 8, category: getAQILevel(baseAqi + 8).category, weatherCode: 2, weatherDescription: 'Partly Cloudy' },
  ];

  return {
    location,
    aqi: baseAqi,
    levelInfo,
    dominantPollutant: baseAqi > 100 ? 'PM2.5' : 'O₃',
    pollutants,
    weather: {
      tempC: 22,
      tempF: 72,
      feelsLikeC: 22,
      feelsLikeF: 72,
      humidity: 58,
      windSpeedKmH: 14,
      windDirectionDeg: 230,
      windDirectionText: 'SW',
      uvIndex: 5.2,
      pressureHpa: 1014,
      visibilityKm: 10,
      dewPointC: 13,
      weatherCode: 1,
      weatherDescription: 'Mainly Clear',
      isDay: true,
      sunrise: '06:34 AM',
      sunset: '07:18 PM',
    },
    hourly,
    daily,
    rainForecast: {
      isRainingNow: false,
      currentPrecipitationMm: 0,
      currentProbability: 10,
      nextRainExpectedTime: 'Tomorrow at 4:00 PM',
      nextRainHoursAway: 28,
      rainExpectedSummary: 'No rain expected today. Next chance tomorrow evening.',
      todayMaxRainChance: 15,
      expectedTotalMmToday: 0,
    },
    lastUpdated: 'Just now',
    stationName: `${location.name} Ambient Quality Monitoring Station`,
    isLiveApi: false,
  };
}
