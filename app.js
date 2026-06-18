/* ============================================================
   APP.JS — Borsa Simulyasiyası v2 + Travel & RealEstate
   Yeniliklər:
   - Portfolio tab: açıq mövqelər (long + short + leveraged)
   - Short (Sell In): aktivsiz satış mövqesi aç, sonra bağla
   - Leverage: 1x, 2x, 5x, 10x seçimi
   - Xəbər: gündə tam 10 aktiv, qalanı dalğalanma
   - Travel: şəhər dəyişmə
   - RealEstate: əmlak al / kirayə ver / biznes aç, passiv gəlir
   ============================================================ */

const STORAGE_KEY = "borsa_sim_state_v2";
const STARTING_BALANCE = 10000;
const LEVERAGE_OPTIONS = [1, 2, 5, 10];

/* ──────────────────────────────────────────────────────────
   STATE
   holdings: { assetId: qty }          — long mövqelər (spot)
   positions: [ Position ]             — leverage/short mövqelər
   Position: {
     id, assetId, type: 'long'|'short',
     leverage, qty, entryPrice, margin,
     openDay, ticker, name
   }
   currentCity: string                 — hazırkı şəhər id-si
   ownedProperties: [ OwnedProperty ]
   OwnedProperty: {
     propertyId, ownershipType: 'rent_out'|'business'|'rented',
     businessTypeId, monthlyIncome, rentMonthly, depositPaid
   }
────────────────────────────────────────────────────────── */
let state = {
  day: 1,
  bankBalance: STARTING_BALANCE,
  investedBalance: 0,
  holdings: {},       // spot long-lar
  positions: [],      // leveraged / short mövqelər
  priceHistory: {},
  newsFeed: [],
  transactions: [],
  engineState: null,
  unseenNewsCount: 0,
  currentCity: "baku",
  ownedProperties: []
};

// UI state
let activeFilter    = "all";
let activeInvTab    = "market";   // 'market' | 'portfolio'
let currentDetailAssetId = null;
let pendingTradeType = null;      // 'buy_long'|'buy_short'|'sell_long'|'close_pos'
let pendingLeverage = 1;
let pendingPositionId = null;

// Travel/RealEstate UI state
let selectedCityId = null;
let reActiveFilter = "all";
let reActiveTab = "listings";
let selectedPropertyId = null;
let reModalAction = null; // "buy" | "rent" | "rent_out_business"

/* ──────────────────────────────────────────────────────────
   SAXLAMA
────────────────────────────────────────────────────────── */
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { state = JSON.parse(raw); return true; }
  } catch(e) {}
  return false;
}

function initFreshState() {
  state.day = 1;
  state.bankBalance = STARTING_BALANCE;
  state.investedBalance = 0;
  state.holdings   = {};
  state.positions  = [];
  state.priceHistory = {};
  state.newsFeed   = [];
  state.transactions = [];
  state.unseenNewsCount = 0;
  state.currentCity = "baku";
  state.ownedProperties = [];
  ASSETS.forEach(a => {
    state.holdings[a.id]  = 0;
    state.priceHistory[a.id] = [a.basePrice];
  });
  Engine.init(null);
  state.engineState = Engine.getState();
  addTransaction("Hesab açıldı", STARTING_BALANCE, "in", "BMB");
}

/* ──────────────────────────────────────────────────────────
   KÖMƏKÇİLƏR
────────────────────────────────────────────────────────── */
function fmtMoney(val) {
  if (Math.abs(val) < 0.01 && val !== 0) return "$" + val.toFixed(6);
  return "$" + val.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
}
function fmtPrice(val) {
  if (val < 0.01) return "$" + val.toFixed(6);
  if (val < 1)   return "$" + val.toFixed(4);
  return "$" + val.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
}
function getAsset(id)   { return ASSETS.find(a => a.id === id); }
function getLastPrice(id) { const h = state.priceHistory[id]; return h[h.length-1]; }
function getAssetInitials(name) { return name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase().slice(0,2); }
function sectorColor(sector) { return (SECTORS[sector] && SECTORS[sector].color) || "#8B94A3"; }

function calcSpotPortfolioValue() {
  return ASSETS.reduce((sum, a) => {
    const qty = state.holdings[a.id] || 0;
    return sum + (qty > 0 ? qty * getLastPrice(a.id) : 0);
  }, 0);
}

function calcPositionsPnl() {
  return state.positions.reduce((sum, pos) => sum + calcPosPnl(pos), 0);
}

function calcPosPnl(pos) {
  const cur = getLastPrice(pos.assetId);
  const priceDiff = pos.type === 'long'
    ? cur - pos.entryPrice
    : pos.entryPrice - cur;
  return priceDiff * pos.qty * pos.leverage;
}

