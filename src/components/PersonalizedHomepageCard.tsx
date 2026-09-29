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
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { PersonaType, WeatherData, SupportedLanguage } from '../types/weather';
import { computePersonaAdvisories } from '../data/personaAdvisories';
import { getLocalizedPersonaSummary } from '../data/localizedAdvisories';
import { ttsService } from '../services/ttsService';
import { t } from '../data/translations';

interface PersonalizedHomepageCardProps {
  weather: WeatherData;
  language: SupportedLanguage;
  selectedPersonas: PersonaType[];
  onTogglePersona: (p: PersonaType) => void;
  onOpenFullWeather: () => void;
}

const PERSONA_NAMES: Record<SupportedLanguage, Record<PersonaType, string>> = {
  hi: { health: 'स्वास्थ्य व एलर्जी', fitness: 'धावक व वर्कआउट', parents: 'अभिभावक व स्कूल', commuters: 'दैनिक यात्री (ट्रैफिक)', travelers: 'यात्री व पर्यटन', agriculture: 'किसान व कृषि मौसम', events: 'इवेंट व विवाह आयोजक', surfers: 'समुद्र तट व सर्फर्स', sports: 'आउटडोर खेल' },
  en: { health: 'Health & Allergies', fitness: 'Fitness & Running', parents: 'Parents & School', commuters: 'Daily Commuters (Traffic)', travelers: 'Travelers & Trips', agriculture: 'Farmers & Agri', events: 'Event Planners', surfers: 'Beach & Surfers', sports: 'Outdoor Sports' },
  bn: { health: 'স্বাস্থ্য ও অ্যালার্জি', fitness: 'ফিটনেস ও দৌড়', parents: 'অভিভাবক ও স্কুল', commuters: 'দৈনিক যাত্রী (ট্র্যাফিক)', travelers: 'ভ্রমণকারী ও পর্যটন', agriculture: 'কৃষক ও কৃষি আবহাওয়া', events: 'ইভেন্ট পরিকল্পনাকারী', surfers: 'সমুদ্র সৈকত ও সার্ফার', sports: 'বহিরঙ্গন খেলাধুলা' },
  mr: { health: 'आरोग्य व ॲलर्जी', fitness: 'धावक व कसरत', parents: 'पालक व शाळा', commuters: 'दैनंदिन प्रवासी (वाहतूक)', travelers: 'प्रवासी व पर्यटन', agriculture: 'शेतकरी व कृषी हवामान', events: 'कार्यक्रम आयोजक', surfers: 'समुद्रकिनारा व सर्फर्स', sports: 'मैदानी खेळ' },
  te: { health: 'ఆరోగ్యం & అలెర్జీలు', fitness: 'ఫిట్‌నెస్ & రన్నింగ్', parents: 'తల్లిదండ్రులు & పాఠశాల', commuters: 'రోజువారీ ప్రయాణికులు', travelers: 'యాత్రికులు & పర్యటనలు', agriculture: 'రైతులు & వ్యవసాయం', events: 'ఈవెంట్ ప్లానర్లు', surfers: 'సముద్ర తీరం & సర్ఫర్లు', sports: 'బహిరంగ క్రీడలు' },
  ta: { health: 'சுகாதாரம் & ஒவ்வாமை', fitness: 'உடற்பயிற்சி & ஓட்டம்', parents: 'பெற்றோர் & பள்ளி', commuters: 'தினசரி பயணிகள்', travelers: 'பயணிகள் & சுற்றுலா', agriculture: 'விவசாயிகள் & வானிலை', events: 'நிகழ்வு அமைப்பாளர்கள்', surfers: 'கடற்கரை & சர்ஃபர்ஸ்', sports: 'வெளிப்புற விளையாட்டுகள்' },
  gu: { health: 'આરોગ્ય અને એલર્જી', fitness: 'દોડવીર અને વર્કઆઉટ', parents: 'વાલીઓ અને શાળા', commuters: 'દૈનિક મુસાફરો (ટ્રાફિક)', travelers: 'મુસાફરો અને પ્રવાસન', agriculture: 'ખેડૂતો અને કૃષિ હવામાન', events: 'ઇવેન્ટ આયોજકો', surfers: 'દરિયાકિનારો અને સર્ફર્સ', sports: 'આઉટડોર રમતો' },
  ur: { health: 'صحت اور الرجی', fitness: 'ورزش اور دوڑ', parents: 'والدین اور اسکول', commuters: 'روزانہ کے مسافر', travelers: 'مسافر اور سیاحت', agriculture: 'کسان اور زراعت', events: 'تقریبات کے منتظمین', surfers: 'ساحل سمندر اور سرفرز', sports: 'بیرونی کھیل' },
  kn: { health: 'ಆರೋಗ್ಯ ಮತ್ತು ಅಲರ್ಜಿ', fitness: 'ಫಿಟ್ನೆಸ್ ಮತ್ತು ಓಟ', parents: 'ಪೋಷಕರು ಮತ್ತು ಶಾಲೆ', commuters: 'ದೈನಂದಿನ ಪ್ರಯಾಣಿಕರು', travelers: 'ಪ್ರಯಾಣಿಕರು ಮತ್ತು ಪ್ರವಾಸ', agriculture: 'ರೈತರು ಮತ್ತು ಕೃಷಿ', events: 'ಕಾರ್ಯಕ್ರಮ ಸಂಘಟಕರು', surfers: 'ಸಮುದ್ರ ತೀರ ಮತ್ತು ಸರ್ಫರ್‌ಗಳು', sports: 'ಹೊರಾಂಗಣ ಕ್ರೀಡೆಗಳು' },
  or: { health: 'ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ଆଲର୍ଜି', fitness: 'ଫିଟନେସ ଏବଂ ଦୌଡ଼', parents: 'ଅଭିଭାବକ ଏବଂ ବିଦ୍ୟାଳୟ', commuters: 'ଦୈନନ୍ଦିନ ଯାତ୍ରୀ', travelers: 'ଯାତ୍ରୀ ଏବଂ ପର୍ଯ୍ୟଟନ', agriculture: 'କୃଷକ ଏବଂ କୃଷି', events: 'କାର୍ଯ୍ୟକ୍ରମ ଆୟୋଜକ', surfers: 'ସମୁଦ୍ର କୂଳ ଏବଂ ସର୍ଫର୍ସ', sports: 'ବାହ୍ୟ ଖେଳ' },
  ml: { health: 'ആരോഗ്യവും അലർജിയും', fitness: 'വ്യായാമവും ഓട്ടവും', parents: 'മാതാപിതാക്കളും സ്കൂളും', commuters: 'ദിവസേനയുള്ള യാത്രക്കാർ', travelers: 'യാത്രക്കാരും ടൂറിസവും', agriculture: 'കർഷകരും കൃഷിയും', events: 'ഇവന്റ് പ്ലാനർമാർ', surfers: 'കടൽത്തീരവും സർഫർമാരും', sports: 'ഔട്ട്ഡോർ സ്പോർട്സ്' },
  pa: { health: 'ਸਿਹਤ ਅਤੇ ਐਲਰਜੀ', fitness: 'ਦੌੜਾਕ ਅਤੇ ਕਸਰਤ', parents: 'ਮਾਪੇ ਅਤੇ ਸਕੂਲ', commuters: 'ਰੋਜ਼ਾਨਾ ਯਾਤਰੀ', travelers: 'ਯਾਤਰੀ ਅਤੇ ਸੈਰ-ਸਪਾਟਾ', agriculture: 'ਕਿਸਾਨ ਅਤੇ ਖੇਤੀਬਾੜੀ', events: 'ਸਮਾਗਮ ਪ੍ਰਬੰਧਕ', surfers: 'ਸਮੁੰਦਰੀ ਕੰਢਾ ਅਤੇ ਸਰਫਰ', sports: 'ਆਊਟਡੋਰ ਖੇਡਾਂ' },
  as: { health: 'স্বাস্থ্য আৰু এলাৰ্জী', fitness: 'ফিটনেছ আৰু দৌৰ', parents: 'অভিভাৱক আৰু বিদ্যালয়', commuters: 'দৈনন্দিন যাত্ৰী', travelers: 'যাত্ৰী আৰু পৰ্যটন', agriculture: 'কৃষক আৰু কৃষি বতৰ', events: 'অনুষ্ঠান পৰিকল্পনাকাৰী', surfers: 'সাগৰৰ পাৰ আৰু চাৰ্ফাৰ', sports: 'বহিঃদ্বাৰ খেল' },
  sa: { health: 'स्वास्थ्यम् एलर्जी च', fitness: 'धावकाः व्यायामश्च', parents: 'अभिभावकाः विद्यालयश्च', commuters: 'दैनिकयात्रिकाः', travelers: 'यात्रिकाः पर्यटनं च', agriculture: 'कृषकाः कृषिमौसमम्', events: 'कार्यक्रमआयोजकाः', surfers: 'समुद्रतटं सर्फर्स च', sports: 'बहिःक्रीडाः' },
};

