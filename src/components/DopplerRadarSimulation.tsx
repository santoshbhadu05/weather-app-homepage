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
import { WeatherData } from '../types/weather';

interface DopplerRadarSimulationProps {
  weather: WeatherData;
  language: 'en' | 'hi';
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
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'hi'
                ? 'आईएमडी डॉपलर मौसम रडार (IMD Doppler Weather Radar - DWR)'
                : 'IMD Doppler Weather Radar (DWR) Network'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Station DWR: <span className="text-amber-400 font-mono-data font-semibold">{station.name}</span> • Max Range: 250 km (S-Band)
            </p>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="bg-[#040e22] p-1 rounded-xl border border-blue-900/40 flex items-center gap-1">
            <button
              onClick={() => setActiveLayer('precip')}
              className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer text-[11px] ${
                activeLayer === 'precip' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Precip (dBZ)
            </button>
            <button
              onClick={() => setActiveLayer('clouds')}
              className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer text-[11px] ${
                activeLayer === 'clouds' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              INSAT Cloud
            </button>
            <button
              onClick={() => setActiveLayer('wind')}
              className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer text-[11px] ${
                activeLayer === 'wind' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wind Flow
            </button>
          </div>

          <button
            onClick={() => setIsRotating((p) => !p)}
            className="p-1 rounded-lg bg-[#040e22] border border-blue-900/40 text-slate-400 hover:text-white cursor-pointer"
            title="Toggle Scan"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Radar Scope */}
      <div className="relative aspect-[16/7] w-full bg-[#030914] rounded-xl border border-blue-900/50 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-emerald-500/20 flex items-center justify-center">
            <span className="text-[8px] font-mono-data text-emerald-500/40 absolute -top-2.5">50 km</span>
          </div>
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-emerald-500/20 flex items-center justify-center">
            <span className="text-[8px] font-mono-data text-emerald-500/40 absolute -top-2.5">150 km</span>
          </div>
          <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-emerald-500/15 flex items-center justify-center">
            <span className="text-[8px] font-mono-data text-emerald-500/40 absolute -top-2.5">250 km</span>
          </div>
          <div className="absolute w-full h-[1px] bg-emerald-500/15"></div>
          <div className="absolute h-full w-[1px] bg-emerald-500/15"></div>
        </div>

        {/* Echo Clusters */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isStorm ? (
            <div className="relative w-56 h-56 sm:w-72 sm:h-72">
              <div className="absolute top-1/4 left-1/3 w-28 h-28 rounded-full bg-rose-600/35 blur-xl animate-pulse"></div>
              <div className="absolute top-1/3 left-1/2 w-24 h-24 rounded-full bg-amber-500/40 blur-lg"></div>
              <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-cyan-400/30 blur-lg"></div>
            </div>
          ) : (
            <div className="relative w-48 h-48 sm:w-64 sm:h-64">
              <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-cyan-400/20 blur-lg"></div>
              <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-emerald-400/15 blur-lg"></div>
            </div>
          )}
        </div>

        {/* Sweep Line */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: `rotate(${rotationAngle}deg)` }}
        >
          <div
            className="w-1/2 h-full absolute right-0 top-0 origin-left"
            style={{
              background: 'conic-gradient(from 270deg at 0% 50%, rgba(16, 185, 129, 0.4) 0deg, rgba(16, 185, 129, 0.1) 30deg, transparent 65deg)',
            }}
          ></div>
          <div className="w-1/2 h-[1.5px] bg-emerald-400 absolute right-0 top-1/2 origin-left shadow-[0_0_6px_#34d399]"></div>
        </div>

        {/* Center Station Badge */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-amber-400 border-2 border-slate-950 shadow-[0_0_8px_#f59e0b]"></div>
          <span className="mt-0.5 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono-data text-amber-300">
            {station.id.toUpperCase()}
          </span>
        </div>

        {/* Top-left Telemetry */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-blue-900/50 text-[9px] font-mono-data text-slate-300 space-y-0.5">
          <div>PULSE: 1.0 µs • SCAN: 3 RPM</div>
          <div className="text-emerald-400">AZIMUTH: {rotationAngle.toFixed(0)}°</div>
        </div>

        {/* dBZ Reflectivity Scale */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm p-1.5 rounded border border-blue-900/50 text-[9px] font-mono-data space-y-0.5">
          <div className="text-[8px] text-slate-400 uppercase font-semibold">Reflectivity dBZ</div>
          <div className="flex items-center gap-0.5">
            <span className="w-2.5 h-1.5 bg-cyan-400"></span>
            <span className="w-2.5 h-1.5 bg-blue-500"></span>
            <span className="w-2.5 h-1.5 bg-emerald-500"></span>
            <span className="w-2.5 h-1.5 bg-yellow-400"></span>
            <span className="w-2.5 h-1.5 bg-rose-600"></span>
          </div>
          <div className="flex justify-between text-[8px] text-slate-400">
            <span>15</span>
            <span>60+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
