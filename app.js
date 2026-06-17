/* ============================================================
   APP.JS — Borsa Simulyasiyası: Əsas Tətbiq Məntiqi
   ============================================================ */

const STORAGE_KEY = "borsa_sim_state_v1";
const STARTING_BALANCE = 10000;

// ----------------------------------------------------------------
// STATE
// ----------------------------------------------------------------
let state = {
  day: 1,
  bankBalance: STARTING_BALANCE,
  investedBalance: 0,
  holdings: {},        // assetId -> miqdar
  priceHistory: {},    // assetId -> [qiymət, qiymət, ...]
  newsFeed: [],         // {day, ...newsObj, applied}
  transactions: [],     // {id, type, title, amount, day, direction}
  engineState: null,    // Engine.getState() saxlanması üçün
  unseenNewsCount: 0
};

let activeFilter = "all";
let currentDetailAssetId = null;
let pendingTradeType = null; // 'buy' | 'sell'

// ----------------------------------------------------------------
// SAXLAMA (localStorage)
// ----------------------------------------------------------------
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Saxlama xətası:", e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      return true;
    }
  } catch (e) {
    console.error("Yükləmə xətası:", e);
  }
  return false;
}

function initFreshState() {
  state.day = 1;
  state.bankBalance = STARTING_BALANCE;
  state.investedBalance = 0;
  state.holdings = {};
  state.priceHistory = {};
  state.newsFeed = [];
  state.transactions = [];
  state.unseenNewsCount = 0;

  ASSETS.forEach(asset => {
    state.holdings[asset.id] = 0;
    state.priceHistory[asset.id] = [asset.basePrice];
  });

  Engine.init(null);
  state.engineState = Engine.getState();

  addTransaction("Hesab açıldı", STARTING_BALANCE, "in", "BMB");
}

