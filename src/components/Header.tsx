import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Volume2,
  VolumeX,
  Languages,
  Clock,
  Search,
  Sparkles,
  Compass,
  Radio,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { WeatherStation } from '../types/weather';
import { METEOROLOGICAL_STATIONS } from '../data/mockStations';

interface HeaderProps {
  currentStation: WeatherStation;
  onSelectStation: (station: WeatherStation) => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onOpenBulletin: () => void;
  isSimulated: boolean;
  onResetSimulation: () => void;
  isPlayingAudio: boolean;
  onStopAudio: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStation,
  onSelectStation,
  language,
  onToggleLanguage,
  onOpenBulletin,
  isSimulated,
  onResetSimulation,
  isPlayingAudio,
  onStopAudio,
  activeTab,
  onSelectTab,
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const ist = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      setIstTime(`${dateStr}, ${ist} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const filteredStations = METEOROLOGICAL_STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 shadow-md">
      {/* 1. Indian National Flag Tricolor Accent Ribbon */}
      <div className="h-1 w-full bg-tiranga"></div>

      {/* 2. Official Government of India & IMD Masthead Topbar */}
      <div className="bg-[#061838] border-b border-blue-900/60 text-slate-200 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          {/* Government of India & MoES title */}
          <div className="flex items-center gap-3">
            {/* National Emblem Badge representation */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 shrink-0">
                <Compass className="h-5 w-5 text-amber-400" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5 text-[11px]">
                  <span>भारत सरकार</span>
                  <span className="text-slate-400">|</span>
                  <span>Government of India</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  पृथ्वी विज्ञान मंत्रालय • Ministry of Earth Sciences
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-blue-800/80 mx-1"></div>

            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-amber-300 text-[11px]">
                भारत मौसम विज्ञान विभाग
              </div>
              <div className="text-[10px] text-slate-300 tracking-wide font-medium">
                INDIA METEOROLOGICAL DEPARTMENT
              </div>
            </div>
          </div>

          {/* Clock & Language */}
          <div className="flex items-center gap-3 font-mono-data text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 bg-[#031128] px-2.5 py-1 rounded-md border border-blue-900/50">
              <Clock className="h-3 w-3 text-amber-400" />
              <span className="text-amber-300">{istTime}</span>
            </div>

            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-900/50 hover:bg-blue-800 text-slate-200 border border-blue-700/60 text-[11px] font-medium transition cursor-pointer"
              title="Change Language"
            >
              <Languages className="h-3 w-3 text-cyan-300" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Mausam App Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* App Title & Logo */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white font-black text-base px-2.5 py-1 rounded-lg border border-blue-500/40 shadow">
              मौसम
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-white tracking-tight">MAUSAM</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-blue-950 text-blue-300 border border-blue-800 rounded">
                  IMD Official
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">
                {language === 'hi' ? 'राष्ट्रीय मौसम वेधशाला एवं परामर्श' : 'National Weather Observatory Portal'}
              </p>
            </div>
          </div>

          {/* Quick Voice Audio Bulletin button on mobile */}
          <button
            onClick={isPlayingAudio ? onStopAudio : onOpenBulletin}
            className={`sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span>{language === 'hi' ? 'बुलेटिन' : 'Audio'}</span>
          </button>
        </div>

        {/* Center/Right: City Search & Switcher with GPS button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Station dropdown / quick search */}
          <div className="relative flex-1 sm:w-72">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus-within:border-blue-500 transition">
              <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <select
                aria-label="Select City or Observatory"
                value={currentStation.id}
                onChange={(e) => {
                  const s = METEOROLOGICAL_STATIONS.find((st) => st.id === e.target.value);
                  if (s) onSelectStation(s);
                }}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none w-full cursor-pointer pr-1"
              >
                {METEOROLOGICAL_STATIONS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.name} ({s.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GPS Quick Location Button */}
          <button
            onClick={() => {
              // Select capital New Delhi or nearest
              onSelectStation(METEOROLOGICAL_STATIONS[0]);
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Locate nearest station"
          >
            <Navigation className="h-4 w-4 text-cyan-400" />
          </button>

          {/* Desktop Audio Bulletin Button */}
          <button
            onClick={isPlayingAudio ? onStopAudio : onOpenBulletin}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>{language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio'}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>{language === 'hi' ? 'मौसम बुलेटिन' : 'Voice Bulletin'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Official Mausam Tabs Navigation */}
      <div className="bg-[#0b1f3f] border-t border-blue-900/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'nowcast', labelEn: 'Nowcast & Live', labelHi: 'आज का मौसम (लाइव)' },
            { id: 'forecast', labelEn: '7-Days Forecast', labelHi: '7-दिवसीय पूर्वानुमान' },
            { id: 'warnings', labelEn: 'IMD Warnings', labelHi: 'चेतावनी मैट्रिक्स' },
            { id: 'personas', labelEn: '9-Persona Advisories', labelHi: '9-वर्ग परामर्श' },
            { id: 'radar', labelEn: 'Doppler Radar', labelHi: 'डॉपलर रडार' },
            { id: 'simulation', labelEn: 'Simulation Lab', labelHi: 'मौसम सिमुलेटर' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                {language === 'hi' ? tab.labelHi : tab.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Alert Banner */}
      {isSimulated && (
        <div className="bg-amber-600 text-amber-50 px-4 py-1 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
            <span>
              {language === 'hi'
                ? 'सिमुलेशन सक्रिय: कल्पित मौसमी परिस्थिति का परीक्षण जारी'
                : 'SIMULATION ACTIVE: Testing extreme meteorological scenario'}
            </span>
          </div>
          <button
            onClick={onResetSimulation}
            className="underline font-bold text-[11px] cursor-pointer"
          >
            {language === 'hi' ? 'वास्तविक स्थिति पर लौटें ↺' : 'Return to Live ↺'}
          </button>
        </div>
      )}
    </header>
  );
};
