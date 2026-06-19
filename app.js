/* ============================================================
   APP.JS — Borsa Simulyasiyası v2 + Travel & RealEstate + Wallet
   ============================================================ */

const STORAGE_KEY = "borsa_sim_state_v2";
const STARTING_BALANCE = 10000;
const LEVERAGE_OPTIONS = [1, 2, 5, 10];

let state = {
  day: 1,
  cards: [],
  primaryCardId: null,
  investedBalance: 0,
  holdings: {},
  positions: [],
  priceHistory: {},
  newsFeed: [],
  transactions: [],
  engineState: null,
  unseenNewsCount: 0,
  currentCity: "baku",
  ownedProperties: []
};

// UI state
let activeFilter         = "all";
let activeInvTab         = "market";
let currentDetailAssetId = null;
let pendingTradeType     = null;
let pendingLeverage      = 1;
let pendingPositionId    = null;

// Travel/RealEstate UI state
let selectedCityId     = null;
let reActiveFilter     = "all";
let reActiveTab        = "listings";
let selectedPropertyId = null;
let reModalAction      = null;

// Wallet UI state
let walletActiveCardIndex = 0;
let vaultSelectedDays     = 7;

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
  state.cards = [{
    id: "kapitan_standard_" + Date.now(),
    bankId: "kapitan",
    tier: "standard",
    balance: STARTING_BALANCE,
    vault: null,
    weeklyTransferUsed: 0,
    lastWeekNumber: 0,
    subscriptionPaidUntilWeek: null
  }];
  state.primaryCardId    = state.cards[0].id;
  state.investedBalance  = 0;
  state.holdings         = {};
  state.positions        = [];
  state.priceHistory     = {};
  state.newsFeed         = [];
  state.transactions     = [];
  state.unseenNewsCount  = 0;
  state.currentCity      = "baku";
  state.ownedProperties  = [];
  ASSETS.forEach(a => {
    state.holdings[a.id]     = 0;
    state.priceHistory[a.id] = [a.basePrice];
  });
  Engine.init(null);
  state.engineState = Engine.getState();
  addTransaction("Hesab açıldı", STARTING_BALANCE, "in", "WALLET");
}

/* ──────────────────────────────────────────────────────────
   WALLET — KÖMƏKÇİ FUNKSIYALAR
────────────────────────────────────────────────────────── */
function getPrimaryCard() {
  return state.cards.find(c => c.id === state.primaryCardId) || state.cards[0];
}

function getPrimaryBalance() {
  return getPrimaryCard()?.balance || 0;
}

function getWeekNumber(day) {
  return Math.floor((day - 1) / 7);
}

function resetWeeklyLimitsIfNeeded() {
  const currentWeek = getWeekNumber(state.day);
  state.cards.forEach(card => {
    if (card.lastWeekNumber < currentWeek) {
      card.weeklyTransferUsed = 0;
      card.lastWeekNumber = currentWeek;
    }
  });
}

function calcTransferFee(card, amount) {
  const bank = BANKS.find(b => b.id === card.bankId);
  const cfg  = bank.cards[card.tier];
  const limit = cfg.weeklyFreeLimit;
  if (limit === null) return 0;
  if (card.balance >= (cfg.feeWaiveMinBalance || Infinity)) return 0;
  const used = card.weeklyTransferUsed || 0;
  if (used >= limit) return amount * cfg.overLimitFeeRate;
  const freeRemaining = limit - used;
  const overAmount = Math.max(amount - freeRemaining, 0);
  return overAmount * cfg.overLimitFeeRate;
}

function calcVaultInterest(card) {
  if (!card.vault) return 0;
  const bank = BANKS.find(b => b.id === card.bankId);
  const cfg  = bank.cards[card.tier];
  const ratio = card.vault.totalDays / 28;
  return card.vault.amount * cfg.vaultMonthlyRate * ratio;
}

function getAvailableBanks() {
  const currentCountry = CITY_TO_COUNTRY[state.currentCity] || "azerbaijan";
  return BANKS.filter(b => b.countryId === "azerbaijan" || b.countryId === currentCountry);
}

/* ──────────────────────────────────────────────────────────
   WALLET — HƏFTƏLIK / GÜNDƏLIK PROSESLƏR
────────────────────────────────────────────────────────── */
function processWeeklyCardEvents(weekNum) {
  state.cards.forEach(card => {
    const bank = BANKS.find(b => b.id === card.bankId);
    const cfg  = bank.cards[card.tier];

    const interest = card.balance * cfg.weeklyInterestRate;
    if (interest > 0.001) {
      card.balance += interest;
      addTransaction(`${cfg.name} — həftəlik faiz`, interest, "in", "WALLET");
    }

    if (cfg.subscriptionFee > 0) {
      if (card.balance >= cfg.subscriptionFee) {
        card.balance -= cfg.subscriptionFee;
        addTransaction(`${cfg.name} — abunəlik`, cfg.subscriptionFee, "out", "WALLET");
      } else {
        showToast(`⚠️ ${cfg.name}: abunə ödənişi alınmadı!`);
      }
    }
  });
}

function processVaultMaturity() {
  state.cards.forEach(card => {
    if (!card.vault) return;
    card.vault.lockDays--;
    if (card.vault.lockDays <= 0) {
      const bank  = BANKS.find(b => b.id === card.bankId);
      const cfg   = bank.cards[card.tier];
      const ratio = card.vault.totalDays / 28;
      const finalInterest = card.vault.amount * cfg.vaultMonthlyRate * ratio;
      card.balance += card.vault.amount + finalInterest;
      addTransaction(`${cfg.name} Xəzinə — müddət bitdi`, card.vault.amount + finalInterest, "in", "WALLET");
      showToast(`🏦 Xəzinə açıldı! +${fmtMoney(finalInterest)} faiz`);
      card.vault = null;
    }
  });
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
  if (val < 1)    return "$" + val.toFixed(4);
  return "$" + val.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
}
function getAsset(id)     { return ASSETS.find(a => a.id === id); }
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
  const priceDiff = pos.type === 'long' ? cur - pos.entryPrice : pos.entryPrice - cur;
  return priceDiff * pos.qty * pos.leverage;
}