function calcNetWorth() {
  return state.bankBalance + state.investedBalance
    + calcSpotPortfolioValue() + calcPositionsPnl();
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function addTransaction(title, amount, direction, account) {
  state.transactions.unshift({ id: Date.now()+Math.random(), title, amount, direction, account, day: state.day });
}

function hashCode(str) {
  let h = 0;
  for (let i=0;i<str.length;i++){h=(h<<5)-h+str.charCodeAt(i);h|=0;}
  return h;
}

/* ──────────────────────────────────────────────────────────
   NAVİGASİYA
────────────────────────────────────────────────────────── */
function navigateTo(screenId) {
  document.querySelectorAll(".screen-view").forEach(el => el.classList.remove("active"));
  document.getElementById("screen-" + screenId).classList.add("active");
  if (screenId === "news") {
    state.unseenNewsCount = 0;
    saveState();
    renderHome();
  }
}

/* ──────────────────────────────────────────────────────────
   RENDER: HOME
────────────────────────────────────────────────────────── */
function renderHome() {
  const nw = calcNetWorth();
  const pct = ((nw - STARTING_BALANCE) / STARTING_BALANCE) * 100;
  document.getElementById("status-day-label").textContent = "GÜN " + state.day;
  document.getElementById("home-net-worth").textContent = fmtMoney(nw);
  const chEl = document.getElementById("home-net-worth-change");
  chEl.textContent = (pct>=0?"+":"") + pct.toFixed(2) + "% başlanğıcdan";
  chEl.className = "net-worth-change " + (pct>=0?"up":"down");
  const badge = document.getElementById("news-badge");
  if (state.unseenNewsCount > 0) { badge.style.display="flex"; badge.textContent=state.unseenNewsCount; }
  else badge.style.display="none";
  document.getElementById("nd-news-preview").textContent =
    state.unseenNewsCount > 0 ? state.unseenNewsCount+" yeni xəbər" : "Bazarlar yenilənəcək";
}

/* ──────────────────────────────────────────────────────────
   RENDER: INVESTED — Market siyahısı
────────────────────────────────────────────────────────── */
function renderAssetList() {
  const container = document.getElementById("asset-list");
  const filtered = activeFilter==="all" ? ASSETS : ASSETS.filter(a=>a.type===activeFilter);
  document.getElementById("inv-balance").textContent = fmtMoney(state.investedBalance);
  document.getElementById("inv-portfolio-value").textContent = fmtMoney(calcSpotPortfolioValue() + calcPositionsPnl());

  container.innerHTML = filtered.map(asset => {
    const price  = getLastPrice(asset.id);
    const change = Engine.getDailyChangePercent(state.priceHistory[asset.id]);
    const cls    = change>=0?"up":"down";
    const sign   = change>=0?"+":"";
    const color  = sectorColor(asset.sector);
    const initials = getAssetInitials(asset.name);
    // Sahib olduğun göstərici
    const qty = state.holdings[asset.id] || 0;
    const hasPos = state.positions.some(p=>p.assetId===asset.id);
    const indicator = qty > 0 || hasPos
      ? `<div style="width:6px;height:6px;border-radius:50%;background:var(--c-up);margin-top:3px;"></div>` : "";
    return `
      <div class="asset-row" data-asset-id="${asset.id}">
        <div class="asset-icon" style="background:${color}33;color:${color};">${initials}</div>
        <div class="asset-info">
          <div class="asset-name">${asset.name} ${indicator}</div>
          <div class="asset-ticker">${asset.ticker} · ${SECTORS[asset.sector].label}</div>
        </div>
        <div class="asset-price-block">
          <div class="asset-price">${fmtPrice(price)}</div>
          <div class="asset-change ${cls}">${sign}${change.toFixed(2)}%</div>
        </div>
      </div>`;
  }).join("");

  container.querySelectorAll(".asset-row").forEach(row=>{
    row.addEventListener("click", ()=>openAssetDetail(row.dataset.assetId));
  });
}

/* ──────────────────────────────────────────────────────────
   RENDER: PORTFOLIO TAB
   Spot long-lar + açıq mövqelər (leveraged/short)
────────────────────────────────────────────────────────── */
function renderPortfolio() {
  const container = document.getElementById("portfolio-list");
  let html = "";

  // ── SPOT LONG-LAR ──
  const spotHoldings = ASSETS.filter(a => (state.holdings[a.id]||0) > 0);
  if (spotHoldings.length > 0) {
    html += `<div class="pf-section-title">📦 Spot Mövqelər</div>`;
    spotHoldings.forEach(asset => {
      const qty   = state.holdings[asset.id];
      const price = getLastPrice(asset.id);
      const val   = qty * price;
      const color = sectorColor(asset.sector);
      const initials = getAssetInitials(asset.name);
      const change = Engine.getDailyChangePercent(state.priceHistory[asset.id]);
      const cls  = change>=0?"up":"down";
      const sign = change>=0?"+":"";
      html += `
        <div class="pf-row" data-asset-id="${asset.id}" data-action="spot">
          <div class="asset-icon" style="background:${color}33;color:${color};width:36px;height:36px;font-size:11px;border-radius:10px;">${initials}</div>
          <div class="asset-info">
            <div class="asset-name">${asset.name}</div>
            <div class="asset-ticker">${qty.toLocaleString("en-US",{maximumFractionDigits:6})} ${asset.ticker}</div>
          </div>
          <div class="asset-price-block">
            <div class="asset-price">${fmtMoney(val)}</div>
            <div class="asset-change ${cls}">${sign}${change.toFixed(2)}%</div>
          </div>
        </div>`;
    });
  }

  // ── LEVERAGED / SHORT MÖVQƏLƏRİ ──
  const openPos = state.positions;
  if (openPos.length > 0) {
    html += `<div class="pf-section-title" style="margin-top:14px;">⚡ Açıq Mövqelər</div>`;
    openPos.forEach(pos => {
      const asset = getAsset(pos.assetId);
      const cur   = getLastPrice(pos.assetId);
      const pnl   = calcPosPnl(pos);
      const pnlPct = (pnl / pos.margin) * 100;
      const pnlCls = pnl>=0?"up":"down";
      const pnlSign = pnl>=0?"+":"";
      const color = sectorColor(asset.sector);
      const initials = getAssetInitials(asset.name);
      const typeLabel = pos.type==="long"
        ? `<span style="color:var(--c-up);font-size:10px;font-weight:700;">LONG ${pos.leverage}x</span>`
        : `<span style="color:var(--c-down);font-size:10px;font-weight:700;">SHORT ${pos.leverage}x</span>`;
      html += `
        <div class="pf-row pf-pos-row" data-pos-id="${pos.id}">
          <div class="asset-icon" style="background:${color}33;color:${color};width:36px;height:36px;font-size:11px;border-radius:10px;">${initials}</div>
          <div class="asset-info">
            <div class="asset-name">${asset.name} ${typeLabel}</div>
            <div class="asset-ticker">Giriş: ${fmtPrice(pos.entryPrice)} · Margin: ${fmtMoney(pos.margin)}</div>
          </div>
          <div class="asset-price-block">
            <div class="asset-price ${pnlCls}">${pnlSign}${fmtMoney(pnl)}</div>
            <div class="asset-change ${pnlCls}">${pnlSign}${pnlPct.toFixed(1)}%</div>
          </div>
        </div>`;
    });
  }

  if (spotHoldings.length === 0 && openPos.length === 0) {
    html = '<div class="empty-state">Portfeldə heç nə yoxdur.<br>Bazar siyahısından alış et.</div>';
  }

  container.innerHTML = html;

  // Spot row click → aktiv detalına get
  container.querySelectorAll(".pf-row[data-asset-id]").forEach(row=>{
    row.addEventListener("click", ()=>openAssetDetail(row.dataset.assetId));
  });
  // Pos row click → mövqəni bağla modal
  container.querySelectorAll(".pf-pos-row[data-pos-id]").forEach(row=>{
    row.addEventListener("click", ()=>openClosePosModal(row.dataset.posId));
  });

  // Portfolio xülasəsi
  const totalPnl = calcPositionsPnl();
  const spotVal  = calcSpotPortfolioValue();
  document.getElementById("pf-total-value").textContent = fmtMoney(spotVal + totalPnl + state.investedBalance);
  const pnlEl = document.getElementById("pf-total-pnl");
  pnlEl.textContent = (totalPnl>=0?"+":"") + fmtMoney(totalPnl) + " (açıq mövqe P&L)";
  pnlEl.className = "pf-pnl " + (totalPnl>=0?"up":"down");
}

/* ──────────────────────────────────────────────────────────
   INVESTED TABS: Market / Portfolio
────────────────────────────────────────────────────────── */
function switchInvTab(tab) {
  activeInvTab = tab;
  document.querySelectorAll(".inv-main-tab").forEach(t=>t.classList.remove("active"));
  document.querySelector(`.inv-main-tab[data-main-tab="${tab}"]`).classList.add("active");
  document.getElementById("inv-market-panel").style.display  = tab==="market"    ? "flex" : "none";
  document.getElementById("inv-portfolio-panel").style.display = tab==="portfolio" ? "flex" : "none";
  if (tab==="portfolio") renderPortfolio();
  if (tab==="market")    renderAssetList();
}

/* ──────────────────────────────────────────────────────────
   ASSET DETAIL
────────────────────────────────────────────────────────── */
function openAssetDetail(assetId) {
  currentDetailAssetId = assetId;
  renderAssetDetail();
  navigateTo("asset-detail");
}

function renderAssetDetail() {
  const asset  = getAsset(currentDetailAssetId);
  const price  = getLastPrice(asset.id);
  const change = Engine.getDailyChangePercent(state.priceHistory[asset.id]);
  const cls    = change>=0?"up":"down";
  const sign   = change>=0?"+":"";
  const qty    = state.holdings[asset.id] || 0;
  const openPos = state.positions.filter(p=>p.assetId===asset.id);

  document.getElementById("detail-asset-name").innerHTML =
    asset.name + `<small>${asset.ticker} · ${SECTORS[asset.sector].label}</small>`;
  document.getElementById("detail-price").textContent = fmtPrice(price);
  const chEl = document.getElementById("detail-change");
  chEl.textContent = sign + change.toFixed(2) + "% (bugün)";
  chEl.className = "asset-change " + cls;

  document.getElementById("detail-holding-qty").textContent =
    qty.toLocaleString("en-US",{maximumFractionDigits:6});
  document.getElementById("detail-holding-value").textContent = fmtMoney(qty*price);
  document.getElementById("detail-trade-balance").textContent = fmtMoney(state.investedBalance);

  // Açıq mövqelər bölməsi (detail-də)
  const posContainer = document.getElementById("detail-open-positions");
  if (openPos.length > 0) {
    posContainer.style.display = "block";
    posContainer.querySelector(".detail-pos-list").innerHTML = openPos.map(pos=>{
      const pnl = calcPosPnl(pos);
      const pnlCls = pnl>=0?"up":"down";
      const pnlSign = pnl>=0?"+":"";
      const lbl = pos.type==="long"
        ? `<span style="color:var(--c-up)">LONG ${pos.leverage}x</span>`
        : `<span style="color:var(--c-down)">SHORT ${pos.leverage}x</span>`;
      return `
        <div class="detail-pos-item" data-pos-id="${pos.id}" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--c-border);">
          <div>
            <div style="font-size:12px;font-weight:700;">${lbl} · ${pos.qty.toLocaleString("en-US",{maximumFractionDigits:6})} ədəd</div>
            <div style="font-size:11px;color:var(--c-text-tertiary);">Giriş: ${fmtPrice(pos.entryPrice)} · Margin: ${fmtMoney(pos.margin)}</div>
          </div>
          <div style="text-align:right;">
            <div class="${pnlCls}" style="font-family:var(--f-mono);font-size:13px;font-weight:600;">${pnlSign}${fmtMoney(pnl)}</div>
            <button class="btn-close-pos" data-pos-id="${pos.id}" style="margin-top:4px;font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid var(--c-down);background:var(--c-down-bg);color:var(--c-down);cursor:pointer;">Bağla</button>
          </div>
        </div>`;
    }).join("");
    posContainer.querySelectorAll(".btn-close-pos").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        e.stopPropagation();
        openClosePosModal(btn.dataset.posId);
      });
    });
  } else {
    posContainer.style.display = "none";
  }

  renderMiniChart(asset.id);
  renderAssetNewsHistory(asset.id);
}

