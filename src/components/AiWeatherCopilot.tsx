import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  X,
  Bot,
} from 'lucide-react';
import { PersonaType, WeatherData, SupportedLanguage } from '../types/weather';
import { t } from '../data/translations';
import { ttsService } from '../services/ttsService';
import {
  CopilotAnswer,
  getCopilotPresetQuestions,
  answerInNativeLanguage,
} from '../data/copilotKnowledge';

interface AiWeatherCopilotProps {
  weather: WeatherData;
  language: SupportedLanguage;
  selectedPersona: PersonaType;
  onOpenFullWeather: () => void;
}

const BCP47_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  ur: 'ur-IN',
  kn: 'kn-IN',
  or: 'or-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  as: 'as-IN',
  sa: 'sa-IN',
};

export const AiWeatherCopilot: React.FC<AiWeatherCopilotProps> = ({
  weather,
  language,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<CopilotAnswer | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAnswer, setIsPlayingAnswer] = useState<boolean>(false);

  const presetQuestions = getCopilotPresetQuestions(language);

  // Track TTS
  useEffect(() => {
    return ttsService.subscribe((state) => {
      setIsPlayingAnswer(state.isPlaying);
    });
  }, []);

  // Speech Recognition (Microphone input in user's native language)
  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === 'en'
          ? 'Voice speech recognition not supported in this browser. Please type your question.'
          : 'आपके ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है। कृपया टाइप करें।'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = BCP47_LANGUAGE_MAP[language] || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCustomQuestion(transcript);
        handleAskQuestion(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Generate answer in user's selected language
  const handleAskQuestion = (questionText: string) => {
    setSelectedQuestion(questionText);
    setCustomQuestion(questionText);
    setIsAnalyzing(true);
    setCustomAnswer(null);

    setTimeout(() => {
      const answer = answerInNativeLanguage(questionText, weather, language);
      setCustomAnswer(answer);
      setIsAnalyzing(false);

      // Auto speak response in that exact native language
      const speechText = `${answer.title}। ${answer.explanation}`;
      ttsService.speak(speechText, language);
    }, 400);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    handleAskQuestion(customQuestion);
  };

  return (
    <aside
      aria-label="AI Weather Copilot"
      className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto rounded-t-2xl border-t-2 border-x-2 border-blue-500/80 bg-[#061838] shadow-2xl pointer-events-auto backdrop-blur-md overflow-hidden transition-all duration-300">
        {/* Minimized / Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 cursor-pointer bg-gradient-to-r from-blue-900/60 via-[#071d42] to-blue-900/60 hover:bg-blue-900/80 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 shadow">
              <Bot className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate">
                  {t('copilotTitle', language)}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shrink-0">
                  {language.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                {t('copilotSub', language)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Voice Mic Button right on header */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                handleToggleListening();
              }}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                  : 'bg-blue-800 text-amber-300 hover:bg-blue-700'
              }`}
              title={isListening ? 'Listening...' : 'Speak in your language'}
            >
              {isListening ? <Mic className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>

            <span className="text-[11px] font-bold text-amber-300 hidden sm:inline">
              {isExpanded ? t('close', language) : t('copilotSend', language)}
            </span>
            <div className="p-1 rounded-md bg-blue-900/60 text-white">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {/* Expanded Drawer Content */}
        {isExpanded && (
          <div className="p-3.5 sm:p-4 border-t border-blue-900/50 max-h-[70vh] overflow-y-auto space-y-3">
            {/* Suggested Question Chips in Native Language */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-300">
                {t('copilotQuickQuestions', language)}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {presetQuestions.map((q) => {
                  const isCur = selectedQuestion === q.text;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleAskQuestion(q.text)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                        isCur
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                          : 'bg-[#030d1d] hover:bg-blue-950 text-slate-200 border-blue-900/60'
                      }`}
                    >
                      {q.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Display */}
            {isAnalyzing && (
              <div className="p-3 rounded-xl bg-[#030d1d] border border-blue-900/40 flex items-center gap-2 text-xs text-amber-300 font-mono-data">
                <span className="h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></span>
                <span>{t('copilotAnalyzing', language)}</span>
              </div>
            )}

            {customAnswer && !isAnalyzing && (
              <div className="p-3 rounded-xl bg-[#030d1d] border border-blue-900/60 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        customAnswer.verdict === 'GO'
                          ? 'bg-emerald-500 text-slate-950'
                          : customAnswer.verdict === 'CAUTION'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {customAnswer.verdict}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {customAnswer.title}
                    </span>
                  </div>

                  {/* Speaker Button to Hear AI's Response in User's Language */}
                  <button
                    onClick={() => {
                      if (isPlayingAnswer) {
                        ttsService.stop();
                      } else {
                        ttsService.speak(
                          `${customAnswer.title}। ${customAnswer.explanation}`,
                          language
                        );
                      }
                    }}
                    className={`p-1.5 rounded-full transition cursor-pointer shrink-0 ${
                      isPlayingAnswer
                        ? 'bg-white text-rose-950 animate-pulse'
                        : 'bg-blue-900 hover:bg-blue-800 text-amber-300'
                    }`}
                    title="Listen response"
                  >
                    {isPlayingAnswer ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {customAnswer.explanation}
                </p>

                <div className="text-[10px] font-mono-data text-slate-400 border-t border-white/5 pt-1.5 flex items-center justify-between">
                  <span>Ref: {customAnswer.officialRef}</span>
                  {customAnswer.timeWindow && (
                    <span className="text-amber-300">{customAnswer.timeWindow}</span>
                  )}
                </div>
              </div>
            )}

            {/* Custom Question Form with Native Voice Input */}
            <form onSubmit={handleSubmitCustom} className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={
                  isListening
                    ? t('copilotListening', language)
                    : t('copilotPlaceholder', language)
                }
                className={`flex-1 bg-[#030d1d] border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition ${
                  isListening
                    ? 'border-rose-500 ring-2 ring-rose-500/50'
                    : 'border-blue-900/60 focus:border-amber-400'
                }`}
              />

              {/* Mic Button */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center transition cursor-pointer shrink-0 shadow ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-[#040e22] hover:bg-blue-900 text-amber-300 border border-blue-900/60'
                }`}
                title={isListening ? 'Stop listening' : 'Speak your question in your language'}
              >
                {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              </button>

              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('copilotSend', language)}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};
