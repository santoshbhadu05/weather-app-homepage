import React from 'react';
import {
  Sparkles,
  CloudRain,
  Flame,
  Wind,
  Waves,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { PRESET_WEATHER_SCENARIOS } from '../data/weatherScenarios';
import { WeatherScenario, SupportedLanguage } from '../types/weather';
import { t } from '../data/translations';

interface WeatherSimulationBarProps {
  currentScenarioId: string | null;
  onApplyScenario: (scenario: WeatherScenario) => void;
  onReset: () => void;
  language: SupportedLanguage;
}

function getScenarioIcon(id: string) {
  switch (id) {
    case 'heavy-rain':
      return <CloudRain className="h-4 w-4 text-cyan-400" />;
    case 'heatwave':
      return <Flame className="h-4 w-4 text-rose-400" />;
    case 'cyclone':
      return <Waves className="h-4 w-4 text-teal-400" />;
    case 'fog':
      return <Eye className="h-4 w-4 text-indigo-400" />;
    case 'thunderstorm':
      return <Wind className="h-4 w-4 text-amber-400" />;
    default:
      return <Sparkles className="h-4 w-4 text-amber-400" />;
  }
}

export const WeatherSimulationBar: React.FC<WeatherSimulationBarProps> = ({
  currentScenarioId,
  onApplyScenario,
  onReset,
  language,
}) => {
  return (
    <section
      aria-label="Meteorological Simulation Lab"
      className="rounded-2xl border border-blue-900/60 bg-[#071936] p-4 shadow-xl space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>{t('simLab', language)}</span>
              <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-blue-950 text-amber-300 border border-blue-800">
                Interactive Lab
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {t('simSubtitle', language)}
            </p>
          </div>
        </div>

        {currentScenarioId && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer self-start sm:self-auto shadow"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('resetLive', language)}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {PRESET_WEATHER_SCENARIOS.map((sc) => {
          const isActive = currentScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onApplyScenario(sc)}
              className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-blue-600/30 border-amber-400 text-white shadow-md ring-1 ring-amber-400/50'
                  : 'bg-[#030e20] hover:bg-blue-950 border-blue-900/50 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-1 rounded-md bg-blue-900/40">
                  {getScenarioIcon(sc.id)}
                </div>
                {isActive && (
                  <span className="text-[9px] font-bold font-mono-data text-amber-300 bg-black/40 px-1 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate">
                  {language === 'en' ? sc.name : sc.nameHi}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                  {sc.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
