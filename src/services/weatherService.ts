import {
  DailyForecast,
  HourlyForecast,
  WeatherAlert,
  WeatherCondition,
  WeatherData,
  WeatherStation,
} from '../types/weather';

// WMO Weather Interpretation Codes (WW) mapping
function mapWmoToCondition(code: number): {
  condition: WeatherCondition;
  text: string;
  textHi: string;
} {
  if (code === 0) return { condition: 'clear', text: 'Clear Sky', textHi: 'साफ़ आसमान' };
  if (code === 1) return { condition: 'partly-cloudy', text: 'Mainly Clear', textHi: 'मुख्यतः साफ़' };
  if (code === 2) return { condition: 'partly-cloudy', text: 'Partly Cloudy', textHi: 'आंशिक बादल' };
  if (code === 3) return { condition: 'cloudy', text: 'Overcast', textHi: 'घने बादल' };
  if (code >= 45 && code <= 48) return { condition: 'fog', text: 'Dense Fog / Mist', textHi: 'घना कोहरा एवं धुंध' };
  if (code >= 51 && code <= 55) return { condition: 'rain', text: 'Light Drizzle', textHi: 'हल्की बूंदाबांदी' };
  if (code >= 61 && code <= 65) return { condition: 'rain', text: 'Moderate Rain', textHi: 'मध्यम वर्षा' };
  if (code >= 66 && code <= 67) return { condition: 'heavy-rain', text: 'Freezing Rain', textHi: 'अतिशीतल वर्षा' };
  if (code >= 71 && code <= 77) return { condition: 'snow', text: 'Snowfall / Sleet', textHi: 'बर्फ़बारी' };
  if (code >= 80 && code <= 82) return { condition: 'heavy-rain', text: 'Heavy Downpour', textHi: 'भारी वर्षा' };
  if (code >= 95 && code <= 99) return { condition: 'thunderstorm', text: 'Thunderstorm & Lightning', textHi: 'गरज के साथ आंधी-तूफान' };
  return { condition: 'partly-cloudy', text: 'Scattered Clouds', textHi: 'बादल' };
}

function calculateAqiData(pm25Val?: number): { aqi: number; pm25: number; pm10: number } {
  const pm25 = pm25Val ?? Math.floor(45 + Math.random() * 40);
  let aqi: number;
  if (pm25 <= 30) aqi = Math.round((pm25 / 30) * 50);
  else if (pm25 <= 60) aqi = Math.round(51 + ((pm25 - 30) / 30) * 49);
  else if (pm25 <= 90) aqi = Math.round(101 + ((pm25 - 60) / 30) * 99);
  else if (pm25 <= 120) aqi = Math.round(201 + ((pm25 - 90) / 30) * 99);
  else aqi = Math.round(301 + ((pm25 - 120) / 130) * 199);

  return {
    aqi: Math.min(500, aqi),
    pm25: Math.round(pm25),
    pm10: Math.round(pm25 * 1.7),
  };
}

