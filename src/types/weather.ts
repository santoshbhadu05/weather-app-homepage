export interface WeatherStation {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  elevation: number; // in meters
  stationCode: string;
  isCoastal?: boolean;
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'fog'
  | 'heatwave'
  | 'snow'
  | 'cyclone';

export interface WeatherAlert {
  id: string;
  severity: 'yellow' | 'orange' | 'red';
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  issuedAt: string;
  validUntil: string;
  category: string;
}

export interface WeatherData {
  station: WeatherStation;
  temperature: number; // Celsius
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number; // percentage
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGust: number; // km/h
  visibility: number; // km
  uvIndex: number;
  dewPoint: number; // Celsius
  precipitationChance: number; // %
  precipitationAmount: number; // mm
  cloudCover: number; // %
  aqi: number; // 0-500 scale
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  // Enhanced Persona parameters
  pollenCount?: {
    tree: 'Low' | 'Moderate' | 'High';
    grass: 'Low' | 'Moderate' | 'High';
    weed: 'Low' | 'Moderate' | 'High';
    overall: 'Low' | 'Moderate' | 'High';
  };
  marine?: {
    seaCondition: 'Calm' | 'Moderate' | 'Rough' | 'Very Rough';
    seaConditionHi: string;
    waveHeight: number; // meters
    waterTemp: number; // Celsius
    highTide: string;
    lowTide: string;
    ripCurrentRisk: 'Low' | 'Moderate' | 'High';
  };
  agriculture?: {
    soilMoisture: number; // percentage
    soilStatus: 'Deficit' | 'Adequate' | 'Saturated' | 'Waterlogged';
    frostRisk: 'None' | 'Low' | 'Moderate' | 'Severe';
    rainfallPrediction3Days: number; // mm
    seasonalGuidance: string;
    seasonalGuidanceHi: string;
  };
  traffic?: {
    delayRisk: 'Low' | 'Moderate' | 'Severe';
    waterloggingAlert: boolean;
    waterloggingLocations: string[];
    visibilityWarning: string;
    visibilityWarningHi: string;
  };
  eventComfort?: {
    comfortIndex: number; // 0-100
    comfortLabel: 'Ideal' | 'Good' | 'Fair' | 'Oppressive' | 'Disruptive';
    eveningHumidity: number;
    squallRisk: boolean;
  };
  condition: WeatherCondition;
  conditionText: string;
  conditionTextHi: string;
  sunrise: string;
  sunset: string;
  updatedAt: string;
  activeAlert?: WeatherAlert;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temp: number;
  feelsLike: number;
  pop: number; // prob of precip %
  windSpeed: number;
  condition: WeatherCondition;
  uvIndex: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
  pop: number;
  humidity: number;
  summary: string;
}

export type PersonaType =
  | 'health'
  | 'fitness'
  | 'surfers'
  | 'travelers'
  | 'parents'
  | 'agriculture'
  | 'commuters'
  | 'events'
  | 'sports';

export interface PersonaAdvisory {
  id: PersonaType;
  title: string;
  titleHi: string;
  iconName: string;
  targetAudience: string;
  score: number; // 0 to 100
  scoreLabel: 'Excellent' | 'Good' | 'Caution' | 'Adverse' | 'Critical';
  summary: string;
  summaryHi: string;
  keyMetricName: string;
  keyMetricValue: string;
  recommendedTimeWindow: string;
  actionableChecklist: {
    text: string;
    textHi: string;
    isUrgent?: boolean;
  }[];
  criticalWarning?: string;
  criticalWarningHi?: string;
}

export interface UserRoutineSlot {
  id: string;
  timeSlot: string; // e.g. "06:00 - 08:00 AM"
  hourStart: number;
  hourEnd: number;
  titleEn: string;
  titleHi: string;
  activityType: 'fitness' | 'commute' | 'school' | 'farming' | 'office' | 'event' | 'leisure';
  weatherImpact: 'Safe' | 'Caution' | 'Hazardous';
  adviceEn: string;
  adviceHi: string;
}

export interface DestinationWeather {
  city: string;
  country: string;
  temp: number;
  condition: WeatherCondition;
  conditionText: string;
  rainChance: number;
  packingSuggestionsEn: string[];
  packingSuggestionsHi: string[];
  flightDelayRisk: 'Minimal' | 'Moderate' | 'High (Fog/Storm)';
  travelWarning?: string;
  travelWarningHi?: string;
}

export interface WeatherScenario {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  data: Partial<WeatherData>;
}

export type SupportedLanguage =
  | 'hi'
  | 'en'
  | 'bn'
  | 'mr'
  | 'te'
  | 'ta'
  | 'gu'
  | 'ur'
  | 'kn'
  | 'or'
  | 'ml'
  | 'pa'
  | 'as'
  | 'sa';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const RECOGNIZED_INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
];
