/* ============================================================
   DATA.JS — Borsa Simulyasiyası
   ============================================================
   YENİ AKTİV ƏLAVƏ ETMƏK ÜÇÜN:
   1. Aşağıdakı ASSETS array-inə bir obyekt əlavə et.
   2. Hər sahə mütləqdir: id, name, ticker, type, sector,
      basePrice, volatility, trend
   3. Volatility: 0.01 (sakit) — 0.08 (çox dəyişkən)
   4. Trend: -0.002 (mənfi) — +0.003 (müsbət) gündəlik

   YENİ XƏBƏR ƏLAVƏ ETMƏK ÜÇÜN:
   1. NEWS array-inə obyekt əlavə et.
   2. Sahələr: assetId (aktivin id-si), title, text,
      impact (-0.20 ilə +0.20 arası), duration (1-5 gün),
      icon (Iconify SVG URL)
   ============================================================ */

/* ============================================================
   SEKTORLAR
   ============================================================ */
const SECTORS = {
  tech:      { label: "Texnologiya",   color: "#5AA9FF", correlFactor: 0.3 },
  bank:      { label: "Bank & Maliyyə",color: "#E8A33D", correlFactor: 0.4 },
  energy:    { label: "Enerji",         color: "#FF8C42", correlFactor: 0.45 },
  health:    { label: "Səhiyyə",        color: "#1FD67A", correlFactor: 0.25 },
  retail:    { label: "Pərakəndə",      color: "#C99CFF", correlFactor: 0.3 },
  auto:      { label: "Avtomobil",      color: "#FF4C5E", correlFactor: 0.35 },
  crypto:    { label: "Kripto",         color: "#F7931A", correlFactor: 0.5 },
  commodity: { label: "Əmtəə",         color: "#D4AF37", correlFactor: 0.35 }
};

/* ============================================================
   50 AKTİV
   ============================================================ */
