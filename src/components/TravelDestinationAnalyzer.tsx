import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Plane,
  Car,
  Train,
  Bus,
  CloudRain,
  Sun,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  Luggage,
  Clock,
  Navigation,
} from 'lucide-react';
import { SupportedLanguage } from '../types/weather';
import { t } from '../data/translations';

interface TravelDestinationAnalyzerProps {
  currentStationName: string;
  language: SupportedLanguage;
}

export const TravelDestinationAnalyzer: React.FC<TravelDestinationAnalyzerProps> = ({
  currentStationName,
  language,
}) => {
  const [origin, setOrigin] = useState<string>(currentStationName);
  const [destination, setDestination] = useState<string>('Manali & Rohtang');
  const [travelTime, setTravelTime] = useState<string>('today-morning');
  const [vehicleMode, setVehicleMode] = useState<'car' | 'flight' | 'train' | 'bus'>('car');

  // Sync origin when current station changes if origin was untouched
  React.useEffect(() => {
    if (!origin || origin.includes('Delhi') || origin.includes('Station')) {
      setOrigin(currentStationName);
    }
  }, [currentStationName]);

  // Dynamic analysis based on inputs
  const isHighAltitude = destination.toLowerCase().includes('manali') || destination.toLowerCase().includes('srinagar');
  const isInternational = destination.toLowerCase().includes('london') || destination.toLowerCase().includes('dubai');
  const isCoastal = destination.toLowerCase().includes('goa') || destination.toLowerCase().includes('mumbai');

  // Computed destination weather
  const destTemp = isHighAltitude ? 8 : isInternational ? (destination.toLowerCase().includes('london') ? 14 : 36) : isCoastal ? 31 : 33;
  const destRainChance = isInternational && destination.toLowerCase().includes('london') ? 70 : isHighAltitude ? 55 : isCoastal ? 25 : 10;
  const destCondition = isHighAltitude
    ? (language === 'en' ? 'Freezing Mountain Air with Sleet/Snow' : 'बर्फबारी व जमा देने वाली ठंड')
    : isInternational && destination.toLowerCase().includes('london')
    ? (language === 'en' ? 'Cool Drizzle with Low Ceiling' : 'ठंडी हवाएं व हल्की बारिश')
    : (language === 'en' ? 'Warm Sunshine with Clear Skies' : 'तेज धूप व साफ मौसम');

  // Computed transit waypoint & hazards
  const transitCorridor = isHighAltitude
    ? (language === 'en' ? 'Chandigarh - Bilaspur - Swarghat Ghat Section' : 'चंडीगढ़ - बिलासपुर - स्वारघाट पहाड़ी मोड़')
    : isInternational
    ? (language === 'en' ? 'International Airway Transit & Sky Corridor' : 'अंतरराष्ट्रीय हवाई गलियारा व पारगमन हब')
    : (language === 'en' ? 'National Expressway & Intercity Flyover Corridor' : 'राष्ट्रीय एक्सप्रेसवे व अंतर्नगरीय फ्लाईओवर');

  const transitTemp = isHighAltitude ? 17 : isInternational ? 22 : 30;
  const transitRisk = isHighAltitude
    ? (language === 'en' ? 'Morning fog on foothills & wet hairpin bends' : 'तलहटी पर सुबह कोहरा व तीखे मोड़ों पर फिसलन')
    : vehicleMode === 'flight'
    ? (language === 'en' ? 'Normal CAT-II radar approach, minimal turbulence' : 'सामान्य रडार दृष्टिकोण, न्यूनतम हलचल')
    : (language === 'en' ? 'Dry asphalt, normal high-speed cruising' : 'सूखी सड़क, सामान्य गति से आवागमन');

  // Route advisory text
  const routeAdvisory = isHighAltitude
    ? language === 'en'
      ? `Caution for ${vehicleMode.toUpperCase()} travel to ${destination}: Morning fog reduces visibility below 1.5 km in foothills. Ghat sectors icy near Atal Tunnel. Snow chains and anti-slip tires required.`
      : `${destination} हेतु ${vehicleMode === 'car' ? 'सड़क' : 'यात्रा'} परामर्श: तलहटी में सुबह कोहरा दृश्यता कम कर रहा है। ऊंचाई वाले मोड़ों पर बर्फ की पतली परत है। स्नो-ग्रिप वाले जूते व भारी जैकेट अनिवार्य।`
    : isInternational && destination.toLowerCase().includes('london')
    ? language === 'en'
      ? `Flight route clear over continental airspace. Low cloud ceiling & damp drizzle upon London Heathrow arrival. Carry compact raincoat.`
      : `उड़ान मार्ग पूर्णतः स्पष्ट। लंदन आगमन पर हल्की फुहार व बादल छाए रहने का अनुमान। केबिन बैग में विंडप्रूफ छाता व रेनकोट रखें।`
    : language === 'en'
    ? `Route from ${origin} to ${destination} via ${vehicleMode.toUpperCase()} is 100% operational. Pavement dry, no low-lying water traps.`
    : `${origin} से ${destination} तक ${vehicleMode === 'car' ? 'सड़क' : 'वाहन'} मार्ग पूरी तरह सुचारू है। मौसम साफ है।`;

  const packingList = isHighAltitude
    ? language === 'en'
      ? ['Heavy down jacket & thermal layers', 'Deep-tread snow boots', 'High-SPF mountain sunscreen', 'Thermos flask']
      : ['भारी डाउन जैकेट व इनर थर्मल', 'ग्रिप वाले स्नो बूट्स', 'हाई-SPF सनस्क्रीन व चश्मा', 'गर्म पानी की थर्मस बोतल']
    : isInternational && destination.toLowerCase().includes('london')
    ? language === 'en'
      ? ['Windproof compact raincoat', 'Water-resistant walking shoes', 'Layered fleece sweater', 'Foldable umbrella']
      : ['विंडप्रूफ कॉम्पैक्ट रेनकोट', 'वाटरप्रूफ जूते', 'हल्का ऊनी स्वेटर', 'मजबूत छाता']
    : language === 'en'
    ? ['Breathable cotton clothing', 'Sunglasses & UV protection', 'Water bottle with electrolytes']
    : ['हल्के सूती कपड़े', 'धूप का चश्मा व कैप', 'पीने के पानी की बोतल'];

  return (
    <div className="rounded-2xl border border-blue-900/60 bg-[#071936] p-3.5 sm:p-4 shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-900/50 text-amber-300 border border-blue-700/50 shrink-0">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>{t('travelPlanner', language)}</span>
              <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                Interactive Route
              </span>
            </h3>
            <span className="text-[10px] text-slate-400">
              {language === 'en'
                ? 'Check complete route weather before you travel'
                : 'प्रस्थान, मध्य मार्ग और गंतव्य का संयुक्त मौसम पूर्वानुमान'}
            </span>
          </div>
        </div>

        {/* Quick popular destinations */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {['Manali & Rohtang', 'London', 'Goa', 'Dubai', 'Srinagar', 'Jaipur'].map((city) => (
            <button
              key={city}
              onClick={() => setDestination(city)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition cursor-pointer border ${
                destination === city
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-[#030e20] text-slate-300 hover:text-white border-blue-900/50'
              }`}
            >
              {city.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Interactive Route Inputs: Origin, Destination, When, Vehicle Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-[#040e22] p-3 rounded-xl border border-blue-900/50">
        {/* 1. Origin (कहाँ से) */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            {t('fromOrigin', language)}
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Origin station"
            className="w-full bg-[#071936] border border-blue-900/60 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* 2. Destination (कहाँ तक) */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            {t('toDest', language)}
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination city"
            className="w-full bg-[#071936] border border-blue-900/60 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* 3. When (कब यात्रा करनी है) */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            {t('whenTime', language)}
          </label>
          <select
            value={travelTime}
            onChange={(e) => setTravelTime(e.target.value)}
            className="w-full bg-[#071936] border border-blue-900/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="today-morning">{language === 'en' ? 'Today Morning (6-11 AM)' : 'आज सुबह (6-11 AM)'}</option>
            <option value="today-afternoon">{language === 'en' ? 'Today Afternoon (12-4 PM)' : 'आज दोपहर (12-4 PM)'}</option>
            <option value="today-evening">{language === 'en' ? 'Today Evening (5-9 PM)' : 'आज शाम (5-9 PM)'}</option>
            <option value="tomorrow">{language === 'en' ? 'Tomorrow Full Day' : 'कल पूरे दिन'}</option>
          </select>
        </div>

        {/* 4. Vehicle / Mode (वाहन माध्यम) */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
            {t('travelMode', language)}
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'car', icon: Car, label: t('car', language) },
              { id: 'flight', icon: Plane, label: t('flight', language) },
              { id: 'train', icon: Train, label: t('train', language) },
              { id: 'bus', icon: Bus, label: t('bus', language) },
            ].map((m) => {
              const Icon = m.icon;
              const isCur = vehicleMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setVehicleMode(m.id as any)}
                  className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold transition cursor-pointer border ${
                    isCur
                      ? 'bg-blue-600 text-white border-blue-400 shadow'
                      : 'bg-[#071936] text-slate-400 hover:text-white border-blue-900/50'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Route Corridor (Origin -> Transit -> Destination) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {/* Segment 1: Origin */}
        <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
            <span>1. {language === 'en' ? 'Origin Station' : 'प्रस्थान स्टेशन'}</span>
            <span className="text-emerald-400 font-bold font-mono-data">Departure</span>
          </div>
          <div className="text-sm font-bold text-white truncate">{origin}</div>
          <div className="text-[11px] text-slate-300">
            {language === 'en' ? 'Local weather stable' : 'प्रस्थान बिंदु पर मौसम सामान्य'}
          </div>
        </div>

        {/* Segment 2: Transit Waypoint */}
        <div className="p-3 rounded-xl bg-[#040e22] border border-amber-900/40 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-amber-300 font-semibold uppercase">
            <span>2. {language === 'en' ? 'Midway Corridor' : 'मध्य मार्ग / ट्रांजिट'}</span>
            <span className="font-mono-data">{transitTemp}°C</span>
          </div>
          <div className="text-xs font-bold text-slate-200 truncate">{transitCorridor}</div>
          <div className="text-[10px] text-amber-200 leading-snug">{transitRisk}</div>
        </div>

        {/* Segment 3: Destination */}
        <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-cyan-300 font-semibold uppercase">
            <span>3. {language === 'en' ? 'Destination' : 'अंतिम गंतव्य'}</span>
            <span className="text-base font-bold font-mono-data text-white">{destTemp}°C</span>
          </div>
          <div className="text-sm font-bold text-white truncate">{destination}</div>
          <div className="text-[10px] text-slate-300">
            {destCondition} • {language === 'en' ? 'Rain' : 'वर्षा'}: {destRainChance}%
          </div>
        </div>
      </div>

      {/* Advisory & Packing Checklist */}
      <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{t('routeAdvisory', language)}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">{routeAdvisory}</p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#071936] border border-blue-900/50 text-[11px] shrink-0 space-y-1">
          <div className="font-bold text-cyan-300 flex items-center gap-1">
            <Luggage className="h-3.5 w-3.5" />
            <span>{t('packingChecklist', language)}</span>
          </div>
          <ul className="text-slate-300 text-[10px] space-y-0.5 list-disc list-inside">
            {packingList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
