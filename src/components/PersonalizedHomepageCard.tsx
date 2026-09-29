import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Flame,
  Waves,
  Compass,
  Baby,
  Sprout,
  Car,
  PartyPopper,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Plus,
  Maximize2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { PersonaType, WeatherData } from '../types/weather';
import { computePersonaAdvisories } from '../data/personaAdvisories';
import { ttsService } from '../services/ttsService';

interface PersonalizedHomepageCardProps {
  weather: WeatherData;
  language: 'en' | 'hi';
  selectedPersonas: PersonaType[];
  onTogglePersona: (p: PersonaType) => void;
  onOpenFullWeather: () => void;
  onOpenCopilot: () => void;
  onOpenTravelModal?: () => void;
}

const PERSONAS: { id: PersonaType; labelEn: string; labelHi: string; icon: any }[] = [
  { id: 'health', labelEn: 'Health & Allergies', labelHi: 'स्वास्थ्य व एलर्जी', icon: HeartPulse },
  { id: 'fitness', labelEn: 'Fitness & Running', labelHi: 'धावक व वर्कआउट', icon: Flame },
  { id: 'surfers', labelEn: 'Beach & Surfers', labelHi: 'समुद्र तट व सर्फर्स', icon: Waves },
  { id: 'travelers', labelEn: 'Travelers & Trips', labelHi: 'यात्री व पर्यटन', icon: Compass },
  { id: 'parents', labelEn: 'Parents & School', labelHi: 'अभिभावक व स्कूल', icon: Baby },
  { id: 'agriculture', labelEn: 'Farmers & Agri', labelHi: 'किसान व कृषि मौसम', icon: Sprout },
  { id: 'commuters', labelEn: 'Daily Commuters', labelHi: 'दैनिक यात्री (ट्रैफिक)', icon: Car },
  { id: 'events', labelEn: 'Event Planners', labelHi: 'इवेंट व विवाह आयोजक', icon: PartyPopper },
];