function renderMiniChart(assetId) {
  const history = state.priceHistory[assetId].slice(-30);
  const container = document.getElementById("detail-chart");
  if (history.length < 2) { container.innerHTML=""; return; }
  const w=354, h=140, pad=8;
  const min=Math.min(...history), max=Math.max(...history);
  const range=(max-min)||1;
  const points = history.map((p,i)=>{
    return [ pad+(i/(history.length-1))*(w-pad*2),
             h-pad-((p-min)/range)*(h-pad*2) ];
  });
  const isUp = history[history.length-1] >= history[0];
  const lc   = isUp ? "#1FD67A" : "#FF4C5E";
  const pathD = points.map((p,i)=>(i===0?"M":"L")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
  const areaD = pathD+` L${points[points.length-1][0].toFixed(1)},${h-pad} L${points[0][0].toFixed(1)},${h-pad} Z`;
  container.innerHTML=`
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${lc}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${lc}" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${areaD}" fill="url(#cg)"/>
      <path d="${pathD}" fill="none" stroke="${lc}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`;
}

function renderAssetNewsHistory(assetId) {
  const relevant = state.newsFeed.filter(n=>n.assetId===assetId).slice(0,5);
  const c = document.getElementById("detail-news-list");
  if (relevant.length===0) { c.innerHTML='<div class="empty-state">Bu aktivlə bağlı hələ xəbər yoxdur</div>'; return; }
  c.innerHTML = relevant.map(n=>renderNewsCard(n,(Math.abs(hashCode(n.title+n.day))%5)+1)).join("");
}

/* ──────────────────────────────────────────────────────────
   TRADE MODAL — Al / Spot Sat / Short Aç
   type: 'buy_long' | 'sell_long' | 'open_short' | 'open_long_lev'
────────────────────────────────────────────────────────── */
function openTradeModal(type) {
  pendingTradeType = type;
  pendingLeverage  = 1;
  const asset = getAsset(currentDetailAssetId);
  const modal = document.getElementById("trade-modal-overlay");

  // Başlıq və alt başlıq
  const titles = {
    buy_long:      `Al — ${asset.name}`,
    sell_long:     `Sat — ${asset.name}`,
    open_short:    `Short Aç — ${asset.name}`,
    open_long_lev: `Long Aç (Leverage) — ${asset.name}`
  };
  const subs = {
    buy_long:      "Trade balansından spot alış",
    sell_long:     "Sahib olduğun aktivdən sat",
    open_short:    "Qiymət düşəcəyinə mövqe al",
    open_long_lev: "Qiymət qalxacağına leverage ilə mövqe al"
  };

  document.getElementById("tm-title").textContent = titles[type] || "Trade";
  document.getElementById("tm-sub").textContent   = subs[type] || "";
  document.getElementById("tm-unit-label").textContent = asset.ticker;
  document.getElementById("tm-quantity-input").value = "";
  document.getElementById("tm-total").textContent = "$0.00";
  document.getElementById("tm-error").classList.remove("active");

  // Leverage sıraları
  const levRow = document.getElementById("tm-leverage-row");
  const isLev  = type === "open_short" || type === "open_long_lev";
  levRow.style.display = isLev ? "flex" : "none";
  if (isLev) {
    document.querySelectorAll(".lev-btn").forEach(btn=>{
      btn.classList.toggle("active", parseInt(btn.dataset.lev)===1);
    });
    pendingLeverage = 1;
  }

  const confirmBtn = document.getElementById("btn-modal-confirm");
  confirmBtn.className = "btn-modal-confirm " + (type==="sell_long"||type==="open_short" ? "sell" : "buy");
  confirmBtn.textContent = type==="sell_long" ? "Sat"
    : type==="open_short" ? "Short Aç"
    : type==="open_long_lev" ? "Long Aç"
    : "Al";

  modal.classList.add("active");
}

function closeTradeModal() {
  document.getElementById("trade-modal-overlay").classList.remove("active");
}

function updateTradeTotal() {
  const asset = getAsset(currentDetailAssetId);
  const qty   = parseFloat(document.getElementById("tm-quantity-input").value) || 0;
  const price = getLastPrice(asset.id);
  const isLev = pendingTradeType==="open_short" || pendingTradeType==="open_long_lev";
  const cost  = isLev ? (qty * price / pendingLeverage) : (qty * price);
  const lbl   = isLev ? `Margin: ${fmtMoney(cost)}` : `Cəmi: ${fmtMoney(cost)}`;
  document.getElementById("tm-total-label").textContent = isLev ? "Margin tələbi" : "Cəmi məbləğ";
  document.getElementById("tm-total").textContent = fmtMoney(cost);
}

function confirmTrade() {
  const asset = getAsset(currentDetailAssetId);
  const qty   = parseFloat(document.getElementById("tm-quantity-input").value) || 0;
  const price = getLastPrice(asset.id);
  const errorEl = document.getElementById("tm-error");

  if (qty <= 0) { errorEl.textContent="Düzgün miqdar daxil et"; errorEl.classList.add("active"); return; }

  if (pendingTradeType === "buy_long") {
    const total = qty * price;
    if (total > state.investedBalance) { errorEl.textContent="Trade balansı kifayət etmir"; errorEl.classList.add("active"); return; }
    state.investedBalance -= total;
    state.holdings[asset.id] = (state.holdings[asset.id]||0) + qty;
    addTransaction("Alış: "+asset.ticker, total, "out", "INVESTED");
    showToast(`${asset.ticker} alındı: ${fmtMoney(total)}`);

  } else if (pendingTradeType === "sell_long") {
    const owned = state.holdings[asset.id]||0;
    if (qty > owned) { errorEl.textContent=`${asset.ticker} kifayət qədər yoxdur`; errorEl.classList.add("active"); return; }
    const total = qty * price;
    state.holdings[asset.id] -= qty;
    state.investedBalance += total;
    addTransaction("Satış: "+asset.ticker, total, "in", "INVESTED");
    showToast(`${asset.ticker} satıldı: ${fmtMoney(total)}`);

  } else if (pendingTradeType === "open_short" || pendingTradeType === "open_long_lev") {
    const margin = (qty * price) / pendingLeverage;
    if (margin > state.investedBalance) { errorEl.textContent="Margin üçün balans kifayət etmir"; errorEl.classList.add("active"); return; }
    state.investedBalance -= margin;
    const posType = pendingTradeType === "open_short" ? "short" : "long";
    const newPos = {
      id: Date.now() + "_" + Math.random(),
      assetId: asset.id,
      type: posType,
      leverage: pendingLeverage,
      qty, entryPrice: price, margin,
      openDay: state.day,
      ticker: asset.ticker,
      name: asset.name
    };
    state.positions.push(newPos);
    addTransaction(`${posType.toUpperCase()} ${pendingLeverage}x: ${asset.ticker}`, margin, "out", "INVESTED");
    showToast(`${posType.toUpperCase()} ${pendingLeverage}x açıldı — margin: ${fmtMoney(margin)}`);
  }

  saveState();
  closeTradeModal();
  renderAssetDetail();
  renderAssetList();
}

/* ──────────────────────────────────────────────────────────
   MÖVQƏ BAĞLAMA MODAL
────────────────────────────────────────────────────────── */
function openClosePosModal(posId) {
  pendingPositionId = posId;
  const pos   = state.positions.find(p=>p.id===posId);
  if (!pos) return;
  const pnl   = calcPosPnl(pos);
  const pnlCls = pnl>=0?"up":"down";
  const pnlSign = pnl>=0?"+":"";

  document.getElementById("close-pos-title").textContent =
    `${pos.type==="long"?"LONG":"SHORT"} ${pos.leverage}x — ${pos.name}`;
  document.getElementById("close-pos-detail").innerHTML =
    `Miqdar: ${pos.qty} ${pos.ticker}<br>
     Giriş qiyməti: ${fmtPrice(pos.entryPrice)}<br>
     Cari qiymət: ${fmtPrice(getLastPrice(pos.assetId))}<br>
     Margin: ${fmtMoney(pos.margin)}<br>
     <span class="${pnlCls}">P&L: ${pnlSign}${fmtMoney(pnl)}</span>`;

  document.getElementById("close-pos-overlay").classList.add("active");
}

function closeClosePosModal() {
  document.getElementById("close-pos-overlay").classList.remove("active");
  pendingPositionId = null;
}

function confirmClosePos() {
  const pos = state.positions.find(p=>p.id===pendingPositionId);
  if (!pos) { closeClosePosModal(); return; }
  const pnl = calcPosPnl(pos);
  const returned = pos.margin + pnl;
  state.investedBalance += Math.max(returned, 0); // margin yandısa sıfır qayıdır
  state.positions = state.positions.filter(p=>p.id!==pendingPositionId);
  const sign = pnl>=0?"+":"";
  addTransaction(`Mövqə bağlandı: ${pos.ticker}`, Math.abs(pnl), pnl>=0?"in":"out", "INVESTED");
  showToast(`Mövqə bağlandı — P&L: ${sign}${fmtMoney(pnl)}`);
  saveState();
  closeClosePosModal();
  renderAssetDetail();
  renderAssetList();
  if (activeInvTab==="portfolio") renderPortfolio();
}

/* ──────────────────────────────────────────────────────────
   TRANSFER MODAL
────────────────────────────────────────────────────────── */
let transferDirection = null;

function openTransferModal(dir) {
  transferDirection = dir;
  document.getElementById("transfer-title").textContent = dir==="toInvested" ? "BMB → INVESTED" : "INVESTED → BMB";
  document.getElementById("transfer-sub").textContent   = dir==="toInvested" ? "Bank balansından trade balansına köçür" : "Trade balansından bank balansına köçür";
  document.getElementById("transfer-amount-input").value = "";
  document.getElementById("transfer-error").classList.remove("active");
  document.getElementById("transfer-modal-overlay").classList.add("active");
}

function closeTransferModal() { document.getElementById("transfer-modal-overlay").classList.remove("active"); }

function confirmTransfer() {
  const amount = parseFloat(document.getElementById("transfer-amount-input").value)||0;
  const errorEl = document.getElementById("transfer-error");
  if (amount<=0) { errorEl.textContent="Düzgün məbləğ daxil et"; errorEl.classList.add("active"); return; }
  if (transferDirection==="toInvested") {
    if (amount>state.bankBalance) { errorEl.textContent="Bank balansı kifayət etmir"; errorEl.classList.add("active"); return; }
    state.bankBalance -= amount;
    state.investedBalance += amount;
    addTransaction("Transfer → INVESTED", amount, "out", "BMB");
  } else {
    if (amount>state.investedBalance) { errorEl.textContent="Trade balansı kifayət etmir"; errorEl.classList.add("active"); return; }
    state.investedBalance -= amount;
    state.bankBalance += amount;
    addTransaction("Transfer → BMB", amount, "in", "BMB");
  }
  saveState();
  closeTransferModal();
  renderBank();
  renderAssetList();
  showToast("Transfer tamamlandı: "+fmtMoney(amount));
}

/* ──────────────────────────────────────────────────────────
   RENDER: BMB
────────────────────────────────────────────────────────── */
function renderBank() {
  document.getElementById("bank-balance").textContent = fmtMoney(state.bankBalance);
  const c = document.getElementById("tx-list");
  if (state.transactions.length===0) { c.innerHTML='<div class="empty-state">Tranzaksiya tarixçəsi boşdur</div>'; return; }
  c.innerHTML = state.transactions.slice(0,30).map(tx=>{
    const icon = tx.direction==="in"?"↓":"↑";
    const sign = tx.direction==="in"?"+":"−";
    return `
      <div class="tx-row">
        <div class="tx-icon ${tx.direction}">${icon}</div>
        <div class="tx-info">
          <div class="tx-title">${tx.title}</div>
          <div class="tx-meta">${tx.account} · Gün ${tx.day}</div>
        </div>
        <div class="tx-amount ${tx.direction==='in'?'up':'down'}">${sign}${fmtMoney(tx.amount).slice(1)}</div>
      </div>`;
  }).join("");
}

/* ──────────────────────────────────────────────────────────
   NEWS KARTLARI
   Qeyd: faiz təsiri, "tətbiq olundu" statusu və müsbət/mənfi
   rəng KƏSDİRİLƏRƏK göstərilmir — oyunçu xəbərin mətnini oxuyub
   özü təxmin etməlidir ki, bu yaxşı yoxsa pis xəbərdir və
   nə qədər/neçə gün təsir edə bilər. Arxa planda təsir
   eyni qaydada (Engine üzərindən) işləyir, sadəcə UI-da
   görünmür.
────────────────────────────────────────────────────────── */
function renderNewsCard(newsItem, tNum) {
  const asset = getAsset(newsItem.assetId);
  if (!asset) return "";
  const ico = newsItem.icon||"";
  switch(tNum) {
    case 1: return `<div class="news-card t1"><div class="nc-icon"><img src="${ico}" alt="" onerror="this.style.display='none'"></div><div class="nc-body"><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div></div></div>`;
    case 2: return `<div class="news-card t2"><div class="nc-tag"><img src="${ico}" alt="" onerror="this.style.display='none'">${asset.ticker}</div><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div></div>`;
    case 3: return `<div class="news-card t3"><div class="nc-top"><img src="${ico}" alt="" onerror="this.style.display='none'"><span class="nc-ticker-pill">${asset.ticker}</span></div><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div></div>`;
    case 4: return `<div class="news-card t4"><div class="nc-quote-mark">"</div><div class="nc-body"><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div><div class="nc-foot"><img src="${ico}" alt="" onerror="this.style.display='none'"><span style="font-size:11px;color:var(--c-text-tertiary);">${asset.ticker}</span></div></div></div>`;
    case 5: default:
      return `<div class="news-card t5"><div class="nc-header-row"><span class="nc-ticker-badge">${asset.ticker}</span><img src="${ico}" alt="" onerror="this.style.display='none'"></div><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div></div>`;
  }
}

function renderNewsFeed() {
  const c = document.getElementById("news-feed");
  if (state.newsFeed.length===0) { c.innerHTML='<div class="empty-state">Hələ xəbər yoxdur. "İrəli ▶" basaraq başla.</div>'; return; }
  const byDay={};
  state.newsFeed.forEach(n=>{ if(!byDay[n.day]) byDay[n.day]=[]; byDay[n.day].push(n); });
  const days=Object.keys(byDay).map(Number).sort((a,b)=>b-a);
  let html="";
  days.forEach(day=>{
    html+=`<div class="day-divider">Gün ${day}</div>`;
    byDay[day].forEach(n=>{ html+=renderNewsCard(n,(Math.abs(hashCode(n.title+n.day))%5)+1); });
  });
  c.innerHTML=html;
}

/* ──────────────────────────────────────────────────────────
   TRAVEL APP
────────────────────────────────────────────────────────── */
function openTravel() {
  navigateTo("travel");
  renderTravelMap();
  renderCityList();
  renderCurrentCityBanner();
}

function renderCurrentCityBanner() {
  const city = CITIES.find(c => c.id === state.currentCity) || CITIES[0];
  document.getElementById("tcc-name").textContent = `${city.name}, ${city.country}`;
  document.getElementById("tcc-flag").textContent = city.flag;
}

function renderTravelMap() {
  // Aktiv şəhəri xəritədə vurgula
  document.querySelectorAll(".map-city-dot").forEach(dot => {
    dot.setAttribute("r", "6");
    dot.setAttribute("stroke-width", "1.5");
  });
  const activeDot = document.getElementById("map-dot-" + state.currentCity);
  if (activeDot) {
    activeDot.setAttribute("r", "9");
    activeDot.setAttribute("stroke-width", "2.5");
  }

  // Nöqtələrə klik
  document.querySelectorAll(".map-city-dot").forEach(dot => {
    dot.style.cursor = "pointer";
    dot.onclick = () => openCityDetail(dot.dataset.city);
  });
}

function renderCityList() {
  const container = document.getElementById("travel-city-list");
  container.innerHTML = CITIES.map(city => {
    const isActive = city.id === state.currentCity;
    const canAfford = state.bankBalance >= (city.minBalance + city.moveCost);
    const statusLabel = isActive
      ? `<span style="color:#1FD67A;font-size:11px;font-weight:600;">✓ Hazırda buradasın</span>`
      : canAfford
        ? `<span style="color:#E8A33D;font-size:11px;">Köçmək olar</span>`
        : `<span style="color:var(--c-down);font-size:11px;">Min: ${fmtMoney(city.minBalance)}</span>`;

    return `
      <div class="travel-city-card" data-city="${city.id}" style="border-left:3px solid ${city.color};">
        <div class="tcc-left">
          <div class="tcc-flag-sm">${city.flag}</div>
          <div>
            <div class="tcc-city-name">${city.name}</div>
            <div class="tcc-country">${city.country}</div>
          </div>
        </div>
        <div class="tcc-right">
          ${statusLabel}
          <div class="tcc-arrow">›</div>
        </div>
      </div>`;
  }).join("");

  container.querySelectorAll(".travel-city-card").forEach(card => {
    card.addEventListener("click", () => openCityDetail(card.dataset.city));
  });
}

function openCityDetail(cityId) {
  selectedCityId = cityId;
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return;

  navigateTo("travel-detail");

  document.getElementById("travel-detail-title").childNodes[0].textContent = city.name;
  document.getElementById("travel-detail-sub").textContent = city.country;
  document.getElementById("tdh-flag").textContent = city.flag;
  document.getElementById("tdh-name").textContent = `${city.name}, ${city.country}`;
  document.getElementById("tdh-tag").textContent = city.tag;

  const totalCost = city.visaCost + city.moveCost;
  document.getElementById("trc-min-balance").textContent = fmtMoney(city.minBalance);
  document.getElementById("trc-visa-cost").textContent   = fmtMoney(city.visaCost);
  document.getElementById("trc-total-cost").textContent  = fmtMoney(totalCost);
  document.getElementById("trc-your-balance").textContent = fmtMoney(state.bankBalance);

  // Üstünlüklər
  document.getElementById("travel-perks").innerHTML = `
    <div class="travel-perks-wrap">
      ${city.perks.map(p => `<div class="travel-perk-item">✓ ${p}</div>`).join("")}
    </div>`;

  const statusEl = document.getElementById("travel-move-status");
  const btn = document.getElementById("btn-travel-move");

  if (city.id === state.currentCity) {
    statusEl.style.display = "block";
    statusEl.style.color = "#1FD67A";
    statusEl.textContent = "✓ Artıq bu şəhərdə yaşayırsan.";
    btn.disabled = true;
    btn.textContent = "Hazırda buradasın";
  } else if (state.bankBalance < city.minBalance) {
    statusEl.style.display = "block";
    statusEl.style.color = "var(--c-down)";
    statusEl.textContent = `✗ Bank balansın kifayət etmir. Minimum: ${fmtMoney(city.minBalance)}`;
    btn.disabled = true;
    btn.textContent = "Balans kifayət etmir";
  } else if (state.bankBalance < city.minBalance + totalCost) {
    statusEl.style.display = "block";
    statusEl.style.color = "var(--c-down)";
    statusEl.textContent = `✗ Köçmə xərci üçün balansın çatmır. Lazım: ${fmtMoney(totalCost)}`;
    btn.disabled = true;
    btn.textContent = "Balans kifayət etmir";
  } else {
    statusEl.style.display = "none";
    btn.disabled = false;
    btn.textContent = `${city.name}-ə köç — ${fmtMoney(totalCost)}`;
  }
}

/* ──────────────────────────────────────────────────────────
   REALESTATE APP
────────────────────────────────────────────────────────── */
function openRealEstate() {
  navigateTo("realestate");
  const city = CITIES.find(c => c.id === state.currentCity) || CITIES[0];
  document.getElementById("re-city-sub").textContent = `${city.name} əmlak bazarı`;
  renderREListings();
  renderREOwned();
}

function getPropertiesForCurrentCity() {
  return ALL_PROPERTIES[state.currentCity] || [];
}

function renderREListings() {
  const props = getPropertiesForCurrentCity().filter(p => {
    const alreadyOwned = state.ownedProperties.some(o => o.propertyId === p.id);
    if (alreadyOwned) return false;
    if (reActiveFilter === "all") return true;
    return p.type === reActiveFilter;
  });

  const container = document.getElementById("re-listings-list");
  if (props.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px 16px;color:var(--c-text-secondary);font-size:13px;">Bu kateqoriyada əlçatan əmlak yoxdur.</div>`;
    return;
  }

  container.innerHTML = props.map(p => {
    const areaMult = AREA_MULTIPLIERS[p.area];
    const income = p.type === "residential"
      ? `${fmtMoney(p.rentPrice)}/ay`
      : `${fmtMoney(Math.round(p.m2 * 15 * areaMult.revenueMult))}-${fmtMoney(Math.round(p.m2 * 25 * areaMult.revenueMult))}/ay`;
    return `
      <div class="re-listing-card" data-prop-id="${p.id}">
        <div class="re-lc-icon">${p.icon}</div>
        <div class="re-lc-info">
          <div class="re-lc-name">${p.name}</div>
          <div class="re-lc-desc">${p.desc}</div>
          <div class="re-lc-tags">
            <span class="re-tag">${p.m2} m²</span>
            <span class="re-tag">${AREA_MULTIPLIERS[p.area].label}</span>
            <span class="re-tag re-tag-income">↑ ${income}</span>
          </div>
        </div>
        <div class="re-lc-price">${fmtMoney(p.buyPrice)}</div>
      </div>`;
  }).join("");

  container.querySelectorAll(".re-listing-card").forEach(card => {
    card.addEventListener("click", () => openPropertyDetail(card.dataset.propId));
  });
}

function renderREOwned() {
  const container = document.getElementById("re-owned-list");
  if (state.ownedProperties.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px 16px;color:var(--c-text-secondary);font-size:13px;">Hələ əmlak almamısan.</div>`;
    return;
  }

  const allProps = Object.values(ALL_PROPERTIES).flat();

  container.innerHTML = state.ownedProperties.map((owned, idx) => {
    const p = allProps.find(x => x.id === owned.propertyId);
    if (!p) return "";

    const typeLabel = owned.ownershipType === "rent_out"
      ? "Kirayəyə verilir"
      : owned.ownershipType === "business"
        ? BUSINESS_TYPES.find(b => b.id === owned.businessTypeId)?.name || "Biznes"
        : "Kirayədə yaşayır";

    const incomeRange = owned.monthlyIncome
      ? typeof owned.monthlyIncome === "object"
        ? `${fmtMoney(owned.monthlyIncome.min)}–${fmtMoney(owned.monthlyIncome.max)}/ay`
        : `${fmtMoney(owned.monthlyIncome)}/ay`
      : "—";

    // Xərc/borc statusu (yalnız business/rent_out üçün)
    let expenseHtml = "";
    if (owned.ownershipType === "business" || owned.ownershipType === "rent_out") {
      const exp = calcWeeklyExpense(owned, p);
      const daysLeft = RE_EXPENSE_CONFIG.paymentCycleDays - (state.day - owned.lastPaymentDay);
      const hasDebt = owned.debt > 0.01;

      const statusLine = hasDebt
        ? `<div class="re-oc-debt">⚠️ Borc: ${fmtMoney(owned.debt)} (${owned.unpaidCycles}/3 gecikmə)</div>`
        : `<div class="re-oc-expense">Həftəlik xərc: ${fmtMoney(exp.total)} · ${daysLeft >= 0 ? daysLeft + " gün sonra" : "vaxtı keçib"}</div>`;

      const activeToggle = `
        <button class="re-oc-toggle ${owned.active ? "on" : "off"}" data-idx="${idx}">
          ${owned.active ? "Aktivdir" : "Bağlıdır"}
        </button>`;

      expenseHtml = `${statusLine}<div class="re-oc-actions">${activeToggle}<button class="re-oc-change-biz" data-idx="${idx}">Biznesi dəyiş</button></div>`;
    }

    return `
      <div class="re-owned-card ${owned.debt > 0.01 ? "has-debt" : ""}">
        <div class="re-oc-icon">${p.icon}</div>
        <div class="re-oc-info">
          <div class="re-oc-name">${p.name}</div>
          <div class="re-oc-type">${typeLabel}</div>
          <div class="re-oc-income" style="color:#1FD67A;">↑ ${incomeRange}</div>
          ${expenseHtml}
        </div>
      </div>`;
  }).join("");

  // Aktiv/bağlı toggle
  container.querySelectorAll(".re-oc-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      state.ownedProperties[idx].active = !state.ownedProperties[idx].active;
      saveState();
      renderREOwned();
    });
  });

  // Biznes dəyiş düyməsi
  container.querySelectorAll(".re-oc-change-biz").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      openChangeBusinessModal(idx);
    });
  });
}
let changeBizPropertyIdx = null;