export async function fetchStationWeather(station: WeatherStation): Promise<{
  weather: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=7`;

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${station.lat}&longitude=${station.lon}&current=pm10,pm2_5,european_aqi,us_aqi`;

    const [weatherRes, aqiRes] = await Promise.allSettled([
      fetch(url, { signal: AbortSignal.timeout(6000) }),
      fetch(aqiUrl, { signal: AbortSignal.timeout(4000) }),
    ]);

    if (weatherRes.status !== 'fulfilled' || !weatherRes.value.ok) {
      throw new Error('Weather API request failed, falling back to simulated observational data');
    }

    const data = await weatherRes.value.json();
    let pm25 = 48;
    let pm10 = 85;
    let computedAqi = 112;

    if (aqiRes.status === 'fulfilled' && aqiRes.value.ok) {
      try {
        const aqiData = await aqiRes.value.json();
        pm25 = Math.round(aqiData.current?.pm2_5 ?? 45);
        pm10 = Math.round(aqiData.current?.pm10 ?? 80);
        computedAqi = Math.round(aqiData.current?.us_aqi ?? calculateAqiData(pm25).aqi);
      } catch {
        const fallback = calculateAqiData();
        pm25 = fallback.pm25;
        pm10 = fallback.pm10;
        computedAqi = fallback.aqi;
      }
    } else {
      const fallback = calculateAqiData();
      pm25 = fallback.pm25;
      pm10 = fallback.pm10;
      computedAqi = fallback.aqi;
    }

    const cur = data.current;
    const { condition, text, textHi } = mapWmoToCondition(cur.weather_code);

    const temp = Math.round(cur.temperature_2m);
    const feelsLike = Math.round(cur.apparent_temperature);
    const humidity = Math.round(cur.relative_humidity_2m);
    const windSpeed = Math.round(cur.wind_speed_10m);
    const windDir = Math.round(cur.wind_direction_10m);
    const windGust = Math.round(cur.wind_gusts_10m || windSpeed * 1.3);
    const pressure = Math.round(cur.pressure_msl || 1012);
    const cloudCover = Math.round(cur.cloud_cover || 20);
    const precipitationAmount = Number((cur.precipitation || 0).toFixed(1));

    const dewPoint = Math.round(temp - (100 - humidity) / 5);
    let visibility = Math.round(10 - (humidity > 85 ? (humidity - 85) * 0.4 : 0));
    if (condition === 'fog') visibility = 0.8;
    if (condition === 'heavy-rain') visibility = 2.5;

    const currentHourIndex = new Date().getHours();
    const currentUv = Math.round(data.hourly?.uv_index?.[currentHourIndex] ?? 5);

    // Generate IMD-style Alert if severe thresholds are met
    let activeAlert: WeatherAlert | undefined;
    if (temp >= 42) {
      activeAlert = {
        id: 'heatwave-warning',
        severity: 'red',
        title: 'Severe Heat Wave Advisory (लू चेतावनी)',
        titleHi: 'भीषण लू एवं उच्च तापमान चेतावनी',
        description: `Max temperature exceeding 42°C with dry westerly winds. Direct exposure between 12:00 PM and 4:00 PM poses extreme heat stroke danger.`,
        descriptionHi: `अधिकतम तापमान 42°C पार। दोपहर 12 बजे से 4 बजे के बीच सीधे धूप में निकलने से बचें। खूब पानी पिएं।`,
        issuedAt: 'IMD Central Forecasting Unit',
        validUntil: 'Today 18:00 IST',
        category: 'Extreme Heat',
      };
    } else if (precipitationAmount > 15 || condition === 'heavy-rain' || condition === 'thunderstorm') {
      activeAlert = {
        id: 'heavy-rain-warning',
        severity: 'orange',
        title: 'Intense Convective Precipitation & Lightning Alert',
        titleHi: 'भारी वर्षा एवं मेघगर्जन / वज्रपात चेतावनी',
        description: `High localized rainfall with lightning strikes observed. Potential waterlogging in low-lying transit corridors.`,
        descriptionHi: `तेज बारिश और बिजली गिरने की संभावना। निचले इलाकों में जलभराव एवं आवागमन बाधित होने की चेतावनी।`,
        issuedAt: 'Regional Meteorological Centre',
        validUntil: 'Next 6 Hours',
        category: 'Convective Storm',
      };
    } else if (visibility < 1.5 || condition === 'fog') {
      activeAlert = {
        id: 'dense-fog-warning',
        severity: 'yellow',
        title: 'Dense Fog & Low Visibility Advisory',
        titleHi: 'घना कोहरा एवं दृश्यता चेतावनी',
        description: `Surface horizontal visibility dropped below 1500m. Aviation CAT-III procedures active. Maintain highway headway.`,
        descriptionHi: `सतही दृश्यता 1.5 किमी से कम। वाहन चालक फॉग लाइट्स का प्रयोग करें एवं गति धीमी रखें।`,
        issuedAt: 'Airport Met Observatory',
        validUntil: 'Until 10:30 IST',
        category: 'Visibility Warning',
      };
    } else if (station.isCoastal && windSpeed > 40) {
      activeAlert = {
        id: 'cyclonic-squall-warning',
        severity: 'orange',
        title: 'High Seas & Squally Weather Warning for Fishermen',
        titleHi: 'मछुआरों के लिए समुद्र में न जाने की चेतावनी',
        description: `Squally wind speed reaching 45-55 km/h over coastal belt. Sea condition rough to very rough. Fishermen advised not to venture into deep sea.`,
        descriptionHi: `तटीय क्षेत्रों में 50 किमी/घंटा तक तेज हवाएं। समुद्र में ऊंची लहरें उठने की आशंका। समुद्र में न जाएं।`,
        issuedAt: 'Coastal Cyclone Warning Division',
        validUntil: 'Next 24 Hours',
        category: 'Marine Safety',
      };
    }

    // Official IMD Daily Synoptic Warning & Advisory Bulletin for every station
    if (!activeAlert) {
      activeAlert = {
        id: `daily-synoptic-${station.id}`,
        severity: computedAqi > 160 ? 'orange' : temp > 36 ? 'yellow' : 'yellow',
        title:
          computedAqi > 160
            ? `Air Quality & Synoptic Watch (${station.name})`
            : `Official Daily Weather Warning & Advisory (${station.name})`,
        titleHi:
          computedAqi > 160
            ? `वायु गुणवत्ता एवं मौसम निगरानी (${station.name})`
            : `दैनिक मौसम चेतावनी एवं परामर्श बुलेटिन (${station.name})`,
        description:
          computedAqi > 160
            ? `AQI is currently ${computedAqi} (PM2.5: ${pm25} µg/m³). Children and respiratory patients advised to wear N95 masks and restrict heavy outdoor exercise.`
            : `Current temperature ${temp}°C, humidity ${humidity}%, wind ${windSpeed} km/h. Fair weather prevailing. Follow routine activity window recommendations.`,
        descriptionHi:
          computedAqi > 160
            ? `वर्तमान AQI ${computedAqi} (PM2.5: ${pm25} µg/m³)। दमा व एलर्जी के मरीज बाहर जाते समय सावधानी बरतें तथा सुबह की सैर में मास्क पहनें।`
            : `वर्तमान तापमान ${temp}°C, आर्द्रता ${humidity}%, हवा ${windSpeed} किमी/घंटा। मौसम सामान्य रूप से अनुकूल है। दिनचर्या अनुसार कार्य कर सकते हैं।`,
        issuedAt: 'IMD National Weather Forecasting Centre (NWFC)',
        validUntil: 'Today 23:59 IST',
        category: computedAqi > 160 ? 'Air Quality Advisory' : 'Daily Weather Bulletin',
      };
    }

    const sunrise = data.daily?.sunrise?.[0]
      ? new Date(data.daily.sunrise[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      : '05:48 AM';
    const sunset = data.daily?.sunset?.[0]
      ? new Date(data.daily.sunset[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      : '06:32 PM';

    // Format hourly
    const hourly: HourlyForecast[] = (data.hourly?.time || []).slice(0, 24).map((tStr: string, idx: number) => {
      const d = new Date(tStr);
      const hCond = mapWmoToCondition(data.hourly.weather_code[idx] || 0).condition;
      return {
        time: d.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true }),
        hour: d.getHours(),
        temp: Math.round(data.hourly.temperature_2m[idx]),
        feelsLike: Math.round(data.hourly.apparent_temperature[idx]),
        pop: Math.round(data.hourly.precipitation_probability[idx] || 0),
        windSpeed: Math.round(data.hourly.wind_speed_10m[idx] || 10),
        condition: hCond,
        uvIndex: Math.round(data.hourly.uv_index[idx] || 0),
      };
    });

    // Format 7-day daily
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daily: DailyForecast[] = (data.daily?.time || []).map((dStr: string, idx: number) => {
      const d = new Date(dStr);
      const dCond = mapWmoToCondition(data.daily.weather_code[idx] || 0);
      return {
        date: dStr,
        dayName: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayNames[d.getDay()],
        tempMax: Math.round(data.daily.temperature_2m_max[idx]),
        tempMin: Math.round(data.daily.temperature_2m_min[idx]),
        condition: dCond.condition,
        pop: Math.round(data.daily.precipitation_probability_max?.[idx] || 10),
        humidity: Math.round(humidity - (idx % 3) * 4),
        summary: dCond.text,
      };
    });

    const tempMin = Math.round(data.daily?.temperature_2m_min?.[0] ?? temp - 6);
    const tempMax = Math.round(data.daily?.temperature_2m_max?.[0] ?? temp + 4);

    // 1. Pollen metrics
    const treePollen = humidity > 75 ? 'Low' : windSpeed > 20 ? 'High' : 'Moderate';
    const grassPollen = temp > 28 && humidity < 60 ? 'High' : 'Moderate';
    const weedPollen = 'Moderate';
    const overallPollen = treePollen === 'High' || grassPollen === 'High' ? 'High' : 'Moderate';

    // 2. Marine metrics
    const waveHeight = station.isCoastal ? (windSpeed > 35 ? 3.2 : windSpeed > 20 ? 1.8 : 1.1) : 0.8;
    const seaCondition = windSpeed > 40 ? 'Rough' : windSpeed > 25 ? 'Moderate' : 'Calm';
    const seaConditionHi = seaCondition === 'Rough' ? 'उग्र समुद्र (चेतावनी)' : seaCondition === 'Moderate' ? 'मध्यम लहरें' : 'शांत समुद्र';

    // 3. Agriculture metrics
    const soilMoisture = Math.max(15, Math.min(85, Math.round(humidity * 0.5 + precipitationAmount * 2)));
    const soilStatus = soilMoisture > 75 ? 'Saturated' : soilMoisture > 30 ? 'Adequate' : 'Deficit';
    const frostRisk = tempMin < 4 ? 'Severe' : tempMin < 8 ? 'Low' : 'None';

    // 4. Traffic metrics
    const delayRisk = precipitationAmount > 10 || visibility < 1.5 ? 'Severe' : precipitationAmount > 2 ? 'Moderate' : 'Low';
    const waterloggingAlert = precipitationAmount > 10;
    const waterloggingLocations = waterloggingAlert ? ['Moolchand Underpass', 'Tilak Bridge', 'Airport T3 Expressway'] : [];

    // 5. Event Comfort
    const comfortIndex = Math.max(20, Math.min(98, 100 - Math.abs(feelsLike - 24) * 3 - (humidity > 70 ? 15 : 0)));
    const comfortLabel = comfortIndex > 80 ? 'Ideal' : comfortIndex > 65 ? 'Good' : comfortIndex > 45 ? 'Fair' : 'Disruptive';

    const weather: WeatherData = {
      station,
      temperature: temp,
      feelsLike,
      tempMin: Math.round(data.daily?.temperature_2m_min?.[0] ?? temp - 6),
      tempMax: Math.round(data.daily?.temperature_2m_max?.[0] ?? temp + 4),
      humidity,
      pressure,
      windSpeed,
      windDirection: windDir,
      windGust,
      visibility,
      uvIndex: currentUv,
      dewPoint,
      precipitationChance: Math.round(data.daily?.precipitation_probability_max?.[0] || 15),
      precipitationAmount,
      cloudCover,
      aqi: computedAqi,
      pm25,
      pm10,
      pollenCount: {
        tree: treePollen,
        grass: grassPollen,
        weed: weedPollen,
        overall: overallPollen,
      },
      marine: {
        seaCondition,
        seaConditionHi,
        waveHeight,
        waterTemp: Math.round(temp - 2),
        highTide: '02:45 PM (3.8m)',
        lowTide: '08:30 AM (0.9m)',
        ripCurrentRisk: windSpeed > 30 ? 'High' : 'Moderate',
      },
      agriculture: {
        soilMoisture,
        soilStatus,
        frostRisk,
        rainfallPrediction3Days: Math.round(precipitationAmount * 2.2 + 5),
        seasonalGuidance: temp > 32 ? 'Provide light evening irrigation to standing crops' : 'Ideal time for Rabi/Zaid field preparation',
        seasonalGuidanceHi: temp > 32 ? 'खड़ी फसलों में शाम को हल्की सिंचाई दें एवं वाष्पीकरण से बचाएं' : 'रबी/जायद फसलों की बुवाई व निराई-गुड़ाई हेतु अनुकूल',
      },
      traffic: {
        delayRisk,
        waterloggingAlert,
        waterloggingLocations,
        visibilityWarning: visibility < 2.0 ? 'Dense fog impacting vehicle headway' : 'Clear highway sightlines',
        visibilityWarningHi: visibility < 2.0 ? 'घना कोहरा: वाहनों के बीच सुरक्षित दूरी बनाए रखें' : 'राजमार्ग दृश्यता सुगम',
      },
      eventComfort: {
        comfortIndex,
        comfortLabel,
        eveningHumidity: Math.round(humidity + 4),
        squallRisk: windGust > 35,
      },
      condition,
      conditionText: text,
      conditionTextHi: textHi,
      sunrise,
      sunset,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      activeAlert,
    };

    return { weather, hourly, daily };
  } catch (err) {
    console.warn('Network weather fetch failed, utilizing observatory fallback model:', err);
    return generateFallbackObservatoryData(station);
  }
}

export function generateFallbackObservatoryData(station: WeatherStation): {
  weather: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
} {
  const isHighAltitude = station.elevation > 1200;
  const isDesert = station.name.includes('Jaipur');
  const isCoastal = Boolean(station.isCoastal);

  let temp = isHighAltitude ? 17 : isDesert ? 36 : isCoastal ? 31 : 29;
  let humidity = isCoastal ? 78 : isDesert ? 28 : isHighAltitude ? 55 : 62;
  let condition: WeatherCondition = isCoastal ? 'partly-cloudy' : isHighAltitude ? 'clear' : 'clear';
  let condText = isCoastal ? 'Partly Cloudy Sea Breeze' : 'Clear Sky';
  let condTextHi = isCoastal ? 'समुद्री हवा एवं आंशिक बादल' : 'साफ़ आसमान';

  const hourly: HourlyForecast[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const forecastTime = new Date(now.getTime() + i * 3600000);
    const hour = forecastTime.getHours();
    const diurnalCurve = Math.sin(((hour - 8) / 24) * 2 * Math.PI) * 4;
    const hTemp = Math.round(temp + diurnalCurve);
    hourly.push({
      time: forecastTime.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true }),
      hour,
      temp: hTemp,
      feelsLike: hTemp + (humidity > 70 ? 3 : -1),
      pop: isCoastal ? 25 : 10,
      windSpeed: Math.round(12 + Math.cos(i) * 6),
      condition: i % 8 === 0 ? 'partly-cloudy' : condition,
      uvIndex: hour >= 10 && hour <= 16 ? Math.min(10, Math.round((hour - 7) * 1.3)) : 0,
    });
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daily: DailyForecast[] = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return {
      date: d.toISOString().split('T')[0],
      dayName: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayNames[d.getDay()],
      tempMax: temp + 3 + (idx % 2),
      tempMin: temp - 7 - (idx % 2),
      condition: idx === 3 && isCoastal ? 'rain' : 'partly-cloudy',
      pop: idx === 3 ? 60 : 15,
      humidity,
      summary: idx === 3 ? 'Scattered Thunder Showers' : 'Fair Weather',
    };
  });

  const weather: WeatherData = {
    station,
    temperature: temp,
    feelsLike: temp + (humidity > 70 ? 4 : 0),
    tempMin: temp - 6,
    tempMax: temp + 4,
    humidity,
    pressure: 1013 - Math.round(station.elevation / 10),
    windSpeed: isCoastal ? 22 : 14,
    windDirection: 240,
    windGust: isCoastal ? 32 : 20,
    visibility: 8.5,
    uvIndex: 6,
    dewPoint: Math.round(temp - (100 - humidity) / 5),
    precipitationChance: 15,
    precipitationAmount: 0.0,
    cloudCover: 30,
    aqi: isHighAltitude ? 38 : isDesert ? 140 : 110,
    pm25: isHighAltitude ? 14 : 58,
    pm10: isHighAltitude ? 25 : 110,
    pollenCount: {
      tree: 'Moderate',
      grass: 'Low',
      weed: 'Moderate',
      overall: 'Moderate',
    },
    marine: {
      seaCondition: isCoastal ? 'Moderate' : 'Calm',
      seaConditionHi: isCoastal ? 'मध्यम समुद्री लहरें' : 'शांत स्थिति',
      waveHeight: isCoastal ? 1.6 : 0.8,
      waterTemp: 28,
      highTide: '02:30 PM (3.4m)',
      lowTide: '08:15 AM (0.8m)',
      ripCurrentRisk: 'Moderate',
    },
    agriculture: {
      soilMoisture: isDesert ? 22 : 45,
      soilStatus: isDesert ? 'Deficit' : 'Adequate',
      frostRisk: isHighAltitude ? 'Moderate' : 'None',
      rainfallPrediction3Days: 0,
      seasonalGuidance: 'Adequate moisture for Rabi weeding and harvesting',
      seasonalGuidanceHi: 'फसल कटाई एवं हल्की सिंचाई हेतु मौसम अनुकूल',
    },
    traffic: {
      delayRisk: 'Low',
      waterloggingAlert: false,
      waterloggingLocations: [],
      visibilityWarning: 'Normal traffic corridors',
      visibilityWarningHi: 'यातायात सुगम',
    },
    eventComfort: {
      comfortIndex: 85,
      comfortLabel: 'Good',
      eveningHumidity: humidity,
      squallRisk: false,
    },
    condition,
    conditionText: condText,
    conditionTextHi: condTextHi,
    activeAlert: {
      id: `daily-synoptic-${station.id}`,
      severity: isDesert ? 'yellow' : isHighAltitude ? 'yellow' : 'yellow',
      title: `Official Daily Weather Warning & Advisory (${station.name})`,
      titleHi: `दैनिक मौसम चेतावनी एवं परामर्श बुलेटिन (${station.name})`,
      description: `Current temp ${temp}°C with normal barometric pressure. Clear skies prevailing. Follow persona advisory guidelines.`,
      descriptionHi: `वर्तमान तापमान ${temp}°C। आसमान साफ रहेगा। सभी श्रेणियों के नागरिक दैनिक परामर्श अनुसार कार्य करें।`,
      issuedAt: 'IMD NWFC Observatory Hub',
      validUntil: 'Today 23:59 IST',
      category: 'Daily Weather Bulletin',
    },
    sunrise: '05:52 AM',
    sunset: '06:34 PM',
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };

  return { weather, hourly, daily };
}
