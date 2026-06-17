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
  { id: "cafe",        name: "Kafe",              icon: "☕", baseRevenuePerM2: 18,  desc: "Gündəlik müştəri axını",      utilityFactor: 1.3, setupCost: 8000 },
  { id: "playstation", name: "PlayStation Salonu", icon: "🎮", baseRevenuePerM2: 22,  desc: "Gənclər üçün əyləncə",        utilityFactor: 1.8, setupCost: 15000 },
  { id: "grocery",     name: "Ərzaq Mağazası",    icon: "🛒", baseRevenuePerM2: 14,  desc: "Sabit tələb",                 utilityFactor: 1.6, setupCost: 10000 },
  { id: "pharmacy",    name: "Aptek",              icon: "💊", baseRevenuePerM2: 20,  desc: "Yüksək marjin",               utilityFactor: 1.2, setupCost: 18000 },
  { id: "barbershop",  name: "Bərbər",             icon: "✂️", baseRevenuePerM2: 16,  desc: "Daimi müştəri bazası",        utilityFactor: 1.4, setupCost: 6000 },
  { id: "laundry",     name: "Camaşırxana",        icon: "🧺", baseRevenuePerM2: 12,  desc: "Az rəqabət",                  utilityFactor: 2.0, setupCost: 12000 },
  { id: "gym",         name: "Mini Gym",            icon: "💪", baseRevenuePerM2: 25,  desc: "Aylıq abunə modeli",          utilityFactor: 1.7, setupCost: 20000 },
  { id: "bookstore",   name: "Kitab Mağazası",     icon: "📚", baseRevenuePerM2: 10,  desc: "Sakin gəlir",                 utilityFactor: 1.0, setupCost: 5000 },
  { id: "petshop",     name: "Pet Shop",            icon: "🐾", baseRevenuePerM2: 17,  desc: "Böyüyən bazar",               utilityFactor: 1.3, setupCost: 9000 },
  { id: "photoprint",  name: "Foto Çap Mərkəzi",   icon: "🖨️", baseRevenuePerM2: 13,  desc: "Sürətli xidmət",              utilityFactor: 1.5, setupCost: 11000 },
  { id: "icecream",    name: "Dondurma Dükanı",    icon: "🍦", baseRevenuePerM2: 15,  desc: "Yüksək mövsüm gəliri",        utilityFactor: 1.9, setupCost: 7000 },
  { id: "coworking",   name: "Coworking",           icon: "💻", baseRevenuePerM2: 20,  desc: "Freelancer bazarı",           utilityFactor: 1.5, setupCost: 14000 },
  { id: "flowershop",  name: "Çiçək Dükanı",       icon: "💐", baseRevenuePerM2: 19,  desc: "Bayram dövrü zirvəsi",        utilityFactor: 1.0, setupCost: 6500 },
  { id: "carwash",     name: "Avtoyuma",            icon: "🚗", baseRevenuePerM2: 21,  desc: "Daimi tələb",                 utilityFactor: 1.6, setupCost: 16000 },
  { id: "printshop",   name: "Çap Xidməti",        icon: "🖋️", baseRevenuePerM2: 11,  desc: "Biznes müştəriləri",          utilityFactor: 1.4, setupCost: 9500 }
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