function openChangeBusinessModal(idx) {
  changeBizPropertyIdx = idx;
  const owned = state.ownedProperties[idx];
  const allProps = Object.values(ALL_PROPERTIES).flat();
  const p = allProps.find(x => x.id === owned.propertyId);
  if (!p || p.type !== "commercial") {
    showToast("Bu əmlak üçün biznes dəyişdirilə bilməz");
    return;
  }
  selectedPropertyId = p.id; // confirmREModal-da düzgün əmlakın istifadə olunması üçün

  const overlay = document.getElementById("re-modal-overlay");
  document.getElementById("re-modal-title").textContent = "Biznesi dəyiş";
  document.getElementById("re-modal-sub").textContent = p.name;
  document.getElementById("re-modal-cost-label").textContent = "Yeni biznes seç";
  document.getElementById("re-modal-cost").textContent = "—";
  document.getElementById("re-modal-income").textContent = "—";
  document.getElementById("re-modal-error").style.display = "none";

  // Trade-modal-dakı biznes grid-i deyil, re-modal daxilinə dinamik grid əlavə edirik
  let gridWrap = document.getElementById("re-modal-biz-grid-wrap");
  if (!gridWrap) {
    gridWrap = document.createElement("div");
    gridWrap.id = "re-modal-biz-grid-wrap";
    gridWrap.className = "re-business-grid";
    gridWrap.style.padding = "10px 0 0";
    document.querySelector("#re-modal-overlay .trade-modal").insertBefore(
      gridWrap,
      document.getElementById("re-modal-error")
    );
  }
  gridWrap.style.display = "grid";
  gridWrap.innerHTML = BUSINESS_TYPES.map(biz => {
    const incomeData = calcPropertyIncome(p, "business", biz.id);
    const isCurrent = biz.id === owned.businessTypeId;
    return `
      <div class="re-biz-card ${isCurrent ? "selected" : ""}" data-biz="${biz.id}">
        <div class="re-biz-icon">${biz.icon}</div>
        <div class="re-biz-name">${biz.name}</div>
        <div class="re-biz-income">${fmtMoney(incomeData.min)}–${fmtMoney(incomeData.max)}/həftə</div>
        <div class="re-biz-setup">Quraşdırma: ${fmtMoney(biz.setupCost)}</div>
      </div>`;
  }).join("");

  gridWrap.querySelectorAll(".re-biz-card").forEach(card => {
    card.addEventListener("click", () => {
      gridWrap.querySelectorAll(".re-biz-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const biz = BUSINESS_TYPES.find(b => b.id === card.dataset.biz);
      document.getElementById("re-modal-cost").textContent = fmtMoney(biz.setupCost);
      const incomeData = calcPropertyIncome(p, "business", biz.id);
      document.getElementById("re-modal-income").textContent = `${fmtMoney(incomeData.min)}–${fmtMoney(incomeData.max)}/həftə`;
    });
  });

  // İlkin görünüş: hazırkı seçili (və ya heç biri) üçün xərc/gəlir göstər
  const initialSelected = gridWrap.querySelector(".re-biz-card.selected");
  if (initialSelected) {
    const biz = BUSINESS_TYPES.find(b => b.id === initialSelected.dataset.biz);
    document.getElementById("re-modal-cost").textContent = fmtMoney(biz.setupCost);
    const incomeData = calcPropertyIncome(p, "business", biz.id);
    document.getElementById("re-modal-income").textContent = `${fmtMoney(incomeData.min)}–${fmtMoney(incomeData.max)}/həftə`;
  }
  document.getElementById("re-modal-cost-label").textContent = "Quraşdırma xərci";

  reModalAction = "change_business";
  overlay.classList.add("active");
}
function openPropertyDetail(propId) {
  selectedPropertyId = propId;
  const allProps = Object.values(ALL_PROPERTIES).flat();
  const p = allProps.find(x => x.id === propId);
  if (!p) return;

  navigateTo("realestate-detail");

  document.getElementById("re-detail-title").childNodes[0].textContent = p.name;
  document.getElementById("re-detail-sub").textContent = `${p.m2} m² · ${AREA_MULTIPLIERS[p.area].label}`;
  document.getElementById("re-detail-img").textContent = p.icon;

  const areaMult = AREA_MULTIPLIERS[p.area];
  const rentIncome = Math.round(p.rentPrice * areaMult.revenueMult);
  const deposit = p.rentPrice * p.depositMonths;

  document.getElementById("re-detail-info").innerHTML = `
    <div class="re-detail-info-grid">
      <div class="re-di-row"><span>Sahə</span><span>${p.m2} m²</span></div>
      <div class="re-di-row"><span>Ərazi</span><span>${AREA_MULTIPLIERS[p.area].label}</span></div>
      <div class="re-di-row"><span>Satış qiyməti</span><span>${fmtMoney(p.buyPrice)}</span></div>
      <div class="re-di-row"><span>Kirayə (aylıq)</span><span>${fmtMoney(p.rentPrice)}</span></div>
      <div class="re-di-row"><span>Depozit (${p.depositMonths} ay)</span><span>${fmtMoney(deposit)}</span></div>
      <div class="re-di-row" style="color:#1FD67A;"><span>Kirayəyə versən gəlir</span><span>${fmtMoney(rentIncome)}/ay</span></div>
    </div>
    <div class="re-di-desc">${p.desc}</div>`;

  // Hərəkət düymələri
  const canBuy   = state.bankBalance >= p.buyPrice;
  const canRent  = state.bankBalance >= deposit;

  document.getElementById("re-detail-actions").innerHTML = `
    <button class="btn-re-action${canBuy ? "" : " disabled"}" id="btn-re-buy" ${canBuy ? "" : "disabled"}>
      Al — ${fmtMoney(p.buyPrice)}
    </button>
    <button class="btn-re-action secondary${canRent ? "" : " disabled"}" id="btn-re-rent" ${canRent ? "" : "disabled"}>
      Kirayə götür — ${fmtMoney(p.rentPrice)}/ay (dep: ${fmtMoney(deposit)})
    </button>`;

  // Biznes bölməsi (yalnız kommersiya)
  const bizSection = document.getElementById("re-business-section");
  if (p.type === "commercial") {
    bizSection.style.display = "block";
    const grid = document.getElementById("re-business-grid");
    grid.innerHTML = BUSINESS_TYPES.map(biz => {
      const incomeData = calcPropertyIncome(p, "business", biz.id);
      return `
        <div class="re-biz-card" data-biz="${biz.id}">
          <div class="re-biz-icon">${biz.icon}</div>
          <div class="re-biz-name">${biz.name}</div>
          <div class="re-biz-income">${fmtMoney(incomeData.min)}–${fmtMoney(incomeData.max)}/ay</div>
          <div class="re-biz-desc">${biz.desc}</div>
        </div>`;
    }).join("");

    grid.querySelectorAll(".re-biz-card").forEach(card => {
      card.addEventListener("click", () => {
        grid.querySelectorAll(".re-biz-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });
  } else {
    bizSection.style.display = "none";
  }

  // Düymə eventləri
  document.getElementById("btn-re-buy").onclick  = () => openREModal("buy", p);
  document.getElementById("btn-re-rent").onclick = () => openREModal("rent", p);
}

function openREModal(action, property) {
  reModalAction = action;
  const areaMult = AREA_MULTIPLIERS[property.area];
  const overlay = document.getElementById("re-modal-overlay");

  if (action === "buy") {
    document.getElementById("re-modal-title").textContent = "Əmlak al";
    document.getElementById("re-modal-sub").textContent   = property.name;
    document.getElementById("re-modal-cost-label").textContent = "Satış qiyməti";
    document.getElementById("re-modal-cost").textContent  = fmtMoney(property.buyPrice);

    // Kirayəyə vermə gəliri
    const rentIncome = calcPropertyIncome(property, "rent_out");
    document.getElementById("re-modal-income").textContent = `${fmtMoney(rentIncome)}/həftə (kirayəyə versən)`;

    const canAfford = state.bankBalance >= property.buyPrice;
    document.getElementById("re-modal-error").style.display = canAfford ? "none" : "block";
    document.getElementById("btn-re-modal-confirm").disabled = !canAfford;
  } else {
    const deposit = property.rentPrice * property.depositMonths;
    document.getElementById("re-modal-title").textContent = "Kirayə götür";
    document.getElementById("re-modal-sub").textContent   = property.name;
    document.getElementById("re-modal-cost-label").textContent = `Depozit (${property.depositMonths} ay)`;
    document.getElementById("re-modal-cost").textContent  = fmtMoney(deposit);
    document.getElementById("re-modal-income").textContent = `${fmtMoney(property.rentPrice)}/ay kirayə`;

    const canAfford = state.bankBalance >= deposit;
    document.getElementById("re-modal-error").style.display = canAfford ? "none" : "block";
    document.getElementById("btn-re-modal-confirm").disabled = !canAfford;
  }

  overlay.classList.add("active");
}

function closeREModal() {
  document.getElementById("re-modal-overlay").classList.remove("active");
}

function confirmREModal() {
  const allProps = Object.values(ALL_PROPERTIES).flat();
  const p = allProps.find(x => x.id === selectedPropertyId);
  if (!p) return;

  const areaMult = AREA_MULTIPLIERS[p.area];

  if (reModalAction === "buy") {
    if (state.bankBalance < p.buyPrice) return;
    state.bankBalance -= p.buyPrice;

    // Biznes seçildi mi?
    const selectedBiz = document.querySelector("#re-business-grid .re-biz-card.selected");
    let ownershipType = "rent_out";
    let businessTypeId = null;
    let monthlyIncome;

    if (selectedBiz && p.type === "commercial") {
      ownershipType = "business";
      businessTypeId = selectedBiz.dataset.biz;
      monthlyIncome = calcPropertyIncome(p, "business", businessTypeId);
    } else {
      monthlyIncome = calcPropertyIncome(p, "rent_out");
    }

state.ownedProperties.push({
      propertyId: p.id,
      ownershipType,
      businessTypeId,
      monthlyIncome,
      active: true,            // biznes/kirayə aktiv işləyir mi
      lastPaymentDay: state.day,   // son ödənişin (və ya alışın) günü
      unpaidCycles: 0,          // neçə ödəniş dövrü gecikib
      debt: 0                   // yığılmış borc (cərimə daxil)
    });
    addTransaction(`${p.name} alındı`, p.buyPrice, "out", "REALESTATE");
    showToast(`🏠 ${p.name} alındı!`);
     
} else if (reModalAction === "change_business") {
    const selectedBiz = document.querySelector("#re-modal-biz-grid-wrap .re-biz-card.selected");
    if (!selectedBiz) { showToast("Biznes seç"); return; }
    const newBizId = selectedBiz.dataset.biz;
    const biz = BUSINESS_TYPES.find(b => b.id === newBizId);
    const setupCost = biz.setupCost || 0;

    if (state.bankBalance < setupCost) {
      showToast(`Kifayət qədər balans yoxdur — lazım: ${fmtMoney(setupCost)}`);
      return;
    }

    const owned = state.ownedProperties[changeBizPropertyIdx];
    state.bankBalance -= setupCost;
    owned.businessTypeId = newBizId;
    owned.ownershipType = "business";
    owned.monthlyIncome = calcPropertyIncome(p, "business", newBizId);
    owned.lastPaymentDay = state.day; // yeni biznes üçün ödəniş dövrü sıfırlanır
    owned.unpaidCycles = 0;
    owned.debt = 0;

    addTransaction(`${biz.name} quruluşu: ${p.name}`, setupCost, "out", "REALESTATE");
    showToast(`${biz.name} quruldu — xərc: ${fmtMoney(setupCost)}`);

    saveState();
    closeREModal();
    renderHome();
    renderREOwned();
    return;
  } else {
     
    const deposit = p.rentPrice * p.depositMonths;
    if (state.bankBalance < deposit) return;
    state.bankBalance -= deposit;
    state.ownedProperties.push({
      propertyId: p.id,
      ownershipType: "rented",
      businessTypeId: null,
      monthlyIncome: 0,
      rentMonthly: p.rentPrice,
      depositPaid: deposit
    });
    addTransaction(`${p.name} kirayə depoziti`, deposit, "out", "REALESTATE");
    showToast(`🔑 ${p.name} kirayə götürüldü!`);
  }
   
  saveState();
  renderHome();
  closeREModal();
  navigateTo("realestate");
  renderREListings();
  renderREOwned();
}
/* ──────────────────────────────────────────────────────────
   REALESTATE — HƏFTƏLİK XƏRC HESABLAMALARI
────────────────────────────────────────────────────────── */
function calcWeeklyUtility(property, businessTypeId) {
  const areaMult = AREA_MULTIPLIERS[property.area];
  const biz = BUSINESS_TYPES.find(b => b.id === businessTypeId);
  const utilFactor = biz ? biz.utilityFactor : 1.2; // rent_out üçün default əmsal
  return property.m2 * RE_EXPENSE_CONFIG.baseUtilityPerM2Weekly * utilFactor * areaMult.revenueMult;
}

function calcWeeklyNetIncomeEstimate(owned, property) {
  // owned.monthlyIncome obyekt (min/max/avg) ya da rəqəm ola bilər
  let monthlyAvg;
  if (typeof owned.monthlyIncome === "object" && owned.monthlyIncome !== null) {
    monthlyAvg = owned.monthlyIncome.avg ?? ((owned.monthlyIncome.min + owned.monthlyIncome.max) / 2);
  } else {
    monthlyAvg = owned.monthlyIncome || 0;
  }
  return (monthlyAvg / 30) * 7; // həftəlik ümumi gəlir təxmini
}

function calcWeeklyExpense(owned, property) {
  const utility = calcWeeklyUtility(property, owned.businessTypeId);
  const grossWeekly = calcWeeklyNetIncomeEstimate(owned, property);
  const taxable = Math.max(grossWeekly - utility, 0);
  const tax = taxable * RE_EXPENSE_CONFIG.taxRate;
  return { utility, tax, total: utility + tax, grossWeekly };
}
/* ──────────────────────────────────────────────────────────
   PASSIV GƏLİR — Hər günün sonunda hesabla
   advanceDay() funksiyası içində çağırılır
────────────────────────────────────────────────────────── */
function processPropertyExpenses() {
  if (!state.ownedProperties || state.ownedProperties.length === 0) return;

  const allProps = Object.values(ALL_PROPERTIES).flat();
  const toRemove = [];

  state.ownedProperties.forEach(owned => {
    // Yalnız BUSINESS və RENT_OUT mülklər üçün xərc tələb olunur
    if (owned.ownershipType !== "business" && owned.ownershipType !== "rent_out") return;
    if (!owned.active) return; // bağlı/deaktiv mülkdən xərc tutulmur

    const property = allProps.find(x => x.id === owned.propertyId);
    if (!property) return;

    const daysSincePayment = state.day - owned.lastPaymentDay;
    if (daysSincePayment < RE_EXPENSE_CONFIG.paymentCycleDays) return; // hələ vaxtı çatmayıb

    // Bir dövr keçib — xərc hesabla və borc yarat (əgər artıq ödənməyibsə)
    const expense = calcWeeklyExpense(owned, property);

    // Avtomatik ödəmə cəhdi: bank balansından tutmağa çalış
    if (state.bankBalance >= expense.total + owned.debt) {
      state.bankBalance -= (expense.total + owned.debt);
      addTransaction(`${property.name} — həftəlik xərc`, expense.total + owned.debt, "out", "REALESTATE");
      owned.debt = 0;
      owned.unpaidCycles = 0;
      owned.lastPaymentDay = state.day;
    } else {
      // Ödənilmədi — borc və gecikmə sayğacı artır
      owned.debt += expense.total;
      owned.unpaidCycles += 1;
      owned.lastPaymentDay = state.day; // növbəti dövrü hesablamaq üçün sıfırlanır

      if (owned.unpaidCycles === 1) {
        showToast(`⚠️ ${property.name}: ödəniş gecikdi, cərimə başladı`);
      } else if (owned.unpaidCycles === 2) {
        showToast(`⚠️ ${property.name}: 2-ci gecikmə! Son xəbərdarlıq`);
      } else if (owned.unpaidCycles >= 3) {
        toRemove.push({ owned, property });
      }
    }

    // Gecikmiş borca gündəlik cərimə əlavə et (hər gün, borc varsa)
    if (owned.debt > 0 && owned.unpaidCycles > 0) {
      owned.debt += owned.debt * RE_EXPENSE_CONFIG.lateFeeDailyRate;
    }
  });

  // 3-cü dövr də ödənməyən mülkləri sat
  toRemove.forEach(({ owned, property }) => {
    const saleValue = Math.round(property.buyPrice * 0.7); // bazar dəyərinin 70%-i ilə məcburi satış
    const netReturn = Math.max(saleValue - owned.debt, 0);
    state.bankBalance += netReturn;
    state.ownedProperties = state.ownedProperties.filter(o => o !== owned);
    addTransaction(`${property.name} borc üzündən satıldı`, netReturn, "in", "REALESTATE");
    showToast(`🚨 ${property.name} borc üzündən əldən getdi! Qalan: ${fmtMoney(netReturn)}`);
  });
}
function processPropertyIncome() {
  if (!state.ownedProperties || state.ownedProperties.length === 0) return;

  let totalIncome = 0;
  state.ownedProperties.forEach(owned => {
    if (!owned.monthlyIncome) return;

    // Aylıq gəliri 30 günə böl → gündəlik gəlir
    let dailyIncome = 0;
    if (typeof owned.monthlyIncome === "object") {
      // min-max aralığında təsadüfi
      const monthly = owned.monthlyIncome.min + Math.random() * (owned.monthlyIncome.max - owned.monthlyIncome.min);
      dailyIncome = monthly / 30;
    } else {
      dailyIncome = owned.monthlyIncome / 30;
    }
    totalIncome += dailyIncome;
  });

  if (totalIncome > 0) {
    state.bankBalance += totalIncome;
    addTransaction("Əmlak gəliri", totalIncome, "in", "REALESTATE");
  }
}

/* ──────────────────────────────────────────────────────────
   GÜN İRƏLİLƏTMƏ
────────────────────────────────────────────────────────── */
function advanceDay() {
  Engine.init(state.engineState);
  const todaysNews = Engine.publishDailyNews(ASSETS, NEWS);
  todaysNews.forEach(n=>{ state.newsFeed.unshift({...n, day:state.day, applied:false}); });
  state.unseenNewsCount += todaysNews.length;
  const result = Engine.advanceDay(ASSETS, state.priceHistory, state.day);
  result.activatedNews.forEach(a=>{
    const m = state.newsFeed.find(n=>n.title===a.title && !n.applied && n.assetId===a.assetId);
    if(m) m.applied=true;
  });
  state.day = result.day;
  state.engineState = Engine.getState();

  // Margin call yoxlama
  const toClose = [];
  state.positions.forEach(pos=>{
    const pnl = calcPosPnl(pos);
    if (pnl <= -pos.margin * 0.9) toClose.push(pos);  // 90% itki = likvidasiya
  });
  toClose.forEach(pos=>{
    state.positions = state.positions.filter(p=>p.id!==pos.id);
    addTransaction(`Likvidasiya: ${pos.ticker}`, pos.margin, "out", "INVESTED");
    showToast(`⚠️ ${pos.ticker} mövqəsi likvidə edildi!`);
  });


// Əmlak həftəlik xərcləri (vergi+kommunal), cərimə və satış
  processPropertyExpenses();

  // Əmlakdan passiv gəlir
  processPropertyIncome();
  saveState();
  renderAll();
  showToast("Gün " + state.day + " başladı");
}

function renderAll() {
  renderHome();
  renderAssetList();
  renderBank();
  renderNewsFeed();
  if (currentDetailAssetId) renderAssetDetail();
  if (activeInvTab==="portfolio") renderPortfolio();
}

/* ──────────────────────────────────────────────────────────
   HADİSƏ DİNLƏYİCİLƏRİ
────────────────────────────────────────────────────────── */
function setupEventListeners() {
  // App açılışı
  document.querySelectorAll(".app-icon-wrap").forEach(el=>{
    el.addEventListener("click", ()=>{
      const app = el.dataset.app;
      if (app === "travel") { openTravel(); return; }
      if (app === "realestate") { openRealEstate(); return; }
      navigateTo(app==="invested"?"invested":app);
      if(app==="invested") renderAssetList();
      if(app==="bmb") renderBank();
      if(app==="news") renderNewsFeed();
    });
  });

  // Geri düymələri
  document.querySelectorAll(".btn-back").forEach(el=>{
    el.addEventListener("click", ()=>navigateTo(el.dataset.back));
  });

  // INVESTED — Bazar filter tabları
  document.querySelectorAll(".inv-tab").forEach(tab=>{
    tab.addEventListener("click", ()=>{
      document.querySelectorAll(".inv-tab").forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.filter;
      renderAssetList();
    });
  });

  // INVESTED — Market / Portfolio əsas tabları
  document.querySelectorAll(".inv-main-tab").forEach(tab=>{
    tab.addEventListener("click", ()=>switchInvTab(tab.dataset.mainTab));
  });

  // Növbəti gün
  document.getElementById("btn-advance-day").addEventListener("click", advanceDay);

  // Trade butonları
  document.getElementById("btn-open-buy").addEventListener("click",    ()=>openTradeModal("buy_long"));
  document.getElementById("btn-open-sell").addEventListener("click",   ()=>openTradeModal("sell_long"));
  document.getElementById("btn-open-short").addEventListener("click",  ()=>openTradeModal("open_short"));
  document.getElementById("btn-open-long-lev").addEventListener("click",()=>openTradeModal("open_long_lev"));

  // Trade modal
  document.getElementById("btn-modal-cancel").addEventListener("click", closeTradeModal);
  document.getElementById("btn-modal-confirm").addEventListener("click", confirmTrade);
  document.getElementById("tm-quantity-input").addEventListener("input", updateTradeTotal);

  // Leverage düymələri
  document.querySelectorAll(".lev-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".lev-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      pendingLeverage = parseInt(btn.dataset.lev);
      updateTradeTotal();
    });
  });

  // Mövqə bağlama modal
  document.getElementById("btn-close-pos-cancel").addEventListener("click", closeClosePosModal);
  document.getElementById("btn-close-pos-confirm").addEventListener("click", confirmClosePos);

  // Transfer modal
  document.getElementById("btn-transfer-to-invested").addEventListener("click", ()=>openTransferModal("toInvested"));
  document.getElementById("btn-transfer-to-bank").addEventListener("click",     ()=>openTransferModal("toBank"));
  document.getElementById("btn-transfer-cancel").addEventListener("click",  closeTransferModal);
  document.getElementById("btn-transfer-confirm").addEventListener("click", confirmTransfer);

  // Travel — köç düyməsi
  document.getElementById("btn-travel-move").addEventListener("click", () => {
    if (!selectedCityId) return;
    const city = CITIES.find(c => c.id === selectedCityId);
    if (!city) return;

    const totalCost = city.visaCost + city.moveCost;
    if (state.bankBalance < city.minBalance + totalCost) return;

    state.bankBalance -= totalCost;
    state.currentCity = city.id;
    addTransaction(`${city.name}-ə köçmə xərci`, totalCost, "out", "TRAVEL");

    saveState();
    renderHome();
    showToast(`🌍 ${city.name}-ə köçdün! -${fmtMoney(totalCost)}`);
    navigateTo("travel");
    renderCurrentCityBanner();
    renderTravelMap();
    renderCityList();
  });

  // RealEstate — modal
  document.getElementById("btn-re-modal-cancel").addEventListener("click", closeREModal);
  document.getElementById("btn-re-modal-confirm").addEventListener("click", confirmREModal);

  // RealEstate — tab / filter
  document.querySelectorAll(".re-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".re-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      reActiveTab = tab.dataset.reTab;
      document.getElementById("re-listings-panel").style.display = reActiveTab === "listings" ? "block" : "none";
      document.getElementById("re-owned-panel").style.display    = reActiveTab === "owned"    ? "block" : "none";
      if (reActiveTab === "owned") renderREOwned();
    });
  });

  document.querySelectorAll(".re-filter").forEach(f => {
    f.addEventListener("click", () => {
      document.querySelectorAll(".re-filter").forEach(x => x.classList.remove("active"));
      f.classList.add("active");
      reActiveFilter = f.dataset.reFilter;
      renderREListings();
    });
  });
}

/* ──────────────────────────────────────────────────────────
   BAŞLANĞIC
────────────────────────────────────────────────────────── */
function start() {
  const loaded = loadState();
  if (!loaded || !state.priceHistory || Object.keys(state.priceHistory).length===0) {
    initFreshState();
  } else {
    Engine.init(state.engineState);
    if (!state.positions) state.positions = [];
    if (!state.currentCity) state.currentCity = "baku";
    if (!state.ownedProperties) state.ownedProperties = [];
  }
  setupEventListeners();
  renderAll();
}

document.addEventListener("DOMContentLoaded", start);
