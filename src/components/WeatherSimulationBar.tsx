import React from 'react';
import {
  Sparkles,
  CloudRain,
  Flame,
  CloudFog,
  Wind,
  Sun,
  RotateCcw,
} from 'lucide-react';
import { PRESET_WEATHER_SCENARIOS } from '../data/weatherScenarios';
import { WeatherScenario } from '../types/weather';

interface WeatherSimulationBarProps {
  currentScenarioId: string | null;
  onApplyScenario: (scenario: WeatherScenario) => void;
  onReset: () => void;
  language: 'en' | 'hi';
}

function getScenarioIcon(id: string) {
  switch (id) {
    case 'heavy-monsoon':
      return <CloudRain className="h-3.5 w-3.5 text-cyan-400" />;
    case 'heatwave-loo':
      return <Flame className="h-3.5 w-3.5 text-rose-500" />;
    case 'dense-fog-smog':
      return <CloudFog className="h-3.5 w-3.5 text-slate-300" />;
    case 'cyclone-storm':
      return <Wind className="h-3.5 w-3.5 text-red-500" />;
    case 'clear-pleasant':
      return <Sun className="h-3.5 w-3.5 text-amber-400" />;
    default:
      return <Sparkles className="h-3.5 w-3.5 text-amber-400" />;
  }
}

export const WeatherSimulationBar: React.FC<WeatherSimulationBarProps> = ({
  currentScenarioId,
  onApplyScenario,
  onReset,
  language,
}) => {
  return (
    <div className="rounded-2xl border border-blue-900/50 bg-[#071936] p-3 sm:p-4 shadow-lg space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {language === 'hi' ? 'मौसम सिमुलेटर (Weather Stress Simulator)' : 'Meteorological Stress Simulator'}
            </h4>
          </div>
        </div>

        {currentScenarioId && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-[11px] font-semibold text-amber-300 border border-blue-800 transition cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{language === 'hi' ? 'रीसेट' : 'Reset to Live'}</span>
          </button>
        )}
      </div>

      {/* Compact Scenario button strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-0.5">
        {PRESET_WEATHER_SCENARIOS.map((sc) => {
          const isActive = currentScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onApplyScenario(sc)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition cursor-pointer text-xs ${
                isActive
                  ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-sm'
                  : 'bg-[#040e22] hover:bg-blue-950/60 border-blue-900/30 text-slate-300'
              }`}
            >
              <div className="shrink-0">{getScenarioIcon(sc.id)}</div>
              <div className="truncate">
                <div className="text-[11px] font-bold truncate">
                  {language === 'hi' ? sc.nameHi.split(' ')[0] : sc.name.split(' ')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