export const PersonalizedHomepageCard: React.FC<PersonalizedHomepageCardProps> = ({
  weather,
  language,
  selectedPersonas,
  onTogglePersona,
  onOpenFullWeather,
  onOpenCopilot,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const advisories = computePersonaAdvisories(weather);

  useEffect(() => {
    const unsub = ttsService.subscribe((state) => {
      setIsPlayingVoice(state.isPlaying);
    });
    return unsub;
  }, []);

  // Voice playback for all selected personas' combined advisory
  const handlePlayPersonalizedVoice = () => {
    if (isPlayingVoice) {
      ttsService.stop();
      setIsPlayingVoice(false);
      return;
    }

    const summaries = selectedPersonas.map((pId) => {
      const adv = advisories[pId];
      const pMeta = PERSONAS.find((p) => p.id === pId);
      const title = language === 'hi' ? pMeta?.labelHi : pMeta?.labelEn;
      const text = language === 'hi' ? adv.summaryHi : adv.summary;
      return `${title}: ${text}`;
    });

    const prefix =
      language === 'hi'
        ? `आपके चयनित रोल के लिए मौसम सलाह: `
        : `Personalized weather advisory for your selected roles: `;

    const fullSpeech = prefix + summaries.join('. ');
    setIsPlayingVoice(true);
    ttsService.speak(fullSpeech, language);
  };

  // Helper to render metrics for a single persona
  const renderSinglePersonaMetrics = (pId: PersonaType) => {
    switch (pId) {
      case 'health':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'वायु गुणवत्ता (AQI)' : 'Air Quality (AQI)'}
              </div>
              <div className={`text-lg font-bold font-mono-data mt-0.5 ${weather.aqi > 150 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {weather.aqi}
              </div>
              <div className="text-[10px] text-slate-300">PM2.5: {weather.pm25} µg/m³</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'परागकण (Pollen Count)' : 'Pollen Allergy'}
              </div>
              <div className="text-lg font-bold text-amber-400 font-mono-data mt-0.5">
                {weather.pollenCount?.overall || 'Moderate'}
              </div>
              <div className="text-[10px] text-slate-300">Tree: {weather.pollenCount?.tree || 'Mod'} • Grass: {weather.pollenCount?.grass || 'Low'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'यूवी इंडेक्स (त्वचा)' : 'UV Index'}
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono-data mt-0.5">
                {weather.uvIndex} <span className="text-[10px] text-slate-400 font-normal">/ 11+</span>
              </div>
              <div className="text-[10px] text-slate-300">{weather.uvIndex >= 7 ? 'High (SPF 50+)' : 'Moderate Exposure'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'आर्द्रता व उमस' : 'Humidity'}
              </div>
              <div className="text-lg font-bold text-cyan-300 font-mono-data mt-0.5">
                {weather.humidity}%
              </div>
              <div className="text-[10px] text-slate-300">Dew pt: {weather.dewPoint}°C (Asthma check)</div>
            </div>
          </div>
        );

      case 'fitness':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'दौड़ने का सही समय' : 'Best Running Hours'}
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono-data mt-0.5">
                05:30 - 07:30 AM
              </div>
              <div className="text-[10px] text-slate-300">Cool thermal window</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'सूर्योदय व सूर्यास्त' : 'Sunrise & Sunset'}
              </div>
              <div className="text-xs font-bold text-amber-300 font-mono-data mt-0.5">
                🌅 {weather.sunrise} • 🌇 {weather.sunset}
              </div>
              <div className="text-[10px] text-slate-300">Optimal daylight window</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'हवा गति (Wind)' : 'Wind Velocity'}
              </div>
              <div className="text-lg font-bold text-teal-300 font-mono-data mt-0.5">
                {weather.windSpeed} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
              </div>
              <div className="text-[10px] text-slate-300">Gusts: {weather.windGust} km/h</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'हीट अलर्ट' : 'Heat Alert'}
              </div>
              <div className={`text-lg font-bold font-mono-data mt-0.5 ${weather.feelsLike > 36 ? 'text-rose-400' : 'text-amber-300'}`}>
                {weather.feelsLike > 36 ? 'High Strain' : 'Low Stress'}
              </div>
              <div className="text-[10px] text-slate-300">Feels like {weather.feelsLike}°C</div>
            </div>
          </div>
        );

      case 'surfers':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'समुद्री स्थिति' : 'Sea Condition'}
              </div>
              <div className={`text-base font-bold font-mono-data mt-0.5 ${weather.marine?.seaCondition === 'Rough' ? 'text-rose-400' : 'text-cyan-300'}`}>
                {language === 'hi' ? weather.marine?.seaConditionHi : weather.marine?.seaCondition}
              </div>
              <div className="text-[10px] text-slate-300">Rip current: {weather.marine?.ripCurrentRisk}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'लहरों की ऊंचाई' : 'Wave Height'}
              </div>
              <div className="text-lg font-bold text-cyan-300 font-mono-data mt-0.5">
                {weather.marine?.waveHeight || 1.4} <span className="text-[10px] text-slate-400 font-normal">m</span>
              </div>
              <div className="text-[10px] text-slate-300">Clean swell</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'ज्वार-भाटा' : 'Tide Schedule'}
              </div>
              <div className="text-xs font-bold text-amber-300 font-mono-data mt-0.5">
                High: {weather.marine?.highTide || '02:45 PM'}
              </div>
              <div className="text-[10px] text-slate-300 font-mono-data">Low: {weather.marine?.lowTide || '08:30 AM'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'जल तापमान' : 'Water Temp'}
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono-data mt-0.5">
                {weather.marine?.waterTemp || 28}°C
              </div>
              <div className="text-[10px] text-slate-300">Safe bathing temp</div>
            </div>
          </div>
        );

      case 'travelers':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'यात्रा मार्ग जोखिम' : 'Route Transit Risk'}
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono-data mt-0.5">
                Low (Dry Corridors)
              </div>
              <div className="text-[10px] text-slate-300">Origin to destination clear</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'उड़ान मौसम' : 'Flight Delays'}
              </div>
              <div className="text-base font-bold text-emerald-400 font-mono-data mt-0.5">
                {weather.visibility < 1.5 ? 'Fog Delay' : 'On-Time'}
              </div>
              <div className="text-[10px] text-slate-300">RVR: {weather.visibility} km</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'पैकिंग सुझाव' : 'Packing Advice'}
              </div>
              <div className="text-xs font-bold text-amber-300 mt-0.5 truncate">
                {weather.precipitationChance > 40 ? 'Raincoat & umbrella' : 'Light cotton wear'}
              </div>
              <div className="text-[10px] text-slate-300">Route rain: {weather.precipitationChance}%</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'प्रस्थान तापमान' : 'Origin Temp'}
              </div>
              <div className="text-lg font-bold text-white font-mono-data mt-0.5">
                {weather.temperature}°C
              </div>
              <div className="text-[10px] text-slate-300">{weather.conditionText.split(' ')[0]}</div>
            </div>
          </div>
        );

      case 'parents':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'स्कूल प्रस्थान (7-8 AM)' : 'School Commute'}
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono-data mt-0.5">
                Safe & Clear
              </div>
              <div className="text-[10px] text-slate-300">Visibility: {weather.visibility} km</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'बारिश अलर्ट' : 'School Rain Alert'}
              </div>
              <div className={`text-lg font-bold font-mono-data mt-0.5 ${weather.precipitationChance > 40 ? 'text-amber-400' : 'text-cyan-300'}`}>
                {weather.precipitationChance}%
              </div>
              <div className="text-[10px] text-slate-300">{weather.precipitationChance > 40 ? 'Pack raincoat' : 'No rainwear needed'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'दोपहर पिकअप (2-3 PM)' : 'Afternoon Pickup'}
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono-data mt-0.5">
                {weather.tempMax}°C
              </div>
              <div className="text-[10px] text-slate-300">Hydrate kids with water</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'मौसम चेतावनी' : 'Severe Warning'}
              </div>
              <div className={`text-base font-bold font-mono-data mt-0.5 ${weather.activeAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                {weather.activeAlert ? 'Active Alert' : 'No Danger'}
              </div>
              <div className="text-[10px] text-slate-300 truncate">{weather.activeAlert ? weather.activeAlert.category : 'Playgrounds safe'}</div>
            </div>
          </div>
        );

      case 'agriculture':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'मृदा नमी' : 'Soil Moisture'}
              </div>
              <div className="text-lg font-bold text-blue-300 font-mono-data mt-0.5">
                {weather.agriculture?.soilMoisture || 42}%
              </div>
              <div className="text-[10px] text-slate-300">Status: {weather.agriculture?.soilStatus || 'Adequate'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? '3-दिवसीय वर्षा' : '3-Day Rain'}
              </div>
              <div className="text-lg font-bold text-cyan-300 font-mono-data mt-0.5">
                {weather.agriculture?.rainfallPrediction3Days || 0} <span className="text-[10px] text-slate-400 font-normal">mm</span>
              </div>
              <div className="text-[10px] text-slate-300">{weather.precipitationChance > 40 ? 'Hold spray' : 'Safe to spray'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'पाला/शीत लहर' : 'Frost Alert Risk'}
              </div>
              <div className={`text-base font-bold font-mono-data mt-0.5 ${weather.agriculture?.frostRisk === 'Severe' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {weather.agriculture?.frostRisk === 'None' ? 'No Frost' : weather.agriculture?.frostRisk}
              </div>
              <div className="text-[10px] text-slate-300">Min overnight: {weather.tempMin}°C</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'फसल बुवाई सलाह' : 'Planting Guidance'}
              </div>
              <div className="text-xs font-bold text-amber-300 mt-0.5 truncate">
                {language === 'hi' ? weather.agriculture?.seasonalGuidanceHi : weather.agriculture?.seasonalGuidance}
              </div>
              <div className="text-[10px] text-slate-300">GKMS Advisory</div>
            </div>
          </div>
        );

      case 'commuters':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'ट्रैफिक विलंब' : 'Traffic Delay Risk'}
              </div>
              <div className={`text-base font-bold font-mono-data mt-0.5 ${weather.traffic?.delayRisk === 'Severe' ? 'text-rose-400' : weather.traffic?.delayRisk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {weather.traffic?.delayRisk === 'Low' ? 'Smooth (+0 min)' : '+25 min Buffer'}
              </div>
              <div className="text-[10px] text-slate-300">Flow: Normal</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'सड़क दृश्यता' : 'Road Visibility'}
              </div>
              <div className="text-lg font-bold text-indigo-300 font-mono-data mt-0.5">
                {weather.visibility} <span className="text-[10px] text-slate-400 font-normal">km</span>
              </div>
              <div className="text-[10px] text-slate-300 truncate">{language === 'hi' ? weather.traffic?.visibilityWarningHi : weather.traffic?.visibilityWarning}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'अंडरपास जलभराव' : 'Waterlogging'}
              </div>
              <div className={`text-base font-bold font-mono-data mt-0.5 ${weather.traffic?.waterloggingAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                {weather.traffic?.waterloggingAlert ? 'Alert: Flooded' : 'All Clear'}
              </div>
              <div className="text-[10px] text-slate-300">{weather.traffic?.waterloggingAlert ? 'Underpass water' : 'No low-lying water'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'सड़क फिसलन' : 'Pavement Grip'}
              </div>
              <div className="text-base font-bold text-teal-300 font-mono-data mt-0.5">
                {weather.precipitationChance > 40 ? 'Slick Wet' : 'Dry Roads'}
              </div>
              <div className="text-[10px] text-slate-300">Rain chance: {weather.precipitationChance}%</div>
            </div>
          </div>
        );

      case 'events':
      default:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'अतिथि आराम सूचकांक' : 'Guest Comfort'}
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono-data mt-0.5">
                {weather.eventComfort?.comfortIndex || 85}%
              </div>
              <div className="text-[10px] text-slate-300">Rating: {weather.eventComfort?.comfortLabel || 'Good'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'बारिश की संभावना' : 'Rain Probability'}
              </div>
              <div className={`text-lg font-bold font-mono-data mt-0.5 ${weather.precipitationChance > 30 ? 'text-amber-400' : 'text-cyan-300'}`}>
                {weather.precipitationChance}%
              </div>
              <div className="text-[10px] text-slate-300">{weather.precipitationChance > 30 ? 'Pagoda tent advised' : 'Open lawns ready'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'टेंट हवा गति' : 'Truss Wind Speed'}
              </div>
              <div className="text-lg font-bold text-teal-300 font-mono-data mt-0.5">
                {weather.windSpeed} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
              </div>
              <div className="text-[10px] text-slate-300">Gusts: {weather.windGust} km/h</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030d1d] border border-blue-900/50">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? '7-दिवसीय आउटलुक' : '7-Day Outlook'}
              </div>
              <div className="text-sm font-bold text-amber-300 font-mono-data mt-0.5">
                7 Days Stable
              </div>
              <div className="text-[10px] text-slate-300">No squall depression</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-blue-900/60 bg-[#071936] shadow-xl overflow-hidden space-y-0">
      {/* 1. "Who Are You?" MULTI-SELECT Persona Pill Bar */}
      <div className="bg-[#05132b] px-3 sm:px-4 py-2.5 border-b border-blue-900/40">
        <div className="flex items-center justify-between gap-1 text-xs mb-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>
              {language === 'hi'
                ? 'अपनी आवश्यकता चुनें (एक से अधिक चुन सकते हैं):'
                : 'Select Your Roles (Multi-Select Enabled):'}
            </span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono-data bg-black/40 px-2 py-0.5 rounded border border-white/10">
            {selectedPersonas.length} {language === 'hi' ? 'भूमिकाएं चयनित' : 'roles selected'}
          </span>
        </div>

        {/* Multi-Select Horizontal Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PERSONAS.map((p) => {
            const isSelected = selectedPersonas.includes(p.id);

            return (
              <button
                key={p.id}
                onClick={() => onTogglePersona(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/50'
                    : 'bg-[#030e20] hover:bg-blue-950 border-blue-900/50 text-slate-400 hover:text-slate-200'
                }`}
                title={isSelected ? 'Click to deselect' : 'Click to select this role'}
              >
                {isSelected ? (
                  <Check className="h-3 w-3 text-white" />
                ) : (
                  <Plus className="h-3 w-3 text-slate-500" />
                )}
                <span>{language === 'hi' ? p.labelHi : p.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Today's Voice-Enabled Personalized Strip */}
      <div className="px-4 py-2.5 bg-[#0a234d]/70 border-b border-blue-900/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <div className="text-xs sm:text-sm font-bold text-white truncate">
            {language === 'hi' ? 'आपके चयनित रोल अनुसार मौसम विश्लेषण' : 'Weather Analysis For Your Selected Roles'}
          </div>
        </div>

        {/* Voice Feature for Personalized Advisory */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePlayPersonalizedVoice}
            className={`p-2 rounded-full transition cursor-pointer shadow flex items-center justify-center ${
              isPlayingVoice
                ? 'bg-white text-rose-950 ring-2 ring-rose-500 animate-pulse'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
            title={language === 'hi' ? 'व्यक्तिगत मौसम सलाह बोलकर सुनें' : 'Listen to personalized advisory in voice'}
            aria-label="Voice advice"
          >
            {isPlayingVoice ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 3. Unified Display: All Selected Personas Rendered Together (No inner tab filter) */}
      <div className="p-3 sm:p-4 space-y-4">
        {selectedPersonas.map((pId) => {
          const pMeta = PERSONAS.find((p) => p.id === pId);
          const adv = advisories[pId];
          const Icon = pMeta?.icon || Sparkles;

          return (
            <div
              key={pId}
              className="rounded-xl border border-blue-900/50 bg-[#05142e] p-3 sm:p-3.5 space-y-2.5 transition hover:border-blue-700/60"
            >
              {/* Role Header & Advice Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-blue-900/30 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-900/50 text-amber-300 border border-blue-700/40">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white mr-2">
                      {language === 'hi' ? pMeta?.labelHi : pMeta?.labelEn}
                    </span>
                    <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-black/40 text-amber-300 border border-white/10">
                      {adv.scoreLabel} ({adv.score}/100)
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-200 font-medium sm:text-right max-w-xl">
                  {language === 'hi' ? adv.summaryHi : adv.summary}
                </div>
              </div>

              {/* Exact 4 metrics requested for this role */}
              {renderSinglePersonaMetrics(pId)}
            </div>
          );
        })}

        {/* Action Button: See Full Weather */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-blue-900/40">
          <div className="text-[11px] text-slate-400">
            {language === 'hi'
              ? 'विस्तृत सिनॉप्टिक वेधशाला डेटा, डॉपलर रडार और 7-दिवसीय पूर्ण पूर्वानुमान देखने के लिए:'
              : 'For comprehensive synoptic observatory logs, radar reflectivity and 7-day tables:'}
          </div>

          <button
            onClick={onOpenFullWeather}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer w-full sm:w-auto"
          >
            <Maximize2 className="h-4 w-4" />
            <span>{language === 'hi' ? 'पूरा मौसम विवरण देखें' : 'See Full Weather'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