const ASSETS = [
  /* ── TECH (10) ── */
  { id:"nvdai",   name:"Nvdai",          ticker:"NVDI", type:"stock", sector:"tech",      basePrice:875.40,  volatility:0.032, trend:0.0018 },
  { id:"applix",  name:"Applix",         ticker:"APLX", type:"stock", sector:"tech",      basePrice:192.30,  volatility:0.022, trend:0.0012 },
  { id:"goolgex", name:"Goolgex",        ticker:"GGEX", type:"stock", sector:"tech",      basePrice:174.50,  volatility:0.020, trend:0.0010 },
  { id:"mekrosoft",name:"Mekrosoft",     ticker:"MKRS", type:"stock", sector:"tech",      basePrice:415.20,  volatility:0.018, trend:0.0014 },
  { id:"amazan",  name:"Amazan Corp",    ticker:"AMZN", type:"stock", sector:"tech",      basePrice:188.90,  volatility:0.024, trend:0.0013 },
  { id:"metaspace",name:"Metaspace",     ticker:"MTSZ", type:"stock", sector:"tech",      basePrice:520.70,  volatility:0.028, trend:0.0016 },
  { id:"intell",  name:"Intell Corp",    ticker:"INTC", type:"stock", sector:"tech",      basePrice:42.80,   volatility:0.025, trend:0.0005 },
  { id:"samzung",  name:"Samzung Elec",  ticker:"SMZG", type:"stock", sector:"tech",      basePrice:68.40,   volatility:0.026, trend:0.0008 },
  { id:"tsumu",   name:"Tsumu Semi",     ticker:"TSMU", type:"stock", sector:"tech",      basePrice:167.30,  volatility:0.030, trend:0.0015 },
  { id:"orakl",   name:"Orakl Systems",  ticker:"ORKL", type:"stock", sector:"tech",      basePrice:128.60,  volatility:0.019, trend:0.0009 },

  /* ── BANK & MALİYYƏ (6) ── */
  { id:"jpmorq",  name:"JPMorq & Co",    ticker:"JPMQ", type:"stock", sector:"bank",      basePrice:198.40,  volatility:0.016, trend:0.0008 },
  { id:"goldmax", name:"Goldmax Sachs",  ticker:"GLDM", type:"stock", sector:"bank",      basePrice:478.20,  volatility:0.018, trend:0.0009 },
  { id:"bankamr", name:"Banka Merikal",  ticker:"BNKM", type:"stock", sector:"bank",      basePrice:38.70,   volatility:0.017, trend:0.0006 },
  { id:"wellsf",  name:"Wellsford Bank", ticker:"WLSF", type:"stock", sector:"bank",      basePrice:56.30,   volatility:0.015, trend:0.0005 },
  { id:"viza",    name:"Viza Corp",       ticker:"VIZA", type:"stock", sector:"bank",      basePrice:271.80,  volatility:0.014, trend:0.0011 },
  { id:"mastacard",name:"Mastacard",     ticker:"MSTC", type:"stock", sector:"bank",      basePrice:468.50,  volatility:0.015, trend:0.0010 },

  /* ── ENERJİ (5) ── */
  { id:"exona",   name:"Exona Mobil",    ticker:"EXNA", type:"stock", sector:"energy",    basePrice:112.40,  volatility:0.020, trend:0.0004 },
  { id:"chevronx",name:"Chevronx",       ticker:"CHRX", type:"stock", sector:"energy",    basePrice:156.90,  volatility:0.019, trend:0.0003 },
  { id:"shellx",  name:"Shellx Energy",  ticker:"SHLX", type:"stock", sector:"energy",    basePrice:68.20,   volatility:0.021, trend:0.0004 },
  { id:"bpenergy",name:"BP Enerji",      ticker:"BPEN", type:"stock", sector:"energy",    basePrice:39.80,   volatility:0.022, trend:0.0002 },
  { id:"totalenx",name:"Totalenx",       ticker:"TLNX", type:"stock", sector:"energy",    basePrice:62.50,   volatility:0.020, trend:0.0003 },

  /* ── SƏHİYYƏ (5) ── */
  { id:"janjohn", name:"Jan & Johnson",  ticker:"JNJN", type:"stock", sector:"health",    basePrice:152.30,  volatility:0.014, trend:0.0007 },
  { id:"pfizor",  name:"Pfizor Inc",     ticker:"PFZR", type:"stock", sector:"health",    basePrice:28.40,   volatility:0.018, trend:0.0003 },
  { id:"medtronik",name:"Medtronik",     ticker:"MDTK", type:"stock", sector:"health",    basePrice:84.70,   volatility:0.016, trend:0.0006 },
  { id:"abbot",   name:"Abbot Labs",     ticker:"ABBT", type:"stock", sector:"health",    basePrice:108.20,  volatility:0.015, trend:0.0007 },
  { id:"merko",   name:"Merko & Co",     ticker:"MERK", type:"stock", sector:"health",    basePrice:126.80,  volatility:0.014, trend:0.0006 },

  /* ── PƏRAKƏNDƏsatış (4) ── */
  { id:"walmarta",name:"Walmarta",       ticker:"WLMT", type:"stock", sector:"retail",    basePrice:176.40,  volatility:0.014, trend:0.0006 },
  { id:"costko",  name:"Costko Corp",    ticker:"CSTK", type:"stock", sector:"retail",    basePrice:882.30,  volatility:0.016, trend:0.0009 },
  { id:"targit",  name:"Targit Stores",  ticker:"TRGT", type:"stock", sector:"retail",    basePrice:148.60,  volatility:0.018, trend:0.0004 },
  { id:"homidepo",name:"Homidepo",       ticker:"HMDP", type:"stock", sector:"retail",    basePrice:364.80,  volatility:0.017, trend:0.0007 },

  /* ── AVTOMOBİL (4) ── */
  { id:"tessla",  name:"Tessla Motors",  ticker:"TSSL", type:"stock", sector:"auto",      basePrice:248.70,  volatility:0.038, trend:0.0014 },
  { id:"toyoto",  name:"Toyoto Group",   ticker:"TOYT", type:"stock", sector:"auto",      basePrice:192.40,  volatility:0.018, trend:0.0007 },
  { id:"volksvan",name:"Volksvan AG",    ticker:"VLKV", type:"stock", sector:"auto",      basePrice:118.90,  volatility:0.022, trend:0.0004 },
  { id:"rivyan",  name:"Rivyan Auto",    ticker:"RVYN", type:"stock", sector:"auto",      basePrice:14.30,   volatility:0.045, trend:0.0010 },

  /* ── KRİPTO (10) ── */
  { id:"bitkoyn", name:"Bitkoyn",        ticker:"BTK",  type:"crypto", sector:"crypto",   basePrice:67420.0, volatility:0.055, trend:0.0015 },
  { id:"etherym", name:"Etherym",        ticker:"ETH",  type:"crypto", sector:"crypto",   basePrice:3840.0,  volatility:0.060, trend:0.0012 },
  { id:"solano",  name:"Solano",         ticker:"SOL",  type:"crypto", sector:"crypto",   basePrice:182.40,  volatility:0.065, trend:0.0018 },
  { id:"bincoin", name:"Bincoin Coin",   ticker:"BNC",  type:"crypto", sector:"crypto",   basePrice:612.30,  volatility:0.062, trend:0.0010 },
  { id:"cardona", name:"Cardona",        ticker:"CDN",  type:"crypto", sector:"crypto",   basePrice:0.48,    volatility:0.070, trend:0.0008 },
  { id:"avlanch", name:"Avlanch",        ticker:"AVL",  type:"crypto", sector:"crypto",   basePrice:38.90,   volatility:0.068, trend:0.0014 },
  { id:"polkadut",name:"Polkadut",       ticker:"PDT",  type:"crypto", sector:"crypto",   basePrice:7.82,    volatility:0.072, trend:0.0006 },
  { id:"chainlek",name:"Chainlek",       ticker:"CLK",  type:"crypto", sector:"crypto",   basePrice:14.20,   volatility:0.075, trend:0.0007 },
  { id:"xripple", name:"Xripple",        ticker:"XRP",  type:"crypto", sector:"crypto",   basePrice:0.52,    volatility:0.063, trend:0.0009 },
  { id:"litkoyn", name:"Litkoyn",        ticker:"LTK",  type:"crypto", sector:"crypto",   basePrice:82.40,   volatility:0.058, trend:0.0008 },

  /* ── ƏMTƏƏ (8) ── */
  { id:"gold",    name:"Qızıl",          ticker:"XAU",  type:"commodity", sector:"commodity", basePrice:2340.0,  volatility:0.012, trend:0.0006 },
  { id:"silver",  name:"Gümüş",          ticker:"XAG",  type:"commodity", sector:"commodity", basePrice:28.40,   volatility:0.018, trend:0.0004 },
  { id:"oil_wti", name:"Neft (WTI)",     ticker:"WTI",  type:"commodity", sector:"commodity", basePrice:82.60,   volatility:0.022, trend:0.0002 },
  { id:"oil_brent",name:"Neft (Brent)",  ticker:"BRT",  type:"commodity", sector:"commodity", basePrice:86.40,   volatility:0.021, trend:0.0002 },
  { id:"natgas",  name:"Təbii Qaz",      ticker:"NGS",  type:"commodity", sector:"commodity", basePrice:2.84,    volatility:0.030, trend:0.0001 },
  { id:"copper",  name:"Mis",            ticker:"COP",  type:"commodity", sector:"commodity", basePrice:4.52,    volatility:0.020, trend:0.0005 },
  { id:"wheat",   name:"Buğda",          ticker:"WHT",  type:"commodity", sector:"commodity", basePrice:612.0,   volatility:0.025, trend:-0.0002 },
  { id:"platinum",name:"Platinium",      ticker:"PLT",  type:"commodity", sector:"commodity", basePrice:1024.0,  volatility:0.016, trend:0.0004 }
];

