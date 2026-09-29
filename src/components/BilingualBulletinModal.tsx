import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  X,
  Radio,
  FileText,
  Languages,
  CheckCircle,
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { ttsService, TTSState } from '../services/ttsService';

interface BilingualBulletinModalProps {
  weather: WeatherData;
  isOpen: boolean;
  onClose: () => void;
  defaultLanguage: 'en' | 'hi';
}

export const BilingualBulletinModal: React.FC<BilingualBulletinModalProps> = ({
  weather,
  isOpen,
  onClose,
  defaultLanguage,
}) => {
  const [bulletinLang, setBulletinLang] = useState<'en' | 'hi'>(defaultLanguage);
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    language: defaultLanguage,
  });

  useEffect(() => {
    setBulletinLang(defaultLanguage);
  }, [defaultLanguage]);

  useEffect(() => {
    const unsub = ttsService.subscribe((state) => {
      setTtsState(state);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const script = ttsService.generateBulletinScript(weather, bulletinLang);

  const handlePlay = () => {
    if (ttsState.isPaused) {
      ttsService.resume();
    } else {
      ttsService.speak(script, bulletinLang);
    }
  };

  const handlePause = () => {
    ttsService.pause();
  };

  const handleStop = () => {
    ttsService.stop();
  };

  const handleRateChange = (rate: number) => {
    ttsService.setRate(rate);
    if (ttsState.isPlaying) {
      // Re-trigger with new rate
      ttsService.speak(script, bulletinLang);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-serif-heading">
                {bulletinLang === 'hi' ? 'मौसम वेधशाला बुलेटिन प्रसारण' : 'Official Observatory Audio Broadcast'}
              </h3>
              <p className="text-xs text-slate-400">
                Station: <span className="text-slate-200 font-medium">{weather.station.name}</span> • WMO Bulletin Form
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              ttsService.stop();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Language Selection Tabs */}
        <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (ttsState.isPlaying) ttsService.stop();
                setBulletinLang('en');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                bulletinLang === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English Bulletin
            </button>
            <button
              onClick={() => {
                if (ttsState.isPlaying) ttsService.stop();
                setBulletinLang('hi');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                bulletinLang === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी मौसम बुलेटिन
            </button>
          </div>

          {/* Speed Rate Pill */}
          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono-data pr-2">
            <span>Speed:</span>
            {[0.9, 1.0, 1.2].map((r) => (
              <button
                key={r}
                onClick={() => handleRateChange(r)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  ttsState.rate === r ? 'bg-slate-800 text-amber-300 border border-slate-700' : 'hover:text-white'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>

        {/* Broadcast Script Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between text-[11px] font-mono-data text-slate-500 uppercase tracking-wider">
            <span>MET-DISPATCH SCRIPT</span>
            <span>{bulletinLang === 'hi' ? 'भाषा: हिन्दी (hi-IN)' : 'LANG: English (en-IN)'}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200 font-serif">
            "{script}"
          </p>
        </div>

        {/* Audio Visualizer Waves if playing */}
        {ttsState.isPlaying && (
          <div className="flex items-center justify-center gap-1.5 h-10 bg-slate-950 rounded-xl border border-slate-800/80 px-4">
            <span className="text-[10px] font-mono-data text-amber-400 mr-2 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
              BROADCASTING
            </span>
            {[14, 28, 42, 20, 36, 12, 48, 30, 18, 40, 24, 32, 16, 26].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-amber-400 rounded-full animate-pulse"
                style={{
                  height: `${h}px`,
                  animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                }}
              ></span>
            ))}
          </div>
        )}

        {/* Audio Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            {!ttsState.isPlaying ? (
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-slate-950" />
                <span>{bulletinLang === 'hi' ? 'बुलेटिन चलाएं' : 'Play Broadcast'}</span>
              </button>
            ) : ttsState.isPaused ? (
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-slate-950" />
                <span>{bulletinLang === 'hi' ? 'पुनः शुरू करें' : 'Resume'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg cursor-pointer"
              >
                <Pause className="h-4 w-4" />
                <span>{bulletinLang === 'hi' ? 'विराम दें' : 'Pause'}</span>
              </button>
            )}

            {ttsState.isPlaying && (
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-sm border border-slate-700 transition cursor-pointer"
              >
                <Square className="h-4 w-4 fill-rose-300" />
                <span>{bulletinLang === 'hi' ? 'रोकें' : 'Stop'}</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-mono-data text-center sm:text-right">
            <div>Web Speech API Synthesized Voice</div>
            <div className="text-slate-500">Official Meteorological Portal Standard</div>
          </div>
        </div>
      </div>
    </div>
  );
};
