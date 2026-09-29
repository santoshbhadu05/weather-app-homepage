import React, { useState, useEffect, useCallback, useRef } from 'react';
import { METEOROLOGICAL_STATIONS } from './data/mockStations';
import { DailyForecast, HourlyForecast, PersonaType, WeatherData, WeatherScenario, WeatherStation } from './types/weather';
import { fetchStationWeather } from './services/weatherService';
import { Header } from './components/Header';
import { ProminentVoiceWarningBanner } from './components/ProminentVoiceWarningBanner';
import { PersonalizedHomepageCard } from './components/PersonalizedHomepageCard';
import { DailyRoutineAnalyzer } from './components/DailyRoutineAnalyzer';
import { TravelDestinationAnalyzer } from './components/TravelDestinationAnalyzer';
import { AiWeatherCopilot } from './components/AiWeatherCopilot';
import { FullWeatherModal } from './components/FullWeatherModal';
import { HourlyAndForecast } from './components/HourlyAndForecast';
import { DopplerRadarSimulation } from './components/DopplerRadarSimulation';
import { WeatherSimulationBar } from './components/WeatherSimulationBar';
import { BilingualBulletinModal } from './components/BilingualBulletinModal';
import { ttsService, TTSState } from './services/ttsService';
import { Radio, Globe } from 'lucide-react';

