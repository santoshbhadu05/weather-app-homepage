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
import { WeatherData, SupportedLanguage, RECOGNIZED_INDIAN_LANGUAGES } from '../types/weather';
import { ttsService, TTSState } from '../services/ttsService';
import { t } from '../data/translations';

interface BilingualBulletinModalProps {
  weather: WeatherData;
  isOpen: boolean;
  onClose: () => void;
  defaultLanguage: SupportedLanguage;
}

export const BilingualBulletinModal: React.FC<BilingualBulletinModalProps> = ({
  weather,
  isOpen,
  onClose,
  defaultLanguage,
}) => {
  const [bulletinLang, setBulletinLang] = useState<SupportedLanguage>(defaultLanguage);
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    language: defaultLanguage,
  });

  // Keep bulletin language synchronized with app's selected language
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

  const currentLangMeta =
    RECOGNIZED_INDIAN_LANGUAGES.find((l) => l.code === bulletinLang) ||
    RECOGNIZED_INDIAN_LANGUAGES[0];

  const broadcastLabelMap: Record<SupportedLanguage, string> = {
    hi: 'प्रसारण भाषा:', en: 'Broadcast Language:', bn: 'সম্প্রচার ভাষা:', mr: 'प्रसारण भाषा:',
    te: 'ప్రసార భాష:', ta: 'ஒலிபரப்பு மொழி:', gu: 'પ્રસારણ ભાષા:', ur: 'نشریاتی زبان:',
    kn: 'ಪ್ರಸಾರ ಭಾಷೆ:', or: 'ପ୍ରସାରଣ ଭାଷା:', ml: 'പ്രക്ഷേപണ ഭാഷ:', pa: 'ਪ੍ਰਸਾਰਣ ਭਾਸ਼ਾ:',
    as: 'সম্প্ৰচাৰ ভাষা:', sa: 'प्रसारणभाषा:',
  };

  const scriptHeaderMap: Record<SupportedLanguage, string> = {
    hi: 'आधिकारिक उद्घोषणा आलेख (ऑडियो स्क्रिप्ट):', en: 'Official Observatory Audio Script:',
    bn: 'অফিসিয়াল বুলেটিন অডিও স্ক্রিপ্ট:', mr: 'अधिकृत वेधशाळा उद्घोषणा आलेख:',
    te: 'అధికారిక వేధశాల ఆడియో స్క్రిప్ట్:', ta: 'அதிகாரப்பூர்வ வானிலை அறிக்கை உரை:',
    gu: 'સત્તાવાર વેધશાળા ઓડિયો સ્ક્રિપ્ટ:', ur: 'محکمہ موسمیات کا باضابطہ آڈیو اسکرپٹ:',
    kn: 'ಅಧಿಕೃತ ವೀಕ್ಷಣಾಲಯ ಆಡಿಯೋ ಸ್ಕ್ರಿಪ್ಟ್:', or: 'ସରକାରୀ ପାଣିପାଗ ଅଡିଓ ଆଲେଖ୍ୟ:',
    ml: 'ഔദ്യോഗിക കാലാവസ്ഥാ ബുള്ളറ്റിൻ സ്ക്രിപ്റ്റ്:', pa: 'ਅਧਿਕਾਰਤ ਵੈਧਸ਼ਾਲਾ ਆਡੀਓ ਸਕ੍ਰਿਪਟ:',
    as: 'আনুষ্ঠানিক বতৰ বুলেটিন লিপি:', sa: 'आधिकारिक-ऋतुविज्ञान-उद्घोषणा-आलेखम्:',
  };

  const speedLabelMap: Record<SupportedLanguage, string> = {
    hi: 'गति:', en: 'Speed:', bn: 'গতি:', mr: 'वेग:', te: 'వేగం:', ta: 'வேகம்:',
    gu: 'ઝડપ:', ur: 'رفتار:', kn: 'ವೇಗ:', or: 'ଗତି:', ml: 'വേഗത:', pa: 'ਗਤੀ:',
    as: 'গতি:', sa: 'गतिः:',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-blue-900 bg-[#071936] p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t('bulletinBroadcastTitle', bulletinLang)}</span>
                <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                  {currentLangMeta.nativeName}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {t('bulletinSub', bulletinLang)} • {weather.station.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              ttsService.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#040e22] hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Language Selection Chips across all 14 recognized Indian languages */}
        <div className="space-y-1.5 bg-[#040e22] p-2.5 rounded-xl border border-blue-900/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1 text-slate-300">
              <Languages className="h-3.5 w-3.5 text-cyan-400" />
              <span>{broadcastLabelMap[bulletinLang] || 'प्रसारण भाषा:'}</span>
            </span>
            <span className="text-amber-400 font-mono-data text-[10px]">
              {currentLangMeta.name} ({currentLangMeta.nativeName})
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {RECOGNIZED_INDIAN_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  if (ttsState.isPlaying) ttsService.stop();
                  setBulletinLang(lang.code);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  bulletinLang === lang.code
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow'
                    : 'bg-[#071936] text-slate-300 hover:text-white border-blue-900/50'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Script Display in Native Language */}
        <div className="p-4 rounded-xl bg-[#040e22] border border-blue-900/50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono-data text-slate-400 border-b border-blue-900/40 pb-1.5">
            <span className="flex items-center gap-1.5 text-slate-200">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span>{scriptHeaderMap[bulletinLang] || 'आधिकारिक उद्घोषणा आलेख:'}</span>
            </span>
            <span className="text-cyan-400">{weather.updatedAt}</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-h-48 overflow-y-auto pr-1">
            {script}
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#040e22] rounded-xl border border-blue-900/40">
          <div className="flex items-center gap-2">
            {!ttsState.isPlaying || ttsState.isPaused ? (
              <button
                onClick={handlePlay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{t('playBulletin', bulletinLang)}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Pause className="h-4 w-4 fill-current" />
                <span>{t('pauseBulletin', bulletinLang)}</span>
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={!ttsState.isPlaying && !ttsState.isPaused}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                ttsState.isPlaying || ttsState.isPaused
                  ? 'bg-rose-950/60 hover:bg-rose-900 border-rose-700/60 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
              title="Stop audio"
            >
              <Square className="h-4 w-4 fill-current" />
            </button>
          </div>

          {/* Speed controls */}
          <div className="flex items-center gap-1 text-[11px] font-mono-data text-slate-300">
            <span className="text-slate-400 mr-1">{speedLabelMap[bulletinLang] || 'गति:'}</span>
            {[0.8, 1.0, 1.2].map((r) => (
              <button
                key={r}
                onClick={() => ttsService.setRate(r)}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  ttsState.rate === r
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
