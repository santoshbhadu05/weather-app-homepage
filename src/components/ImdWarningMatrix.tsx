import React from 'react';
import {
  ShieldAlert,
  CloudRain,
  CloudLightning,
  Flame,
  CloudFog,
  Wind,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { WeatherAlert, WeatherData } from '../types/weather';

interface ImdWarningMatrixProps {
  weather: WeatherData;
  language: 'en' | 'hi';
}

export const ImdWarningMatrix: React.FC<ImdWarningMatrixProps> = ({ weather, language }) => {
  const currentAlert = weather.activeAlert;

  // Determine current active color
  const activeColor = currentAlert ? currentAlert.severity : 'green';

  const levels = [
    {
      id: 'green',
      nameEn: 'No Warning',
      nameHi: 'कोई चेतावनी नहीं',
      actionEn: 'No action required',
      actionHi: 'कोई कार्रवाई आवश्यक नहीं',
      bgClass: 'bg-emerald-600',
      activeRing: 'ring-4 ring-emerald-500/50 shadow-emerald-500/20',
      borderClass: 'border-emerald-600',
      badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'yellow',
      nameEn: 'Watch (Be Updated)',
      nameHi: 'सतर्क रहें (Watch)',
      actionEn: 'Keep updated with forecast',
      actionHi: 'मौसम की जानकारी लेते रहें',
      bgClass: 'bg-yellow-500',
      activeRing: 'ring-4 ring-yellow-400/50 shadow-yellow-500/20',
      borderClass: 'border-yellow-500',
      badgeBg: 'bg-yellow-950/60 border-yellow-500/40 text-yellow-300',
    },
    {
      id: 'orange',
      nameEn: 'Alert (Be Prepared)',
      nameHi: 'तैयार रहें (Alert)',
      actionEn: 'Be prepared for disruption',
      actionHi: 'असुविधा से बचाव की तैयारी रखें',
      bgClass: 'bg-orange-500',
      activeRing: 'ring-4 ring-orange-400/50 shadow-orange-500/20',
      borderClass: 'border-orange-500',
      badgeBg: 'bg-orange-950/60 border-orange-500/40 text-orange-300',
    },
    {
      id: 'red',
      nameEn: 'Warning (Take Action)',
      nameHi: 'चेतावनी (Take Action)',
      actionEn: 'Take immediate action',
      actionHi: 'सुरक्षा हेतु तत्काल कदम उठाएं',
      bgClass: 'bg-rose-600',
      activeRing: 'ring-4 ring-rose-500/50 shadow-rose-500/20',
      borderClass: 'border-rose-600',
      badgeBg: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
    },
  ];

  return (
    <div className="rounded-2xl border border-blue-900/50 bg-[#071936] p-4 sm:p-5 shadow-lg space-y-4">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-900/40 text-blue-300 border border-blue-700/40">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'hi'
                ? 'आईएमडी आधिकारिक चेतावनी मैट्रिक्स (IMD Color-Coded Warning)'
                : 'IMD Standard Color-Coded Warning Matrix'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'hi'
                ? 'भारत मौसम विज्ञान विभाग (IMD) द्वारा जारी आधिकारिक चेतावनी स्तर'
                : 'Official impact-based warning categorization by India Meteorological Department'}
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono-data text-slate-400">
          Station: <span className="text-amber-400 font-semibold">{weather.station.name}</span>
        </div>
      </div>

      {/* 4-Color Strip Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {levels.map((lvl) => {
          const isCurrentActive = activeColor === lvl.id;
          return (
            <div
              key={lvl.id}
              className={`p-3 rounded-xl border text-xs transition-all relative overflow-hidden ${
                isCurrentActive
                  ? `${lvl.badgeBg} ${lvl.activeRing} shadow-md`
                  : 'bg-[#040e22] border-blue-900/30 text-slate-400 opacity-60'
              }`}
            >
              {/* Color Block Indicator */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`h-2.5 w-6 rounded-full ${lvl.bgClass}`}></span>
                {isCurrentActive && (
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.2 rounded bg-white/10 text-white font-mono-data">
                    {language === 'hi' ? 'सक्रिय' : 'ACTIVE'}
                  </span>
                )}
              </div>

              <div className="font-bold text-white text-xs">
                {language === 'hi' ? lvl.nameHi : lvl.nameEn}
              </div>

              <div className="text-[10px] text-slate-300 mt-0.5">
                {language === 'hi' ? lvl.actionHi : lvl.actionEn}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Phenomenon Advisory details */}
      {currentAlert ? (
        <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-800/60 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              {language === 'hi' ? currentAlert.titleHi : currentAlert.title}
            </span>
            <span className="font-mono-data text-slate-400">
              Valid: {currentAlert.validUntil}
            </span>
          </div>
          <p className="text-slate-200 leading-relaxed text-[11px] sm:text-xs">
            {language === 'hi' ? currentAlert.descriptionHi : currentAlert.description}
          </p>
          <div className="text-[10px] font-mono-data text-slate-400">
            Source: {currentAlert.issuedAt}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs flex items-center gap-2 text-emerald-300">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>
            {language === 'hi'
              ? 'वर्तमान में इस क्षेत्र के लिए कोई गंभीर चेतावनी जारी नहीं है। मौसम सामान्य रहेगा।'
              : 'No severe weather warning is currently active for this district. Conditions remain fair.'}
          </span>
        </div>
      )}
    </div>
  );
};
