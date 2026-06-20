// market-app.js
// app.js ilə inteqrasiya: state, navigateTo, getPrimaryCard, fmtMoney, showToast, saveState, renderHome

function openMarket() {
  navigateTo("market");
  renderMarket();
}

function renderMarket() {
  const activeTab = document.querySelector(".market-main-tab.active");
  const isOwned   = activeTab && activeTab.dataset.marketTab === "owned";
  document.getElementById("market-stores-list").style.display = isOwned ? "none"  : "block";
  document.getElementById("market-owned-list").style.display  = isOwned ? "block" : "none";
  if (isOwned) renderMarketOwned();
  else         renderMarketStores();
}

// ── Mağazalar siyahısı (ana ekran) ──────────────────────────
function renderMarketStores() {
  const container = document.getElementById("market-stores-list");
  if (!container) return;
  let html = "";
  for (const store of MARKET_STORES) {
    const ownedCount = getOwnedCountByStore(store.id);
    html += `
      <div class="mkt-store-card" data-store-id="${store.id}" style="border-left: 3px solid ${store.color};">
        <div class="mkt-store-icon" style="background:${store.color}22;">${store.icon}</div>
        <div class="mkt-store-info">
          <div class="mkt-store-name">${store.name}</div>
          <div class="mkt-store-desc">${store.description}</div>
        </div>
        <div class="mkt-store-right">
          ${ownedCount > 0 ? `<span class="mkt-owned-badge">${ownedCount} ədəd</span>` : ""}
          <span class="mkt-arrow">›</span>
        </div>
      </div>`;
  }
  container.innerHTML = html;
  container.querySelectorAll(".mkt-store-card").forEach(card => {
    card.addEventListener("click", () => openMarketStore(card.dataset.storeId));
  });
}

// ── Sahib olduqlarım ─────────────────────────────────────────
function renderMarketOwned() {
  const container = document.getElementById("market-owned-list");
  if (!container) return;
  const owned = state.marketOwned || [];
  if (owned.length === 0) {
    container.innerHTML = `<div class="mkt-empty">Hələ heç nə almamısınız.<br>Mağazadan bir şey seçin.</div>`;
    return;
  }

  // Mağazaya görə qruplaşdır
  const byStore = {};
  for (const item of owned) {
    if (!byStore[item.storeId]) byStore[item.storeId] = [];
    byStore[item.storeId].push(item);
  }

  let html = "";
  for (const storeId of Object.keys(byStore)) {
    const store = MARKET_STORES.find(s => s.id === storeId);
    if (!store) continue;
    html += `<div class="mkt-owned-group-title" style="color:${store.color};">${store.icon} ${store.name}</div>`;
    for (const ownedItem of byStore[storeId]) {
      const itemDef = store.items.find(i => i.id === ownedItem.itemId);
      if (!itemDef) continue;
      const currentValue = calcCurrentValue(ownedItem);
      const gain = currentValue - ownedItem.purchasePrice;
      const gainPct = ((gain / ownedItem.purchasePrice) * 100).toFixed(1);
      const gainColor = gain >= 0 ? "#1FD67A" : "#FF4D4D";
      html += `
        <div class="mkt-owned-card">
          ${ownedItem.image
            ? `<img src="${ownedItem.image}" class="mkt-owned-img" onerror="this.style.display='none'">`
            : `<div class="mkt-owned-img-placeholder" style="background:${store.color}22;">${store.icon}</div>`}
          <div class="mkt-owned-info">
            <div class="mkt-owned-name">${itemDef.name}</div>
            <div class="mkt-owned-meta">${itemDef.year} · ${itemDef.brand}</div>
            <div class="mkt-owned-price-row">
              <span class="mkt-owned-bought">Alış: ${fmtMoney(ownedItem.purchasePrice)}</span>
              <span style="color:${gainColor};font-size:11px;font-weight:700;">+${gainPct}%</span>
            </div>
            <div style="font-size:12px;font-weight:700;color:${gainColor};">İndi: ${fmtMoney(Math.round(currentValue))}</div>
          </div>
        </div>`;
    }
  }
  container.innerHTML = html;
}

// ── Mağaza səhifəsi ──────────────────────────────────────────
function openMarketStore(storeId) {
  const store = MARKET_STORES.find(s => s.id === storeId);
  if (!store) return;
  navigateTo("market-store");

  const titleEl = document.getElementById("market-store-title");
  const iconEl  = document.getElementById("market-store-icon");
  const descEl  = document.getElementById("market-store-desc");
  if (titleEl) titleEl.textContent = store.name;
  if (iconEl)  iconEl.textContent  = store.icon;
  if (descEl)  descEl.textContent  = store.description;

  renderStoreItems(store);
}

