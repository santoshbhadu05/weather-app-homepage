import { WeatherData } from '../types/weather';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  language: 'en' | 'hi';
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: ((state: TTSState) => void)[] = [];
  private state: TTSState = {
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    language: 'en',
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

  public setLanguage(lang: 'en' | 'hi') {
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

  public generateBulletinScript(weather: WeatherData, language: 'en' | 'hi'): string {
    if (language === 'hi') {
      let script = `नमस्कार। यह भारत मौसम विज्ञान वेधशाला, मौसम पोर्टल का विशेष मौसम बुलेटिन है। `;
      script += `स्टेशन ${weather.station.name} के लिए: वर्तमान तापमान ${weather.temperature} डिग्री सेल्सियस दर्ज किया गया है, जो ${weather.feelsLike} डिग्री सेल्सियस जैसा महसूस हो रहा है। `;
      script += `मौसम की वर्तमान स्थिति ${weather.conditionTextHi} है। हवा में नमी ${weather.humidity} प्रतिशत, तथा हवा की गति ${weather.windSpeed} किलोमीटर प्रति घंटा है। `;
      script += `वायु गुणवत्ता सूचकांक यानी एक्यूआई ${weather.aqi} दर्ज हुआ है। `;

      if (weather.activeAlert) {
        script += `अति महत्वपूर्ण चेतावनी: ${weather.activeAlert.titleHi}। ${weather.activeAlert.descriptionHi} `;
      } else {
        script += `फिलहाल मौसम सामान्य है एवं कोई गंभीर चेतावनी प्रभावी नहीं है। `;
      }

      script += `किसानों, खिलाड़ियों एवं दैनिक यात्रियों को सलाह दी जाती है कि वे अपने संबंधित परामर्श का अवलोकन करें। धन्यवाद।`;
      return script;
    } else {
      let script = `This is the official Meteorological Observatory audio bulletin from Project Mausam. `;
      script += `Observation for station ${weather.station.name}: The current ambient temperature is ${weather.temperature} degrees Celsius, with an apparent thermal feel of ${weather.feelsLike} degrees Celsius. `;
      script += `Current weather condition is ${weather.conditionText}. Relative humidity stands at ${weather.humidity} percent, with prevailing winds at ${weather.windSpeed} kilometers per hour. `;
      script += `Atmospheric Air Quality Index is currently measured at ${weather.aqi}. `;

      if (weather.activeAlert) {
        script += `Meteorological Alert issued: ${weather.activeAlert.title}. ${weather.activeAlert.description} `;
      } else {
        script += `Atmospheric conditions remain stable with no immediate severe weather hazard. `;
      }

      script += `All travelers, athletes, and agricultural operators are advised to follow personalized safety advisories. Thank you.`;
      return script;
    }
  }

  public speak(text: string, lang: 'en' | 'hi' = 'en') {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported on this browser platform');
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    this.state.language = lang;

    const voices = this.synth.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (lang === 'hi') {
      selectedVoice =
        voices.find((v) => v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('hi')) ||
        voices.find((v) => v.name.toLowerCase().includes('hindi')) ||
        voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
        null;
    } else {
      selectedVoice =
        voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
        voices.find((v) => v.lang.toLowerCase().includes('en-gb')) ||
        voices.find((v) => v.lang.toLowerCase().includes('en-us')) ||
        null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = this.state.rate;
    utterance.pitch = 1.0;

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