/* ============================================================
   XƏBƏRLƏR
   ============================================================
   Format:
   {
     assetId:  "aktiv id-si",
     title:    "Başlıq",
     text:     "Xəbər mətni",
     impact:   -0.12,   // mənfi = düşüş, müsbət = artım (faiz kimi: 0.12 = 12%)
     duration: 2,        // neçə gün davam edir (1-5)
     icon:     "https://api.iconify.design/..."  // SVG ikonu
   }

   ÖZÜNÜZ XƏBƏR ƏLAVƏ EDƏNDƏ:
   - assetId: ASSETS-dakı id ilə eyni olmalıdır
   - impact: -0.20 ilə +0.20 arası (çox böyük ədədlər oyunu pozur)
   - duration: 1 (anlıq) — 5 (uzun müddətli)
   - icon: https://api.iconify.design/KOLEKSIYA/İKON.svg?color=RƏNG
     Nümunələr:
       https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A
       https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E
       https://api.iconify.design/lucide/zap.svg?color=%23E8A33D
       https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF
       https://api.iconify.design/lucide/landmark.svg?color=%23E8A33D
       https://api.iconify.design/lucide/flame.svg?color=%23FF8C42
       https://api.iconify.design/lucide/heart-pulse.svg?color=%231FD67A
       https://api.iconify.design/lucide/bitcoin.svg?color=%23F7931A
       https://api.iconify.design/lucide/gem.svg?color=%23D4AF37
   ============================================================ */
