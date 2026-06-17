/* ============================================================
   APP.JS — Borsa Simulyasiyası v2
   Yeniliklər:
   - Portfolio tab: açıq mövqelər (long + short + leveraged)
   - Short (Sell In): aktivsiz satış mövqesi aç, sonra bağla
   - Leverage: 1x, 2x, 5x, 10x seçimi
   - Xəbər: gündə tam 10 aktiv, qalanı dalğalanma
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
  unseenNewsCount: 0
};

// UI state
let activeFilter    = "all";
let activeInvTab    = "market";   // 'market' | 'portfolio'
let currentDetailAssetId = null;
let pendingTradeType = null;      // 'buy_long'|'buy_short'|'sell_long'|'close_pos'
let pendingLeverage = 1;
let pendingPositionId = null;

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
────────────────────────────────────────────────────────── */
function renderNewsCard(newsItem, tNum) {
  const asset = getAsset(newsItem.assetId);
  if (!asset) return "";
  const isPos = newsItem.impact>=0;
  const ipct  = (newsItem.impact*100).toFixed(1);
  const sign  = isPos?"+":"";
  const status = newsItem.applied
    ? `<div class="news-status-tag applied">✓ Təsir tətbiq olundu</div>`
    : `<div class="news-status-tag">⏳ Sabah tətbiq olunacaq</div>`;
  const ico = newsItem.icon||"";
  switch(tNum) {
    case 1: return `<div class="news-card t1"><div class="nc-icon"><img src="${ico}" alt="" onerror="this.style.display='none'"></div><div class="nc-body"><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div>${status}</div></div>`;
    case 2: return `<div class="news-card t2 ${isPos?'positive':''}"><div class="nc-tag"><img src="${ico}" alt="" onerror="this.style.display='none'">${asset.ticker} · ${sign}${ipct}%</div><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div>${status}</div>`;
    case 3: return `<div class="news-card t3"><div class="nc-top"><img src="${ico}" alt="" onerror="this.style.display='none'"><span class="nc-impact-pill ${isPos?'up':'down'}">${sign}${ipct}%</span></div><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div>${status}</div>`;
    case 4: return `<div class="news-card t4"><div class="nc-quote-mark">"</div><div class="nc-body"><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div><div class="nc-foot"><img src="${ico}" alt="" onerror="this.style.display='none'"><span style="font-size:11px;color:var(--c-text-tertiary);">${asset.ticker}</span></div>${status}</div></div>`;
    case 5: default:
      const bw = Math.min(Math.abs(newsItem.impact)*400,100);
      return `<div class="news-card t5"><div class="nc-header-row"><span class="nc-ticker-badge">${asset.ticker}</span><img src="${ico}" alt="" onerror="this.style.display='none'"></div><div class="nc-title">${newsItem.title}</div><div class="nc-text">${newsItem.text}</div><div class="nc-impact-bar-wrap"><div class="nc-impact-bar ${isPos?'up':'down'}" style="width:${bw}%;"></div></div><div class="nc-impact-label">Gözlənilən: ${sign}${ipct}% (${newsItem.duration} gün)</div>${status}</div>`;
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
  }
  setupEventListeners();
  renderAll();
}

document.addEventListener("DOMContentLoaded", start);
