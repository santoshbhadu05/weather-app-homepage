import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Eye,
  AlertTriangle,
  Sunrise,
  Sunset,
  ShieldAlert,
  Compass as CompassIcon,
  Flame,
  Activity,
} from 'lucide-react';
import { WeatherCondition, WeatherData } from '../types/weather';

interface CurrentWeatherHeroProps {
  weather: WeatherData;
  language: 'en' | 'hi';
}

function getWeatherIcon(condition: WeatherCondition, className = 'h-16 w-16') {
  switch (condition) {
    case 'clear':
      return <Sun className={`${className} text-amber-400 animate-spin`} style={{ animationDuration: '60s' }} />;
    case 'partly-cloudy':
      return <Cloud className={`${className} text-amber-200`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'rain':
      return <CloudRain className={`${className} text-cyan-400`} />;
    case 'heavy-rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${className} text-yellow-400 animate-pulse`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'heatwave':
      return <Flame className={`${className} text-rose-500 animate-bounce`} />;
    case 'cyclone':
      return <CompassIcon className={`${className} text-red-500 animate-spin`} style={{ animationDuration: '5s' }} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
}

function getAqiDescription(aqi: number, lang: 'en' | 'hi'): { label: string; color: string; badgeBg: string } {
  if (aqi <= 50) return { label: lang === 'hi' ? 'उत्तम (Good)' : 'Good', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/30' };
  if (aqi <= 100) return { label: lang === 'hi' ? 'संतोषजनक (Moderate)' : 'Moderate', color: 'text-lime-400', badgeBg: 'bg-lime-500/10 border-lime-500/30' };
  if (aqi <= 200) return { label: lang === 'hi' ? 'मध्यम प्रदूषित (Poor)' : 'Poor', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/30' };
  if (aqi <= 300) return { label: lang === 'hi' ? 'अस्वास्थ्यकर (Unhealthy)' : 'Very Unhealthy', color: 'text-orange-400', badgeBg: 'bg-orange-500/10 border-orange-500/30' };
  return { label: lang === 'hi' ? 'गंभीर / खतरनाक (Hazardous)' : 'Severe / Hazardous', color: 'text-rose-500', badgeBg: 'bg-rose-500/10 border-rose-500/30' };
}

function getUvDescription(uv: number, lang: 'en' | 'hi'): string {
  if (uv <= 2) return lang === 'hi' ? 'अल्प (Low)' : 'Low';
  if (uv <= 5) return lang === 'hi' ? 'मध्यम (Moderate)' : 'Moderate';
  if (uv <= 7) return lang === 'hi' ? 'उच्च (High)' : 'High';
  if (uv <= 10) return lang === 'hi' ? 'अति उच्च (Very High)' : 'Very High';
  return lang === 'hi' ? 'चरम (Extreme 11+)' : 'Extreme 11+';
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({ weather, language }) => {
  const {
    station,
    temperature,
    feelsLike,
    tempMin,
    tempMax,
    humidity,
    pressure,
    windSpeed,
    windDirection,
    windGust,
    visibility,
    uvIndex,
    dewPoint,
    aqi,
    pm25,
    pm10,
    condition,
    conditionText,
    conditionTextHi,
    precipitationChance,
    precipitationAmount,
    sunrise,
    sunset,
    activeAlert,
  } = weather;

  const aqiMeta = getAqiDescription(aqi, language);

  return (
    <div className="space-y-4">
      {/* Active Severe Alert Banner */}
      {activeAlert && (
        <div
          className={`rounded-2xl p-4 border transition-all ${
            activeAlert.severity === 'red'
              ? 'bg-rose-950/70 border-rose-600/80 text-rose-100 shadow-lg shadow-rose-950/40'
              : activeAlert.severity === 'orange'
              ? 'bg-amber-950/70 border-amber-600/80 text-amber-100 shadow-lg shadow-amber-950/40'
              : 'bg-yellow-950/70 border-yellow-600/80 text-yellow-100'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  activeAlert.severity === 'red'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      activeAlert.severity === 'red'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {activeAlert.category} • IMD {activeAlert.severity.toUpperCase()} ALERT
                  </span>
                  <span className="text-xs font-mono-data opacity-75">Valid: {activeAlert.validUntil}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {language === 'hi' ? activeAlert.titleHi : activeAlert.title}
                </h3>
                <p className="text-xs sm:text-sm mt-0.5 text-slate-200">
                  {language === 'hi' ? activeAlert.descriptionHi : activeAlert.description}
                </p>
              </div>
            </div>
            <div className="text-xs font-mono-data text-right shrink-0 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/10">
              <div className="text-[10px] text-slate-400">ISSUED BY</div>
              <div className="font-semibold text-white">{activeAlert.issuedAt}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Meteorological Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {/* Subtle Atmospheric Topography Background lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Station metadata & Primary Temperature */}
          <div className="lg:col-span-6 space-y-4">
            {/* Station Header Badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono-data text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-md">
                STATION ID: {station.stationCode}
              </span>
              <span className="text-slate-400 font-mono-data">
                ALT: {station.elevation}m MSL • {station.lat.toFixed(2)}°N, {station.lon.toFixed(2)}°E
              </span>
              {station.isCoastal && (
                <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded text-[11px] font-medium">
                  COASTAL OBSERVATORY
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif-heading">
                {station.name}
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                {station.state}, {station.country} • {language === 'hi' ? 'लाइव अवलोकन' : 'Observational Synoptic Hour'}
              </p>
            </div>

            {/* Huge Temperature + Condition Visual */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-baseline">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter font-sans">
                  {temperature}
                </span>
                <span className="text-3xl sm:text-4xl font-light text-amber-400 ml-1">°C</span>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                {getWeatherIcon(condition, 'h-14 w-14 sm:h-16 sm:w-16')}
              </div>

              <div className="space-y-1">
                <div className="text-lg sm:text-xl font-bold text-slate-100">
                  {language === 'hi' ? conditionTextHi : conditionText}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">
                  {language === 'hi' ? 'महसूस होता है' : 'Feels like'}{' '}
                  <span className="text-amber-300 font-bold">{feelsLike}°C</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
                  <span className="text-rose-400">▲ {tempMax}°C</span>
                  <span className="text-cyan-400">▼ {tempMin}°C</span>
                </div>
              </div>
            </div>

            {/* Sun Timeline Pill */}
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-400 font-mono-data">
              <div className="flex items-center gap-1.5">
                <Sunrise className="h-4 w-4 text-amber-400" />
                <span>{sunrise}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sunset className="h-4 w-4 text-orange-400" />
                <span>{sunset}</span>
              </div>
              <div className="text-slate-500">
                Precipitation: <span className="text-cyan-300">{precipitationChance}%</span> ({precipitationAmount} mm)
              </div>
            </div>
          </div>

          {/* Right Column: High-Precision Instrument Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Air Quality (AQI) */}
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">AQI INDEX</span>
                <Activity className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black font-mono-data ${aqiMeta.color}`}>{aqi}</span>
                <span className="text-[10px] text-slate-400 font-mono-data">US-EPA</span>
              </div>
              <div className={`text-[11px] font-semibold px-2 py-0.5 rounded border inline-block ${aqiMeta.badgeBg} ${aqiMeta.color}`}>
                {aqiMeta.label}
              </div>
              <div className="text-[10px] text-slate-500 font-mono-data pt-0.5">
                PM2.5: {pm25} µg/m³ • PM10: {pm10}
              </div>
            </div>

            {/* Humidity & Dew Point */}
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">HUMIDITY</span>
                <Droplets className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono-data">{humidity}%</div>
              <div className="text-[11px] text-slate-300">
                Dew point: <span className="text-cyan-300 font-mono-data">{dewPoint}°C</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-cyan-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, humidity)}%` }}
                ></div>
              </div>
            </div>

            {/* Wind Vector */}
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">WIND VECTOR</span>
                <Wind className="h-4 w-4 text-teal-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono-data">{windSpeed}</span>
                <span className="text-xs text-slate-400">km/h</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Dir: <span className="font-mono-data text-amber-300">{windDirection}°</span>
                <span className="text-slate-500 ml-1">Gusts: {windGust}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {windSpeed > 35 ? 'Strong Squall' : windSpeed > 20 ? 'Moderate Breeze' : 'Light Air'}
              </div>
            </div>

            {/* Barometric Pressure */}
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">BAROMETER</span>
                <Gauge className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono-data">{pressure}</span>
                <span className="text-xs text-slate-400">hPa</span>
              </div>
              <div className="text-[11px] text-slate-300">
                {pressure < 1005 ? 'Low (Depression)' : pressure > 1018 ? 'High (Stable)' : 'Normal MSL'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono-data">Station QNH Level</div>
            </div>

            {/* UV Index */}
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">UV INDEX</span>
                <Sun className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono-data">{uvIndex}</span>
                <span className="text-[10px] text-amber-400 font-mono-data">/ 11+</span>
              </div>
              <div className="text-[11px] text-slate-300">{getUvDescription(uvIndex, language)}</div>
              <div className="text-[10px] text-slate-500">
                {uvIndex >= 8 ? 'Sun protection mandatory' : 'Low risk outdoors'}
              </div>
            </div>

            {/* Visibility */}
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">VISIBILITY</span>
                <Eye className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono-data">{visibility}</span>
                <span className="text-xs text-slate-400">km</span>
              </div>
              <div className="text-[11px] text-slate-300">
                {visibility < 1.0 ? 'CAT-III Dense Fog' : visibility < 3.0 ? 'Moderate Mist' : 'Clear Horizon'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono-data">Aviation Runway Met</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
