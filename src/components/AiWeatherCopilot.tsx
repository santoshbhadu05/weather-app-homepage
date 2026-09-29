import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bot,
  ChevronDown,
  ChevronUp,
  X,
  MessageSquare,
} from 'lucide-react';
import { PersonaType, WeatherData } from '../types/weather';

interface AiWeatherCopilotProps {
  weather: WeatherData;
  language: 'en' | 'hi';
  selectedPersona: PersonaType;
  onOpenFullWeather: () => void;
}

interface CopilotAnswer {
  verdict: 'GO' | 'CAUTION' | 'NO-GO';
  title: string;
  explanation: string;
  timeWindow?: string;
  officialRef: string;
}

const PRESET_QUESTIONS: { id: string; persona: PersonaType; qEn: string; qHi: string }[] = [
  {
    id: 'q-child',
    persona: 'parents',
    qEn: 'Is it safe for children to play outside this evening?',
    qHi: 'क्या आज शाम बच्चों का बाहर खेलना सुरक्षित है?',
  },
  {
    id: 'q-crops',
    persona: 'agriculture',
    qEn: 'Best time to irrigate or spray crops today?',
    qHi: 'फसलों में सिंचाई या कीटनाशक छिड़काव का सही समय?',
  },
  {
    id: 'q-travel',
    persona: 'travelers',
    qEn: 'Should I expect flight/highway delays or rain?',
    qHi: 'क्या उड़ान या हाईवे पर मौसम से देरी होगी?',
  },
  {
    id: 'q-run',
    persona: 'fitness',
    qEn: 'What is the best hour for morning running?',
    qHi: 'सुबह दौड़ने का सबसे अनुकूल समय क्या है?',
  },
  {
    id: 'q-health',
    persona: 'health',
    qEn: 'Is AQI safe for asthma & sensitive groups today?',
    qHi: 'क्या आज अस्थमा व एलर्जी मरीजों के लिए बाहर जाना सुरक्षित है?',
  },
  {
    id: 'q-commute',
    persona: 'commuters',
    qEn: 'Will there be underpass waterlogging or major jams?',
    qHi: 'क्या बारिश से अंडरपास में जलभराव या जाम का खतरा है?',
  },
  {
    id: 'q-event',
    persona: 'events',
    qEn: 'Will rain or high wind affect evening outdoor tent?',
    qHi: 'क्या शाम के आउटडोर कार्यक्रम में बारिश या आंधी का खतरा है?',
  },
  {
    id: 'q-surf',
    persona: 'surfers',
    qEn: 'Is sea condition safe for swimming and beach walking?',
    qHi: 'क्या समुद्र में नहाना या बीच पर जाना सुरक्षित है?',
  },
];

