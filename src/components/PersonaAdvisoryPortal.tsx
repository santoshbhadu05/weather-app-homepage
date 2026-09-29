import React, { useState } from 'react';
import {
  HeartPulse,
  Flame,
  Waves,
  Compass,
  Baby,
  Sprout,
  Car,
  PartyPopper,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Volume2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { PersonaAdvisory, PersonaType, WeatherData } from '../types/weather';
import { computePersonaAdvisories } from '../data/personaAdvisories';
import { ttsService } from '../services/ttsService';

interface PersonaAdvisoryPortalProps {
  weather: WeatherData;
  language: 'en' | 'hi';
}

function getPersonaIcon(iconName: string, className = 'h-4 w-4') {
  switch (iconName) {
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Waves':
      return <Waves className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Baby':
      return <Baby className={className} />;
    case 'Sprout':
      return <Sprout className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'PartyPopper':
      return <PartyPopper className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    default:
      return <Users className={className} />;
  }
}

function getScoreBadge(score: number) {
  if (score >= 80) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      labelEn: 'Optimal / Safe',
      labelHi: 'अनुकूल / सुरक्षित',
    };
  }
  if (score >= 60) {
    return {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      labelEn: 'Good',
      labelHi: 'सामान्य अच्छा',
    };
  }
  if (score >= 40) {
    return {
      bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      labelEn: 'Caution',
      labelHi: 'सतर्कता आवश्यक',
    };
  }
  if (score >= 25) {
    return {
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      labelEn: 'Adverse',
      labelHi: 'प्रतिकूल',
    };
  }
  return {
    bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    labelEn: 'Critical / Restricted',
    labelHi: 'अति प्रतिकूल / प्रतिबंधित',
  };
}

export const PersonaAdvisoryPortal: React.FC<PersonaAdvisoryPortalProps> = ({ weather, language }) => {
  const advisories = computePersonaAdvisories(weather);
  const personaKeys: PersonaType[] = [
    'health',
    'fitness',
    'surfers',
    'travelers',
    'parents',
    'agriculture',
    'commuters',
    'events',
    'sports',
  ];

  const [activePersona, setActivePersona] = useState<PersonaType>('health');
  const currentAdvisory = advisories[activePersona];
  const scoreMeta = getScoreBadge(currentAdvisory.score);

  const handleSpeakAdvisory = (adv: PersonaAdvisory) => {
    const textToSpeak =
      language === 'hi'
        ? `${adv.titleHi}: अनुकूलता स्तर ${adv.score} प्रतिशत। ${adv.summaryHi} अनुशंसित समय: ${adv.recommendedTimeWindow}।`
        : `${adv.title}: Advisory index ${adv.score} out of 100. ${adv.summary} Optimal timing window: ${adv.recommendedTimeWindow}.`;
    ttsService.speak(textToSpeak, language);
  };

  return (
    <div className="rounded-2xl border border-blue-900/50 bg-[#071936] p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-900/40 text-cyan-300 border border-blue-700/40">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'hi'
                ? '9-वर्ग विशिष्ट मौसम परामर्श (Persona Weather Advisories)'
                : 'Dedicated 9-Persona Weather Advisories'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'hi'
                ? 'स्वास्थ्य, कृषि, धावक, यात्री, अभिभावक, दैनिक यात्री एवं खेल जगत के लिए विशेष रिपोर्ट'
                : 'Targeted intelligence for Health, Farmers, Commuters, Travelers, Sports & more'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono-data text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded self-start sm:self-auto">
          ✓ All 9 Models Active
        </span>
      </div>

      {/* Persona Horizontal Scroll Strip */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {personaKeys.map((key) => {
          const adv = advisories[key];
          const isSelected = activePersona === key;
          const miniBadge = getScoreBadge(adv.score);

          return (
            <button
              key={key}
              onClick={() => setActivePersona(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-[#040e22] hover:bg-blue-950 border-blue-900/40 text-slate-300 hover:text-white'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-cyan-400'}>
                {getPersonaIcon(adv.iconName, 'h-3.5 w-3.5')}
              </span>
              <span>{language === 'hi' ? adv.titleHi.split(' ')[0] : adv.title}</span>
              <span
                className={`text-[10px] font-mono-data px-1 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-black/20 text-white' : miniBadge.bg
                }`}
              >
                {adv.score}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Persona Compact Card */}
      <div className="p-4 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-900/40 text-amber-400 border border-blue-700/40">
              {getPersonaIcon(currentAdvisory.iconName, 'h-5 w-5')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {language === 'hi' ? currentAdvisory.titleHi : currentAdvisory.title}
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${scoreMeta.bg}`}>
                  {language === 'hi' ? scoreMeta.labelHi : scoreMeta.labelEn} ({currentAdvisory.score}%)
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {currentAdvisory.targetAudience}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSpeakAdvisory(currentAdvisory)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-xs text-amber-300 border border-blue-800 transition cursor-pointer self-start sm:self-auto"
          >
            <Volume2 className="h-3.5 w-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'सलाह सुनें' : 'Listen'}</span>
          </button>
        </div>

        {/* Warning if any */}
        {currentAdvisory.criticalWarning && (
          <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>
              {language === 'hi' ? currentAdvisory.criticalWarningHi : currentAdvisory.criticalWarning}
            </span>
          </div>
        )}

        {/* 2-column info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#071936] border border-blue-900/30">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              {currentAdvisory.keyMetricName}
            </div>
            <div className="text-sm font-bold text-amber-300 font-mono-data mt-0.5">
              {currentAdvisory.keyMetricValue}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#071936] border border-blue-900/30">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3 text-cyan-400" />
              <span>{language === 'hi' ? 'सर्वोत्तम समय' : 'Recommended Window'}</span>
            </div>
            <div className="text-sm font-bold text-cyan-200 font-mono-data mt-0.5">
              {currentAdvisory.recommendedTimeWindow}
            </div>
          </div>
        </div>

        {/* Summary text */}
        <p className="text-xs leading-relaxed text-slate-200">
          {language === 'hi' ? currentAdvisory.summaryHi : currentAdvisory.summary}
        </p>

        {/* Actionable points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {currentAdvisory.actionableChecklist.map((item, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-[11px] flex items-start gap-1.5 ${
                item.isUrgent
                  ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                  : 'bg-[#071936] border-blue-900/30 text-slate-300'
              }`}
            >
              <CheckCircle2
                className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                  item.isUrgent ? 'text-amber-400' : 'text-emerald-400'
                }`}
              />
              <span>{language === 'hi' ? item.textHi : item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
