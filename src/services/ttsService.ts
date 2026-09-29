import { SupportedLanguage, WeatherData } from '../types/weather';
import { t } from '../data/translations';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  language: SupportedLanguage;
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

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: ((state: TTSState) => void)[] = [];
  private state: TTSState = {
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    language: 'hi',
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(cb: (state: TTSState) => void): () => void {
    this.listeners.push(cb);
    cb(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public setRate(rate: number) {
    this.state.rate = rate;
    this.notify();
  }

  public setLanguage(lang: SupportedLanguage) {
    this.state.language = lang;
    this.notify();
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.notify();
  }

  public pause() {
    if (this.synth && this.state.isPlaying) {
      this.synth.pause();
      this.state.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.state.isPaused) {
      this.synth.resume();
      this.state.isPaused = false;
      this.notify();
    }
  }

  public generateBulletinScript(weather: WeatherData, language: SupportedLanguage): string {
    // Localized alert text for audio bulletin
    let alertText = '';
    if (weather.activeAlert) {
      const alertMap: Record<SupportedLanguage, string> = {
        hi: `सावधान: ${weather.activeAlert.titleHi}। ${weather.activeAlert.descriptionHi}।`,
        en: `Warning: ${weather.activeAlert.title}. ${weather.activeAlert.description}.`,
        bn: `সতর্কতা: আবহাওয়া দপ্তর থেকে বিশেষ সতর্কতা জারি করা হয়েছে। সাবধানে থাকুন।`,
        mr: `इशारा: हवामान विभागाकडून सतर्कतेचा इशारा जारी करण्यात आला आहे. सुरक्षित रहा.`,
        te: `హెచ్చరిక: వాతావరణ శాఖ నుంచి అత్యవసర హెచ్చరిక జారీ చేయబడింది. జాగ్రత్తగా ఉండండి.`,
        ta: `எச்சரிக்கை: வானிலை ஆய்வு மையம் அவசர எச்சரிக்கை விடுத்துள்ளது. பாதுகாப்பாக இருக்கவும்.`,
        gu: `ચેતવણી: હવામાન વિભાગ દ્વારા વિશેષ ચેતવણી જારી કરવામાં આવી છે. સાવચેત રહો.`,
        ur: `انتباہ: محکمہ موسمیات کی طرف سے الرٹ جاری کیا گیا ہے۔ محتاط رہیں۔`,
        kn: `ಎಚ್ಚರಿಕೆ: ಹವಾಮಾನ ಇಲಾಖೆಯಿಂದ ವಿಶೇಷ ಎಚ್ಚರಿಕೆ ನೀಡಲಾಗಿದೆ. ಸುರಕ್ಷಿತವಾಗಿರಿ.`,
        or: `ଚେତାବନୀ: ପାଣିପାଗ ବିଭାଗ ପକ୍ଷରୁ ସତର୍କ ସୂଚନା ଜାରି କରାଯାଇଛି। ସତର୍କ ରୁହନ୍ତୁ।`,
        ml: `മുന്നറിയിപ്പ്: കാലാവസ്ഥാ വകുപ്പ് ജാഗ്രതാ നിർദ്ദേശം നൽകിയിട്ടുണ്ട്. സുരക്ഷിതമായിരിക്കുക.`,
        pa: `ਚੇਤਾਵਨੀ: ਮੌਸਮ ਵਿਭਾਗ ਵੱਲੋਂ ਚੌਕਸੀ ਦਾ ਸੁਨੇਹਾ ਜਾਰੀ ਕੀਤਾ ਗਿਆ ਹੈ। ਸੁਰੱਖਿਅਤ ਰਹੋ।`,
        as: `সতৰ্কবাণী: বতৰ বিজ্ঞান বিভাগে বিশেষ সতৰ্কতা জাৰি কৰিছে। সুৰক্ষিত থাকক।`,
        sa: `सावधानम्: ऋतुविज्ञानविभागेन विशेषचेतावनी उद्घोषिता। सुरक्षिताः तिष्ठन्तु।`,
      };
      alertText = alertMap[language] || alertMap.hi;
    }

    switch (language) {
      case 'bn':
        return `নমস্কার। আবহাওয়া পোর্টালের বিশেষ বুলেটিন। স্টেশন ${weather.station.name}: বর্তমান তাপমাত্রা ${weather.temperature} ডিগ্রি সেলসিয়াস। আর্দ্রতা ${weather.humidity} শতাংশ। বাতাসের গতি ${weather.windSpeed} কিলোমিটার প্রতি ঘণ্টা। বায়ুর গুণমান একিউআই ${weather.aqi}। ${alertText} ধন্যবাদ।`;
      case 'mr':
        return `नमस्कार। हवामान वेधशाळा अधिकृत बुलेटिन। स्टेशन ${weather.station.name}: तापमान ${weather.temperature} अंश सेल्सिअस, आर्द्रता ${weather.humidity} टक्के, वाऱ्याचा वेग ${weather.windSpeed} किमी प्रति तास। हवा गुणवत्ता AQI ${weather.aqi}। ${alertText} धन्यवाद।`;
      case 'te':
        return `నమస్కారం. వాతావరణ శాఖ అధికారిక బులెటిన్. స్టేషన్ ${weather.station.name}: ప్రస్తుత ఉష్ణోగ్రత ${weather.temperature} డిగ్రీల సెల్సియస్. గాలిలో తేమ ${weather.humidity} శాతం. గాలి వేగం ${weather.windSpeed} కిమీ/గం. గాలి నాణ్యత AQI ${weather.aqi}. ${alertText} ధన్యవాదాలు.`;
      case 'ta':
        return `வணக்கம். வானிலை ஆய்வு மையத்தின் அதிகாரப்பூர்வ அறிக்கை. நிலையம் ${weather.station.name}: தற்போதைய வெப்பநிலை ${weather.temperature} டிகிரி செல்சியஸ். ஈரப்பதம் ${weather.humidity} சதவீதம். காற்றின் வேகம் ${weather.windSpeed} கிமீ/மணி. காற்றின் தரம் AQI ${weather.aqi}. ${alertText} நன்றி.`;
      case 'gu':
        return `નમસ્તે. હવામાન વેધશાળા સત્તાવાર બુલેટિન. સ્ટેશન ${weather.station.name}: તાપમાન ${weather.temperature} ડિગ્રી સેલ્સિયસ. ભેજ ${weather.humidity} ટકા. પવનની ગતિ ${weather.windSpeed} કિમી/કલાક. વાયુ ગુણવત્તા AQI ${weather.aqi}. ${alertText} આભાર.`;
      case 'ur':
        return `السلام علیکم۔ محکمہ موسمیات کا باضابطہ بلیٹن۔ اسٹیشن ${weather.station.name}: موجودہ درجہ حرارت ${weather.temperature} ڈگری سینٹی گریڈ۔ نمی ${weather.humidity} فیصد۔ ہوا کی رفتار ${weather.windSpeed} کلومیٹر فی گھنٹہ۔ ایئر کوالٹی انڈیکس ${weather.aqi}۔ ${alertText} شکریہ۔`;
      case 'kn':
        return `ನಮಸ್ಕಾರ. ಹವಾಮಾನ ವೀಕ್ಷಣಾಲಯದ ಅಧಿಕೃತ ಬುಲೆಟಿನ್. ನಿಲ್ದಾಣ ${weather.station.name}: ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${weather.temperature} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್. ತೇವಾಂಶ ${weather.humidity} ಪ್ರತಿಶತ. ಗಾಳಿಯ ವೇಗ ${weather.windSpeed} ಕಿಮೀ/ಗಂ. ವಾಯು ಗುಣಮಟ್ಟ AQI ${weather.aqi}. ${alertText} ಧನ್ಯವಾದಗಳು.`;
      case 'or':
        return `ନମସ୍କାର। ପାଣିପାଗ ବିଭାଗର ସ୍ୱତନ୍ତ୍ର ବୁଲେଟିନ। ଷ୍ଟେସନ ${weather.station.name}: ତାପମାତ୍ରା ${weather.temperature} ଡିଗ୍ରୀ ସେଲସିୟସ। ଆର୍ଦ୍ରତା ${weather.humidity} ପ୍ରତିଶତ। ପବନର ବେଗ ${weather.windSpeed} କିମି/ଘଣ୍ଟା। ବାୟୁ ଗୁଣବତ୍ତା AQI ${weather.aqi}। ${alertText} ଧନ୍ୟବାଦ।`;
      case 'ml':
        return `നമസ്കാരം. കാലാവസ്ഥാ നിരീക്ഷണ കേന്ദ്രത്തിന്റെ ഔദ്യോഗിക ബുള്ളറ്റിൻ. സ്റ്റേഷൻ ${weather.station.name}: നിലവിലെ താപനില ${weather.temperature} ഡിഗ്രി സെൽഷ്യസ്. ഈർപ്പം ${weather.humidity} ശതമാനം. കാറ്റിന്റെ വേഗത ${weather.windSpeed} കി.മീ/മണിക്കൂർ. എയർ ക്വാളിറ്റി സൂചിക ${weather.aqi}. ${alertText} നന്ദി.`;
      case 'pa':
        return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਮੌਸਮ ਵਿਗਿਆਨ ਵੈਧਸ਼ਾਲਾ ਦਾ ਅਧਿਕਾਰਤ ਬੁਲੇਟਿਨ। ਸਟੇਸ਼ਨ ${weather.station.name}: ਤਾਪਮਾਨ ${weather.temperature} ਡਿਗਰੀ ਸੈਲਸੀਅਸ। ਨਮੀ ${weather.humidity} ਪ੍ਰਤੀਸ਼ਤ। ਹਵਾ ਦੀ ਗਤੀ ${weather.windSpeed} ਕਿਮੀ ਪ੍ਰਤੀ ਘੰਟਾ। ਏਅਰ ਕੁਆਲਿਟੀ AQI ${weather.aqi}। ${alertText} ਧੰਨਵਾਦ।`;
      case 'as':
        return `নমস্কাৰ। বতৰ বিজ্ঞান পৰ্যবেক্ষণালয়ৰ বিশেষ বুলেটিন। ষ্টেচন ${weather.station.name}: বৰ্তমান উষ্ণতা ${weather.temperature} ডিগ্ৰী চেলচিয়াছ। আৰ্দ্ৰতা ${weather.humidity} শতাংশ। বতাহৰ গতি ${weather.windSpeed} কিমি প্ৰতি ঘণ্টা। বায়ুৰ গুণাগুণ AQI ${weather.aqi}। ${alertText} ধন্যবাদ।`;
      case 'sa':
        return `नमस्कारः। ऋतुविज्ञानवेधशालायाः आधिकारिकं बुलेटिनम्। स्थानम् ${weather.station.name}: वर्तमानतापमानम् ${weather.temperature} डिग्री सेल्शियस। आर्द्रता ${weather.humidity} प्रतिशतम्। वायोः गतिः ${weather.windSpeed} कि.मी. प्रतिघण्टा। वायुगुणवत्ता AQI ${weather.aqi}। ${alertText} धन्यवादः।`;
      case 'en':
        return `Meteorological Observatory audio bulletin. Station ${weather.station.name}: Current temperature is ${weather.temperature} degrees Celsius, humidity ${weather.humidity} percent, wind speed ${weather.windSpeed} km/h, and AQI is ${weather.aqi}. ${alertText} Thank you.`;
      case 'hi':
      default:
        return `नमस्कार। भारत मौसम विज्ञान वेधशाला का विशेष बुलेटिन। स्टेशन ${weather.station.name}: वर्तमान तापमान ${weather.temperature} डिग्री सेल्सियस, हवा में नमी ${weather.humidity} प्रतिशत, तथा हवा की गति ${weather.windSpeed} किलोमीटर प्रति घंटा है। वायु गुणवत्ता सूचकांक ${weather.aqi} है। ${alertText} धन्यवाद।`;
    }
  }

  public speak(text: string, lang: SupportedLanguage = 'hi') {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported on this browser platform');
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    this.state.language = lang;

    const bcp47 = BCP47_LANGUAGE_MAP[lang] || 'hi-IN';
    utterance.lang = bcp47;
    utterance.rate = this.state.rate;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();

    // Search for closest matching native voice by BCP47, language prefix, or name
    const langPrefix = lang.toLowerCase();
    let selectedVoice =
      voices.find((v) => v.lang.toLowerCase() === bcp47.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)) ||
      voices.find((v) => v.name.toLowerCase().includes(langPrefix)) ||
      null;

    // Indic phonetic fallbacks
    if (!selectedVoice) {
      if (lang === 'sa') {
        // Sanskrit is Devanagari, Hindi voice pronounces it accurately
        selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith('hi')) || null;
      } else if (lang === 'as') {
        // Assamese uses Eastern Indic script, Bengali voice pronounces it well
        selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith('bn')) || null;
      } else if (lang === 'ur') {
        selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ur') || v.lang.toLowerCase().startsWith('hi')) || null;
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.notify();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.notify();
    };

    this.synth.speak(utterance);
  }
}

export const ttsService = new TTSService();