function renderStoreItems(store) {
  const container = document.getElementById("market-store-grid");
  if (!container) return;
  let html = "";
  for (const item of store.items) {
    html += `
      <div class="mkt-item-card" data-item-id="${item.id}" data-store-id="${store.id}">
        <div class="mkt-item-img-wrap" style="background:${store.color}15;">
          ${item.image
            ? `<img src="${item.image}" class="mkt-item-img" onerror="this.parentElement.innerHTML='<span style=font-size:36px>${store.icon}</span>'">`
            : `<span style="font-size:36px;">${store.icon}</span>`}
        </div>
        <div class="mkt-item-info">
          <div class="mkt-item-name">${item.name}</div>
          <div class="mkt-item-brand">${item.brand} · ${item.year}</div>
          <div class="mkt-item-price" style="color:${store.color};">${fmtMoney(item.price)}</div>
          <div class="mkt-item-appreciate">📈 Həftədə +1% dəyər artımı</div>
        </div>
      </div>`;
  }
  container.innerHTML = html;
  container.querySelectorAll(".mkt-item-card").forEach(card => {
    card.addEventListener("click", () => openMarketItemPopup(card.dataset.storeId, card.dataset.itemId));
  });
}

// ── Satın alma popup ─────────────────────────────────────────
let _mktPopupStoreId = null;
let _mktPopupItemId  = null;

function openMarketItemPopup(storeId, itemId) {
  _mktPopupStoreId = storeId;
  _mktPopupItemId  = itemId;
  const store = MARKET_STORES.find(s => s.id === storeId);
  const item  = store?.items.find(i => i.id === itemId);
  if (!store || !item) return;

  const balance = getPrimaryCard()?.balance ?? 0;
  const canBuy  = balance >= item.price;

  document.getElementById("mkt-popup-icon").textContent    = store.icon;
  document.getElementById("mkt-popup-name").textContent    = item.name;
  document.getElementById("mkt-popup-brand").textContent   = `${item.brand} · ${item.year}`;
  document.getElementById("mkt-popup-desc").textContent    = item.description;
  document.getElementById("mkt-popup-price").textContent   = fmtMoney(item.price);
  document.getElementById("mkt-popup-balance").textContent = fmtMoney(balance);

  const imgEl = document.getElementById("mkt-popup-img");
  if (imgEl) {
    if (item.image) {
      imgEl.src   = item.image;
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
    }
  }

  const buyBtn = document.getElementById("btn-mkt-buy");
  if (buyBtn) {
    buyBtn.textContent = canBuy ? `Al — ${fmtMoney(item.price)}` : "Balans kifayət etmir";
    buyBtn.disabled    = !canBuy;
    buyBtn.style.background = canBuy ? "#1FD67A" : "rgba(255,255,255,0.1)";
    buyBtn.style.color      = canBuy ? "#000"    : "rgba(255,255,255,0.3)";
  }

  document.getElementById("mkt-item-popup-overlay").style.display = "flex";
}

function closeMarketItemPopup() {
  document.getElementById("mkt-item-popup-overlay").style.display = "none";
  _mktPopupStoreId = null;
  _mktPopupItemId  = null;
}

function onMarketBuy() {
  const store = MARKET_STORES.find(s => s.id === _mktPopupStoreId);
  const item  = store?.items.find(i => i.id === _mktPopupItemId);
  if (!store || !item) return;

  const card = getPrimaryCard();
  if (!card || card.balance < item.price) {
    showToast("Balans kifayət etmir");
    return;
  }

  // Balansdan çıx
  card.balance -= item.price;

  // state.marketOwned-a əlavə et
  if (!state.marketOwned) state.marketOwned = [];
  state.marketOwned.push({
    id:            `${item.id}_${Date.now()}`,
    storeId:       store.id,
    itemId:        item.id,
    image:         item.image || "",
    purchasePrice: item.price,
    purchaseDay:   state.day || 0,
    weeklyAppreciation: item.weeklyAppreciation || 0.01
  });

  saveState();
  renderHome();
  closeMarketItemPopup();
  showToast(`${item.name} alındı! 🎉`);

  // Mağaza grid-i yenilə
  renderStoreItems(store);
}

// ── Köməkçi funksiyalar ──────────────────────────────────────
function getOwnedCountByStore(storeId) {
  return (state.marketOwned || []).filter(o => o.storeId === storeId).length;
}

function calcCurrentValue(ownedItem) {
  const daysPassed  = (state.day || 0) - (ownedItem.purchaseDay || 0);
  const weeksPassed = Math.floor(daysPassed / 7);
  const rate        = ownedItem.weeklyAppreciation || 0.01;
  return ownedItem.purchasePrice * Math.pow(1 + rate, weeksPassed);
}

// Hər həftə çağırılacaq (app.js-in həftəlik tick-inda)
function applyMarketAppreciation() {
  // Qiymət artımı calcCurrentValue ilə dinamik hesablanır,
  // ayrıca state dəyişikliyi lazım deyil.
  // Əgər həftəlik gəlir göstərmək istəsən burda əlavə edə bilərsən.
}

// ── Listener-lər ─────────────────────────────────────────────
function setupMarketListeners() {
  // Tab keçidi
  document.querySelectorAll(".market-main-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".market-main-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderMarket();
    });
  });

  // Popup bağla
  const overlayEl = document.getElementById("mkt-item-popup-overlay");
  if (overlayEl) {
    overlayEl.addEventListener("click", e => {
      if (e.target === overlayEl) closeMarketItemPopup();
    });
  }
  const closeBtn = document.getElementById("btn-mkt-popup-close");
  if (closeBtn) closeBtn.addEventListener("click", closeMarketItemPopup);

  const buyBtn = document.getElementById("btn-mkt-buy");
  if (buyBtn) buyBtn.addEventListener("click", onMarketBuy);
}
