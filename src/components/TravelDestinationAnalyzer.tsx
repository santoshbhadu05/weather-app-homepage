import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Plane,
  Car,
  CloudRain,
  Sun,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  Luggage,
} from 'lucide-react';
import { WeatherData } from '../types/weather';

interface TravelRouteData {
  id: string;
  destinationCity: string;
  countryOrState: string;
  travelMode: 'air' | 'road';
  transitPoint: string;
  transitPointWeather: {
    temp: number;
    conditionText: string;
    conditionTextHi: string;
    hazard: string;
    hazardHi: string;
  };
  destWeather: {
    temp: number;
    feelsLike: number;
    conditionText: string;
    conditionTextHi: string;
    rainChance: number;
    visibility: string;
  };
  routeAdvisory: string;
  routeAdvisoryHi: string;
  packingAdvice: string[];
  packingAdviceHi: string[];
}

const POPULAR_ROUTES: TravelRouteData[] = [
  {
    id: 'route-manali',
    destinationCity: 'Manali & Rohtang Pass',
    countryOrState: 'Himachal Pradesh',
    travelMode: 'road',
    transitPoint: 'Chandigarh - Bilaspur - Swarghat Ghat Section',
    transitPointWeather: {
      temp: 18,
      conditionText: 'Morning fog on foothills & wet asphalt',
      conditionTextHi: 'पहाड़ी तलहटी पर सुबह का कोहरा एवं गीली सड़क',
      hazard: 'Slippery curve risk at Swarghat',
      hazardHi: 'स्वारघाट मोड़ पर फिसलन का जोखिम',
    },
    destWeather: {
      temp: 7,
      feelsLike: 4,
      conditionText: 'Freezing Mountain Air with Sleet & Snow',
      conditionTextHi: 'बर्फबारी एवं जमा देने वाली ठंड',
      rainChance: 60,
      visibility: '3.0 km',
    },
    routeAdvisory: 'Route Caution: Fog in plains between 5-8 AM; Atal Tunnel sector icy. Use snow chains & verify BRO pass clearance before Solang.',
    routeAdvisoryHi: 'मार्ग परामर्श: मैदानी भाग में सुबह कोहरा, अटल टनल के पास बर्फ की परत। स्नो ग्रिप वाले जूते व भारी जैकेट अनिवार्य।',
    packingAdvice: ['Heavy down jacket & thermal inners', 'Snow boots with deep grip', 'High-SPF mountain sunscreen'],
    packingAdviceHi: ['भारी डाउन जैकेट व इनर थर्मल', 'ग्रिप वाले स्नो बूट्स', 'हाई-SPF सनस्क्रीन व धूप का चश्मा'],
  },
  {
    id: 'route-london',
    destinationCity: 'London (Heathrow)',
    countryOrState: 'United Kingdom',
    travelMode: 'air',
    transitPoint: 'Arabian Gulf / European Air Corridor & Transit Hub',
    transitPointWeather: {
      temp: 24,
      conditionText: 'Clear skies over Gulf, turbulence-free airway',
      conditionTextHi: 'खाड़ी क्षेत्र में साफ आसमान, सामान्य उड़ान',
      hazard: 'None',
      hazardHi: 'कोई खतरा नहीं',
    },
    destWeather: {
      temp: 14,
      feelsLike: 12,
      conditionText: 'Cool Overcast with Intermittent Drizzle',
      conditionTextHi: 'ठंडी हवाएं एवं हल्की बूंदाबांदी',
      rainChance: 75,
      visibility: '8.0 km',
    },
    routeAdvisory: 'Flight transit on schedule. Heathrow low cloud ceiling; carry compact raincoat and umbrella in carry-on bag.',
    routeAdvisoryHi: 'उड़ान सामान्य। हीथ्रो पर बादल एवं हल्की बारिश। केबिन बैग में विंडप्रूफ रेनकोट व छाता साथ रखें।',
    packingAdvice: ['Compact windproof raincoat', 'Water-resistant walking shoes', 'Light layered pullover'],
    packingAdviceHi: ['विंडप्रूफ कॉम्पैक्ट रेनकोट', 'वाटरप्रूफ जूते', 'हल्का ऊनी स्वेटर व छाता'],
  },
  {
    id: 'route-goa',
    destinationCity: 'Goa (Panaji & Beaches)',
    countryOrState: 'Goa Coastal',
    travelMode: 'air',
    transitPoint: 'Konkan Coastal Transit Corridor',
    transitPointWeather: {
      temp: 30,
      conditionText: 'Sunny tropical breeze',
      conditionTextHi: 'धूप व सुहावनी समुद्री हवा',
      hazard: 'None',
      hazardHi: 'कोई रुकावट नहीं',
    },
    destWeather: {
      temp: 31,
      feelsLike: 36,
      conditionText: 'Tropical Sunshine with High Humidity',
      conditionTextHi: 'तेज धूप व उमस भरी समुद्री हवा',
      rainChance: 15,
      visibility: '10.0 km',
    },
    routeAdvisory: 'All flights & coastal roads clear. High UV index at destination beaches; hydrate with electrolytes.',
    routeAdvisoryHi: 'मार्ग पूर्णतः सुरक्षित। समुद्र तट पर तेज धूप व उच्च UV स्तर। सनस्क्रीन व सूती कपड़े साथ रखें।',
    packingAdvice: ['Breathable linen/cotton shirts', 'SPF 50+ Sunscreen & polarized sunglasses', 'Beach sandals'],
    packingAdviceHi: ['सूती कपड़े व टी-शर्ट्स', 'SPF 50+ सनस्क्रीन व चश्मा', 'बीच फुटवियर'],
  },
  {
    id: 'route-srinagar',
    destinationCity: 'Srinagar & Gulmarg',
    countryOrState: 'Jammu & Kashmir',
    travelMode: 'road',
    transitPoint: 'Jammu - Udhampur - Banihal Tunnel Corridor (NH44)',
    transitPointWeather: {
      temp: 15,
      conditionText: 'Patchy morning fog near Ramban & shooting stones watch',
      conditionTextHi: 'रामबन के पास कोहरा व पहाड़ी मार्ग पर सतर्कता',
      hazard: 'Slippery highway stretches in rain',
      hazardHi: 'बारिश में फिसलन',
    },
    destWeather: {
      temp: 11,
      feelsLike: 9,
      conditionText: 'Alpine Chill with Afternoon Cloudiness',
      conditionTextHi: 'पहाड़ी ठंड व आंशिक बादल',
      rainChance: 30,
      visibility: '6.0 km',
    },
    routeAdvisory: 'NH44 traffic regulated at Banihal. Gulmarg gondola operational. Carry layered woolens and skin moisturizer.',
    routeAdvisoryHi: 'बनिहाल सुरंग के पास यातायात सामान्य। गर्म मफलर, जैकेट एवं कोल्ड क्रीम साथ रखें।',
    packingAdvice: ['Layered fleece jacket & muffler', 'Moisturizer / lip balm for cold winds', 'Sturdy walking shoes'],
    packingAdviceHi: ['गर्म जैकेट व मफलर', 'कोल्ड क्रीम व लिप बाम', 'मजबूत वॉकिंग जूते'],
  },
  {
    id: 'route-jaipur',
    destinationCity: 'Jaipur (Pink City)',
    countryOrState: 'Rajasthan',
    travelMode: 'road',
    transitPoint: 'Delhi-Mumbai Expressway (NE4) / Gurugram-Dausa Sector',
    transitPointWeather: {
      temp: 32,
      conditionText: 'Hot dry pavement, high tire friction temperature',
      conditionTextHi: 'गर्म सड़क सतह, तेज धूप',
      hazard: 'Tire blowout risk under low pressure',
      hazardHi: 'टायर प्रेशर जांचें',
    },
    destWeather: {
      temp: 34,
      feelsLike: 35,
      conditionText: 'Dry Bright Sunshine & Clear Sky',
      conditionTextHi: 'तेज धूप व साफ आसमान',
      rainChance: 0,
      visibility: '10.0 km',
    },
    routeAdvisory: 'Expressway corridor 100% dry and fast. Maintain recommended vehicle tire pressure in afternoon heat.',
    routeAdvisoryHi: 'एक्सप्रेसवे पर निर्बाध यात्रा। दोपहर की धूप से बचने हेतु सनग्लासेस व पानी की बोतल साथ रखें।',
    packingAdvice: ['Cotton scarves for sun protection', 'Comfortable sneakers for heritage fort walks', 'Water flask'],
    packingAdviceHi: ['धूप से बचाव के लिए सूती स्कार्फ', 'किलों में घूमने हेतु आरामदायक जूते', 'पानी की बोतल'],
  },
];