const PROPERTIES_BALI = [

  // ─────────────────────────────
  // EVLƏR (1-10)
  // ─────────────────────────────

  {
    id: "bali_villa_1",
    city: "bali",
    type: "residential",
    name: "Seminyak Lüks Villa",
    icon: "🏝️",
    area: "premium",
    m2: 180,
    buyPrice: 280000,
    rentPrice: 3500,
    depositMonths: 3,
    desc: "Özəl hovuzlu, premium turizm zonası"
  },

  {
    id: "bali_villa_2",
    city: "bali",
    type: "residential",
    name: "Canggu Surf Villa",
    icon: "🏄",
    area: "premium",
    m2: 150,
    buyPrice: 220000,
    rentPrice: 2900,
    depositMonths: 3,
    desc: "Çimərliyə yaxın, turistlərin sevimlisi"
  },

  {
    id: "bali_villa_3",
    city: "bali",
    type: "residential",
    name: "Ubud Jungle House",
    icon: "🌴",
    area: "mid",
    m2: 120,
    buyPrice: 145000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "Yaşıllıqlar içində sakit yaşayış"
  },

  {
    id: "bali_villa_4",
    city: "bali",
    type: "residential",
    name: "Nusa Dua Residence",
    icon: "🏡",
    area: "premium",
    m2: 140,
    buyPrice: 190000,
    rentPrice: 2400,
    depositMonths: 3,
    desc: "Resort bölgəsində müasir yaşayış"
  },

  {
    id: "bali_villa_5",
    city: "bali",
    type: "residential",
    name: "Jimbaran Ocean Villa",
    icon: "🌊",
    area: "premium",
    m2: 170,
    buyPrice: 250000,
    rentPrice: 3200,
    depositMonths: 3,
    desc: "Okean mənzərəli villa"
  },

  {
    id: "bali_villa_6",
    city: "bali",
    type: "residential",
    name: "Sanur Family House",
    icon: "🏠",
    area: "mid",
    m2: 130,
    buyPrice: 120000,
    rentPrice: 1400,
    depositMonths: 2,
    desc: "Ailə üçün uyğun sakit məhəllə"
  },

  {
    id: "bali_villa_7",
    city: "bali",
    type: "residential",
    name: "Denpasar City Apartment",
    icon: "🏢",
    area: "mid",
    m2: 85,
    buyPrice: 95000,
    rentPrice: 1100,
    depositMonths: 2,
    desc: "Şəhər mərkəzində mənzil"
  },

  {
    id: "bali_villa_8",
    city: "bali",
    type: "residential",
    name: "Uluwatu Cliff Villa",
    icon: "🌅",
    area: "premium",
    m2: 220,
    buyPrice: 420000,
    rentPrice: 5200,
    depositMonths: 3,
    desc: "Qayalıq üzərində lüks villa"
  },

  {
    id: "bali_villa_9",
    city: "bali",
    type: "residential",
    name: "Kuta Beach Apartment",
    icon: "🏖️",
    area: "mid",
    m2: 75,
    buyPrice: 110000,
    rentPrice: 1600,
    depositMonths: 2,
    desc: "Çimərliyə piyada məsafədə"
  },

  {
    id: "bali_villa_10",
    city: "bali",
    type: "residential",
    name: "Legian Resort Residence",
    icon: "🌴",
    area: "premium",
    m2: 90,
    buyPrice: 135000,
    rentPrice: 1900,
    depositMonths: 2,
    desc: "Resort zonasına yaxın yaşayış"
  },

  // ─────────────────────────────
  // EVLƏR (11-20)
  // ─────────────────────────────

  {
    id: "bali_villa_11",
    city: "bali",
    type: "residential",
    name: "Canggu Modern Loft",
    icon: "🏢",
    area: "premium",
    m2: 95,
    buyPrice: 150000,
    rentPrice: 2100,
    depositMonths: 2,
    desc: "Rəqəmsal köçərilər üçün ideal"
  },

  {
    id: "bali_villa_12",
    city: "bali",
    type: "residential",
    name: "Seminyak Penthouse",
    icon: "🏙️",
    area: "premium",
    m2: 160,
    buyPrice: 340000,
    rentPrice: 4200,
    depositMonths: 3,
    desc: "Premium penthouse və şəhər mənzərəsi"
  },

  {
    id: "bali_villa_13",
    city: "bali",
    type: "residential",
    name: "Ubud Eco Villa",
    icon: "🌿",
    area: "mid",
    m2: 140,
    buyPrice: 175000,
    rentPrice: 2200,
    depositMonths: 2,
    desc: "Ekoloji təmiz və müasir dizayn"
  },

  {
    id: "bali_villa_14",
    city: "bali",
    type: "residential",
    name: "Gianyar Garden House",
    icon: "🌺",
    area: "mid",
    m2: 110,
    buyPrice: 90000,
    rentPrice: 950,
    depositMonths: 2,
    desc: "Bağçalı rahat yaşayış evi"
  },

  {
    id: "bali_villa_15",
    city: "bali",
    type: "residential",
    name: "Tabanan Ricefield Villa",
    icon: "🌾",
    area: "suburban",
    m2: 160,
    buyPrice: 125000,
    rentPrice: 1300,
    depositMonths: 2,
    desc: "Düyü sahələri mənzərəli villa"
  },

  {
    id: "bali_villa_16",
    city: "bali",
    type: "residential",
    name: "Nusa Dua Elite Residence",
    icon: "⭐",
    area: "premium",
    m2: 190,
    buyPrice: 310000,
    rentPrice: 3900,
    depositMonths: 3,
    desc: "Elit yaşayış kompleksi"
  },

  {
    id: "bali_villa_17",
    city: "bali",
    type: "residential",
    name: "Singaraja Coastal House",
    icon: "🌊",
    area: "suburban",
    m2: 150,
    buyPrice: 85000,
    rentPrice: 900,
    depositMonths: 2,
    desc: "Sahil yaxınlığında sərfəli ev"
  },

  {
    id: "bali_villa_18",
    city: "bali",
    type: "residential",
    name: "Jimbaran Sunset Villa",
    icon: "🌅",
    area: "premium",
    m2: 175,
    buyPrice: 235000,
    rentPrice: 3000,
    depositMonths: 3,
    desc: "Gün batımı mənzərəli villa"
  },

  {
    id: "bali_villa_19",
    city: "bali",
    type: "residential",
    name: "Canggu Luxury Estate",
    icon: "💎",
    area: "premium",
    m2: 250,
    buyPrice: 480000,
    rentPrice: 6200,
    depositMonths: 3,
    desc: "Ultra lüks premium yaşayış"
  },

  {
    id: "bali_villa_20",
    city: "bali",
    type: "residential",
    name: "Seminyak Designer Villa",
    icon: "🎨",
    area: "premium",
    m2: 210,
    buyPrice: 370000,
    rentPrice: 4700,
    depositMonths: 3,
    desc: "Memarlıq dizaynı ilə seçilən villa"
  },

  // ─────────────────────────────
  // KOMMERSİYA (1-15)
  // ─────────────────────────────

  {
    id: "bali_com_1",
    city: "bali",
    type: "commercial",
    name: "Seminyak Beach Cafe",
    icon: "☕",
    area: "premium",
    m2: 120,
    buyPrice: 180000,
    rentPrice: 4200,
    depositMonths: 3,
    desc: "Çimərlik qarşısında məşhur kafe"
  },

  {
    id: "bali_com_2",
    city: "bali",
    type: "commercial",
    name: "Canggu Surf Shop",
    icon: "🏄",
    area: "premium",
    m2: 80,
    buyPrice: 120000,
    rentPrice: 2600,
    depositMonths: 3,
    desc: "Surf avadanlıqları mağazası"
  },

  {
    id: "bali_com_3",
    city: "bali",
    type: "commercial",
    name: "Ubud Art Gallery",
    icon: "🎨",
    area: "premium",
    m2: 140,
    buyPrice: 150000,
    rentPrice: 2800,
    depositMonths: 2,
    desc: "Turistlər üçün sənət qalereyası"
  },

  {
    id: "bali_com_4",
    city: "bali",
    type: "commercial",
    name: "Kuta Beach Bar",
    icon: "🍹",
    area: "premium",
    m2: 100,
    buyPrice: 160000,
    rentPrice: 3600,
    depositMonths: 3,
    desc: "Populyar gecə həyatı məkanı"
  },

  {
    id: "bali_com_5",
    city: "bali",
    type: "commercial",
    name: "Nusa Dua Luxury Spa",
    icon: "💆",
    area: "premium",
    m2: 180,
    buyPrice: 250000,
    rentPrice: 5200,
    depositMonths: 3,
    desc: "Lüks spa və wellness mərkəzi"
  },

  {
    id: "bali_com_6",
    city: "bali",
    type: "commercial",
    name: "Jimbaran Seafood Restaurant",
    icon: "🍽️",
    area: "premium",
    m2: 220,
    buyPrice: 240000,
    rentPrice: 5000,
    depositMonths: 3,
    desc: "Dəniz məhsulları restoranı"
  },

  {
    id: "bali_com_7",
    city: "bali",
    type: "commercial",
    name: "Seminyak Night Club",
    icon: "🎵",
    area: "premium",
    m2: 260,
    buyPrice: 350000,
    rentPrice: 7500,
    depositMonths: 3,
    desc: "Turistlər arasında məşhur klub"
  },

  {
    id: "bali_com_8",
    city: "bali",
    type: "commercial",
    name: "Uluwatu Cliff Restaurant",
    icon: "🍴",
    area: "premium",
    m2: 180,
    buyPrice: 270000,
    rentPrice: 5600,
    depositMonths: 3,
    desc: "Qayalıq üzərində restoran"
  },

  {
    id: "bali_com_9",
    city: "bali",
    type: "commercial",
    name: "Sanur Diving Center",
    icon: "🤿",
    area: "mid",
    m2: 130,
    buyPrice: 140000,
    rentPrice: 2700,
    depositMonths: 2,
    desc: "Dalğıclıq və turizm xidməti"
  },

  {
    id: "bali_com_10",
    city: "bali",
    type: "commercial",
    name: "Bali Yoga Studio",
    icon: "🧘",
    area: "mid",
    m2: 110,
    buyPrice: 115000,
    rentPrice: 2200,
    depositMonths: 2,
    desc: "Yoga və sağlamlıq mərkəzi"
  },

  {
    id: "bali_com_11",
    city: "bali",
    type: "commercial",
    name: "Bali Souvenir Market",
    icon: "🎁",
    area: "mid",
    m2: 150,
    buyPrice: 125000,
    rentPrice: 2400,
    depositMonths: 2,
    desc: "Suvenir və hədiyyə bazarı"
  },

  {
    id: "bali_com_12",
    city: "bali",
    type: "commercial",
    name: "Seminyak Fashion Boutique",
    icon: "👗",
    area: "premium",
    m2: 90,
    buyPrice: 145000,
    rentPrice: 3100,
    depositMonths: 2,
    desc: "Premium geyim mağazası"
  },

  {
    id: "bali_com_13",
    city: "bali",
    type: "commercial",
    name: "Canggu Skate Shop",
    icon: "🛹",
    area: "mid",
    m2: 75,
    buyPrice: 85000,
    rentPrice: 1700,
    depositMonths: 2,
    desc: "Skate və gənclər məhsulları"
  },

  {
    id: "bali_com_14",
    city: "bali",
    type: "commercial",
    name: "Ubud Handmade Store",
    icon: "🏺",
    area: "mid",
    m2: 95,
    buyPrice: 95000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "Əl işləri və sənətkarlıq məhsulları"
  },

  {
    id: "bali_com_15",
    city: "bali",
    type: "commercial",
    name: "Denpasar Electronics Shop",
    icon: "📱",
    area: "mid",
    m2: 120,
    buyPrice: 135000,
    rentPrice: 2600,
    depositMonths: 2,
    desc: "Elektronika və aksesuar mağazası"
  },
  {
    id: "bali_com_16",
    city: "bali",
    type: "commercial",
    name: "Bali Jewelry Boutique",
    icon: "💍",
    area: "premium",
    m2: 70,
    buyPrice: 165000,
    rentPrice: 3200,
    depositMonths: 3,
    desc: "Lüks zinət əşyaları mağazası"
  },

  {
    id: "bali_com_17",
    city: "bali",
    type: "commercial",
    name: "Kuta Surf Equipment Store",
    icon: "🌊",
    area: "premium",
    m2: 85,
    buyPrice: 130000,
    rentPrice: 2600,
    depositMonths: 2,
    desc: "Surf və çimərlik avadanlıqları"
  },

  {
    id: "bali_com_18",
    city: "bali",
    type: "commercial",
    name: "Nusa Dua Luxury Store",
    icon: "👜",
    area: "premium",
    m2: 100,
    buyPrice: 190000,
    rentPrice: 3900,
    depositMonths: 3,
    desc: "Premium brend mağazası"
  },

  {
    id: "bali_com_19",
    city: "bali",
    type: "commercial",
    name: "Bali Mini Market",
    icon: "🛒",
    area: "mid",
    m2: 120,
    buyPrice: 90000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "Yerli və turist məhsulları"
  },

  {
    id: "bali_com_20",
    city: "bali",
    type: "commercial",
    name: "Jimbaran Gift Shop",
    icon: "🎁",
    area: "mid",
    m2: 75,
    buyPrice: 85000,
    rentPrice: 1600,
    depositMonths: 2,
    desc: "Turist hədiyyələri mağazası"
  },

  {
    id: "bali_com_21",
    city: "bali",
    type: "commercial",
    name: "Boutique Hotel Seminyak",
    icon: "🏨",
    area: "premium",
    m2: 850,
    buyPrice: 950000,
    rentPrice: 18000,
    depositMonths: 3,
    desc: "25 otaqlı butik otel"
  },

  {
    id: "bali_com_22",
    city: "bali",
    type: "commercial",
    name: "Canggu Guesthouse",
    icon: "🏠",
    area: "mid",
    m2: 350,
    buyPrice: 280000,
    rentPrice: 6500,
    depositMonths: 3,
    desc: "Sörfçülər üçün qonaq evi"
  },

  {
    id: "bali_com_23",
    city: "bali",
    type: "commercial",
    name: "Ubud Eco Resort",
    icon: "🌿",
    area: "premium",
    m2: 1200,
    buyPrice: 1200000,
    rentPrice: 24000,
    depositMonths: 3,
    desc: "Ekoloji resort kompleksi"
  },

  {
    id: "bali_com_24",
    city: "bali",
    type: "commercial",
    name: "Kuta Budget Hotel",
    icon: "🛏️",
    area: "mid",
    m2: 700,
    buyPrice: 520000,
    rentPrice: 11000,
    depositMonths: 3,
    desc: "Büdcə dostu otel"
  },

  {
    id: "bali_com_25",
    city: "bali",
    type: "commercial",
    name: "Nusa Dua Beach Resort",
    icon: "🏖️",
    area: "premium",
    m2: 1800,
    buyPrice: 2200000,
    rentPrice: 42000,
    depositMonths: 3,
    desc: "Dənizkənarı premium resort"
  },

  {
    id: "bali_com_26",
    city: "bali",
    type: "commercial",
    name: "Jimbaran Villa Complex",
    icon: "🏝️",
    area: "premium",
    m2: 1500,
    buyPrice: 1750000,
    rentPrice: 34000,
    depositMonths: 3,
    desc: "Kirayəlik villalar kompleksi"
  },

  {
    id: "bali_com_27",
    city: "bali",
    type: "commercial",
    name: "Sanur Holiday Apartments",
    icon: "🏢",
    area: "mid",
    m2: 900,
    buyPrice: 750000,
    rentPrice: 14500,
    depositMonths: 3,
    desc: "Turist apart kompleksi"
  },

  {
    id: "bali_com_28",
    city: "bali",
    type: "commercial",
    name: "Uluwatu Luxury Resort",
    icon: "⭐",
    area: "premium",
    m2: 2500,
    buyPrice: 3500000,
    rentPrice: 68000,
    depositMonths: 3,
    desc: "Ultra lüks okean resortu"
  },

  {
    id: "bali_com_29",
    city: "bali",
    type: "commercial",
    name: "Bali Backpacker Hostel",
    icon: "🎒",
    area: "mid",
    m2: 450,
    buyPrice: 240000,
    rentPrice: 5200,
    depositMonths: 2,
    desc: "Gənc turistlər üçün hostel"
  },

  {
    id: "bali_com_30",
    city: "bali",
    type: "commercial",
    name: "Seminyak Business Hotel",
    icon: "🏨",
    area: "premium",
    m2: 1100,
    buyPrice: 1400000,
    rentPrice: 26000,
    depositMonths: 3,
    desc: "Biznes səfərləri üçün otel"
  },

  {
    id: "bali_com_31",
    city: "bali",
    type: "commercial",
    name: "Digital Nomad Coworking",
    icon: "💻",
    area: "premium",
    m2: 300,
    buyPrice: 260000,
    rentPrice: 5800,
    depositMonths: 2,
    desc: "Rəqəmsal köçərilər üçün iş məkanı"
  },

  {
    id: "bali_com_32",
    city: "bali",
    type: "commercial",
    name: "Bali Marketing Agency",
    icon: "📈",
    area: "mid",
    m2: 140,
    buyPrice: 125000,
    rentPrice: 2500,
    depositMonths: 2,
    desc: "Marketinq və reklam xidməti"
  },

  {
    id: "bali_com_33",
    city: "bali",
    type: "commercial",
    name: "Travel Agency Bali",
    icon: "✈️",
    area: "mid",
    m2: 90,
    buyPrice: 95000,
    rentPrice: 1900,
    depositMonths: 2,
    desc: "Tur və səyahət xidməti"
  },

  {
    id: "bali_com_34",
    city: "bali",
    type: "commercial",
    name: "Immigration Consultant",
    icon: "📄",
    area: "mid",
    m2: 110,
    buyPrice: 120000,
    rentPrice: 2400,
    depositMonths: 2,
    desc: "Viza və immiqrasiya xidmətləri"
  },

  {
    id: "bali_com_35",
    city: "bali",
    type: "commercial",
    name: "Property Management Office",
    icon: "🏢",
    area: "premium",
    m2: 180,
    buyPrice: 210000,
    rentPrice: 4200,
    depositMonths: 2,
    desc: "Əmlak idarəetmə şirkəti"
  },

  {
    id: "bali_com_36",
    city: "bali",
    type: "commercial",
    name: "Software Startup Hub",
    icon: "🚀",
    area: "premium",
    m2: 260,
    buyPrice: 320000,
    rentPrice: 6800,
    depositMonths: 3,
    desc: "Texnologiya startap mərkəzi"
  },

  {
    id: "bali_com_37",
    city: "bali",
    type: "commercial",
    name: "Accounting Office",
    icon: "📊",
    area: "mid",
    m2: 100,
    buyPrice: 95000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "Mühasibat və audit xidməti"
  },

  {
    id: "bali_com_38",
    city: "bali",
    type: "commercial",
    name: "Legal Consultancy",
    icon: "⚖️",
    area: "mid",
    m2: 130,
    buyPrice: 135000,
    rentPrice: 2600,
    depositMonths: 2,
    desc: "Hüquqi məsləhət xidməti"
  },

  {
    id: "bali_com_39",
    city: "bali",
    type: "commercial",
    name: "Recruitment Agency",
    icon: "👔",
    area: "mid",
    m2: 110,
    buyPrice: 110000,
    rentPrice: 2200,
    depositMonths: 2,
    desc: "İşçi təminatı agentliyi"
  },

  {
    id: "bali_com_40",
    city: "bali",
    type: "commercial",
    name: "Event Management Company",
    icon: "🎉",
    area: "premium",
    m2: 170,
    buyPrice: 190000,
    rentPrice: 3900,
    depositMonths: 2,
    desc: "Tədbir təşkilatçılığı şirkəti"
  },
  {
    id: "bali_com_41",
    city: "bali",
    type: "commercial",
    name: "Denpasar Logistics Warehouse",
    icon: "📦",
    area: "suburban",
    m2: 850,
    buyPrice: 420000,
    rentPrice: 7800,
    depositMonths: 2,
    desc: "Adanın əsas logistika anbarı"
  },

  {
    id: "bali_com_42",
    city: "bali",
    type: "commercial",
    name: "Bali Food Distribution Center",
    icon: "🚚",
    area: "suburban",
    m2: 1200,
    buyPrice: 650000,
    rentPrice: 11500,
    depositMonths: 2,
    desc: "Restoran və hotellərə ərzaq təchizatı"
  },

  {
    id: "bali_com_43",
    city: "bali",
    type: "commercial",
    name: "Import Export Depot",
    icon: "🚢",
    area: "suburban",
    m2: 1500,
    buyPrice: 850000,
    rentPrice: 15000,
    depositMonths: 3,
    desc: "İdxal və ixrac əməliyyatları üçün depo"
  },

  {
    id: "bali_com_44",
    city: "bali",
    type: "commercial",
    name: "Cold Storage Facility",
    icon: "❄️",
    area: "suburban",
    m2: 700,
    buyPrice: 520000,
    rentPrice: 9200,
    depositMonths: 2,
    desc: "Soyuducu anbar kompleksi"
  },

  {
    id: "bali_com_45",
    city: "bali",
    type: "commercial",
    name: "Retail Supply Warehouse",
    icon: "🏭",
    area: "suburban",
    m2: 1000,
    buyPrice: 560000,
    rentPrice: 9800,
    depositMonths: 2,
    desc: "Pərakəndə satış şəbəkələrinə təchizat"
  },

  {
    id: "bali_com_46",
    city: "bali",
    type: "commercial",
    name: "Bali Waterpark",
    icon: "🎢",
    area: "premium",
    m2: 3500,
    buyPrice: 4200000,
    rentPrice: 78000,
    depositMonths: 3,
    desc: "Adanın ən böyük su əyləncə parkı"
  },

  {
    id: "bali_com_47",
    city: "bali",
    type: "commercial",
    name: "Luxury Beach Club",
    icon: "🍾",
    area: "premium",
    m2: 1200,
    buyPrice: 2600000,
    rentPrice: 52000,
    depositMonths: 3,
    desc: "VIP turistlər üçün premium beach club"
  },

  {
    id: "bali_com_48",
    city: "bali",
    type: "commercial",
    name: "Adventure Tour Center",
    icon: "🚁",
    area: "premium",
    m2: 500,
    buyPrice: 950000,
    rentPrice: 18000,
    depositMonths: 3,
    desc: "Helikopter və macəra turları mərkəzi"
  },

  {
    id: "bali_com_49",
    city: "bali",
    type: "commercial",
    name: "Private Marina Office",
    icon: "⛵",
    area: "premium",
    m2: 800,
    buyPrice: 3800000,
    rentPrice: 72000,
    depositMonths: 3,
    desc: "Şəxsi yaxtalar üçün marina kompleksi"
  },

  {
    id: "bali_com_50",
    city: "bali",
    type: "commercial",
    name: "Exclusive Golf Club",
    icon: "⛳",
    area: "premium",
    m2: 5000,
    buyPrice: 6500000,
    rentPrice: 125000,
    depositMonths: 3,
    desc: "Premium üzvlük sistemli golf kompleksi"
  }
];

