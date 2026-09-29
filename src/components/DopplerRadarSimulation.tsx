import React, { useState, useEffect } from 'react';
import {
  Radio,
  Layers,
  Wind,
  RefreshCw,
  Compass,
  Eye,
  Shield,
} from 'lucide-react';
import { WeatherData, SupportedLanguage } from '../types/weather';
import { t, getLocalizedConditionText } from '../data/translations';

interface DopplerRadarSimulationProps {
  weather: WeatherData;
  language: SupportedLanguage;
}

export const DopplerRadarSimulation: React.FC<DopplerRadarSimulationProps> = ({ weather, language }) => {
  const [activeLayer, setActiveLayer] = useState<'precip' | 'clouds' | 'wind'>('precip');
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating]);

  const { station, condition } = weather;
  const isStorm = condition === 'heavy-rain' || condition === 'thunderstorm' || condition === 'cyclone';

  return (
    <div className="rounded-2xl border border-blue-900/50 bg-[#071936] p-4 sm:p-5 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-900/40 text-emerald-400 border border-blue-700/40">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{t('dwrTitle', language)}</span>
              <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Station DWR: <span className="text-amber-400 font-mono-data font-semibold">{station.name}</span> • {t('dwrRange', language)}
            </p>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="bg-[#040e22] p-1 rounded-xl border border-blue-900/40 flex items-center gap-1">
            <button
              onClick={() => setActiveLayer('precip')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-[11px] ${
                activeLayer === 'precip' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('precipLayer', language)}
            </button>
            <button
              onClick={() => setActiveLayer('wind')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-[11px] ${
                activeLayer === 'wind' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('windLayer', language)}
            </button>
            <button
              onClick={() => setActiveLayer('clouds')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-[11px] ${
                activeLayer === 'clouds' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('cloudLayer', language)}
            </button>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isRotating
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Scan sweep"
          >
            <RefreshCw className={`h-4 w-4 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Radar Canvas / Visualization */}
      <div className="relative h-64 sm:h-72 w-full rounded-xl bg-[#020b18] border border-blue-900/40 overflow-hidden flex items-center justify-center">
        {/* Radar concentric distance range rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-56 w-56 rounded-full border border-blue-800/30"></div>
          <div className="absolute h-40 w-40 rounded-full border border-blue-800/40"></div>
          <div className="absolute h-24 w-24 rounded-full border border-blue-700/50"></div>
          <div className="absolute h-8 w-8 rounded-full border border-cyan-500/60 bg-cyan-900/20"></div>

          {/* Crosshairs */}
          <div className="absolute h-full w-[1px] bg-blue-900/30"></div>
          <div className="absolute w-full h-[1px] bg-blue-900/30"></div>
        </div>

        {/* Dynamic Sweeping Beam */}
        <div
          className="absolute h-full w-full pointer-events-none origin-center"
          style={{ transform: `rotate(${rotationAngle}deg)` }}
        >
          <div
            className="w-1/2 h-1/2 origin-bottom-right"
            style={{
              background: 'conic-gradient(from 0deg at 100% 100%, rgba(16, 185, 129, 0.4) 0deg, rgba(16, 185, 129, 0) 45deg)',
            }}
          ></div>
        </div>

        {/* Simulated Echo Returns */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {activeLayer === 'precip' && (
            <div className="relative w-48 h-48">
              {isStorm ? (
                <>
                  <div className="absolute top-8 left-12 h-16 w-20 rounded-full bg-rose-600/50 blur-md animate-pulse"></div>
                  <div className="absolute top-12 left-16 h-8 w-12 rounded-full bg-yellow-400/60 blur-sm"></div>
                  <div className="absolute bottom-10 right-8 h-12 w-16 rounded-full bg-cyan-500/40 blur-md"></div>
                </>
              ) : (
                <div className="absolute top-10 right-10 h-10 w-14 rounded-full bg-cyan-600/30 blur-sm"></div>
              )}
            </div>
          )}

          {activeLayer === 'wind' && (
            <div className="text-[11px] font-mono-data text-cyan-300 bg-black/60 px-3 py-1.5 rounded-lg border border-cyan-800">
              Wind Vector: {weather.windDirection}° at {weather.windSpeed} km/h (Gusts {weather.windGust} km/h)
            </div>
          )}

          {activeLayer === 'clouds' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/30 via-slate-600/20 to-transparent blur-xl"></div>
          )}
        </div>

        {/* Radar Corner Telemetry */}
        <div className="absolute top-2 left-2 text-[10px] font-mono-data text-slate-400 bg-black/60 px-2 py-1 rounded border border-white/10 space-y-0.5">
          <div className="text-emerald-400 font-bold">MODE: S-BAND DWR</div>
          <div>ELEV: +0.5° PPI</div>
          <div>SWEEP: {rotationAngle}°</div>
        </div>

        <div className="absolute bottom-2 right-2 text-[10px] font-mono-data text-amber-300 bg-black/60 px-2 py-1 rounded border border-white/10">
          dBZ: {isStorm ? '52 (Heavy Precipitation)' : '18 (Light Reflectivity)'}
        </div>
      </div>
    </div>
  );
};
