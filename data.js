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


/* ── APPLIX ── */
  {
    assetId: "applix",
    title: "Applix yeni AX Ultra seriyasını təqdim etdi",
    text: "Şirkət ən son prosessor və ekran texnologiyaları ilə təchiz olunmuş yeni flaqman cihazlarını rəsmi olaraq elan etdi.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "applix",
    title: "Applix rekord satış nəticələri açıqladı",
    text: "Bayram mövsümündə iPhone ekvivalenti cihazların satışları analitiklərin proqnozlarını 19% ötdü.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "applix",
    title: "ABŞ və Çin arasındakı gərginlik Applix-i vurdu",
    text: "Şirkətin əsas istehsal zəncirinin böyük hissəsi Çində yerləşdiyindən yeni tariflər səbəbindən ciddi risk yaranıb.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "applix",
    title: "Applix xidmətlər bölməsi güclü artım göstərdi",
    text: "Applix Music, Applix TV və bulud xidmətlərinin abunə sayı ildən-ilə 28% artıb.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/play-circle.svg?color=%235AA9FF"
  },
  {
    assetId: "applix",
    title: "Avropa İttifaqı Applix-ə böyük cərimə kəsdi",
    text: "İnhisarçılıq qaydalarının pozulmasına görə şirkətə 1.8 milyard avro cərimə tətbiq olundu.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "applix",
    title: "Applix avtomobil sənayesi ilə əməkdaşlığı genişləndirdi",
    text: "Bir neçə böyük avtomobil istehsalçısı ilə avtomobil üçün infotainment sistemləri üzrə uzunmüddətli müqavilə imzalanıb.",
    impact: 0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/car.svg?color=%235AA9FF"
  },
  {
    assetId: "applix",
    title: "Applix-də təhlükəsizlik boşluğu aşkarlandı",
    text: "Milyonlarla istifadəçinin məlumatlarını təsir edə biləcək ciddi bir kiber təhlükəsizlik qüsuru aşkarlanıb.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "applix",
    title: "Applix səhmdarlara böyük geri alıb proqramı elan etdi",
    text: "Şirkət 50 milyard dollar dəyərində öz səhmlərini geri almaq planını açıqladı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "applix",
    title: "Analitiklər Applix səhmlərini aşağı qiymətləndirdi",
    text: "Böyük investisiya bankı qiymətin həddindən artıq yüksək olduğunu bildirərək satış tövsiyəsi verdi.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "applix",
    title: "Applix süni zəka xüsusiyyətlərində böyük irəliləyiş əldə etdi",
    text: "Yeni əməliyyat sistemi yeniləməsində daxili AI modelləri istifadəçilər tərəfindən yüksək qiymətləndirildi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },


/* ── GOOLGEX ── */
  {
    assetId: "goolgex",
    title: "Goolgex yeni Gemini Ultra modelini təqdim etdi",
    text: "Şirkətin ən güclü süni zəka modeli rəsmi olaraq istifadəyə verildi. Axtarış və məzmun yaratma sahəsində böyük üstünlük gözlənilir.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "goolgex",
    title: "Goolgex reklam gəlirləri rekord həddə çatdı",
    text: "Son rübdə axtarış və YouTube reklam gəlirləri analitiklərin proqnozlarını 17% ötdü.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "goolgex",
    title: "ABŞ anti-inhisar iddiası Goolgex-i hədəf aldı",
    text: "Hökumət şirkətin axtarış bazarındakı dominant mövqeyinə görə böyük məhkəmə prosesi başlatdı.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "goolgex",
    title: "Goolgex Cloud xidmətlərində güclü artım",
    text: "Bulud infrastrukturu bölməsi ildən-ilə 31% böyüyərək şirkətin ən sürətli inkişaf edən sahəsinə çevrildi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/server.svg?color=%235AA9FF"
  },
  {
    assetId: "goolgex",
    title: "Avropa İttifaqı Goolgex-ə rekord cərimə kəsdi",
    text: "İstifadəçi məlumatlarının qorunması qaydalarını pozduğuna görə 2.3 milyard avro cərimə tətbiq edildi.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "goolgex",
    title: "Goolgex yeni Wearable cihaz seriyasını elan etdi",
    text: "Ağıllı saat və qulaqlıq seqmentində rəqiblərə qarşı güclü rəqabət yaratmaq üçün yeni məhsullar təqdim olundu.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/watch.svg?color=%235AA9FF"
  },
  {
    assetId: "goolgex",
    title: "Goolgex-də kütləvi işçi ixtisarı dalğası",
    text: "Şirkət xərcləri optimallaşdırmaq məqsədilə 12.000 əməkdaşını ixtisar edəcəyini açıqladı.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "goolgex",
    title: "Goolgex böyük şirkəti satın aldı",
    text: "Süni zəka startaplarından birini 18 milyard dollara satın alaraq AI sahəsindəki mövqeyini daha da möhkəmləndirdi.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%231FD67A"
  },
  {
    assetId: "goolgex",
    title: "Böyük bank Goolgex səhmlərini satışa tövsiyə etdi",
    text: "Reklam gəlirlərinin artım tempinin yavaşlayacağını proqnozlaşdıraraq qiymətləndirməni aşağı saldı.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "goolgex",
    title: "Goolgex quantum hesablama sahəsində irəliləyiş əldə etdi",
    text: "Yeni nəsil kvant prosessoru ilə bağlı tədqiqat nəticələri elmi ictimaiyyətdə geniş rezonans doğurdu.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
/* ── MEKROSOFT ── */
  {
    assetId: "mekrosoft",
    title: "Mekrosoft Azure bulud xidmətlərində rekord artım elan etdi",
    text: "Şirkətin bulud infrastrukturu bölməsi son rübdə 29% böyüyərək ən güclü nəticəni göstərdi.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/server.svg?color=%235AA9FF"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft Office AI xüsusiyyətləri ilə böyük uğur qazandı",
    text: "Copilot funksiyalarının inteqrasiyası istifadəçi sayını və gəlirləri əhəmiyyətli dərəcədə artırdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%231FD67A"
  },
  {
    assetId: "mekrosoft",
    title: "ABŞ anti-inhisar iddiası Mekrosoft-u ağır zərbə vurdu",
    text: "Şirkətin Activision Blizzard və digər satınalmalarına görə hökumət ciddi məhdudiyyətlər tətbiq etməyi planlaşdırır.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft yeni Windows nəslini təqdim etdi",
    text: "Windows 12 rəsmi olaraq elan edildi. Süni zəka ilə dərin inteqrasiya istifadəçilər tərəfindən yüksək qiymətləndirildi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/laptop.svg?color=%235AA9FF"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft kütləvi işçi ixtisarı keçirir",
    text: "Şirkət xərcləri azaltmaq məqsədilə 10.000-dən çox əməkdaşını ixtisar edəcəyini açıqladı.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft böyük oyun studiyasını satın aldı",
    text: "18 milyard dollarlıq yeni satınalma ilə oyun sektorundakı mövqeyini gücləndirdi.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/gamepad-2.svg?color=%231FD67A"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft serverlərində böyük kiber hücum baş verdi",
    text: "Hacker qrupu milyonlarla istifadəçinin məlumatlarına giriş əldə etdi, bu da şirkətə ciddi zərər vurdu.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft səhmdarlara böyük dividend artırdı",
    text: "Rüblük dividend məbləğini 18% artıraraq investorlara güclü siqnal verdi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "mekrosoft",
    title: "Analitiklər Mekrosoft-u satış tövsiyəsi ilə qiymətləndirdi",
    text: "Bulud artım tempinin yavaşlayacağını proqnozlaşdıraraq səhmin qiymət hədəfini aşağı saldı.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "mekrosoft",
    title: "Mekrosoft və OpenAI əməkdaşlığı genişlənir",
    text: "Yeni nəsil süni zəka modelləri üçün 10 milyard dollarlıq investisiya razılaşması imzalanıb.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },


/* ── AMAZAN ── */
  {
    assetId: "amazan",
    title: "Amazan yeni logistika və dron çatdırılma sistemini təqdim etdi",
    text: "Şirkət tam avtomatlaşdırılmış anbarlar və dronlarla çatdırılma şəbəkəsini genişləndirdiyini elan etdi.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/package.svg?color=%235AA9FF"
  },
  {
    assetId: "amazan",
    title: "Amazan rekord rüb satış nəticələri göstərdi",
    text: "Bayram mövsümündə onlayn satışlar analitiklərin gözləntilərini 21% ötdü.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "amazan",
    title: "ABŞ anti-inhisar araşdırması Amazan-ı hədəf aldı",
    text: "Şirkətin bazar dominantlığı səbəbindən hökumət böyük məhkəmə prosesinə başladı.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "amazan",
    title: "Amazan Web Services (AWS) buludda güclü artım",
    text: "Bulud xidmətləri bölməsi ildən-ilə 26% böyüyərək şirkətin ən gəlirli seqmentinə çevrildi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/server.svg?color=%235AA9FF"
  },
  {
    assetId: "amazan",
    title: "Amazan işçilərə maaş artımı və benefislər elan etdi",
    text: "Şirkət əməkdaşlarının maaşlarını orta hesabla 12% artırdı.",
    impact: 0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%231FD67A"
  },
  {
    assetId: "amazan",
    title: "Amazan Çindəki anbarlarına yeni tariflər tətbiq olundu",
    text: "Ticarət gərginliyi səbəbindən idxal xərcləri kəskin artdı.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/truck.svg?color=%23FF4C5E"
  },
  {
    assetId: "amazan",
    title: "Amazan böyük tibbi e-ticarət şirkətini satın aldı",
    text: "Sağlamlıq məhsulları sektoruna güclü giriş etmək üçün 14 milyard dollarlıq satınalma həyata keçirdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "amazan",
    title: "Amazan-də kiber hücum nəticəsində məlumat sızması",
    text: "Milyonlarla müştəri məlumatı risk altında qaldı.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "amazan",
    title: "Böyük investisiya bankı Amazan-ı satışa tövsiyə etdi",
    text: "Qiymətin həddindən artıq yüksək olduğunu bildiriblər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "amazan",
    title: "Amazan süni zəka ilə idarə olunan anbarlarını genişləndirdi",
    text: "Robotlaşdırma və AI texnologiyaları sayəsində çatdırılma sürəti 40% yaxşılaşdı.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── METASPACE ── */
  {
    assetId: "metaspace",
    title: "Metaspace yeni VR/AR cihazını təqdim etdi",
    text: "Növbəti nəsil Quest seriyası rəsmi olaraq elan edildi. İstifadəçilər arasında böyük maraq yarandı.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/headphones.svg?color=%235AA9FF"
  },
  {
    assetId: "metaspace",
    title: "Metaspace reklam gəlirləri güclü artım göstərdi",
    text: "Instagram və Facebook platformalarında reklam gəlirləri proqnozdan 18% çox oldu.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "metaspace",
    title: "Metaspace-ə böyük anti-inhisar cəriməsi",
    text: "Avropa İttifaqı şirkətə istifadəçi məlumatlarının sui-istifadəsinə görə 2.1 milyard avro cərimə kəsdi.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "metaspace",
    title: "Metaspace Threads platforması sürətlə böyüyür",
    text: "Yeni sosial şəbəkə istifadəçi sayı 200 milyonu keçdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%235AA9FF"
  },
  {
    assetId: "metaspace",
    title: "Metaspace-də kütləvi işçi ixtisarı",
    text: "Şirkət xərcləri optimallaşdırmaq üçün 15% əməkdaşlarını ixtisar etdi.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "metaspace",
    title: "Metaspace yeni AI avatar və metaverse xüsusiyyətləri elan etdi",
    text: "Virtual reallıq təcrübəsini daha da inkişaf etdirən yeniliklər istifadəçilər tərəfindən bəyənildi.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "metaspace",
    title: "Metaspace-ə qarşı böyük məlumat sızması iddiası",
    text: "Milyonlarla istifadəçinin şəxsi məlumatları risk altında qaldı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "metaspace",
    title: "Metaspace səhmdarlara xüsusi dividend proqramı başladı",
    text: "Güclü nağd pul ehtiyatı sayəsində investorlara əlavə gəlir vədi verdi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "metaspace",
    title: "Analitiklər Metaspace səhmlərini aşağı qiymətləndirdi",
    text: "Metaverse investisiyalarının gəlirliyinin aşağı olduğunu bildiriblər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "metaspace",
    title: "Metaspace böyük oyun şirkəti ilə əməkdaşlıq elan etdi",
    text: "Virtual reallıq oyunları üçün strateji tərəfdaşlıq razılaşması imzalanıb.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gamepad-2.svg?color=%235AA9FF"
  },
/* ── INTELL ── */
  {
    assetId: "intell",
    title: "Intell yeni nəsil prosessor seriyasını elan etdi",
    text: "Intel-in yeni Core Ultra 3 arxitekturası rəsmi olaraq təqdim olundu. Performans və enerji səmərəliliyi rekord səviyyədədir.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "intell",
    title: "Intell server çiplərində güclü satış artımı",
    text: "Data mərkəzləri üçün yeni nəsil çiplərə tələbat proqnozdan yüksək oldu.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "intell",
    title: "ABŞ-Çin ixrac məhdudiyyəti Intelle ağır zərbə vurdu",
    text: "Şirkətin ən son texnologiyalarının Çinə satışı ciddi məhdudlaşdırıldı.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "intell",
    title: "Intell Foundry biznesi sürətlə böyüyür",
    text: "Üçüncü tərəf çip istehsalı bölməsi ildən-ilə 35% artım göstərdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/factory.svg?color=%235AA9FF"
  },
  {
    assetId: "intell",
    title: "Intell kütləvi işçi ixtisarı planını açıqladı",
    text: "Şirkət xərcləri azaltmaq üçün 11% əməkdaşlarını ixtisar edəcək.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "intell",
    title: "Intell və böyük bulud şirkəti ilə strateji müqavilə",
    text: "Növbəti 5 il üçün böyük həcmli çip tədarükü razılaşması imzalanıb.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "intell",
    title: "Intell prosessorlarında ciddi təhlükəsizlik qüsuru aşkarlandı",
    text: "Bəzi modellərdə kiber hücumlara qarşı zəiflik müəyyən edilib.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "intell",
    title: "Intell səhmdarlara xüsusi dividend elan etdi",
    text: "Güclü nağd pul ehtiyatı sayəsində investorlara əlavə ödəniş vədi verdi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "intell",
    title: "Böyük bank Intelle satış tövsiyəsi verdi",
    text: "Rəqabətin gücləndiyini və bazar payının azaldığını bildiriblər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "intell",
    title: "Intell AI accelerator bazarına güclü giriş etdi",
    text: "Yeni Gaudi 3 seriyası rəqiblərə ciddi təzyiq yaradır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── SAMZUNG ── */
  {
    assetId: "samzung",
    title: "Samzung Galaxy S Ultra seriyasını təqdim etdi",
    text: "Yeni flaqman telefonlar qatlanan ekran və güclü kamera ilə bazara çıxdı.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "samzung",
    title: "Samzung yaddaş çiplərində rekord satış",
    text: "HBM yaddaşlarına tələbat süni zəka bumuna görə kəskin artıb.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%231FD67A"
  },
  {
    assetId: "samzung",
    title: "ABŞ və Çin gərginliyi Samzung-a zərər verdi",
    text: "Şirkətin qlobal təchizat zənciri ciddi risk altında qaldı.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "samzung",
    title: "Samzung OLED ekran texnologiyasında liderliyini artırdı",
    text: "Yeni nəsil qatlanan ekranlar rəqiblərdən üstün qiymətləndirildi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/tv.svg?color=%235AA9FF"
  },
  {
    assetId: "samzung",
    title: "Samzung-ə Avropada anti-inhisar araşdırması başladı",
    text: "Mobil və yaddaş bazarındakı dominant mövqeyinə görə araşdırma açıldı.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "samzung",
    title: "Samzung avtomobil hissələri biznesini genişləndirdi",
    text: "Elektrik avtomobillər üçün batareya və sensor texnologiyalarında böyük müqavilələr imzalanıb.",
    impact: 0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/car.svg?color=%235AA9FF"
  },
  {
    assetId: "samzung",
    title: "Samzung-də kütləvi işçi ixtisarı dalğası",
    text: "Şirkət qlobal olaraq 8000 əməkdaşını ixtisar edəcəyini açıqladı.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "samzung",
    title: "Samzung səhmdarlara böyük geri alıb proqramı elan etdi",
    text: "50 milyard dollar dəyərində öz səhmlərini geri alma planı investorları sevindirdi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "samzung",
    title: "Analitiklər Samzung səhmlərini satışa tövsiyə etdi",
    text: "Rəqabətin gücləndiyini və marjanın aşağı düşdüyünü qeyd etdilər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "samzung",
    title: "Samzung süni zəka ilə idarə olunan ev cihazları seriyasını çıxardı",
    text: "Yeni ağıllı ev ekosistemi böyük maraq doğurdu.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/home.svg?color=%235AA9FF"
  },

  /* ── TSUMU ── */
  {
    assetId: "tsumu",
    title: "Tsumu yeni nəsil yarıiletken avadanlıqlarını təqdim etdi",
    text: "3nm proses texnologiyası ilə istehsal olunan yeni maşınlar böyük sifarişlər aldı.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "tsumu",
    title: "Tsumu rekord sifariş portfeli elan etdi",
    text: "Böyük müştərilərdən alınan yeni sifarişlər şirkətin gələcək illər üçün yükünü təmin etdi.",
    impact: 0.11,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "tsumu",
    title: "ABŞ ixrac nəzarəti Tsumu-nu ağır vurdu",
    text: "Ən qabaqcıl avadanlıqların Çinə satışı qadağan edildi.",
    impact: -0.40,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "tsumu",
    title: "Tsumu yeni fabriklər tikintisini sürətləndirdi",
    text: "ABŞ və Avropada yeni istehsal müəssisələri üçün böyük investisiya elan edildi.",
    impact: 0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/factory.svg?color=%235AA9FF"
  },
  {
    assetId: "tsumu",
    title: "Tsumu təchizat zəncirində problemlər yaşayır",
    text: "Bəzi xammal çatışmazlığı səbəbindən istehsal tempini aşağı salmalı oldu.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/truck.svg?color=%23FF4C5E"
  },
  {
    assetId: "tsumu",
    title: "Tsumu böyük müştəri ilə uzunmüddətli müqavilə imzaladı",
    text: "Nvdai ilə oxşar böyük bir şirkətlə 7 illik avadanlıq tədarükü razılaşması oldu.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "tsumu",
    title: "Tsumu-də kütləvi işçi ixtisarı",
    text: "Avtomatlaşdırma səbəbindən 6000 əməkdaş ixtisar olunacaq.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "tsumu",
    title: "Tsumu səhmdarlara xüsusi buyback proqramı başladı",
    text: "Güclü balans hesabı sayəsində 8 milyard dollarlıq səhm geri alışı elan edildi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "tsumu",
    title: "Analitiklər Tsumu səhmlərini neytral vəziyyətə endirdi",
    text: "Geosiyasi risklərin artığını qeyd etdilər.",
    impact: -0.05,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "tsumu",
    title: "Tsumu süni zəka çip istehsalı avadanlıqlarında irəliləyiş əldə etdi",
    text: "Yeni maşınlar yüksək performanslı AI çiplərinin istehsalını sürətləndirəcək.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

/* ── ORAKL ── */
  {
    assetId: "orakl",
    title: "Orakl yeni bulud və verilənlər bazası platformasını təqdim etdi",
    text: "Şirkətin ən son OCI nəsli müştərilər tərəfindən böyük maraqla qarşılandı.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/database.svg?color=%235AA9FF"
  },
  {
    assetId: "orakl",
    title: "Orakl rekord gəlir və bulud artımı elan etdi",
    text: "Bulud xidmətləri ildən-ilə 32% böyüyərək şirkətin əsas gəlir mənbəyinə çevrildi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "orakl",
    title: "ABŞ hökuməti Orakl-ın Çin müştərilərinə satışını məhdudlaşdırdı",
    text: "Geosiyasi gərginlik şirkətin Asiya bazarındakı gəlirlərini kəskin azaldıb.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "orakl",
    title: "Orakl böyük bankla 10 illik strateji müqavilə imzaladı",
    text: "Maliyyə sektoru üçün xüsusi bulud həlləri təmin edəcək.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "orakl",
    title: "Orakl kütləvi işçi ixtisarı keçirir",
    text: "Şirkət xərcləri optimallaşdırmaq üçün 9000 əməkdaşını ixtisar edəcək.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "orakl",
    title: "Orakl süni zəka ilə inteqrasiya olunmuş ERP sistemini yenilədi",
    text: "Yeni versiya müştərilər tərəfindən yüksək qiymətləndirildi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "orakl",
    title: "Orakl-ə qarşı anti-inhisar araşdırması başladı",
    text: "Verilənlər bazası bazarındakı dominant mövqeyi səbəbindən araşdırma açıldı.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "orakl",
    title: "Orakl səhmdarlara böyük dividend artırdı",
    text: "Rüblük dividend 15% yüksəldildi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "orakl",
    title: "Analitiklər Orakl səhmlərini satış tövsiyəsi etdi",
    text: "Böyük bulud rəqabətinin artığını qeyd etdilər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "orakl",
    title: "Orakl yeni AI bulud xidmətini bazara çıxardı",
    text: "Müştərilərə xüsusi süni zəka modelləri üçün güclü infrastruktur təklif edir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── JPMORQ ── */
  {
    assetId: "jpmorq",
    title: "JPMorq rekord mənfəət hesabatını açıqladı",
    text: "İnvestisiya bankçılığı və ticarət bölmələri güclü nəticə göstərdi.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%235AA9FF"
  },
  {
    assetId: "jpmorq",
    title: "JPMorq faiz dərəcələrindən böyük gəlir əldə etdi",
    text: "Yüksək faiz mühiti bankın xalis faiz gəlirini əhəmiyyətli dərəcədə artırdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/dollar-sign.svg?color=%231FD67A"
  },
  {
    assetId: "jpmorq",
    title: "ABŞ tənzimləyiciləri JPMorq-a böyük cərimə kəsdi",
    text: "Keçmiş əməliyyatlar üzrə araşdırma nəticəsində 1.1 milyard dollar cərimə tətbiq edildi.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "jpmorq",
    title: "JPMorq texnologiya startaplarına böyük investisiya etdi",
    text: "Fintech sektorunda əhəmiyyətli alışlar həyata keçirdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "jpmorq",
    title: "JPMorq işçi ixtisarlarına başladı",
    text: "İdarəetmə xərclərini azaltmaq üçün minlərlə əməkdaş ixtisar olunacaq.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "jpmorq",
    title: "JPMorq kripto xidmətlərini genişləndirdi",
    text: "Zəngin müştərilər üçün yeni rəqəmsal aktiv platforması istifadəyə verildi.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "jpmorq",
    title: "İqtisadi resessiya qorxusu JPMorq-a zərər verdi",
    text: "Kredit risklərinin artması səhmdarları narahat etdi.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "jpmorq",
    title: "JPMorq səhmdarlara böyük dividend və buyback elan etdi",
    text: "Güclü kapital mövqeyi investorlara inam verdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "jpmorq",
    title: "Analitiklər JPMorq səhmlərini neytral vəziyyətə endirdi",
    text: "Faiz dərəcələrinin aşağı düşəcəyini proqnozlaşdırırlar.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "jpmorq",
    title: "JPMorq yaşıl enerji layihələrinə böyük kredit ayırdı",
    text: "Dayanıqlı inkişaf sahəsində lider mövqeyini möhkəmləndirdi.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },

  /* ── GOLDMAX ── */
  {
    assetId: "goldmax",
    title: "Goldmax Sachs güclü investisiya bankçılığı nəticələri göstərdi",
    text: "Mergers & Acquisitions bölməsi rekord aktivlik yaşadı.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%235AA9FF"
  },
  {
    assetId: "goldmax",
    title: "Goldmax IPO bazarında liderliyini davam etdirir",
    text: "Bir neçə böyük şirkətin səhm yerləşdirilməsini idarə etdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/chart-bar.svg?color=%231FD67A"
  },
  {
    assetId: "goldmax",
    title: "Goldmax-ə böyük tənzimləyici cərimə tətbiq edildi",
    text: "Keçmiş müştəri əməliyyatları ilə bağlı araşdırma nəticəsində ağır cəza aldı.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "goldmax",
    title: "Goldmax kripto və rəqəmsal aktivlər bölməsini genişləndirdi",
    text: "Yeni xidmətlər zəngin müştərilər üçün istifadəyə verildi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "goldmax",
    title: "Goldmax işçi sayını optimallaşdırır",
    text: "Bir neçə departamentdə ixtisarlar elan edildi.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "goldmax",
    title: "Goldmax Asiya bazarında böyük genişlənmə planı açıqladı",
    text: "Honq Konq və Sinqapurda yeni ofislər açacaq.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/globe.svg?color=%235AA9FF"
  },

  /* ── BANKAMR ── */
  {
    assetId: "bankamr",
    title: "Banka Merikal güclü kredit portfel artımı göstərdi",
    text: "İstehlak və korporativ kreditlər rekord səviyyəyə çatdı.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%235AA9FF"
  },
  {
    assetId: "bankamr",
    title: "Bankamr yeni rəqəmsal bank platformasını istifadəyə verdi",
    text: "Müştəri təcrübəsini yaxşılaşdıran yeniliklər böyük maraq doğurdu.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "bankamr",
    title: "İpoteka böhranı Bankamr-a zərər vurdu",
    text: "Kredit keyfiyyətinin pisləşməsi səbəbindən böyük ehtiyat yaradıldı.",
    impact: -0.35,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },

  /* ── WELLSF ── */
  {
    assetId: "wellsf",
    title: "Wellsford Bank güclü nağd pul axını nəticələri elan etdi",
    text: "Ənənəvi bankçılıq əməliyyatları yüksək gəlir gətirdi.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%235AA9FF"
  },
  {
    assetId: "wellsf",
    title: "Wellsford müştəri xidmətlərində rəqəmsallaşmanı sürətləndirdi",
    text: "Yeni mobil tətbiq istifadəçi sayını əhəmiyyətli dərəcədə artırdı.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "wellsf",
    title: "Wellsford-ə qarşı böyük şikayət və cərimə",
    text: "Müştəri hesablarının idarə olunmasında pozuntular aşkarlandı.",
    impact: -0.34,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },

  /* ── VIZA ── */
  {
    assetId: "viza",
    title: "Viza qlobal ödəniş həcmlərində rekord artım elan etdi",
    text: "Rəqəmsal ödənişlər və kart əməliyyatları kəskin artıb.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/credit-card.svg?color=%235AA9FF"
  },
  {
    assetId: "viza",
    title: "Viza yeni kripto ödəniş inteqrasiyasını təqdim etdi",
    text: "Böyük ticarət şəbəkələri ilə razılaşmalar imzalanıb.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "viza",
    title: "Avropa İttifaqı Viza-ya anti-inhisar cəriməsi kəsdi",
    text: "Ödəniş bazarındakı mövqeyinə görə böyük cəza tətbiq edildi.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  }, 



/* ── GOLDMAX ── (yeni 4 xəbər) */
  {
    assetId: "goldmax",
    title: "Goldmax səhmdarlara böyük buyback elan etdi",
    text: "12 milyard dollar dəyərində səhm geri alışı planlaşdırılır.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "goldmax",
    title: "Analitiklər Goldmax-ə satış tövsiyəsi verdi",
    text: "Bazar şərtlərinin pisləşdiyini qeyd etdilər.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "goldmax",
    title: "Goldmax yaşıl maliyyə layihələrinə böyük kredit ayırdı",
    text: "Dayanıqlı inkişaf sahəsində liderliyini artırdı.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },
  {
    assetId: "goldmax",
    title: "Goldmax texnologiya şirkətlərinə investisiyasını artırdı",
    text: "Fintech startaplarına yeni fond ayırdı.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },

  /* ── BANKAMR ── (yeni 7 xəbər) */
  {
    assetId: "bankamr",
    title: "Bankamr səhmdarlara dividend artırdı",
    text: "Güclü maliyyə nəticələri investorlara inam verdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "bankamr",
    title: "Bankamr işçi ixtisarları keçirir",
    text: "Xərcləri azaltmaq üçün optimallaşdırma aparılır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "bankamr",
    title: "Bankamr fintech startapını satın aldı",
    text: "Rəqəmsal bankçılıq sahəsində mövqeyini gücləndirdi.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "bankamr",
    title: "İqtisadi yavaşlama Bankamr-ın kredit risklərini artırdı",
    text: "Analitiklər narahatlığını ifadə etdi.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "bankamr",
    title: "Bankamr Asiya bazarına genişlənmə planı açıqladı",
    text: "Yeni ölkələrdə filiallar açılacaq.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/globe.svg?color=%235AA9FF"
  },
  {
    assetId: "bankamr",
    title: "Analitiklər Bankamr səhmlərini neytral qiymətləndirdi",
    text: "Faiz dərəcələrinin düşəcəyini proqnozlaşdırırlar.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "bankamr",
    title: "Bankamr yaşıl maliyyə layihələrinə böyük investisiya etdi",
    text: "Dayanıqlı inkişaf istiqamətində addımlar atdı.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },

  /* ── WELLSF ── (yeni 7 xəbər) */
  {
    assetId: "wellsf",
    title: "Wellsford səhmdarlara dividend artırdı",
    text: "Güclü kapital mövqeyi investorları razı saldı.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "wellsf",
    title: "Wellsford işçi ixtisarları planını açıqladı",
    text: "Xərcləri optimallaşdırmaq məqsədi daşıyır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "wellsf",
    title: "Wellsford ipoteka və kredit satışlarını artırdı",
    text: "Ev krediti seqmentində böyük artım qeydə alındı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/home.svg?color=%235AA9FF"
  },
  {
    assetId: "wellsf",
    title: "İqtisadi risklər Wellsford-a təzyiq yaradır",
    text: "Resessiya qorxusu səhmi aşağı saldı.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "wellsf",
    title: "Wellsford rəqəmsal bankçılıq investisiyasını artırdı",
    text: "Yeni texnologiyalara böyük vəsait qoyuldu.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "wellsf",
    title: "Analitiklər Wellsford səhmlərini satış tövsiyəsi etdi",
    text: "Bazar payının itirilməsi riskini qeyd etdilər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "wellsf",
    title: "Wellsford yaşıl kredit proqramını genişləndirdi",
    text: "Ekoloji layihələrə daha çox maliyyə dəstəyi verəcək.",
    impact: 0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },

  /* ── VIZA ── (yeni 7 xəbər) */
  {
    assetId: "viza",
    title: "Viza Asiya bazarında genişlənməyə davam edir",
    text: "Yeni ölkələrdə strateji tərəfdaşlıqlar quruldu.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/globe.svg?color=%235AA9FF"
  },
  {
    assetId: "viza",
    title: "Viza kiber təhlükəsizlik hadisəsi yaşadı",
    text: "Müvəqqəti xidmət kəsintisi baş verdi.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "viza",
    title: "Viza səhmdarlara böyük buyback elan etdi",
    text: "Güclü maliyyə vəziyyəti investorları razı saldı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "viza",
    title: "Viza işçi optimallaşdırması aparır",
    text: "Bəzi departamentlərdə ixtisarlar olacaq.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "viza",
    title: "Viza AI saxtakarlıq aşkarlama sistemini təkmilləşdirdi",
    text: "Yeni texnologiya təhlükəsizliyi artıracaq.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "viza",
    title: "Analitiklər Viza səhmlərini satış tövsiyəsi etdi",
    text: "Rəqabətin artığını qeyd etdilər.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "viza",
    title: "Viza ilə böyük e-ticarət platforması əməkdaşlıq elan etdi",
    text: "Yeni ödəniş həlləri istifadəyə veriləcək.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  }, 


/* ── ABBOT ── */
  {
    assetId: "abbot",
    title: "Abbot yeni qlükoza monitoru cihazını təqdim etdi",
    text: "Real-time monitorinq edən növbəti nəsil sensor böyük tələbat yaradır.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/activity.svg?color=%235AA9FF"
  },
  {
    assetId: "abbot",
    title: "Abbot rekord satış nəticələri açıqladı",
    text: "Diyabet və ürək-damar cihazları seqmenti güclü artım göstərdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "abbot",
    title: "Abbot-ə FDA tərəfindən böyük cərimə kəsildi",
    text: "Cihazların keyfiyyət standartlarına uyğunsuzluq aşkarlandı.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "abbot",
    title: "Abbot süni zəka ilə ürək monitorinq sistemini inkişaf etdirdi",
    text: "Yeni texnologiya həkimlər tərəfindən yüksək qiymətləndirildi.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "abbot",
    title: "Abbot kütləvi işçi ixtisarı planı elan etdi",
    text: "Xərcləri optimallaşdırmaq məqsədilə 6000 əməkdaş ixtisar olunacaq.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "abbot",
    title: "Abbot böyük xəstəxana zənciri ilə uzunmüddətli müqavilə imzaladı",
    text: "Cihaz təchizatı üçün 5 illik razılaşma.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "abbot",
    title: "Abbot cihazlarında proqram təminatı qüsuru aşkarlandı",
    text: "Bəzi modellərdə təhlükəsizlik riski yarandı.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "abbot",
    title: "Abbot səhmdarlara xüsusi dividend ödənişi elan etdi",
    text: "Güclü nağd pul ehtiyatı investorları sevindirdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "abbot",
    title: "Rəqib şirkət Abbot-un bazar payını azaldır",
    text: "Yeni texnologiyalar səbəbindən təzyiq artır.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "abbot",
    title: "Abbot Asiya bazarında istehsal zavodunu genişləndirdi",
    text: "Yeni fabrik sayəsində xərclər azaldılacaq.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/factory.svg?color=%235AA9FF"
  },

  /* ── MERKO ── */
  {
    assetId: "merko",
    title: "Merko & Co yeni immunoterapiya dərmanını təsdiqlətdi",
    text: "Xərçəng müalicəsində böyük irəliləyiş əldə edildi.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/heart-pulse.svg?color=%235AA9FF"
  },
  {
    assetId: "merko",
    title: "Merko rekord rüb gəliri elan etdi",
    text: "Onkologiya və vaksin bölmələri güclü nəticə göstərdi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "merko",
    title: "Merko-ə patent itkisindən böyük zərər dəydi",
    text: "Əsas dərmanlarından birinin patent müddəti bitdi.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "merko",
    title: "Merko biotex startapını böyük məbləğə satın aldı",
    text: "Gen redaktə texnologiyasına investisiya etdi.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "merko",
    title: "Merko kütləvi işçi ixtisarı keçirir",
    text: "Xərcləri azaltmaq üçün 8500 əməkdaş ixtisar olunacaq.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "merko",
    title: "Merko yeni antibiotik dərmanı ilə uğur qazandı",
    text: "Müqavimətli bakteriyalara qarşı effektiv nəticələr əldə edildi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/vaccine.svg?color=%235AA9FF"
  },
  {
    assetId: "merko",
    title: "Merko-ə qarşı məhkəmə iddiası",
    text: "Dərman yan təsirlərinə görə böyük kompensasiya tələb olunur.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "merko",
    title: "Merko səhmdarlara dividend artırdı",
    text: "Güclü maliyyə göstəriciləri investorlara inam verdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "merko",
    title: "Rəqabət Merko-nun satışlarını təzyiq altında saxlayır",
    text: "Yeni rəqib dərmanlar bazar payını azaldır.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "merko",
    title: "Merko süni zəka ilə dərman kəşfiyyatını sürətləndirdi",
    text: "Yeni platforma araşdırma prosesini əhəmiyyətli dərəcədə qısaldır.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },

  /* ── WALMARTA ── */
  {
    assetId: "walmarta",
    title: "Walmarta rekord bayram satışları elan etdi",
    text: "Onlayn və fiziki mağazalarda satışlar proqnozdan 18% yüksək oldu.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "walmarta",
    title: "Walmarta e-ticarət platformasını gücləndirdi",
    text: "Yeni loqistika mərkəzləri və sürətli çatdırılma xidməti istifadəyə verildi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "walmarta",
    title: "Əmək haqqı mübahisələri Walmarta-ya zərər vurdu",
    text: "İşçilərin kütləvi şikayətləri və məhkəmə prosesləri səhmi aşağı saldı.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "walmarta",
    title: "Walmarta təzə ərzaq və orqanik məhsullara investisiya artırdı",
    text: "Müştəri tələbatına cavab olaraq yeni bölmələr açıldı.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/apple.svg?color=%235AA9FF"
  },
  {
    assetId: "walmarta",
    title: "Walmarta işçi ixtisarları və avtomatlaşdırma planı elan etdi",
    text: "Mağazalarda robotlaşdırma genişləndirilir.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "walmarta",
    title: "Walmarta Çin təchizat zəncirində problemlə üzləşdi",
    text: "Tariflər və loqistika xərcləri kəskin artdı.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/truck.svg?color=%23FF4C5E"
  },
  {
    assetId: "walmarta",
    title: "Walmarta yeni sağlamlıq və gözəllik məhsulları seriyasını çıxardı",
    text: "Öz brendi böyük uğur qazandı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/heart.svg?color=%235AA9FF"
  },
  {
    assetId: "walmarta",
    title: "Walmarta səhmdarlara buyback proqramı elan etdi",
    text: "15 milyard dollar dəyərində səhm geri alışı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "walmarta",
    title: "Analitiklər Walmarta səhmlərini satış tövsiyəsi etdi",
    text: "Rəqabətin gücləndiyini və marjanın aşağı düşdüyünü qeyd etdilər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "walmarta",
    title: "Walmarta süni zəka ilə inventar idarəetmə sistemini tətbiq etdi",
    text: "Mağazalarda stok idarəçiliyi əhəmiyyətli dərəcədə yaxşılaşdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  }, 
/* ── COSTKO ── */
  {
    assetId: "costko",
    title: "Costko rekord üzvlük sayı və satış nəticələri elan etdi",
    text: "Şirkət bu rübdə üzvlük sayını əhəmiyyətli dərəcədə artıraraq yeni rekord qırdı. Eyni zamanda mağaza satışları və onlayn sifarişlər analitiklərin proqnozlarını xeyli ötdü.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%235AA9FF"
  },
  {
    assetId: "costko",
    title: "Costko yeni depolar və loqistika mərkəzləri açdı",
    text: "Şirkət sürətli çatdırılma xidmətini genişləndirmək üçün bir neçə böyük regionda yeni avtomatlaşdırılmış anbarlar istifadəyə verdi. Bu, müştəri məmnuniyyətini daha da artıracaq.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/package.svg?color=%235AA9FF"
  },
  {
    assetId: "costko",
    title: "Əmək haqqı və işçi hüquqları ilə bağlı böyük mübahisə Costko-ya zərər vurdu",
    text: "Bir neçə ştatda işçilərin kütləvi şikayətləri və məhkəmə prosesləri səbəbindən şirkətə qarşı ciddi tənqidlər yarandı və bu da səhm qiymətinə mənfi təsir göstərdi.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "costko",
    title: "Costko orqanik və sağlam qida məhsulları seçimini genişləndirdi",
    text: "Müştərilərin artan tələbatına cavab olaraq şirkət mağazalarında orqanik məhsulların çeşidini əhəmiyyətli dərəcədə artırdı və öz brend məhsullarını inkişaf etdirdi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/apple.svg?color=%235AA9FF"
  },
  {
    assetId: "costko",
    title: "Costko işçi ixtisarları və avtomatlaşdırma planını açıqladı",
    text: "Şirkət xərcləri optimallaşdırmaq məqsədilə bəzi departamentlərdə işçilərin sayını azaltmaq və robotlaşdırma sistemlərini genişləndirmək qərarına gəldi.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "costko",
    title: "Costko Çin təchizat zəncirindəki problemlərə görə xəbərdarlıq etdi",
    text: "Tarif artımları və loqistika çətinlikləri səbəbindən bəzi məhsulların qiymətləri qalxa bilər, bu da qısamüddətli təzyiq yaradır.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/truck.svg?color=%23FF4C5E"
  },
  {
    assetId: "costko",
    title: "Costko yeni elektronika və texnologiya bölməsini gücləndirdi",
    text: "Mağazalarda smart cihazlar, televizorlar və kompüter avadanlıqlarının çeşidini artıraraq rəqiblərə qarşı mövqeyini möhkəmləndirdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/laptop.svg?color=%235AA9FF"
  },
  {
    assetId: "costko",
    title: "Costko səhmdarlara böyük buyback və dividend proqramı elan etdi",
    text: "Güclü maliyyə vəziyyəti sayəsində şirkət 10 milyard dollar dəyərində səhm geri alışı və dividend artımı planlaşdırır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "costko",
    title: "Analitiklər Costko səhmlərini satış tövsiyəsi etdi",
    text: "Rəqabətin artması və istehlakçı xərclərinin yavaşlaması səbəbindən gələcək artım potensialını aşağı qiymətləndirdilər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "costko",
    title: "Costko süni zəka ilə inventar və qiymət idarəetmə sistemini tətbiq etdi",
    text: "Yeni texnologiya sayəsində mağazalardakı stok idarəçiliyi və dinamik qiymətləndirmə prosesi əhəmiyyətli dərəcədə yaxşılaşdı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },

  /* ── TARGIT ── */
  {
    assetId: "targit",
    title: "Targit yeni mağaza konsepsiyasını uğurla tətbiq etdi",
    text: "Şirkət müasir dizaynlı və interaktiv təcrübə təklif edən yeni nəsil mağazalarını bir neçə böyük şəhərdə açdı və müştərilər tərəfindən böyük maraqla qarşılandı.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/store.svg?color=%235AA9FF"
  },
  {
    assetId: "targit",
    title: "Targit bayram mövsümündə güclü satış artımı yaşadı",
    text: "Geyim, ev əşyaları və elektronika kateqoriyalarında satışlar gözləntiləri xeyli keçərək şirkətin rüblük nəticələrini yaxşılaşdırdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "targit",
    title: "Targit-ə qarşı əmək haqqı və iş şəraiti ilə bağlı böyük etirazlar",
    text: "Bir neçə ştatda işçilərin aşağı əmək haqqı və ağır iş şəraiti ilə bağlı kütləvi şikayətləri şirkətin imicinə və səhm qiymətinə mənfi təsir göstərdi.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "targit",
    title: "Targit onlayn satış platformasını yenilədi",
    text: "Yeni mobil tətbiq və sürətli çatdırılma xidməti sayəsində e-ticarət seqmentində rəqabət qabiliyyətini artırdı.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "targit",
    title: "Targit mağaza şəbəkəsində optimallaşdırma aparır",
    text: "Bəzi az gəlirli filialları bağlayaraq və digər yerlərdə yenidən quraraq xərcləri azaltma planı elan etdi.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "targit",
    title: "Targit öz brend məhsullarının çeşidini genişləndirdi",
    text: "Ev əşyaları, geyim və qida kateqoriyalarında yeni öz brend məhsulları müştərilər tərəfindən yüksək qiymətləndirildi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/package.svg?color=%235AA9FF"
  },
  {
    assetId: "targit",
    title: "Targit təchizat zəncirində ciddi problemlərlə üzləşdi",
    text: "Qlobal loqistika çətinlikləri və xammal qiymətlərinin artması səbəbindən bəzi məhsulların stoklarında problemlər yarandı.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/truck.svg?color=%23FF4C5E"
  },
  {
    assetId: "targit",
    title: "Targit səhmdarlara xüsusi buyback proqramı başladı",
    text: "Güclü nağd pul ehtiyatı sayəsində şirkət 8 milyard dollar dəyərində səhm geri alışı elan etdi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "targit",
    title: "Analitiklər Targit səhmlərini neytral vəziyyətə endirdi",
    text: "Pərakəndə sektorundakı ümumi yavaşlama və rəqabətin güclənməsi səbəbindən gələcək artım gözləntilərini aşağı saldı.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "targit",
    title: "Targit süni zəka ilə müştəri təcrübəsini yaxşılaşdırdı",
    text: "Mağazalarda və onlayn platformada fərdi tövsiyələr və inventar idarəetmə sistemləri tətbiq edildi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  }, 

/* ── HOMIDEPO ── */
  {
    assetId: "homidepo",
    title: "Homidepo yeni mağaza konsepsiyası və təmir xidmətlərini genişləndirdi",
    text: "Şirkət müştərilərə yalnız məhsul satmaqla yanaşı, ev təmiri və dizayn xidmətlərini də bir yerdə təklif edən yeni formatlı mağazalar açdı. Bu, orta hesabla müştəri sərfiyyatını artırdı.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/store.svg?color=%235AA9FF"
  },
  {
    assetId: "homidepo",
    title: "Homidepo rekord rüb satışları elan etdi",
    text: "Tikinti materialları, alətlər və ev təmiri seqmentində satışlar analitiklərin proqnozlarını 16% ötdü. Yaz mövsümü tələbatı gözlənildən yüksək oldu.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "homidepo",
    title: "Homidepo təchizat zənciri problemləri səbəbindən xəbərdarlıq etdi",
    text: "Qlobal loqistika çətinlikləri və bəzi materialların qiymət artımı şirkətin marjasını sıxışdırır. Bu vəziyyət investorlar arasında narahatlıq yaratdı.",
    impact: -0.35,
    duration: 3,
    icon: "https://api.iconify.design/lucide/truck.svg?color=%23FF4C5E"
  },
  {
    assetId: "homidepo",
    title: "Homidepo enerji səmərəli və yaşıl tikinti materiallarını genişləndirdi",
    text: "Müştərilərin ekoloji məhsullara olan tələbatına cavab olaraq günəş panelləri, izolyasiya materialları və smart ev sistemlərinin çeşidini artırdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },
  {
    assetId: "homidepo",
    title: "Homidepo mağaza şəbəkəsində optimallaşdırma aparır",
    text: "Bəzi az gəlirli filialları bağlayıb, digər yerlərdə isə yenidən quraraq xərcləri azaltma planı elan etdi.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "homidepo",
    title: "Homidepo peşəkar ustalar üçün yeni proqram başlatdı",
    text: "Təmir və tikinti işçilərinə xüsusi endirimlər və loyallıq proqramı təqdim edərək bu seqmentdə bazar payını artırmağı hədəfləyir.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/hammer.svg?color=%235AA9FF"
  },
  {
    assetId: "homidepo",
    title: "Homidepo-da kiber hücum hadisəsi baş verdi",
    text: "Şirkətin onlayn satış platformasında müvəqqəti kəsinti yarandı və bəzi müştəri məlumatları risk altında qaldı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "homidepo",
    title: "Homidepo səhmdarlara böyük dividend və buyback elan etdi",
    text: "Güclü nağd pul axını sayəsində şirkət investorlara əhəmiyyətli gəlir vədi verdi və 7 milyard dollarlıq səhm geri alışı planlaşdırır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "homidepo",
    title: "Analitiklər Homidepo səhmlərini satış tövsiyəsi etdi",
    text: "Tikinti sektorundakı yavaşlama və faiz dərəcələrinin təsiri səbəbindən gələcək artım potensialını aşağı qiymətləndirdilər.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "homidepo",
    title: "Homidepo süni zəka ilə inventar idarəetmə sistemini təkmilləşdirdi",
    text: "Mağazalarda stokların avtomatik idarə olunması və tələbat proqnozlaşdırması prosesi əhəmiyyətli dərəcədə yaxşılaşdı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },

  /* ── TESSLA ── */
  {
    assetId: "tessla",
    title: "Tessla yeni Cybertruck nəslini rəsmi olaraq təqdim etdi",
    text: "Daha güclü batareya, artan məsafə və yeni avtonom idarəetmə xüsusiyyətləri ilə təchiz olunmuş Cybertruck seriyası böyük maraq doğurdu.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/car.svg?color=%235AA9FF"
  },
  {
    assetId: "tessla",
    title: "Tessla rekord sayda avtomobil teslimatı həyata keçirdi",
    text: "Son rübdə istehsal və teslimat sayı bütün zamanların rekordunu qırdı. Xüsusilə Model Y və Cybertruck tələbatı çox yüksək idi.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "tessla",
    title: "ABŞ-Çin gərginliyi Tessla-nın Şanxay zavoduna ağır zərbə vurdu",
    text: "Yeni tariflər və ixrac məhdudiyyətləri səbəbindən şirkətin Çin bazarındakı satışları və təchizat zənciri ciddi təhlükə altında qaldı.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "tessla",
    title: "Tessla tam avtonom idarəetmə (FSD) sisteminin yeni versiyasını buraxdı",
    text: "Süni zəka ilə işləyən yeni proqram təminatı istifadəçilər tərəfindən yüksək qiymətləndirildi və şirkətin texnologiya liderliyini bir daha təsdiqlədi.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "tessla",
    title: "Tessla kütləvi işçi ixtisarı dalğası keçirir",
    text: "Şirkət xərcləri azaltmaq və səmərəliliyi artırmaq məqsədilə minlərlə əməkdaşını ixtisar etdiyini açıqladı.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "tessla",
    title: "Tessla enerji saxlama sistemlərində böyük sifarişlər aldı",
    text: "Bir neçə böyük enerji şirkəti ilə Megapack batareyaları üçün uzunmüddətli müqavilələr imzalanıb.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/battery.svg?color=%235AA9FF"
  },
  {
    assetId: "tessla",
    title: "Tessla-nın avtopilot sistemində ciddi qəza iddiası",
    text: "Bir neçə hadisədən sonra tənzimləyicilər araşdırma başlatdı və bu, şirkətin imicinə mənfi təsir göstərdi.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "tessla",
    title: "Tessla səhmdarlara xüsusi buyback proqramı elan etdi",
    text: "Güclü nağd pul ehtiyatı sayəsində şirkət böyük həcmdə səhm geri alışı planlaşdırır.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "tessla",
    title: "Böyük banklar Tessla səhmlərini satış tövsiyəsi etdi",
    text: "Rəqabətin artması və marjanın aşağı düşməsi səbəbindən qiymət hədəflərini endirdilər.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "tessla",
    title: "Tessla yeni nəsil Robotaxi layihəsində irəliləyiş əldə etdi",
    text: "Tam sürücüsüz taksi layihəsi ilə bağlı prototiplər sınaq mərhələsindədir və böyük investor marağına səbəb olur.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  }, 

/* ── TOYOTO ── */
  {
    assetId: "toyoto",
    title: "Toyoto yeni hibrid və hidrogen avtomobil seriyasını təqdim etdi",
    text: "Şirkət ehtiyatlı və ekoloji cəhətdən təmiz nəqliyyat strategiyasını davam etdirərək növbəti nəsil hibrid və hidrogen yanacaqlı modelləri rəsmi olaraq bazara çıxardı.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/car.svg?color=%235AA9FF"
  },
  {
    assetId: "toyoto",
    title: "Toyoto rekord satış və ixrac nəticələri elan etdi",
    text: "Xüsusilə Asiya və Şimali Amerika bazarlarında hibrid modellərin satışları analitiklərin proqnozlarını xeyli ötdü və şirkətin qlobal bazar payını artırdı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "toyoto",
    title: "ABŞ tarif siyasəti Toyoto-nun Amerika satışlarına zərər vurdu",
    text: "İdxal olunan avtomobillərə qoyulan yeni tariflər şirkətin ABŞ bazarındakı rəqabət qabiliyyətini aşağı saldı və investorlar arasında narahatlıq yaratdı.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "toyoto",
    title: "Toyoto batareya texnologiyasında böyük irəliləyiş əldə etdi",
    text: "Yeni nəsil bərk hal batareyaları ilə bağlı tədqiqatlar uğurla davam edir və bu, gələcək elektrik avtomobillər üçün böyük üstünlük vəd edir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/battery.svg?color=%235AA9FF"
  },
  {
    assetId: "toyoto",
    title: "Toyoto kütləvi işçi optimallaşdırması aparır",
    text: "Şirkət qlobal miqyasda xərcləri azaltmaq məqsədilə bir neçə zavodda işçilərin sayını optimallaşdırma planı elan etdi.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "toyoto",
    title: "Toyoto böyük Amerika avtomobil şirkəti ilə strateji əməkdaşlıq qurdu",
    text: "Hibrid texnologiyaların birgə inkişafı və avadanlıq paylaşımı ilə bağlı uzunmüddətli müqavilə imzalanıb.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "toyoto",
    title: "Toyoto-nun bəzi modellərində təhlükəsizlik qüsuru aşkarlandı",
    text: "İstehsal xəttindəki problem səbəbindən milyonlarla avtomobil geri çağırıldı və bu, şirkətə ciddi maliyyə və imic zərəri vurdu.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "toyoto",
    title: "Toyoto səhmdarlara stabil dividend artırımı elan etdi",
    text: "Güclü maliyyə mövqeyi və ardıcıl gəlirlilik sayəsində rüblük dividend məbləğini yenidən yüksəltdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "toyoto",
    title: "Analitiklər Toyoto səhmlərini satış tövsiyəsi etdi",
    text: "Elektrik avtomobil keçidində rəqiblərə nisbətən yavaş irəliləyiş və marja təzyiqi səbəbindən qiymət hədəfləri aşağı salındı.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "toyoto",
    title: "Toyoto robot texnologiyası və avtonom idarəetmə sahəsində irəliləyiş əldə etdi",
    text: "İnsanoid robotlar və yeni nəsil avtonom sistemlər üzrə apardığı tədqiqatlar investorlar tərəfindən böyük maraqla izlənilir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── VOLKSVAN ── */
  {
    assetId: "volksvan",
    title: "Volksvan yeni elektrik avtomobil platformasını təqdim etdi",
    text: "Şirkət ID seriyasının növbəti nəslini rəsmi olaraq elan etdi. Daha uzun məsafə və sürətli doldurma texnologiyası ilə rəqabəti artırmağı hədəfləyir.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/car.svg?color=%235AA9FF"
  },
  {
    assetId: "volksvan",
    title: "Volksvan Avropa satışlarında güclü artım yaşadı",
    text: "Elektrik və hibrid modellərə tələbatın artması şirkətin Avropa bazarındakı payını əhəmiyyətli dərəcədə yüksəltdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "volksvan",
    title: "Dizel skandalının yeni dalğası Volksvan-a ağır zərbə vurdu",
    text: "Keçmiş emissiya qalmaqalının yeni məhkəmə prosesləri şirkətə böyük cərimə və kompensasiya riski yaradır.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "volksvan",
    title: "Volksvan Çin bazarında böyük investisiya elan etdi",
    text: "Yeni zavod və yerli tərəfdaşlıqlar vasitəsilə elektrik avtomobil seqmentində mövqeyini gücləndirməyi planlaşdırır.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/factory.svg?color=%235AA9FF"
  },
  {
    assetId: "volksvan",
    title: "Volksvan kütləvi işçi ixtisarı və restrukturizasiya planı açıqladı",
    text: "Elektrik keçidinə uyğunlaşmaq üçün Avropada bir neçə zavodda işçilərin sayını azaltmaq qərarına gəldi.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "volksvan",
    title: "Volksvan Porsche ilə birgə yeni spor avtomobil layihəsi üzərində işləyir",
    text: "İki brendin birgə inkişaf etdirdiyi yeni elektrik idman avtomobili böyük maraq doğurur.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "volksvan",
    title: "Volksvan-ın təchizat zəncirində xammal çatışmazlığı",
    text: "Batareya komponentlərinin qiymət artımı və tədarük problemləri istehsal tempini yavaşlatdı.",
    impact: -0.07,
    duration: 3,
    icon: "https://api.iconify.design/lucide/truck.svg?color=%23FF4C5E"
  },
  {
    assetId: "volksvan",
    title: "Volksvan səhmdarlara dividend ödənişini bərpa etdi",
    text: "Maliyyə vəziyyətinin stabilləşməsi ilə birlikdə investorlara yenidən dividend ödəməyə başladı.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "volksvan",
    title: "Analitiklər Volksvan səhmlərini neytral vəziyyətə endirdi",
    text: "Elektrik keçidindəki yavaş temp və rəqabətin güclənməsi səbəbindən proqnozlar aşağı salındı.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "volksvan",
    title: "Volksvan avtonom idarəetmə texnologiyasını inkişaf etdirir",
    text: "Yeni nəsil sürücüsüz sistemlər üzərində apardığı işlər şirkətin gələcək planlarında önəmli yer tutur.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  }, 

/* ── RIVYAN ── */
  {
    assetId: "rivyan",
    title: "Rivyan yeni R2 və R3 elektrik SUV modellərini təqdim etdi",
    text: "Şirkət daha əlverişli qiymət seqmentinə yönələn yeni nəsil elektrik SUV modellərini rəsmi olaraq elan etdi. Bu, Tesla və digər rəqiblərə qarşı ciddi rəqabət yaradacaq.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/car.svg?color=%235AA9FF"
  },
  {
    assetId: "rivyan",
    title: "Rivyan rekord sifariş portfeli və teslimat nəticələri açıqladı",
    text: "Son rübdə istehsal həcmi və müştərilərə teslim edilən avtomobil sayı əhəmiyyətli dərəcədə artıb, bu da şirkətin böyümə potensialını göstərir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "rivyan",
    title: "Rivyan batareya təchizatı problemləri səbəbindən xəbərdarlıq etdi",
    text: "Batareya komponentlərinin qiymət artımı və tədarük çətinlikləri istehsal tempini aşağı salıb və gələcək proqnozlara mənfi təsir göstərib.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "rivyan",
    title: "Rivyan Amazon ilə strateji əməkdaşlığını genişləndirdi",
    text: "Elektrik yük maşınları üçün yeni böyük sifarişlər və birgə inkişaf layihələri şirkətin gələcək gəlirlərini dəstəkləyəcək.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "rivyan",
    title: "Rivyan işçi ixtisarları və xərc optimallaşdırması planı elan etdi",
    text: "Şirkət sürətli böyümə mərhələsindən sonra xərcləri nəzarət altına almaq üçün bir neçə departamentdə işçilərin sayını azaltmaq qərarına gəldi.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "rivyan",
    title: "Rivyan yeni avtonom idarəetmə texnologiyasını sınaqdan keçirir",
    text: "Tam sürücüsüz sürmə imkanları üzərində apardığı işlər investorlar və texnologiya ictimaiyyəti tərəfindən böyük maraqla izlənilir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },
  {
    assetId: "rivyan",
    title: "Rivyan-ın zavodunda istehsal problemləri yaşandı",
    text: "Təchizat zənciri kəsintiləri səbəbindən bir neçə həftə ərzində istehsal tempində azalma baş verdi.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
/* ── BITKOYN ── */
  {
    assetId: "bitkoyn",
    title: "Bitkoyn ETF-lərinə rekord həcmdə investisiya axını",
    text: "ABŞ və Avropada Bitkoyn spot ETF-lərinə institusional investorların marağı kəskin artıb və bu, qiymətin yüksəlməsinə güclü təkan verdi.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "bitkoyn",
    title: "Bitkoyn yarılanma hadisəsindən sonra hasilat çətinləşdi",
    text: "Yarılanma sonrası hasilatçılar üçün mükafatların azalması bazar dinamikasını dəyişdi, amma qiymət dəstəyi güclü qaldı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "bitkoyn",
    title: "ABŞ tənzimləyiciləri Bitkoyn və kripto bazarına yeni məhdudiyyətlər qoydu",
    text: "Yeni qaydalar və vergi siyasəti investorlar arasında qeyri-müəyyənlik yaratdı və qiymətdə kəskin enişə səbəb oldu.",
    impact: -0.40,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "bitkoyn",
    title: "Böyük şirkətlər Bitkoynu balans hesabı aktivinə əlavə etdi",
    text: "Bir neçə korporativ nəhəng Bitkoyna investisiya etdiyini açıqlayaraq institusional qəbulu artırdı.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/building.svg?color=%235AA9FF"
  },
  {
    assetId: "bitkoyn",
    title: "Bitkoyn şəbəkəsində böyük tranzaksiya haqqı artımı",
    text: "Şəbəkədə tıxanma və yüksək haqq problemi istifadəçiləri narahat etdi və qısamüddətli satış təzyiqi yaratdı.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "bitkoyn",
    title: "El Salvador və digər ölkələr Bitkoynu rəsmi valyuta kimi qəbul etdi",
    text: "Daha çox ölkənin Bitkoynu qəbul etməsi qlobal qəbulu və qiymətə müsbət təsir göstərir.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/globe.svg?color=%235AA9FF"
  },
  {
    assetId: "bitkoyn",
    title: "Böyük Bitkoyn balinaları səhmlərini satdı",
    text: "Uzun müddət saxlayan investorların satışları bazarda kəskin dalğalanma yaratdı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "bitkoyn",
    title: "Bitkoyn halving sonrası yeni rekord hündürlüyə çatdı",
    text: "Tarixi zirvələr yenidən yeniləndi və bazar optimizmi gücləndi.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "bitkoyn",
    title: "Tənzimləyici risklər Bitkoyn bazarını təzyiq altında saxlayır",
    text: "Bir neçə ölkədə yeni qadağalar və araşdırmalar investor etibarını zəiflətdi.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "bitkoyn",
    title: "Bitkoyn Lightning Network istifadəsi rekord səviyyəyə çatdı",
    text: "Sürətli və ucuz tranzaksiyalar üçün Layer-2 həlli geniş qəbul olunur və bu, uzunmüddətli inkişafa müsbət təsir edir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/lightning.svg?color=%235AA9FF"
  }, 
/* ── ETHERYM ── */
  {
    assetId: "etherym",
    title: "Etherym şəbəkəsi yeni Dencun yeniləməsini uğurla tamamladı",
    text: "Şəbəkədə tranzaksiya haqlarını əhəmiyyətli dərəcədə aşağı salan və skalalanma qabiliyyətini artıran Dencun yeniləməsi istifadəçilər və DeFi protokollar tərəfindən böyük maraqla qarşılandı.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "etherym",
    title: "Etherym spot ETF-lərinə böyük investisiya axını davam edir",
    text: "ABŞ və Avropada Etherym-ə bağlı institusional məhsullara maraq artıb, bu da qiymətin sabit yüksəlişinə dəstək verir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "etherym",
    title: "Tənzimləyici orqanlar Etherym staking xidmətlərinə qarşı araşdırma başlatdı",
    text: "Bir neçə böyük platformaya qarşı açılan araşdırmalar investorlarda qeyri-müəyyənlik yaratdı və qiymətdə kəskin enişə səbəb oldu.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "etherym",
    title: "DeFi protokollarında Etherym TVL rekord həddə çatdı",
    text: "Decentralized Finance sektorunda Etherym üzərində qurulan protokollar vasitəsilə kilidlənmiş dəyər tarixi maksimuma yüksəldi.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "etherym",
    title: "Etherym şəbəkəsində yüksək haqq və tıxanma problemləri yaşandı",
    text: "Böyük aktivlik dövründə şəbəkə tıxandı və tranzaksiya haqları kəskin artdı, bu da bəzi istifadəçiləri narazı saldı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "etherym",
    title: "Böyük korporasiyalar Etherym əsaslı layihələrə investisiya etdi",
    text: "Bir neçə texnologiya nəhəngi Etherym üzərində Web3 və NFT həlləri inkişaf etdirmək üçün vəsait ayırdı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/building.svg?color=%235AA9FF"
  },
  {
    assetId: "etherym",
    title: "Etherym rəqibləri ilə rəqabət güclənir",
    text: "Solana və digər Layer-1 şəbəkələrin sürətli inkişafı Etherym-in bazar payına təzyiq yaradır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "etherym",
    title: "Etherym ekosistemində yeni NFT və GameFi layihələri partlayış yaşadı",
    text: "Populyar kolleksiyalar və oyunlar sayəsində şəbəkə aktivliyi əhəmiyyətli dərəcədə artdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gamepad-2.svg?color=%235AA9FF"
  },
  {
    assetId: "etherym",
    title: "Təhlükəsizlik hadisəsi Etherym DeFi protokollarından birində baş verdi",
    text: "Hacker hücumu nəticəsində milyonlarla dollar dəyərində token itirildi və bazar etibarına zərər dəydi.",
    impact: -0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "etherym",
    title: "Etherym Layer-2 həllərinin istifadəsi rekord səviyyəyə çatdı",
    text: "Optimism, Arbitrum və digər Layer-2 şəbəkələr sayəsində şəbəkənin skalalanma qabiliyyəti əhəmiyyətli dərəcədə yaxşılaşdı.",
    impact: 0.11,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── SOLANO ── */
  {
    assetId: "solano",
    title: "Solano şəbəkəsi yeni yüksək sürətli yeniləməni tətbiq etdi",
    text: "Şəbəkənin performansı və skalalanma qabiliyyətini daha da artıran yeniləmə istifadəçilər tərəfindən böyük razılıqla qarşılandı.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "solano",
    title: "Solano DeFi və NFT sektorunda liderliyini artırır",
    text: "TVL (Total Value Locked) göstəricisi yeni rekord qırdı və bir çox yeni layihə Solano ekosistemini seçdi.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "solano",
    title: "Solano şəbəkəsində böyük outage (kəsinti) hadisəsi baş verdi",
    text: "Şəbəkənin müvəqqəti dayanması investorlar arasında güclü narahatlıq yaratdı və qiymətdə kəskin enişə səbəb oldu.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "solano",
    title: "Solano memecoin sektorunda böyük aktivlik yaşandı",
    text: "Bir neçə populyar memecoin-in sürətli yüksəlişi şəbəkənin gündəlik tranzaksiya həcmini rekord səviyyəyə çıxardı.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "solano",
    title: "Solano rəqibləri ilə müqayisədə enerji səmərəliliyi üstünlüyü qazandı",
    text: "Daha aşağı enerji sərfiyyatı və yüksək TPS (Transactions Per Second) göstəricisi ilə diqqət çəkir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },
  {
    assetId: "solano",
    title: "Solano-da böyük hack hadisəsi baş verdi",
    text: "Bir neçə DeFi protokolundan milyonlarla dollar dəyərində token oğurlanması şəbəkənin təhlükəsizlik imicinə zərər vurdu.",
    impact: -0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "solano",
    title: "Böyük venture fondları Solano ekosistem layihələrinə investisiya etdi",
    text: "Bir neçə yüksək profilli fond Solano əsaslı startaplara yüz milyonlarla dollar vəsait qoydu.",
    impact: 0.11,
    duration: 2,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "solano",
    title: "Solano tənzimləyicilərin diqqətini cəlb etdi",
    text: "Şəbəkənin sürətli böyüməsi səbəbindən bir sıra ölkədə tənzimləyici araşdırmalar başladı.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "solano",
    title: "Solano Mobile telefon layihəsi böyük maraq doğurdu",
    text: "Blockchain ilə inteqrasiya olunmuş mobil cihaz konsepsiyası texnologiya ictimaiyyətində geniş müzakirə mövzusuna çevrildi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "solano",
    title: "Solano şəbəkəsi yeni yüksək throughput yeniləməsini hazırlayır",
    text: "Gələcək yeniləmələr şəbəkənin saniyədəki tranzaksiya qabiliyyətini daha da artıracaq.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  }, 
/* ── BINCOIN ── */
  {
    assetId: "bincoin",
    title: "Bincoin yeni Smart Chain yeniləməsini uğurla tətbiq etdi",
    text: "Şəbəkənin sürətini və skalalanma qabiliyyətini əhəmiyyətli dərəcədə artıran yeniləmə DeFi, GameFi və NFT layihələri üçün daha əlverişli mühit yaratdı.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "bincoin",
    title: "Bincoin ekosistemində DeFi TVL rekord səviyyəyə çatdı",
    text: "Bir neçə populyar protokol vasitəsilə şəbəkədə kilidlənmiş dəyər tarixi maksimuma yüksəldi və investor marağını artırdı.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "bincoin",
    title: "Tənzimləyici orqanlar Bincoin əsaslı layihələrə qarşı araşdırma başlatdı",
    text: "Bir sıra ölkədə yeni qaydalar və məhdudiyyətlər şəbəkədə qeyri-müəyyənlik yaratdı və qiymətdə kəskin enişə səbəb oldu.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "bincoin",
    title: "Bincoin memecoin sektorunda böyük partlayış yaşandı",
    text: "Bir neçə yeni memecoin-in sürətli yüksəlişi şəbəkənin gündəlik aktiv istifadəçilər sayını rekord həddə çıxardı.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "bincoin",
    title: "Bincoin şəbəkəsində yüksək haqq və tıxanma problemləri",
    text: "Böyük aktivlik dövründə şəbəkə tıxandı və tranzaksiya haqları kəskin artdı, bu da bəzi istifadəçiləri digər zəncirlərə keçməyə məcbur etdi.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "bincoin",
    title: "Böyük institusional investorlar Bincoin-ə maraq göstərir",
    text: "Bir neçə hedge fund və korporativ şirkət Bincoin ekosistem layihələrinə və tokenlərə investisiya etdiyini açıqladı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/building.svg?color=%235AA9FF"
  },
  {
    assetId: "bincoin",
    title: "Bincoin rəqibləri ilə rəqabətdə geri qalır",
    text: "Solano və Etherym kimi şəbəkələrin daha yüksək sürəti Bincoin-in bazar payına təzyiq yaradır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "bincoin",
    title: "Bincoin GameFi və Metaverse layihələri böyük uğur qazandı",
    text: "Yeni oyunlar və virtual dünya layihələri şəbəkədə aktivliyi və token tələbatını artırdı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gamepad-2.svg?color=%235AA9FF"
  },
  {
    assetId: "bincoin",
    title: "Bincoin-də böyük hack hadisəsi baş verdi",
    text: "Məşhur protokollardan birində baş verən təhlükəsizlik boşluğu milyonlarla dollar itkisi ilə nəticələndi.",
    impact: -0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "bincoin",
    title: "Bincoin yeni Layer-2 həlləri ilə skalalanma problemini həll edir",
    text: "Yeni Layer-2 texnologiyaları şəbəkənin sürətini və xərclərini əhəmiyyətli dərəcədə yaxşılaşdırır.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── CARDONA ── */
  {
    assetId: "cardona",
    title: "Cardona yeni Vasil hard fork yeniləməsini uğurla keçirdi",
    text: "Şəbəkənin sürətini, təhlükəsizliyini və smart kontrakt imkanlarını artıran yeniləmə Cardona ekosistemini daha da gücləndirdi.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "cardona",
    title: "Cardona DeFi sektorunda sürətli böyümə göstərir",
    text: "Bir neçə yeni protokolun işə düşməsi ilə şəbəkədə kilidlənmiş dəyər əhəmiyyətli dərəcədə artdı.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "cardona",
    title: "Cardona staking mükafatlarının azalması qiymətə təzyiq yaratdı",
    text: "Yeniləmə sonrası staking gəlirliliyinin düşməsi bəzi investorları satışa keçməyə məcbur etdi.",
    impact: -0.35,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "cardona",
    title: "Cardona Afrika və Asiya bazarlarında genişlənmə planı elan etdi",
    text: "Real world asset tokenləşdirməsi və maliyyə inkluziyası layihələri ilə yeni regionlara giriş edir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/globe.svg?color=%235AA9FF"
  },
  {
    assetId: "cardona",
    title: "Cardona şəbəkəsində təhlükəsizlik auditində qüsur aşkarlandı",
    text: "Müstəqil audit nəticəsində bəzi zəifliklər müəyyən edildi və bu, qısamüddətli satış təzyiqi yaratdı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "cardona",
    title: "Böyük institusional investorlar Cardona-ya investisiya etdi",
    text: "Bir neçə fond Cardona əsaslı layihələrə və token saxlanmasına maraq göstərir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/building.svg?color=%235AA9FF"
  },
  {
    assetId: "cardona",
    title: "Cardona rəqibləri ilə müqayisədə yavaş inkişaf göstərir",
    text: "Etherym və Solano-nun sürətli böyüməsi Cardona-nın bazar payını təzyiq altında saxlayır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "cardona",
    title: "Cardona NFT və Real World Asset layihələrində irəliləyiş əldə etdi",
    text: "Ənənəvi aktivlərin blockchain-ə tokenləşdirilməsi istiqamətində yeni uğurlu layihələr işə düşdü.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/image.svg?color=%235AA9FF"
  },
  {
    assetId: "cardona",
    title: "Cardona staking hovuzlarında böyük çıxış dalğası",
    text: "Bəzi investorların mükafatların azalması səbəbindən staking-dən çıxması qiymətə mənfi təsir etdi.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "cardona",
    title: "Cardona yeni partnership-lər elan etdi",
    text: "Böyük texnologiya və maliyyə şirkətləri ilə əməkdaşlıqlar şəbəkənin gələcək inkişafına müsbət təsir edəcək.",
    impact: 0.11,
    duration: 2,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  }, 
/* ── AVLANCH ── */
  {
    assetId: "avlanch",
    title: "Avlanch yeni subnet texnologiyasını tətbiq etdi",
    text: "Şəbəkənin fərdi blokçeynlər yaratma imkanı verən subnet yeniləməsi oyunlar, DeFi və korporativ istifadə üçün böyük imkanlar açdı və sürətli böyüməyə səbəb oldu.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "avlanch",
    title: "Avlanch DeFi TVL göstəricisində rekord artım yaşadı",
    text: "Bir neçə böyük protokolun Avlanch-a keçməsi və yeni layihələrin işə düşməsi ilə şəbəkədə kilidlənmiş dəyər tarixi maksimuma çatdı.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "avlanch",
    title: "Avlanch şəbəkəsində böyük kəsinti hadisəsi baş verdi",
    text: "Validator problemləri səbəbindən şəbəkə müvəqqəti olaraq dayandı və bu, investorlar arasında güclü narahatlıq yaratdı.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "avlanch",
    title: "Avlanch böyük oyun şirkətləri ilə əməkdaşlıq elan etdi",
    text: "Bir neçə AAA oyun studiyası Avlanch üzərində blockchain inteqrasiyalı oyunlar inkişaf etdirmək üçün müqavilə imzaladı.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/gamepad-2.svg?color=%235AA9FF"
  },
  {
    assetId: "avlanch",
    title: "Avlanch rəqibləri ilə müqayisədə daha aşağı haqq üstünlüyü qazandı",
    text: "Sürətli tranzaksiya və çox ucuz haqq strukturu istifadəçiləri cəlb etməyə davam edir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "avlanch",
    title: "Avlanch-da böyük hack hadisəsi baş verdi",
    text: "Bir neçə protokoldan milyonlarla dollar dəyərində token oğurlanması şəbəkənin təhlükəsizlik imicinə ciddi zərər vurdu.",
    impact: -0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "avlanch",
    title: "Böyük venture fondları Avlanch ekosistem layihələrinə investisiya etdi",
    text: "Bir neçə yüksək profilli fond Avlanch əsaslı startaplara yüz milyonlarla dollar vəsait qoydu.",
    impact: 0.11,
    duration: 2,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "avlanch",
    title: "Avlanch staking mükafatları azaldı",
    text: "Yeni yeniləmə sonrası staking gəlirliliyinin düşməsi bəzi investorları satışa keçməyə məcbur etdi.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "avlanch",
    title: "Avlanch yeni institusional xidmətlər təqdim etdi",
    text: "Korporativ istifadəçilər üçün xüsusi subnet və uyğunlaşdırılmış həllər təklif edərək institusional qəbulu artırır.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/building.svg?color=%235AA9FF"
  },
  {
    assetId: "avlanch",
    title: "Avlanch Layer-2 və subnet inkişafı sürətlənir",
    text: "Yeni texniki yeniliklər şəbəkənin ümumi skalalanma qabiliyyətini əhəmiyyətli dərəcədə yaxşılaşdırır.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── POLKADUT ── */
  {
    assetId: "polkadut",
    title: "Polkadut yeni parachain auksionlarını uğurla keçirdi",
    text: "Bir neçə yeni yüksək keyfiyyətli parachain şəbəkəyə qoşuldu və bu, ekosistemin ümumi aktivliyini əhəmiyyətli dərəcədə artırdı.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "polkadut",
    title: "Polkadut ekosistemində cross-chain əməliyyatlar rekord həddə çatdı",
    text: "Fərqli blokçeynlər arasında aktivlərin problemsiz transferi şəbəkənin əsas üstünlüyünü bir daha nümayiş etdirdi.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "polkadut",
    title: "Polkadut təhlükəsizlik auditində ciddi qüsur aşkarlandı",
    text: "Müstəqil audit nəticəsində bəzi zəifliklər müəyyən edildi və bu, qiymətdə kəskin enişə səbəb oldu.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "polkadut",
    title: "Polkadut yeni Web3 və RWA layihələri ilə əməkdaşlıq elan etdi",
    text: "Real world asset tokenləşdirməsi və Web3 infrastruktur layihələri şəbəkənin praktiki istifadəsini artırır.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/globe.svg?color=%235AA9FF"
  },
  {
    assetId: "polkadut",
    title: "Polkadut staking mükafatları azaldı",
    text: "Yeni sistem dəyişiklikləri səbəbindən staking gəlirliliyi düşdü və bəzi investorlar satışa keçdi.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "polkadut",
    title: "Böyük institusional oyunçular Polkadut-a maraq göstərir",
    text: "Bir neçə fond və korporativ investor Polkadut əsaslı layihələrə vəsait qoymağa başlayıb.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/building.svg?color=%235AA9FF"
  },
  {
    assetId: "polkadut",
    title: "Polkadut rəqabət qarşısında bazar payını itirir",
    text: "Daha sürətli və ucuz Layer-1 şəbəkələr Polkadut-un mövqeyinə təzyiq yaradır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "polkadut",
    title: "Polkadut yeni parachain-lər üçün auksionları davam etdirir",
    text: "Yeni layihələrin şəbəkəyə qoşulması ekosistemin uzunmüddətli inkişafını dəstəkləyir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "polkadut",
    title: "Polkadut-da böyük NFT kolleksiyası buraxılışı",
    text: "Məşhur brendlərlə əməkdaşlıq nəticəsində yeni NFT seriyası böyük satış həcminə nail oldu.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/image.svg?color=%235AA9FF"
  },
  {
    assetId: "polkadut",
    title: "Polkadut texniki inkişaf yol xəritəsini yenilədi",
    text: "Gələcək illər üçün planlaşdırılan yeniləmələr şəbəkənin rəqabət qabiliyyətini artırmağı vəd edir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  }, 

/* ── CHAINLEK ── */
  {
    assetId: "chainlek",
    title: "Chainlek yeni modular blokçeyn arxitekturasını təqdim etdi",
    text: "Şəbəkənin daha çevik və genişlənə bilən modular dizaynı developerlərə fərdi tətbiqlər yaratmaq üçün böyük imkanlar açdı və ekosistemdə sürətli artıma səbəb oldu.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "chainlek",
    title: "Chainlek DeFi və RWA sektorunda güclü böyümə göstərdi",
    text: "Real world asset tokenləşdirməsi layihələrinin artması və DeFi protokollarının köçməsi şəbəkənin TVL göstəricisini yeni rekord səviyyəyə çıxardı.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "chainlek",
    title: "Chainlek şəbəkəsində böyük təhlükəsizlik hadisəsi baş verdi",
    text: "Bir neçə protokolda aşkarlanan zəiflik nəticəsində milyonlarla dollar dəyərində itki yaşandı və qiymətdə kəskin eniş baş verdi.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "chainlek",
    title: "Chainlek böyük korporativ tərəfdaşlıqlar qurdu",
    text: "Bir neçə qlobal şirkət Chainlek üzərində öz blockchain həllərini inkişaf etdirmək üçün əməkdaşlıq elan etdi.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "chainlek",
    title: "Chainlek tranzaksiya haqlarında artım müşahidə edildi",
    text: "Yüksək aktivlik səbəbindən haqqların qalxması istifadəçiləri narazı saldı və qısamüddətli satış təzyiqi yaratdı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "chainlek",
    title: "Chainlek yeni Layer-2 həllərini işə saldı",
    text: "Sürət və xərc baxımından daha effektiv olan Layer-2 texnologiyaları şəbəkənin skalalanma problemlərini həll etməyə kömək edir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "chainlek",
    title: "Chainlek rəqabətin güclənməsi səbəbindən bazar payını itirir",
    text: "Daha sürətli və ucuz rəqib şəbəkələr Chainlek-in mövqeyinə ciddi təzyiq yaradır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "chainlek",
    title: "Chainlek GameFi və Metaverse layihələrində liderliyini artırır",
    text: "Bir neçə populyar oyun və virtual dünya layihəsi Chainlek-i əsas platforma kimi seçdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gamepad-2.svg?color=%235AA9FF"
  },
  {
    assetId: "chainlek",
    title: "Chainlek staking və likvid staking xidmətlərini genişləndirdi",
    text: "İstifadəçilərə daha yüksək gəlir imkanı verən yeni staking mexanizmləri tətbiq edildi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%235AA9FF"
  },
  {
    assetId: "chainlek",
    title: "Chainlek gələcək yol xəritəsini yenilədi",
    text: "2026-2027 illəri üçün planlaşdırılan texniki yeniliklər şəbəkənin uzunmüddətli potensialını gücləndirir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },

  /* ── XRIPPLE ── */
  {
    assetId: "xripple",
    title: "Xripple banklar və maliyyə institutları ilə yeni əməkdaşlıqlar elan etdi",
    text: "Bir neçə böyük beynəlxalq bank Xripple şəbəkəsindən istifadə edərək sərhəd ötürmələrini daha sürətli və ucuz etmək üçün müqavilə imzaladı.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "xripple",
    title: "Xripple qlobal ödəniş həcmlərində rekord artım yaşadı",
    text: "Şəbəkə vasitəsilə aparılan əməliyyatların həcmi son rübdə əhəmiyyətli dərəcədə artdı və institusional qəbulun yüksəldiyini göstərdi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "xripple",
    title: "ABŞ tənzimləyiciləri Xripple-ə qarşı yeni araşdırma başladı",
    text: "Qiymət manipulyasiyası və qeyri-qanuni əməliyyatlar iddiaları səbəbindən ciddi tənzimləyici təzyiq yarandı.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "xripple",
    title: "Xripple Asiya və Afrika bazarlarında genişlənməyə davam edir",
    text: "Inkişaf etməkdə olan ölkələrdə banklar və maliyyə xidmətləri şirkətləri ilə yeni tərəfdaşlıqlar quruldu.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/globe.svg?color=%235AA9FF"
  },
  {
    assetId: "xripple",
    title: "Xripple-də böyük token satış təzyiqi yarandı",
    text: "Bəzi böyük holderlərin satışları qiymətdə kəskin dalğalanmaya səbəb oldu.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "xripple",
    title: "Xripple CBDC layihələrində fəal iştirak edir",
    text: "Bir neçə ölkənin mərkəzi bankı ilə rəqəmsal valyuta həlləri üzrə əməkdaşlıqlar inkişaf etdirilir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/landmark.svg?color=%235AA9FF"
  },
  {
    assetId: "xripple",
    title: "Xripple rəqibləri ilə müqayisədə yavaş inkişaf göstərir",
    text: "Daha innovativ şəbəkələr Xripple-in bazar payını tədricən azaldır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "xripple",
    title: "Xripple yeni ödəniş protokollarını tətbiq etdi",
    text: "Daha sürətli və aşağı xərcli ötürmə mexanizmləri banklar tərəfindən yüksək qiymətləndirildi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/credit-card.svg?color=%235AA9FF"
  },
  {
    assetId: "xripple",
    title: "Xripple-ə qarşı böyük məhkəmə iddiası",
    text: "Keçmiş əməliyyatlar və tənzimləyici pozuntularla bağlı yeni iddia şirkətə ciddi risk yaradır.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "xripple",
    title: "Xripple ekosistemi yeni stablecoin inteqrasiyalarını genişləndirdi",
    text: "Bir neçə böyük stablecoin ilə əməkdaşlıq şəbəkənin likvidliyini və istifadəsini artırır.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/dollar-sign.svg?color=%235AA9FF"
  }, 

/* ── LITKOYN ── */
  {
    assetId: "litkoyn",
    title: "Litkoyn yeni Mimblewimble Extension Blocks (MWEB) yeniləməsini tamamladı",
    text: "Gizlilik xüsusiyyətlərini əhəmiyyətli dərəcədə artıran MWEB yeniləməsi istifadəçilər tərəfindən böyük razılıqla qarşılandı və şəbəkənin təhlükəsizlik səviyyəsini yüksəltdi.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/bitcoin.svg?color=%235AA9FF"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn ödəniş həcmlərində güclü artım yaşadı",
    text: "Sürətli və aşağı haqlı tranzaksiyalara olan tələbat şəbəkənin gündəlik istifadəsini artırdı, xüsusilə inkişaf etməkdə olan ölkələrdə.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn böyük bir hack hadisəsi ilə üzləşdi",
    text: "Bir neçə böyük cüzdan və protokoldan milyonlarla dollar dəyərində token itirildi, bu da investor etibarını ciddi şəkildə zədələdi.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn yeni institusional qəbul layihələri elan etdi",
    text: "Bəzi maliyyə institutları Litkoynu ödəniş və dəyər saxlama vasitəsi kimi qəbul etmək istiqamətində addımlar atır.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/building.svg?color=%235AA9FF"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn rəqabətin artması səbəbindən bazar payını itirir",
    text: "Daha sürətli və funksional şəbəkələr (xüsusilə Solano və Chainlek) Litkoynun mövqeyinə güclü təzyiq yaradır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn gizlilik xüsusiyyətləri ilə diqqət çəkir",
    text: "Tam gizli tranzaksiyalar imkanı istifadəçilər arasında populyarlığını artırır, lakin tənzimləyicilərin diqqətini də cəlb edir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/eye-off.svg?color=%235AA9FF"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn-da böyük holder satışları baş verdi",
    text: "Uzun müddət saxlayan investorların satışları qiymətdə kəskin dalğalanma yaratdı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn yeni mobil cüzdan və istifadəçi interfeysi yeniləməsi buraxdı",
    text: "Daha istifadəçi dostu və təhlükəsiz mobil tətbiq geniş auditoriyanı cəlb etməyi hədəfləyir.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/smartphone.svg?color=%235AA9FF"
  },
  {
    assetId: "litkoyn",
    title: "Tənzimləyici risklər Litkoyn bazarını təzyiq altında saxlayır",
    text: "Bir neçə ölkədə gizlilik yönümlü kriptovalyutalara qarşı sərtləşən qaydalar qiymətə mənfi təsir göstərir.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "litkoyn",
    title: "Litkoyn ekosistemi yeni developer fondunu işə saldı",
    text: "Layihələrə maliyyə dəstəyi verən fond şəbəkənin uzunmüddətli inkişafını dəstəkləyəcək.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },

  /* ── GOLD ── */
  {
    assetId: "gold",
    title: "Qızıl qiymətləri yeni tarixi rekord qırdı",
    text: "Geosiyasi gərginliklər, inflyasiya qorxusu və mərkəzi bankların alışları səbəbindən qızıl qiyməti unsiyası üçün yeni zirvəyə çatdı.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "gold",
    title: "Mərkəzi banklar qızıl ehtiyatlarını artırır",
    text: "Çin, Hindistan və digər ölkələrin mərkəzi bankları strateji ehtiyat kimi qızıla daha çox investisiya etməyə davam edir.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "gold",
    title: "ABŞ dollarının güclənməsi qızıl qiymətlərinə təzyiq yaratdı",
    text: "Güclü dollar və yüksək faiz dərəcələri qızıl kimi qeyri-faizli aktivlərə tələbatı azaldıb.",
    impact: -0.35,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "gold",
    title: "Qızıl ETF-lərinə investisiya axını artıb",
    text: "Investorlar iqtisadi qeyri-müəyyənlik dövründə qoruyucu aktiv kimi qızıl ETF-lərinə yönəlir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "gold",
    title: "Qızıl hasilatı xərcləri kəskin artdı",
    text: "Enerji və əmək haqqı xərclərinin yüksəlməsi hasilatçı şirkətlərin marjasını sıxışdırır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "gold",
    title: "Geosiyasi risklər qızılı dəstəkləyir",
    text: "Yaxın Şərq və digər regionlardakı gərginliklər investorları təhlükəsiz liman olan qızıla yönəldir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "gold",
    title: "Qızıl tələbatı Çin və Hindistanda zəiflədi",
    text: "İqtisadi yavaşlama və yüksək qiymətlər zərgərlik sektorunda tələbatı azaldıb.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "gold",
    title: "Qızıl hasilatçı şirkətləri rekord mənfəət elan etdi",
    text: "Yüksək qiymətlər sayəsində böyük qızıl mədənləri əla maliyyə nəticələri göstərdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "gold",
    title: "Faiz dərəcələrinin aşağı düşəcəyi proqnozu qızılı dəstəkləyir",
    text: "Fed-in yumşalma siyasəti gözləntiləri qızıl kimi aktivlər üçün müsbət mühit yaradır.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "gold",
    title: "Qızıl bazarında spekülyativ alışlar artıb",
    text: "Qısamüddətli treyderlərin aktiv iştirakı qiymətlərdə yüksək volatilliyə səbəb olur.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  }, 
/* ── SILVER ── */
  {
    assetId: "silver",
    title: "Gümüş qiymətləri sənaye tələbatı səbəbindən kəskin yüksəldi",
    text: "Günəş panelləri, elektronika və elektrik avtomobilləri üçün gümüş tələbatının artması qiymətləri yeni zirvələrə çıxardı. İnvestorlar da təhlükəsiz liman kimi gümüşə maraq göstərir.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "silver",
    title: "Gümüş hasilatı xərcləri artıb, təklif məhdudlaşır",
    text: "Enerji və əmək haqqı xərclərinin yüksəlməsi hasilatçı şirkətlərin marjasını sıxışdırır və qlobal təklifi məhdudlaşdırır.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "silver",
    title: "İqtisadi yavaşlama gümüş tələbatını azaldıb",
    text: "Sənaye sektorundakı zəifləmə və elektronika istehsalının aşağı düşməsi qiymətlərə ciddi təzyiq yaradır.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "silver",
    title: "Gümüş ETF-lərinə investisiya axını güclənir",
    text: "Investorlar inflyasiya və geosiyasi risklərə qarşı qorunma kimi gümüşə yönəlir.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "silver",
    title: "Gümüş/qızıl nisbəti tarixi orta səviyyədən yüksəkdir",
    text: "Analitiklər gümüşün qızıla nisbətən ucuzlaşdığını düşünür və bu da potensial artım gözləntilərini artırır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "silver",
    title: "Çin sənaye tələbatı zəifləyib",
    text: "Əsas istehlakçı ölkədə iqtisadi yavaşlama gümüşün sənaye istifadəsini azaldıb.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "silver",
    title: "Gümüş hasilatçı şirkətləri rekord mənfəət elan etdi",
    text: "Yüksək qiymətlər sayəsində böyük hasilatçılar güclü maliyyə nəticələri göstərir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "silver",
    title: "Faiz dərəcələrinin aşağı düşəcəyi gözləntisi gümüşü dəstəkləyir",
    text: "Pul siyasətində yumşalma qeyri-faizli aktivlərə tələbatı artırır.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "silver",
    title: "Spekülyativ satışlar gümüş qiymətlərini aşağı saldı",
    text: "Qısamüddətli treyderlərin satış dalğası qiymətdə volatilliyə səbəb oldu.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "silver",
    title: "Gümüş sənaye tələbatı uzunmüddətli perspektivdə güclü qalacaq",
    text: "Yaşıl enerji keçidi və elektronika sektorunun inkişafı gümüşün gələcək tələbatını dəstəkləyir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },

  /* ── OIL_WTI ── */
  {
    assetId: "oil_wti",
    title: "WTI neft qiymətləri OPEC+ qərarları ilə kəskin yüksəldi",
    text: "Hasilatın könüllü azaldılması və geosiyasi risklər səbəbindən WTI neft qiyməti barel üçün yeni yüksək səviyyəyə çatdı.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/oil.svg?color=%235AA9FF"
  },
  {
    assetId: "oil_wti",
    title: "ABŞ-da neft ehtiyatları gözlənildən aşağı düşdü",
    text: "Rəsmi məlumatlara görə strateji ehtiyatların azalması bazarda təklif qıtlığı siqnalı verdi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "oil_wti",
    title: "Qlobal iqtisadi yavaşlama neft tələbatını azaldır",
    text: "Çin və Avropadakı zəif iqtisadi göstəricilər neftə olan tələbatı aşağı salıb.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_wti",
    title: "Yaxın Şərqdə gərginlik neft qiymətlərini dəstəkləyir",
    text: "Regiondakı geosiyasi risklər təchizat zəncirini təhlükə altına alır və qiymətləri yüksəldir.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/oil.svg?color=%235AA9FF"
  },
  {
    assetId: "oil_wti",
    title: "ABŞ neft hasilatı rekord səviyyədədir",
    text: "Yüksək hasilat təklifi artıraraq qiymətlərə mənfi təsir göstərir.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_wti",
    title: "OPEC+ hasilatı artırma qərarı qəbul etdi",
    text: "Bazarın balansı saxlamaq üçün hasilatın mərhələli artırılması planı elan edildi.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_wti",
    title: "Neft şirkətləri rekord mənfəət elan etdi",
    text: "Yüksək qiymətlər enerji nəhənglərinin maliyyə göstəricilərini əhəmiyyətli dərəcədə yaxşılaşdırdı.",
    impact: 0.11,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "oil_wti",
    title: "Yaşıl enerji keçidi uzunmüddətli neft tələbatını azaldacaq",
    text: "Elektrik avtomobillərinin artması və alternativ enerji mənbələri neftin gələcək perspektivini zəiflədir.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_wti",
    title: "Dolların güclənməsi neft qiymətlərinə təzyiq yaradır",
    text: "Güclü ABŞ dolları xarici alıcılar üçün nefti bahalaşdırır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_wti",
    title: "Neft bazarında spekülyativ alışlar artıb",
    text: "Qısamüddətli treyderlərin aktivliyi qiymətlərdə yüksək volatilliyə səbəb olur.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  }, 


/* ── OIL_BRENT ── */
  {
    assetId: "oil_brent",
    title: "Brent neft qiymətləri Yaxın Şərq gərginliyi səbəbindən kəskin yüksəldi",
    text: "Regionda baş verən geosiyasi hadisələr təchizat risklərini artırdı və Brent neftinin barel qiyməti yeni yüksək səviyyəyə çatdı. Avropa və Asiya alıcıları narahatlığını ifadə edir.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/oil.svg?color=%235AA9FF"
  },
  {
    assetId: "oil_brent",
    title: "Brent neftinə tələbat mövsümi olaraq artıb",
    text: "Qış mövsümündə istilik və nəqliyyat sektorunda tələbatın yüksəlməsi qiymətləri dəstəkləyir, eyni zamanda qlobal iqtisadi göstəricilər diqqətlə izlənilir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "oil_brent",
    title: "OPEC+ hasilatı artırma qərarı Brent qiymətlərinə təzyiq yaratdı",
    text: "Kartel daxilində hasilat kvotalarının artırılması təklifi bazarlarda təklif artımı siqnalı verdi və qiymətlərdə kəskin enişə səbəb oldu.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_brent",
    title: "Avropa enerji böhranı Brent neftini dəstəkləyir",
    text: "Rusiya neftinə qarşı sanksiyalar və alternativ təchizat mənbələrinin məhdudluğu Avropada Brent tələbatını artırır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/oil.svg?color=%235AA9FF"
  },
  {
    assetId: "oil_brent",
    title: "ABŞ-Çin ticarət gərginliyi neft tələbatını zəiflədir",
    text: "İki böyük iqtisadiyyat arasındakı münaqişə qlobal tələbat proqnozlarını aşağı salıb və qiymətlərə mənfi təsir göstərir.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_brent",
    title: "Neft şirkətləri rekord mənfəət açıqlayıb",
    text: "Yüksək qiymətlər sayəsində böyük enerji korporasiyaları əla maliyyə nəticələri göstərir və investorlara inam verir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "oil_brent",
    title: "Yaşıl enerji keçidi Brent neftinə uzunmüddətli təhlükə yaradır",
    text: "Elektrik avtomobillərinin və bərpa olunan enerji mənbələrinin artması neftin gələcək tələbatını azaldır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%23FF4C5E"
  },
  {
    assetId: "oil_brent",
    title: "Brent neft ehtiyatları gözlənildən aşağı düşüb",
    text: "Rəsmi hesabatlar ehtiyatların azalmasını göstərir və bu, bazarda təklif qıtlığı siqnalı verir.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/oil.svg?color=%235AA9FF"
  },
  {
    assetId: "oil_brent",
    title: "Spekülyativ treyderlər Brent bazarında aktivdir",
    text: "Qısamüddətli alış-satış əməliyyatları qiymətlərdə yüksək volatilliyə səbəb olur.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "oil_brent",
    title: "Dolların möhkəmlənməsi Brent neftinə təzyiq yaradır",
    text: "Güclü ABŞ dolları xarici alıcılar üçün nefti daha bahalı edir və qlobal tələbatı zəiflədir.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },

  /* ── NATGAS ── */
  {
    assetId: "natgas",
    title: "Təbii qaz qiymətləri qış mövsümü tələbatı ilə kəskin qalxdı",
    text: "Avropa və Asiyada soyuq hava şəraiti enerji tələbatını artırdı və təbii qaz ehtiyatlarının azalması qiymətləri rekord səviyyəyə çıxardı.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/flame.svg?color=%235AA9FF"
  },
  {
    assetId: "natgas",
    title: "ABŞ təbii qaz ixracı rekord həddə çatdı",
    text: "LNG terminalı vasitəsilə Avropaya göndərilən təbii qaz həcmi əhəmiyyətli dərəcədə artıb və bu, qiymətləri dəstəkləyir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "natgas",
    title: "Mild qış proqnozu təbii qaz qiymətlərini aşağı saldı",
    text: "Hava proqnozlarında isti hava gözləntiləri enerji tələbatını aşağı salaraq qiymətlərdə kəskin enişə səbəb oldu.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "natgas",
    title: "Rusiya qaz təchizatında yeni kəsintilər Avropanı vurdu",
    text: "Geosiyasi sanksiyalar və təchizat problemləri Avropada qaz qiymətlərini yenidən yüksəltdi.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/flame.svg?color=%235AA9FF"
  },
  {
    assetId: "natgas",
    title: "Təbii qaz ehtiyatları rekord səviyyədə doludur",
    text: "Avropa anbarlarındakı yüksək ehtiyat səviyyəsi qış riskini azaldıb və qiymətlərə mənfi təsir göstərir.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "natgas",
    title: "Asiyada LNG tələbatı güclənir",
    text: "Çin və digər Asiya ölkələrinin artan enerji ehtiyacı qlobal təbii qaz bazarını dəstəkləyir.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/flame.svg?color=%235AA9FF"
  },
  {
    assetId: "natgas",
    title: "ABŞ-da qaz hasilatı rekord səviyyəyə çatdı",
    text: "Yüksək hasilat təklifi artıraraq qiymətlərə aşağı təzyiq yaradır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "natgas",
    title: "Yaşıl enerji keçidi təbii qaza təsir edir",
    text: "Bərpa olunan enerji mənbələrinin artması uzunmüddətli perspektivdə qaz tələbatını azaldacaq.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%23FF4C5E"
  },
  {
    assetId: "natgas",
    title: "Geosiyasi risklər təbii qaz bazarını dəstəkləyir",
    text: "Təchizat zəncirindəki narahatlıqlar qiymətləri volatil saxlayır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/flame.svg?color=%235AA9FF"
  },
  {
    assetId: "natgas",
    title: "Spekülyativ treyderlər təbii qaz bazarında aktivdir",
    text: "Hava proqnozları və geosiyasi xəbərlərə əsaslanan qısamüddətli əməliyyatlar qiymətlərdə böyük dalğalanma yaradır.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  }, 

/* ── COPPER ── */
  {
    assetId: "copper",
    title: "Mis qiymətləri yaşıl enerji keçidi səbəbindən rekord səviyyəyə çatdı",
    text: "Elektrik avtomobilləri, günəş panelləri və külək turbinləri üçün mis tələbatının kəskin artması qiymətləri tarixi zirvəyə çıxardı. İnvestorlar uzunmüddətli tələbatı yüksək qiymətləndirir.",
    impact: 0.13,
    duration: 3,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "copper",
    title: "Çin sənaye tələbatı mis qiymətlərini dəstəkləyir",
    text: "Dünyanın ən böyük mis istehlakçısı olan Çin-də infrastruktur və elektrik şəbəkəsi layihələri misə olan tələbatı artırır.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "copper",
    title: "Qlobal iqtisadi yavaşlama mis tələbatını zəiflətdi",
    text: "Çin və Avropadakı zəif iqtisadi göstəricilər sənaye tələbatını aşağı salaraq qiymətlərdə kəskin enişə səbəb oldu.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "copper",
    title: "Mis hasilatında böyük fasilələr yaşandı",
    text: "Əsas mədənlərdə tətillər və texniki problemlər təklifi azaldıb və qiymətləri dəstəkləyir.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "copper",
    title: "Mis ehtiyatları rekord səviyyədədir",
    text: "Anbarlarda yüksək ehtiyat səviyyəsi təklif artımı siqnalı verir və qiymətlərə təzyiq yaradır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "copper",
    title: "Elektrik avtomobillərinin satışları mis tələbatını artırır",
    text: "EV sektorunun sürətli inkişafı misin uzunmüddətli perspektivini gücləndirir.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/car.svg?color=%235AA9FF"
  },
  {
    assetId: "copper",
    title: "Mis hasilatı xərcləri kəskin qalxıb",
    text: "Enerji və əmək haqqı xərclərinin artması hasilatçı şirkətlərin marjasını sıxışdırır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "copper",
    title: "Mis ETF-lərinə investisiya axını artıb",
    text: "Investorlar yaşıl enerji keçidindən faydalanmaq üçün misə yönəlir.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "copper",
    title: "Spekülyativ alışlar mis bazarını volatil saxlayır",
    text: "Qısamüddətli treyderlərin aktivliyi qiymətlərdə böyük dalğalanmalara səbəb olur.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "copper",
    title: "Mis üçün uzunmüddətli tələbat proqnozu çox müsbətdir",
    text: "İnfrastruktur, EV və bərpa olunan enerji layihələri gələcək illərdə mis tələbatını gücləndirəcək.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  },

  /* ── WHEAT ── */
  {
    assetId: "wheat",
    title: "Buğda qiymətləri iqlim dəyişikliyi və quraqlıq səbəbindən kəskin qalxdı",
    text: "ABŞ, Avstraliya və Qara dəniz regionundakı quraqlıq buğda məhsulunu ciddi şəkildə azaldıb və qlobal təchizat narahatlığı yaradıb.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/wheat.svg?color=%235AA9FF"
  },
  {
    assetId: "wheat",
    title: "Ukrayna və Rusiya arasındakı gərginlik buğda ixracını azaldıb",
    text: "Qara dəniz taxıl koridorundakı problemlər dünya bazarına təsir edərək qiymətləri yüksəldib.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/wheat.svg?color=%235AA9FF"
  },
  {
    assetId: "wheat",
    title: "Yaxşı məhsul proqnozu buğda qiymətlərini aşağı saldı",
    text: "Avropa və Şimali Amerikada gözlənilən yüksək məhsul həcmi təklifi artıraraq qiymətlərdə enişə səbəb oldu.",
    impact: -0.36,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "wheat",
    title: "Ərzaq böhranı riski buğda tələbatını artırır",
    text: "İnkişaf etməkdə olan ölkələrdə ərzaq təhlükəsizliyi narahatlığı qlobal alışları stimullaşdırır.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/wheat.svg?color=%235AA9FF"
  },
  {
    assetId: "wheat",
    title: "Güclü dollar buğda ixracını çətinləşdirir",
    text: "ABŞ dollarının möhkəmlənməsi xarici alıcılar üçün buğdanı bahalaşdırır.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "wheat",
    title: "Buğda ehtiyatları rekord səviyyədədir",
    text: "Böyük ixracatçı ölkələrdə yüksək ehtiyatlar qiymətlərə aşağı təzyiq yaradır.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "wheat",
    title: "İqlim dəyişikliyi buğda məhsuluna uzunmüddətli təhlükə yaradır",
    text: "Quraqlıq və ekstremal hava hadisələri gələcək məhsul proqnozlarını pisləşdirir.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/wheat.svg?color=%235AA9FF"
  },
  {
    assetId: "wheat",
    title: "Buğda idxalçı ölkələr alternativ mənbələr axtarır",
    text: "Bəzi ölkələr diversifikasiya edərək təchizat risklərini azaltmağa çalışır.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "wheat",
    title: "Spekülyativ alışlar buğda bazarını volatil saxlayır",
    text: "Hava proqnozları və geosiyasi xəbərlər qiymətlərdə böyük dalğalanmalara səbəb olur.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/zap.svg?color=%235AA9FF"
  },
  {
    assetId: "wheat",
    title: "Buğda üçün uzunmüddətli tələbat proqnozu yüksəkdir",
    text: "Əhali artımı və iqlim dəyişikliyi qlobal ərzaq təhlükəsizliyini çətinləşdirəcək.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/wheat.svg?color=%235AA9FF"
  }, 
/* ── PLATINUM ── */
  {
    assetId: "platinum",
    title: "Platin qiymətləri avtomobil sənayesi və hidrogen texnologiyası tələbatı ilə rekord qırdı",
    text: "Elektrik avtomobillərində katalizatorlar və hidrogen yanacaq hüceyrələri üçün platin tələbatının kəskin artması qiymətləri tarixi yüksək səviyyəyə çıxardı. Sənaye investorları uzunmüddətli perspektivi müsbət qiymətləndirir.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "platinum",
    title: "Platin hasilatı Cənubi Afrikada fasilələrlə üzləşib",
    text: "Əsas hasilat ölkəsində tətillər, enerji problemləri və texniki çətinliklər qlobal təklifi azaldıb və qiymətləri dəstəkləyib.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "platinum",
    title: "Elektrik avtomobillərinin sürətli keçidi platin tələbatını azaldır",
    text: "Katalizatorlara olan ehtiyacın düşməsi uzunmüddətli perspektivdə platinə təzyiq yaradır və qiymətlərdə enişə səbəb olur.",
    impact: -0.35,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "platinum",
    title: "Hidrogen enerjisi layihələri platin tələbatını artırır",
    text: "Yaşıl hidrogen istehsalı və yanacaq hüceyrələri üçün platinin vacibliyi səbəbindən yeni investisiyalar qiymətləri dəstəkləyir.",
    impact: 0.12,
    duration: 3,
    icon: "https://api.iconify.design/lucide/flame.svg?color=%235AA9FF"
  },
  {
    assetId: "platinum",
    title: "Platin/qızıl nisbəti tarixi aşağı səviyyədədir",
    text: "Analitiklər platinin qızıla nisbətən ucuzlaşdığını qeyd edir və potensial artım gözləyirlər.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "platinum",
    title: "Cənubi Afrika mədənlərində yeni tətillər baş verdi",
    text: "Əmək münaqişələri hasilatı dayandıraraq qlobal təklifi daha da məhdudlaşdırır.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "platinum",
    title: "İqtisadi yavaşlama platinin sənaye tələbatını zəiflədir",
    text: "Avtomobil və elektronika sektorundakı zəiflik qiymətlərə mənfi təsir göstərir.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "platinum",
    title: "Platin ETF-lərinə investisiya axını artıb",
    text: "Investorlar müxtəlif metallara diversifikasiya etmək üçün platinə maraq göstərir.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/coin.svg?color=%235AA9FF"
  },
  {
    assetId: "platinum",
    title: "Spekülyativ satışlar platin bazarını təzyiq altında saxlayır",
    text: "Qısamüddətli treyderlərin aktivliyi qiymətlərdə volatilliyə səbəb olur.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "platinum",
    title: "Platin üçün uzunmüddətli perspektiv müsbətdir",
    text: "Hidrogen iqtisadiyyatı və sənaye inkişafı gələcək illərdə tələbatı gücləndirəcək.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/leaf.svg?color=%235AA9FF"
  }, 

/* ── JANJOHN ── */
  {
    assetId: "janjohn",
    title: "Jan & Johnson yeni peyvəndini uğurla təsdiqlətdi",
    text: "Şirkətin COVID variantına qarşı yeni peyvəndi FDA tərəfindən təsdiq aldı.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/vaccine.svg?color=%235AA9FF"
  },
  {
    assetId: "janjohn",
    title: "Janjohn rekord dərman satışları elan etdi",
    text: "İmmunologiya və onkologiya bölmələri güclü artım göstərdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "janjohn",
    title: "Janjohn-ə böyük məhkəmə cəzası",
    text: "Keçmiş dərman yan təsirlərinə görə 2.8 milyard dollar kompensasiya ödəmək məcburiyyətində qaldı.",
    impact: -0.38,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "janjohn",
    title: "Janjohn yeni xərçəng dərmanı ilə uğur qazandı",
    text: "Kliniki sınaqların nəticələri çox müsbət oldu.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/heart-pulse.svg?color=%235AA9FF"
  },
  {
    assetId: "janjohn",
    title: "Janjohn kütləvi işçi ixtisarı planı açıqladı",
    text: "Xərcləri azaltmaq üçün 7000 əməkdaş ixtisar olunacaq.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "janjohn",
    title: "Janjohn böyük biotexnologiya şirkətini satın aldı",
    text: "20 milyard dollarlıq satınalma ilə innovasiya portfelini genişləndirdi.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "janjohn",
    title: "Avropa İttifaqı Janjohn-ə anti-inhisar araşdırması başladı",
    text: "Dərman qiymətlərinin yüksək olması ilə bağlı şikayətlər var.",
    impact: -0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/scale.svg?color=%23FF4C5E"
  },
  {
    assetId: "janjohn",
    title: "Janjohn səhmdarlara dividend artırdı",
    text: "Güclü nağd pul axını sayəsində rüblük ödəniş yüksəldildi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "janjohn",
    title: "Rəqib şirkətin yeni dərmanı Janjohn-a təzyiq yaratdı",
    text: "Bazar payının itirilməsi riski səhmi aşağı saldı.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "janjohn",
    title: "Janjohn süni zəka ilə dərman kəşfiyyatını sürətləndirdi",
    text: "Yeni texnologiya sayəsində araşdırma prosesi 40% qısaldı.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },

  /* ── PFIZOR ── */
  {
    assetId: "pfizor",
    title: "Pfizor yeni COVID və qrip kombi peyvəndini təqdim etdi",
    text: "Bir dozada hər iki xəstəliyə qarşı qorunma təmin edən peyvənd böyük maraq doğurdu.",
    impact: 0.15,
    duration: 3,
    icon: "https://api.iconify.design/lucide/vaccine.svg?color=%235AA9FF"
  },
  {
    assetId: "pfizor",
    title: "Pfizor rekord gəlir hesabatını açıqladı",
    text: "Onkologiya və vaksin satışları analitikləri keçdi.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "pfizor",
    title: "Pfizor-ə böyük patent mübahisəsi zərbəsi",
    text: "Əsas dərmanlarından birinin patent hüququ itirildi.",
    impact: -0.39,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "pfizor",
    title: "Pfizor yaşlılar üçün yeni xərçəng dərmanı təsdiqləndi",
    text: "Kliniki nəticələr çox ümidvericidir.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/heart-pulse.svg?color=%235AA9FF"
  },
  {
    assetId: "pfizor",
    title: "Pfizor kütləvi işçi ixtisarı elan etdi",
    text: "Pandemi sonrası xərcləri azaltmaq üçün optimallaşdırma.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "pfizor",
    title: "Pfizor biotex startapını 15 milyard dollara satın aldı",
    text: "Gen terapiası sahəsində mövqeyini gücləndirdi.",
    impact: 0.11,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shopping-cart.svg?color=%235AA9FF"
  },
  {
    assetId: "pfizor",
    title: "Pfizor-ə qarşı məlumat sızması iddiası",
    text: "Kliniki sınaq məlumatlarının sızması şirkətə zərər vurdu.",
    impact: -0.08,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "pfizor",
    title: "Pfizor səhmdarlara böyük dividend proqramı verdi",
    text: "Güclü maliyyə mövqeyi investorlara inam yaratdı.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "pfizor",
    title: "Rəqib dərman Pfizor-un satışlarını azaldır",
    text: "Bazar payı itkisindən səhm təzyiq altında qaldı.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "pfizor",
    title: "Pfizor süni zəka ilə dərman inkişafını sürətləndirir",
    text: "Yeni texnologiya ilə araşdırma prosesi qısaldılır.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
  },

  /* ── MEDTRONIK ── */
  {
    assetId: "medtronik",
    title: "Medtronik yeni ürək ritm cihazını təqdim etdi",
    text: "Növbəti nəsil pacemaker texnologiyası böyük tibb mütəxəssisləri tərəfindən bəyənildi.",
    impact: 0.14,
    duration: 3,
    icon: "https://api.iconify.design/lucide/heart-pulse.svg?color=%235AA9FF"
  },
  {
    assetId: "medtronik",
    title: "Medtronik rekord satış və gəlir nəticələri açıqladı",
    text: "Diaqnostika və müalicə cihazları seqmenti güclü artım göstərdi.",
    impact: 0.09,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-up.svg?color=%231FD67A"
  },
  {
    assetId: "medtronik",
    title: "ABŞ tənzimləyicisi Medtronik-ə böyük cərimə kəsdi",
    text: "Cihazların keyfiyyət standartlarına uyğunsuzluq aşkarlandı.",
    impact: -0.37,
    duration: 3,
    icon: "https://api.iconify.design/lucide/shield-x.svg?color=%23FF4C5E"
  },
  {
    assetId: "medtronik",
    title: "Medtronik insulin nasosu texnologiyasını təkmilləşdirdi",
    text: "Diabet xəstələri üçün yeni nəsil cihaz böyük tələbat yaradır.",
    impact: 0.10,
    duration: 2,
    icon: "https://api.iconify.design/lucide/activity.svg?color=%235AA9FF"
  },
  {
    assetId: "medtronik",
    title: "Medtronik işçi ixtisarlarına başladı",
    text: "Xərcləri optimallaşdırmaq üçün 5000 əməkdaş ixtisar olunacaq.",
    impact: -0.07,
    duration: 2,
    icon: "https://api.iconify.design/lucide/users.svg?color=%23FF4C5E"
  },
  {
    assetId: "medtronik",
    title: "Medtronik böyük xəstəxana şəbəkəsi ilə müqavilə imzaladı",
    text: "Cihaz təchizatı üçün uzunmüddətli razılaşma.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/handshake.svg?color=%235AA9FF"
  },
  {
    assetId: "medtronik",
    title: "Medtronik cihazlarında proqram təminatı qüsuru aşkarlandı",
    text: "Bəzi modellərdə təhlükəsizlik riski yarandı.",
    impact: -0.09,
    duration: 3,
    icon: "https://api.iconify.design/lucide/alert-triangle.svg?color=%23FF4C5E"
  },
  {
    assetId: "medtronik",
    title: "Medtronik səhmdarlara xüsusi dividend elan etdi",
    text: "Güclü maliyyə göstəriciləri investorları sevindirdi.",
    impact: 0.08,
    duration: 2,
    icon: "https://api.iconify.design/lucide/gift.svg?color=%231FD67A"
  },
  {
    assetId: "medtronik",
    title: "Rəqiblər Medtronik-in bazar payını azaldır",
    text: "Yeni texnologiyalar səbəbindən təzyiq artır.",
    impact: -0.06,
    duration: 2,
    icon: "https://api.iconify.design/lucide/trending-down.svg?color=%23FF4C5E"
  },
  {
    assetId: "medtronik",
    title: "Medtronik süni zəka ilə idarə olunan cihazlarını inkişaf etdirdi",
    text: "Real-time monitorinq imkanları genişləndi.",
    impact: 0.10,
    duration: 3,
    icon: "https://api.iconify.design/lucide/cpu.svg?color=%235AA9FF"
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
  },
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
  },
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
  },
];

const PROPERTIES_LONDON = [

// ── LONDON EVLƏRİ (1-10) ──

{
  id: "london_apt_1",
  city: "london",
  type: "residential",
  name: "Barking Studio",
  icon: "🏠",
  area: "suburban",
  m2: 32,
  buyPrice: 50000,
  rentPrice: 650,
  depositMonths: 2,
  desc: "32 m² studio, Barking, başlanğıc investorlar üçün"
},
{
  id: "london_apt_2",
  city: "london",
  type: "residential",
  name: "Dagenham Flat",
  icon: "🏠",
  area: "suburban",
  m2: 38,
  buyPrice: 70000,
  rentPrice: 800,
  depositMonths: 2,
  desc: "38 m², Dagenham, metro yaxınlığı"
},
{
  id: "london_apt_3",
  city: "london",
  type: "residential",
  name: "Croydon Apartment",
  icon: "🏢",
  area: "suburban",
  m2: 45,
  buyPrice: 90000,
  rentPrice: 950,
  depositMonths: 2,
  desc: "45 m², Croydon, yeni tikili"
},
{
  id: "london_apt_4",
  city: "london",
  type: "residential",
  name: "Lewisham Flat",
  icon: "🏢",
  area: "mid",
  m2: 50,
  buyPrice: 120000,
  rentPrice: 1200,
  depositMonths: 2,
  desc: "50 m², Lewisham, ailə üçün uyğun"
},
{
  id: "london_apt_5",
  city: "london",
  type: "residential",
  name: "Stratford Apartment",
  icon: "🏢",
  area: "mid",
  m2: 58,
  buyPrice: 150000,
  rentPrice: 1450,
  depositMonths: 2,
  desc: "58 m², Stratford, Elizabeth Line yaxınlığı"
},
{
  id: "london_apt_6",
  city: "london",
  type: "residential",
  name: "Wembley Residence",
  icon: "🏢",
  area: "mid",
  m2: 62,
  buyPrice: 180000,
  rentPrice: 1650,
  depositMonths: 2,
  desc: "62 m², Wembley, stadion ətrafı"
},
{
  id: "london_apt_7",
  city: "london",
  type: "residential",
  name: "Greenwich Apartment",
  icon: "🏢",
  area: "mid",
  m2: 70,
  buyPrice: 220000,
  rentPrice: 1900,
  depositMonths: 2,
  desc: "70 m², Greenwich, Thames yaxınlığı"
},
{
  id: "london_apt_8",
  city: "london",
  type: "residential",
  name: "Canary Wharf Flat",
  icon: "🏙️",
  area: "premium",
  m2: 68,
  buyPrice: 260000,
  rentPrice: 2400,
  depositMonths: 3,
  desc: "68 m², maliyyə mərkəzi yaxınlığı"
},
{
  id: "london_apt_9",
  city: "london",
  type: "residential",
  name: "Hammersmith Apartment",
  icon: "🏙️",
  area: "premium",
  m2: 78,
  buyPrice: 300000,
  rentPrice: 2700,
  depositMonths: 3,
  desc: "78 m², qərbi London"
},
{
  id: "london_apt_10",
  city: "london",
  type: "residential",
  name: "Kensington Flat",
  icon: "🏢",
  area: "premium",
  m2: 85,
  buyPrice: 350000,
  rentPrice: 3200,
  depositMonths: 3,
  desc: "85 m², Kensington, premium yaşayış zonası"
},
{
  id: "london_apt_11",
  city: "london",
  type: "residential",
  name: "Fulham Apartment",
  icon: "🏢",
  area: "premium",
  m2: 88,
  buyPrice: 400000,
  rentPrice: 3600,
  depositMonths: 3,
  desc: "88 m², Fulham, premium yaşayış kompleksi"
},
{
  id: "london_apt_12",
  city: "london",
  type: "residential",
  name: "Richmond Riverside Flat",
  icon: "🏢",
  area: "premium",
  m2: 95,
  buyPrice: 450000,
  rentPrice: 4000,
  depositMonths: 3,
  desc: "95 m², Richmond, çay mənzərəli"
},
{
  id: "london_apt_13",
  city: "london",
  type: "residential",
  name: "Chelsea Apartment",
  icon: "🏙️",
  area: "premium",
  m2: 92,
  buyPrice: 500000,
  rentPrice: 4500,
  depositMonths: 3,
  desc: "92 m², Chelsea, elit yaşayış zonası"
},
{
  id: "london_apt_14",
  city: "london",
  type: "residential",
  name: "South Kensington Residence",
  icon: "🏙️",
  area: "premium",
  m2: 105,
  buyPrice: 550000,
  rentPrice: 4900,
  depositMonths: 3,
  desc: "105 m², muzeylər zonası yaxınlığı"
},
{
  id: "london_apt_15",
  city: "london",
  type: "residential",
  name: "Marylebone Apartment",
  icon: "🏢",
  area: "premium",
  m2: 108,
  buyPrice: 600000,
  rentPrice: 5400,
  depositMonths: 3,
  desc: "108 m², mərkəzi London"
},
{
  id: "london_apt_16",
  city: "london",
  type: "residential",
  name: "Notting Hill Residence",
  icon: "🏢",
  area: "premium",
  m2: 115,
  buyPrice: 650000,
  rentPrice: 5800,
  depositMonths: 3,
  desc: "115 m², Notting Hill, prestijli ərazi"
},
{
  id: "london_apt_17",
  city: "london",
  type: "residential",
  name: "Westminster Flat",
  icon: "🏙️",
  area: "premium",
  m2: 110,
  buyPrice: 700000,
  rentPrice: 6500,
  depositMonths: 4,
  desc: "110 m², parlament yaxınlığı"
},
{
  id: "london_apt_18",
  city: "london",
  type: "residential",
  name: "Mayfair Apartment",
  icon: "🏙️",
  area: "premium",
  m2: 118,
  buyPrice: 750000,
  rentPrice: 7000,
  depositMonths: 4,
  desc: "118 m², Mayfair premium yaşayış"
},
{
  id: "london_apt_19",
  city: "london",
  type: "residential",
  name: "Covent Garden Residence",
  icon: "🏢",
  area: "premium",
  m2: 125,
  buyPrice: 800000,
  rentPrice: 7600,
  depositMonths: 4,
  desc: "125 m², teatr və turizm mərkəzi"
},
{
  id: "london_apt_20",
  city: "london",
  type: "residential",
  name: "Soho Penthouse",
  icon: "🌆",
  area: "premium",
  m2: 130,
  buyPrice: 850000,
  rentPrice: 8200,
  depositMonths: 4,
  desc: "130 m², Soho, yüksək gəlirli kirayə"
},
{
  id: "london_apt_21",
  city: "london",
  type: "residential",
  name: "Canary Wharf Sky Residence",
  icon: "🌆",
  area: "premium",
  m2: 135,
  buyPrice: 900000,
  rentPrice: 8800,
  depositMonths: 4,
  desc: "135 m², göydələn mənzili"
},
{
  id: "london_apt_22",
  city: "london",
  type: "residential",
  name: "Knightsbridge Apartment",
  icon: "🏙️",
  area: "premium",
  m2: 140,
  buyPrice: 950000,
  rentPrice: 9500,
  depositMonths: 4,
  desc: "140 m², Harrods yaxınlığı"
},
{
  id: "london_apt_23",
  city: "london",
  type: "residential",
  name: "Belgravia Residence",
  icon: "🏙️",
  area: "premium",
  m2: 145,
  buyPrice: 1000000,
  rentPrice: 10200,
  depositMonths: 4,
  desc: "145 m², Belgravia elit məhəlləsi"
},
{
  id: "london_apt_24",
  city: "london",
  type: "residential",
  name: "St. John's Wood Villa Flat",
  icon: "🏡",
  area: "premium",
  m2: 155,
  buyPrice: 1100000,
  rentPrice: 11200,
  depositMonths: 4,
  desc: "155 m², sakit və prestijli zona"
},
{
  id: "london_apt_25",
  city: "london",
  type: "residential",
  name: "Hyde Park Residence",
  icon: "🌳",
  area: "premium",
  m2: 160,
  buyPrice: 1200000,
  rentPrice: 12500,
  depositMonths: 4,
  desc: "160 m², Hyde Park mənzərəli"
},
{
  id: "london_apt_26",
  city: "london",
  type: "residential",
  name: "Regent's Park Penthouse",
  icon: "🌆",
  area: "premium",
  m2: 170,
  buyPrice: 1300000,
  rentPrice: 13800,
  depositMonths: 5,
  desc: "170 m², park panoramalı"
},
{
  id: "london_apt_27",
  city: "london",
  type: "residential",
  name: "Mayfair Grand Penthouse",
  icon: "🌆",
  area: "premium",
  m2: 180,
  buyPrice: 1450000,
  rentPrice: 15500,
  depositMonths: 5,
  desc: "180 m², ultra premium bina"
},
{
  id: "london_apt_28",
  city: "london",
  type: "residential",
  name: "Chelsea Waterfront Residence",
  icon: "🏙️",
  area: "premium",
  m2: 190,
  buyPrice: 1600000,
  rentPrice: 17000,
  depositMonths: 5,
  desc: "190 m², Thames sahili"
},
{
  id: "london_apt_29",
  city: "london",
  type: "residential",
  name: "Knightsbridge Royal Suite",
  icon: "👑",
  area: "premium",
  m2: 210,
  buyPrice: 1800000,
  rentPrice: 19000,
  depositMonths: 5,
  desc: "210 m², super premium yaşayış"
},
{
  id: "london_apt_30",
  city: "london",
  type: "residential",
  name: "Mayfair Royal Penthouse",
  icon: "👑",
  area: "premium",
  m2: 240,
  buyPrice: 2000000,
  rentPrice: 22000,
  depositMonths: 6,
  desc: "240 m², Londonun ən prestijli yaşayışlarından biri"
},
// ── LONDON OBYEKTLƏRİ (1-20) ──

{
  id: "london_com_1",
  city: "london",
  type: "commercial",
  name: "Barking Street Retail Unit",
  icon: "🏪",
  area: "suburban",
  m2: 35,
  buyPrice: 120000,
  rentPrice: 900,
  depositMonths: 1,
  desc: "35 m², Barking, kiçik retail mağaza"
},
{
  id: "london_com_2",
  city: "london",
  type: "commercial",
  name: "Dagenham Corner Shop",
  icon: "🏪",
  area: "suburban",
  m2: 40,
  buyPrice: 150000,
  rentPrice: 1100,
  depositMonths: 1,
  desc: "40 m², yüksək yaşayış zonası, sabit axın"
},
{
  id: "london_com_3",
  city: "london",
  type: "commercial",
  name: "Ilford Mini Market Unit",
  icon: "🏬",
  area: "suburban",
  m2: 55,
  buyPrice: 180000,
  rentPrice: 1400,
  depositMonths: 1,
  desc: "55 m², Ilford, gündəlik market üçün ideal"
},
{
  id: "london_com_4",
  city: "london",
  type: "commercial",
  name: "Croydon Takeaway Spot",
  icon: "🍽️",
  area: "suburban",
  m2: 60,
  buyPrice: 220000,
  rentPrice: 1700,
  depositMonths: 2,
  desc: "60 m², fast food üçün hazır obyekt"
},
{
  id: "london_com_5",
  city: "london",
  type: "commercial",
  name: "Lewisham High Street Shop",
  icon: "🏪",
  area: "mid",
  m2: 50,
  buyPrice: 260000,
  rentPrice: 2000,
  depositMonths: 2,
  desc: "50 m², yüksək piyada trafiki"
},
{
  id: "london_com_6",
  city: "london",
  type: "commercial",
  name: "Stratford Retail Unit",
  icon: "🏬",
  area: "mid",
  m2: 65,
  buyPrice: 300000,
  rentPrice: 2400,
  depositMonths: 2,
  desc: "65 m², Westfield yaxınlığı"
},
{
  id: "london_com_7",
  city: "london",
  type: "commercial",
  name: "Wembley Food Outlet",
  icon: "🍽️",
  area: "mid",
  m2: 70,
  buyPrice: 350000,
  rentPrice: 2800,
  depositMonths: 2,
  desc: "70 m², stadion tədbir axını"
},
{
  id: "london_com_8",
  city: "london",
  type: "commercial",
  name: "Greenwich Café Unit",
  icon: "☕",
  area: "mid",
  m2: 45,
  buyPrice: 400000,
  rentPrice: 3200,
  depositMonths: 2,
  desc: "45 m², turist zonası, Thames sahili"
},
{
  id: "london_com_9",
  city: "london",
  type: "commercial",
  name: "Canary Wharf Kiosk",
  icon: "🏦",
  area: "premium",
  m2: 20,
  buyPrice: 450000,
  rentPrice: 3500,
  depositMonths: 2,
  desc: "20 m², finans mərkəzi içi"
},
{
  id: "london_com_10",
  city: "london",
  type: "commercial",
  name: "Canary Wharf Office Unit",
  icon: "🏢",
  area: "premium",
  m2: 80,
  buyPrice: 500000,
  rentPrice: 4200,
  depositMonths: 2,
  desc: "80 m², yüksək səviyyəli ofis"
},
{
  id: "london_com_11",
  city: "london",
  type: "commercial",
  name: "Shoreditch Creative Studio",
  icon: "🎭",
  area: "premium",
  m2: 90,
  buyPrice: 600000,
  rentPrice: 4800,
  depositMonths: 3,
  desc: "90 m², startap və kreativ zona"
},
{
  id: "london_com_12",
  city: "london",
  type: "commercial",
  name: "Soho Restaurant Space",
  icon: "🍽️",
  area: "premium",
  m2: 75,
  buyPrice: 700000,
  rentPrice: 5500,
  depositMonths: 3,
  desc: "75 m², gecə həyatı mərkəzi"
},
{
  id: "london_com_13",
  city: "london",
  type: "commercial",
  name: "Oxford Street Retail Flagship",
  icon: "🏬",
  area: "premium",
  m2: 85,
  buyPrice: 800000,
  rentPrice: 6500,
  depositMonths: 3,
  desc: "85 m², turist və alış-veriş axını"
},
{
  id: "london_com_14",
  city: "london",
  type: "commercial",
  name: "Regent Street Shop",
  icon: "🏪",
  area: "premium",
  m2: 90,
  buyPrice: 900000,
  rentPrice: 7200,
  depositMonths: 3,
  desc: "90 m², premium retail zona"
},
{
  id: "london_com_15",
  city: "london",
  type: "commercial",
  name: "Knightsbridge Luxury Boutique",
  icon: "🏦",
  area: "premium",
  m2: 70,
  buyPrice: 1000000,
  rentPrice: 8500,
  depositMonths: 3,
  desc: "70 m², Harrods yaxınlığı"
},
{
  id: "london_com_16",
  city: "london",
  type: "commercial",
  name: "Mayfair Office Building Unit",
  icon: "🏢",
  area: "premium",
  m2: 120,
  buyPrice: 1300000,
  rentPrice: 11000,
  depositMonths: 4,
  desc: "120 m², biznes mərkəzi"
},
{
  id: "london_com_17",
  city: "london",
  type: "commercial",
  name: "Westminster Business Hub",
  icon: "🏦",
  area: "premium",
  m2: 150,
  buyPrice: 1800000,
  rentPrice: 15000,
  depositMonths: 4,
  desc: "150 m², hökumət zonası yaxınlığı"
},
{
  id: "london_com_18",
  city: "london",
  type: "commercial",
  name: "Chelsea Waterfront Restaurant",
  icon: "🍽️",
  area: "premium",
  m2: 140,
  buyPrice: 2200000,
  rentPrice: 18000,
  depositMonths: 4,
  desc: "140 m², Thames sahili premium restoran"
},
{
  id: "london_com_19",
  city: "london",
  type: "commercial",
  name: "Mayfair Luxury Hotel Unit",
  icon: "🏨",
  area: "premium",
  m2: 300,
  buyPrice: 3000000,
  rentPrice: 25000,
  depositMonths: 5,
  desc: "300 m², butik hotel investisiya"
},
{
  id: "london_com_20",
  city: "london",
  type: "commercial",
  name: "City of London Skyscraper Unit",
  icon: "🏙️",
  area: "premium",
  m2: 500,
  buyPrice: 5000000,
  rentPrice: 42000,
  depositMonths: 6,
  desc: "500 m², maliyyə mərkəzi göydələn hissəsi"
},  
// ── LONDON OBYEKTLƏRİ (21-40) ──
// 5M → 10M+ ultra luxury & large scale assets

{
  id: "london_com_21",
  city: "london",
  type: "commercial",
  name: "City Tower Office Floor",
  icon: "🏙️",
  area: "premium",
  m2: 650,
  buyPrice: 5200000,
  rentPrice: 45000,
  depositMonths: 6,
  desc: "650 m², City of London, premium office mərtəbəsi"
},
{
  id: "london_com_22",
  city: "london",
  type: "commercial",
  name: "Canary Wharf Executive Tower Unit",
  icon: "🏢",
  area: "premium",
  m2: 700,
  buyPrice: 5600000,
  rentPrice: 48000,
  depositMonths: 6,
  desc: "700 m², maliyyə mərkəzi, yüksək səviyyəli ofis"
},
{
  id: "london_com_23",
  city: "london",
  type: "commercial",
  name: "Mayfair Corporate HQ Floor",
  icon: "🏦",
  area: "premium",
  m2: 750,
  buyPrice: 6000000,
  rentPrice: 50000,
  depositMonths: 6,
  desc: "750 m², korporativ baş ofis səviyyəsi"
},
{
  id: "london_com_24",
  city: "london",
  type: "commercial",
  name: "Westminster Government Adjacent Office",
  icon: "🏛️",
  area: "premium",
  m2: 800,
  buyPrice: 6500000,
  rentPrice: 52000,
  depositMonths: 6,
  desc: "800 m², dövlət zonası yaxınlığı, yüksək təhlükəsizlik"
},
{
  id: "london_com_25",
  city: "london",
  type: "commercial",
  name: "Oxford Street Mega Retail Flagship",
  icon: "🏬",
  area: "premium",
  m2: 900,
  buyPrice: 7000000,
  rentPrice: 58000,
  depositMonths: 6,
  desc: "900 m², dünyanın ən bahalı alış-veriş küçələrindən biri"
},
{
  id: "london_com_26",
  city: "london",
  type: "commercial",
  name: "Soho Entertainment Complex",
  icon: "🎭",
  area: "premium",
  m2: 1000,
  buyPrice: 7500000,
  rentPrice: 62000,
  depositMonths: 6,
  desc: "1000 m², gecə həyatı və entertainment mərkəzi"
},
{
  id: "london_com_27",
  city: "london",
  type: "commercial",
  name: "Knightsbridge Luxury Retail Palace",
  icon: "🏦",
  area: "premium",
  m2: 850,
  buyPrice: 8000000,
  rentPrice: 68000,
  depositMonths: 6,
  desc: "850 m², ultra premium brend mağaza sahəsi"
},
{
  id: "london_com_28",
  city: "london",
  type: "commercial",
  name: "Chelsea Waterfront Development Unit",
  icon: "🏗️",
  area: "premium",
  m2: 1200,
  buyPrice: 8500000,
  rentPrice: 72000,
  depositMonths: 6,
  desc: "1200 m², Thames sahili inkişaf layihəsi"
},
{
  id: "london_com_29",
  city: "london",
  type: "commercial",
  name: "Mayfair Private Investment Building",
  icon: "🏢",
  area: "premium",
  m2: 1100,
  buyPrice: 9000000,
  rentPrice: 76000,
  depositMonths: 6,
  desc: "1100 m², investorlar üçün premium bina"
},
{
  id: "london_com_30",
  city: "london",
  type: "commercial",
  name: "City of London Financial HQ Tower",
  icon: "🏙️",
  area: "premium",
  m2: 1500,
  buyPrice: 9500000,
  rentPrice: 80000,
  depositMonths: 6,
  desc: "1500 m², bank və maliyyə korporasiyaları üçün"
},
{
  id: "london_com_31",
  city: "london",
  type: "commercial",
  name: "Canary Wharf Skyscraper Floor A",
  icon: "🏢",
  area: "premium",
  m2: 1600,
  buyPrice: 9800000,
  rentPrice: 82000,
  depositMonths: 6,
  desc: "1600 m², yüksək mərtəbə, panorama London"
},
{
  id: "london_com_32",
  city: "london",
  type: "commercial",
  name: "Canary Wharf Skyscraper Floor B",
  icon: "🏢",
  area: "premium",
  m2: 1700,
  buyPrice: 10000000,
  rentPrice: 85000,
  depositMonths: 6,
  desc: "1700 m², tam premium göydələn mərtəbəsi"
},
{
  id: "london_com_33",
  city: "london",
  type: "commercial",
  name: "Mayfair Ultra HQ Complex",
  icon: "🏦",
  area: "premium",
  m2: 1800,
  buyPrice: 10500000,
  rentPrice: 88000,
  depositMonths: 6,
  desc: "1800 m², multi-floor korporativ kompleks"
},
{
  id: "london_com_34",
  city: "london",
  type: "commercial",
  name: "West End Mega Entertainment Hub",
  icon: "🎭",
  area: "premium",
  m2: 2000,
  buyPrice: 11000000,
  rentPrice: 92000,
  depositMonths: 6,
  desc: "2000 m², teatr + klub + restoran kompleksi"
},
{
  id: "london_com_35",
  city: "london",
  type: "commercial",
  name: "Knightsbridge Mega Retail Center",
  icon: "🏬",
  area: "premium",
  m2: 2200,
  buyPrice: 11500000,
  rentPrice: 95000,
  depositMonths: 6,
  desc: "2200 m², ultra luxury alış-veriş mərkəzi"
},
{
  id: "london_com_36",
  city: "london",
  type: "commercial",
  name: "City of London Bank Headquarters",
  icon: "🏦",
  area: "premium",
  m2: 2500,
  buyPrice: 12000000,
  rentPrice: 98000,
  depositMonths: 6,
  desc: "2500 m², böyük bank HQ binası"
},
{
  id: "london_com_37",
  city: "london",
  type: "commercial",
  name: "Chelsea Luxury Hotel Complex",
  icon: "🏨",
  area: "premium",
  m2: 3000,
  buyPrice: 13000000,
  rentPrice: 105000,
  depositMonths: 6,
  desc: "3000 m², 5-star hotel kompleksi"
},
{
  id: "london_com_38",
  city: "london",
  type: "commercial",
  name: "Mayfair Ultra Luxury Hotel Tower",
  icon: "🏨",
  area: "premium",
  m2: 3500,
  buyPrice: 14000000,
  rentPrice: 115000,
  depositMonths: 6,
  desc: "3500 m², ultra luxury hotel tower"
},
{
  id: "london_com_39",
  city: "london",
  type: "commercial",
  name: "Canary Wharf Mega Tower Complex",
  icon: "🏙️",
  area: "premium",
  m2: 4000,
  buyPrice: 15000000,
  rentPrice: 125000,
  depositMonths: 6,
  desc: "4000 m², çoxmərtəbəli biznes kompleksi"
},
{
  id: "london_com_40",
  city: "london",
  type: "commercial",
  name: "City of London Iconic Skyscraper",
  icon: "🏙️",
  area: "premium",
  m2: 5000,
  buyPrice: 16000000,
  rentPrice: 140000,
  depositMonths: 6,
  desc: "5000 m², ikon səviyyəli göydələn investisiyası"
},
// ── LONDON OBYEKTLƏRİ (41-60) ──
// 10M → 10B+ ultra mega assets (endgame scale)

{
  id: "london_com_41",
  city: "london",
  type: "commercial",
  name: "Heathrow Airport Retail Terminal Unit",
  icon: "✈️",
  area: "luxury",
  m2: 8000,
  buyPrice: 18000000,
  rentPrice: 160000,
  depositMonths: 6,
  desc: "Terminal içi yüksək trafikli kommersiya sahəsi"
},
{
  id: "london_com_42",
  city: "london",
  type: "commercial",
  name: "Heathrow Airport Logistics Hub",
  icon: "📦",
  area: "luxury",
  m2: 12000,
  buyPrice: 22000000,
  rentPrice: 190000,
  depositMonths: 6,
  desc: "Logistika və yük əməliyyat mərkəzi"
},
{
  id: "london_com_43",
  city: "london",
  type: "commercial",
  name: "London Underground Commercial Network Hub",
  icon: "🚇",
  area: "luxury",
  m2: 15000,
  buyPrice: 26000000,
  rentPrice: 210000,
  depositMonths: 6,
  desc: "Metro stansiyaları üzərində reklam və retail şəbəkə"
},
{
  id: "london_com_44",
  city: "london",
  type: "commercial",
  name: "Wembley Stadium Commercial Rights Zone",
  icon: "🏟️",
  area: "luxury",
  m2: 20000,
  buyPrice: 30000000,
  rentPrice: 250000,
  depositMonths: 6,
  desc: "Stadion tədbir kommersiya və sponsorluq zonası"
},
{
  id: "london_com_45",
  city: "london",
  type: "commercial",
  name: "O2 Arena Business Complex",
  icon: "🎤",
  area: "luxury",
  m2: 18000,
  buyPrice: 35000000,
  rentPrice: 280000,
  depositMonths: 6,
  desc: "Konsert və tədbir mərkəzi kommersiya kompleksi"
},
{
  id: "london_com_46",
  city: "london",
  type: "commercial",
  name: "Thames Riverside Port Logistics Terminal",
  icon: "🚢",
  area: "luxury",
  m2: 25000,
  buyPrice: 42000000,
  rentPrice: 320000,
  depositMonths: 6,
  desc: "Liman və yük daşımaları mərkəzi"
},
{
  id: "london_com_47",
  city: "london",
  type: "commercial",
  name: "City of London Mega Financial District HQ",
  icon: "🏦",
  area: "luxury",
  m2: 22000,
  buyPrice: 50000000,
  rentPrice: 380000,
  depositMonths: 6,
  desc: "Bütün maliyyə rayonunu idarə edən HQ kompleks"
},
{
  id: "london_com_48",
  city: "london",
  type: "commercial",
  name: "Canary Wharf Mega Skyscraper Complex",
  icon: "🏙️",
  area: "luxury",
  m2: 30000,
  buyPrice: 65000000,
  rentPrice: 450000,
  depositMonths: 6,
  desc: "Çoxmərtəbəli göydələnlər kompleksi"
},
{
  id: "london_com_49",
  city: "london",
  type: "commercial",
  name: "London Tech Innovation District Hub",
  icon: "💡",
  area: "luxury",
  m2: 28000,
  buyPrice: 80000000,
  rentPrice: 520000,
  depositMonths: 6,
  desc: "Startap və AI texnologiya mərkəzi"
},
{
  id: "london_com_50",
  city: "london",
  type: "commercial",
  name: "Westminster Government Mega Complex",
  icon: "🏛️",
  area: "luxury",
  m2: 35000,
  buyPrice: 100000000,
  rentPrice: 600000,
  depositMonths: 6,
  desc: "Dövlət idarəetmə və təhlükəsizlik kompleksi"
},
{
  id: "london_com_51",
  city: "london",
  type: "commercial",
  name: "London International Trade Center",
  icon: "🏢",
  area: "luxury",
  m2: 40000,
  buyPrice: 150000000,
  rentPrice: 750000,
  depositMonths: 6,
  desc: "Qlobal ticarət və investisiya mərkəzi"
},
{
  id: "london_com_52",
  city: "london",
  type: "commercial",
  name: "Thames Mega Waterfront City Project",
  icon: "🏗️",
  area: "luxury",
  m2: 60000,
  buyPrice: 250000000,
  rentPrice: 900000,
  depositMonths: 6,
  desc: "Tam yeni şəhər tipli waterfront layihə"
},
{
  id: "london_com_53",
  city: "london",
  type: "commercial",
  name: "London Financial Mega Tower Cluster",
  icon: "🏙️",
  area: "luxury",
  m2: 70000,
  buyPrice: 400000000,
  rentPrice: 1200000,
  depositMonths: 6,
  desc: "Bir neçə göydələndən ibarət maliyyə klasteri"
},
{
  id: "london_com_54",
  city: "london",
  type: "commercial",
  name: "London Global Banking HQ Campus",
  icon: "🏦",
  area: "luxury",
  m2: 80000,
  buyPrice: 600000000,
  rentPrice: 1500000,
  depositMonths: 6,
  desc: "Beynəlxalq bankların əsas qərargah kompleksi"
},
{
  id: "london_com_55",
  city: "london",
  type: "commercial",
  name: "London Mega Entertainment City",
  icon: "🎡",
  area: "luxury",
  m2: 90000,
  buyPrice: 800000000,
  rentPrice: 1800000,
  depositMonths: 6,
  desc: "Theme park, kazino və əyləncə şəhər kompleksi"
},
{
  id: "london_com_56",
  city: "london",
  type: "commercial",
  name: "London Super Mall Mega Complex",
  icon: "🏬",
  area: "luxury",
  m2: 100000,
  buyPrice: 1000000000,
  rentPrice: 2200000,
  depositMonths: 6,
  desc: "Dünyanın ən böyük alış-veriş mərkəzlərindən biri"
},
{
  id: "london_com_57",
  city: "london",
  type: "commercial",
  name: "London Mega Airport Expansion Project",
  icon: "✈️",
  area: "luxury",
  m2: 120000,
  buyPrice: 1500000000,
  rentPrice: 2500000,
  depositMonths: 6,
  desc: "Böyük hava limanı genişləndirmə layihəsi"
},
{
  id: "london_com_58",
  city: "london",
  type: "commercial",
  name: "London Global Media HQ Campus",
  icon: "📺",
  area: "luxury",
  m2: 110000,
  buyPrice: 2000000000,
  rentPrice: 2800000,
  depositMonths: 6,
  desc: "Televiziya və media imperiyası qərargahı"
},
{
  id: "london_com_59",
  city: "london",
  type: "commercial",
  name: "London City Autonomous District Project",
  icon: "🤖",
  area: "luxury",
  m2: 150000,
  buyPrice: 3000000000,
  rentPrice: 3500000,
  depositMonths: 6,
  desc: "AI ilə idarə olunan futuristik şəhər zonası"
},
{
  id: "london_com_60",
  city: "london",
  type: "commercial",
  name: "London Ultimate Mega Capital Project",
  icon: "🌍",
  area: "luxury",
  m2: 200000,
  buyPrice: 5000000000,
  rentPrice: 5000000,
  depositMonths: 6,
  desc: "Qlobal səviyyəli ultra mega investisiya şəhər layihəsi"
},
];


   
// Bütün əmlakları şəhərə görə topla
const ALL_PROPERTIES = {
  baku: PROPERTIES_BAKU,
  bali: PROPERTIES_BALI,
  dubai: PROPERTIES_DUBAI,
  london: PROPERTIES_LONDON
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

/* ============================================================
   MARKET — MAĞAZALAR VƏ NƏQLIYYAT VASİTƏLƏRİ
   data.js-in sonuna əlavə et
============================================================ */

const MARKET_STORES = [
  {
    id: "normal_car",
    name: "Normal Avtomobillər",
    icon: "🚗",
    desc: "Gündəlik istifadə üçün etibarlı avtomobillər",
    imgFolder: "normalcar"
  },
  {
    id: "sport_car",
    name: "Sport Avtomobillər",
    icon: "🏎️",
    desc: "Yüksək sürətli, prestijli sport maşınlar",
    imgFolder: "sportcar"
  },
  {
    id: "air_vehicle",
    name: "Hava Nəqliyyatı",
    icon: "✈️",
    desc: "Helikopterlər, təyyarələr və dronlar",
    imgFolder: "airvehicle"
  },
  {
    id: "motorcycle",
    name: "Motosikllər",
    icon: "🏍️",
    desc: "Klassik və sport motosikllər",
    imgFolder: "motorcycle"
  },
  {
    id: "water_vehicle",
    name: "Su Nəqliyyatı",
    icon: "🚤",
    desc: "Qayıqlar, yaxtalar və su scooterləri",
    imgFolder: "watervehicle"
  }
];

const MARKET_ITEMS = [

  /* ── NORMAL AVTOMOBILLƏR ── */
  {
    id: "nc_1",
    storeId: "normal_car",
    name: "Toyota Camry",
    brand: "Toyota",
    img: "market/normalcar1.png",
    price: 28000,
    resellValue: 0.75,
    desc: "Etibarlı, rahat, gündəlik istifadə üçün ideal sedan. Aşağı yanacaq sərfiyyatı.",
    specs: "2.5L · 200 hp · Avtomatik"
  },
  {
    id: "nc_2",
    storeId: "normal_car",
    name: "Honda Civic",
    brand: "Honda",
    img: "market/normalcar2.png",
    price: 22000,
    resellValue: 0.72,
    desc: "Kompakt, iqtisadi, şəhər şəraitinə uyğun. Gənclərin sevimlisi.",
    specs: "1.5L Turbo · 158 hp · CVT"
  },
  {
    id: "nc_3",
    storeId: "normal_car",
    name: "BMW 3 Series",
    brand: "BMW",
    img: "market/normalcar3.png",
    price: 55000,
    resellValue: 0.70,
    desc: "Premium sürücülük zövqü, lüks salon, güclü mühərrik. Biznes üçün ideal.",
    specs: "2.0L Turbo · 255 hp · 8-sürətli"
  },
  {
    id: "nc_4",
    storeId: "normal_car",
    name: "Tesla Model 3",
    brand: "Tesla",
    img: "market/normalcar4.png",
    price: 42000,
    resellValue: 0.73,
    desc: "Tam elektrik, autopilot, sıfır emissiya. Gələcəyin avtomobili.",
    specs: "Elektrik · 358 hp · 0-100: 5.8s"
  },

  /* ── SPORT AVTOMOBILLƏR ── */
  {
    id: "sc_1",
    storeId: "sport_car",
    name: "Ferrari 488",
    brand: "Ferrari",
    img: "market/sportcar1.png",
    price: 280000,
    resellValue: 0.80,
    desc: "İtalyan sürət şah əsəri. 670 at gücü ilə həyatını dəyişdir.",
    specs: "3.9L Twin-Turbo V8 · 670 hp · 0-100: 3s"
  },
  {
    id: "sc_2",
    storeId: "sport_car",
    name: "Lamborghini Huracán",
    brand: "Lamborghini",
    img: "market/sportcar2.png",
    price: 320000,
    resellValue: 0.82,
    desc: "Yolun əsl canavarı. Addıcionalda hiss etdiyin ən güclü nəqliyyat.",
    specs: "5.2L V10 · 610 hp · 0-100: 2.9s"
  },
  {
    id: "sc_3",
    storeId: "sport_car",
    name: "Porsche 911 GT3",
    brand: "Porsche",
    img: "market/sportcar3.png",
    price: 195000,
    resellValue: 0.85,
    desc: "Yarış pistindən günəlik yola. Mükəmməl balans və texnologiya.",
    specs: "4.0L Flat-6 · 502 hp · 0-100: 3.4s"
  },
  {
    id: "sc_4",
    storeId: "sport_car",
    name: "McLaren 720S",
    brand: "McLaren",
    img: "market/sportcar4.png",
    price: 310000,
    resellValue: 0.79,
    desc: "Britaniya mühəndisliyinin zirvəsi. Karbon gövdə, inanılmaz aerodinamika.",
    specs: "4.0L Twin-Turbo V8 · 720 hp · 0-100: 2.8s"
  },

  /* ── HAVA NƏQLIYYATI ── */
  {
    id: "av_1",
    storeId: "air_vehicle",
    name: "Robinson R44",
    brand: "Robinson",
    img: "market/airvehicle1.png",
    price: 380000,
    resellValue: 0.65,
    desc: "Dörd nəfərlik şəxsi helikopter. Biznes görüşlərinə, şəhərüstü səfərlərə.",
    specs: "4 nəfər · 400 km menzil · 240 km/s"
  },
  {
    id: "av_2",
    storeId: "air_vehicle",
    name: "Cessna 172",
    brand: "Cessna",
    img: "market/airvehicle2.png",
    price: 420000,
    resellValue: 0.68,
    desc: "Klassik şəxsi uçuş təyyarəsi. Dünyada ən çox istehsal edilən model.",
    specs: "4 nəfər · 1300 km menzil · 230 km/s"
  },
  {
    id: "av_3",
    storeId: "air_vehicle",
    name: "DJI Agras T40",
    brand: "DJI",
    img: "market/airvehicle3.png",
    price: 35000,
    resellValue: 0.55,
    desc: "Ticarət dronları. Fotokamera, yük daşıma, kənd təsərrüfatı istifadəsi.",
    specs: "40 kq yük · 10 km menzil · 8 m/s"
  },
  {
    id: "av_4",
    storeId: "air_vehicle",
    name: "Cirrus SR22",
    brand: "Cirrus",
    img: "market/airvehicle4.png",
    price: 750000,
    resellValue: 0.70,
    desc: "Lüks özəl uçuş. Hər şəhərə öz vaxtında çat. Paraşüt sistemi daxil.",
    specs: "4 nəfər · 1900 km menzil · 335 km/s"
  },

  /* ── MOTOSİKLLƏR ── */
  {
    id: "mc_1",
    storeId: "motorcycle",
    name: "Harley-Davidson Sportster",
    brand: "Harley-Davidson",
    img: "market/motorcycle1.png",
    price: 18000,
    resellValue: 0.78,
    desc: "Amerikan əfsanəsi. Yolda azadlıq hissi verən klassik kruiser.",
    specs: "1200cc V-Twin · 73 hp · 180 km/s"
  },
  {
    id: "mc_2",
    storeId: "motorcycle",
    name: "Ducati Panigale V4",
    brand: "Ducati",
    img: "market/motorcycle2.png",
    price: 42000,
    resellValue: 0.75,
    desc: "İtalyan sport motosiklinin zirvəsi. Yarış texnologiyası, günəlik yolda.",
    specs: "1103cc V4 · 214 hp · 0-100: 2.5s"
  },
  {
    id: "mc_3",
    storeId: "motorcycle",
    name: "BMW R 1250 GS",
    brand: "BMW",
    img: "market/motorcycle3.png",
    price: 28000,
    resellValue: 0.76,
    desc: "Hər arazdan keçən macəra motosikli. Dünya turu üçün hazır.",
    specs: "1254cc Boxer · 136 hp · 200 km/s"
  },
  {
    id: "mc_4",
    storeId: "motorcycle",
    name: "Honda CBR1000RR",
    brand: "Honda",
    img: "market/motorcycle4.png",
    price: 22000,
    resellValue: 0.73,
    desc: "Dünyanın ən etibarlı sport motosikli. Güc, balans, texnologiya.",
    specs: "999cc Inline-4 · 189 hp · 299 km/s"
  },

  /* ── SU NƏQLİYYATI ── */
  {
    id: "wv_1",
    storeId: "water_vehicle",
    name: "Sea-Doo Spark",
    brand: "Sea-Doo",
    img: "market/watervehicle1.png",
    price: 8500,
    resellValue: 0.65,
    desc: "Yüngül, sürətli su scooteri. Xəzər sahilləri üçün əyləncənin ünvanı.",
    specs: "900cc · 90 hp · 2 nəfər · 75 km/s"
  },
  {
    id: "wv_2",
    storeId: "water_vehicle",
    name: "Yamaha 242X",
    brand: "Yamaha",
    img: "market/watervehicle2.png",
    price: 55000,
    resellValue: 0.68,
    desc: "Ailə üçün geniş, rahat qayıq. Dalğıclıq, istirahət, əyləncə.",
    specs: "2x Yamaha 1.8L · 8 nəfər · 55 km/s"
  },
  {
    id: "wv_3",
    storeId: "water_vehicle",
    name: "Sunseeker Manhattan 68",
    brand: "Sunseeker",
    img: "market/watervehicle3.png",
    price: 1800000,
    resellValue: 0.72,
    desc: "Ultra lüks motor yaxta. VIP qonaqlar üçün, açıq dənizdə istirahət.",
    specs: "2x 1550 hp · 12 nəfər · 35 knot"
  },
  {
    id: "wv_4",
    storeId: "water_vehicle",
    name: "Bayliner Element",
    brand: "Bayliner",
    img: "market/watervehicle4.png",
    price: 22000,
    resellValue: 0.66,
    desc: "Klassik ailə qayığı. Balıqçılıq, gəzinti, istirahət üçün mükəmməl.",
    specs: "115 hp · 6 nəfər · 50 km/s"
  }

];
