import React from 'react';
import { Clock, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { HourlyForecast, PersonaType, WeatherData, SupportedLanguage } from '../types/weather';
import { t } from '../data/translations';

interface DailyRoutineAnalyzerProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
  language: SupportedLanguage;
  selectedPersonas: PersonaType[];
}

interface RoutineItem {
  id: string;
  relevantPersonas: PersonaType[];
  timeSlot: string;
  hourStart: number;
  titleEn: string;
  titleHi: string;
}

const ALL_ROUTINE_SLOTS: RoutineItem[] = [
  {
    id: 'fitness-dawn',
    relevantPersonas: ['fitness', 'health'],
    timeSlot: '05:30 AM - 07:30 AM',
    hourStart: 6,
    titleEn: 'Morning Exercise & Jogging',
    titleHi: 'सुबह का व्यायाम एवं दौड़',
  },
  {
    id: 'school-drop',
    relevantPersonas: ['parents'],
    timeSlot: '07:30 AM - 08:30 AM',
    hourStart: 7,
    titleEn: 'School Morning Commute',
    titleHi: 'बच्चों का सुबह स्कूल प्रस्थान',
  },
  {
    id: 'work-commute',
    relevantPersonas: ['commuters', 'travelers'],
    timeSlot: '08:30 AM - 10:30 AM',
    hourStart: 9,
    titleEn: 'Office & Morning Commute',
    titleHi: 'दफ्तर एवं सुबह का आवागमन',
  },
  {
    id: 'midday-field',
    relevantPersonas: ['agriculture'],
    timeSlot: '11:30 AM - 02:30 PM',
    hourStart: 12,
    titleEn: 'Field Work, Sowing & Spraying',
    titleHi: 'दोपहर का खेत कार्य व छिड़काव',
  },
  {
    id: 'midday-health',
    relevantPersonas: ['health'],
    timeSlot: '12:00 PM - 03:00 PM',
    hourStart: 13,
    titleEn: 'Peak UV & Heat Exposure Window',
    titleHi: 'उच्च यूवी व धूप संपर्क समय',
  },
  {
    id: 'school-pickup',
    relevantPersonas: ['parents'],
    timeSlot: '02:00 PM - 03:30 PM',
    hourStart: 14,
    titleEn: 'School Afternoon Pickup',
    titleHi: 'दोपहर में बच्चों की छुट्टी/पिकअप',
  },
  {
    id: 'beach-tide',
    relevantPersonas: ['surfers'],
    timeSlot: '02:30 PM - 05:00 PM',
    hourStart: 15,
    titleEn: 'High Tide & Surf Session',
    titleHi: 'ज्वार समय एवं सर्फिंग सत्र',
  },
  {
    id: 'evening-return',
    relevantPersonas: ['commuters', 'fitness'],
    timeSlot: '05:30 PM - 08:00 PM',
    hourStart: 18,
    titleEn: 'Evening Commute & Walk',
    titleHi: 'शाम की घर वापसी व सैर',
  },
  {
    id: 'event-night',
    relevantPersonas: ['events'],
    timeSlot: '07:00 PM - 10:30 PM',
    hourStart: 20,
    titleEn: 'Outdoor Event & Dinner Reception',
    titleHi: 'शाम का आउटडोर कार्यक्रम व डिनर',
  },
];

export const DailyRoutineAnalyzer: React.FC<DailyRoutineAnalyzerProps> = ({
  weather,
  hourly,
  language,
  selectedPersonas,
}) => {
  // Filter slots according to selected personas
  const matchedSlots = ALL_ROUTINE_SLOTS.filter((slot) =>
    slot.relevantPersonas.some((p) => selectedPersonas.includes(p))
  );

  // If none match (rare), fall back to common daily routine slots
  const activeSlots = matchedSlots.length > 0 ? matchedSlots : ALL_ROUTINE_SLOTS.slice(0, 3);

  // Helper to fetch live hourly metric
  const getHourWeather = (hour: number) => {
    return (
      hourly.find((h) => h.hour === hour) || {
        temp: weather.temperature,
        feelsLike: weather.feelsLike,
        pop: weather.precipitationChance,
        windSpeed: weather.windSpeed,
        condition: weather.condition,
      }
    );
  };

  return (
    <div className="rounded-2xl border border-blue-900/50 bg-[#071936] p-3.5 sm:p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-blue-900/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-900/50 text-amber-300 border border-blue-700/50">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              {t('routineAnalyzer', language)}
            </h3>
            <span className="text-[10px] text-slate-400">
              {t('routineSubtitle', language)}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono-data text-cyan-300 bg-[#030e20] px-2 py-0.5 rounded border border-blue-900/50">
          {activeSlots.length} {t('timeSlots', language)}
        </span>
      </div>

      {/* Routine Slots List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {activeSlots.map((slot) => {
          const slotWeather = getHourWeather(slot.hourStart);
          const isHazardous =
            slotWeather.feelsLike > 40 ||
            slotWeather.pop > 65 ||
            weather.visibility < 1.0;
          const isCaution =
            slotWeather.feelsLike > 35 ||
            slotWeather.pop > 35 ||
            weather.aqi > 150;

          const status = isHazardous ? 'Hazardous' : isCaution ? 'Caution' : 'Safe';

          // Contextual crisp advice based on live data
          let adviceText = '';
          if (language === 'hi') {
            if (slotWeather.pop > 50) {
              adviceText = `बारिश की ${slotWeather.pop}% संभावना। छाता/रेनकोट साथ रखें।`;
            } else if (slotWeather.feelsLike > 37) {
              adviceText = `अधिक तापमान (महसूस ${slotWeather.feelsLike}°C)। पानी पीते रहें व छाया में रहें।`;
            } else if (weather.aqi > 160) {
              adviceText = `AQI ${weather.aqi}। श्वसन सुरक्षा हेतु मास्क का प्रयोग करें।`;
            } else {
              adviceText = `तापमान ${slotWeather.temp}°C। स्थिति सामान्य व सुगम।`;
            }
          } else {
            if (slotWeather.pop > 50) {
              adviceText = `Rain probability ${slotWeather.pop}%. Carry rain gear.`;
            } else if (slotWeather.feelsLike > 37) {
              adviceText = `High heat (feels ${slotWeather.feelsLike}°C). Stay hydrated.`;
            } else if (weather.aqi > 160) {
              adviceText = `AQI ${weather.aqi}. Limit exertion & wear mask outdoors.`;
            } else {
              adviceText = `Temp ${slotWeather.temp}°C. Clear and favorable conditions.`;
            }
          }

          return (
            <div
              key={slot.id}
              className={`p-3 rounded-xl border transition flex flex-col justify-between gap-2 ${
                status === 'Hazardous'
                  ? 'bg-rose-950/20 border-rose-800/50'
                  : status === 'Caution'
                  ? 'bg-amber-950/20 border-amber-800/50'
                  : 'bg-[#040e22] border-blue-900/40'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-mono-data text-amber-300 font-bold">
                  {slot.timeSlot}
                </span>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    status === 'Hazardous'
                      ? 'bg-rose-600 text-white'
                      : status === 'Caution'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {status}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-white">
                  {language === 'hi' ? slot.titleHi : slot.titleEn}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {adviceText}
                </div>
              </div>

              {/* Live Metric Row */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-data text-slate-400">
                <span>Temp: {slotWeather.temp}°C</span>
                <span>Rain: {slotWeather.pop}%</span>
                <span>Wind: {slotWeather.windSpeed} km/h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
