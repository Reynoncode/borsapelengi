/* ============================================================
   ENGINE.JS — Qiymət Mühərriki v2
   ============================================================
   - Hər gün TAM OLARAQ 10 aktiv xəbər alır (random seçim)
   - Qalanı yalnız bazar dalğalanması (trend + random walk)
   - Xəbər bu gün dərc olunur → növbəti gündən təsir başlayır
   - Sektor korrelyasiyası aktiv
   ============================================================ */

const Engine = (() => {

  let _activeEffects = [];

  function init(savedState) {
    _activeEffects = (savedState && savedState.activeEffects) ? savedState.activeEffects : [];
  }

  function getState() {
    return { activeEffects: JSON.parse(JSON.stringify(_activeEffects)) };
  }

  function randNormal(mean = 0, std = 1) {
    let u, v;
    do { u = Math.random(); } while (u === 0);
    do { v = Math.random(); } while (v === 0);
    return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  /* ──────────────────────────────────────────────────────────
     DAILY NEWS PUBLISH
     Hər gün TAM OLARAQ 10 fərqli aktiv seçilir (random).
     Həmin aktivlər üçün NEWS pool-dan 1 xəbər seçilir.
     Qalan 40 aktiv xəbərsiz, yalnız bazar dalğalanması ilə.
  ────────────────────────────────────────────────────────── */
  function publishDailyNews(assets, allNews) {
    const published = [];

    // Xəbəri olan aktivlər
    const assetsWithNews = assets.filter(a => allNews.some(n => n.assetId === a.id));

    // 10 random aktiv seç (dublikatsız)
    const shuffled = [...assetsWithNews].sort(() => Math.random() - 0.5);
    const todayAssets = shuffled.slice(0, Math.min(10, shuffled.length));

    todayAssets.forEach(asset => {
      const pool = allNews.filter(n => n.assetId === asset.id);
      if (pool.length === 0) return;

      // Pool-dan random 1 xəbər seç
      const news = pool[Math.floor(Math.random() * pool.length)];

      _activeEffects.push({
        assetId: news.assetId,
        impact: news.impact,
        remainingDays: news.duration,
        totalDays: news.duration,
        title: news.title,
        pending: true
      });

      published.push({ ...news });
    });

    return published;
  }

  /* ──────────────────────────────────────────────────────────
     ADVANCE DAY
  ────────────────────────────────────────────────────────── */
  function advanceDay(assets, priceHistory, currentDay) {
    // 1. Pending → active
    _activeEffects.forEach(e => { e.pending = false; });

    const activatedNews = _activeEffects
      .filter(e => e.remainingDays === e.totalDays)
      .map(e => ({ assetId: e.assetId, title: e.title }));

    // Sektor xəbər yayılma effektləri
    const sectorImpacts = {};
    _activeEffects.forEach(e => {
      const asset = assets.find(a => a.id === e.assetId);
      if (!asset) return;
      if (!sectorImpacts[asset.sector]) sectorImpacts[asset.sector] = 0;
      const decay = e.remainingDays / e.totalDays;
      sectorImpacts[asset.sector] += e.impact * decay * 0.15;
    });

    // 2. Hər aktiv üçün yeni qiymət
    assets.forEach(asset => {
      const hist = priceHistory[asset.id];
      const lastPrice = hist[hist.length - 1];

      const randomReturn = randNormal(0, asset.volatility);
      const trendReturn  = asset.trend;

      let newsReturn = 0;
      _activeEffects.filter(e => e.assetId === asset.id).forEach(e => {
        const decay = e.remainingDays / e.totalDays;
        newsReturn += e.impact * decay * (1 / e.totalDays) * 1.5;
      });

      const secEffect = (sectorImpacts[asset.sector] || 0);
      let ownSpill = 0;
      _activeEffects.filter(e => e.assetId === asset.id).forEach(e => {
        ownSpill += e.impact * (e.remainingDays / e.totalDays) * 0.15;
      });
      const sectorSpillover = secEffect - ownSpill;

      const totalReturn = clamp(randomReturn + trendReturn + newsReturn + sectorSpillover, -0.25, 0.30);
      const newPrice = Math.max(lastPrice * (1 + totalReturn), 0.0001);
      hist.push(parseFloat(newPrice.toFixed(6)));
    });

    // 3. Effektləri azalt
    _activeEffects = _activeEffects
      .map(e => ({ ...e, remainingDays: e.remainingDays - 1 }))
      .filter(e => e.remainingDays > 0);

    return { day: currentDay + 1, activatedNews };
  }

  function getDailyChangePercent(history) {
    if (history.length < 2) return 0;
    const prev = history[history.length - 2];
    const curr = history[history.length - 1];
    return ((curr - prev) / prev) * 100;
  }

  return { init, getState, publishDailyNews, advanceDay, getDailyChangePercent };
})();