const PERSONA_ICONS: Record<PersonaType, any> = {
  health: HeartPulse,
  fitness: Flame,
  parents: Baby,
  commuters: Car,
  travelers: Compass,
  agriculture: Sprout,
  events: PartyPopper,
  surfers: Waves,
  sports: Flame,
};

const PERSONA_ORDER: PersonaType[] = [
  'health',
  'fitness',
  'parents',
  'commuters',
  'travelers',
  'agriculture',
  'events',
  'surfers',
];

interface MetricItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
  isHighlight?: boolean;
}

export const PersonalizedHomepageCard: React.FC<PersonalizedHomepageCardProps> = ({
  weather,
  language,
  selectedPersonas,
  onTogglePersona,
  onOpenFullWeather,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const advisories = computePersonaAdvisories(weather);

  useEffect(() => {
    const unsub = ttsService.subscribe((state) => {
      setIsPlayingVoice(state.isPlaying);
    });
    return unsub;
  }, []);

  // Voice playback in the selected Indian language
  const handlePlayVoice = () => {
    if (isPlayingVoice) {
      ttsService.stop();
      setIsPlayingVoice(false);
      return;
    }

    const suggestionsList: string[] = [];

    selectedPersonas.forEach((pId) => {
      const text = getLocalizedPersonaSummary(pId, weather, language);
      if (!suggestionsList.includes(text)) {
        suggestionsList.push(text);
      }
    });

    const prefix = t('suggestionsAndPrecautions', language) + ': ';
    const fullSpeech = prefix + suggestionsList.join('. ');
    setIsPlayingVoice(true);
    ttsService.speak(fullSpeech, language);
  };

  // Localized metric titles
  const getLocalizedMetricLabel = (key: string): string => {
    const labels: Record<string, Record<SupportedLanguage, string>> = {
      aqi: {
        hi: 'वायु गुणवत्ता (AQI)', en: 'Air Quality (AQI)', bn: 'বায়ুর মান (AQI)', mr: 'हवेची गुणवत्ता (AQI)',
        te: 'గాలి నాణ్యత (AQI)', ta: 'காற்றின் தரம் (AQI)', gu: 'હવાની ગુણવત્તા (AQI)', ur: 'ہوا کا معیار (AQI)',
        kn: 'ವಾಯು ಗುಣಮಟ್ಟ (AQI)', or: 'ବାୟୁ ଗୁଣବତ୍ତା (AQI)', ml: 'വായു ഗുണനിലവാരം (AQI)', pa: 'ਹਵਾ ਗੁਣਵੱਤਾ (AQI)',
        as: 'বায়ুৰ গুণাগুণ (AQI)', sa: 'वायुगुणवत्ता (AQI)',
      },
      pollen: {
        hi: 'परागकण (Pollen)', en: 'Pollen Allergy', bn: 'পরাগ অ্যালার্জি', mr: 'परागकण ॲलर्जी',
        te: 'పరాగరేణువుల అలెర్జీ', ta: 'மகரந்த ஒவ்வாமை', gu: 'પરાગરજ એલર્જી', ur: 'پولن الرجی',
        kn: 'ಪರಾಗ ಅಲರ್ಜಿ', or: 'ପରାଗ ଆଲର୍ଜି', ml: 'പൂമ്പൊടി അലർജി', pa: 'ਪਰਾਗ ਐਲਰਜੀ',
        as: 'পৰাগ এলাৰ্জী', sa: 'परागकणाः एलर्जी',
      },
      uv: {
        hi: 'यूवी इंडेक्स', en: 'UV Index', bn: 'ইউভি সূচক', mr: 'अतिनील निर्देशांक (UV)',
        te: 'UV సూచిక', ta: 'புற ஊதா குறியீடு (UV)', gu: 'યુવી ઇન્ડેક્સ', ur: 'یووی انڈیکس',
        kn: 'ಯುವಿ ಸೂಚ್ಯಂಕ', or: 'ୟୁଭି ସୂଚକାଙ୍କ', ml: 'യുവി സൂചിക', pa: 'ਯੂਵੀ ਇੰਡੈਕਸ',
        as: 'ইউভি সূচক', sa: 'पराबैंगनी-सूचकाङ्कः',
      },
      humidity: {
        hi: 'सापेक्ष आर्द्रता', en: 'Relative Humidity', bn: 'আপেক্ষিক আর্দ্রতা', mr: 'सापेक्ष आर्द्रता',
        te: 'సాపేక్ష ఆర్ద్రత', ta: 'ஈரப்பதம்', gu: 'ભેજનું પ્રમાણ', ur: 'ہوا میں نمی',
        kn: 'ಆರ್ದ್ರತೆ', or: 'ଆର୍ଦ୍ରତା', ml: 'ആപേക്ഷിക ഈർപ്പം', pa: 'ਹਵਾ ਵਿਚ ਨਮੀ',
        as: 'আপেক্ষিক আৰ্দ্ৰতা', sa: 'आर्द्रता',
      },
      running: {
        hi: 'दौड़ने का अनुकूल समय', en: 'Best Running Hours', bn: 'দৌড়ানোর সেরা সময়', mr: 'धावण्यासाठी उत्तम वेळ',
        te: 'పరుగుకు అనుకూల సమయం', ta: 'ஓட்டத்திற்கு சிறந்த நேரம்', gu: 'દોડવા માટે શ્રેષ્ઠ સમય', ur: 'دوڑنے کا بہترین وقت',
        kn: 'ಓಟಕ್ಕೆ ಸೂಕ್ತ ಸಮಯ', or: 'ଦୌଡ଼ିବା ପାଇଁ ଭଲ ସମୟ', ml: 'ഓട്ടത്തിന് അനുയോജ്യമായ സമയം', pa: 'ਦੌੜਨ ਦਾ ਵਧੀਆ ਸਮਾਂ',
        as: 'দৌৰাৰ বাবে উত্তম সময়', sa: 'धावनस्य अनुकूलसमयः',
      },
      suntime: {
        hi: 'सूर्योदय व सूर्यास्त', en: 'Sunrise & Sunset', bn: 'সূর্যোদয় ও সূর্যাস্ত', mr: 'सूर्योदय व सूर्यास्त',
        te: 'సూర్యోదయం & సూర్యాస్తమయం', ta: 'சூரிய உதயம் & அஸ்தமனம்', gu: 'સૂર્યોદય અને સૂર્યાસ્ત', ur: 'طلوع و غروب آفتاب',
        kn: 'ಸೂರ್ಯೋದಯ ಮತ್ತು ಸೂರ್ಯಾಸ್ತ', or: 'ସୂର୍ଯ୍ୟୋଦୟ ଏବଂ ସୂର୍ଯ୍ୟାସ୍ତ', ml: 'സൂര്യോദയവും സൂര്യാസ്തമയവും', pa: 'ਸੂਰਜ ਚੜ੍ਹਨਾ ਤੇ ਡੁੱਬਣਾ',
        as: 'সূৰ্যোদয় আৰু সূৰ্যাস্ত', sa: 'सूर्योदयः सूर्यास्तश्च',
      },
      wind: {
        hi: 'हवा की गति', en: 'Wind Velocity', bn: 'বাতাসের গতি', mr: 'वाऱ्याचा वेग',
        te: 'గాలి వేగం', ta: 'காற்றின் வேகம்', gu: 'પવનની ગતિ', ur: 'ہوا کی رفتار',
        kn: 'ಗಾಳಿಯ ವೇಗ', or: 'ପବନର ବେଗ', ml: 'കാറ്റിന്റെ വേഗത', pa: 'ਹਵਾ ਦੀ ਗਤੀ',
        as: 'বতাহৰ গতি', sa: 'वायोः गतिः',
      },
      trafficDelay: {
        hi: 'ट्रैफिक विलंब जोखिम', en: 'Traffic Delay Risk', bn: 'যানজটের ঝুঁকি', mr: 'वाहतूक विलंबाचा धोका',
        te: 'ట్రాఫిక్ ఆలస్య ప్రమాదం', ta: 'போக்குவரத்து தாமத ஆபத்து', gu: 'ટ્રાફિક વિલંબનું જોખમ', ur: 'ٹریفک میں تاخیر کا خطرہ',
        kn: 'ಸಂಚಾರ ವಿಳಂಬ ಅಪಾಯ', or: 'ଟ୍ରାଫିକ ବିଳମ୍ବ ଆଶଙ୍କା', ml: 'ട്രാഫിക് കാലതാമസം', pa: 'ਟ੍ਰੈਫਿਕ ਦੇਰੀ ਦਾ ਖ਼ਤਰਾ',
        as: 'ট্ৰেফিক পলমৰ আশংকা', sa: 'यातायातविलम्बशङ्का',
      },
      roadVis: {
        hi: 'राजमार्ग दृश्यता', en: 'Highway Visibility', bn: 'মহাসড়কে দৃশ্যমানতা', mr: 'महामार्ग दृश्यता',
        te: 'రహదారి దృశ్యమానత', ta: 'நெடுஞ்சாலை தெரிவுநிலை', gu: 'હાઇવે દૃશ્યતા', ur: 'شاہراہ پر حد نگاہ',
        kn: 'ಹೆದ್ದಾರಿ ಗೋಚರತೆ', or: 'ରାଜପଥ ଦୃଶ୍ୟମାନତା', ml: 'ഹൈവേ കാഴ്ചപരിധി', pa: 'ਹਾਈਵੇਅ ਦਿੱਖ',
        as: 'ৰাজপথৰ দৃশ্যমানতা', sa: 'राजमार्गे दृश्यता',
      },
      underpass: {
        hi: 'अंडरपास जलभराव', en: 'Underpass Flood Risk', bn: 'আন্ডারপাস জল জমার ঝুঁকি', mr: 'अंडरपास पाणी साचणे',
        te: 'అండర్‌పాస్ వరద ప్రమాదం', ta: 'அடிப்பாதை வெள்ள அபாயம்', gu: 'અંડરપાસમાં પાણી ભરાવું', ur: 'انڈرپاس میں پانی کا خطرہ',
        kn: 'ಅಂಡರ್‌ಪಾಸ್ ಜಲಾವೃತ ಅಪಾಯ', or: 'ଅଣ୍ଡରପାସ ଜଳବନ୍ଦୀ ଆଶଙ୍କା', ml: 'അണ്ടർപാസ് വെള്ളപ്പൊക്കം', pa: 'ਅੰਡਰਪਾਸ ਪਾਣੀ ਭਰਨ ਦਾ ਖ਼ਤਰਾ',
        as: 'আণ্ডাৰপাছত পানী জমা হোৱাৰ আশংকা', sa: 'अधोमार्गे जलावरोधः',
      },
      roadGrip: {
        hi: 'सड़क ब्रेक ग्रिप', en: 'Road Pavement Grip', bn: 'রাস্তার ব্রেক গ্রিপ', mr: 'रस्ता ब्रेक ग्रीप',
        te: 'రహదారి పట్టు', ta: 'சாலை பிடிப்பு', gu: 'રોડ બ્રેક ગ્રીપ', ur: 'سڑک پر بریک گرفت',
        kn: 'ರಸ್ತೆ ಹಿಡಿತ', or: 'ରାସ୍ତା ବ୍ରେକ ଧାରଣ', ml: 'റോഡ് ഗ്രിപ്പ്', pa: 'ਸੜਕ ਬ੍ਰੇਕ ਪਕੜ',
        as: 'পথৰ ব্ৰেক গ্ৰিপ', sa: 'मार्गपृष्ठग्रहणम्',
      },
    };
    return labels[key]?.[language] || labels[key]?.hi || key;
  };

  // Helper to extract flat metric items without role branding or category separation
  const getPersonaMetricItems = (pId: PersonaType): MetricItem[] => {
    switch (pId) {
      case 'health':
        return [
          {
            id: 'aqi',
            label: getLocalizedMetricLabel('aqi'),
            value: `${weather.aqi}`,
            subtext: `PM2.5: ${weather.pm25} µg/m³`,
            isHighlight: weather.aqi > 150,
          },
          {
            id: 'pollen',
            label: getLocalizedMetricLabel('pollen'),
            value: weather.pollenCount?.overall || 'Moderate',
            subtext: `Tree: ${weather.pollenCount?.tree || 'Mod'}`,
            isHighlight: weather.pollenCount?.overall === 'High',
          },
          {
            id: 'uv',
            label: getLocalizedMetricLabel('uv'),
            value: `${weather.uvIndex} / 11+`,
            subtext: weather.uvIndex >= 7 ? 'High (SPF 50+)' : 'Moderate',
            isHighlight: false,
          },
          {
            id: 'humidity',
            label: getLocalizedMetricLabel('humidity'),
            value: `${weather.humidity}%`,
            subtext: `Dew Pt: ${weather.dewPoint}°C`,
            isHighlight: false,
          },
        ];

      case 'fitness':
        return [
          {
            id: 'running',
            label: getLocalizedMetricLabel('running'),
            value: '05:30 - 07:30 AM',
            subtext: 'Optimal thermal window',
            isHighlight: false,
          },
          {
            id: 'suntime',
            label: getLocalizedMetricLabel('suntime'),
            value: `🌅 ${weather.sunrise}`,
            subtext: `🌇 ${weather.sunset}`,
            isHighlight: false,
          },
          {
            id: 'wind',
            label: getLocalizedMetricLabel('wind'),
            value: `${weather.windSpeed} km/h`,
            subtext: `Gusts: ${weather.windGust} km/h`,
            isHighlight: false,
          },
          {
            id: 'heatstrain',
            label: language === 'en' ? 'Heat Strain' : 'थर्मल स्ट्रेस',
            value: weather.feelsLike > 36 ? 'High Strain' : 'Low Stress',
            subtext: `Feels: ${weather.feelsLike}°C`,
            isHighlight: weather.feelsLike > 36,
          },
        ];

      case 'parents':
        return [
          {
            id: 'school-drop',
            label: language === 'en' ? 'School Morning (7-8 AM)' : 'स्कूल प्रस्थान (7-8 AM)',
            value: 'Safe & Clear',
            subtext: `Visibility: ${weather.visibility} km`,
            isHighlight: false,
          },
          {
            id: 'rain-alert',
            label: language === 'en' ? 'Rain Chance' : 'बारिश का जोखिम',
            value: `${weather.precipitationChance}%`,
            subtext: weather.precipitationChance > 40 ? 'Pack raincoat' : 'No rainwear needed',
            isHighlight: weather.precipitationChance > 40,
          },
          {
            id: 'school-pickup',
            label: language === 'en' ? 'Afternoon Pickup (2-3 PM)' : 'दोपहर पिकअप (2-3 PM)',
            value: `${weather.tempMax}°C`,
            subtext: 'Hydrate kids with water',
            isHighlight: weather.tempMax > 36,
          },
          {
            id: 'playground',
            label: language === 'en' ? 'Playground Safety' : 'मैदान सुरक्षा',
            value: weather.activeAlert ? 'Advisory' : '100% Safe',
            subtext: weather.activeAlert ? weather.activeAlert.category : 'No storm danger',
            isHighlight: Boolean(weather.activeAlert),
          },
        ];

      case 'commuters':
        return [
          {
            id: 'traffic-delay',
            label: getLocalizedMetricLabel('trafficDelay'),
            value: weather.traffic?.delayRisk === 'Low' ? 'Smooth (0 min)' : '+20 min Buffer',
            subtext: 'Corridor velocity normal',
            isHighlight: weather.traffic?.delayRisk !== 'Low',
          },
          {
            id: 'road-vis',
            label: getLocalizedMetricLabel('roadVis'),
            value: `${weather.visibility} km`,
            subtext: weather.visibility < 2 ? 'Fog lights advised' : 'Clear highway view',
            isHighlight: weather.visibility < 2,
          },
          {
            id: 'underpass',
            label: getLocalizedMetricLabel('underpass'),
            value: weather.traffic?.waterloggingAlert ? 'Water Build-up' : 'All Clear',
            subtext: weather.traffic?.waterloggingAlert ? 'Avoid low ramps' : 'No waterlogged spots',
            isHighlight: Boolean(weather.traffic?.waterloggingAlert),
          },
          {
            id: 'road-grip',
            label: getLocalizedMetricLabel('roadGrip'),
            value: weather.precipitationChance > 40 ? 'Wet Surface' : 'Dry Pavement',
            subtext: `Rain: ${weather.precipitationChance}%`,
            isHighlight: weather.precipitationChance > 40,
          },
        ];

      case 'travelers':
        return [
          {
            id: 'runway',
            label: language === 'en' ? 'Flight Runway Visibility' : 'उड़ान रनवे दृश्यता',
            value: weather.visibility < 1.5 ? 'Fog Delay' : 'On-Time',
            subtext: `RVR: ${weather.visibility} km`,
            isHighlight: weather.visibility < 1.5,
          },
          {
            id: 'packing',
            label: language === 'en' ? 'Packing Check' : 'पैकिंग सुझाव',
            value: weather.precipitationChance > 35 ? 'Umbrella / Raincoat' : 'Light Cottons',
            subtext: 'Based on transit weather',
            isHighlight: false,
          },
          {
            id: 'origin-temp',
            label: language === 'en' ? 'Origin Temperature' : 'प्रस्थान तापमान',
            value: `${weather.temperature}°C`,
            subtext: weather.conditionText.split(' ')[0],
            isHighlight: false,
          },
        ];

      case 'agriculture':
        return [
          {
            id: 'soil-moist',
            label: language === 'en' ? 'Soil Moisture' : 'मृदा नमी',
            value: `${weather.agriculture?.soilMoisture || 42}%`,
            subtext: weather.agriculture?.soilStatus || 'Adequate',
            isHighlight: false,
          },
          {
            id: '3day-rain',
            label: language === 'en' ? '3-Day Rainfall Forecast' : '3-दिवसीय वर्षा अनुमान',
            value: `${weather.agriculture?.rainfallPrediction3Days || 0} mm`,
            subtext: weather.precipitationChance > 40 ? 'Hold chemical spray' : 'Safe to spray',
            isHighlight: weather.precipitationChance > 40,
          },
          {
            id: 'frost',
            label: language === 'en' ? 'Frost Alert Risk' : 'पाला जोखिम',
            value: weather.agriculture?.frostRisk || 'None',
            subtext: `Min temp: ${weather.tempMin}°C`,
            isHighlight: weather.agriculture?.frostRisk === 'Severe',
          },
          {
            id: 'agri-advisory',
            label: language === 'en' ? 'Agricultural Advisory' : 'फसल सलाह',
            value: 'GKMS Verified',
            subtext: language === 'en' ? 'Optimal for weeding' : 'निराई-गुड़ाई हेतु अनुकूल',
            isHighlight: false,
          },
        ];

      case 'events':
        return [
          {
            id: 'guest-comfort',
            label: language === 'en' ? 'Guest Comfort Index' : 'अतिथि आराम सूचकांक',
            value: `${weather.eventComfort?.comfortIndex || 85}%`,
            subtext: 'Rating: Good',
            isHighlight: false,
          },
          {
            id: 'rain-risk',
            label: language === 'en' ? 'Rain Probability' : 'बारिश की संभावना',
            value: `${weather.precipitationChance}%`,
            subtext: weather.precipitationChance > 30 ? 'Pagoda tent advised' : 'Open lawn ready',
            isHighlight: weather.precipitationChance > 30,
          },
          {
            id: 'truss-wind',
            label: language === 'en' ? 'Tent/Truss Wind Speed' : 'टेंट/ट्रस हवा गति',
            value: `${weather.windSpeed} km/h`,
            subtext: `Gusts: ${weather.windGust} km/h`,
            isHighlight: weather.windGust > 35,
          },
        ];

      case 'surfers':
      default:
        return [
          {
            id: 'sea-state',
            label: language === 'en' ? 'Sea State' : 'समुद्री स्थिति',
            value: weather.marine?.seaCondition || 'Calm',
            subtext: `Rip Current: ${weather.marine?.ripCurrentRisk || 'Low'}`,
            isHighlight: weather.marine?.seaCondition === 'Rough',
          },
          {
            id: 'wave-height',
            label: language === 'en' ? 'Wave Swell Height' : 'लहरों की ऊंचाई',
            value: `${weather.marine?.waveHeight || 1.4} m`,
            subtext: 'Clean surfing break',
            isHighlight: (weather.marine?.waveHeight || 0) > 2.5,
          },
          {
            id: 'tide-time',
            label: language === 'en' ? 'Tide Schedule' : 'ज्वार-भाटा समय',
            value: weather.marine?.highTide || '02:45 PM',
            subtext: `Low: ${weather.marine?.lowTide || '08:30 AM'}`,
            isHighlight: false,
          },
          {
            id: 'water-temp',
            label: language === 'en' ? 'Water Temperature' : 'जल तापमान',
            value: `${weather.marine?.waterTemp || 28}°C`,
            subtext: 'Safe bathing temp',
            isHighlight: false,
          },
        ];
    }
  };

  // Compile and deduplicate metrics across all selected roles
  const allMetricItems: MetricItem[] = [];
  const seenIds = new Set<string>();

  selectedPersonas.forEach((pId) => {
    const items = getPersonaMetricItems(pId);
    items.forEach((item) => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        allMetricItems.push(item);
      }
    });
  });

  // Actionable suggestions list (direct bullet points without role prefixes)
  const suggestionsList: string[] = [];
  selectedPersonas.forEach((pId) => {
    const text = getLocalizedPersonaSummary(pId, weather, language);
    if (!suggestionsList.includes(text)) {
      suggestionsList.push(text);
    }
  });

  // Secondary/Minor alerts & road hazards not shown in top severe banner
  const minorAlerts: { textEn: string; textHi: string }[] = [];

  if (selectedPersonas.includes('commuters')) {
    if (weather.visibility < 2.0) {
      minorAlerts.push({
        textEn: 'Highway visibility is reduced. Turn on low-beam yellow fog lights and slow down on bridge expansion joints.',
        textHi: 'राजमार्ग पर दृश्यता कम है। लो-बीम फॉग लाइट्स जलाएं तथा पुलों के मोड़ों पर गति धीमी रखें।',
      });
    }
    if (weather.traffic?.waterloggingAlert) {
      minorAlerts.push({
        textEn: 'Underpass water build-up reported on low-lying arterial corridors. Plan alternative elevated routes.',
        textHi: 'निचले अंडरपासों में पानी भरने की सूचना। कृपया एलिवेटेड व वैकल्पिक मार्गों का प्रयोग करें।',
      });
    }
  }

  if (weather.humidity > 75) {
    minorAlerts.push({
      textEn: 'High relative humidity (75%+) causing thermal discomfort and surface moisture on shaded road curves.',
      textHi: 'उच्च आर्द्रता (75%+) के कारण उमस तथा छायादार सड़क मोड़ों पर हल्की नमी व फिसलन संभव।',
    });
  }
  if (weather.windGust > 25) {
    minorAlerts.push({
      textEn: `Surface wind gusts reaching ${weather.windGust} km/h. Secure loose outdoor hoardings and lightweight awnings.`,
      textHi: `${weather.windGust} किमी/घंटा की रफ्तार से हवा के झोंके। खुले होर्डिंग या टिन शेड वाले सावधानी बरतें।`,
    });
  }
  if (weather.uvIndex >= 6 && weather.uvIndex <= 8) {
    minorAlerts.push({
      textEn: `Moderate UV index (${weather.uvIndex}). Apply sunscreen if outdoors between 11 AM and 3 PM.`,
      textHi: `मध्यम पराबैंगनी सूचकांक (UV ${weather.uvIndex})। सुबह 11 से दोपहर 3 बजे के बीच धूप में सनस्क्रीन का प्रयोग करें।`,
    });
  }
  if (minorAlerts.length === 0) {
    minorAlerts.push({
      textEn: 'Atmospheric stability high. Normal seasonal conditions across ward corridors.',
      textHi: 'वायुमंडलीय स्थिरता सामान्य। वार्ड व स्थानीय स्तर पर कोई प्रतिकूल मौसमी व्यवधान नहीं।',
    });
  }

  const langNames = PERSONA_NAMES[language] || PERSONA_NAMES.hi;

  return (
    <div className="rounded-2xl border border-blue-900/60 bg-[#071936] shadow-xl overflow-hidden">
      {/* 1. "Who Are You?" MULTI-SELECT Persona Pill Bar in Selected Language */}
      <div className="bg-[#05132b] px-3 sm:px-4 py-2.5 border-b border-blue-900/40">
        <div className="flex items-center justify-between gap-1 text-xs mb-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>{t('selectRoles', language)}</span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono-data bg-black/40 px-2 py-0.5 rounded border border-white/10">
            {selectedPersonas.length} {t('rolesActive', language)}
          </span>
        </div>

        {/* Multi-Select Horizontal Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PERSONA_ORDER.map((pid) => {
            const isSelected = selectedPersonas.includes(pid);
            const label = langNames[pid] || pid;

            return (
              <button
                key={pid}
                onClick={() => onTogglePersona(pid)}
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
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Unified Header Strip with Voice Feature in Selected Language */}
      <div className="px-4 py-2.5 bg-[#0a234d]/70 border-b border-blue-900/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <div className="text-xs sm:text-sm font-bold text-white truncate">
            {t('weatherDetails', language)}
          </div>
        </div>

        {/* Voice Feature for Suggestions in Selected Language */}
        <button
          onClick={handlePlayVoice}
          className={`p-2 rounded-full transition cursor-pointer shadow flex items-center justify-center shrink-0 ${
            isPlayingVoice
              ? 'bg-white text-rose-950 ring-2 ring-rose-500 animate-pulse'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
          }`}
          title={t('listenVoice', language)}
          aria-label="Voice advice"
        >
          {isPlayingVoice ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="p-3 sm:p-4 space-y-4">
        {/* 3. Pure Weather Information Grid: Directly showing weather parameters WITHOUT any user role labels on top */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {allMetricItems.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-[#030e20] border border-blue-900/50 hover:border-blue-700/60 transition flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-300 font-semibold truncate">
                    {item.label}
                  </div>
                </div>

                <div className="mt-2">
                  <div
                    className={`text-base sm:text-lg font-bold font-mono-data ${
                      item.isHighlight ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {item.value}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Suggestions Section: Header simply translated to selected language, direct clean bullets */}
        <div className="rounded-xl bg-[#040e22] border border-blue-900/50 p-3 sm:p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{t('suggestionsAndPrecautions', language)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-200">
            {suggestionsList.map((suggestionText, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#071936] border border-blue-900/40 flex items-start gap-2"
              >
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-snug">{suggestionText}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Minor / Secondary Alerts & Warnings Box translated to selected language */}
        <div className="rounded-xl bg-[#030e20] border border-blue-900/40 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
            <AlertCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>{t('localAlerts', language)}</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            {minorAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-cyan-400 shrink-0 mt-0.5">›</span>
                <span className="leading-snug">{language === 'en' ? alert.textEn : alert.textHi}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Action Button: See Full Weather */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-blue-900/40">
          <div className="text-[11px] text-slate-400">
            {language === 'en'
              ? 'For technical synoptic observatory dataset, 7-day outlook & radar:'
              : 'विस्तृत सिनॉप्टिक वेधशाला आंकड़े, डॉपलर रडार व 7-दिवसीय पूर्ण तालिका हेतु:'}
          </div>

          <button
            onClick={onOpenFullWeather}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer w-full sm:w-auto"
          >
            <Maximize2 className="h-4 w-4" />
            <span>{t('seeFullWeather', language)}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
