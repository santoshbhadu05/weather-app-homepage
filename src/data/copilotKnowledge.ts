import { SupportedLanguage, WeatherData, PersonaType } from '../types/weather';
import { generateLocalizedCopilotAnswer, CopilotAnswer } from './copilotLocalizer';

export type { CopilotAnswer };

export interface PresetQuestion {
  id: string;
  persona: PersonaType;
  text: string;
}

const PRESET_QUESTIONS_ALL: Record<SupportedLanguage, PresetQuestion[]> = {
  hi: [
    { id: 'q-child', persona: 'parents', text: 'क्या आज शाम बच्चों का बाहर खेलना सुरक्षित है?' },
    { id: 'q-crops', persona: 'agriculture', text: 'फसलों में सिंचाई या कीटनाशक छिड़काव का सही समय?' },
    { id: 'q-travel', persona: 'travelers', text: 'क्या उड़ान या हाईवे पर मौसम से देरी होगी?' },
    { id: 'q-run', persona: 'fitness', text: 'सुबह दौड़ने का सबसे अनुकूल समय क्या है?' },
    { id: 'q-health', persona: 'health', text: 'क्या आज अस्थमा व एलर्जी मरीजों के लिए बाहर जाना सुरक्षित है?' },
    { id: 'q-commute', persona: 'commuters', text: 'क्या बारिश से अंडरपास में जलभराव या जाम का खतरा है?' },
  ],
  en: [
    { id: 'q-child', persona: 'parents', text: 'Is it safe for children to play outside this evening?' },
    { id: 'q-crops', persona: 'agriculture', text: 'Best time to irrigate or spray crops today?' },
    { id: 'q-travel', persona: 'travelers', text: 'Should I expect flight/highway delays or rain?' },
    { id: 'q-run', persona: 'fitness', text: 'What is the best hour for morning running?' },
    { id: 'q-health', persona: 'health', text: 'Is AQI safe for asthma & sensitive groups today?' },
    { id: 'q-commute', persona: 'commuters', text: 'Will there be underpass waterlogging or major jams?' },
  ],
  bn: [
    { id: 'q-child', persona: 'parents', text: 'আজ বিকেলে বাচ্চাদের বাইরে খেলা কি নিরাপদ?' },
    { id: 'q-crops', persona: 'agriculture', text: 'আজ ফসলে সেচ বা কীটনাশক স্প্রে করার উপযুক্ত সময়?' },
    { id: 'q-travel', persona: 'travelers', text: 'ফ্লাইট বা হাইওয়েতে কি বৃষ্টির কারণে বিলম্ব হবে?' },
    { id: 'q-run', persona: 'fitness', text: 'সকালে দৌড়ানোর সেরা সময় কোনটি?' },
    { id: 'q-health', persona: 'health', text: 'হাঁপানি ও অ্যালার্জি রোগীদের জন্য বাতাসের মান কি নিরাপদ?' },
    { id: 'q-commute', persona: 'commuters', text: 'বৃষ্টির কারণে কি আন্ডারপাসে জল জমার ঝুঁকি আছে?' },
  ],
  mr: [
    { id: 'q-child', persona: 'parents', text: 'आज संध्याकाळी मुलांनी बाहेर खेळणे सुरक्षित आहे का?' },
    { id: 'q-crops', persona: 'agriculture', text: 'पिकांना पाणी किंवा फवारणीसाठी योग्य वेळ कोणती?' },
    { id: 'q-travel', persona: 'travelers', text: 'विमान किंवा महामार्गावर हवामानामुळे विलंब होईल का?' },
    { id: 'q-run', persona: 'fitness', text: 'सकाळी धावण्यासाठी सर्वोत्तम वेळ कोणती?' },
    { id: 'q-health', persona: 'health', text: 'दमा आणि ॲलर्जी रुग्णांसाठी आज बाहेर जाणे सुरक्षित आहे का?' },
    { id: 'q-commute', persona: 'commuters', text: 'पावसामुळे भुयारी मार्गात पाणी साचण्याची शक्यता आहे का?' },
  ],
  te: [
    { id: 'q-child', persona: 'parents', text: 'ఈ సాయంత్రం పిల్లలు బయట ఆడుకోవడం సురక్షితమేనా?' },
    { id: 'q-crops', persona: 'agriculture', text: 'పంటలకు నీరు పెట్టడానికి లేదా మందులు చల్లడానికి సరైన సమయం?' },
    { id: 'q-travel', persona: 'travelers', text: 'విమానం లేదా హైవే ప్రయాణంలో జాప్యం జరుగుతుందా?' },
    { id: 'q-run', persona: 'fitness', text: 'ఉదయం రన్నింగ్ చేయడానికి అనుకూలమైన సమయం ఏది?' },
    { id: 'q-health', persona: 'health', text: 'ఆస్తమా రోగులకు గాలి నాణ్యత అనుకూలంగా ఉందా?' },
    { id: 'q-commute', persona: 'commuters', text: 'అండర్‌పాస్‌లలో నీరు నిలిచే ప్రమాదం ఉందా?' },
  ],
  ta: [
    { id: 'q-child', persona: 'parents', text: 'இன்று மாலை குழந்தைகள் வெளியே விளையாடுவது பாதுகாப்பானதா?' },
    { id: 'q-crops', persona: 'agriculture', text: 'பயிர்களுக்கு நீர் பாய்ச்ச அல்லது மருந்து தெளிக்க சிறந்த நேரம்?' },
    { id: 'q-travel', persona: 'travelers', text: 'விமானம் அல்லது நெடுஞ்சாலை பயணத்தில் தாமதம் ஏற்படுமா?' },
    { id: 'q-run', persona: 'fitness', text: 'காலையில் ஓட்டப்பயிற்சி செய்ய சிறந்த நேரம் எது?' },
    { id: 'q-health', persona: 'health', text: 'ஆஸ்துமா நோயாளிகளுக்கு இன்றைய காற்றின் தரம் பாதுகாப்பானதா?' },
    { id: 'q-commute', persona: 'commuters', text: 'மழையால் சுரங்கப்பாதையில் தண்ணீர் தேங்கும் அபாயம் உள்ளதா?' },
  ],
  gu: [
    { id: 'q-child', persona: 'parents', text: 'આજે સાંજે બાળકો માટે બહાર રમવું સુરક્ષિત છે?' },
    { id: 'q-crops', persona: 'agriculture', text: 'પાકમાં સિંચાઈ કે દવા છાંટવાનો યોગ્ય સમય કયો છે?' },
    { id: 'q-travel', persona: 'travelers', text: 'ફ્લાઇટ કે હાઇવે પર હવામાનને કારણે વિલંબ થશે?' },
    { id: 'q-run', persona: 'fitness', text: 'સવારે દોડવા માટે શ્રેષ્ઠ સમય કયો છે?' },
    { id: 'q-health', persona: 'health', text: 'દમ અને એલર્જીના દર્દીઓ માટે આજનું વાતાવરણ સુરક્ષિત છે?' },
    { id: 'q-commute', persona: 'commuters', text: 'વરસાદથી અંડરપાસમાં પાણી ભરાવાની શક્યતા છે?' },
  ],
  ur: [
    { id: 'q-child', persona: 'parents', text: 'کیا آج شام بچوں کا باہر کھیلنا محفوظ ہے؟' },
    { id: 'q-crops', persona: 'agriculture', text: 'فصلوں کو پانی دینے یا اسپرے کرنے کا بہترین وقت کیا ہے؟' },
    { id: 'q-travel', persona: 'travelers', text: 'کیا پرواز یا ہائی وے پر تاخیر کا امکان ہے؟' },
    { id: 'q-run', persona: 'fitness', text: 'صبح دوڑنے کا سب سے موزوں وقت کیا ہے؟' },
    { id: 'q-health', persona: 'health', text: 'کیا دمے کے مریضوں کے لیے ہوا کا معیار محفوظ ہے؟' },
    { id: 'q-commute', persona: 'commuters', text: 'کیا بارش سے انڈرپاس میں پانی بھرنے کا خطرہ ہے؟' },
  ],
  kn: [
    { id: 'q-child', persona: 'parents', text: 'ಇಂದು ಸಂಜೆ ಮಕ್ಕಳು ಹೊರಗೆ ಆಟವಾಡುವುದು ಸುರಕ್ಷಿತವೇ?' },
    { id: 'q-crops', persona: 'agriculture', text: 'ಬೆಳೆಗಳಿಗೆ ನೀರುಣಿಸಲು ಅಥವಾ ಸಿಂಪಡಿಸಲು ಸೂಕ್ತ ಸಮಯ?' },
    { id: 'q-travel', persona: 'travelers', text: 'ವಿಮಾನ ಅಥವಾ ಹೆದ್ದಾರಿ ಸಂಚಾರದಲ್ಲಿ ವಿಳಂಬವಾಗುವುದೇ?' },
    { id: 'q-run', persona: 'fitness', text: 'ಬೆಳಿಗ್ಗೆ ಓಡಲು ಅತ್ಯಂತ ಅನುಕೂಲಕರ ಸಮಯ ಯಾವುದು?' },
    { id: 'q-health', persona: 'health', text: 'ಅಸ್ತಮಾ ರೋಗಿಗಳಿಗೆ ಇಂದಿನ ವಾಯು ಗುಣಮಟ್ಟ ಸುರಕ್ಷಿತವೇ?' },
    { id: 'q-commute', persona: 'commuters', text: 'ಮಳೆಯಿಂದ ಅಂಡರ್‌ಪಾಸ್‌ನಲ್ಲಿ ನೀರು ನಿಲ್ಲುವ ಅಪಾಯವಿದೆಯೇ?' },
  ],
  or: [
    { id: 'q-child', persona: 'parents', text: 'ଆଜି ସନ୍ଧ୍ୟାରେ ପିଲାମାନେ ବାହାରେ ଖେଳିବା ନିରାପଦ କି?' },
    { id: 'q-crops', persona: 'agriculture', text: 'ଫସଲରେ ଜଳସେଚନ କିମ୍ବା ଔଷଧ ସିଞ୍ଚନ ପାଇଁ ଉପଯୁକ୍ତ ସମୟ କେଉଁଟି?' },
    { id: 'q-travel', persona: 'travelers', text: 'ବିମାନ କିମ୍ବା ରାଜପଥରେ ଯାତ୍ରା ବିଳମ୍ବ ହେବ କି?' },
    { id: 'q-run', persona: 'fitness', text: 'ସକାଳେ ଦୌଡ଼ିବା ପାଇଁ ସବୁଠାରୁ ଭଲ ସମୟ କେଉଁଟି?' },
    { id: 'q-health', persona: 'health', text: 'ଶ୍ୱାସରୋଗୀଙ୍କ ପାଇଁ ବାୟୁର ମାନ ନିରାପଦ କି?' },
    { id: 'q-commute', persona: 'commuters', text: 'ବର୍ଷା ଯୋଗୁଁ ଅଣ୍ଡରପାସରେ ପାଣି ଜମିବାର ଆଶଙ୍କା ଅଛି କି?' },
  ],
  ml: [
    { id: 'q-child', persona: 'parents', text: 'ഇന്ന് വൈകുന്നേരം കുട്ടികൾക്ക് പുറത്ത് കളിക്കുന്നത് സുരക്ഷിതമാണോ?' },
    { id: 'q-crops', persona: 'agriculture', text: 'വിളകൾ നനയ്ക്കാനോ മരുന്ന് തളിക്കാനോ അനുയോജ്യമായ സമയം?' },
    { id: 'q-travel', persona: 'travelers', text: 'ഫ്ലൈറ്റ് അല്ലെങ്കിൽ ഹൈവേ യാത്രയിൽ കാലതാమസം ഉണ്ടാകുമോ?' },
    { id: 'q-run', persona: 'fitness', text: 'രാവിലെ ഓടാൻ ഏറ്റവും അനുയോജ്യമായ സമയം ഏതാണ്?' },
    { id: 'q-health', persona: 'health', text: 'ആസ്ത്മ രോഗികൾക്ക് വായു ഗുണനിലവാരം സുരക്ഷിതമാണോ?' },
    { id: 'q-commute', persona: 'commuters', text: 'മഴ കാരണം അണ്ടർപാസിൽ വെള്ളക്കെട്ടിന് സാധ്യതയുണ്ടോ?' },
  ],
  pa: [
    { id: 'q-child', persona: 'parents', text: 'ਕੀ ਅੱਜ ਸ਼ਾਮ ਬੱਚਿਆਂ ਦਾ ਬਾਹਰ ਖੇਡਣਾ ਸੁਰੱਖਿਅਤ ਹੈ?' },
    { id: 'q-crops', persona: 'agriculture', text: 'ਫ਼ਸਲਾਂ ਨੂੰ ਪਾਣੀ ਦੇਣ ਜਾਂ ਸਪਰੇਅ ਕਰਨ ਦਾ ਸਹੀ ਸਮਾਂ?' },
    { id: 'q-travel', persona: 'travelers', text: 'ਕੀ ਫਲਾਈਟ ਜਾਂ ਹਾਈਵੇ ਤੇ ਮੌਸਮ ਕਾਰਨ ਦੇਰੀ ਹੋਵੇਗੀ?' },
    { id: 'q-run', persona: 'fitness', text: 'ਸਵੇਰੇ ਦੌੜਨ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕਿਹੜਾ ਹੈ?' },
    { id: 'q-health', persona: 'health', text: 'ਕੀ ਦਮੇ ਦੇ ਮਰੀਜ਼ਾਂ ਲਈ ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਸੁਰੱਖਿਅਤ ਹੈ?' },
    { id: 'q-commute', persona: 'commuters', text: 'ਕੀ ਮੀਂਹ ਕਾਰਨ ਅੰਡਰਪਾਸ ਵਿੱਚ ਪਾਣੀ ਭਰਨ ਦਾ ਖ਼ਤਰਾ ਹੈ?' },
  ],
  as: [
    { id: 'q-child', persona: 'parents', text: 'আজি সন্ধিয়া লʼৰা-ছোৱালীয়ে বাহিৰত খেলাটো নিৰাপদনে?' },
    { id: 'q-crops', persona: 'agriculture', text: 'শস্যত পানী দিয়া বা ঔষধ ছটিওৱাৰ সঠিক সময় কোনটো?' },
    { id: 'q-travel', persona: 'travelers', text: 'বিমান বা ঘাইপথত বতৰৰ কাৰণে পলম হʼবনে?' },
    { id: 'q-run', persona: 'fitness', text: 'ৰাতিপুৱা দৌৰাৰ বাবে আটাইতকৈ উপযুক্ত সময় কি?' },
    { id: 'q-health', persona: 'health', text: 'হাপানি ৰোগীৰ বাবে বায়ুৰ গুণাগুণ নিৰাপদনে?' },
    { id: 'q-commute', persona: 'commuters', text: 'বৰষুণৰ বাবে আণ্ডাৰপাছত পানী জমা হোৱাৰ আশংকা আছেনে?' },
  ],
  sa: [
    { id: 'q-child', persona: 'parents', text: 'किम् अद्य सायङ्काले बालानां बहिः क्रीडनं सुरक्षितम् अस्ति?' },
    { id: 'q-crops', persona: 'agriculture', text: 'सस्येषु जलसेचनस्य कीटनाशकसेचनस्य वा उचितसमयः कः?' },
    { id: 'q-travel', persona: 'travelers', text: 'किं विमाने राजमार्गे वा ऋतुकारणात् विलम्बः भविष्यति?' },
    { id: 'q-run', persona: 'fitness', text: 'प्रातः धावनाय कः समयः सर्वोत्तमः?' },
    { id: 'q-health', persona: 'health', text: 'किं श्वासरोगिभ्यः वायुगुणवत्ता सुरक्षिता अस्ति?' },
    { id: 'q-commute', persona: 'commuters', text: 'किं वृष्टिकारणात् अधोमार्गे जलावरोधस्य भयं वर्तते?' },
  ],
};

export function getCopilotPresetQuestions(lang: SupportedLanguage): PresetQuestion[] {
  return PRESET_QUESTIONS_ALL[lang] || PRESET_QUESTIONS_ALL.hi;
}

export function answerInNativeLanguage(
  query: string,
  weather: WeatherData,
  lang: SupportedLanguage
): CopilotAnswer {
  return generateLocalizedCopilotAnswer(query, weather, lang);
}
