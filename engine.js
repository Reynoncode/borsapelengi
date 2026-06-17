/* ============================================================
   ENGINE.JS — Qiymət Mühərriki
   ============================================================
   Mexanika:
   - Hər gün hər aktiv üçün: random walk + sektor trend +
     xəbər effekti (gecikmiş, çoxgünlü decay)
   - Xəbər bu gün dərc olunur → növbəti gündən təsir başlayır
   - Sektor korrelyasiyası: eyni sektorda güclü xəbər olduqda
     qalan aktivlərə azaldılmış əks-siqnal verilir
   ============================================================ */

const Engine = (() => {

  /* ── daxili state ── */
  let _activeEffects = [];
  // [{assetId, impact, remainingDays, totalDays, title}]

  /* ────────────────────────────────────────────────
     INIT — state yüklənir və ya sıfırlanır
  ──────────────────────────────────────────────── */
  function init(savedState) {
    if (savedState && savedState.activeEffects) {
      _activeEffects = savedState.activeEffects;
    } else {
      _activeEffects = [];
    }
  }

  /* ────────────────────────────────────────────────
     GETSTATE — localStorage üçün çıxarış
  ──────────────────────────────────────────────── */
  function getState() {
    return { activeEffects: JSON.parse(JSON.stringify(_activeEffects)) };
  }

  /* ────────────────────────────────────────────────
     RANDOM — Seeded random (Box-Muller normal)
  ──────────────────────────────────────────────── */
  function randNormal(mean = 0, std = 1) {
    let u, v;
    do { u = Math.random(); } while (u === 0);
    do { v = Math.random(); } while (v === 0);
    return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /* ────────────────────────────────────────────────
     DAILY NEWS PUBLISH
     Hər gün hər aktiv üçün NEWS array-dən
     1-2 ədəd xəbər seçir (random).
     Seçilən xəbərləri ACTIVE EFFECTS-ə əlavə edir
     (amma impact ancaq NÖVBƏTI gündən başlayır:
      remainingDays = duration, hələ aktiv deyil)
  ──────────────────────────────────────────────── */
  function publishDailyNews(assets, allNews) {
    const published = [];

    // Hər aktiv üçün 0-2 xəbər (ortalama 1)
    assets.forEach(asset => {
      const pool = allNews.filter(n => n.assetId === asset.id);
      if (pool.length === 0) return;

      // 70% ehtimalla 1 xəbər, 25% ehtimalla 2 xəbər, 5% xəbərsiz
      const r = Math.random();
      const count = r < 0.05 ? 0 : r < 0.75 ? 1 : 2;

      // Shuffled pool-dan seç
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);

      selected.forEach(news => {
        // Active effects-ə əlavə et (növbəti gündən başlayacaq)
        _activeEffects.push({
          assetId: news.assetId,
          impact: news.impact,
          remainingDays: news.duration,
          totalDays: news.duration,
          title: news.title,
          pending: true   // bu gün aktiv deyil, sabah başlayacaq
        });

        published.push({ ...news });
      });
    });

    return published;
  }

  /* ────────────────────────────────────────────────
     ADVANCE DAY
     Günü irəlilədir:
     1. Pending xəbərləri aktiv et
     2. Hər aktiv üçün yeni qiyməti hesabla
     3. Aktiv effektləri azalt / sil
  ──────────────────────────────────────────────── */
  function advanceDay(assets, priceHistory, currentDay) {
    // 1. Pending → active
    _activeEffects.forEach(e => { e.pending = false; });

    const activatedNews = _activeEffects.filter(e => !e.pending && e.remainingDays === e.totalDays)
      .map(e => ({ assetId: e.assetId, title: e.title }));

    // Sektor effekti hesabla (güclü xəbər → qonşulara az yayılır)
    const sectorImpacts = {};
    _activeEffects.filter(e => !e.pending).forEach(e => {
      const asset = assets.find(a => a.id === e.assetId);
      if (!asset) return;
      const sec = asset.sector;
      if (!sectorImpacts[sec]) sectorImpacts[sec] = 0;
      // Decay: gündən günə azalır
      const decayFactor = e.remainingDays / e.totalDays;
      sectorImpacts[sec] += e.impact * decayFactor * 0.18; // 18% yayılma
    });

    // 2. Hər aktiv üçün yeni qiyməti hesabla
    assets.forEach(asset => {
      const hist = priceHistory[asset.id];
      const lastPrice = hist[hist.length - 1];

      // a) Baza random walk (normal paylanma)
      const randomReturn = randNormal(0, asset.volatility);

      // b) Uzunmüddətli trend
      const trendReturn = asset.trend;

      // c) Xəbər effektləri (bu aktivə aid olanlar)
      let newsReturn = 0;
      _activeEffects.filter(e => !e.pending && e.assetId === asset.id).forEach(e => {
        const decayFactor = e.remainingDays / e.totalDays;
        // Güc azalır: ilk gün tam impact, son günlər az
        const dailyImpact = e.impact * decayFactor * (1 / e.totalDays) * 1.5;
        newsReturn += dailyImpact;
      });

      // d) Sektor korrelyasiya effekti (öz aktivinin effekti çıxılır)
      const secEffect = (sectorImpacts[asset.sector] || 0);
      // Bu aktivin öz xəbər effektini çıx ki, ikiqat sayılmasın
      let ownEffect = 0;
      _activeEffects.filter(e => !e.pending && e.assetId === asset.id).forEach(e => {
        ownEffect += e.impact * (e.remainingDays / e.totalDays) * 0.18;
      });
      const sectorSpillover = secEffect - ownEffect;

      // e) Cəmi gündəlik gəlir
      const totalReturn = randomReturn + trendReturn + newsReturn + sectorSpillover;

      // f) Qiymət sıfırın altına düşməsin, həm də çox ekstrem dəyişim olmasın
      const cappedReturn = clamp(totalReturn, -0.25, 0.30);
      const newPrice = Math.max(lastPrice * (1 + cappedReturn), 0.0001);

      hist.push(parseFloat(newPrice.toFixed(6)));
    });

    // 3. Effektləri azalt, bitənləri sil
    _activeEffects = _activeEffects
      .filter(e => !e.pending)
      .map(e => ({ ...e, remainingDays: e.remainingDays - 1 }))
      .filter(e => e.remainingDays > 0);

    return {
      day: currentDay + 1,
      activatedNews
    };
  }

  /* ────────────────────────────────────────────────
     YARDIMÇI: Gündəlik dəyişim faizi (son 2 gün)
  ──────────────────────────────────────────────── */
  function getDailyChangePercent(history) {
    if (history.length < 2) return 0;
    const prev = history[history.length - 2];
    const curr = history[history.length - 1];
    return ((curr - prev) / prev) * 100;
  }

  /* ────────────────────────────────────────────────
     PUBLIC API
  ──────────────────────────────────────────────── */
  return {
    init,
    getState,
    publishDailyNews,
    advanceDay,
    getDailyChangePercent
  };

})();