export const AiWeatherCopilot: React.FC<AiWeatherCopilotProps> = ({
  weather,
  language,
  selectedPersona,
  onOpenFullWeather,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<CopilotAnswer | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Generate answer based on live weather data
  const generateAnswerFor = (questionText: string): CopilotAnswer => {
    const qLower = questionText.toLowerCase();

    if (qLower.includes('rain') || qLower.includes('बारिश') || qLower.includes('tent') || qLower.includes('waterlog')) {
      if (weather.precipitationChance > 50 || weather.activeAlert?.severity === 'orange') {
        return {
          verdict: 'NO-GO',
          title: language === 'hi' ? 'वर्षा एवं जलभराव का उच्च खतरा' : 'High Precipitation & Inundation Risk',
          explanation:
            language === 'hi'
              ? `वर्षा की संभावना ${weather.precipitationChance}% है। अंडरपास में पानी भरने तथा आउटडोर इवेंट में शामियाने भीगने का अंदेशा है। वाटरप्रूफ व्यवस्था करें।`
              : `Precipitation probability is ${weather.precipitationChance}%. Expect waterlogging at low-lying transit nodes and slippery surfaces. Waterproof shelter required.`,
          timeWindow: 'Next 4-6 Hours',
          officialRef: 'IMD Doppler Radar Reflectivity & Nowcast',
        };
      } else {
        return {
          verdict: 'GO',
          title: language === 'hi' ? 'मौसम अनुकूल एवं वर्षा की संभावना कम' : 'Dry & Clear Window',
          explanation:
            language === 'hi'
              ? `वर्षा की संभावना मात्र ${weather.precipitationChance}% है। खुले में कार्य, यात्रा एवं शाम के कार्यक्रम पूरी तरह सुरक्षित हैं।`
              : `Precipitation probability is very low (${weather.precipitationChance}%). Open-air events, outdoor play, and highway travel are completely viable.`,
          timeWindow: 'Full Day',
          officialRef: 'IMD NWFC Synoptic Guidance',
        };
      }
    }

    if (qLower.includes('run') || qLower.includes('fitness') || qLower.includes('दौड़')) {
      return {
        verdict: weather.feelsLike > 36 ? 'CAUTION' : 'GO',
        title: language === 'hi' ? 'सुबह 5:30 - 7:30 बजे सर्वोत्तम समय' : 'Early Dawn Window Recommended',
        explanation:
          language === 'hi'
            ? `सुबह का तापमान (${weather.temperature - 4}°C) अनुकूल रहेगा। दोपहर में उमस और हीट इंडेक्स बढ़ेगा, इसलिए सुबह ही दौड़ पूरी करें।`
            : `Favorable thermal gradient between 05:30 AM and 07:30 AM. Avoid mid-day workouts as apparent heat index exceeds 35°C.`,
        timeWindow: '05:30 AM - 07:30 AM',
        officialRef: 'IMD Biometeorological Advisory',
      };
    }

    if (qLower.includes('crop') || qLower.includes('फसल') || qLower.includes('सिंचाई')) {
      const isRainComing = weather.precipitationChance > 40;
      return {
        verdict: isRainComing ? 'CAUTION' : 'GO',
        title: isRainComing ? (language === 'hi' ? 'कीटनाशक छिड़काव अभी रोकें' : 'Hold Chemical Sprays') : (language === 'hi' ? 'सिंचाई व छिड़काव हेतु अनुकूल' : 'Optimal for Agri Operations'),
        explanation: isRainComing
          ? (language === 'hi' ? `आगामी घंटों में वर्षा की संभावना है जिससे छिड़काव धुल सकता है। मौसम साफ होने तक प्रतीक्षा करें।` : `Rain probability is elevated. Spraying pesticides now would cause chemical runoff. Postpone by 24 hours.`)
          : (language === 'hi' ? `मृदा नमी ${weather.agriculture?.soilMoisture || 40}% है। आज शाम हल्की सिंचाई व कीटनाशक छिड़काव के लिए उत्तम समय है।` : `Soil moisture is at ${weather.agriculture?.soilMoisture || 40}%. Ideal meteorological window for fertigation and weeding.`),
        timeWindow: 'Afternoon / Evening',
        officialRef: 'Gramin Krishi Mausam Sewa (GKMS)',
      };
    }

    // Default response
    return {
      verdict: weather.activeAlert ? 'CAUTION' : 'GO',
      title: language === 'hi' ? 'वर्तमान मौसम स्थिति अनुकूल' : 'Current Weather Parameters Analyzed',
      explanation:
        language === 'hi'
          ? `वर्तमान तापमान ${weather.temperature}°C, आर्द्रता ${weather.humidity}%, AQI ${weather.aqi}। मौसम अनुसार सामान्य सावधानी बरतते हुए कार्य कर सकते हैं।`
          : `Surface temperature is ${weather.temperature}°C, humidity ${weather.humidity}%, AQI ${weather.aqi}. Routine activities proceed safely with standard precautions.`,
      timeWindow: 'Current Synoptic Hours',
      officialRef: 'IMD Automatic Weather Station Log',
    };
  };

  const handleAskQuestion = (qText: string) => {
    setIsAnalyzing(true);
    setSelectedQuestion(qText);
    setTimeout(() => {
      setCustomAnswer(generateAnswerFor(qText));
      setIsAnalyzing(false);
    }, 300);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    handleAskQuestion(customQuestion);
  };

  // Quick preset pills for bottom bar
  const quickPills = PRESET_QUESTIONS.slice(0, 3);

  return (
    <aside
      aria-label="Mausam Mitra Weather Copilot"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[95%] sm:w-full px-2 pointer-events-auto transition-all duration-300"
    >
      <div className="rounded-2xl border-2 border-blue-500/80 bg-[#061838]/95 backdrop-blur-xl shadow-2xl shadow-black/80 overflow-hidden">
        {/* Top Header Bar of Floating Widget */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-blue-900/30 transition select-none"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 shadow-md shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="text-xs sm:text-sm font-black text-white mr-1.5">
                {language === 'hi' ? 'मौसम मित्र' : 'Mausam Mitra'}
              </span>
              <span className="text-[10px] text-amber-300 font-mono-data hidden sm:inline">
                | AI Weather Copilot
              </span>
            </div>
          </div>

          {/* Quick pills shown when collapsed */}
          {!isExpanded && (
            <div className="hidden md:flex items-center gap-1.5 overflow-hidden">
              {quickPills.map((p) => (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                    handleAskQuestion(language === 'hi' ? p.qHi : p.qEn);
                  }}
                  className="px-2 py-0.5 rounded-full text-[10px] bg-blue-950/80 hover:bg-blue-900 text-slate-200 border border-blue-800/60 truncate max-w-[200px]"
                >
                  {language === 'hi' ? p.qHi : p.qEn}
                </button>
              ))}
            </div>
          )}

          {/* Expand / Collapse toggle icon */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-amber-300 hidden sm:inline">
              {isExpanded ? (language === 'hi' ? 'बंद करें' : 'Collapse') : (language === 'hi' ? 'पूछें' : 'Ask Copilot')}
            </span>
            <div className="p-1 rounded-md bg-blue-900/60 text-white">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {/* Expanded Drawer Content */}
        {isExpanded && (
          <div className="p-3.5 sm:p-4 border-t border-blue-900/50 max-h-[70vh] overflow-y-auto space-y-3">
            {/* Suggested Question Chips */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-300">
                {language === 'hi' ? 'त्वरित प्रश्न चुनें:' : 'Quick Questions:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((q) => {
                  const text = language === 'hi' ? q.qHi : q.qEn;
                  const isCur = selectedQuestion === text;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleAskQuestion(text)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                        isCur
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                          : 'bg-[#030d1d] hover:bg-blue-950 text-slate-200 border-blue-900/60'
                      }`}
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Display */}
            {isAnalyzing && (
              <div className="p-3 rounded-xl bg-[#030d1d] border border-blue-900/40 flex items-center gap-2 text-xs text-amber-300 font-mono-data">
                <span className="h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></span>
                <span>{language === 'hi' ? 'मौसम डेटा विश्लेषित हो रहा है...' : 'Analyzing synoptic observations...'}</span>
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

                  {customAnswer.timeWindow && (
                    <span className="text-[10px] font-mono-data text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                      {customAnswer.timeWindow}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {customAnswer.explanation}
                </p>

                <div className="text-[10px] font-mono-data text-slate-400 border-t border-white/5 pt-1.5">
                  Ref: {customAnswer.officialRef}
                </div>
              </div>
            )}

            {/* Custom Question Form */}
            <form onSubmit={handleSubmitCustom} className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'मौसम मित्र से अपना प्रश्न पूछें...'
                    : 'Ask Mausam Mitra any weather question...'
                }
                className="flex-1 bg-[#030d1d] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{language === 'hi' ? 'पूछें' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};
