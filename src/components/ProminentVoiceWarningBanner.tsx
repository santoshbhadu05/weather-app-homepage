import React, { useState, useEffect } from 'react';
import { ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { ttsService } from '../services/ttsService';

interface ProminentVoiceWarningBannerProps {
  weather: WeatherData;
  language: 'en' | 'hi';
}

export const ProminentVoiceWarningBanner: React.FC<ProminentVoiceWarningBannerProps> = ({
  weather,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const activeAlert = weather.activeAlert || {
    id: 'default-synoptic',
    severity: 'yellow',
    title: 'Daily Synoptic Weather Advisory',
    titleHi: 'दैनिक मौसम चेतावनी एवं परामर्श',
    description: `Current surface temperature is ${weather.temperature}°C, humidity ${weather.humidity}%. Normal conditions prevailing.`,
    descriptionHi: `वर्तमान तापमान ${weather.temperature}°C तथा आर्द्रता ${weather.humidity}% है। मौसम सामान्य रूप से अनुकूल है।`,
    issuedAt: 'IMD NWFC',
    validUntil: 'Today 23:59 IST',
    category: 'Daily Meteorological Watch',
  };

  const playVoiceAlert = () => {
    const textToSpeak =
      language === 'hi'
        ? `${activeAlert.titleHi}। ${activeAlert.descriptionHi}। यह चेतावनी ${activeAlert.validUntil} तक प्रभावी है।`
        : `${activeAlert.title}. ${activeAlert.description}. Valid until ${activeAlert.validUntil}.`;

    setIsPlaying(true);
    ttsService.speak(textToSpeak, language);
  };

  const stopVoiceAlert = () => {
    setIsPlaying(false);
    ttsService.stop();
  };

  useEffect(() => {
    const unsub = ttsService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
    return unsub;
  }, []);

  const isRed = activeAlert.severity === 'red';
  const isOrange = activeAlert.severity === 'orange';

  return (
    <section
      aria-label="Official IMD Weather Warning"
      className={`rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
        isRed
          ? 'bg-[#180408] border-rose-500 shadow-lg shadow-rose-950/70'
          : isOrange
          ? 'bg-[#1a0c02] border-amber-500 shadow-lg shadow-amber-950/70'
          : 'bg-[#06152b] border-blue-600 shadow-md shadow-blue-950/50'
      }`}
    >
      <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
        {/* Left Side: Icon + Small Meta Pills + Warning Text */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              isRed
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 animate-pulse'
                : isOrange
                ? 'bg-amber-500 text-slate-950'
                : 'bg-yellow-400 text-slate-950'
            }`}
          >
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div className="space-y-1 min-w-0">
            {/* Small meta lines / pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono-data">
              <span
                className={`px-2 py-0.2 rounded font-bold uppercase ${
                  isRed
                    ? 'bg-rose-600 text-white'
                    : isOrange
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-yellow-400 text-slate-950'
                }`}
              >
                {isRed
                  ? '🔴 RED ALERT'
                  : isOrange
                  ? '🟠 ORANGE ALERT'
                  : '🟡 YELLOW WATCH'}
              </span>
              <span className="text-slate-300 bg-black/40 px-1.5 py-0.2 rounded border border-white/10">
                {activeAlert.category}
              </span>
              <span className="text-amber-300 bg-black/40 px-1.5 py-0.2 rounded border border-white/10">
                {activeAlert.validUntil}
              </span>
            </div>

            {/* Warning Content: Title & Description only, no extra big headlines */}
            <div className="text-xs sm:text-sm text-slate-100 font-medium leading-snug">
              <span className="font-bold text-white mr-1.5">
                {language === 'hi' ? activeAlert.titleHi : activeAlert.title}:
              </span>
              <span>
                {language === 'hi'
                  ? activeAlert.descriptionHi
                  : activeAlert.description}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Only Voice Icon Button */}
        <div className="shrink-0 pl-1">
          <button
            onClick={() => (isPlaying ? stopVoiceAlert() : playVoiceAlert())}
            className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer shadow-lg flex items-center justify-center ${
              isPlaying
                ? 'bg-white text-rose-950 ring-4 ring-rose-500/50 animate-pulse'
                : isRed
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : isOrange
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950'
            }`}
            title={isPlaying ? 'Stop Voice Alert' : 'Play Voice Alert'}
            aria-label={isPlaying ? 'Stop Voice Alert' : 'Play Voice Alert'}
          >
            {isPlaying ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5 animate-bounce" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