const NEWS = [

  /* ── NVDAI ── */
  {
    assetId: "nvdai",
    title: "Nvdai yeni çip nəsli elan etdi",
    text: "Şirkətin prezidenti yeni GPU arxitekturasını təqdim etdi. Bulud hesablama sahəsindəki tələbat kəskin artacaq.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "nvdai",
    title: "Nvdai-nin gəlir hesabatı gözləntiləri aşdı",
    text: "Üçüncü rüb üzrə gəlir proqnozdan 18% yüksək gəldi. Süni zəka çiplərindəki sifarişlər rekord həddə çatdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "nvdai",
    title: "ABŞ ixrac məhdudiyyəti Nvdai-ni hədəf alır",
    text: "Hökumət yeni texnologiya ixracı qaydaları çərçivəsində bir sıra çip modelinin Asiyaya satışını məhdudlaşdırır.",
    impact: -0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },

  /* ── APPLIX ── */
  {
    assetId: "applix",
    title: "Applix yeni cihaz seriyasını bazara çıxardı",
    text: "Gözlənilən AX Pro seriyası rəsmi olaraq satışa çıxdı. İlk sifarişlər 48 saatda tükəndi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "applix",
    title: "Applix-ə anti-inhisar cəriməsi",
    text: "Avropa İttifaqı Applix-i bazar inhisarçılığına görə 2.4 milyard avroluq cərimə ilə üzləşdirdi.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },

  /* ── BITKOYN ── */
  {
    assetId: "bitkoyn",
    title: "Mərkəzi bank BTK rezerv varlığı kimi tanıdı",
    text: "Böyük Avropa mərkəzi bankı Bitkoynu rəsmən ehtiyat aktivi kimi siyahısına əlavə etdi. Kripto bazarı sürətlə reaksiya verdi.",
    impact: 0.15,
    duration: 4,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%23F7931A"
  },
  {
    assetId: "bitkoyn",
    title: "BTK böyük mübadilə hack-i ilə sarsıldı",
    text: "Aparıcı kripto birjalarından birindən 340 milyon dollarlıq BTK oğurlandı. İnvestorlar satışa keçdi.",
    impact: -0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-alert.svg?color=%23FF4C5E"
  },
  {
    assetId: "bitkoyn",
    title: "ETF onayı BTK-ya rüzgar qatdı",
    text: "SEC yeni bir spot BTK ETF-ini rəsmən təsdiqlədi. Institusional investorlar sürətlə mövqe açır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },

  /* ── ETHERYM ── */
  {
    assetId: "etherym",
    title: "Etherym şəbəkə yeniləməsi uğurla tamamlandı",
    text: "Uzun gözlənilən protokol yeniləməsi istifadəçi ödənclərini 70% azaldacaq, şəbəkə sürətini isə 4 dəfə artıracaq.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%23E8A33D"
  },
  {
    assetId: "etherym",
    title: "Iri ETH balinaları satışa başladı",
    text: "Blockchain analitikləri ən böyük 10 cüzdanın son 48 saatda 180,000 ETH satdığını qeydə aldı.",
    impact: -0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },

  /* ── QIZIL (XAU) ── */
  {
    assetId: "gold",
    title: "Geosiyasi gərginlik qızıla tələbi artırdı",
    text: "Orta Şərqdəki gərginliyin dərinləşməsi qızılı sığınacaq aktiv kimi ön plana çıxardı. Mərkəzi banklar alım tempini artırır.",
    impact: 0.06,
    duration: 4,
    icon: "https://api.iconify.design/lucide/gem.svg?color=%23D4AF37"
  },
  {
    assetId: "gold",
    title: "Dollar güclənməsi qızılı sıxışdırdı",
    text: "ABŞ Federal Ehtiyatının çıxışından sonra dollar indeksi 1.8% qalxdı. Qızıl korreksiyaya məruz qaldı.",
    impact: -0.05,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },

  /* ── NEFT WTI ── */
  {
    assetId: "oil_wti",
    title: "OPEC+ gündəlik istehsalı azaltdı",
    text: "OPEC+ aylıq görüşdə gündəlik 1.2 milyon barrel azaltma qərarı aldı. Analitiklər qiymət artımını proqnozlaşdırır.",
    impact: 0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/flame.svg?color=%23FF8C42"
  },
  {
    assetId: "oil_wti",
    title: "ABŞ neft ehtiyatları gözləntiləri aşdı",
    text: "EIA haftalıq ehtiyat məlumatları proqnozdan 5.2 milyon barrel yüksək gəldi. Neft bazarında satış dalğası başladı.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },

  /* ── TESSLA ── */
  {
    assetId: "tessla",
    title: "Tessla çatdırılma rəqəmləri rekord qırdı",
    text: "Şirkət rüblük çatdırılma statistikasında 480,000 vahidlə rekord göstərici əldə etdi. Analitik hədəflər yüksəldi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/car.svg?color=%231FD67A"
  },
  {
    assetId: "tessla",
    title: "Tessla yeni zavod planı ilə bazar marağı qazandı",
    text: "Cənub-Şərqi Asiyada planlanan yeni istehsal kompleksi kapasiteni 30% artıracaq.",
    impact: 0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/factory.svg?color=%235AA9FF"
  },
  {
    assetId: "tessla",
    title: "Tessla CEO-su səhmləri satdı",
    text: "Şirkətin baş icraçısı vergi öhdəlikləri bəhanəsiylə 2 milyard dollarlıq TSSL səhmi satdı. Bazar siqnalı narahatedici şərh etdi.",
    impact: -0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/user-minus.svg?color=%23FF4C5E"
  },

  /* ── JPMORQ ── */
  {
    assetId: "jpmorq",
    title: "JPMorq gəlir hesabatında gözləntiləri aşdı",
    text: "Bankın ikinci rüb xalis gəliri 14.5 milyard dollar ilə rekord həddə çatdı. Kredit portfeli sağlam görünür.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/landmark.svg?color=%23E8A33D"
  },
  {
    assetId: "jpmorq",
    title: "Kredit böhranı narahatlığı bank sektorunu sasdı",
    text: "Kommersiya daşınmaz əmlak kreditlərindəki gecikmə nisbəti 2008-ci ildən bəri ən yüksək həddə çatdı.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/building-2.svg?color=%23FF4C5E"
  },

  /* ── SOLANO ── */
  {
    assetId: "solano",
    title: "Solano şəbəkəsindəki əməliyyat həcmi rekord qırdı",
    text: "Günlük əməliyyat sayı 100 milyon həddini keçdi. DeFi protokolları Solano-ya köç edir.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/activity.svg?color=%23F7931A"
  },
  {
    assetId: "solano",
    title: "Solano şəbəkəsi yenidən dayanma yaşadı",
    text: "Validatorlar arasındakı konsensus problemi şəbəkəni 4 saatlıq fasilə ilə üzləşdirdi. İstifadəçi etibarı sarsıldı.",
    impact: -0.13,
    duration: 2,
    icon: "https://api.iconify.design/lucide/wifi-off.svg?color=%23FF4C5E"
  },

  /* ── PFIZOR ── */
  {
    assetId: "pfizor",
    title: "Pfizor yeni preparatının 3-cü faza nəticələrini açıqladı",
    text: "Xərçənğə qarşı yeni dərman 78% effektivlik göstərdi. Tənzimləyici icazə prosesi sürətləndirilir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/heart-pulse.svg?color=%231FD67A"
  },
  {
    assetId: "pfizor",
    title: "Pfizor-un əsas preparatı patent itkisi ilə üzləşir",
    text: "Patent müddəti bitən əsas preparat üçün generik rəqabət başlayır. Analitiklər gəlir azalmasını proqnozlaşdırır.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/file-minus.svg?color=%23FF4C5E"
  },

  /* ── EXONA ── */
  {
    assetId: "exona",
    title: "Exona Körfəzdə yeni yataq kəşf etdi",
    text: "Şirkət Ərəb körfəzindəki 3 milyard barreldən çox ehtiyata malik yeni neft yatağını açıqladı.",
    impact: 0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/flame.svg?color=%23FF8C42"
  },
  {
    assetId: "exona",
    title: "Exona karbon vergi yükünün artacağından narahat",
    text: "Yeni tənzimləmə paketi şirkətin illik xərclərini 900 milyon dollar artıracaq. Mənfəət proqnozu aşağı çəkildi.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%23FF4C5E"
  },

  /* ── MEKROSOFT ── */
  {
    assetId: "mekrosoft",
    title: "Mekrosoft bulud gəlirləri 30% artdı",
    text: "Azur platformasının kvartal gəliri 36 milyard dolları keçdi. Süni zəka əlavə xidmətlər əsas sürücü oldu.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cloud.svg?color=%235AA9FF"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft işçi ixtisar planı açıqladı",
    text: "Şirkət xərcləri optimallaşdırmaq üçün qlobal səviyyədə 12,000 işçini ixtisar edəcəyini açıqladı.",
    impact: -0.05,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users-minus.svg?color=%23FF4C5E"
  },

  /* ── QIZIL (əlavə) ── */
  {
    assetId: "gold",
    title: "Çin mərkəzi bankı qızıl ehtiyatını artırdı",
    text: "Çin Xalq Bankı ardıcıl 8-ci ay qızıl ehtiyatını artırdı. Cəmi alım 120 tona çatdı.",
    impact: 0.05,
    duration: 3,
    icon: "https://api.iconify.design/lucide/gem.svg?color=%23D4AF37"
  },

  /* ── CARDONA ── */
  {
    assetId: "cardona",
    title: "Cardona yeni smart kontract yeniləməsi etdi",
    text: "Uzun beklənilən Volkan protokolu aktiv hala gəldi. Hazırda 350-dən çox yeni DeFi layihəsi qurulur.",
    impact: 0.16,
    duration: 3,
    icon: "https://api.iconify.design/lucide/code-2.svg?color=%23F7931A"
  },
  {
    assetId: "cardona",
    title: "Cardona-nın əsas inkişaf qrupu çıxdı",
    text: "İnkişaf şirkətinin 3 əsas inkişafçısı layihəni tərk etdi. İcma gələcək texniki dəstəkdən narahatdır.",
    impact: -0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/user-x.svg?color=%23FF4C5E"
  },

  /* ── WALMARTA ── */
  {
    assetId: "walmarta",
    title: "Walmarta e-ticarət gəliri rekord qırdı",
    text: "Onlayn satış platforması rüblük 42 milyard dollar gəlir qeydə aldı. Logistika şəbəkəsinin genişləndirilməsi davam edir.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%231FD67A"
  },

  /* ── BUĞDA ── */
  {
    assetId: "wheat",
    title: "Ukrayna taxıl ixracatı yenidən durdu",
    text: "Əsas taxıl ixracatçısındakı liman blokladası qlobal buğda qiymətlərini artırdı.",
    impact: 0.09,
    duration: 4,
    icon: "https://api.iconify.design/lucide/wheat.svg?color=%23E8A33D"
  },
  {
    assetId: "wheat",
    title: "Hindistan buğda ixrac qadağasını qaldırdı",
    text: "Daxili ehtiyatlar sabitləşdikdən sonra Hindistan buğda ixracına qoyulan qadağanı ləğv etdi. Qlobal qiymətlərə mənfi təsir.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },

  /* ── MİS ── */
  {
    assetId: "copper",
    title: "Elektrik avtomobilləri tələbi misi qiymətləndirdi",
    text: "EV sektoru misa olan tələbi son 5 ildə 3 dəfə artırdı. Yeni mədən layihələri gecikmə yaşayır.",
    impact: 0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%23E8A33D"
  },
  {
    assetId: "copper",
    title: "Çili mədənçilər tətilə hazırlaşır",
    text: "Dünyanın ən böyük mis mədən şirkətlərindən birinin işçiləri əmək müqaviləsi məsələsində tətil elan etdi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/hard-hat.svg?color=%23FF8C42"
  }
];
/* ============================================================
   TRAVEL — ŞƏHƏRLƏRİN DATASI
   data.js-in sonuna əlavə et
============================================================ */
const CITIES = [
  {
    id: "baku",
    name: "Bakı",
    country: "Azərbaycan",
    flag: "🇦🇿",
    color: "#1FD67A",
    tag: "Başlanğıc şəhəri · Vergi yüksək deyil",
    minBalance: 0,
    visaCost: 0,
    moveCost: 0,
    isDefault: true,
    perks: [
      "Aşağı yaşayış xərci",
      "Yerli bank sistemi",
      "Azad ticarət zonaları"
    ]
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "BƏƏ",
    flag: "🇦🇪",
    color: "#E8A33D",
    tag: "Sıfır gəlir vergisi · İnvestor dostu",
    minBalance: 50000,
    visaCost: 3500,
    moveCost: 5000,
    perks: [
      "Gəlir vergisi yoxdur",
      "Güclü maliyyə infrastrukturu",
      "Yüksək əmlak gəliri"
    ]
  },
  {
    id: "london",
    name: "London",
    country: "Böyük Britaniya",
    flag: "🇬🇧",
    color: "#5AA9FF",
    tag: "Qlobal maliyyə mərkəzi",
    minBalance: 80000,
    visaCost: 6000,
    moveCost: 8000,
    perks: [
      "London birjasına giriş",
      "Güclü tənzimləmə mühiti",
      "Diversifikasiya imkanı"
    ]
  },
  {
    id: "newyork",
    name: "New York",
    country: "ABŞ",
    flag: "🇺🇸",
    color: "#C99CFF",
    tag: "Dünya maliyyə paytaxtı",
    minBalance: 150000,
    visaCost: 12000,
    moveCost: 15000,
    perks: [
      "NYSE və NASDAQ birbaşa giriş",
      "Hedge fund ekosistemi",
      "Premium kommersiya əmlakı"
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Yaponiya",
    flag: "🇯🇵",
    color: "#FF8C42",
    tag: "Asiya bazarlarına giriş",
    minBalance: 100000,
    visaCost: 8000,
    moveCost: 10000,
    perks: [
      "Asiya fond bazarlarına giriş",
      "Sabit iqtisadiyyat",
      "Texnologiya sektoru üstünlüyü"
    ]
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indoneziya",
    flag: "🇮🇩",
    color: "#FF4C5E",
    tag: "Dijital köçəri · Aşağı xərc",
    minBalance: 30000,
    visaCost: 2000,
    moveCost: 3000,
    perks: [
      "Çox aşağı yaşayış xərci",
      "Rəqəmsal köçəri vizası",
      "Turizm gəliri yüksəkdir"
    ]
  }
];

/* ============================================================
   REALESTATE — ƏMLAK DATASI (Bakı)
   Hər şəhər üçün PROPERTIES_BY_CITY obyektindən istifadə et
============================================================ */

// Biznes növləri
const BUSINESS_TYPES = [
  { id: "cafe",        name: "Kafe",              icon: "☕", baseRevenuePerM2: 18,  desc: "Gündəlik müştəri axını",      utilityFactor: 1.3 },
  { id: "playstation", name: "PlayStation Salonu", icon: "🎮", baseRevenuePerM2: 22,  desc: "Gənclər üçün əyləncə",        utilityFactor: 1.8 },
  { id: "grocery",     name: "Ərzaq Mağazası",    icon: "🛒", baseRevenuePerM2: 14,  desc: "Sabit tələb",                 utilityFactor: 1.6 },
  { id: "pharmacy",    name: "Aptek",              icon: "💊", baseRevenuePerM2: 20,  desc: "Yüksək marjin",               utilityFactor: 1.2 },
  { id: "barbershop",  name: "Bərbər",             icon: "✂️", baseRevenuePerM2: 16,  desc: "Daimi müştəri bazası",        utilityFactor: 1.4 },
  { id: "laundry",     name: "Camaşırxana",        icon: "🧺", baseRevenuePerM2: 12,  desc: "Az rəqabət",                  utilityFactor: 2.0 },
  { id: "gym",         name: "Mini Gym",            icon: "💪", baseRevenuePerM2: 25,  desc: "Aylıq abunə modeli",          utilityFactor: 1.7 },
  { id: "bookstore",   name: "Kitab Mağazası",     icon: "📚", baseRevenuePerM2: 10,  desc: "Sakin gəlir",                 utilityFactor: 1.0 },
  { id: "petshop",     name: "Pet Shop",            icon: "🐾", baseRevenuePerM2: 17,  desc: "Böyüyən bazar",               utilityFactor: 1.3 },
  { id: "photoprint",  name: "Foto Çap Mərkəzi",   icon: "🖨️", baseRevenuePerM2: 13,  desc: "Sürətli xidmət",              utilityFactor: 1.5 },
  { id: "icecream",    name: "Dondurma Dükanı",    icon: "🍦", baseRevenuePerM2: 15,  desc: "Yüksək mövsüm gəliri",        utilityFactor: 1.9 },
  { id: "coworking",   name: "Coworking",           icon: "💻", baseRevenuePerM2: 20,  desc: "Freelancer bazarı",           utilityFactor: 1.5 },
  { id: "flowershop",  name: "Çiçək Dükanı",       icon: "💐", baseRevenuePerM2: 19,  desc: "Bayram dövrü zirvəsi",        utilityFactor: 1.0 },
  { id: "carwash",     name: "Avtoyuma",            icon: "🚗", baseRevenuePerM2: 21,  desc: "Daimi tələb",                 utilityFactor: 1.6 },
  { id: "printshop",   name: "Çap Xidməti",        icon: "🖋️", baseRevenuePerM2: 11,  desc: "Biznes müştəriləri",          utilityFactor: 1.4 }
];

// Ərazinin qiymət əmsalı (hər şəhər üçün ərazi növü)
const AREA_MULTIPLIERS = {
  premium:  { label: "Mərkəz / Premium",  priceMult: 1.8, revenueMult: 1.6 },
  mid:      { label: "Orta zona",          priceMult: 1.2, revenueMult: 1.2 },
  suburban: { label: "Kənar / Şəhərətrafı", priceMult: 0.75, revenueMult: 0.85 }
};
/* ============================================================
   REALESTATE — HƏFTƏLİK XƏRC SABİTLƏRİ
============================================================ */
const RE_EXPENSE_CONFIG = {
  baseUtilityPerM2Weekly: 2,   // $/m² həftəlik baza kommunal
  taxRate: 0.15,                 // xalis gəlirin 15%-i vergi
  paymentCycleDays: 7,           // ödəniş dövrü
  graceCycles: 2,                // neçə dövr gecikə bilər (2-dən sonra 3-cü dövrdə satılır)
  lateFeeDailyRate: 0.05         // gecikmiş borc üzərinə gündəlik 5%
};
// Bakı əmlakları
const PROPERTIES_BAKU = [
  // ── EVLƏR (5 ədəd) ──
  {
    id: "baku_apt_1",
    city: "baku",
    type: "residential",
    name: "Neftçilər prospekti mənzili",
    icon: "🏢",
    area: "premium",
    m2: 85,
    buyPrice: 85000,
    rentPrice: 1200,      // aylıq kirayə gəliri (kirayəyə versən)
    depositMonths: 3,     // depozit = rentPrice * depositMonths
    desc: "85 m², 3 otaqlı, şəhər mərkəzi, Xəzər mənzərəsi"
  },
  {
    id: "baku_apt_2",
    city: "baku",
    type: "residential",
    name: "Nizami küçəsi studiyası",
    icon: "🏠",
    area: "premium",
    m2: 45,
    buyPrice: 52000,
    rentPrice: 700,
    depositMonths: 2,
    desc: "45 m², studio, tam mebelli, metro yaxınlığı"
  },
  {
    id: "baku_apt_3",
    city: "baku",
    type: "residential",
    name: "Nəriman Nərimanov mənzili",
    icon: "🏠",
    area: "mid",
    m2: 110,
    buyPrice: 75000,
    rentPrice: 900,
    depositMonths: 2,
    desc: "110 m², 4 otaqlı, orta zona, sakit mühit"
  },
  {
    id: "baku_apt_4",
    city: "baku",
    type: "residential",
    name: "Binəqədi həyət evi",
    icon: "🏡",
    area: "suburban",
    m2: 200,
    buyPrice: 65000,
    rentPrice: 600,
    depositMonths: 2,
    desc: "200 m², həyət evi, 5 otaqlı, qaraj"
  },
  {
    id: "baku_apt_5",
    city: "baku",
    type: "residential",
    name: "Flame Towers yaxınlığı mənzil",
    icon: "🏢",
    area: "premium",
    m2: 140,
    buyPrice: 180000,
    rentPrice: 2200,
    depositMonths: 3,
    desc: "140 m², lüks, 4 otaqlı, panoram mənzərə"
  },

  // ── OBYEKTLƏRİN (10 ədəd) ──
  {
    id: "baku_com_1",
    city: "baku",
    type: "commercial",
    name: "İçəri Şəhər girişi dükanı",
    icon: "🏪",
    area: "premium",
    m2: 60,
    buyPrice: 95000,
    rentPrice: 2000,
    depositMonths: 3,
    desc: "60 m², turist zonası, yüksək trafikli"
  },
  {
    id: "baku_com_2",
    city: "baku",
    type: "commercial",
    name: "28 May metro üstü köşk",
    icon: "🏪",
    area: "premium",
    m2: 25,
    buyPrice: 40000,
    rentPrice: 900,
    depositMonths: 2,
    desc: "25 m², metro çıxışı, gündəlik yüksək trafik"
  },
  {
    id: "baku_com_3",
    city: "baku",
    type: "commercial",
    name: "Hövsan sənaye obyekti",
    icon: "🏭",
    area: "suburban",
    m2: 300,
    buyPrice: 85000,
    rentPrice: 1500,
    depositMonths: 2,
    desc: "300 m², anbar + ofis, əlverişli qiymət"
  },
  {
    id: "baku_com_4",
    city: "baku",
    type: "commercial",
    name: "Nizami ticarət mərkəzi yer",
    icon: "🛍️",
    area: "premium",
    m2: 90,
    buyPrice: 160000,
    rentPrice: 3200,
    depositMonths: 3,
    desc: "90 m², ticarət mərkəzi içi, yüksək alıcı axını"
  },
  {
    id: "baku_com_5",
    city: "baku",
    type: "commercial",
    name: "Xətai prospekti restorant yeri",
    icon: "🍽️",
    area: "mid",
    m2: 120,
    buyPrice: 105000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "120 m², restorant üçün hazır, mətbəxlə"
  },
  {
    id: "baku_com_6",
    city: "baku",
    type: "commercial",
    name: "Biləcəri kiçik anbar",
    icon: "📦",
    area: "suburban",
    m2: 180,
    buyPrice: 45000,
    rentPrice: 700,
    depositMonths: 2,
    desc: "180 m², anbar, müstəqil giriş, arxivlərə uyğun"
  },
  {
    id: "baku_com_7",
    city: "baku",
    type: "commercial",
    name: "Sahil bulvarı kiosk",
    icon: "⛱️",
    area: "premium",
    m2: 18,
    buyPrice: 28000,
    rentPrice: 850,
    depositMonths: 2,
    desc: "18 m², bulvar üzərindəki kiosk yeri, turist trafiki"
  },
  {
    id: "baku_com_8",
    city: "baku",
    type: "commercial",
    name: "Sumqayıt yolu mağaza",
    icon: "🏪",
    area: "suburban",
    m2: 80,
    buyPrice: 38000,
    rentPrice: 600,
    depositMonths: 1,
    desc: "80 m², magistral kənarı, nəqliyyat əlçatımlı"
  },
  {
    id: "baku_com_9",
    city: "baku",
    type: "commercial",
    name: "Elit rezidans həyəti ofis",
    icon: "🏢",
    area: "mid",
    m2: 55,
    buyPrice: 62000,
    rentPrice: 1100,
    depositMonths: 2,
    desc: "55 m², sakit yaşayış sahəsindəki ofis binası"
  },
  {
    id: "baku_com_10",
    city: "baku",
    type: "commercial",
    name: "Gənclik mall yaxını köşk",
    icon: "🛒",
    area: "mid",
    m2: 30,
    buyPrice: 52000,
    rentPrice: 1300,
    depositMonths: 2,
    desc: "30 m², mall girişi yaxınlığı, gənc axını"
  }
];

// Bütün əmlakları şəhərə görə topla
const ALL_PROPERTIES = {
  baku: PROPERTIES_BAKU
  // dubai: PROPERTIES_DUBAI  — sonra əlavə olunacaq
  // london: PROPERTIES_LONDON
};

/* ============================================================
   REALESTATE — GƏLİR HESABLAMA FUNKSİYASI
   Aylıq passiv gəliri hesabla
============================================================ */
function calcPropertyIncome(property, ownershipType, businessTypeId = null) {
  const areaMult = AREA_MULTIPLIERS[property.area];

  if (ownershipType === "rent_out") {
    // Kirayəyə vermək — sabit aylıq gəlir
    return Math.round(property.rentPrice * areaMult.revenueMult);
  }

  if (ownershipType === "business" && businessTypeId) {
    // Biznes qur — m2 * biznes növü gəliri * ərazi əmsalı
    const biz = BUSINESS_TYPES.find(b => b.id === businessTypeId);
    if (!biz) return 0;
    const rawIncome = property.m2 * biz.baseRevenuePerM2 * areaMult.revenueMult;
    // ±15% təsadüfi dalğalanma üçün range
    const minIncome = Math.round(rawIncome * 0.85);
    const maxIncome = Math.round(rawIncome * 1.15);
    return { min: minIncome, max: maxIncome, avg: Math.round(rawIncome) };
  }

  return 0;
}
