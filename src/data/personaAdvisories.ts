import { PersonaAdvisory, PersonaType, WeatherData } from '../types/weather';

export function computePersonaAdvisories(w: WeatherData): Record<PersonaType, PersonaAdvisory> {
  const {
    temperature: t,
    feelsLike: fl,
    humidity: h,
    windSpeed: ws,
    uvIndex: uv,
    aqi,
    visibility: vis,
    precipitationChance: pop,
    precipitationAmount: rain,
    condition,
    station,
  } = w;

  const isRainy = condition === 'rain' || condition === 'heavy-rain' || condition === 'thunderstorm';
  const isExtremeHeat = fl >= 39;
  const isSevereAqi = aqi >= 200;
  const isCoastal = Boolean(station.isCoastal);

  // 1. HEALTH & VULNERABLE GROUPS
  let healthScore = 100;
  if (isSevereAqi) healthScore -= 35;
  else if (aqi > 100) healthScore -= 15;
  if (isExtremeHeat) healthScore -= 30;
  else if (fl > 34) healthScore -= 12;
  if (h > 85 && t > 32) healthScore -= 15; // Heat exhaustion
  healthScore = Math.max(10, Math.min(100, healthScore));

  const healthLabel =
    healthScore > 80 ? 'Excellent' : healthScore > 60 ? 'Good' : healthScore > 40 ? 'Caution' : healthScore > 20 ? 'Adverse' : 'Critical';

  const healthAdvisory: PersonaAdvisory = {
    id: 'health',
    title: 'Health & Vulnerable Groups',
    titleHi: 'स्वास्थ्य एवं संवेदनशील वर्ग परामर्श',
    iconName: 'HeartPulse',
    targetAudience: 'Cardiac patients, Asthmatics, Senior Citizens, Post-operative Care',
    score: healthScore,
    scoreLabel: healthLabel,
    summary:
      aqi > 180
        ? 'High particulate matter combined with thermal inversion. Vulnerable individuals should restrict outdoor exertion and keep bronchodilators accessible.'
        : isExtremeHeat
        ? 'Dangerous thermal stress index. Keep oral rehydration salts (ORS) ready and monitor elderly persons for signs of heat cramps.'
        : 'Stable ambient atmosphere. Normal outdoor activities permissible with baseline hydration.',
    summaryHi:
      aqi > 180
        ? 'वायु गुणवत्ता सूचकांक (AQI) चिंताजनक स्तर पर है। अस्थमा और हृदय रोगी बाहर जाने से बचें तथा इनहेलर पास रखें।'
        : isExtremeHeat
        ? 'तीव्र गर्मी और उमस से डिहाइड्रेशन का खतरा। बुजुर्गों और बच्चों को ओआरएस का घोल दें एवं धूप से बचाएं।'
        : 'पर्यावरण स्वास्थ्य के अनुकूल है। सामान्य दिनचर्या जारी रखी जा सकती है।',
    keyMetricName: 'Respiratory & Heat Stress Index',
    keyMetricValue: aqi > 200 ? 'Severe (PM2.5 Elevated)' : isExtremeHeat ? 'Very High Thermal Load' : 'Moderate / Safe',
    recommendedTimeWindow: isExtremeHeat ? '06:00 AM - 08:30 AM & Post 07:00 PM' : '07:00 AM - 10:30 AM',
    actionableChecklist: [
      {
        text: aqi > 150 ? 'Wear N95 / HEPA particulate mask if stepping outdoors' : 'Standard ambient dust protection',
        textHi: aqi > 150 ? 'बाहर निकलते समय N95 मास्क का अनिवार्य उपयोग करें' : 'साधारण धूल से बचाव रखें',
        isUrgent: aqi > 150,
      },
      {
        text: 'Maintain minimum 2.5 - 3.5 Litres of water and electrolyte intake',
        textHi: 'प्रतिदिन 2.5 से 3.5 लीटर पानी एवं नींबू-पानी/ओआरएस का सेवन करें',
      },
      {
        text: fl > 35 ? 'Avoid continuous non-AC exposure exceeding 35 minutes' : 'Natural cross-ventilation in living spaces recommended',
        textHi: fl > 35 ? '35 मिनट से अधिक धूप या बिना पंखे/कूलर के न रहें' : 'कमरों में ताजी हवा का आवागमन बनाए रखें',
      },
    ],
    criticalWarning:
      isExtremeHeat || aqi > 250
        ? `Advisory Level RED: AQI (${aqi}) or Apparent Temp (${fl}°C) crossed clinical safety barrier.`
        : undefined,
    criticalWarningHi:
      isExtremeHeat || aqi > 250
        ? `रेड अलर्ट: AQI (${aqi}) या प्रभावी तापमान (${fl}°C) स्वास्थ्य के लिए हानिकारक स्तर पर है।`
        : undefined,
  };

  // 2. FITNESS & RUNNERS
  let fitScore = 85;
  if (t > 33 || fl > 36) fitScore -= 30;
  if (isRainy) fitScore -= 25;
  if (aqi > 150) fitScore -= 25;
  if (uv > 7) fitScore -= 15;
  fitScore = Math.max(10, Math.min(100, fitScore));

  const fitLabel =
    fitScore > 80 ? 'Excellent' : fitScore > 60 ? 'Good' : fitScore > 40 ? 'Caution' : fitScore > 20 ? 'Adverse' : 'Critical';

  const fitnessAdvisory: PersonaAdvisory = {
    id: 'fitness',
    title: 'Fitness & Runners',
    titleHi: 'धावक एवं फिटनेस एथलीट',
    iconName: 'Flame',
    targetAudience: 'Marathoners, Cyclists, Calisthenics & Gym Goers',
    score: fitScore,
    scoreLabel: fitLabel,
    summary:
      isRainy
        ? 'Slick road asphalt and low friction. Switch high-intensity intervals to indoor treadmills or functional strength circuits.'
        : fl > 34
        ? 'High sweat-evaporation resistance. Restrict aerobic runs to early dawn hours and pace by heart-rate zone rather than split times.'
        : 'Optimum aerobic density. Ideal weather for outdoor road biking, tempo runs, and trail intervals.',
    summaryHi:
      isRainy
        ? 'सड़कों पर फिसलन और वर्षा की संभावना। आउटडोर रनिंग की जगह इनडोर वर्कआउट या जिम का चयन करें।'
        : fl > 34
        ? 'पसीना जल्दी न सूखने के कारण हीट स्ट्रोक का खतरा। सुबह 6 से 7 बजे के बीच ही कार्डियो करें।'
        : 'दौड़ने और साइकिलिंग के लिए बेहतरीन मौसम। शरीर की क्षमता अनुसार वर्कआउट करें।',
    keyMetricName: 'Outdoor Workout Viability',
    keyMetricValue: `${fitScore}% (HR Zone 2 Safe)`,
    recommendedTimeWindow: '05:30 AM - 07:15 AM',
    actionableChecklist: [
      {
        text: 'Pre-hydrate with 500ml sodium-rich water 30 min before run',
        textHi: 'दौड़ने से 30 मिनट पहले 500 मिली इलेक्ट्रोलाइट युक्त पानी लें',
      },
      {
        text: uv > 6 ? 'Apply SPF 50+ sweat-resistant sunscreen on exposed neck & arms' : 'UV index moderate; light sun protection suffice',
        textHi: 'पसीने से न छूटने वाला सनस्क्रीन लगाएं',
      },
      {
        text: isRainy ? 'Use anti-skid trail lugs; avoid smooth carbon racing soles' : 'Breathable synthetic polyester or mesh apparel',
        textHi: isRainy ? 'फिसलन रोधी जूतों का उपयोग करें' : 'हवादार सूती या ड्राई-फिट वस्त्र पहनें',
      },
    ],
  };

  // 3. SURFERS & BEACHGOERS
  let surfScore = 75;
  if (!isCoastal) surfScore = 40;
  if (ws > 45 || isRainy) surfScore -= 45;
  else if (ws > 25) surfScore += 10; // good chop/swell
  if (condition === 'cyclone' || ws > 50) surfScore = 10;
  surfScore = Math.max(10, Math.min(100, surfScore));

  const surfLabel =
    surfScore > 80 ? 'Excellent' : surfScore > 60 ? 'Good' : surfScore > 40 ? 'Caution' : surfScore > 20 ? 'Adverse' : 'Critical';

  const surfersAdvisory: PersonaAdvisory = {
    id: 'surfers',
    title: 'Surfers & Beachgoers',
    titleHi: 'सर्फर एवं समुद्र तट पर्यटक',
    iconName: 'Waves',
    targetAudience: 'Wave Riders, Standup Paddleboarders, Swimmers, Coastal Walkers',
    score: surfScore,
    scoreLabel: surfLabel,
    summary: !isCoastal
      ? 'Non-coastal inland station. Marine calculations routed to nearest Indian coastline.'
      : ws > 35
      ? 'Dangerous sea state with short-period chop and strong rip currents. Red flags active along public bathing beaches.'
      : 'Moderate onshore swell. Suitable for surfing, paddleboarding, and family shoreline strolls with lifeguard surveillance.',
    summaryHi: !isCoastal
      ? 'यह अंतर्देशीय स्टेशन है। निकटतम समुद्र तट की मौसम स्थिति अनुसार योजना बनाएं।'
      : ws > 35
      ? 'समुद्र में तेज लहरें और करंट। समुद्र में उतरना प्रतिबंधित (रेड फ्लैग सक्रिय)।'
      : 'समुद्री स्थिति तैराकी एवं सर्फिंग के लिए सामान्य। सुरक्षा नियमों का पालन करें।',
    keyMetricName: 'Estimated Swell & Wave Height',
    keyMetricValue: !isCoastal ? 'N/A (Inland Station)' : ws > 35 ? '2.8m - 3.6m (Rough)' : '1.1m - 1.6m (Clean Break)',
    recommendedTimeWindow: '06:30 AM - 09:30 AM (Low Tide Window)',
    actionableChecklist: [
      {
        text: 'Verify beach lifeguard flag status (Green = Safe, Red = Danger)',
        textHi: 'समुद्र तट पर लगे सुरक्षा झंडे (रेड/ग्रीन) की पुष्टि करें',
        isUrgent: ws > 30,
      },
      {
        text: 'Always attach board leash and never surf alone in offshore gust zones',
        textHi: 'सर्फबोर्ड लीश अवश्य बांधें और अकेले गहरे पानी में न जाएं',
      },
      {
        text: 'Watch for sudden rip current channels near sandbars',
        textHi: 'रेतीले टीलों के पास अचानक खिंचाव वाले करंट (रिप करंट) से सतर्क रहें',
      },
    ],
    criticalWarning:
      isCoastal && ws > 40 ? 'High Surf Advisory: Rip currents and surge waves posing life hazard on open beaches.' : undefined,
    criticalWarningHi:
      isCoastal && ws > 40 ? 'चेतावनी: समुद्र में तेज लहरों और करंट के कारण नहाने पर पूर्ण रोक।' : undefined,
  };

  // 4. TRAVELERS & TOURISM
  let travelScore = 90;
  if (vis < 2) travelScore -= 35;
  if (isRainy) travelScore -= 25;
  if (isExtremeHeat) travelScore -= 20;
  if (ws > 45) travelScore -= 20;
  travelScore = Math.max(15, Math.min(100, travelScore));

  const travelLabel =
    travelScore > 80 ? 'Excellent' : travelScore > 60 ? 'Good' : travelScore > 40 ? 'Caution' : travelScore > 20 ? 'Adverse' : 'Critical';

  const travelersAdvisory: PersonaAdvisory = {
    id: 'travelers',
    title: 'Travelers & Tourism',
    titleHi: 'यात्री एवं पर्यटन परामर्श',
    iconName: 'Compass',
    targetAudience: 'Domestic & International tourists, Backpackers, Road trippers',
    score: travelScore,
    scoreLabel: travelLabel,
    summary:
      vis < 1.5
        ? 'Reduced atmospheric visibility impacting airport departures and expressway transit. Verify flight PNR statuses before leaving hotel.'
        : isRainy
        ? 'Intermittent downpours across prominent historical monuments and open-air markets. Pack compact windproof umbrellas and rain poncho.'
        : 'Pleasant sightseeing conditions with crisp visibility for landscape photography and heritage walking tours.',
    summaryHi:
      vis < 1.5
        ? 'कम दृश्यता के कारण उड़ानों और ट्रेनों में देरी की संभावना। यात्रा शुरू करने से पहले समय सारिणी जांच लें।'
        : isRainy
        ? 'बारिश के कारण खुले स्मारकों में घूमने में असुविधा हो सकती है। छाता एवं वाटरप्रूफ बैग साथ रखें।'
        : 'पर्यटन एवं फोटोग्राफी के लिए सुहावना मौसम। दिनभर का भ्रमण सुखद रहेगा।',
    keyMetricName: 'Flight & Highway Transit Safety',
    keyMetricValue: vis < 2 ? 'High Delay Risk (Low Vis)' : isRainy ? 'Moderate Delay' : 'On-Time Optimal',
    recommendedTimeWindow: '08:30 AM - 11:30 AM & 04:30 PM - 07:00 PM',
    actionableChecklist: [
      {
        text: vis < 2 ? 'Check airline live flight tracker for CAT-III low visibility delays' : 'Normal scheduled departures on road and rail',
        textHi: vis < 2 ? 'हवाई अड्डे जाने से पहले फ्लाइट की लाइव स्थिति जांचें' : 'यातायात सामान्य गति से संचालित',
      },
      {
        text: 'Keep digital and physical waterproof zip pouches for passports and electronics',
        textHi: 'पासपोर्ट और फोन को वाटरप्रूफ पाउच में सुरक्षित रखें',
      },
      {
        text: 'Download offline GPS maps in case mobile tower latency spikes during rain',
        textHi: 'नेटवर्क की समस्या से बचने हेतु ऑफलाइन मैप डाउनलोड रखें',
      },
    ],
  };

  // 5. PARENTS & CHILDREN
  let parentScore = 85;
  if (aqi > 150) parentScore -= 30;
  if (t > 36 || fl > 38) parentScore -= 25;
  if (isRainy) parentScore -= 20;
  if (uv > 8) parentScore -= 15;
  parentScore = Math.max(15, Math.min(100, parentScore));

  const parentLabel =
    parentScore > 80 ? 'Excellent' : parentScore > 60 ? 'Good' : parentScore > 40 ? 'Caution' : parentScore > 20 ? 'Adverse' : 'Critical';

  const parentsAdvisory: PersonaAdvisory = {
    id: 'parents',
    title: 'Parents & Children',
    titleHi: 'अभिभावक एवं बाल सुरक्षा',
    iconName: 'Baby',
    targetAudience: 'School-going kids, Toddlers, Infants, Playground Visitors',
    score: parentScore,
    scoreLabel: parentLabel,
    summary:
      aqi > 180
        ? 'Sensitive juvenile lungs vulnerable to fine particulate smog. Replace outdoor playground games with creative indoor board activities.'
        : isExtremeHeat
        ? 'Risk of pediatric heat dehydration. Ensure school water bottles contain electrolytes and pack light breathable cotton clothing.'
        : 'Comfortable outdoor conditions. Kids can safely play in neighborhood parks and engage in sports matches.',
    summaryHi:
      aqi > 180
        ? 'प्रदूषण बच्चों के फेफड़ों के लिए नुकसानदायक है। बच्चों को बाहर पार्क में खेलने के बजाय घर के अंदर रखें।'
        : isExtremeHeat
        ? 'बच्चों में पानी की कमी (डिहाइड्रेशन) का खतरा। स्कूल बैग में ओआरएस युक्त पानी की बोतल जरूर दें।'
        : 'बच्चों के बाहर खेलने-कूदने के लिए अनुकूल मौसम। शाम को पार्क ले जाया जा सकता है।',
    keyMetricName: 'Playground & Outdoor Safety',
    keyMetricValue: aqi > 200 ? 'Indoor Only (High AQI)' : isExtremeHeat ? 'Shade Only' : 'Safe for Parks',
    recommendedTimeWindow: '04:30 PM - 06:30 PM (Sun Below Horizon Peak)',
    actionableChecklist: [
      {
        text: 'Pack 750ml insulated water flask with glucose or coconut water',
        textHi: 'बच्चों को ग्लूकोज या नारियल पानी की बोतल साथ दें',
      },
      {
        text: uv > 6 ? 'Equip with broad-brimmed cap and light cotton full-sleeve shirt' : 'Standard seasonal dress',
        textHi: 'धूप से बचाव के लिए टोपी एवं पूरी बांह के सूती कपड़े पहनाएं',
      },
      {
        text: 'Inspect playground swing chains and metal slides for hot surface burns',
        textHi: 'पार्क के झूले और फिसलपट्टी की सतह अत्यधिक गर्म तो नहीं, छूकर जांचें',
      },
    ],
  };

  // 6. AGRICULTURE & FARMERS (KRISHI MAUSAM)
  let agriScore = 70;
  if (isExtremeHeat) agriScore -= 20;
  if (rain > 20) agriScore -= 20;
  if (ws > 30) agriScore -= 15;
  agriScore = Math.max(20, Math.min(100, agriScore));

  const agriLabel =
    agriScore > 80 ? 'Excellent' : agriScore > 60 ? 'Good' : agriScore > 40 ? 'Caution' : agriScore > 20 ? 'Adverse' : 'Critical';

  const agriAdvisory: PersonaAdvisory = {
    id: 'agriculture',
    title: 'Agriculture & Farmers (कृषि मौसम)',
    titleHi: 'किसान भाई एवं कृषि मौसम सेवा',
    iconName: 'Sprout',
    targetAudience: 'Kisan, Agronomists, Horticulture, Paddy & Wheat Cultivators',
    score: agriScore,
    scoreLabel: agriLabel,
    summary:
      pop > 50 || rain > 5
        ? 'Upcoming rain anticipated. Postpone chemical pesticide spraying and fertilizer top-dressing to prevent runoff wash-off.'
        : t > 36
        ? 'Elevated evapotranspiration rates. Provide light and frequent evening micro-irrigation to Standing Kharif/Rabi crops.'
        : 'Favorable atmospheric moisture for field weeding, threshing, and grain drying under direct sun.',
    summaryHi:
      pop > 50 || rain > 5
        ? 'वर्षा की संभावना। कीटनाशक और यूरिया का छिड़काव रोक दें ताकि दवा पानी में बह न जाए।'
        : t > 36
        ? 'तापमान अधिक होने से नमी तेजी से उड़ रही है। फसलों में शाम के समय हल्की सिंचाई करें।'
        : 'फसल कटाई, निराई-गुड़ाई और अनाज सुखाने के लिए मौसम पूरी तरह अनुकूल है।',
    keyMetricName: 'Irrigation & Spraying Advisory',
    keyMetricValue: pop > 50 ? 'HOLD Irrigation & Spraying' : t > 35 ? 'Irrigate in Late Evening' : 'Normal Operations',
    recommendedTimeWindow: '06:00 AM - 09:00 AM & 05:00 PM - 07:00 PM',
    actionableChecklist: [
      {
        text: pop > 50 ? 'Do NOT apply foliar pesticide sprays today (rain runoff risk)' : 'Foliar pesticide application feasible at low wind speed (<15 km/h)',
        textHi: pop > 50 ? 'आज कीटनाशक छिड़काव स्थगित रखें (दवा धुलने का खतरा)' : 'हवा धीमी होने पर छिड़काव किया जा सकता है',
        isUrgent: pop > 50,
      },
      {
        text: 'Clear drainage channels in low-lying crop plots to prevent root stagnation',
        textHi: 'खेतों में जलभराव रोकने के लिए मेढ़ और नालियों की सफाई करें',
      },
      {
        text: 'Cover harvested grain mounds in Mandi with waterproof tarpaulins',
        textHi: 'मंडी व खलिहान में रखे अनाज को तिरपाल से ढक कर सुरक्षित करें',
      },
    ],
  };

  // 7. DAILY COMMUTERS
  let commuteScore = 90;
  if (isRainy) commuteScore -= 30;
  if (vis < 2) commuteScore -= 30;
  if (isExtremeHeat) commuteScore -= 15;
  commuteScore = Math.max(15, Math.min(100, commuteScore));

  const commuteLabel =
    commuteScore > 80 ? 'Excellent' : commuteScore > 60 ? 'Good' : commuteScore > 40 ? 'Caution' : commuteScore > 20 ? 'Adverse' : 'Critical';

  const commuterAdvisory: PersonaAdvisory = {
    id: 'commuters',
    title: 'Daily Commuters',
    titleHi: 'दैनिक यात्री एवं मेट्रो/सड़क आवागमन',
    iconName: 'Car',
    targetAudience: 'Office commuters, Two-wheeler riders, Bus & Metro passengers',
    score: commuteScore,
    scoreLabel: commuteLabel,
    summary:
      isRainy
        ? 'Potential underpass waterlogging and bottleneck congestion. Plan 20-30 minutes buffer time; prefer underground metro over road autos.'
        : vis < 2
        ? 'Dense mist/smog blanket reducing vehicle braking sightlines. Maintain double car following distance.'
        : 'Smooth transit corridor conditions. Normal road and rail commute times anticipated across major arteries.',
    summaryHi:
      isRainy
        ? 'अंडरपास में पानी भरने और ट्रैफिक जाम की आशंका। यात्रा में 25 मिनट का अतिरिक्त समय लेकर चलें।'
        : vis < 2
        ? 'कम दृश्यता के चलते वाहनों के बीच सुरक्षित दूरी बनाए रखें एवं फॉग लैंप जलाएं।'
        : 'सड़क एवं मेट्रो यातायात सुचारू रूप से संचालित। समय पर गंतव्य पहुंचने की संभावना।',
    keyMetricName: 'Traffic Delay & Waterlogging Risk',
    keyMetricValue: isRainy ? 'Moderate to High (+25 min)' : vis < 2 ? 'Braking Risk (Fog)' : 'Low / Smooth Flow',
    recommendedTimeWindow: 'Depart Before 08:30 AM or After 10:30 AM',
    actionableChecklist: [
      {
        text: isRainy ? 'Mandatory compact umbrella & waterproof laptop sleeve in backpack' : 'Standard daily carry kit',
        textHi: isRainy ? 'बैग में छाता एवं लैपटॉप के लिए वाटरप्रूफ कवर अवश्य रखें' : 'सामान्य दिनचर्या',
        isUrgent: isRainy,
      },
      {
        text: 'Check live traffic GPS heatmaps before taking arterial flyovers',
        textHi: 'रवाना होने से पहले जीपीएस पर ट्रैफिक जाम की स्थिति देख लें',
      },
      {
        text: 'Two-wheeler riders: Keep full-face helmet visor wiped and use non-slip gloves',
        textHi: 'दोपहिया वाहन चालक: हेलमेट का वाइजर साफ रखें एवं गति नियंत्रित रखें',
      },
    ],
  };

  // 8. EVENT & WEDDING PLANNERS
  let eventScore = 85;
  if (isRainy) eventScore -= 45;
  if (ws > 30) eventScore -= 25;
  if (isExtremeHeat) eventScore -= 20;
  if (uv > 8) eventScore -= 10;
  eventScore = Math.max(10, Math.min(100, eventScore));

  const eventLabel =
    eventScore > 80 ? 'Excellent' : eventScore > 60 ? 'Good' : eventScore > 40 ? 'Caution' : eventScore > 20 ? 'Adverse' : 'Critical';

  const eventAdvisory: PersonaAdvisory = {
    id: 'events',
    title: 'Event & Wedding Planners',
    titleHi: 'इवेंट, उत्सव एवं विवाह आयोजक',
    iconName: 'PartyPopper',
    targetAudience: 'Banquet organizers, Outdoor exhibition managers, Festival coordinators',
    score: eventScore,
    scoreLabel: eventLabel,
    summary:
      isRainy
        ? 'High precipitation probability threatening lawn banquets. Activate waterproof German pagoda tents and establish covered walkways.'
        : ws > 25
        ? 'Gusty wind speeds exceeding 25 km/h. Anchor all heavy trusses, flower arches, and LED screen towers with concrete counterweights.'
        : 'Superb open-sky conditions. Outdoor lawns, cocktail patios, and musical stages can operate without weather impediment.',
    summaryHi:
      isRainy
        ? 'खुले लॉन में बारिश की प्रबल संभावना। वाटरप्रूफ शामियाने और वाटरप्रूफिंग की तुरंत व्यवस्था करें।'
        : ws > 25
        ? 'तेज हवाओं से टेंट और लाइट के स्ट्रक्चर को खतरा। सभी खंभों पर भारी वजन बांधें।'
        : 'खुले मैदान में विवाह, संगीत या प्रदर्शनी के आयोजन के लिए उत्तम मौसम।',
    keyMetricName: 'Outdoor Event Feasibility',
    keyMetricValue: isRainy ? 'High Rain Threat (Contingency On)' : ws > 25 ? 'High Wind Caution' : '95% Outdoor Feasible',
    recommendedTimeWindow: '06:30 PM - 11:30 PM (Evening Reception)',
    actionableChecklist: [
      {
        text: isRainy ? 'Activate indoor banquet hall backup plan immediately' : 'Keep waterproof tarpaulin rolls on standby near audio consoles',
        textHi: isRainy ? 'बैकअप के रूप में इनडोर बैंक्वेट हॉल तैयार रखें' : 'साउंड और इलेक्ट्रॉनिक उपकरणों के पास वाटरप्रूफ तिरपाल रखें',
        isUrgent: isRainy,
      },
      {
        text: 'Inspect electrical generator cable joints for water ingress protection',
        textHi: 'जनरेटर और मुख्य बिजली के तारों को पानी से सुरक्षित रखें',
      },
      {
        text: isExtremeHeat ? 'Install heavy industrial mist cooling fans across guest seating' : 'Ambient temperature comfortable for attendees',
        textHi: isExtremeHeat ? 'अतिथियों के लिए मिस्ट कूलिंग पंखों की व्यवस्था करें' : 'तापमान सुखद रहेगा',
      },
    ],
  };

  // 9. SPORTS & ATHLETES (CRICKET / FOOTBALL / TENNIS)
  let sportScore = 85;
  if (isRainy) sportScore -= 50;
  if (t > 37 || fl > 40) sportScore -= 30;
  if (ws > 35) sportScore -= 20;
  if (vis < 2) sportScore -= 25;
  sportScore = Math.max(10, Math.min(100, sportScore));

  const sportLabel =
    sportScore > 80 ? 'Excellent' : sportScore > 60 ? 'Good' : sportScore > 40 ? 'Caution' : sportScore > 20 ? 'Adverse' : 'Critical';

  const sportsAdvisory: PersonaAdvisory = {
    id: 'sports',
    title: 'Sports & Cricket Match Conditions',
    titleHi: 'खेल एवं क्रिकेट मैच परिस्थितियां',
    iconName: 'Trophy',
    targetAudience: 'Cricket clubs, Football turf players, Tennis academies, Referees',
    score: sportScore,
    scoreLabel: sportLabel,
    summary:
      isRainy
        ? 'Damp outfield and slick pitch surface. High ball skidding, uneven bounce, and risk of ligament hyperextension during sudden turns.'
        : h > 70 && t > 28
        ? 'High relative humidity assisting conventional swing bowling in early overs; heavy outfield friction expected as evening dew sets in.'
        : 'Crisp pitch firming up under sunshine. Good true bounce for batsmen and reliable grip for finger spinners.',
    summaryHi:
      isRainy
        ? 'गीली पिच और आउटफील्ड के कारण मैच रुकने या फिसलकर चोट लगने का अंदेशा। डकवर्थ लुईस स्थिति।'
        : h > 70 && t > 28
        ? 'हवा में नमी से शुरुआत में तेज गेंदबाजों को स्विंग मिलेगी। बाद में गेंद गीली होने की संभावना।'
        : 'बल्लेबाजी और फील्डिंग के लिए पिच की स्थिति आदर्श। गेंद पर अच्छा नियंत्रण रहेगा।',
    keyMetricName: 'Pitch Grip & Swing Index',
    keyMetricValue: isRainy ? 'Wet Outfield (Stoppage)' : h > 70 ? 'High Early Swing' : 'Dry & Firm (Fair Bounce)',
    recommendedTimeWindow: '07:00 AM - 10:30 AM & 03:30 PM - 06:30 PM',
    actionableChecklist: [
      {
        text: 'Deploy pitch super-soppers and full square tarpaulin covers if drizzle begins',
        textHi: 'बारिश के शुरुआती संकेत पर पिच और 30-यार्ड सर्कल को तुरंत ढकें',
        isUrgent: isRainy,
      },
      {
        text: 'Ensure team physio carries ice towels and quick sodium-potassium replenishers',
        textHi: 'खिलाड़ियों के लिए बर्फ के तौलिए और इलेक्ट्रोलाइट ड्रिंक तैयार रखें',
      },
      {
        text: 'Bowlers: Use sawdust at bowling crease landing point to maintain spike traction',
        textHi: 'गेंदबाजी क्रीज पर पैर फिसलने से बचने हेतु बुरादा (लकड़ी का चूरा) डालें',
      },
    ],
  };

  return {
    health: healthAdvisory,
    fitness: fitnessAdvisory,
    surfers: surfersAdvisory,
    travelers: travelersAdvisory,
    parents: parentsAdvisory,
    agriculture: agriAdvisory,
    commuters: commuterAdvisory,
    events: eventAdvisory,
    sports: sportsAdvisory,
  };
}