interface TravelDestinationAnalyzerProps {
  currentStationName: string;
  language: 'en' | 'hi';
}

export const TravelDestinationAnalyzer: React.FC<TravelDestinationAnalyzerProps> = ({
  currentStationName,
  language,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-manali');

  const activeRoute =
    POPULAR_ROUTES.find((r) => r.id === selectedRouteId) || POPULAR_ROUTES[0];

  return (
    <div className="rounded-2xl border border-blue-900/60 bg-[#071936] p-3.5 sm:p-4 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-900/50 text-amber-300 border border-blue-700/50">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>{language === 'hi' ? 'यात्रा व पर्यटन: संपूर्ण मार्ग मौसम विश्लेषक' : 'Traveler & Tourist: Complete Route Weather Analyzer'}</span>
              <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                Full Corridor
              </span>
            </h3>
            <span className="text-[10px] text-slate-400">
              {language === 'hi'
                ? 'प्रस्थान स्टेशन से लेकर मध्य मार्ग और गंतव्य तक का लाइव मौसम पूर्वानुमान'
                : 'Live multi-point weather across origin, midway transit corridor, and final destination'}
            </span>
          </div>
        </div>

        {/* Route Selector Buttons */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {POPULAR_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                selectedRouteId === route.id
                  ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                  : 'bg-[#030e20] hover:bg-blue-950 border-blue-900/50 text-slate-300'
              }`}
            >
              {route.destinationCity.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Route Journey Visualizer: Origin -> Transit Point -> Destination */}
      <div className="p-3 rounded-xl bg-[#040e22] border border-blue-900/40 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
          {/* Step 1: Origin */}
          <div className="p-2.5 rounded-lg bg-[#071936] border border-blue-900/50 flex flex-col justify-between gap-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
              <span>1. {language === 'hi' ? 'प्रस्थान स्टेशन' : 'Origin Station'}</span>
              <span className="text-emerald-400 font-bold">Start</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">
              {currentStationName}
            </div>
            <div className="text-[11px] text-slate-300">
              {language === 'hi' ? 'स्थानीय मौसम सामान्य, यात्रा प्रस्थान सुगम' : 'Current local origin weather stable'}
            </div>
          </div>

          {/* Step 2: Transit Corridor / Midway */}
          <div className="p-2.5 rounded-lg bg-[#071936] border border-amber-900/40 flex flex-col justify-between gap-1">
            <div className="flex items-center justify-between text-[10px] text-amber-300 font-semibold uppercase">
              <span className="flex items-center gap-1">
                {activeRoute.travelMode === 'air' ? <Plane className="h-3 w-3" /> : <Car className="h-3 w-3" />}
                <span>2. {language === 'hi' ? 'मध्य मार्ग / ट्रांजिट' : 'Midway Transit'}</span>
              </span>
              <span className="font-mono-data">{activeRoute.transitPointWeather.temp}°C</span>
            </div>
            <div className="text-xs font-bold text-slate-200 truncate">
              {activeRoute.transitPoint}
            </div>
            <div className="text-[10px] text-amber-200">
              {language === 'hi' ? activeRoute.transitPointWeather.conditionTextHi : activeRoute.transitPointWeather.conditionText}
            </div>
          </div>

          {/* Step 3: Final Destination */}
          <div className="p-2.5 rounded-lg bg-[#071936] border border-blue-900/50 flex flex-col justify-between gap-1">
            <div className="flex items-center justify-between text-[10px] text-cyan-300 font-semibold uppercase">
              <span>3. {language === 'hi' ? 'गंतव्य शहर' : 'Final Destination'}</span>
              <span className="text-base font-bold font-mono-data text-white">{activeRoute.destWeather.temp}°C</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">
              {activeRoute.destinationCity}
            </div>
            <div className="text-[10px] text-slate-300">
              {language === 'hi' ? activeRoute.destWeather.conditionTextHi : activeRoute.destWeather.conditionText} • Rain: {activeRoute.destWeather.rainChance}%
            </div>
          </div>
        </div>

        {/* Route Advisory & Packing Guidance Box */}
        <div className="pt-2 border-t border-blue-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-1 max-w-2xl">
            <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{language === 'hi' ? 'पूरे मार्ग हेतु मौसम परामर्श:' : 'Complete Route Advisory:'}</span>
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              {language === 'hi' ? activeRoute.routeAdvisoryHi : activeRoute.routeAdvisory}
            </p>
          </div>

          {/* Packing suggestions */}
          <div className="p-2 rounded-lg bg-[#030e20] border border-blue-900/40 text-[11px] shrink-0 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1">
              <Luggage className="h-3.5 w-3.5" />
              <span>{language === 'hi' ? 'यात्रा पैकिंग चेकलिस्ट:' : 'Packing Checklist:'}</span>
            </div>
            <ul className="text-slate-300 list-disc list-inside space-y-0.5 text-[10px]">
              {(language === 'hi' ? activeRoute.packingAdviceHi : activeRoute.packingAdvice).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