function calcNetWorth() {
  return getPrimaryBalance() + state.investedBalance
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
  const nw  = calcNetWorth();
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
  const filtered  = activeFilter==="all" ? ASSETS : ASSETS.filter(a=>a.type===activeFilter);
  document.getElementById("inv-balance").textContent = fmtMoney(state.investedBalance);
  document.getElementById("inv-portfolio-value").textContent = fmtMoney(calcSpotPortfolioValue() + calcPositionsPnl());

  container.innerHTML = filtered.map(asset => {
    const price  = getLastPrice(asset.id);
    const change = Engine.getDailyChangePercent(state.priceHistory[asset.id]);
    const cls    = change>=0?"up":"down";
    const sign   = change>=0?"+":"";
    const color  = sectorColor(asset.sector);
    const initials = getAssetInitials(asset.name);
    const qty    = state.holdings[asset.id] || 0;
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
────────────────────────────────────────────────────────── */
function renderPortfolio() {
  const container = document.getElementById("portfolio-list");
  let html = "";

  const spotHoldings = ASSETS.filter(a => (state.holdings[a.id]||0) > 0);
  if (spotHoldings.length > 0) {
    html += `<div class="pf-section-title">📦 Spot Mövqelər</div>`;
    spotHoldings.forEach(asset => {
      const qty    = state.holdings[asset.id];
      const price  = getLastPrice(asset.id);
      const val    = qty * price;
      const color  = sectorColor(asset.sector);
      const initials = getAssetInitials(asset.name);
      const change = Engine.getDailyChangePercent(state.priceHistory[asset.id]);
      const cls    = change>=0?"up":"down";
      const sign   = change>=0?"+":"";
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

  const openPos = state.positions;
  if (openPos.length > 0) {
    html += `<div class="pf-section-title" style="margin-top:14px;">⚡ Açıq Mövqelər</div>`;
    openPos.forEach(pos => {
      const asset  = getAsset(pos.assetId);
      const pnl    = calcPosPnl(pos);
      const pnlPct = (pnl / pos.margin) * 100;
      const pnlCls = pnl>=0?"up":"down";
      const pnlSign= pnl>=0?"+":"";
      const color  = sectorColor(asset.sector);
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

  container.querySelectorAll(".pf-row[data-asset-id]").forEach(row=>{
    row.addEventListener("click", ()=>openAssetDetail(row.dataset.assetId));
  });
  container.querySelectorAll(".pf-pos-row[data-pos-id]").forEach(row=>{
    row.addEventListener("click", ()=>openClosePosModal(row.dataset.posId));
  });

  const totalPnl = calcPositionsPnl();
  const spotVal  = calcSpotPortfolioValue();
  document.getElementById("pf-total-value").textContent = fmtMoney(spotVal + totalPnl + state.investedBalance);
  const pnlEl = document.getElementById("pf-total-pnl");
  pnlEl.textContent = (totalPnl>=0?"+":"") + fmtMoney(totalPnl) + " (açıq mövqe P&L)";
  pnlEl.className = "pf-pnl " + (totalPnl>=0?"up":"down");
}

/* ──────────────────────────────────────────────────────────
   INVESTED TABS
────────────────────────────────────────────────────────── */
function switchInvTab(tab) {
  activeInvTab = tab;
  document.querySelectorAll(".inv-main-tab").forEach(t=>t.classList.remove("active"));
  document.querySelector(`.inv-main-tab[data-main-tab="${tab}"]`).classList.add("active");
  document.getElementById("inv-market-panel").style.display    = tab==="market"    ? "flex" : "none";
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

  const posContainer = document.getElementById("detail-open-positions");
  if (openPos.length > 0) {
    posContainer.style.display = "block";
    posContainer.querySelector(".detail-pos-list").innerHTML = openPos.map(pos=>{
      const pnl    = calcPosPnl(pos);
      const pnlCls = pnl>=0?"up":"down";
      const pnlSign= pnl>=0?"+":"";
      const lbl    = pos.type==="long"
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
  const history   = state.priceHistory[assetId].slice(-30);
  const container = document.getElementById("detail-chart");
  if (history.length < 2) { container.innerHTML=""; return; }
  const w=354, h=140, pad=8;
  const min=Math.min(...history), max=Math.max(...history);
  const range=(max-min)||1;
  const points = history.map((p,i)=>{
    return [ pad+(i/(history.length-1))*(w-pad*2),
             h-pad-((p-min)/range)*(h-pad*2) ];
  });
  const isUp  = history[history.length-1] >= history[0];
  const lc    = isUp ? "#1FD67A" : "#FF4C5E";
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
  c.innerHTML = relevant.map(n=>{
    const daysAgo = state.day - n.day;
    const daysAgoLabel = daysAgo === 0 ? "Bu gün" : daysAgo === 1 ? "1 gün əvvəl" : `${daysAgo} gün əvvəl`;
    const baseCard = renderNewsCard(n,(Math.abs(hashCode(n.title+n.day))%5)+1);
    // Insert days-ago badge before closing tag of first div
    return baseCard.replace(/(<div class="news-card [^"]+">)/, `$1<div class="nc-days-ago">${daysAgoLabel}</div>`);
  }).join("");
}

/* ──────────────────────────────────────────────────────────
   TRADE MODAL
────────────────────────────────────────────────────────── */
function openTradeModal(type) {
  pendingTradeType = type;
  pendingLeverage  = 1;
  const asset = getAsset(currentDetailAssetId);
  const modal = document.getElementById("trade-modal-overlay");

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
    : type==="open_short"    ? "Short Aç"
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
  document.getElementById("tm-total-label").textContent = isLev ? "Margin tələbi" : "Cəmi məbləğ";
  document.getElementById("tm-total").textContent = fmtMoney(cost);
}

function confirmTrade() {
  const asset   = getAsset(currentDetailAssetId);
  const qty     = parseFloat(document.getElementById("tm-quantity-input").value) || 0;
  const price   = getLastPrice(asset.id);
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
    state.positions.push({
      id: Date.now() + "_" + Math.random(),
      assetId: asset.id,
      type: posType,
      leverage: pendingLeverage,
      qty, entryPrice: price, margin,
      openDay: state.day,
      ticker: asset.ticker,
      name: asset.name
    });
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
  const pos = state.positions.find(p=>p.id===posId);
  if (!pos) return;
  const pnl    = calcPosPnl(pos);
  const pnlCls = pnl>=0?"up":"down";
  const pnlSign= pnl>=0?"+":"";

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
  const pnl      = calcPosPnl(pos);
  const returned = pos.margin + pnl;
  state.investedBalance += Math.max(returned, 0);
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
   RENDER: WALLET
────────────────────────────────────────────────────────── */
function renderWallet() {
  document.getElementById("wallet-inv-balance").textContent = fmtMoney(state.investedBalance);
  document.getElementById("wallet-inv-portfolio").textContent =
    "Portfel: " + fmtMoney(calcSpotPortfolioValue() + calcPositionsPnl());
  renderWalletCarousel();
  renderWalletCardDetail();
  renderTxList();
}

function renderWalletCarousel() {
  const carousel = document.getElementById("wallet-cards-carousel");
  const dotsEl   = document.getElementById("wallet-dots");

  carousel.innerHTML = state.cards.map((card, i) => {
    const bank      = BANKS.find(b => b.id === card.bankId);
    const cfg       = bank.cards[card.tier];
    const isPrimary = card.id === state.primaryCardId;
    const tierLabel = card.tier === "standard" ? "Standart" : card.tier === "gold" ? "Gold ✦" : "Lux ◆";
    const vaultInfo = card.vault
      ? `🔒 ${fmtMoney(card.vault.amount)} — ${card.vault.lockDays} gün qalıb`
      : "";
    return `
      <div class="wallet-card ${card.tier} ${i === walletActiveCardIndex ? "active" : ""}"
           data-idx="${i}"
           style="background:linear-gradient(135deg,${bank.color}22,${bank.color}44);border-color:${bank.color}66;">
        <div class="wc-top">
          <div class="wc-bank-name" style="color:${bank.color}">${bank.name}</div>
          <div class="wc-tier">${tierLabel}</div>
        </div>
        ${isPrimary ? '<div class="wc-primary-badge">⭐ Əsas</div>' : ""}
        <div class="wc-balance">${fmtMoney(card.balance)}</div>
        ${vaultInfo ? `<div class="wc-vault-info">${vaultInfo}</div>` : ""}
        <div class="wc-card-number">•••• ${card.id.slice(-4).toUpperCase()}</div>
      </div>`;
  }).join("");

  dotsEl.innerHTML = state.cards.map((_, i) =>
    `<div class="wallet-dot ${i === walletActiveCardIndex ? "active" : ""}"></div>`
  ).join("");

  carousel.querySelectorAll(".wallet-card").forEach(el => {
    el.addEventListener("click", () => {
      walletActiveCardIndex = parseInt(el.dataset.idx);
      renderWalletCarousel();
      renderWalletCardDetail();
    });
  });
}

function renderWalletCardDetail() {
  if (!state.cards.length) return;
  const card = state.cards[walletActiveCardIndex];
  const bank = BANKS.find(b => b.id === card.bankId);
  const cfg  = bank.cards[card.tier];

  document.getElementById("wcd-limit").textContent =
    cfg.weeklyFreeLimit === null ? "Limitsiz" : fmtMoney(cfg.weeklyFreeLimit);
  document.getElementById("wcd-used").textContent = fmtMoney(card.weeklyTransferUsed || 0);
  document.getElementById("wcd-fee").textContent =
    cfg.weeklyFreeLimit === null ? "0%" :
    (card.balance >= (cfg.feeWaiveMinBalance || Infinity)
      ? "Silinib (min. balans)"
      : (cfg.overLimitFeeRate * 100).toFixed(1) + "%");
  document.getElementById("wcd-interest").textContent =
    (cfg.weeklyInterestRate * 100).toFixed(2) + "% / həftə";

  const vaultRow = document.getElementById("wcd-vault-row");
  if (card.vault) {
    vaultRow.style.display = "flex";
    document.getElementById("wcd-vault").textContent =
      `${fmtMoney(card.vault.amount)} — ${card.vault.lockDays}/${card.vault.totalDays} gün`;
  } else {
    vaultRow.style.display = "none";
  }
}

function renderTxList() {
  const c = document.getElementById("tx-list");
  if (!state.transactions.length) {
    c.innerHTML = '<div class="empty-state">Tranzaksiya tarixçəsi boşdur</div>';
    return;
  }
  c.innerHTML = state.transactions.slice(0, 30).map(tx => {
    const icon = tx.direction === "in" ? "↓" : "↑";
    const sign = tx.direction === "in" ? "+" : "−";
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
   WALLET — TRANSFER MODAL
────────────────────────────────────────────────────────── */
function openWalletTransferModal() {
  const fromSelect = document.getElementById("wt-from-select");
  const toSelect   = document.getElementById("wt-to-select");

  const cardOptions = state.cards.map(c => {
    const bank = BANKS.find(b => b.id === c.bankId);
    return `<option value="card_${c.id}">${bank.cards[c.tier].name} — ${fmtMoney(c.balance)}</option>`;
  }).join("");
  const investedOption = `<option value="invested">INVESTED — ${fmtMoney(state.investedBalance)}</option>`;

  fromSelect.innerHTML = cardOptions + investedOption;
  toSelect.innerHTML   = cardOptions + investedOption;

  const activeCard = state.cards[walletActiveCardIndex];
  if (activeCard) fromSelect.value = "card_" + activeCard.id;

  document.getElementById("wt-amount-input").value = "";
  document.getElementById("wt-fee-preview").textContent = "Komisya: $0.00";
  document.getElementById("wt-error").style.display = "none";
  document.getElementById("wallet-transfer-overlay").classList.add("active");
}

function updateTransferFeePreview() {
  const fromVal = document.getElementById("wt-from-select").value;
  const amount  = parseFloat(document.getElementById("wt-amount-input").value) || 0;
  let fee = 0;
  if (fromVal.startsWith("card_")) {
    const cardId = fromVal.replace("card_", "");
    const card   = state.cards.find(c => c.id === cardId);
    if (card) fee = calcTransferFee(card, amount);
  }
  document.getElementById("wt-fee-preview").textContent = `Komisya: ${fmtMoney(fee)}`;
}

function confirmWalletTransfer() {
  const fromVal  = document.getElementById("wt-from-select").value;
  const toVal    = document.getElementById("wt-to-select").value;
  const amount   = parseFloat(document.getElementById("wt-amount-input").value) || 0;
  const errorEl  = document.getElementById("wt-error");

  errorEl.style.display = "none";
  if (fromVal === toVal) { errorEl.textContent="Eyni hesab seçildi"; errorEl.style.display="block"; return; }
  if (amount <= 0) { errorEl.textContent="Düzgün məbləğ daxil et"; errorEl.style.display="block"; return; }

  let sourceBalance = 0;
  let fee = 0;
  if (fromVal === "invested") {
    sourceBalance = state.investedBalance;
  } else {
    const card = state.cards.find(c => c.id === fromVal.replace("card_", ""));
    sourceBalance = card ? card.balance : 0;
    fee = card ? calcTransferFee(card, amount) : 0;
  }

  if (amount + fee > sourceBalance) {
    errorEl.textContent = "Balans + komisya kifayət etmir";
    errorEl.style.display = "block";
    return;
  }

  if (fromVal === "invested") {
    state.investedBalance -= amount;
  } else {
    const card = state.cards.find(c => c.id === fromVal.replace("card_", ""));
    card.balance -= (amount + fee);
    card.weeklyTransferUsed = (card.weeklyTransferUsed || 0) + amount;
    if (fee > 0) addTransaction("Köçürmə komisyası", fee, "out", "WALLET");
  }

  if (toVal === "invested") {
    state.investedBalance += amount;
  } else {
    const card = state.cards.find(c => c.id === toVal.replace("card_", ""));
    card.balance += amount;
  }

  addTransaction("Transfer", amount, "out", fromVal === "invested" ? "INVESTED" : "WALLET");
  saveState();
  document.getElementById("wallet-transfer-overlay").classList.remove("active");
  renderWallet();
  renderAssetList();
  showToast(`Transfer tamamlandı — ${fmtMoney(amount)}`);
}

/* ──────────────────────────────────────────────────────────
   WALLET — VAULT MODAL
────────────────────────────────────────────────────────── */
function openVaultModal() {
  const card = state.cards[walletActiveCardIndex];
  if (!card) return;
  if (card.vault) { showToast("Bu kartda artıq aktiv Xəzinə var"); return; }
  const bank = BANKS.find(b => b.id === card.bankId);
  const cfg  = bank.cards[card.tier];

  document.getElementById("vault-modal-sub").textContent =
    `${cfg.name} — Xəzinə (maks. faiz: ${(cfg.vaultMonthlyRate*100).toFixed(1)}%)`;
  document.getElementById("vault-amount-input").value = "";
  vaultSelectedDays = 7;
  document.querySelectorAll(".vault-dur-btn").forEach(b =>
    b.classList.toggle("active", parseInt(b.dataset.days) === 7));
  updateVaultPreview();
  document.getElementById("vault-error").style.display = "none";
  document.getElementById("wallet-vault-overlay").classList.add("active");
}

function updateVaultPreview() {
  const card   = state.cards[walletActiveCardIndex];
  if (!card) return;
  const bank   = BANKS.find(b => b.id === card.bankId);
  const cfg    = bank.cards[card.tier];
  const amount = parseFloat(document.getElementById("vault-amount-input").value) || 0;
  const ratio  = vaultSelectedDays / 28;
  const interest = amount * cfg.vaultMonthlyRate * ratio;
  document.getElementById("vault-preview").innerHTML =
    amount > 0
      ? `<div style="font-size:12px;color:var(--c-up);padding:6px 0;">
           +${fmtMoney(interest)} faiz · ${vaultSelectedDays} gün sonra ${fmtMoney(amount + interest)} alacaqsan
         </div>`
      : "";
}

function confirmVault() {
  const card    = state.cards[walletActiveCardIndex];
  const amount  = parseFloat(document.getElementById("vault-amount-input").value) || 0;
  const errorEl = document.getElementById("vault-error");

  if (amount <= 0 || amount > card.balance) { errorEl.style.display="block"; return; }

  card.balance -= amount;
  card.vault = { amount, lockDays: vaultSelectedDays, totalDays: vaultSelectedDays, startDay: state.day };

  const bank = BANKS.find(b => b.id === card.bankId);
  addTransaction(`${bank.cards[card.tier].name} — Xəzinəyə qoyuldu`, amount, "out", "WALLET");
  saveState();
  document.getElementById("wallet-vault-overlay").classList.remove("active");
  renderWallet();
  showToast(`🔒 ${fmtMoney(amount)} Xəzinəyə qoyuldu — ${vaultSelectedDays} gün`);
}

/* ──────────────────────────────────────────────────────────
   WALLET — KART ƏLAVƏ ET MODAL
────────────────────────────────────────────────────────── */
let selectedNewCardKey = null;

function openAddCardModal() {
  const nw        = calcNetWorth();
  const availBanks = getAvailableBanks();
  const ownedKeys  = state.cards.map(c => c.bankId + "_" + c.tier);

  const list = document.getElementById("addcard-list");
  list.innerHTML = availBanks.flatMap(bank =>
    Object.entries(bank.cards).map(([tier, cfg]) => {
      const key    = bank.id + "_" + tier;
      const owned  = ownedKeys.includes(key);
      const locked = cfg.requiredNetWorth && nw < cfg.requiredNetWorth;
      const tierLabel = tier === "standard" ? "Standart" : tier === "gold" ? "Gold ✦" : "Lux ◆";
      const subText = locked
        ? `🔒 Lazım: ${fmtMoney(cfg.requiredNetWorth)} var-dövlət`
        : owned  ? "✓ Artıq var"
        : cfg.subscriptionFee > 0 ? `${fmtMoney(cfg.subscriptionFee)}/həftə abunə`
        : "Pulsuz";
      return `
        <div class="addcard-option ${owned || locked ? "disabled" : ""} ${selectedNewCardKey === key ? "selected" : ""}"
             data-key="${key}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-weight:700;font-size:13px;color:${bank.color}">${bank.name} ${tierLabel}</div>
              <div style="font-size:11px;color:var(--c-text-secondary);margin-top:2px;">${subText}</div>
            </div>
            <div style="text-align:right;font-size:11px;color:var(--c-text-tertiary);">
              ${cfg.weeklyInterestRate ? (cfg.weeklyInterestRate*100).toFixed(2)+"% həftəlik" : ""}
            </div>
          </div>
        </div>`;
    })
  ).join("");

  list.querySelectorAll(".addcard-option:not(.disabled)").forEach(el => {
    el.addEventListener("click", () => {
      list.querySelectorAll(".addcard-option").forEach(x => x.classList.remove("selected"));
      el.classList.add("selected");
      selectedNewCardKey = el.dataset.key;
    });
  });

  selectedNewCardKey = null;
  document.getElementById("wallet-addcard-overlay").classList.add("active");
}

function confirmAddCard() {
  if (!selectedNewCardKey) { showToast("Kart seç"); return; }
  const [bankId, tier] = selectedNewCardKey.split("_");
  if (state.cards.some(c => c.bankId === bankId && c.tier === tier)) {
    showToast("Bu kart artıq var"); return;
  }
  state.cards.push({
    id: bankId + "_" + tier + "_" + Date.now(),
    bankId, tier,
    balance: 0,
    vault: null,
    weeklyTransferUsed: 0,
    lastWeekNumber: getWeekNumber(state.day),
    subscriptionPaidUntilWeek: null
  });
  saveState();
  document.getElementById("wallet-addcard-overlay").classList.remove("active");
  walletActiveCardIndex = state.cards.length - 1;
  renderWallet();
  showToast("Kart əlavə edildi!");
}

/* ──────────────────────────────────────────────────────────
   NEWS KARTLARI
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

  // Yalnız son 5 günün xəbərləri
  const cutoffDay = state.day - 5;
  const recentNews = state.newsFeed.filter(n => n.day > cutoffDay);

  if (recentNews.length === 0) {
    c.innerHTML = '<div class="empty-state">Son 5 gündə xəbər yoxdur.</div>';
    return;
  }

  const byDay={};
  recentNews.forEach(n=>{ if(!byDay[n.day]) byDay[n.day]=[]; byDay[n.day].push(n); });
  const days=Object.keys(byDay).map(Number).sort((a,b)=>b-a);
  let html="";
  days.forEach(day=>{
    const daysAgo = state.day - day;
    const daysAgoLabel = daysAgo === 0 ? "Bu gün" : daysAgo === 1 ? "1 gün əvvəl" : `${daysAgo} gün əvvəl`;
    html+=`<div class="day-divider">Gün ${day} <span class="day-ago-badge">${daysAgoLabel}</span></div>`;
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
  document.querySelectorAll(".map-city-dot").forEach(dot => {
    dot.setAttribute("r", "6");
    dot.setAttribute("stroke-width", "1.5");
  });
  const activeDot = document.getElementById("map-dot-" + state.currentCity);
  if (activeDot) {
    activeDot.setAttribute("r", "9");
    activeDot.setAttribute("stroke-width", "2.5");
  }
  document.querySelectorAll(".map-city-dot").forEach(dot => {
    dot.style.cursor = "pointer";
    dot.onclick = () => openCityDetail(dot.dataset.city);
  });
}

function renderCityList() {
  const container = document.getElementById("travel-city-list");
  container.innerHTML = CITIES.map(city => {
    const isActive  = city.id === state.currentCity;
    const canAfford = getPrimaryBalance() >= (city.minBalance + city.moveCost);
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
  document.getElementById("tdh-flag").textContent  = city.flag;
  document.getElementById("tdh-name").textContent  = `${city.name}, ${city.country}`;
  document.getElementById("tdh-tag").textContent   = city.tag;

  const totalCost = city.visaCost + city.moveCost;
  document.getElementById("trc-min-balance").textContent = fmtMoney(city.minBalance);
  document.getElementById("trc-visa-cost").textContent   = fmtMoney(city.visaCost);
  document.getElementById("trc-total-cost").textContent  = fmtMoney(totalCost);
  document.getElementById("trc-your-balance").textContent = fmtMoney(getPrimaryBalance());

  document.getElementById("travel-perks").innerHTML = `
    <div class="travel-perks-wrap">
      ${city.perks.map(p => `<div class="travel-perk-item">✓ ${p}</div>`).join("")}
    </div>`;

  const statusEl = document.getElementById("travel-move-status");
  const btn      = document.getElementById("btn-travel-move");
  const bal      = getPrimaryBalance();

  if (city.id === state.currentCity) {
    statusEl.style.display = "block"; statusEl.style.color = "#1FD67A";
    statusEl.textContent = "✓ Artıq bu şəhərdə yaşayırsan.";
    btn.disabled = true; btn.textContent = "Hazırda buradasın";
  } else if (bal < city.minBalance) {
    statusEl.style.display = "block"; statusEl.style.color = "var(--c-down)";
    statusEl.textContent = `✗ Bank balansın kifayət etmir. Minimum: ${fmtMoney(city.minBalance)}`;
    btn.disabled = true; btn.textContent = "Balans kifayət etmir";
  } else if (bal < city.minBalance + totalCost) {
    statusEl.style.display = "block"; statusEl.style.color = "var(--c-down)";
    statusEl.textContent = `✗ Köçmə xərci üçün balansın çatmır. Lazım: ${fmtMoney(totalCost)}`;
    btn.disabled = true; btn.textContent = "Balans kifayət etmir";
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
    const income   = p.type === "residential"
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
    container.innerHTML = `<div class="re-empty">Hələ əmlak almamısan.</div>`;
    return;
  }
  const allProps = Object.values(ALL_PROPERTIES).flat();
  container.innerHTML = state.ownedProperties.map((owned, idx) => {
    const p = allProps.find(x => x.id === owned.propertyId);
    if (!p) return "";
    const biz = BUSINESS_TYPES.find(b => b.id === owned.businessTypeId);
    const typeLabel = owned.ownershipType === "rent_out"
      ? "Kirayəyə verilir"
      : owned.ownershipType === "business" ? (biz?.name || "Biznes")
      : "Kirayədə yaşayır";
    let incomeStr = "—";
    if (owned.monthlyIncome) {
      if (typeof owned.monthlyIncome === "object") {
        incomeStr = `${fmtMoney(owned.monthlyIncome.min)}–${fmtMoney(owned.monthlyIncome.max)}/həftə`;
      } else {
        incomeStr = `${fmtMoney(owned.monthlyIncome)}/həftə`;
      }
    }
    const salePrice = Math.round(p.buyPrice * 0.85);
    let expenseHtml = "";
    if (owned.ownershipType === "business" || owned.ownershipType === "rent_out") {
      const exp      = calcWeeklyExpense(owned, p);
      const daysSince = state.day - (owned.lastPaymentDay || state.day);
      const daysLeft  = RE_EXPENSE_CONFIG.paymentCycleDays - daysSince;
      const hasDebt   = (owned.debt || 0) > 0.01;
      expenseHtml = hasDebt
        ? `<div class="re-oc-debt">⚠️ Borc: ${fmtMoney(owned.debt)} · ${owned.unpaidCycles}/3 gecikmə</div>`
        : `<div class="re-oc-expense">Həftəlik xərc: ${fmtMoney(exp.total)} · ${Math.max(daysLeft,0)} gün sonra</div>`;
    }
    const toggleHtml = (owned.ownershipType === "business" || owned.ownershipType === "rent_out")
      ? `<button class="re-oc-toggle ${owned.active ? "on" : "off"}" data-idx="${idx}">${owned.active ? "Aktivdir" : "Bağlıdır"}</button>`
      : "";
    const changeBizHtml = (owned.ownershipType === "business" && p.type === "commercial")
      ? `<button class="re-oc-change-biz" data-idx="${idx}">Biznesi dəyiş</button>` : "";

    return `
      <div class="re-owned-card ${(owned.debt||0) > 0.01 ? "has-debt" : ""}">
        <div class="re-oc-top">
          <div class="re-oc-icon-name">
            <span class="re-oc-icon">${p.icon}</span>
            <div>
              <div class="re-oc-name">${p.name}</div>
              <div class="re-oc-type">${typeLabel}</div>
            </div>
          </div>
          <div class="re-oc-income-badge">↑ ${incomeStr}</div>
        </div>
        ${expenseHtml}
        <div class="re-oc-footer">
          <div class="re-oc-btns">${toggleHtml}${changeBizHtml}</div>
          <button class="re-oc-sell" data-idx="${idx}">Sat · ${fmtMoney(salePrice)}</button>
        </div>
      </div>`;
  }).join("");

  container.querySelectorAll(".re-oc-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      state.ownedProperties[idx].active = !state.ownedProperties[idx].active;
      saveState(); renderREOwned();
    });
  });
  container.querySelectorAll(".re-oc-change-biz").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      openChangeBusinessModal(parseInt(btn.dataset.idx));
    });
  });
  container.querySelectorAll(".re-oc-sell").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const idx    = parseInt(btn.dataset.idx);
      const owned  = state.ownedProperties[idx];
      const allProps2 = Object.values(ALL_PROPERTIES).flat();
      const pp     = allProps2.find(x => x.id === owned.propertyId);
      const salePrice = pp ? Math.round(pp.buyPrice * 0.85) : 0;
      if (confirm(`${pp?.name || "Əmlak"} satmaq istəyirsən?\nAlacağın məbləğ: ${fmtMoney(salePrice)}`)) {
        sellProperty(idx);
      }
    });
  });
}

let changeBizPropertyIdx = null;

function openChangeBusinessModal(idx) {
  changeBizPropertyIdx = idx;
  const owned    = state.ownedProperties[idx];
  const allProps = Object.values(ALL_PROPERTIES).flat();
  const p        = allProps.find(x => x.id === owned.propertyId);
  if (!p || p.type !== "commercial") { showToast("Bu əmlak üçün biznes dəyişdirilə bilməz"); return; }
  selectedPropertyId = p.id;

  const overlay = document.getElementById("re-modal-overlay");
  document.getElementById("re-modal-title").textContent = "Biznesi dəyiş";
  document.getElementById("re-modal-sub").textContent   = p.name;
  document.getElementById("re-modal-cost-label").textContent = "Yeni biznes seç";
  document.getElementById("re-modal-cost").textContent   = "—";
  document.getElementById("re-modal-income").textContent = "—";
  document.getElementById("re-modal-error").style.display = "none";

  let gridWrap = document.getElementById("re-modal-biz-grid-wrap");
  if (!gridWrap) {
    gridWrap = document.createElement("div");
    gridWrap.id = "re-modal-biz-grid-wrap";
    gridWrap.className = "re-business-grid";
    gridWrap.style.padding = "10px 0 0";
    document.querySelector("#re-modal-overlay .trade-modal").insertBefore(
      gridWrap, document.getElementById("re-modal-error")
    );
  }
  gridWrap.style.display = "grid";
  gridWrap.innerHTML = BUSINESS_TYPES.map(biz => {
    const incomeData = calcPropertyIncome(p, "business", biz.id);
    const isCurrent  = biz.id === owned.businessTypeId;
    return `
      <div class="re-biz-card ${isCurrent ? "selected" : ""}" data-biz="${biz.id}">
        <div class="re-biz-icon">${biz.icon}</div>
        <div class="re-biz-name">${biz.name}</div>
        <div class="re-biz-income">${fmtMoney(incomeData.min)}–${fmtMoney(incomeData.max)}/həftə</div>
        <div class="re-biz-setup" style="color:#E8A33D;font-size:10px;">Quraşdırma: ${fmtMoney(biz.setupCost)}</div>
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

  const areaMult  = AREA_MULTIPLIERS[p.area];
  const rentIncome = Math.round(p.rentPrice * areaMult.revenueMult);
  const deposit   = p.rentPrice * p.depositMonths;
  const bal       = getPrimaryBalance();

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

  const canBuy  = bal >= p.buyPrice;
  const canRent = bal >= deposit;

  document.getElementById("re-detail-actions").innerHTML = `
    <button class="btn-re-action${canBuy ? "" : " disabled"}" id="btn-re-buy" ${canBuy ? "" : "disabled"}>
      Al — ${fmtMoney(p.buyPrice)}
    </button>
    <button class="btn-re-action secondary${canRent ? "" : " disabled"}" id="btn-re-rent" ${canRent ? "" : "disabled"}>
      Kirayə götür — ${fmtMoney(p.rentPrice)}/ay (dep: ${fmtMoney(deposit)})
    </button>`;

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

  document.getElementById("btn-re-buy").onclick  = () => openREModal("buy",  p);
  document.getElementById("btn-re-rent").onclick = () => openREModal("rent", p);
}

function openREModal(action, property) {
  reModalAction = action;
  const overlay = document.getElementById("re-modal-overlay");
  const bal     = getPrimaryBalance();

  if (action === "buy") {
    document.getElementById("re-modal-title").textContent = "Əmlak al";
    document.getElementById("re-modal-sub").textContent   = property.name;
    document.getElementById("re-modal-cost-label").textContent = "Satış qiyməti";
    document.getElementById("re-modal-cost").textContent  = fmtMoney(property.buyPrice);
    const rentIncome = calcPropertyIncome(property, "rent_out");
    document.getElementById("re-modal-income").textContent = `${fmtMoney(rentIncome)}/həftə (kirayəyə versən)`;
    const canAfford = bal >= property.buyPrice;
    document.getElementById("re-modal-error").style.display = canAfford ? "none" : "block";
    document.getElementById("btn-re-modal-confirm").disabled = !canAfford;
  } else {
    const deposit = property.rentPrice * property.depositMonths;
    document.getElementById("re-modal-title").textContent = "Kirayə götür";
    document.getElementById("re-modal-sub").textContent   = property.name;
    document.getElementById("re-modal-cost-label").textContent = `Depozit (${property.depositMonths} ay)`;
    document.getElementById("re-modal-cost").textContent  = fmtMoney(deposit);
    document.getElementById("re-modal-income").textContent = `${fmtMoney(property.rentPrice)}/ay kirayə`;
    const canAfford = bal >= deposit;
    document.getElementById("re-modal-error").style.display = canAfford ? "none" : "block";
    document.getElementById("btn-re-modal-confirm").disabled = !canAfford;
  }
  overlay.classList.add("active");
}

function closeREModal() {
  document.getElementById("re-modal-overlay").classList.remove("active");
}

function sellProperty(ownedIdx) {
  const owned = state.ownedProperties[ownedIdx];
  if (!owned) return;
  const allProps = Object.values(ALL_PROPERTIES).flat();
  const p = allProps.find(x => x.id === owned.propertyId);
  if (!p) return;
  const salePrice    = Math.round(p.buyPrice * 0.85);
  const debtDeduction = owned.debt || 0;
  const netReturn    = Math.max(salePrice - debtDeduction, 0);
  const card         = getPrimaryCard();
  if (card) card.balance += netReturn;
  state.ownedProperties.splice(ownedIdx, 1);
  addTransaction(`${p.name} satıldı`, netReturn, "in", "REALESTATE");
  showToast(`🏷️ ${p.name} satıldı — ${fmtMoney(netReturn)}`);
  saveState();
  renderHome();
  renderREOwned();
  renderREListings();
}

function confirmREModal() {
  const allProps = Object.values(ALL_PROPERTIES).flat();
  const p = allProps.find(x => x.id === selectedPropertyId);
  if (!p) return;
  const card = getPrimaryCard();
  const bal  = getPrimaryBalance();

  if (reModalAction === "buy") {
    if (bal < p.buyPrice) return;
    card.balance -= p.buyPrice;

    const selectedBiz = document.querySelector("#re-business-grid .re-biz-card.selected");
    let ownershipType = "rent_out";
    let businessTypeId = null;
    let monthlyIncome;

    if (selectedBiz && p.type === "commercial") {
      ownershipType  = "business";
      businessTypeId = selectedBiz.dataset.biz;
      monthlyIncome  = calcPropertyIncome(p, "business", businessTypeId);
    } else {
      monthlyIncome = calcPropertyIncome(p, "rent_out");
    }

    state.ownedProperties.push({
      propertyId: p.id, ownershipType, businessTypeId, monthlyIncome,
      active: true, lastPaymentDay: state.day, unpaidCycles: 0, debt: 0
    });
    addTransaction(`${p.name} alındı`, p.buyPrice, "out", "REALESTATE");
    showToast(`🏠 ${p.name} alındı!`);

  } else if (reModalAction === "change_business") {
    const selectedBiz = document.querySelector("#re-modal-biz-grid-wrap .re-biz-card.selected");
    if (!selectedBiz) { showToast("Biznes seç"); return; }
    const newBizId  = selectedBiz.dataset.biz;
    const biz       = BUSINESS_TYPES.find(b => b.id === newBizId);
    const setupCost = biz.setupCost || 0;
    if (bal < setupCost) { showToast(`Kifayət qədər balans yoxdur — lazım: ${fmtMoney(setupCost)}`); return; }
    const owned = state.ownedProperties[changeBizPropertyIdx];
    card.balance -= setupCost;
    owned.businessTypeId = newBizId;
    owned.ownershipType  = "business";
    owned.monthlyIncome  = calcPropertyIncome(p, "business", newBizId);
    owned.lastPaymentDay = state.day;
    owned.unpaidCycles   = 0;
    owned.debt           = 0;
    addTransaction(`${biz.name} quruluşu: ${p.name}`, setupCost, "out", "REALESTATE");
    showToast(`${biz.name} quruldu — xərc: ${fmtMoney(setupCost)}`);
    saveState(); closeREModal(); renderHome(); renderREOwned();
    return;

  } else {
    const deposit = p.rentPrice * p.depositMonths;
    if (bal < deposit) return;
    card.balance -= deposit;
    state.ownedProperties.push({
      propertyId: p.id, ownershipType: "rented", businessTypeId: null,
      monthlyIncome: 0, rentMonthly: p.rentPrice, depositPaid: deposit
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
   REALESTATE — XƏRC HESABLAMALARI
────────────────────────────────────────────────────────── */
function calcWeeklyUtility(property, businessTypeId) {
  const areaMult  = AREA_MULTIPLIERS[property.area];
  const biz       = BUSINESS_TYPES.find(b => b.id === businessTypeId);
  const utilFactor = biz ? biz.utilityFactor : 1.2;
  return property.m2 * RE_EXPENSE_CONFIG.baseUtilityPerM2Weekly * utilFactor * areaMult.revenueMult;
}

function calcWeeklyNetIncomeEstimate(owned, property) {
  let weeklyAvg;
  if (typeof owned.monthlyIncome === "object" && owned.monthlyIncome !== null) {
    weeklyAvg = owned.monthlyIncome.avg ?? ((owned.monthlyIncome.min + owned.monthlyIncome.max) / 2);
  } else {
    weeklyAvg = owned.monthlyIncome || 0;
  }
  return weeklyAvg;
}

function calcWeeklyExpense(owned, property) {
  const utility    = calcWeeklyUtility(property, owned.businessTypeId);
  const grossWeekly = calcWeeklyNetIncomeEstimate(owned, property);
  const taxable    = Math.max(grossWeekly - utility, 0);
  const tax        = taxable * RE_EXPENSE_CONFIG.taxRate;
  return { utility, tax, total: utility + tax, grossWeekly };
}

function processPropertyExpenses() {
  if (!state.ownedProperties || state.ownedProperties.length === 0) return;
  const allProps = Object.values(ALL_PROPERTIES).flat();
  const toRemove = [];
  const card     = getPrimaryCard();

  state.ownedProperties.forEach(owned => {
    if (owned.ownershipType !== "business" && owned.ownershipType !== "rent_out") return;
    if (!owned.active) return;
    const property = allProps.find(x => x.id === owned.propertyId);
    if (!property) return;
    const daysSincePayment = state.day - owned.lastPaymentDay;
    if (daysSincePayment < RE_EXPENSE_CONFIG.paymentCycleDays) return;
    const expense = calcWeeklyExpense(owned, property);
    if (card && card.balance >= expense.total + owned.debt) {
      card.balance -= (expense.total + owned.debt);
      addTransaction(`${property.name} — həftəlik xərc`, expense.total + owned.debt, "out", "REALESTATE");
      owned.debt = 0; owned.unpaidCycles = 0; owned.lastPaymentDay = state.day;
    } else {
      owned.debt += expense.total;
      owned.unpaidCycles += 1;
      owned.lastPaymentDay = state.day;
      if (owned.unpaidCycles === 1) showToast(`⚠️ ${property.name}: ödəniş gecikdi, cərimə başladı`);
      else if (owned.unpaidCycles === 2) showToast(`⚠️ ${property.name}: 2-ci gecikmə! Son xəbərdarlıq`);
      else if (owned.unpaidCycles >= 3) toRemove.push({ owned, property });
    }
    if (owned.debt > 0 && owned.unpaidCycles > 0) {
      owned.debt += owned.debt * RE_EXPENSE_CONFIG.lateFeeDailyRate;
    }
  });

  toRemove.forEach(({ owned, property }) => {
    const saleValue = Math.round(property.buyPrice * 0.7);
    const netReturn = Math.max(saleValue - owned.debt, 0);
    if (card) card.balance += netReturn;
    state.ownedProperties = state.ownedProperties.filter(o => o !== owned);
    addTransaction(`${property.name} borc üzündən satıldı`, netReturn, "in", "REALESTATE");
    showToast(`🚨 ${property.name} borc üzündən əldən getdi! Qalan: ${fmtMoney(netReturn)}`);
  });
}

function processPropertyIncome() {
  if (!state.ownedProperties || state.ownedProperties.length === 0) return;
  const card = getPrimaryCard();
  let totalIncome = 0;
  state.ownedProperties.forEach(owned => {
    if (!owned.monthlyIncome) return;
    if (owned.ownershipType === "rented") return;
    let weeklyIncome = 0;
    if (typeof owned.monthlyIncome === "object") {
      const avg = owned.monthlyIncome.avg ?? ((owned.monthlyIncome.min + owned.monthlyIncome.max) / 2);
      weeklyIncome = avg;
    } else {
      weeklyIncome = owned.monthlyIncome;
    }
    totalIncome += weeklyIncome / 7;
  });
  if (totalIncome > 0.01 && card) {
    card.balance += totalIncome;
    addTransaction("Əmlak gəliri", totalIncome, "in", "REALESTATE");
  }
}

/* ──────────────────────────────────────────────────────────
   GÜN İRƏLİLƏTMƏ
────────────────────────────────────────────────────────── */
function advanceDay() {
  Engine.init(state.engineState);

  // 1. Əvvəlcə mövcud effektləri tətbiq edib qiyməti irəlilət (köhnə xəbərlərin növbəti gün təsiri)
  const result = Engine.advanceDay(ASSETS, state.priceHistory, state.day);
  result.activatedNews.forEach(a=>{
    const m = state.newsFeed.find(n=>n.title===a.title && !n.applied && n.assetId===a.assetId);
    if(m) m.applied=true;
  });
  state.day = result.day;

  // 2. Sonra YENİ günün xəbərlərini yayımla (növbəti günə qədər pending qalacaq)
  const todaysNews = Engine.publishDailyNews(ASSETS, NEWS);
  todaysNews.forEach(n=>{ state.newsFeed.unshift({...n, day:state.day, applied:false}); });
  state.unseenNewsCount += todaysNews.length;
  state.engineState = Engine.getState();

  // Margin call
  const toClose = [];
  state.positions.forEach(pos=>{
    const pnl = calcPosPnl(pos);
    if (pnl <= -pos.margin * 0.9) toClose.push(pos);
  });
  toClose.forEach(pos=>{
    state.positions = state.positions.filter(p=>p.id!==pos.id);
    addTransaction(`Likvidasiya: ${pos.ticker}`, pos.margin, "out", "INVESTED");
    showToast(`⚠️ ${pos.ticker} mövqəsi likvidə edildi!`);
  });

  // Wallet: həftəlik limit sıfırla
  resetWeeklyLimitsIfNeeded();

  // Wallet: həftə başladı mı?
  const currentWeek = getWeekNumber(state.day);
  const prevWeek    = getWeekNumber(state.day - 1);
  if (currentWeek > prevWeek) {
    processWeeklyCardEvents(currentWeek);
  }

  // Wallet: vault yoxlama
  processVaultMaturity();

  // Əmlak xərcləri və gəlir
  processPropertyExpenses();
  processPropertyIncome();

  saveState();
  renderAll();
  showToast("Gün " + state.day + " başladı");
}

function renderAll() {
  renderHome();
  renderAssetList();
  renderWallet();
  renderNewsFeed();
  if (currentDetailAssetId) renderAssetDetail();
  if (activeInvTab==="portfolio") renderPortfolio();
}

/* ──────────────────────────────────────────────────────────
   HADİSƏ DİNLƏYİCİLƏRİ
────────────────────────────────────────────────────────── */
function setupEventListeners() {
  // App ikonları
  document.querySelectorAll(".app-icon-wrap").forEach(el=>{
    el.addEventListener("click", ()=>{
      const app = el.dataset.app;
      if (app === "travel")     { openTravel();     return; }
      if (app === "realestate") { openRealEstate(); return; }
      navigateTo(app==="invested"?"invested":app);
      if (app==="invested") renderAssetList();
      if (app==="bmb")      renderWallet();
      if (app==="news")     renderNewsFeed();
    });
  });

  // Geri düymələri
  document.querySelectorAll(".btn-back").forEach(el=>{
    el.addEventListener("click", ()=>navigateTo(el.dataset.back));
  });

  // INVESTED — filter tabları
  document.querySelectorAll(".inv-tab").forEach(tab=>{
    tab.addEventListener("click", ()=>{
      document.querySelectorAll(".inv-tab").forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.filter;
      renderAssetList();
    });
  });

  // INVESTED — market/portfolio tabları
  document.querySelectorAll(".inv-main-tab").forEach(tab=>{
    tab.addEventListener("click", ()=>switchInvTab(tab.dataset.mainTab));
  });

  // Növbəti gün
  document.getElementById("btn-advance-day").addEventListener("click", advanceDay);

  // Trade düymələri
  document.getElementById("btn-open-buy").addEventListener("click",     ()=>openTradeModal("buy_long"));
  document.getElementById("btn-open-sell").addEventListener("click",    ()=>openTradeModal("sell_long"));
  document.getElementById("btn-open-short").addEventListener("click",   ()=>openTradeModal("open_short"));
  document.getElementById("btn-open-long-lev").addEventListener("click",()=>openTradeModal("open_long_lev"));

  // Trade modal
  document.getElementById("btn-modal-cancel").addEventListener("click",  closeTradeModal);
  document.getElementById("btn-modal-confirm").addEventListener("click", confirmTrade);
  document.getElementById("tm-quantity-input").addEventListener("input", updateTradeTotal);

  // Leverage
  document.querySelectorAll(".lev-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".lev-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      pendingLeverage = parseInt(btn.dataset.lev);
      updateTradeTotal();
    });
  });

  // Mövqə bağlama
  document.getElementById("btn-close-pos-cancel").addEventListener("click",  closeClosePosModal);
  document.getElementById("btn-close-pos-confirm").addEventListener("click", confirmClosePos);

  // ── WALLET listener-ları ──
  document.getElementById("btn-wallet-transfer").addEventListener("click", openWalletTransferModal);
  document.getElementById("btn-wallet-vault").addEventListener("click",    openVaultModal);
  document.getElementById("btn-wallet-set-primary").addEventListener("click", () => {
    const card = state.cards[walletActiveCardIndex];
    if (card) {
      state.primaryCardId = card.id;
      saveState();
      renderWalletCarousel();
      showToast("⭐ Əsas kart dəyişdirildi");
    }
  });
  document.getElementById("btn-add-card").addEventListener("click",        openAddCardModal);
  document.getElementById("btn-addcard-cancel").addEventListener("click",  () =>
    document.getElementById("wallet-addcard-overlay").classList.remove("active"));
  document.getElementById("btn-addcard-confirm").addEventListener("click", confirmAddCard);

  document.getElementById("btn-wt-cancel").addEventListener("click",  () =>
    document.getElementById("wallet-transfer-overlay").classList.remove("active"));
  document.getElementById("btn-wt-confirm").addEventListener("click", confirmWalletTransfer);

  document.getElementById("btn-vault-cancel").addEventListener("click",  () =>
    document.getElementById("wallet-vault-overlay").classList.remove("active"));
  document.getElementById("btn-vault-confirm").addEventListener("click", confirmVault);

  // Vault müddət seçimi
  document.querySelectorAll(".vault-dur-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vault-dur-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      vaultSelectedDays = parseInt(btn.dataset.days);
      updateVaultPreview();
    });
  });

  // Transfer selector dəyişəndə komisya yenilə
  document.getElementById("wt-from-select").addEventListener("change", updateTransferFeePreview);
  document.getElementById("wt-amount-input").addEventListener("input", updateTransferFeePreview);

  // Vault məbləğ dəyişəndə preview yenilə
  document.getElementById("vault-amount-input").addEventListener("input", updateVaultPreview);

  // Travel — köç düyməsi
  document.getElementById("btn-travel-move").addEventListener("click", () => {
    if (!selectedCityId) return;
    const city = CITIES.find(c => c.id === selectedCityId);
    if (!city) return;
    const totalCost = city.visaCost + city.moveCost;
    const card      = getPrimaryCard();
    if (!card || getPrimaryBalance() < city.minBalance + totalCost) return;
    card.balance -= totalCost;
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

  // RealEstate modal
  document.getElementById("btn-re-modal-cancel").addEventListener("click",  closeREModal);
  document.getElementById("btn-re-modal-confirm").addEventListener("click", confirmREModal);

  // RealEstate tab/filter
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
  if (!loaded || !state.priceHistory || Object.keys(state.priceHistory).length === 0) {
    initFreshState();
  } else {
    Engine.init(state.engineState);
    if (!state.positions)       state.positions = [];
    if (!state.currentCity)     state.currentCity = "baku";
    if (!state.ownedProperties) state.ownedProperties = [];
    // Köhnə state-dən migration: bankBalance → cards
    if (state.bankBalance !== undefined && !state.cards) {
      state.cards = [{
        id: "kapitan_standard_" + Date.now(),
        bankId: "kapitan",
        tier: "standard",
        balance: state.bankBalance,
        vault: null,
        weeklyTransferUsed: 0,
        lastWeekNumber: getWeekNumber(state.day),
        subscriptionPaidUntilWeek: null
      }];
      state.primaryCardId = state.cards[0].id;
      delete state.bankBalance;
    }
    if (!state.cards || !state.cards.length) {
      state.cards = [{
        id: "kapitan_standard_" + Date.now(),
        bankId: "kapitan", tier: "standard",
        balance: 0, vault: null,
        weeklyTransferUsed: 0,
        lastWeekNumber: getWeekNumber(state.day),
        subscriptionPaidUntilWeek: null
      }];
    }
    if (!state.primaryCardId) state.primaryCardId = state.cards[0].id;
  }
  setupEventListeners();
  renderAll();
}

document.addEventListener("DOMContentLoaded", start);