const PROPERTIES_DUBAI = [
  // ── EVLƏR (15 ədəd) ──

  {
    id: "dubai_apt_1",
    city: "dubai",
    type: "residential",
    name: "Downtown Dubai Burj View Apartment",
    icon: "🏙️",
    area: "premium",
    m2: 95,
    buyPrice: 420000,
    rentPrice: 3500,
    depositMonths: 3,
    desc: "95 m², 2 otaqlı, Burj Khalifa panoraması, mərkəz"
  },
  {
    id: "dubai_apt_2",
    city: "dubai",
    type: "residential",
    name: "Dubai Marina Sea View Studio",
    icon: "🌊",
    area: "premium",
    m2: 55,
    buyPrice: 280000,
    rentPrice: 2200,
    depositMonths: 2,
    desc: "55 m², studio, dəniz mənzərəli, Marina bölgəsi"
  },
  {
    id: "dubai_apt_3",
    city: "dubai",
    type: "residential",
    name: "Palm Jumeirah Luxury Apartment",
    icon: "🌴",
    area: "premium",
    m2: 120,
    buyPrice: 650000,
    rentPrice: 4800,
    depositMonths: 3,
    desc: "120 m², 3 otaqlı, Palm adası lüks yaşayış"
  },
  {
    id: "dubai_apt_4",
    city: "dubai",
    type: "residential",
    name: "Jumeirah Village Circle Flat",
    icon: "🏠",
    area: "mid",
    m2: 80,
    buyPrice: 180000,
    rentPrice: 1400,
    depositMonths: 2,
    desc: "80 m², 2 otaqlı, sakit ailə bölgəsi"
  },
  {
    id: "dubai_apt_5",
    city: "dubai",
    type: "residential",
    name: "Business Bay High Floor Apartment",
    icon: "🏢",
    area: "premium",
    m2: 100,
    buyPrice: 390000,
    rentPrice: 3100,
    depositMonths: 3,
    desc: "100 m², 2 otaqlı, biznes mərkəzində yüksək mərtəbə"
  },
  {
    id: "dubai_apt_6",
    city: "dubai",
    type: "residential",
    name: "Dubai Hills Family Apartment",
    icon: "🌿",
    area: "mid",
    m2: 110,
    buyPrice: 250000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "110 m², 3 otaqlı, park və yaşıl zona"
  },
  {
    id: "dubai_apt_7",
    city: "dubai",
    type: "residential",
    name: "Al Barsha Modern Flat",
    icon: "🏠",
    area: "mid",
    m2: 75,
    buyPrice: 160000,
    rentPrice: 1200,
    depositMonths: 2,
    desc: "75 m², 2 otaqlı, metro yaxınlığı"
  },
  {
    id: "dubai_apt_8",
    city: "dubai",
    type: "residential",
    name: "Dubai Creek Harbour Apartment",
    icon: "🌅",
    area: "premium",
    m2: 105,
    buyPrice: 410000,
    rentPrice: 3200,
    depositMonths: 3,
    desc: "105 m², modern kompleks, creek mənzərə"
  },
  {
    id: "dubai_apt_9",
    city: "dubai",
    type: "residential",
    name: "International City Budget Flat",
    icon: "🏢",
    area: "suburban",
    m2: 60,
    buyPrice: 90000,
    rentPrice: 700,
    depositMonths: 1,
    desc: "60 m², ucuz variant, investisiya üçün uyğun"
  },
  {
    id: "dubai_apt_10",
    city: "dubai",
    type: "residential",
    name: "Dubai Silicon Oasis Apartment",
    icon: "💻",
    area: "mid",
    m2: 85,
    buyPrice: 170000,
    rentPrice: 1300,
    depositMonths: 2,
    desc: "85 m², tech zone, sakit yaşayış"
  },
  {
    id: "dubai_apt_11",
    city: "dubai",
    type: "residential",
    name: "Meydan Luxury Residence",
    icon: "🏇",
    area: "premium",
    m2: 130,
    buyPrice: 520000,
    rentPrice: 3900,
    depositMonths: 3,
    desc: "130 m², yarış meydanı yaxınlığı, premium həyat"
  },
  {
    id: "dubai_apt_12",
    city: "dubai",
    type: "residential",
    name: "Dubai Sports City Apartment",
    icon: "⚽",
    area: "mid",
    m2: 90,
    buyPrice: 200000,
    rentPrice: 1500,
    depositMonths: 2,
    desc: "90 m², idman kompleksləri yaxınlığı"
  },
  {
    id: "dubai_apt_13",
    city: "dubai",
    type: "residential",
    name: "Discovery Gardens Flat",
    icon: "🌳",
    area: "suburban",
    m2: 70,
    buyPrice: 120000,
    rentPrice: 900,
    depositMonths: 2,
    desc: "70 m², yaşıl zona, ailə üçün uyğun"
  },
  {
    id: "dubai_apt_14",
    city: "dubai",
    type: "residential",
    name: "JLT Lake View Apartment",
    icon: "🏞️",
    area: "premium",
    m2: 95,
    buyPrice: 340000,
    rentPrice: 2700,
    depositMonths: 3,
    desc: "95 m², göl mənzərəli, yüksək bina"
  },
  {
    id: "dubai_apt_15",
    city: "dubai",
    type: "residential",
    name: "Arjan Affordable Apartment",
    icon: "🏠",
    area: "suburban",
    m2: 65,
    buyPrice: 110000,
    rentPrice: 850,
    depositMonths: 2,
    desc: "65 m², yeni inkişaf edən bölgə, ucuz seçim"
  },
  // ── EVLƏR (16–30) ──

  {
    id: "dubai_apt_16",
    city: "dubai",
    type: "residential",
    name: "Dubai Marina Luxury Highrise",
    icon: "🏙️",
    area: "premium",
    m2: 115,
    buyPrice: 480000,
    rentPrice: 3800,
    depositMonths: 3,
    desc: "115 m², 3 otaqlı, Marina panoraması, yüksək mərtəbə"
  },
  {
    id: "dubai_apt_17",
    city: "dubai",
    type: "residential",
    name: "Downtown Studio Near Burj Khalifa",
    icon: "🏢",
    area: "premium",
    m2: 50,
    buyPrice: 260000,
    rentPrice: 2100,
    depositMonths: 2,
    desc: "50 m², studio, Burj Khalifa 5 dəqiqəlik məsafə"
  },
  {
    id: "dubai_apt_18",
    city: "dubai",
    type: "residential",
    name: "Al Furjan Family Apartment",
    icon: "🏠",
    area: "mid",
    m2: 95,
    buyPrice: 190000,
    rentPrice: 1450,
    depositMonths: 2,
    desc: "95 m², 3 otaqlı, sakit ailə bölgəsi"
  },
  {
    id: "dubai_apt_19",
    city: "dubai",
    type: "residential",
    name: "JVC Budget Modern Flat",
    icon: "🏡",
    area: "mid",
    m2: 78,
    buyPrice: 165000,
    rentPrice: 1250,
    depositMonths: 2,
    desc: "78 m², 2 otaqlı, yeni tikili, əlverişli qiymət"
  },
  {
    id: "dubai_apt_20",
    city: "dubai",
    type: "residential",
    name: "Palm Jumeirah Sea Villa Apartment",
    icon: "🌴",
    area: "premium",
    m2: 140,
    buyPrice: 720000,
    rentPrice: 5200,
    depositMonths: 3,
    desc: "140 m², ultra lüks, dəniz birbaşa mənzərə"
  },
  {
    id: "dubai_apt_21",
    city: "dubai",
    type: "residential",
    name: "Dubai Hills Golf View Residence",
    icon: "⛳",
    area: "premium",
    m2: 125,
    buyPrice: 460000,
    rentPrice: 3400,
    depositMonths: 3,
    desc: "125 m², golf sahəsi mənzərəli lüks yaşayış"
  },
  {
    id: "dubai_apt_22",
    city: "dubai",
    type: "residential",
    name: "Silicon Oasis Tech Apartment",
    icon: "💻",
    area: "mid",
    m2: 88,
    buyPrice: 175000,
    rentPrice: 1350,
    depositMonths: 2,
    desc: "88 m², tech park yaxınlığı, rahat yaşayış"
  },
  {
    id: "dubai_apt_23",
    city: "dubai",
    type: "residential",
    name: "International City Affordable Unit",
    icon: "🏢",
    area: "suburban",
    m2: 62,
    buyPrice: 95000,
    rentPrice: 750,
    depositMonths: 1,
    desc: "62 m², ən ucuz investisiya variantı"
  },
  {
    id: "dubai_apt_24",
    city: "dubai",
    type: "residential",
    name: "Business Bay Canal View Flat",
    icon: "🌊",
    area: "premium",
    m2: 102,
    buyPrice: 395000,
    rentPrice: 3100,
    depositMonths: 3,
    desc: "102 m², kanal mənzərəli, biznes mərkəzi"
  },
  {
    id: "dubai_apt_25",
    city: "dubai",
    type: "residential",
    name: "JLT Modern Tower Apartment",
    icon: "🏙️",
    area: "premium",
    m2: 97,
    buyPrice: 360000,
    rentPrice: 2800,
    depositMonths: 3,
    desc: "97 m², göl ətrafı, yüksək mərtəbə"
  },
  {
    id: "dubai_apt_26",
    city: "dubai",
    type: "residential",
    name: "Arjan Budget Residence",
    icon: "🏠",
    area: "suburban",
    m2: 68,
    buyPrice: 115000,
    rentPrice: 900,
    depositMonths: 2,
    desc: "68 m², yeni layihə, ailə üçün uyğun"
  },
  {
    id: "dubai_apt_27",
    city: "dubai",
    type: "residential",
    name: "Meydan Skyline Apartment",
    icon: "🌇",
    area: "premium",
    m2: 130,
    buyPrice: 540000,
    rentPrice: 4100,
    depositMonths: 3,
    desc: "130 m², şəhər silueti mənzərəli lüks"
  },
  {
    id: "dubai_apt_28",
    city: "dubai",
    type: "residential",
    name: "Al Barsha Family Flat",
    icon: "🏡",
    area: "mid",
    m2: 82,
    buyPrice: 155000,
    rentPrice: 1200,
    depositMonths: 2,
    desc: "82 m², metro yaxınlığı, rahat yaşayış"
  },
  {
    id: "dubai_apt_29",
    city: "dubai",
    type: "residential",
    name: "Dubai Creek Harbour High Tower",
    icon: "🌅",
    area: "premium",
    m2: 110,
    buyPrice: 430000,
    rentPrice: 3300,
    depositMonths: 3,
    desc: "110 m², creek view, modern kompleks"
  },
  {
    id: "dubai_apt_30",
    city: "dubai",
    type: "residential",
    name: "Discovery Gardens Budget Flat",
    icon: "🌳",
    area: "suburban",
    m2: 72,
    buyPrice: 125000,
    rentPrice: 950,
    depositMonths: 2,
    desc: "72 m², yaşıl zona, ucuz və stabil seçim"
  },
const PROPERTIES_DUBAI_COMMERCIAL = [

  // ── OBYEKTLƏR (1–10) ──
  {
    id: "dubai_com_1",
    city: "dubai",
    type: "commercial",
    name: "Downtown Dubai Retail Shop",
    icon: "🏪",
    area: "premium",
    m2: 70,
    buyPrice: 310000,
    rentPrice: 4200,
    depositMonths: 3,
    desc: "70 m², turistik zona, yüksək piyada trafiki"
  },
  {
    id: "dubai_com_2",
    city: "dubai",
    type: "commercial",
    name: "Dubai Marina Cafe Space",
    icon: "☕",
    area: "premium",
    m2: 85,
    buyPrice: 280000,
    rentPrice: 3900,
    depositMonths: 3,
    desc: "85 m², Marina sahili, kafe üçün ideal"
  },
  {
    id: "dubai_com_3",
    city: "dubai",
    type: "commercial",
    name: "Business Bay Office Unit",
    icon: "🏢",
    area: "premium",
    m2: 95,
    buyPrice: 360000,
    rentPrice: 4500,
    depositMonths: 3,
    desc: "95 m², biznes mərkəzi, premium ofis"
  },
  {
    id: "dubai_com_4",
    city: "dubai",
    type: "commercial",
    name: "JLT Retail Store",
    icon: "🛍️",
    area: "premium",
    m2: 60,
    buyPrice: 240000,
    rentPrice: 3200,
    depositMonths: 3,
    desc: "60 m², göl ətrafı, yüksək axın"
  },
  {
    id: "dubai_com_5",
    city: "dubai",
    type: "commercial",
    name: "Deira Souk Shop",
    icon: "🏪",
    area: "mid",
    m2: 45,
    buyPrice: 120000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "45 m², köhnə bazar zonası, turistlər"
  },
  {
    id: "dubai_com_6",
    city: "dubai",
    type: "commercial",
    name: "Al Barsha Office Space",
    icon: "🏢",
    area: "mid",
    m2: 80,
    buyPrice: 190000,
    rentPrice: 2100,
    depositMonths: 2,
    desc: "80 m², metro yaxınlığı, rahat ofis"
  },
  {
    id: "dubai_com_7",
    city: "dubai",
    type: "commercial",
    name: "Palm Jumeirah Beach Kiosk",
    icon: "⛱️",
    area: "premium",
    m2: 20,
    buyPrice: 150000,
    rentPrice: 2500,
    depositMonths: 2,
    desc: "20 m², çimərlik turistik kiosk"
  },
  {
    id: "dubai_com_8",
    city: "dubai",
    type: "commercial",
    name: "Dubai Mall Nearby Shop",
    icon: "🛒",
    area: "premium",
    m2: 55,
    buyPrice: 330000,
    rentPrice: 5000,
    depositMonths: 3,
    desc: "55 m², mall yaxınlığı, premium satış"
  },
  {
    id: "dubai_com_9",
    city: "dubai",
    type: "commercial",
    name: "Silicon Oasis Office Unit",
    icon: "💻",
    area: "mid",
    m2: 75,
    buyPrice: 170000,
    rentPrice: 2000,
    depositMonths: 2,
    desc: "75 m², tech zone ofis sahəsi"
  },
  {
    id: "dubai_com_10",
    city: "dubai",
    type: "commercial",
    name: "International City Shop",
    icon: "🏪",
    area: "suburban",
    m2: 50,
    buyPrice: 90000,
    rentPrice: 1200,
    depositMonths: 1,
    desc: "50 m², ucuz investisiya obyekti"
  },

  // ── 11–20 ──
  {
    id: "dubai_com_11",
    city: "dubai",
    type: "commercial",
    name: "Dubai Marina Restaurant Unit",
    icon: "🍽️",
    area: "premium",
    m2: 110,
    buyPrice: 420000,
    rentPrice: 6000,
    depositMonths: 3,
    desc: "110 m², restoran üçün hazır sahə"
  },
  {
    id: "dubai_com_12",
    city: "dubai",
    type: "commercial",
    name: "JVC Small Retail Shop",
    icon: "🛍️",
    area: "mid",
    m2: 40,
    buyPrice: 110000,
    rentPrice: 1400,
    depositMonths: 2,
    desc: "40 m², yeni yaşayış kompleksi içi"
  },
  {
    id: "dubai_com_13",
    city: "dubai",
    type: "commercial",
    name: "Business Bay Co-working Space",
    icon: "💼",
    area: "premium",
    m2: 120,
    buyPrice: 480000,
    rentPrice: 7000,
    depositMonths: 3,
    desc: "120 m², coworking ofis sahəsi"
  },
  {
    id: "dubai_com_14",
    city: "dubai",
    type: "commercial",
    name: "Dubai Creek Cafe Spot",
    icon: "☕",
    area: "premium",
    m2: 65,
    buyPrice: 250000,
    rentPrice: 3500,
    depositMonths: 3,
    desc: "65 m², creek view kafe yeri"
  },
  {
    id: "dubai_com_15",
    city: "dubai",
    type: "commercial",
    name: "Deira Electronics Shop",
    icon: "📱",
    area: "mid",
    m2: 60,
    buyPrice: 140000,
    rentPrice: 2000,
    depositMonths: 2,
    desc: "60 m², elektronika satışı üçün"
  },
  {
    id: "dubai_com_16",
    city: "dubai",
    type: "commercial",
    name: "Al Quoz Warehouse Unit",
    icon: "📦",
    area: "suburban",
    m2: 300,
    buyPrice: 260000,
    rentPrice: 2800,
    depositMonths: 2,
    desc: "300 m², anbar və logistika sahəsi"
  },
  {
    id: "dubai_com_17",
    city: "dubai",
    type: "commercial",
    name: "Dubai Hills Retail Corner",
    icon: "🏪",
    area: "premium",
    m2: 70,
    buyPrice: 300000,
    rentPrice: 4000,
    depositMonths: 3,
    desc: "70 m², premium yaşayış kompleksi içi"
  },
  {
    id: "dubai_com_18",
    city: "dubai",
    type: "commercial",
    name: "JLT Office Room",
    icon: "🏢",
    area: "premium",
    m2: 90,
    buyPrice: 310000,
    rentPrice: 4200,
    depositMonths: 3,
    desc: "90 m², göl mənzərəli ofis"
  },
  {
    id: "dubai_com_19",
    city: "dubai",
    type: "commercial",
    name: "Dubai Sports City Shop",
    icon: "⚽",
    area: "mid",
    m2: 55,
    buyPrice: 150000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "55 m², idman zonası satış sahəsi"
  },
  {
    id: "dubai_com_20",
    city: "dubai",
    type: "commercial",
    name: "Arjan Street Retail Unit",
    icon: "🏪",
    area: "suburban",
    m2: 45,
    buyPrice: 95000,
    rentPrice: 1200,
    depositMonths: 1,
    desc: "45 m², yeni inkişaf edən zona"
  },

  // ── 21–30 ──
  {
    id: "dubai_com_21",
    city: "dubai",
    type: "commercial",
    name: "Downtown Luxury Boutique",
    icon: "🛍️",
    area: "premium",
    m2: 80,
    buyPrice: 380000,
    rentPrice: 5200,
    depositMonths: 3,
    desc: "80 m², lüks butik satış sahəsi"
  },
  {
    id: "dubai_com_22",
    city: "dubai",
    type: "commercial",
    name: "Marina Yacht Club Shop",
    icon: "⛵",
    area: "premium",
    m2: 60,
    buyPrice: 290000,
    rentPrice: 4000,
    depositMonths: 3,
    desc: "60 m², marina klub yaxınlığı"
  },
  {
    id: "dubai_com_23",
    city: "dubai",
    type: "commercial",
    name: "Silicon Oasis Tech Office",
    icon: "💻",
    area: "mid",
    m2: 85,
    buyPrice: 180000,
    rentPrice: 2200,
    depositMonths: 2,
    desc: "85 m², tech biznes ofisi"
  },
  {
    id: "dubai_com_24",
    city: "dubai",
    type: "commercial",
    name: "International City Grocery Shop",
    icon: "🛒",
    area: "suburban",
    m2: 70,
    buyPrice: 100000,
    rentPrice: 1300,
    depositMonths: 1,
    desc: "70 m², gündəlik market sahəsi"
  },
  {
    id: "dubai_com_25",
    city: "dubai",
    type: "commercial",
    name: "JVC Salon Space",
    icon: "💇",
    area: "mid",
    m2: 50,
    buyPrice: 130000,
    rentPrice: 1600,
    depositMonths: 2,
    desc: "50 m², gözəllik salonu üçün"
  },
  {
    id: "dubai_com_26",
    city: "dubai",
    type: "commercial",
    name: "Business Bay Fitness Studio",
    icon: "🏋️",
    area: "premium",
    m2: 140,
    buyPrice: 500000,
    rentPrice: 8000,
    depositMonths: 3,
    desc: "140 m², fitness studio üçün"
  },
  {
    id: "dubai_com_27",
    city: "dubai",
    type: "commercial",
    name: "Deira Gold Market Shop",
    icon: "💰",
    area: "mid",
    m2: 35,
    buyPrice: 200000,
    rentPrice: 3000,
    depositMonths: 2,
    desc: "35 m², qızıl bazarı içi mağaza"
  },
  {
    id: "dubai_com_28",
    city: "dubai",
    type: "commercial",
    name: "Al Barsha Clinic Unit",
    icon: "🏥",
    area: "mid",
    m2: 90,
    buyPrice: 210000,
    rentPrice: 2500,
    depositMonths: 2,
    desc: "90 m², klinika və tibbi ofis"
  },
  {
    id: "dubai_com_29",
    city: "dubai",
    type: "commercial",
    name: "Dubai Hills Bakery Space",
    icon: "🥐",
    area: "premium",
    m2: 65,
    buyPrice: 270000,
    rentPrice: 3800,
    depositMonths: 3,
    desc: "65 m², çörək və bakery biznesi"
  },
  {
    id: "dubai_com_30",
    city: "dubai",
    type: "commercial",
    name: "Palm Jumeirah Beach Café",
    icon: "🏖️",
    area: "premium",
    m2: 75,
    buyPrice: 450000,
    rentPrice: 6500,
    depositMonths: 3,
    desc: "75 m², çimərlik kafe sahəsi"
  },

  // ── 31–40 ──
  {
    id: "dubai_com_31",
    city: "dubai",
    type: "commercial",
    name: "Dubai Marina Barber Shop",
    icon: "💈",
    area: "premium",
    m2: 40,
    buyPrice: 220000,
    rentPrice: 3200,
    depositMonths: 3,
    desc: "40 m², yüksək trafik salon sahəsi"
  },
  {
    id: "dubai_com_32",
    city: "dubai",
    type: "commercial",
    name: "JLT Mini Market",
    icon: "🛒",
    area: "premium",
    m2: 55,
    buyPrice: 260000,
    rentPrice: 3700,
    depositMonths: 3,
    desc: "55 m², gündəlik satış üçün"
  },
  {
    id: "dubai_com_33",
    city: "dubai",
    type: "commercial",
    name: "Business Bay Luxury Office",
    icon: "🏢",
    area: "premium",
    m2: 130,
    buyPrice: 520000,
    rentPrice: 7500,
    depositMonths: 3,
    desc: "130 m², premium ofis sahəsi"
  },
  {
    id: "dubai_com_34",
    city: "dubai",
    type: "commercial",
    name: "Dubai Creek Retail Unit",
    icon: "🏪",
    area: "premium",
    m2: 75,
    buyPrice: 310000,
    rentPrice: 4200,
    depositMonths: 3,
    desc: "75 m², creek sahəsi mağaza"
  },
  {
    id: "dubai_com_35",
    city: "dubai",
    type: "commercial",
    name: "Al Quoz Art Studio",
    icon: "🎨",
    area: "mid",
    m2: 100,
    buyPrice: 180000,
    rentPrice: 2300,
    depositMonths: 2,
    desc: "100 m², sənət və studiya sahəsi"
  },
  {
    id: "dubai_com_36",
    city: "dubai",
    type: "commercial",
    name: "International City Restaurant",
    icon: "🍽️",
    area: "suburban",
    m2: 90,
    buyPrice: 120000,
    rentPrice: 1600,
    depositMonths: 1,
    desc: "90 m², ucuz restoran sahəsi"
  },
  {
    id: "dubai_com_37",
    city: "dubai",
    type: "commercial",
    name: "Dubai Sports City Gym",
    icon: "🏋️",
    area: "mid",
    m2: 150,
    buyPrice: 240000,
    rentPrice: 3000,
    depositMonths: 2,
    desc: "150 m², idman zalı üçün"
  },
  {
    id: "dubai_com_38",
    city: "dubai",
    type: "commercial",
    name: "JVC Coffee Shop",
    icon: "☕",
    area: "mid",
    m2: 45,
    buyPrice: 125000,
    rentPrice: 1500,
    depositMonths: 2,
    desc: "45 m², kafe biznesi üçün"
  },
  {
    id: "dubai_com_39",
    city: "dubai",
    type: "commercial",
    name: "Silicon Oasis Storefront",
    icon: "🏪",
    area: "mid",
    m2: 60,
    buyPrice: 140000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "60 m², texnologiya zonası"
  },
  {
    id: "dubai_com_40",
    city: "dubai",
    type: "commercial",
    name: "Downtown Dessert Shop",
    icon: "🍰",
    area: "premium",
    m2: 50,
    buyPrice: 300000,
    rentPrice: 4200,
    depositMonths: 3,
    desc: "50 m², desert və şirniyyat mağazası"
  },

  // ── 41–50 ──
  {
    id: "dubai_com_41",
    city: "dubai",
    type: "commercial",
    name: "Marina Fast Food Unit",
    icon: "🍔",
    area: "premium",
    m2: 65,
    buyPrice: 280000,
    rentPrice: 4100,
    depositMonths: 3,
    desc: "65 m², fast food üçün ideal"
  },
  {
    id: "dubai_com_42",
    city: "dubai",
    type: "commercial",
    name: "Al Barsha Pharmacy Unit",
    icon: "💊",
    area: "mid",
    m2: 70,
    buyPrice: 160000,
    rentPrice: 2000,
    depositMonths: 2,
    desc: "70 m², aptek biznesi"
  },
  {
    id: "dubai_com_43",
    city: "dubai",
    type: "commercial",
    name: "JLT Spa Center",
    icon: "🧖",
    area: "premium",
    m2: 95,
    buyPrice: 350000,
    rentPrice: 5000,
    depositMonths: 3,
    desc: "95 m², spa və wellness mərkəzi"
  },
  {
    id: "dubai_com_44",
    city: "dubai",
    type: "commercial",
    name: "Dubai Hills Nursery Shop",
    icon: "🌿",
    area: "premium",
    m2: 80,
    buyPrice: 290000,
    rentPrice: 3900,
    depositMonths: 3,
    desc: "80 m², uşaq və bağça məhsulları"
  },
  {
    id: "dubai_com_45",
    city: "dubai",
    type: "commercial",
    name: "Business Bay Law Office",
    icon: "⚖️",
    area: "premium",
    m2: 110,
    buyPrice: 410000,
    rentPrice: 6000,
    depositMonths: 3,
    desc: "110 m², hüquq ofisi"
  },
  {
    id: "dubai_com_46",
    city: "dubai",
    type: "commercial",
    name: "Deira Textile Shop",
    icon: "🧵",
    area: "mid",
    m2: 65,
    buyPrice: 135000,
    rentPrice: 1800,
    depositMonths: 2,
    desc: "65 m², tekstil mağazası"
  },
  {
    id: "dubai_com_47",
    city: "dubai",
    type: "commercial",
    name: "Palm Jumeirah Ice Cream Shop",
    icon: "🍦",
    area: "premium",
    m2: 40,
    buyPrice: 260000,
    rentPrice: 3800,
    depositMonths: 3,
    desc: "40 m², desert və turist zonası"
  },
  {
    id: "dubai_com_48",
    city: "dubai",
    type: "commercial",
    name: "Dubai Marina Travel Agency",
    icon: "✈️",
    area: "premium",
    m2: 55,
    buyPrice: 240000,
    rentPrice: 3500,
    depositMonths: 3,
    desc: "55 m², turizm agentliyi"
  },
  {
    id: "dubai_com_49",
    city: "dubai",
    type: "commercial",
    name: "International City Laundry Shop",
    icon: "🧺",
    area: "suburban",
    m2: 50,
    buyPrice: 85000,
    rentPrice: 1100,
    depositMonths: 1,
    desc: "50 m², laundry biznesi"
  },
  {
    id: "dubai_com_50",
    city: "dubai",
    type: "commercial",
    name: "Downtown Luxury Jewelry Store",
    icon: "💎",
    area: "premium",
    m2: 60,
    buyPrice: 500000,
    rentPrice: 8000,
    depositMonths: 3,
    desc: "60 m², yüksək səviyyəli zərgərlik mağazası"
  }
];

   
// Bütün əmlakları şəhərə görə topla
const ALL_PROPERTIES = {
  baku: PROPERTIES_BAKU,
  bali: PROPERTIES_BALI,
  dubai: PROPERTIES_DUBAI
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