export const App: React.FC = () => {
  const [currentStation, setCurrentStation] = useState<WeatherStation>(METEOROLOGICAL_STATIONS[0]);
  const [liveWeather, setLiveWeather] = useState<WeatherData | null>(null);
  const [activeWeather, setActiveWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('hi'); // Default Hindi for authentic Mausam experience
  const [activeTab, setActiveTab] = useState<string>('nowcast');
  
  // Multi-Select Personas: User can select multiple roles simultaneously!
  const [selectedPersonas, setSelectedPersonas] = useState<PersonaType[]>([
    'health',
    'parents',
    'commuters',
  ]);

  const [isFullWeatherOpen, setIsFullWeatherOpen] = useState<boolean>(false);
  const [currentScenario, setCurrentScenario] = useState<WeatherScenario | null>(null);
  const [isBulletinOpen, setIsBulletinOpen] = useState<boolean>(false);
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    language: 'hi',
  });

  // Section references for smooth scrolling when tab clicked
  const nowcastRef = useRef<HTMLDivElement>(null);
  const forecastRef = useRef<HTMLDivElement>(null);
  const warningsRef = useRef<HTMLDivElement>(null);
  const routineRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<HTMLDivElement>(null);

  // Track TTS playback state
  useEffect(() => {
    return ttsService.subscribe((state) => {
      setTtsState(state);
    });
  }, []);

  // Fetch weather data for selected station
  const loadStationData = useCallback(async (station: WeatherStation) => {
    setIsLoading(true);
    setCurrentScenario(null);
    try {
      const res = await fetchStationWeather(station);
      setLiveWeather(res.weather);
      setActiveWeather(res.weather);
      setHourlyForecast(res.hourly);
      setDailyForecast(res.daily);
    } catch (err) {
      console.error('Failed to load station weather:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStationData(currentStation);
  }, [currentStation, loadStationData]);

  // Toggle Persona in Multi-Select list
  const handleTogglePersona = (persona: PersonaType) => {
    setSelectedPersonas((prev) => {
      if (prev.includes(persona)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((p) => p !== persona);
      } else {
        return [...prev, persona];
      }
    });
  };

  // Handle Scenario selection
  const handleApplyScenario = (scenario: WeatherScenario) => {
    if (!liveWeather) return;
    setCurrentScenario(scenario);
    setActiveWeather({
      ...liveWeather,
      ...scenario.data,
      conditionText: scenario.data.conditionText || liveWeather.conditionText,
      conditionTextHi: scenario.data.conditionTextHi || liveWeather.conditionTextHi,
      activeAlert: scenario.data.activeAlert,
      updatedAt: 'SIMULATED OBSERVATION',
    });
  };

  const handleResetSimulation = () => {
    setCurrentScenario(null);
    if (liveWeather) {
      setActiveWeather(liveWeather);
    }
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'nowcast') nowcastRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (tab === 'forecast') forecastRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (tab === 'warnings') warningsRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (tab === 'routine') routineRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (tab === 'travel') travelRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (tab === 'radar') radarRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (tab === 'simulation') simulationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030d1d] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200 pb-20">
      {/* Official Government of India & IMD Mausam Header */}
      <Header
        currentStation={currentStation}
        onSelectStation={(st) => setCurrentStation(st)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenBulletin={() => setIsBulletinOpen(true)}
        isSimulated={Boolean(currentScenario)}
        onResetSimulation={handleResetSimulation}
        isPlayingAudio={ttsState.isPlaying}
        onStopAudio={() => ttsService.stop()}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Observatory Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 space-y-4 sm:space-y-5">
        {isLoading || !activeWeather ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-3">
            <div className="h-10 w-10 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <p className="text-xs font-mono-data text-slate-400">
              {language === 'hi'
                ? `वेधशाला स्टेशन ${currentStation.name} का डेटा लोड हो रहा है...`
                : `Fetching synoptic data for ${currentStation.name}...`}
            </p>
          </div>
        ) : (
          <>
            {/* 1. TOP PRIORITY: Clean Highlighted Warning with Voice Icon (No extra headlines/lines) */}
            <div ref={warningsRef}>
              <ProminentVoiceWarningBanner
                weather={activeWeather}
                language={language}
              />
            </div>

            {/* 2. Personalized Box: All Selected Roles Shown Together + Voice Feature (No duplicate filter tab) */}
            <div ref={nowcastRef}>
              <PersonalizedHomepageCard
                weather={activeWeather}
                language={language}
                selectedPersonas={selectedPersonas}
                onTogglePersona={handleTogglePersona}
                onOpenFullWeather={() => setIsFullWeatherOpen(true)}
                onOpenCopilot={() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
              />
            </div>

            {/* 3. Daily Routine Analyzer: Filtered according to selected roles, live data based, no extra clutter */}
            <div ref={routineRef}>
              <DailyRoutineAnalyzer
                weather={activeWeather}
                hourly={hourlyForecast}
                language={language}
                selectedPersonas={selectedPersonas}
              />
            </div>

            {/* 4. Travel Route Weather Analyzer: ONLY SHOWN IF 'travelers' ROLE IS SELECTED */}
            {selectedPersonas.includes('travelers') && (
              <div ref={travelRef}>
                <TravelDestinationAnalyzer
                  currentStationName={currentStation.name}
                  language={language}
                />
              </div>
            )}

            {/* 5. 24-Hour Synoptic Trend & 7-Day District Forecast */}
            <div ref={forecastRef}>
              <HourlyAndForecast
                hourly={hourlyForecast}
                daily={dailyForecast}
                language={language}
              />
            </div>

            {/* 6. IMD Doppler Weather Radar (DWR) Simulation */}
            <div ref={radarRef}>
              <DopplerRadarSimulation
                weather={activeWeather}
                language={language}
              />
            </div>

            {/* 7. Live Meteorological Stress Simulator Bar */}
            <div ref={simulationRef}>
              <WeatherSimulationBar
                currentScenarioId={currentScenario?.id ?? null}
                onApplyScenario={handleApplyScenario}
                onReset={handleResetSimulation}
                language={language}
              />
            </div>
          </>
        )}
      </main>

      {/* Floating Sticky Bottom "Mausam Mitra | AI Weather Copilot" Bar */}
      {activeWeather && (
        <AiWeatherCopilot
          weather={activeWeather}
          language={language}
          selectedPersona={selectedPersonas[0] || 'health'}
          onOpenFullWeather={() => setIsFullWeatherOpen(true)}
        />
      )}

      {/* Comprehensive "See Full Weather" Modal */}
      {activeWeather && (
        <FullWeatherModal
          weather={activeWeather}
          hourly={hourlyForecast}
          daily={dailyForecast}
          isOpen={isFullWeatherOpen}
          onClose={() => setIsFullWeatherOpen(false)}
          language={language}
        />
      )}

      {/* Official Spoken Audio Weather Bulletin Modal */}
      {activeWeather && (
        <BilingualBulletinModal
          weather={activeWeather}
          isOpen={isBulletinOpen}
          onClose={() => setIsBulletinOpen(false)}
          defaultLanguage={language}
        />
      )}

      {/* Official Indian Government Portal Footer */}
      <footer className="border-t border-blue-950 bg-[#020813] py-6 text-xs text-slate-400 mt-8 mb-12 sm:mb-8">
        <div className="h-1 w-full bg-tiranga mb-6 -mt-6"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-950 pb-5">
            <div className="flex items-center gap-3 text-left">
              <div className="h-9 w-9 rounded-lg bg-blue-900/40 border border-blue-700/40 flex items-center justify-center p-1.5 shrink-0">
                <Radio className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  भारत मौसम विज्ञान विभाग (IMD) | मौसम MAUSAM Portal
                </div>
                <div className="text-[11px] text-slate-400">
                  पृथ्वी विज्ञान मंत्रालय, भारत सरकार (Ministry of Earth Sciences, Government of India)
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Globe className="h-3 w-3 text-cyan-400" />
                <span>National Portal of India</span>
              </span>
              <span>•</span>
              <span className="text-slate-300">Digital India</span>
              <span>•</span>
              <span className="text-slate-300">Multi-Role Persona Intelligence</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono-data">
            <div>
              Designed & Developed on Government Meteorological Standards • All Rights Reserved © {new Date().getFullYear()}
            </div>
            <div>
              Indian Standard Time (IST UTC+05:30) • WMO Synoptic Station Reporting
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
