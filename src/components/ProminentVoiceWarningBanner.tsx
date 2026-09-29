import React, { useState, useEffect } from 'react';
import { ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { WeatherData, SupportedLanguage } from '../types/weather';
import { ttsService } from '../services/ttsService';
import { t } from '../data/translations';

interface ProminentVoiceWarningBannerProps {
  weather: WeatherData;
  language: SupportedLanguage;
}

export const ProminentVoiceWarningBanner: React.FC<ProminentVoiceWarningBannerProps> = ({
  weather,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Active warning
  const alert = weather.activeAlert || {
    id: 'default-warning',
    severity: 'yellow' as const,
    title: `${weather.station.name}: Normal Weather Conditions`,
    titleHi: `${weather.station.name}: मौसम सामान्य एवं अनुकूल`,
    description: `Current temperature is ${weather.temperature}°C, humidity ${weather.humidity}%. No convective storm danger active.`,
    descriptionHi: `वर्तमान तापमान ${weather.temperature}°C, आर्द्रता ${weather.humidity}%। कोई गंभीर आंधी या तूफान की चेतावनी नहीं।`,
    issuedAt: 'IMD NWFC',
    validUntil: 'Today 23:59 IST',
    category: 'General Weather Watch',
  };

  const isRed = alert.severity === 'red';
  const isOrange = alert.severity === 'orange';
  const isYellow = alert.severity === 'yellow';

  // Get localized alert title and description based on language
  const getLocalizedAlertContent = () => {
    switch (language) {
      case 'bn':
        return {
          title: isRed
            ? 'অত্যন্ত ভারী বৃষ্টি ও আকস্মিক বন্যার লাল সতর্কতা'
            : isOrange
            ? 'তীব্র বজ্রঝড় ও ঝোড়ো বাতাসের কমলা সতর্কতা'
            : `${weather.station.name}: আবহাওয়া স্বাভাবিক ও অনুকূল`,
          desc: isRed
            ? 'ভারী বৃষ্টিপাত ও জল জমার আশঙ্কা। নিরাপদ স্থানে থাকুন।'
            : isOrange
            ? 'দমকা হাওয়া ও বজ্রপাতের সম্ভাবনা। খোলা মাঠে থাকবেন না।'
            : `বর্তমান তাপমাত্রা ${weather.temperature}°C, আর্द्रता ${weather.humidity}%। কোনো গুরুতর বিপদ নেই।`,
        };
      case 'mr':
        return {
          title: isRed
            ? 'अतिवृष्टी आणि पूरस्थितीचा लाल इशारा (Red Alert)'
            : isOrange
            ? 'तीव्र वादळ व विजांचा कडकडाट (Orange Alert)'
            : `${weather.station.name}: हवामान सामान्य व अनुकूल`,
          desc: isRed
            ? 'मुसळधार पाऊस व सखल भागात पाणी साचण्याची शक्यता. सुरक्षित ठिकाणी रहा.'
            : isOrange
            ? 'जोरदार वारे व वीज पडण्याची शक्यता. झाडाखाली थांबू नका.'
            : `तापमान ${weather.temperature}°C, आर्द्रता ${weather.humidity}%. कोणताही गंभीर धोका नाही.`,
        };
      case 'te':
        return {
          title: isRed
            ? 'అత్యంత భారీ వర్షం మరియు వరదల రెడ్ అలర్ట్ (Red Alert)'
            : isOrange
            ? 'తీవ్ర ఉరుములు మరియు మెరుపుల ఆరెంజ్ అలర్ట్ (Orange Alert)'
            : `${weather.station.name}: వాతావరణం సాధారణం`,
          desc: isRed
            ? 'భారీ వర్షపాతం, లోతట్టు ప్రాంతాలలో నీరు నిలిచే ప్రమాదం. సురక్షితంగా ఉండండి.'
            : isOrange
            ? 'ఈదురు గాలులు మరియు పిడుగులు పడే అవకాశం. చెట్ల కింద ఉండవద్దు.'
            : `ఉష్ణోగ్రత ${weather.temperature}°C, తేమ ${weather.humidity}%. ఎటువంటి ప్రమాదం లేదు.`,
        };
      case 'ta':
        return {
          title: isRed
            ? 'மிக பலத்த மழை மற்றும் வெள்ள அபாய சிவப்பு எச்சரிக்கை (Red Alert)'
            : isOrange
            ? 'கடும் இடி மின்னல் ஆரஞ்சு எச்சரிக்கை (Orange Alert)'
            : `${weather.station.name}: வானிலை இயல்பாக உள்ளது`,
          desc: isRed
            ? 'கனமழை மற்றும் தாழ்வான பகுதிகளில் வெள்ள அபாயம். பாதுகாப்பாக இருக்கவும்.'
            : isOrange
            ? 'பலத்த காற்று மற்றும் மின்னல் தாக்கும் அபாயம். எச்சரிக்கையுடன் இருக்கவும்.'
            : `வெப்பநிலை ${weather.temperature}°C, ஈரப்பதம் ${weather.humidity}%. எச்சரிக்கை ஏதுமில்லை.`,
        };
      case 'gu':
        return {
          title: isRed
            ? 'અતિ ભારે વરસાદ અને પૂરની લાલ ચેતવણી (Red Alert)'
            : isOrange
            ? 'તીવ્ર વાવાઝોડું અને વીજળીની નારંગી ચેતવણી (Orange Alert)'
            : `${weather.station.name}: હવામાન સામાન્ય અને અનુકૂળ`,
          desc: isRed
            ? 'ભારે વરસાદ અને પાણી ભરાવાની શક્યતા. સલામત સ્થળે રહો.'
            : isOrange
            ? 'ઝડપી પવન અને વીજળી પડવાની શક્યતા. સાવચેત રહો.'
            : `તાપમાન ${weather.temperature}°C, ભેજ ${weather.humidity}%. કોઈ ગંભીર ચેતવણી નથી.`,
        };
      case 'ur':
        return {
          title: isRed
            ? 'انتہائی شدید بارش اور سیلاب کا ریڈ الرٹ (Red Alert)'
            : isOrange
            ? 'شدید آندھی اور آسمانی بجلی کا اورنج الرٹ (Orange Alert)'
            : `${weather.station.name}: موسم معمول کے مطابق اور سازگار`,
          desc: isRed
            ? 'موسلادھار بارش اور نشیبی علاقوں میں پانی بھرنے کا خطرہ۔ محفوظ مقامات پر رہیں۔'
            : isOrange
            ? 'تیز ہوائیں اور آسمانی بجلی گرنے کا خطرہ۔ درختوں کے نیچے کھڑے نہ ہوں۔'
            : `درجہ حرارت ${weather.temperature}°C، نمی ${weather.humidity}%۔ کوئی خطرہ نہیں۔`,
        };
      case 'kn':
        return {
          title: isRed
            ? 'ಅತ್ಯಂತ ಭಾರಿ ಮಳೆ ಮತ್ತು ಪ್ರವಾಹದ ಕೆಂಪು ಎಚ್ಚರಿಕೆ (Red Alert)'
            : isOrange
            ? 'ತೀವ್ರ ಗುಡುಗು ಮಿಂಚು ಕಿತ್ತಳೆ ಎಚ್ಚರಿಕೆ (Orange Alert)'
            : `${weather.station.name}: ಹವಾಮಾನ ಸಹಜವಾಗಿದೆ`,
          desc: isRed
            ? 'ಭಾರಿ ಮಳೆ ಮತ್ತು ತಗ್ಗು ಪ್ರದೇಶಗಳಲ್ಲಿ ನೀರು ತುಂಬುವ ಸಾಧ್ಯತೆ. ಸುರಕ್ಷಿತವಾಗಿರಿ.'
            : isOrange
            ? 'ವೇಗದ ಗಾಳಿ ಮತ್ತು ಸಿಡಿಲು ಬಡಿಯುವ ಸಾಧ್ಯತೆ. ಮರಗಳ ಕೆಳಗೆ ನಿಲ್ಲಬೇಡಿ.'
            : `ತಾಪಮಾನ ${weather.temperature}°C, ತೇವಾಂಶ ${weather.humidity}%. ಯಾವುದೇ ತೊಂದರೆಯಿಲ್ಲ.`,
        };
      case 'or':
        return {
          title: isRed
            ? 'ଅତ୍ୟନ୍ତ ପ୍ରବଳ ବର୍ଷା ଓ ବନ୍ୟା ଲାଲ ଚେତାବନୀ (Red Alert)'
            : isOrange
            ? 'ପ୍ରବଳ ଝଡ଼ ଓ ବଜ୍ରପାତ କମଳା ଚେତାବନୀ (Orange Alert)'
            : `${weather.station.name}: ପାଣିପାଗ ସ୍ୱାଭାବିକ ଅଛି`,
          desc: isRed
            ? 'ପ୍ରବଳ ବୃଷ୍ଟିପାତ ଓ ଜଳବନ୍ଦୀ ହେବାର ଆଶଙ୍କା। ସୁରକ୍ଷିତ ସ୍ଥାନରେ ରୁହନ୍ତୁ।'
            : isOrange
            ? 'ଦ୍ରୁତ ପବନ ଓ ବିଜୁଳି ମାରିବାର ସମ୍ଭାବନା। ସତର୍କ ରୁହନ୍ତୁ।'
            : `ତାପମାତ୍ରା ${weather.temperature}°C, ଆର୍ଦ୍ରତା ${weather.humidity}%। କୌଣସି ବିପଦ ନାହିଁ।`,
        };
      case 'ml':
        return {
          title: isRed
            ? 'അതിതീവ്ര മഴയും വെള്ളപ്പൊക്ക റെഡ് അലർട്ട് (Red Alert)'
            : isOrange
            ? 'ശക്തമായ ഇടിമിന്നൽ ഓറഞ്ച് അലർട്ട് (Orange Alert)'
            : `${weather.station.name}: കാലാവസ്ഥ സാധാരണ നിലയിലാണ്`,
          desc: isRed
            ? 'ശക്തമായ മഴയ്ക്കും വെള്ളക്കെട്ടിനും സാധ്യത. സുരക്ഷിത സ്ഥാനങ്ങളിൽ തുടരുക.'
            : isOrange
            ? 'ശക്തമായ കാറ്റിനും മിന്നലിനും സാധ്യത. മരങ്ങളുടെ ചുവട്ടിൽ നിൽക്കരുത്.'
            : `താപനില ${weather.temperature}°C, ഈർപ്പം ${weather.humidity}%. അപകട മുന്നറിയിപ്പുകൾ ഇല്ല.`,
        };
      case 'pa':
        return {
          title: isRed
            ? 'ਅਤਿ ਭਾਰੀ ਮੀਂਹ ਅਤੇ ਹੜ੍ਹ ਦੀ ਲਾਲ ਚਿਤਾਵਨੀ (Red Alert)'
            : isOrange
            ? 'ਤੇਜ਼ ਤੂਫ਼ਾਨ ਅਤੇ ਅਸਮਾਨੀ ਬਿਜਲੀ ਦੀ ਔਰੇਂਜ ਚਿਤਾਵਨੀ (Orange Alert)'
            : `${weather.station.name}: ਮੌਸਮ ਆਮ ਅਤੇ ਅਨੁਕੂਲ ਹੈ`,
          desc: isRed
            ? 'ਭਾਰੀ ਮੀਂਹ ਅਤੇ ਨੀਵੇਂ ਇਲਾਕਿਆਂ ਵਿੱਚ ਪਾਣੀ ਭਰਨ ਦਾ ਖ਼ਤਰਾ। ਸੁਰੱਖਿਅਤ ਰਹੋ।'
            : isOrange
            ? 'ਤੇਜ਼ ਹਵਾਵਾਂ ਅਤੇ ਬਿਜਲੀ ਡਿੱਗਣ ਦੀ ਸੰਭਾਵਨਾ। ਦਰੱਖਤਾਂ ਹੇਠਾਂ ਖੜ੍ਹੇ ਨਾ ਹੋਵੋ।'
            : `ਤਾਪਮਾਨ ${weather.temperature}°C, ਨਮੀ ${weather.humidity}%। ਕੋਈ ਗੰਭੀਰ ਖ਼ਤਰਾ ਨਹੀਂ।`,
        };
      case 'as':
        return {
          title: isRed
            ? 'অত্যন্ত প্ৰবল বৰষুণ আৰু বানপানীৰ ৰঙা সতৰ্কবাণী (Red Alert)'
            : isOrange
            ? 'তীব্ৰ ধুমুহা আৰু বজ্ৰপাতৰ কমলা সতৰ্কবাণী (Orange Alert)'
            : `${weather.station.name}: বতৰ স্বাভাৱিক আৰু অনুকূল`,
          desc: isRed
            ? 'প্ৰবল বৃষ্টিপাত আৰু পানী জমা হোৱাৰ আশংকা। সুৰক্ষিত স্থানত থাকক।'
            : isOrange
            ? 'তীক্ষ্ণ বতাহ আৰু বিজুলী ঢেৰেকনিৰ সম্ভাৱনা। গছৰ তলত আশ্ৰয় নলʼব।'
            : `উষ্ণতা ${weather.temperature}°C, আৰ্দ্ৰতা ${weather.humidity}%। কোনো বিপদ নাই।`,
        };
      case 'sa':
        return {
          title: isRed
            ? 'अतिवृष्टेः जलप्लावनस्य च रक्तचेतावनी (Red Alert)'
            : isOrange
            ? 'तीव्रझञ्झावातस्य वज्रपातस्य च कौसुम्भचेतावनी (Orange Alert)'
            : `${weather.station.name}: मौसमं सामान्यम् अनुकूलं च`,
          desc: isRed
            ? 'अत्यधिकवृष्टेः जलावरोधस्य च सम्भावना। सुरक्षिते स्थाने तिष्ठन्तु।'
            : isOrange
            ? 'तीव्रवातेन सह विद्युत्पतनस्य सम्भावना। वृक्षाणाम् अधः मा तिष्ठन्तु।'
            : `तापमानम् ${weather.temperature}°C, आर्द्रता ${weather.humidity}%। नैव कापि गम्भीरचेतावनी।`,
        };
      case 'en':
        return {
          title: alert.title,
          desc: alert.description,
        };
      case 'hi':
      default:
        return {
          title: alert.titleHi,
          desc: alert.descriptionHi,
        };
    }
  };

  const localizedAlert = getLocalizedAlertContent();

  const playVoiceAlert = () => {
    const textToSpeak = `${localizedAlert.title}। ${localizedAlert.desc}।`;
    setIsPlaying(true);
    ttsService.speak(textToSpeak, language);
  };

  const stopVoiceAlert = () => {
    setIsPlaying(false);
    ttsService.stop();
  };

  useEffect(() => {
    const unsub = ttsService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
    return unsub;
  }, []);

  return (
    <section
      aria-label="Official IMD Weather Warning"
      className={`rounded-2xl border-2 transition-all duration-300 relative overflow-hidden shadow-xl ${
        isRed
          ? 'bg-[#22060a] border-rose-500 shadow-rose-950/80 ring-2 ring-rose-500/50'
          : isOrange
          ? 'bg-[#221002] border-amber-500 shadow-amber-950/80 ring-2 ring-amber-500/50'
          : 'bg-[#1e1703] border-yellow-500/90 shadow-yellow-950/60 ring-1 ring-yellow-500/40'
      }`}
    >
      <div className="p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Severity Badge + Direct Warning Text in Selected Language */}
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`p-2.5 rounded-xl shrink-0 mt-0.5 shadow-md ${
                isRed
                  ? 'bg-rose-600 text-white animate-pulse'
                  : isOrange
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-yellow-400 text-slate-950 font-bold'
              }`}
            >
              <ShieldAlert className="h-5 w-5" />
            </div>

            <div className="space-y-1 min-w-0">
              {/* Alert level badge & valid until */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono-data">
                <span
                  className={`px-2 py-0.2 rounded font-black uppercase ${
                    isRed
                      ? 'bg-rose-600 text-white'
                      : isOrange
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-yellow-400 text-slate-950 font-bold'
                  }`}
                >
                  {isRed
                    ? '🔴 RED ALERT'
                    : isOrange
                    ? '🟠 ORANGE ALERT'
                    : '🟡 YELLOW WATCH'}
                </span>

                <span className="text-slate-300 bg-black/50 px-1.5 py-0.2 rounded border border-white/10">
                  {alert.category}
                </span>

                <span className="text-amber-300 bg-black/50 px-1.5 py-0.2 rounded border border-white/10">
                  {alert.validUntil}
                </span>
              </div>

              {/* Direct Warning content translated into the selected language */}
              <div className="text-xs sm:text-sm text-slate-100 font-medium leading-snug">
                <span className="font-bold text-white mr-1.5">
                  {localizedAlert.title}:
                </span>
                <span>{localizedAlert.desc}</span>
              </div>
            </div>
          </div>

          {/* Right: Clean Voice Icon Button - speaks in the exact chosen language */}
          <div className="shrink-0 pl-1">
            <button
              onClick={() => (isPlaying ? stopVoiceAlert() : playVoiceAlert())}
              className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer shadow-lg flex items-center justify-center ${
                isPlaying
                  ? 'bg-white text-rose-950 ring-4 ring-rose-500/50 animate-pulse'
                  : isRed
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/50'
                  : isOrange
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/40'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-yellow-500/30'
              }`}
              title={isPlaying ? 'Stop Voice Warning' : 'Play Voice Warning'}
              aria-label={isPlaying ? 'Stop Voice Warning' : 'Play Voice Warning'}
            >
              {isPlaying ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5 animate-bounce" />
              )}
            </button>
          </div>
        </div>

        {/* IMD Warning Color Meaning Legend translated into the selected language */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-300">
          <div className="font-bold text-amber-300 flex items-center gap-1">
            <span>{t('colorMeaning', language)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-medium">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <strong className="text-rose-400">{t('redMeaning', language)}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <strong className="text-amber-400">{t('orangeMeaning', language)}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
              <strong className="text-yellow-300">{t('yellowMeaning', language)}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <strong className="text-emerald-400">{t('greenMeaning', language)}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
