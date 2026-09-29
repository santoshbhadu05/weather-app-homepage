import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Flame,
  Compass,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Activity,
  Sunrise,
  Sunset,
  AlertTriangle,
  RefreshCw,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { WeatherCondition, WeatherData } from '../types/weather';

interface CompactWeatherBoxProps {
  weather: WeatherData;
  language: 'en' | 'hi';
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

function getWeatherIcon(condition: WeatherCondition, className = 'h-10 w-10') {
  switch (condition) {
    case 'clear':
      return <Sun className={`${className} text-amber-400`} />;
    case 'partly-cloudy':
      return <Cloud className={`${className} text-amber-200`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'rain':
      return <CloudRain className={`${className} text-cyan-400`} />;
    case 'heavy-rain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${className} text-yellow-400 animate-pulse`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'heatwave':
      return <Flame className={`${className} text-rose-500`} />;
    case 'cyclone':
      return <Compass className={`${className} text-red-500 animate-spin`} style={{ animationDuration: '6s' }} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
}

function getAqiBadge(aqi: number, lang: 'en' | 'hi') {
  if (aqi <= 50) return { label: lang === 'hi' ? 'उत्तम' : 'Good', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  if (aqi <= 100) return { label: lang === 'hi' ? 'संतोषजनक' : 'Moderate', text: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/30' };
  if (aqi <= 200) return { label: lang === 'hi' ? 'मध्यम' : 'Poor', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
  if (aqi <= 300) return { label: lang === 'hi' ? 'अस्वास्थ्यकर' : 'Unhealthy', text: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
  return { label: lang === 'hi' ? 'गंभीर' : 'Severe', text: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/30' };
}

export const CompactWeatherBox: React.FC<CompactWeatherBoxProps> = ({
  weather,
  language,
  onRefresh,
  isRefreshing,
}) => {
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
    condition,
    conditionText,
    conditionTextHi,
    precipitationChance,
    precipitationAmount,
    sunrise,
    sunset,
    updatedAt,
    activeAlert,
  } = weather;

  const aqiBadge = getAqiBadge(aqi, language);

  return (
    <div className="rounded-2xl border border-blue-900/50 bg-[#071936] shadow-xl overflow-hidden">
      {/* Box Header Strip: Station Name & Meta */}
      <div className="bg-[#05132b] px-4 py-2 border-b border-blue-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="font-bold text-white text-sm">
            {station.name}
          </span>
          <span className="text-slate-400">({station.state})</span>
          <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 hidden sm:inline-block">
            {station.stationCode}
          </span>
          <span className="text-[10px] text-slate-400 hidden md:inline-block">
            Alt: {station.elevation}m MSL
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono-data text-slate-400">
          <span>{language === 'hi' ? 'अवलोकन समय:' : 'Observed:'} {updatedAt}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 hover:text-white transition cursor-pointer"
              title="Refresh Observatory Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content inside the Unified Box (Compact 2-column on desktop) */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left Side (5 Cols): Temperature & Primary Condition */}
        <div className="lg:col-span-5 flex items-center justify-between sm:justify-start gap-4 sm:gap-6 border-b lg:border-b-0 lg:border-r border-blue-900/40 pb-3 lg:pb-0 lg:pr-5">
          {/* Weather Icon */}
          <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 shrink-0">
            {getWeatherIcon(condition, 'h-12 w-12 sm:h-14 sm:w-14')}
          </div>

          {/* Big Temp & Feels like */}
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono-data tracking-tight">
                {temperature}
              </span>
              <span className="text-2xl font-light text-amber-400">°C</span>
              <span className="ml-3 text-xs text-slate-400">
                {language === 'hi' ? 'महसूस:' : 'Feels:'}{' '}
                <strong className="text-amber-300 font-mono-data">{feelsLike}°C</strong>
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-200 mt-0.5">
              {language === 'hi' ? conditionTextHi : conditionText}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono-data text-slate-400 mt-1">
              <span className="text-rose-400">▲ Max: {tempMax}°C</span>
              <span className="text-cyan-400">▼ Min: {tempMin}°C</span>
              {precipitationChance > 0 && (
                <span className="text-blue-300">🌧️ {precipitationChance}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side (7 Cols): Ultra-Compact 8-Metric Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* 1. Humidity & Dew Point */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <Droplets className="h-3 w-3 text-cyan-400" />
              <span>{language === 'hi' ? 'आर्द्रता (Humidity)' : 'Humidity'}</span>
            </div>
            <div className="text-base font-bold text-white font-mono-data mt-0.5">
              {humidity}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono-data">
              Dew: {dewPoint}°C
            </div>
          </div>

          {/* 2. Wind Speed & Direction */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <Wind className="h-3 w-3 text-teal-400" />
              <span>{language === 'hi' ? 'हवा (Wind)' : 'Wind'}</span>
            </div>
            <div className="text-base font-bold text-white font-mono-data mt-0.5">
              {windSpeed} <span className="text-[10px] font-normal text-slate-400">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono-data">
              {windDirection}° • Gust: {windGust}
            </div>
          </div>

          {/* 3. Air Quality (AQI) */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <Activity className="h-3 w-3 text-emerald-400" />
              <span>{language === 'hi' ? 'वायु गुणवत्ता (AQI)' : 'Air Quality'}</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-base font-bold font-mono-data ${aqiBadge.text}`}>
                {aqi}
              </span>
              <span className={`text-[9px] px-1 py-0.2 rounded border font-semibold ${aqiBadge.bg} ${aqiBadge.text}`}>
                {aqiBadge.label}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono-data">
              PM2.5: {pm25} µg/m³
            </div>
          </div>

          {/* 4. UV Index */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <Sun className="h-3 w-3 text-amber-400" />
              <span>{language === 'hi' ? 'यूवी सूचकांक (UV)' : 'UV Index'}</span>
            </div>
            <div className="text-base font-bold text-white font-mono-data mt-0.5">
              {uvIndex} <span className="text-[10px] text-amber-300 font-normal">/ 11+</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {uvIndex >= 8 ? (language === 'hi' ? 'अति तीव्र' : 'Very High') : uvIndex >= 5 ? (language === 'hi' ? 'मध्यम' : 'Moderate') : (language === 'hi' ? 'सामान्य' : 'Low')}
            </div>
          </div>

          {/* 5. Pressure */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <Gauge className="h-3 w-3 text-amber-400" />
              <span>{language === 'hi' ? 'दबाव (Pressure)' : 'Pressure'}</span>
            </div>
            <div className="text-base font-bold text-white font-mono-data mt-0.5">
              {pressure} <span className="text-[10px] font-normal text-slate-400">hPa</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Station MSL
            </div>
          </div>

          {/* 6. Visibility */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <Eye className="h-3 w-3 text-indigo-400" />
              <span>{language === 'hi' ? 'दृश्यता (Visibility)' : 'Visibility'}</span>
            </div>
            <div className="text-base font-bold text-white font-mono-data mt-0.5">
              {visibility} <span className="text-[10px] font-normal text-slate-400">km</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {visibility < 1.0 ? 'Dense Fog' : visibility < 3 ? 'Moderate Mist' : 'Clear View'}
            </div>
          </div>

          {/* 7. Sunrise & Sunset */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <Sunrise className="h-3 w-3 text-amber-400" />
              <span>{language === 'hi' ? 'सूर्योदय/सूर्यास्त' : 'Sun Schedule'}</span>
            </div>
            <div className="text-[11px] font-mono-data text-white font-medium mt-1">
              🌅 {sunrise}
            </div>
            <div className="text-[11px] font-mono-data text-slate-300">
              🌇 {sunset}
            </div>
          </div>

          {/* 8. Rain Accumulation / Chance */}
          <div className="p-2 rounded-xl bg-[#040e22] border border-blue-900/30">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold uppercase">
              <CloudRain className="h-3 w-3 text-blue-400" />
              <span>{language === 'hi' ? 'वर्षा (Precipitation)' : 'Precipitation'}</span>
            </div>
            <div className="text-base font-bold text-white font-mono-data mt-0.5">
              {precipitationAmount} <span className="text-[10px] font-normal text-slate-400">mm</span>
            </div>
            <div className="text-[10px] text-cyan-300 font-mono-data">
              Chance: {precipitationChance}%
            </div>
          </div>
        </div>
      </div>

      {/* Optional Compact 1-line Active Alert Banner attached to bottom of the box */}
      {activeAlert && (
        <div
          className={`px-4 py-2 border-t flex items-center justify-between gap-2 text-xs ${
            activeAlert.severity === 'red'
              ? 'bg-rose-950/80 border-rose-700/60 text-rose-100'
              : activeAlert.severity === 'orange'
              ? 'bg-amber-950/80 border-amber-700/60 text-amber-100'
              : 'bg-yellow-950/80 border-yellow-700/60 text-yellow-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-white animate-pulse" />
            <span className="font-black uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-black/30">
              IMD {activeAlert.severity.toUpperCase()} ALERT
            </span>
            <span className="font-semibold truncate">
              {language === 'hi' ? activeAlert.titleHi : activeAlert.title}: {language === 'hi' ? activeAlert.descriptionHi : activeAlert.description}
            </span>
          </div>
          <span className="text-[10px] font-mono-data opacity-75 shrink-0 hidden sm:inline-block">
            Valid: {activeAlert.validUntil}
          </span>
        </div>
      )}
    </div>
  );
};