// ----------------------------------------------------------------
// KÖMƏKÇİ FUNKSİYALAR
// ----------------------------------------------------------------
function fmtMoney(val) {
  if (Math.abs(val) < 0.01 && val !== 0) {
    return "$" + val.toFixed(6);
  }
  return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPrice(val) {
  if (val < 0.01) return "$" + val.toFixed(6);
  if (val < 1) return "$" + val.toFixed(4);
  return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getAsset(id) {
  return ASSETS.find(a => a.id === id);
}

function getLastPrice(assetId) {
  const hist = state.priceHistory[assetId];
  return hist[hist.length - 1];
}

function getAssetInitials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function sectorColor(sector) {
  return (SECTORS[sector] && SECTORS[sector].color) || "#8B94A3";
}

function calcPortfolioValue() {
  let total = 0;
  ASSETS.forEach(asset => {
    const qty = state.holdings[asset.id] || 0;
    if (qty > 0) total += qty * getLastPrice(asset.id);
  });
  return total;
}

function calcNetWorth() {
  return state.bankBalance + state.investedBalance + calcPortfolioValue();
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function addTransaction(title, amount, direction, account) {
  state.transactions.unshift({
    id: Date.now() + Math.random(),
    title, amount, direction, account,
    day: state.day
  });
}

// ----------------------------------------------------------------
// NAVİGASİYA
// ----------------------------------------------------------------
function navigateTo(screenId) {
  document.querySelectorAll(".screen-view").forEach(el => el.classList.remove("active"));
  document.getElementById("screen-" + screenId).classList.add("active");
  if (screenId === "news") {
    state.unseenNewsCount = 0;
    saveState();
    renderHome();
  }
}

// ----------------------------------------------------------------
// RENDER: HOME
// ----------------------------------------------------------------
function renderHome() {
  const netWorth = calcNetWorth();
  const changePercent = ((netWorth - STARTING_BALANCE) / STARTING_BALANCE) * 100;

  document.getElementById("status-day-label").textContent = "GÜN " + state.day;
  document.getElementById("home-net-worth").textContent = fmtMoney(netWorth);

  const changeEl = document.getElementById("home-net-worth-change");
  changeEl.textContent = (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "% başlanğıcdan";
  changeEl.className = "net-worth-change " + (changePercent >= 0 ? "up" : "down");

  const badge = document.getElementById("news-badge");
  if (state.unseenNewsCount > 0) {
    badge.style.display = "flex";
    badge.textContent = state.unseenNewsCount;
  } else {
    badge.style.display = "none";
  }

  document.getElementById("nd-news-preview").textContent =
    state.unseenNewsCount > 0
      ? state.unseenNewsCount + " yeni xəbər gözləyir"
      : "Bazarlar yenilənəcək";
}

// ----------------------------------------------------------------
// RENDER: INVESTED — Siyahı
// ----------------------------------------------------------------
function renderAssetList() {
  const container = document.getElementById("asset-list");
  const filtered = activeFilter === "all" ? ASSETS : ASSETS.filter(a => a.type === activeFilter);

  document.getElementById("inv-balance").textContent = fmtMoney(state.investedBalance);
  document.getElementById("inv-portfolio-value").textContent = fmtMoney(calcPortfolioValue());

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">Bu kateqoriyada aktiv yoxdur</div>';
    return;
  }

  container.innerHTML = filtered.map(asset => {
    const price = getLastPrice(asset.id);
    const change = Engine.getDailyChangePercent(state.priceHistory[asset.id]);
    const changeClass = change >= 0 ? "up" : "down";
    const changeSign = change >= 0 ? "+" : "";
    const initials = getAssetInitials(asset.name);
    const color = sectorColor(asset.sector);

    return `
      <div class="asset-row" data-asset-id="${asset.id}">
        <div class="asset-icon" style="background:${color}33; color:${color};">${initials}</div>
        <div class="asset-info">
          <div class="asset-name">${asset.name}</div>
          <div class="asset-ticker">${asset.ticker} · ${SECTORS[asset.sector].label}</div>
        </div>
        <div class="asset-price-block">
          <div class="asset-price">${fmtPrice(price)}</div>
          <div class="asset-change ${changeClass}">${changeSign}${change.toFixed(2)}%</div>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".asset-row").forEach(row => {
    row.addEventListener("click", () => openAssetDetail(row.dataset.assetId));
  });
}

// ----------------------------------------------------------------
// RENDER: ASSET DETAIL
// ----------------------------------------------------------------
function openAssetDetail(assetId) {
  currentDetailAssetId = assetId;
  renderAssetDetail();
  navigateTo("asset-detail");
}

function renderAssetDetail() {
  const asset = getAsset(currentDetailAssetId);
  const price = getLastPrice(asset.id);
  const change = Engine.getDailyChangePercent(state.priceHistory[asset.id]);
  const changeClass = change >= 0 ? "up" : "down";
  const changeSign = change >= 0 ? "+" : "";
  const qty = state.holdings[asset.id] || 0;

  document.getElementById("detail-asset-name").innerHTML =
    asset.name + `<small>${asset.ticker} · ${SECTORS[asset.sector].label}</small>`;
  document.getElementById("detail-price").textContent = fmtPrice(price);
  const changeEl = document.getElementById("detail-change");
  changeEl.textContent = changeSign + change.toFixed(2) + "% (bugün)";
  changeEl.className = "asset-change " + changeClass;

  document.getElementById("detail-holding-qty").textContent = qty.toLocaleString("en-US", { maximumFractionDigits: 6 });
  document.getElementById("detail-holding-value").textContent = fmtMoney(qty * price);
  document.getElementById("detail-trade-balance").textContent = fmtMoney(state.investedBalance);

  renderMiniChart(asset.id);
  renderAssetNewsHistory(asset.id);
}

function renderMiniChart(assetId) {
  const history = state.priceHistory[assetId].slice(-30); // son 30 gün
  const container = document.getElementById("detail-chart");
  if (history.length < 2) {
    container.innerHTML = "";
    return;
  }

  const w = 354, h = 140, pad = 8;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = (max - min) || 1;

  const points = history.map((price, i) => {
    const x = pad + (i / (history.length - 1)) * (w - pad * 2);
    const y = h - pad - ((price - min) / range) * (h - pad * 2);
    return [x, y];
  });

  const isUp = history[history.length - 1] >= history[0];
  const lineColor = isUp ? "#1FD67A" : "#FF4C5E";

  const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const areaD = pathD + ` L${points[points.length-1][0].toFixed(1)},${h-pad} L${points[0][0].toFixed(1)},${h-pad} Z`;

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${lineColor}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#chartGrad)" />
      <path d="${pathD}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
  `;
}

function renderAssetNewsHistory(assetId) {
  const relevant = state.newsFeed.filter(n => n.assetId === assetId).slice(0, 5);
  const container = document.getElementById("detail-news-list");
  if (relevant.length === 0) {
    container.innerHTML = '<div class="empty-state">Bu aktivlə bağlı hələ xəbər yoxdur</div>';
    return;
  }
  container.innerHTML = relevant.map(n => renderNewsCard(n, Math.floor(Math.random()*5)+1)).join("");
}

// ----------------------------------------------------------------
// TRADE MODAL
// ----------------------------------------------------------------
function openTradeModal(type) {
  pendingTradeType = type;
  const asset = getAsset(currentDetailAssetId);
  const modal = document.getElementById("trade-modal-overlay");
  document.getElementById("tm-title").textContent = type === "buy" ? "Al — " + asset.name : "Sat — " + asset.name;
  document.getElementById("tm-sub").textContent = type === "buy"
    ? "Trade balansından alış edilir"
    : "Satışdan gələn pul trade balansına əlavə olunur";
  document.getElementById("tm-unit-label").textContent = asset.ticker;
  document.getElementById("tm-quantity-input").value = "";
  document.getElementById("tm-total").textContent = "$0.00";
  document.getElementById("tm-error").classList.remove("active");

  const confirmBtn = document.getElementById("btn-modal-confirm");
  confirmBtn.className = "btn-modal-confirm " + type;
  confirmBtn.textContent = type === "buy" ? "Al" : "Sat";

  modal.classList.add("active");
}

function closeTradeModal() {
  document.getElementById("trade-modal-overlay").classList.remove("active");
}

function updateTradeTotal() {
  const asset = getAsset(currentDetailAssetId);
  const qty = parseFloat(document.getElementById("tm-quantity-input").value) || 0;
  const price = getLastPrice(asset.id);
  document.getElementById("tm-total").textContent = fmtMoney(qty * price);
}

function confirmTrade() {
  const asset = getAsset(currentDetailAssetId);
  const qty = parseFloat(document.getElementById("tm-quantity-input").value) || 0;
  const price = getLastPrice(asset.id);
  const total = qty * price;
  const errorEl = document.getElementById("tm-error");

  if (qty <= 0) {
    errorEl.textContent = "Düzgün miqdar daxil et";
    errorEl.classList.add("active");
    return;
  }

  if (pendingTradeType === "buy") {
    if (total > state.investedBalance) {
      errorEl.textContent = "Trade balansında kifayət qədər pul yoxdur";
      errorEl.classList.add("active");
      return;
    }
    state.investedBalance -= total;
    state.holdings[asset.id] = (state.holdings[asset.id] || 0) + qty;
    addTransaction("Alış: " + asset.ticker, total, "out", "INVESTED");
    showToast(asset.ticker + " alındı: " + fmtMoney(total));
  } else {
    const owned = state.holdings[asset.id] || 0;
    if (qty > owned) {
      errorEl.textContent = "Bu qədər " + asset.ticker + " sahib deyilsən";
      errorEl.classList.add("active");
      return;
    }
    state.holdings[asset.id] -= qty;
    state.investedBalance += total;
    addTransaction("Satış: " + asset.ticker, total, "in", "INVESTED");
    showToast(asset.ticker + " satıldı: " + fmtMoney(total));
  }

  saveState();
  closeTradeModal();
  renderAssetDetail();
  renderAssetList();
}

// ----------------------------------------------------------------
// TRANSFER MODAL (BMB <-> INVESTED)
// ----------------------------------------------------------------
let transferDirection = null; // 'toInvested' | 'toBank'

function openTransferModal(direction) {
  transferDirection = direction;
  document.getElementById("transfer-title").textContent =
    direction === "toInvested" ? "BMB → INVESTED" : "INVESTED → BMB";
  document.getElementById("transfer-sub").textContent =
    direction === "toInvested"
      ? "Bank balansından trade balansına köçür"
      : "Trade balansından bank balansına köçür";
  document.getElementById("transfer-amount-input").value = "";
  document.getElementById("transfer-error").classList.remove("active");
  document.getElementById("transfer-modal-overlay").classList.add("active");
}

function closeTransferModal() {
  document.getElementById("transfer-modal-overlay").classList.remove("active");
}

function confirmTransfer() {
  const amount = parseFloat(document.getElementById("transfer-amount-input").value) || 0;
  const errorEl = document.getElementById("transfer-error");

  if (amount <= 0) {
    errorEl.textContent = "Düzgün məbləğ daxil et";
    errorEl.classList.add("active");
    return;
  }

  if (transferDirection === "toInvested") {
    if (amount > state.bankBalance) {
      errorEl.textContent = "Bank balansında kifayət qədər pul yoxdur";
      errorEl.classList.add("active");
      return;
    }
    state.bankBalance -= amount;
    state.investedBalance += amount;
    addTransaction("Transfer → INVESTED", amount, "out", "BMB");
  } else {
    if (amount > state.investedBalance) {
      errorEl.textContent = "Trade balansında kifayət qədər pul yoxdur";
      errorEl.classList.add("active");
      return;
    }
    state.investedBalance -= amount;
    state.bankBalance += amount;
    addTransaction("Transfer → BMB", amount, "in", "BMB");
  }

  saveState();
  closeTransferModal();
  renderBank();
  renderAssetList();
  showToast("Transfer tamamlandı: " + fmtMoney(amount));
}

// ----------------------------------------------------------------
// RENDER: BMB (BANK)
// ----------------------------------------------------------------
function renderBank() {
  document.getElementById("bank-balance").textContent = fmtMoney(state.bankBalance);

  const container = document.getElementById("tx-list");
  if (state.transactions.length === 0) {
    container.innerHTML = '<div class="empty-state">Tranzaksiya tarixçəsi boşdur</div>';
    return;
  }

  container.innerHTML = state.transactions.slice(0, 30).map(tx => {
    const icon = tx.direction === "in" ? "↓" : "↑";
    const sign = tx.direction === "in" ? "+" : "−";
    return `
      <div class="tx-row">
        <div class="tx-icon ${tx.direction}">${icon}</div>
        <div class="tx-info">
          <div class="tx-title">${tx.title}</div>
          <div class="tx-meta">${tx.account} · Gün ${tx.day}</div>
        </div>
        <div class="tx-amount ${tx.direction === 'in' ? 'up' : 'down'}">${sign}${fmtMoney(tx.amount).slice(1)}</div>
      </div>
    `;
  }).join("");
}

// ----------------------------------------------------------------
// NEWS — 5 fərqli kart şablonu
// ----------------------------------------------------------------
function renderNewsCard(newsItem, templateNum) {
  const asset = getAsset(newsItem.assetId);
  const isPositive = newsItem.impact >= 0;
  const impactPct = (newsItem.impact * 100).toFixed(1);
  const sign = isPositive ? "+" : "";
  const statusTag = newsItem.applied
    ? `<div class="news-status-tag applied">✓ Təsir tətbiq olundu</div>`
    : `<div class="news-status-tag">⏳ Təsir sabah başlayacaq</div>`;

  switch (templateNum) {
    case 1:
      return `
        <div class="news-card t1">
          <div class="nc-icon"><img src="${newsItem.icon}" alt=""></div>
          <div class="nc-body">
            <div class="nc-title">${newsItem.title}</div>
            <div class="nc-text">${newsItem.text}</div>
            ${statusTag}
          </div>
        </div>`;
    case 2:
      return `
        <div class="news-card t2 ${isPositive ? 'positive' : ''}">
          <div class="nc-tag"><img src="${newsItem.icon}" alt="">${asset.ticker} · ${sign}${impactPct}%</div>
          <div class="nc-title">${newsItem.title}</div>
          <div class="nc-text">${newsItem.text}</div>
          ${statusTag}
        </div>`;
    case 3:
      return `
        <div class="news-card t3">
          <div class="nc-top">
            <img src="${newsItem.icon}" alt="">
            <span class="nc-impact-pill ${isPositive ? 'up' : 'down'}">${sign}${impactPct}%</span>
          </div>
          <div class="nc-title">${newsItem.title}</div>
          <div class="nc-text">${newsItem.text}</div>
          ${statusTag}
        </div>`;
    case 4:
      return `
        <div class="news-card t4">
          <div class="nc-quote-mark">"</div>
          <div class="nc-body">
            <div class="nc-title">${newsItem.title}</div>
            <div class="nc-text">${newsItem.text}</div>
            <div class="nc-foot"><img src="${newsItem.icon}" alt=""><span style="font-size:11px; color:var(--c-text-tertiary);">${asset.ticker}</span></div>
            ${statusTag}
          </div>
        </div>`;
    case 5:
    default:
      const barWidth = Math.min(Math.abs(newsItem.impact) * 400, 100);
      return `
        <div class="news-card t5">
          <div class="nc-header-row">
            <span class="nc-ticker-badge">${asset.ticker}</span>
            <img src="${newsItem.icon}" alt="">
          </div>
          <div class="nc-title">${newsItem.title}</div>
          <div class="nc-text">${newsItem.text}</div>
          <div class="nc-impact-bar-wrap"><div class="nc-impact-bar ${isPositive ? 'up' : 'down'}" style="width:${barWidth}%;"></div></div>
          <div class="nc-impact-label">Gözlənilən təsir: ${sign}${impactPct}% (${newsItem.duration} gün)</div>
          ${statusTag}
        </div>`;
  }
}

function renderNewsFeed() {
  const container = document.getElementById("news-feed");
  if (state.newsFeed.length === 0) {
    container.innerHTML = '<div class="empty-state">Hələ heç bir xəbər yoxdur. "Növbəti gün" düyməsinə basaraq simulyasiyaya başla.</div>';
    return;
  }

  // Günə görə qruplaşdır
  const byDay = {};
  state.newsFeed.forEach(n => {
    if (!byDay[n.day]) byDay[n.day] = [];
    byDay[n.day].push(n);
  });

  const days = Object.keys(byDay).map(Number).sort((a, b) => b - a);

  let html = "";
  days.forEach(day => {
    html += `<div class="day-divider">Gün ${day}</div>`;
    byDay[day].forEach(n => {
      const templateNum = (Math.abs(hashCode(n.title + n.day)) % 5) + 1;
      html += renderNewsCard(n, templateNum);
    });
  });

  container.innerHTML = html;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// ----------------------------------------------------------------
// GÜN İRƏLİLƏTMƏ
// ----------------------------------------------------------------
function advanceDay() {
  Engine.init(state.engineState);

  // 1. Bugün üçün yeni xəbərləri seç və dərc et
  const todaysNews = Engine.publishDailyNews(ASSETS, NEWS);
  todaysNews.forEach(n => {
    state.newsFeed.unshift({ ...n, day: state.day, applied: false });
  });
  state.unseenNewsCount += todaysNews.length;

  // 2. Günü irəli apar (qiymətləri yenilə, gecikmiş effektləri tətbiq et)
  const result = Engine.advanceDay(ASSETS, state.priceHistory, state.day);

  // 3. Tətbiq olunan xəbərləri "applied" et
  result.activatedNews.forEach(activated => {
    const match = state.newsFeed.find(n => n.title === activated.title && !n.applied && n.assetId === activated.assetId);
    if (match) match.applied = true;
  });

  state.day = result.day;
  state.engineState = Engine.getState();

  saveState();
  renderAll();
  showToast("Gün " + state.day + " başladı");
}

// ----------------------------------------------------------------
// RENDER ALL
// ----------------------------------------------------------------
function renderAll() {
  renderHome();
  renderAssetList();
  renderBank();
  renderNewsFeed();
  if (currentDetailAssetId) renderAssetDetail();
}

// ----------------------------------------------------------------
// HADİSƏ DİNLƏYİCİLƏRİ
// ----------------------------------------------------------------
function setupEventListeners() {
  // Home -> App açılışı
  document.querySelectorAll(".app-icon-wrap").forEach(el => {
    el.addEventListener("click", () => {
      const app = el.dataset.app;
      navigateTo(app === "invested" ? "invested" : app);
      if (app === "invested") renderAssetList();
      if (app === "bmb") renderBank();
      if (app === "news") renderNewsFeed();
    });
  });

  // Geri düymələri
  document.querySelectorAll(".btn-back").forEach(el => {
    el.addEventListener("click", () => navigateTo(el.dataset.back));
  });

  // Inv tabs (filter)
  document.querySelectorAll(".inv-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".inv-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.filter;
      renderAssetList();
    });
  });

  // Növbəti gün
  document.getElementById("btn-advance-day").addEventListener("click", advanceDay);

  // Trade modal
  document.getElementById("btn-open-buy").addEventListener("click", () => openTradeModal("buy"));
  document.getElementById("btn-open-sell").addEventListener("click", () => openTradeModal("sell"));
  document.getElementById("btn-modal-cancel").addEventListener("click", closeTradeModal);
  document.getElementById("btn-modal-confirm").addEventListener("click", confirmTrade);
  document.getElementById("tm-quantity-input").addEventListener("input", updateTradeTotal);

  // Transfer modal
  document.getElementById("btn-transfer-to-invested").addEventListener("click", () => openTransferModal("toInvested"));
  document.getElementById("btn-transfer-to-bank").addEventListener("click", () => openTransferModal("toBank"));
  document.getElementById("btn-transfer-cancel").addEventListener("click", closeTransferModal);
  document.getElementById("btn-transfer-confirm").addEventListener("click", confirmTransfer);
}

// ----------------------------------------------------------------
// BAŞLANĞIC
// ----------------------------------------------------------------
function start() {
  const loaded = loadState();
  if (!loaded || !state.priceHistory || Object.keys(state.priceHistory).length === 0) {
    initFreshState();
  } else {
    Engine.init(state.engineState);
  }
  setupEventListeners();
  renderAll();
}

document.addEventListener("DOMContentLoaded", start);
