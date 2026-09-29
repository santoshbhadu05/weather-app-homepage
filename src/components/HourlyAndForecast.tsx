import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Flame,
  Compass,
  Umbrella,
  Calendar,
  Clock,
} from 'lucide-react';
import { DailyForecast, HourlyForecast, WeatherCondition, SupportedLanguage } from '../types/weather';
import { t, getLocalizedDayName, getLocalizedConditionText } from '../data/translations';

interface HourlyAndForecastProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  language: SupportedLanguage;
}

function getConditionIcon(condition: WeatherCondition, className = 'h-4 w-4') {
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
      return <CloudLightning className={`${className} text-yellow-400`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'heatwave':
      return <Flame className={`${className} text-rose-500`} />;
    case 'cyclone':
      return <Compass className={`${className} text-red-500`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
}

export const HourlyAndForecast: React.FC<HourlyAndForecastProps> = ({ hourly, daily, language }) => {
  const currentDayIndex = new Date().getDay();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 24-Hour Synoptic Timeline (Compact) in Selected Language */}
      <div className="lg:col-span-6 rounded-2xl border border-blue-900/50 bg-[#071936] p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              {t('hourlyTitle', language)}
            </h3>
          </div>
          <span className="text-[11px] font-mono-data text-slate-400">IMD Synoptic</span>
        </div>

        {/* Scrollable Hourly Strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {hourly.map((h, idx) => (
            <div
              key={idx}
              className={`shrink-0 w-16 p-2 rounded-xl border text-center flex flex-col items-center justify-between space-y-1 text-xs ${
                idx === 0
                  ? 'bg-blue-600/30 border-blue-500/60 text-white font-semibold'
                  : 'bg-[#040e22] border-blue-900/30 text-slate-300'
              }`}
            >
              <div className="text-[10px] font-mono-data text-slate-400">
                {idx === 0 ? t('now', language) : h.time}
              </div>

              <div>
                {getConditionIcon(h.condition, 'h-4 w-4 mx-auto')}
              </div>

              <div className="font-bold text-white font-mono-data">
                {h.temp}°
              </div>

              <div className="flex items-center gap-0.5 text-[9px] font-mono-data text-cyan-300">
                <Umbrella className="h-2.5 w-2.5" />
                <span>{h.pop}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day District Forecast Table in Selected Language */}
      <div className="lg:col-span-6 rounded-2xl border border-blue-900/50 bg-[#071936] p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              {t('sevenDayTitle', language)}
            </h3>
          </div>
          <span className="text-[11px] font-mono-data text-slate-400">Official Bulletin</span>
        </div>

        <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
          {daily.map((d, idx) => {
            const localizedDay = getLocalizedDayName((currentDayIndex + idx) % 7, language);
            const localizedCondition = getLocalizedConditionText(d.condition, language);

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-[#040e22] hover:bg-blue-950/60 border border-blue-900/30 text-xs transition"
              >
                <div className="w-24 font-semibold text-slate-200 text-[11px] truncate">
                  {localizedDay}
                </div>

                <div className="flex items-center gap-1.5 flex-1 px-2 min-w-0">
                  {getConditionIcon(d.condition, 'h-3.5 w-3.5 shrink-0')}
                  <span className="text-[11px] text-slate-300 truncate">
                    {localizedCondition}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono-data text-[11px] shrink-0">
                  {d.pop > 20 && (
                    <span className="text-cyan-400 text-[10px]">🌧️ {d.pop}%</span>
                  )}
                  <span className="text-cyan-300">{d.tempMin}°</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-rose-400 font-bold">{d.tempMax}°C</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
