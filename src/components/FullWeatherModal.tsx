import React, { useState } from 'react';
import {
  X,
  Gauge,
  Droplets,
  Wind,
  Eye,
  Activity,
  Sunrise,
  Sunset,
  CloudRain,
  Sun,
  Shield,
  Compass,
  Radio,
  Layers,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { DailyForecast, HourlyForecast, WeatherData } from '../types/weather';

interface FullWeatherModalProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
}

export const FullWeatherModal: React.FC<FullWeatherModalProps> = ({
  weather,
  hourly,
  daily,
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'synoptic' | 'atmosphere' | 'agromarine'>('synoptic');

  if (!isOpen) return null;

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
    conditionText,
    conditionTextHi,
    precipitationChance,
    precipitationAmount,
    cloudCover,
    sunrise,
    sunset,
    updatedAt,
    activeAlert,
  } = weather;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-blue-900 bg-[#071936] p-5 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-900/50 text-cyan-300 border border-blue-700/50">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {language === 'hi' ? 'संपूर्ण मौसम वेधशाला विवरण (Full Synoptic Report)' : 'Full Observatory Meteorological Report'}
                </h3>
                <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {station.stationCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {station.name} ({station.state}) • Alt: {station.elevation}m MSL • Lat: {station.lat.toFixed(2)}°N, Lon: {station.lon.toFixed(2)}°E
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#040e22] hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 bg-[#040e22] p-1 rounded-xl border border-blue-900/40 text-xs">
          <button
            onClick={() => setActiveTab('synoptic')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'synoptic' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'सतही मौसम मापदंड' : 'Surface Meteorology'}
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'atmosphere' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'वायुमंडल एवं प्रदूषण (AQI)' : 'Atmosphere & Air Quality'}
          </button>
          <button
            onClick={() => setActiveTab('agromarine')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'agromarine' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'कृषि, विमानन व समुद्री' : 'Agro-Met, Marine & Aviation'}
          </button>
        </div>

        {/* Tab 1: Surface Meteorology */}
        {activeTab === 'synoptic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Dry Bulb Temp</div>
                <div className="text-2xl font-bold font-mono-data text-white mt-1">{temperature}°C</div>
                <div className="text-[11px] text-slate-400 font-mono-data">Min {tempMin}° / Max {tempMax}°</div>
              </div>

              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Dew Point Temp</div>
                <div className="text-2xl font-bold font-mono-data text-cyan-300 mt-1">{dewPoint}°C</div>
                <div className="text-[11px] text-slate-400">Condensation level</div>
              </div>

              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Barometric QNH</div>
                <div className="text-2xl font-bold font-mono-data text-amber-300 mt-1">{pressure} hPa</div>
                <div className="text-[11px] text-slate-400">Mean Sea Level (MSL)</div>
              </div>

              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Relative Humidity</div>
                <div className="text-2xl font-bold font-mono-data text-blue-300 mt-1">{humidity}%</div>
                <div className="text-[11px] text-slate-400">Moisture saturation</div>
              </div>

              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Surface Wind Speed</div>
                <div className="text-2xl font-bold font-mono-data text-teal-300 mt-1">{windSpeed} km/h</div>
                <div className="text-[11px] text-slate-400">Gusts up to {windGust} km/h</div>
              </div>

              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Wind Direction</div>
                <div className="text-2xl font-bold font-mono-data text-teal-300 mt-1">{windDirection}°</div>
                <div className="text-[11px] text-slate-400 font-mono-data">Azimuth Bearing</div>
              </div>

              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Horizontal Visibility</div>
                <div className="text-2xl font-bold font-mono-data text-indigo-300 mt-1">{visibility} km</div>
                <div className="text-[11px] text-slate-400">Runway Visual Range</div>
              </div>

              <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Cloud Cover (Oktas)</div>
                <div className="text-2xl font-bold font-mono-data text-slate-200 mt-1">{cloudCover}%</div>
                <div className="text-[11px] text-slate-400">Approx {Math.round((cloudCover / 100) * 8)} / 8 Oktas</div>
              </div>
            </div>

            {/* Sun Ephemeris */}
            <div className="p-3.5 rounded-xl bg-[#040e22] border border-blue-900/40 flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2">
                <Sunrise className="h-4 w-4 text-amber-400" />
                <span>Sunrise: <strong className="text-white font-mono-data">{sunrise}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="h-4 w-4 text-orange-400" />
                <span>Sunset: <strong className="text-white font-mono-data">{sunset}</strong></span>
              </div>
              <div className="text-slate-400 font-mono-data">
                Day Length: ~12h 42m • Solar Noon: 12:12 PM IST
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Atmosphere & Air Quality */}
        {activeTab === 'atmosphere' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase">National AQI Index</div>
                <div className="text-3xl font-black font-mono-data text-amber-400">{aqi}</div>
                <p className="text-[11px] text-slate-300">
                  Calculated per Central Pollution Control Board (CPCB) standard 8-sub-index formulation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase">PM2.5 Concentration</div>
                <div className="text-3xl font-black font-mono-data text-rose-400">{pm25} <span className="text-xs font-normal">µg/m³</span></div>
                <p className="text-[11px] text-slate-300">
                  National ambient air quality standard 24h limit is 60 µg/m³.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase">PM10 Coarse Particulate</div>
                <div className="text-3xl font-black font-mono-data text-blue-300">{pm10} <span className="text-xs font-normal">µg/m³</span></div>
                <p className="text-[11px] text-slate-300">
                  Standard 24h limit is 100 µg/m³. Inversion layer traps dust in winter dawn.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-2 text-xs">
              <div className="font-bold text-white uppercase text-[11px]">Solar Ultraviolet Radiation (UV-B)</div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold font-mono-data text-amber-400">UV {uvIndex}</div>
                <div className="text-slate-300 text-xs">
                  {uvIndex >= 8
                    ? 'Very High to Extreme. Minimise sun exposure between 11 AM and 3 PM. Protective broad-brim hats & sunglasses mandatory.'
                    : 'Moderate risk. Normal outdoor activity permissible.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Agro-Met & Marine */}
        {activeTab === 'agromarine' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 uppercase text-[11px]">
                  <span>Gramin Krishi Mausam Sewa (GKMS)</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>• Evapotranspiration Rate: ~4.2 mm/day</div>
                  <div>• Soil Moisture Potential: Adequate surface reserve</div>
                  <div>• Sowing / Spraying feasibility: {precipitationChance > 40 ? 'HOLD Chemical Application' : 'Safe to Spray'}</div>
                  <div>• Recommended irrigation: Evening micro-drip</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5 uppercase text-[11px]">
                  <span>Aviation METAR & Marine Coastal Brief</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>• Runway Visibility (RVR): {visibility >= 5 ? '>5000m Unrestricted' : `${visibility * 1000}m CAT-I/II`}</div>
                  <div>• Altimeter QNH: {pressure} hPa</div>
                  <div>• Coastal Sea State: {station.isCoastal ? (windSpeed > 35 ? 'Rough to Very Rough' : 'Slight to Moderate') : 'Inland (N/A)'}</div>
                  <div>• Fishermen Warning: {windSpeed > 40 ? 'Squally winds - Do NOT venture' : 'No adverse warning'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close button footer */}
        <div className="pt-2 border-t border-blue-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
          >
            {language === 'hi' ? 'वापस जाएं (Back to Homepage)' : 'Close Detailed View'}
          </button>
        </div>
      </div>
    </div>
  );
};
