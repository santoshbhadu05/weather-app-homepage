import { SupportedLanguage, WeatherData } from '../types/weather';
import { getLocalizedConditionText } from './translations';

export interface CopilotAnswer {
  verdict: 'GO' | 'CAUTION' | 'NO-GO';
  title: string;
  explanation: string;
  timeWindow?: string;
  officialRef: string;
}

export function generateLocalizedCopilotAnswer(
  query: string,
  weather: WeatherData,
  lang: SupportedLanguage
): CopilotAnswer {
  const q = query.toLowerCase();

  // Multi-lingual keyword matching across all 14 Indian languages
  const isRain =
    q.includes('rain') || q.includes('बारिश') || q.includes('বৃষ্টি') || q.includes('पाऊस') ||
    q.includes('వర్షం') || q.includes('மழை') || q.includes('વરસાદ') || q.includes('بارش') ||
    q.includes('ಮಳೆ') || q.includes('ବର୍ଷା') || q.includes('മഴ') || q.includes('ਮੀਂਹ') ||
    q.includes('বৰষুণ') || q.includes('वृष्टि') || q.includes('waterlog') || q.includes('जलभराव') ||
    q.includes('छाता') || q.includes('छत्री') || q.includes('umbrella') || q.includes('గొడుగు');

  const isCrops =
    q.includes('crop') || q.includes('फसल') || q.includes('spray') || q.includes('सेच') ||
    q.includes('सिंचन') || q.includes('పంట') || q.includes('பயிர்') || q.includes('પાક') ||
    q.includes('ਕਿਸਾਨ') || q.includes('কৃষি') || q.includes('सस्य') || q.includes('छिड़काव') ||
    q.includes('agriculture') || q.includes('farmer') || q.includes('kisan') || q.includes('खेती');

  const isHealth =
    q.includes('aqi') || q.includes('health') || q.includes('asthma') || q.includes('हवा') ||
    q.includes('অ্যালার্জি') || q.includes('दमा') || q.includes('ఆస్తమా') || q.includes('ஆஸ்துமா') ||
    q.includes('ଶ୍ୱାସ') || q.includes('एलर्जी') || q.includes('allergy') || q.includes('मास्क') ||
    q.includes('mask') || q.includes('pollution') || q.includes('प्रदूषण');

  const isRun =
    q.includes('run') || q.includes('दौड़') || q.includes('દોડ') || q.includes('দৌড়') ||
    q.includes('ಓಟ') || q.includes('धाव') || q.includes('കായിക') || q.includes('walk') ||
    q.includes('jog') || q.includes('fitness') || q.includes('सैर') || q.includes('व्यायाम');

  const isCommute =
    q.includes('commute') || q.includes('travel') || q.includes('flight') || q.includes('उड़ान') ||
    q.includes('highway') || q.includes('ट्रैफिक') || q.includes('जाम') || q.includes('रास्ता') ||
    q.includes('road') || q.includes('traffic') || q.includes('delay') || q.includes('कार');

  // 1. CROPS / AGRICULTURE QUERY
  if (isCrops) {
    const isSafe = weather.precipitationChance < 30 && weather.windSpeed < 18;
    const titleMap: Record<SupportedLanguage, string> = {
      hi: isSafe ? 'छिड़काव व सिंचाई हेतु उत्तम समय' : 'छिड़काव स्थगित रखें (हवा/वर्षा)',
      en: isSafe ? 'Optimal for Agri Spraying & Irrigation' : 'Hold Spraying (Wind & Rain Risk)',
      bn: isSafe ? 'ফসলে সেচ ও স্প্রে করার আদর্শ সময়' : 'স্প্রে স্থগিত রাখুন (বৃষ্টি/বাতাস)',
      mr: isSafe ? 'पिकांना पाणी व फवारणीसाठी योग्य वेळ' : 'फवारणी पुढे ढकला (पाऊस/वारा)',
      te: isSafe ? 'పంటలకు నీరు, మందుల పిచికారీకి అనుకూలం' : 'పిచికారీని వాయిదా వేయండి',
      ta: isSafe ? 'பயிர்களுக்கு நீர்ப்பாசனம் மற்றும் தெளிப்புக்கு உகந்தது' : 'தெளிப்பதை ஒத்திவைக்கவும்',
      gu: isSafe ? 'પાકમાં સિંચાઈ અને દવા છાંટવા માટે ઉત્તમ' : 'દવા છંટકાવ મુલતવી રાખો',
      ur: isSafe ? 'فصلوں کی آبپاشی اور اسپرے کے لیے بہترین وقت' : 'اسپرے فی الحال ملتوی رکھیں',
      kn: isSafe ? 'ಬೆಳೆಗಳಿಗೆ ನೀರುಣಿಸಲು ಮತ್ತು ಸಿಂಪರಣೆಗೆ ಉತ್ತಮ ಸಮಯ' : 'ಸಿಂಪರಣೆ ಮುಂದೂಡಿ',
      or: isSafe ? 'ଫସଲରେ ଜଳସେଚନ ଓ ଔଷଧ ସିଞ୍ଚନ ପାଇଁ ଉତ୍ତମ' : 'ଔଷଧ ସିଞ୍ଚନ ସ୍ଥଗିତ ରଖନ୍ତୁ',
      ml: isSafe ? 'വിളകൾക്ക് നനയ്ക്കാനും മരുന്ന് തളിക്കാനും അനുയോജ്യം' : 'മരുന്ന് തളിക്കുന്നത് മാറ്റിവെക്കുക',
      pa: isSafe ? 'ਫ਼ਸਲਾਂ ਨੂੰ ਪਾਣੀ ਦੇਣ ਤੇ ਸਪਰੇਅ ਲਈ ਢੁਕਵਾਂ ਸਮਾਂ' : 'ਸਪਰੇਅ ਮੁਲਤਵੀ ਕਰੋ',
      as: isSafe ? 'শস্যত পানী দিয়া আৰু স্প্ৰে কৰাৰ উত্তম সময়' : 'স্প্ৰে কৰা স্থগিত ৰাখক',
      sa: isSafe ? 'सस्येषु जलसेचनाय सेचनाय च उत्तमः समयः' : 'कीटनाशकसेचनं स्थगयन्तु',
    };
    const expMap: Record<SupportedLanguage, string> = {
      hi: `तापमान ${weather.temperature}°C, हवा गति ${weather.windSpeed} किमी/घंटा, वर्षा जोखिम ${weather.precipitationChance}%। ${isSafe ? 'निराई-गुड़ाई व उर्वरक छिड़काव पूर्णतः सुरक्षित है।' : 'हवा या बारिश से दवा बहने का अंदेशा है।'}` ,
      en: `Temp ${weather.temperature}°C, wind ${weather.windSpeed} km/h, rain chance ${weather.precipitationChance}%. ${isSafe ? 'Field conditions ideal for nutrient spray.' : 'Risk of chemical wash-off due to wind/rain.'}`,
      bn: `তাপমাত্রা ${weather.temperature}°C, বাতাসের গতি ${weather.windSpeed} কিমি/ঘণ্টা, বৃষ্টির সম্ভাবনা ${weather.precipitationChance}%। ${isSafe ? 'ফসলে সার ও কীটনাশক দেওয়ার অনুকূল পরিবেশ।' : 'বাতাস বা বৃষ্টির কারণে স্প্রে নষ্ট হওয়ার ঝুঁকি।'}` ,
      mr: `तापमान ${weather.temperature}°C, वाऱ्याचा वेग ${weather.windSpeed} किमी/तास, पावसाची शक्यता ${weather.precipitationChance}%. ${isSafe ? 'खुरपणी व फवारणी सुरक्षित आहे.' : 'पाऊस किंवा वाऱ्यामुळे औषध वाहून जाण्याची भीती आहे.'}` ,
      te: `ఉష్ణోగ్రత ${weather.temperature}°C, గాలి వేగం ${weather.windSpeed} కిమీ/గం, వర్షం అవకాశం ${weather.precipitationChance}%. ${isSafe ? 'మందులు చల్లడానికి వాతావరణం అనుకూలం.' : 'గాలి లేదా వర్షం వల్ల మందు కొట్టుకుపోయే ప్రమాదం ఉంది.'}` ,
      ta: `வெப்பநிலை ${weather.temperature}°C, காற்றின் வேகம் ${weather.windSpeed} கிமீ/மணி, மழை வாய்ப்பு ${weather.precipitationChance}%. ${isSafe ? 'உரம் மற்றும் பூச்சிக்கொல்லி தெளிக்க உகந்தது.' : 'மழை அல்லது காற்றால் மருந்து வீணாகும் அபாயம்.'}` ,
      gu: `તાપમાન ${weather.temperature}°C, પવન ${weather.windSpeed} કિમી/કલાક, વરસાદ ${weather.precipitationChance}%. ${isSafe ? 'ખાતર અને દવા છાંટવા માટે અનુકૂળ સમય.' : 'પવન કે વરસાદથી દવા ધોવાઈ જવાનો ભય છે.'}` ,
      ur: `درجہ حرارت ${weather.temperature}°C، ہوا کی رفتار ${weather.windSpeed} کلومیٹر، بارش کا امکان ${weather.precipitationChance}%۔ ${isSafe ? 'فصلوں میں کھاد اور اسپرے کے لیے ماحول سازگار ہے۔' : 'ہوا یا بارش سے دوا بہنے کا اندیشہ ہے۔'}` ,
      kn: `ತಾಪಮಾನ ${weather.temperature}°C, ಗಾಳಿಯ ವೇಗ ${weather.windSpeed} ಕಿಮೀ/ಗಂ, ಮಳೆಯ ಸಂಭವ ${weather.precipitationChance}%. ${isSafe ? 'ಗೊಬ್ಬರ ಮತ್ತು ಔಷಧ ಸಿಂಪರಣೆಗೆ ಸೂಕ್ತ.' : 'ಮಳೆ ಅಥವಾ ಗಾಳಿಯಿಂದ ಔಷಧ ವ್ಯರ್ಥವಾಗುವ ಸಾಧ್ಯತೆ.'}` ,
      or: `ତାପମାତ୍ରା ${weather.temperature}°C, ପବନର ବେଗ ${weather.windSpeed} କିମି/ଘଣ୍ଟା, ବର୍ଷା ସମ୍ଭାବନା ${weather.precipitationChance}%। ${isSafe ? 'ସାର ଓ କୀଟନାଶକ ସିଞ୍ଚନ ପାଇଁ ପାଣିପାଗ ଅନୁକୂଳ।' : 'ବର୍ଷା କିମ୍ବା ପବନରେ ଔଷଧ ନଷ୍ଟ ହେବାର ଆଶଙ୍କା।'}` ,
      ml: `താപനില ${weather.temperature}°C, കാറ്റിന്റെ വേഗത ${weather.windSpeed} കി.മീ, മഴ സാധ്യത ${weather.precipitationChance}%. ${isSafe ? 'വളവും മരുന്നും തളിക്കാൻ അനുകൂലം.' : 'മഴയോ കാറ്റോ മൂലം മരുന്ന് നഷ്ടപ്പെടാൻ സാധ്യതയുണ്ട്.'}` ,
      pa: `ਤਾਪਮਾਨ ${weather.temperature}°C, ਹਵਾ ਦੀ ਗਤੀ ${weather.windSpeed} ਕਿਮੀ/ਘੰਟਾ, ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${weather.precipitationChance}%। ${isSafe ? 'ਸਪਰੇਅ ਅਤੇ ਸਿੰਚਾਈ ਲਈ ਬਿਲਕੁਲ ਸਹੀ ਸਮਾਂ।' : 'ਹਵਾ ਜਾਂ ਮੀਂਹ ਨਾਲ ਦਵਾਈ ਵਹਿਣ ਦਾ ਖ਼ਤਰਾ ਹੈ।'}` ,
      as: `উষ্ণতা ${weather.temperature}°C, বতাহৰ গতি ${weather.windSpeed} কিমি/ঘণ্টা, বৰষুণৰ সম্ভাৱনা ${weather.precipitationChance}%। ${isSafe ? 'সাৰ আৰু ঔষধ ছটিওৱাৰ বাবে অনুকূল পৰিৱেশ।' : 'বতাহ বা বৰষুণৰ ফলত ঔষধ নষ্ট হোৱাৰ আশংকা।'}` ,
      sa: `तापमानम् ${weather.temperature}°C, वायोः गतिः ${weather.windSpeed} कि.मी./घण्टा, वृष्टिसम्भावना ${weather.precipitationChance}%। ${isSafe ? 'सस्येषु पोषणसेचनं सुरक्षितम्।' : 'वृष्टिकारणात् औषधप्रवाहस्य भयं वर्तते।'}` ,
    };
    return {
      verdict: isSafe ? 'GO' : 'CAUTION',
      title: titleMap[lang] || titleMap.hi,
      explanation: expMap[lang] || expMap.hi,
      timeWindow: '06:00 - 10:00 AM',
      officialRef: 'IMD Agro-Met GKMS Bulletin',
    };
  }

  // 2. HEALTH & ASTHMA / AQI QUERY
  if (isHealth) {
    const isBad = weather.aqi > 150;
    const titleMap: Record<SupportedLanguage, string> = {
      hi: isBad ? 'वायु गुणवत्ता मध्यम/खराब (मास्क पहनें)' : 'वायु गुणवत्ता सामान्य एवं सुरक्षित',
      en: isBad ? 'Elevated AQI (Wear Protective Mask)' : 'Air Quality Safe for Sensitive Groups',
      bn: isBad ? 'বায়ুর মান খারাপ (মাস্ক ব্যবহার করুন)' : 'বায়ুর মান স্বাভাবিক ও নিরাপদ',
      mr: isBad ? 'हवेची गुणवत्ता मध्यम/खराब (मास्क वापरा)' : 'हवेची गुणवत्ता सामान्य व सुरक्षित',
      te: isBad ? 'గాలి నాణ్యత క్షీణించింది (మాస్క్ ధరించండి)' : 'గాలి నాణ్యత సాధారణం మరియు సురక్షితం',
      ta: isBad ? 'காற்றின் தரம் மோசம் (முகக்கவசம் அணியவும்)' : 'காற்றின் தரம் பாதுகாப்பானது',
      gu: isBad ? 'હવા ગુણવત્તા મધ્યમ/ખરાબ (માસ્ક પહેરો)' : 'હવાની ગુણવત્તા સામાન્ય અને સુરક્ષિત',
      ur: isBad ? 'ہوا کا معیار خراب ہے (ماسک پہنیں)' : 'ہوا کا معیار معمول کے مطابق اور محفوظ ہے',
      kn: isBad ? 'ವಾಯು ಗುಣಮಟ್ಟ ಕಳಪೆ (ಮಾಸ್ಕ್ ಧರಿಸಿ)' : 'ವಾಯು ಗುಣಮಟ್ಟ ಸಹಜ ಮತ್ತು ಸುರಕ್ಷಿತ',
      or: isBad ? 'ବାୟୁମାନ ଖରାପ (ମାସ୍କ ବ୍ୟବହାର କରନ୍ତୁ)' : 'ବାୟୁମାନ ସ୍ୱାଭାବିକ ଓ ସୁରକ୍ଷିତ',
      ml: isBad ? 'വായു ഗുണനിലവാരം മോശമാണ് (മാസ്ക് ധരിക്കുക)' : 'വായു ഗുണനിലവാരം സുരക്ഷിതമാണ്',
      pa: isBad ? 'ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਖ਼ਰਾਬ ਹੈ (ਮਾਸਕ ਪਹਿਨੋ)' : 'ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਆਮ ਅਤੇ ਸੁਰੱਖਿਅਤ ਹੈ',
      as: isBad ? 'বায়ুৰ গুণাগুণ বেয়া (মাস্ক ব্যৱহাৰ কৰক)' : 'বায়ুৰ গুণাগুণ স্বাভাৱিক আৰু সুৰক্ষিত',
      sa: isBad ? 'वायुगुणवत्ता दुर्बला (मुखावरणं धारयन्तु)' : 'वायुगुणवत्ता सामान्या सुरक्षिता च',
    };
    const expMap: Record<SupportedLanguage, string> = {
      hi: `वर्तमान AQI ${weather.aqi} (PM2.5: ${weather.pm25}) दर्ज हुआ है। ${isBad ? 'अस्थमा व एलर्जी मरीज लंबी बाह्य गतिविधियों से बचें।' : 'सभी सामान्य कार्यों के लिए वातावरण अनुकूल है।'}` ,
      en: `Current AQI is ${weather.aqi} (PM2.5: ${weather.pm25}). ${isBad ? 'Sensitive individuals should limit prolonged outdoor exertion.' : 'Safe for all normal daily activities.'}`,
      bn: `বর্তমান একিউআই ${weather.aqi}। ${isBad ? 'শ্বাসকষ্ট ও অ্যালার্জির রোগীরা দীর্ঘক্ষণ বাইরে থাকা এড়িয়ে চলুন।' : 'বাইরে স্বাভাবিক কাজের জন্য পরিবেশ অনুকূল।'}` ,
      mr: `सध्याचा AQI ${weather.aqi} आहे. ${isBad ? 'दमा व ॲलर्जी रुग्णांनी जास्त वेळ बाहेर राहणे टाळावे.' : 'सर्व सामान्य कामांसाठी वातावरण सुरक्षित आहे.'}` ,
      te: `ప్రస్తుత AQI ${weather.aqi}. ${isBad ? 'ఆస్తమా రోగులు ఎక్కువ సమయం బయట ఉండవద్దు.' : 'సాధారణ పనులకు వాతావరణం అనుకూలం.'}` ,
      ta: `தற்போதைய AQI ${weather.aqi}. ${isBad ? 'ஆஸ்துமா நோயாளிகள் நீண்ட நேரம் வெளியில் இருப்பதைத் தவிர்க்கவும்.' : 'அனைத்து பணிகளுக்கும் ஏற்ற சூழல்.'}` ,
      gu: `હાલનો AQI ${weather.aqi} છે. ${isBad ? 'શ્વાસના દર્દીઓએ બહાર લાંબો સમય રહેવાનું ટાળવું.' : 'દિનચર્યા માટે વાતાવરણ સુરક્ષિત છે.'}` ,
      ur: `موجودہ AQI ${weather.aqi} ہے۔ ${isBad ? 'دمے کے مریض زیادہ دیر باہر رہنے سے گریز کریں۔' : 'معمول کے کاموں کے لیے ماحول محفوظ ہے۔'}` ,
      kn: `ಪ್ರಸ್ತುತ AQI ${weather.aqi}. ${isBad ? 'ಉಸಿರಾಟದ ತೊಂದರೆ ಇರುವವರು ದೀರ್ಘಕಾಲ ಹೊರಗೆ ಇರಬೇಡಿ.' : 'ಸಾಮಾನ್ಯ ಚಟುವಟಿಕೆಗಳಿಗೆ ವಾತಾವರಣ ಸೂಕ್ತವಾಗಿದೆ.'}` ,
      or: `ବର୍ତ୍ତମାନ AQI ${weather.aqi}। ${isBad ? 'ଶ୍ୱାସରୋଗୀ ଅଧିକ ସମୟ ବାହାରେ ରହିବା ଅନୁଚିତ।' : 'ସାଧାରଣ କାମ ପାଇଁ ପାଣିପାଗ ନିରାପଦ।'}` ,
      ml: `നിലവിലെ AQI ${weather.aqi}. ${isBad ? 'ശ്വാസകോശ രോഗികൾ കൂടുതൽ സമയം പുറത്ത് ചെലവഴിക്കരുത്.' : 'എല്ലാ സാധാരണ ജോലികൾക്കും അനുയോജ്യം.'}` ,
      pa: `ਮੌਜੂਦਾ AQI ${weather.aqi} ਹੈ। ${isBad ? 'ਸਾਹ ਦੇ ਮਰੀਜ਼ ਜ਼ਿਆਦਾ ਸਮਾਂ ਬਾਹਰ ਨਾ ਰਹਿਣ।' : 'ਸਾਰੇ ਆਮ ਕੰਮਾਂ ਲਈ ਮੌਸਮ ਅਨੁਕੂਲ ਹੈ।'}` ,
      as: `বৰ্তমান AQI ${weather.aqi}। ${isBad ? 'শ্বাসকষ্টৰ ৰোগীসকলে বেছি সময় বাহিৰত নাথাকিব।' : 'সাধাৰণ কাম-কাজৰ বাবে পৰিৱেশ নিৰাপদ।'}` ,
      sa: `वर्तमानं AQI ${weather.aqi} वर्तते। ${isBad ? 'श्वासरोगिणः दीर्घकालं बहिः मा तिष्ठन्तु।' : 'सर्वेषां सामान्यानां कार्याणां कृते वातावरणम् अनुकूलम्।'}` ,
    };
    return {
      verdict: isBad ? 'CAUTION' : 'GO',
      title: titleMap[lang] || titleMap.hi,
      explanation: expMap[lang] || expMap.hi,
      timeWindow: 'Full Day',
      officialRef: 'IMD SAFAR & CPCB Observatory',
    };
  }

  // 3. RUNNING / FITNESS QUERY
  if (isRun) {
    const titleMap: Record<SupportedLanguage, string> = {
      hi: 'दौड़ने का अनुकूल समय: 05:30 - 07:30 AM',
      en: 'Best Running Window: 05:30 - 07:30 AM',
      bn: 'দৌড়ানোর সেরা সময়: সকাল ৫:৩০ - ৭:৩০',
      mr: 'धावण्यासाठी सर्वोत्तम वेळ: सकाळी ५:३० - ७:३०',
      te: 'రన్నింగ్ చేయడానికి సరైన సమయం: ఉదయం 5:30 - 7:30',
      ta: 'ஓட்டப்பயிற்சிக்கு உகந்த நேரம்: காலை 5:30 - 7:30',
      gu: 'દોડવા માટે શ્રેષ્ઠ સમય: સવારે ૫:૩૦ - ૭:૩૦',
      ur: 'دوڑنے کا بہترین وقت: صبح 5:30 سے 7:30 تک',
      kn: 'ಓಡಲು ಅತ್ಯುತ್ತಮ ಸಮಯ: ಬೆಳಿಗ್ಗೆ 5:30 - 7:30',
      or: 'ଦୌଡ଼ିବା ପାଇଁ ଶ୍ରେଷ୍ଠ ସମୟ: ସକାଳ ୫:୩୦ - ୭:୩୦',
      ml: 'ഓടാൻ ഏറ്റവും നല്ല സമയം: രാവിലെ 5:30 - 7:30',
      pa: 'ਦੌੜਨ ਲਈ ਵਧੀਆ ਸਮਾਂ: ਸਵੇਰੇ 5:30 - 7:30',
      as: 'দৌৰাৰ বাবে উত্তম সময়: পুৱা ৫:৩০ - ৭:৩০',
      sa: 'धावनाय सर्वोत्तमकालः: प्रातः ५:३० - ७:३०',
    };
    const expMap: Record<SupportedLanguage, string> = {
      hi: `सुबह तापमान लगभग ${weather.tempMin}°C तथा हवा ${weather.windSpeed} किमी/घंटा रहेगी। ताजी हवा व न्यूनतम उमस के साथ वर्कआउट सुरक्षित है।`,
      en: `Morning temp around ${weather.tempMin}°C with wind ${weather.windSpeed} km/h. Fresh air and optimal cardiovascular thermal comfort.`,
      bn: `সকালের তাপমাত্রা প্রায় ${weather.tempMin}°C থাকবে। স্নিগ্ধ বাতাস ও কম আর্দ্রতায় দৌড়ানো সম্পূর্ণ নিরাপদ।`,
      mr: `सकाळचे तापमान सुमारे ${weather.tempMin}°C असेल. ताजी हवा व कमी उकाड्यामुळे व्यायाम सुखद होईल.`,
      te: `ఉదయం ఉష్ణోగ్రత దాదాపు ${weather.tempMin}°C ఉంటుంది. స్వచ్ఛమైన గాలిలో వ్యాయామం సురక్షితం.`,
      ta: `காலை வெப்பநிலை சுமார் ${weather.tempMin}°C ஆக இருக்கும். இதமான காற்றில் உடற்பயிற்சி செய்யலாம்.`,
      gu: `સવારે તાપમાન લગભગ ${weather.tempMin}°C રહેશે. તાજી હવા અને હળવી ઠંડકમાં કસરત શ્રેષ્ઠ રહેશે.`,
      ur: `صبح کا درجہ حرارت تقریباً ${weather.tempMin}°C رہے گا۔ تازہ ہوا میں ورزش محفوظ ہے۔`,
      kn: `ಬೆಳಿಗ್ಗೆ ತಾಪಮಾನ ಸುಮಾರು ${weather.tempMin}°C ಇರುತ್ತದೆ. ತಾಜಾ ಗಾಳಿಯಲ್ಲಿ ವ್ಯಾಯಾಮ ಹಿತಕರ.`,
      or: `ସକାଳେ ତାପମାତ୍ରା ପ୍ରାୟ ${weather.tempMin}°C ରହିବ। ଖୋଲା ପବନରେ ବ୍ୟାୟାମ ଉତ୍ତମ।`,
      ml: `രാവിലെ താപനില ${weather.tempMin}°C ആയിരിക്കും. വ്യായാമം സുഖകരമായിരിക്കും.`,
      pa: `ਸਵੇਰੇ ਤਾਪਮਾਨ ਲਗਭਗ ${weather.tempMin}°C ਰਹੇਗਾ। ਤਾਜ਼ੀ ਹਵਾ ਵਿੱਚ ਦੌੜਨਾ ਬਹੁਤ ਵਧੀਆ ਰਹੇਗਾ।`,
      as: `পুৱাৰ উষ্ণতা প্ৰায় ${weather.tempMin}°C হʼব। মুকলি বতাহত দৌৰা সম্পূৰ্ণ নিৰাপদ।`,
      sa: `प्रातः तापमानं प्रायः ${weather.tempMin}°C भविष्यति। शुद्धवायौ धावनं सुखकरम्।`,
    };
    return {
      verdict: 'GO',
      title: titleMap[lang] || titleMap.hi,
      explanation: expMap[lang] || expMap.hi,
      timeWindow: '05:30 - 07:30 AM',
      officialRef: 'Thermal Comfort & Ergonomic Index',
    };
  }

  // 4. RAIN / COMMUTE / FLOODING QUERY
  if (isRain || isCommute) {
    if (weather.precipitationChance > 45 || weather.activeAlert?.severity === 'red' || weather.activeAlert?.severity === 'orange') {
      const titleMap: Record<SupportedLanguage, string> = {
        hi: 'वर्षा एवं जलभराव का खतरा (सावधानी रखें)',
        en: 'High Precipitation & Inundation Risk',
        bn: 'বৃষ্টিপাত ও জল জমার ঝুঁকি',
        mr: 'पाऊस आणि पाणी साचण्याचा धोका',
        te: 'వర్షం మరియు నీరు నిలిచే ప్రమాదం',
        ta: 'மழை மற்றும் வெள்ள அபாயம்',
        gu: 'વરસાદ અને પાણી ભરાવાનું જોખમ',
        ur: 'بارش اور پانی جمع ہونے کا خطرہ',
        kn: 'ಮಳೆ ಮತ್ತು ನೀರು ನಿಲ್ಲುವ ಅಪಾಯ',
        or: 'ବର୍ଷା ଏବଂ ଜଳବନ୍ଦୀ ଆଶଙ୍କା',
        ml: 'മഴയ്ക്കും വെള്ളക്കെട്ടിനും സാധ്യത',
        pa: 'ਮੀਂਹ ਅਤੇ ਪਾਣੀ ਭਰਨ ਦਾ ਖ਼ਤਰਾ',
        as: 'বৰষুণ আৰু পানী জমা হোৱাৰ আশংকা',
        sa: 'वृष्टेः जलावरोधस्य च सम्भावना',
      };
      const expMap: Record<SupportedLanguage, string> = {
        hi: `वर्षा की संभावना ${weather.precipitationChance}% है। अंडरपास में जलभराव व फिसलन संभव है। छाता व रेनकोट साथ रखें।`,
        en: `Precipitation probability is ${weather.precipitationChance}%. Expect waterlogging at low corridors. Carry waterproof gear.`,
        bn: `বৃষ্টির সম্ভাবনা ${weather.precipitationChance}%। নিচু রাস্তায় জল জমতে পারে। ছাতা বা রেইনকোট সাথে রাখুন।`,
        mr: `पावसाची शक्यता ${weather.precipitationChance}% आहे. सखल भागात पाणी साचू शकते. छत्री सोबत ठेवा.`,
        te: `వర్షం పడే అవకాశం ${weather.precipitationChance}%. లోతట్టు ప్రాంతాలలో నీరు నిలవవచ్చు. గొడుగు వెంట ఉంచుకోండి.`,
        ta: `மழை வாய்ப்பு ${weather.precipitationChance}%. தாழ்வான பகுதிகளில் தண்ணீர் தேங்கலாம். குடை எடுத்துச் செல்லவும்.`,
        gu: `વરસાદની સંભાવના ${weather.precipitationChance}% છે. અંડરપાસમાં પાણી ભરાઈ શકે છે. છત્રી કે રેઇનકોટ સાથે રાખો.`,
        ur: `بارش کا امکان ${weather.precipitationChance}% ہے۔ نشیبی راستوں پر پانی جمع ہو سکتا ہے۔ چھتری ساتھ رکھیں۔`,
        kn: `ಮಳೆಯ ಸಂಭವನೀಯತೆ ${weather.precipitationChance}% ಇದೆ. ತಗ್ಗು ರಸ್ತೆಗಳಲ್ಲಿ ನೀರು ತುಂಬಬಹುದು. ಕೊಡೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ.`,
        or: `ବର୍ଷାର ସମ୍ଭାବନା ${weather.precipitationChance}% ଅଛି। ତଳିଆ ରାସ୍ତାରେ ପାଣି ଜମିପାରେ। ଛତା ସାଥିରେ ରଖନ୍ତୁ।`,
        ml: `മഴ സാധ്യത ${weather.precipitationChance}%. താഴ്ന്ന റോഡുകളിൽ വെള്ളക്കെട്ട് ഉണ്ടാകാം. കുട കരുതുക.`,
        pa: `ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ${weather.precipitationChance}% ਹੈ। ਨੀਵੇਂ ਇਲਾਕਿਆਂ ਵਿੱਚ ਪਾਣੀ ਭਰ ਸਕਦਾ ਹੈ। ਛਤਰੀ ਕੋਲ ਰੱਖੋ।`,
        as: `বৰষুণৰ সম্ভাৱনা ${weather.precipitationChance}%। আণ্ডাৰপাছত পানী জমা হʼব পাৰে। ছাতি লগত ৰাখক।`,
        sa: `वृष्टिसम्भावना ${weather.precipitationChance}% वर्तते। मार्गेषु जलावरोधः सम्भवति। छत्रं धारयन्तु।`,
      };
      return {
        verdict: 'CAUTION',
        title: titleMap[lang] || titleMap.hi,
        explanation: expMap[lang] || expMap.hi,
        timeWindow: 'Next 3-6 Hours',
        officialRef: 'IMD Doppler Radar Stream',
      };
    }
  }

  // 5. GENERAL OBSERVATION FALLBACK IN THAT EXACT LOCAL LANGUAGE
  const condText = getLocalizedConditionText(weather.condition, lang);
  const titleMap: Record<SupportedLanguage, string> = {
    hi: `${weather.station.name}: मौसम की वर्तमान स्थिति`,
    en: `${weather.station.name}: Current Synoptic Summary`,
    bn: `${weather.station.name}: আবহাওয়ার বর্তমান পরিস্থিতি`,
    mr: `${weather.station.name}: हवामानाची सद्यस्थिती`,
    te: `${weather.station.name}: ప్రస్తుత వాతావరణ సమాచారం`,
    ta: `${weather.station.name}: தற்போதைய வானிலை நிலவரம்`,
    gu: `${weather.station.name}: હવામાનની વર્તમાન સ્થિતિ`,
    ur: `${weather.station.name}: موسم کی تازہ ترین صورتحال`,
    kn: `${weather.station.name}: ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಸ್ಥಿತಿ`,
    or: `${weather.station.name}: ପାଣିପାଗର ବର୍ତ୍ତମାନ ସ୍ଥିତି`,
    ml: `${weather.station.name}: നിലവിലെ കാലാവസ്ഥാ വിവരം`,
    pa: `${weather.station.name}: ਮੌਸਮ ਦੀ ਤਾਜ਼ਾ ਸਥਿਤੀ`,
    as: `${weather.station.name}: বতৰৰ বৰ্তমান অৱস্থা`,
    sa: `${weather.station.name}: वर्तमानं मौसमवृत्तम्`,
  };
  const expMap: Record<SupportedLanguage, string> = {
    hi: `वर्तमान तापमान ${weather.temperature}°C (महसूस ${weather.feelsLike}°C), स्थिति: ${condText}, आर्द्रता ${weather.humidity}%, वर्षा संभावना ${weather.precipitationChance}% है।`,
    en: `Current temperature is ${weather.temperature}°C (feels like ${weather.feelsLike}°C), condition: ${condText}, humidity ${weather.humidity}%, rain probability ${weather.precipitationChance}%.`,
    bn: `বর্তমান তাপমাত্রা ${weather.temperature}°C (অনুভূত ${weather.feelsLike}°C), আকাশ: ${condText}, আর্দ্রতা ${weather.humidity}%, বৃষ্টির সম্ভাবনা ${weather.precipitationChance}%।`,
    mr: `सध्याचे तापमान ${weather.temperature}°C (भासमान ${weather.feelsLike}°C), स्थिती: ${condText}, आर्द्रता ${weather.humidity}%, पावसाची शक्यता ${weather.precipitationChance}% आहे.`,
    te: `ప్రస్తుత ఉష్ణోగ్రత ${weather.temperature}°C (అనిపించేది ${weather.feelsLike}°C), వాతావరణం: ${condText}, తేమ ${weather.humidity}%, వర్షం అవకాశం ${weather.precipitationChance}%.`,
    ta: `தற்போதைய வெப்பநிலை ${weather.temperature}°C (உணரும் வெப்பம் ${weather.feelsLike}°C), நிலை: ${condText}, ஈரப்பதம் ${weather.humidity}%, மழை வாய்ப்பு ${weather.precipitationChance}%.`,
    gu: `હાલનું તાપમાન ${weather.temperature}°C (અનુભવાતું ${weather.feelsLike}°C), સ્થિતિ: ${condText}, ભેજ ${weather.humidity}%, વરસાદની સંભાવના ${weather.precipitationChance}% છે.`,
    ur: `موجودہ درجہ حرارت ${weather.temperature}°C (محسوس ${weather.feelsLike}°C)، صورتحال: ${condText}، نمی ${weather.humidity}%، بارش کا امکان ${weather.precipitationChance}% ہے۔`,
    kn: `ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${weather.temperature}°C (ಅನುಭವ ${weather.feelsLike}°C), ಸ್ಥಿತಿ: ${condText}, ತೇವಾಂಶ ${weather.humidity}%, ಮಳೆಯ ಸಾಧ್ಯತೆ ${weather.precipitationChance}%.`,
    or: `ବର୍ତ୍ତମାନ ତାପମାତ୍ରା ${weather.temperature}°C (ଅନୁଭୂତ ${weather.feelsLike}°C), ସ୍ଥିତି: ${condText}, ଆର୍ଦ୍ରତା ${weather.humidity}%, ବର୍ଷା ସମ୍ଭାବନା ${weather.precipitationChance}%।`,
    ml: `നിലവിലെ താപനില ${weather.temperature}°C (അനുഭവപ്പെടുന്നത് ${weather.feelsLike}°C), അവസ്ഥ: ${condText}, ഈർപ്പം ${weather.humidity}%, മഴ സാധ്യത ${weather.precipitationChance}%.`,
    pa: `ਮੌਜੂਦਾ ਤਾਪਮਾਨ ${weather.temperature}°C (ਮਹਿਸੂਸ ${weather.feelsLike}°C), ਹਾਲਤ: ${condText}, ਨਮੀ ${weather.humidity}%, ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${weather.precipitationChance}% ਹੈ।`,
    as: `বৰ্তমান উষ্ণতা ${weather.temperature}°C (অনুভৱ ${weather.feelsLike}°C), অৱস্থা: ${condText}, আৰ্দ্ৰতা ${weather.humidity}%, বৰষুণৰ সম্ভাৱনা ${weather.precipitationChance}%।`,
    sa: `वर्तमानतापमानम् ${weather.temperature}°C (अनुभूतम् ${weather.feelsLike}°C), स्थितिः ${condText}, आर्द्रता ${weather.humidity}%, वृष्टिसम्भावना ${weather.precipitationChance}% अस्ति।`,
  };

  return {
    verdict: 'GO',
    title: titleMap[lang] || titleMap.hi,
    explanation: expMap[lang] || expMap.hi,
    timeWindow: 'Current Observation',
    officialRef: 'National Meteorological Observatory',
  };
}
