/* ============================================================
   BUSINESS-APP.JS — Business App UI Loqikası
   ============================================================
   Bu fayl app.js-ə əlavə olaraq işləyir.
   app.js-dəki state, saveState, addTransaction, fmtMoney,
   getPrimaryCard, showToast funksiyalarını istifadə edir.
============================================================ */

/* ── UI state ── */
let bizActiveTab     = "market";   // "market" | "mybiz"
let bizSelectedTypeId = null;
let bizSelectedBizId  = null;
let bizSelectedEntryId = null;
let bizProjectModalAction = null;  // "sell" | "unit_sell" | "unit_rent"
let bizSelectedUnitId = null;

/* ──────────────────────────────────────────────────────────
   OPEN BUSINESS APP
────────────────────────────────────────────────────────── */
function openBusiness() {
  navigateTo("business");
  renderBusiness();
}

/* ──────────────────────────────────────────────────────────
   MAIN RENDER
────────────────────────────────────────────────────────── */
function renderBusiness() {
  renderBizStats();
  if (bizActiveTab === "market") renderBizMarket();
  else renderBizMy();
}

/* ── Statistika bölməsi ── */
function renderBizStats() {
  const weeklyIncome = BusinessEngine.getTotalWeeklyIncome(state);
  const invested     = BusinessEngine.getTotalInvested(state);
  const bizCount     = (state.businesses || []).length;

  document.getElementById("biz-stat-count").textContent    = bizCount;
  document.getElementById("biz-stat-weekly").textContent   = fmtMoney(weeklyIncome) + "/həftə";
  document.getElementById("biz-stat-invested").textContent = fmtMoney(invested);
}

/* ── Market tab: unlock ediləcək bizneslər ── */
function renderBizMarket() {
  const container = document.getElementById("biz-market-list");
  const owned = new Set((state.businesses || []).map(b => b.typeId));

  container.innerHTML = BIZ_COMPANY_TYPES.map(type => {
    const isOwned = owned.has(type.id);
    return `
    <div class="biz-type-card ${isOwned ? "biz-owned" : ""}" data-type-id="${type.id}">
      <div class="btc-icon" style="background:${type.color}22;color:${type.color}">${type.icon}</div>
      <div class="btc-info">
        <div class="btc-name">${type.name}</div>
        <div class="btc-desc">${type.description}</div>
        <div class="btc-projects">${type.projects.length} proyekt növü</div>
      </div>
      <div class="btc-right">
        ${isOwned
          ? `<div class="btc-badge owned">Açıq ✓</div>`
          : `<div class="btc-cost">${fmtMoney(type.unlockCost)}</div>
             <div class="btc-badge unlock">Aç</div>`
        }
      </div>
    </div>`;
  }).join("");

  container.querySelectorAll(".biz-type-card").forEach(el => {
    el.addEventListener("click", () => {
      bizSelectedTypeId = el.dataset.typeId;
      openBizTypeDetail(bizSelectedTypeId);
    });
  });
}

/* ── My Biz tab: sahib olunan bizneslər ── */
function renderBizMy() {
  const container = document.getElementById("biz-my-list");
  const businesses = state.businesses || [];

  if (businesses.length === 0) {
    container.innerHTML = `<div class="biz-empty">Hələ heç bir biznes yoxdur.<br>Bazar bölməsindən birini aç!</div>`;
    return;
  }

  container.innerHTML = businesses.map(biz => {
    const type    = BusinessEngine.getType(biz.typeId);
    const active  = biz.activeProjects.filter(e => e.status === "building").length;
    const ready   = biz.activeProjects.filter(e => e.status === "ready").length;
    const streams = biz.incomeStreams.length;
    const weekly  = biz.incomeStreams.reduce((s, st) => s + st.weeklyIncome, 0);
    return `
    <div class="biz-my-card" data-biz-id="${biz.id}">
      <div class="bmc-icon" style="background:${type.color}22;color:${type.color}">${type.icon}</div>
      <div class="bmc-info">
        <div class="bmc-name">${type.name}</div>
        <div class="bmc-row">
          <span class="bmc-tag building">${active} tikinti</span>
          ${ready > 0 ? `<span class="bmc-tag ready">${ready} hazır ⚡</span>` : ""}
          ${streams > 0 ? `<span class="bmc-tag income">${fmtMoney(weekly)}/həf</span>` : ""}
        </div>
      </div>
      <div class="bmc-arrow">›</div>
    </div>`;
  }).join("");

  container.querySelectorAll(".biz-my-card").forEach(el => {
    el.addEventListener("click", () => {
      bizSelectedBizId = el.dataset.bizId;
      openBizDetail(bizSelectedBizId);
    });
  });
}

/* ──────────────────────────────────────────────────────────
   BİZNES TİPİ DETAYı (unlock + proyekt seçimi)
────────────────────────────────────────────────────────── */
function openBizTypeDetail(typeId) {
  const type  = BusinessEngine.getType(typeId);
  const isOwned = (state.businesses || []).some(b => b.typeId === typeId);

  document.getElementById("biz-detail-icon").textContent   = type.icon;
  document.getElementById("biz-detail-icon").style.color   = type.color;
  document.getElementById("biz-detail-name").textContent   = type.name;
  document.getElementById("biz-detail-desc").textContent   = type.description;

  const unlockBtn = document.getElementById("btn-biz-unlock");
  if (isOwned) {
    unlockBtn.textContent = "Açılıb ✓";
    unlockBtn.disabled    = true;
    unlockBtn.className   = "btn-biz-unlock disabled";
  } else {
    unlockBtn.textContent = `Aç — ${fmtMoney(type.unlockCost)}`;
    unlockBtn.disabled    = false;
    unlockBtn.className   = "btn-biz-unlock";
    unlockBtn.onclick     = () => doUnlockBusiness(typeId);
  }

  // Proyektlər siyahısı
  const pList = document.getElementById("biz-project-types-list");
  pList.innerHTML = type.projects.map(proj => {
    const roiPct = proj.sellValue
      ? (((proj.sellValue - proj.costToBuild) / proj.costToBuild) * 100).toFixed(0)
      : null;
    const incomeInfo = proj.deliverable === "income"
      ? `<div class="bpt-income">Həftəlik: ${fmtMoney(proj.weeklyIncome)}</div>`
      : "";
    const unitsInfo = proj.deliverable === "units"
      ? `<div class="bpt-income">${proj.unitCount} unit × ${fmtMoney(proj.unitSellValue)}</div>`
      : "";
    const sellInfo = proj.deliverable === "sell"
      ? `<div class="bpt-sell">Satış: ${fmtMoney(proj.sellValue)} <span class="bpt-roi">+${roiPct}% ROI</span></div>`
      : "";

    return `
    <div class="biz-proj-type-card ${isOwned ? "clickable" : "locked"}" data-proj-id="${proj.id}">
      <div class="bptc-top">
        <span class="bptc-icon">${proj.icon}</span>
        <span class="bptc-name">${proj.name}</span>
        ${isOwned ? `<button class="btn-start-proj" data-proj-id="${proj.id}">Başlat</button>` : ""}
      </div>
      <div class="bptc-desc">${proj.description}</div>
      <div class="bptc-meta">
        <span>💰 ${fmtMoney(proj.costToBuild)}</span>
        <span>⏱ ${proj.durationDays} gün</span>
        ${sellInfo}${incomeInfo}${unitsInfo}
      </div>
    </div>`;
  }).join("");

  if (isOwned) {
    pList.querySelectorAll(".btn-start-proj").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const biz = state.businesses.find(b => b.typeId === typeId);
        if (biz) doStartProject(biz.id, btn.dataset.projId);
      });
    });
  }

  navigateTo("business-type-detail");
}

/* ──────────────────────────────────────────────────────────
   BİZNES DETAYı (aktiv proyektlər + gəlir axınları)
────────────────────────────────────────────────────────── */
function openBizDetail(bizId) {
  const biz  = (state.businesses || []).find(b => b.id === bizId);
  if (!biz) return;
  const type = BusinessEngine.getType(biz.typeId);

  document.getElementById("biz-mgmt-icon").textContent = type.icon;
  document.getElementById("biz-mgmt-icon").style.color = type.color;
  document.getElementById("biz-mgmt-name").textContent = type.name;

  renderBizProjectList(biz);
  renderBizIncomeStreams(biz);

  navigateTo("business-mgmt");
}

function renderBizProjectList(biz) {
  const container = document.getElementById("biz-active-projects");

  if (biz.activeProjects.length === 0) {
    container.innerHTML = `<div class="biz-empty small">Aktiv proyekt yoxdur.<br>Yeni proyekt başlatmaq üçün "Yeni Proyekt" düyməsinə bas.</div>`;
  } else {
    container.innerHTML = biz.activeProjects.map(entry => {
      const proj     = BusinessEngine.getProject(biz.typeId, entry.projectId);
      const isReady  = entry.status === "ready";
      const progress = isReady ? 100 : Math.min(100,
        Math.round(((state.day - entry.startDay) / (entry.endDay - entry.startDay)) * 100));
      const daysLeft = Math.max(0, entry.endDay - state.day);

      let actionHtml = "";
      if (isReady) {
        if (proj.deliverable === "sell") {
          actionHtml = `<button class="btn-biz-action sell" data-action="sell" data-entry-id="${entry.id}">Sat (${fmtMoney(proj.sellValue)})</button>`;
        } else if (proj.deliverable === "units") {
          const unsold = entry.units.filter(u => u.status === "unsold").length;
          const rented = entry.units.filter(u => u.status === "rented").length;
          const sold   = entry.units.filter(u => u.status === "sold").length;
          actionHtml = `
            <div class="biz-units-row">
              <span class="biz-unit-stat">Satılmamış: ${unsold}</span>
              <span class="biz-unit-stat rented">Kirayə: ${rented}</span>
              <span class="biz-unit-stat sold">Satılmış: ${sold}</span>
            </div>
            <div class="biz-unit-grid">
              ${entry.units.map(u => `
                <div class="biz-unit-btn ${u.status}" data-unit-id="${u.id}" data-entry-id="${entry.id}">
                  #${u.idx}<br><span>${u.status === "unsold" ? "→" : u.status === "rented" ? "🔒" : "✓"}</span>
                </div>
              `).join("")}
            </div>`;
        }
      }

      return `
      <div class="biz-proj-entry ${isReady ? "ready" : "building"}">
        <div class="bpe-header">
          <span class="bpe-icon">${proj.icon}</span>
          <span class="bpe-name">${proj.name}</span>
          <span class="bpe-status ${isReady ? "ready" : ""}">${isReady ? "HAZIR ✅" : `${daysLeft} gün`}</span>
        </div>
        ${!isReady ? `
        <div class="bpe-progress-wrap">
          <div class="bpe-progress-bar" style="width:${progress}%"></div>
        </div>
        <div class="bpe-meta">Gün ${entry.startDay} → ${entry.endDay} · ${progress}%</div>
        ` : ""}
        ${actionHtml}
      </div>`;
    }).join("");

    // Event listeners
    container.querySelectorAll(".btn-biz-action[data-action='sell']").forEach(btn => {
      btn.addEventListener("click", () => {
        const biz = state.businesses.find(b => b.id === bizSelectedBizId);
        const res = BusinessEngine.sellProject(state, bizSelectedBizId, btn.dataset.entryId);
        if (res.ok) { saveState(); renderBizProjectList(biz); renderBizStats(); showToast(`✅ Satıldı! +${fmtMoney(res.earned)}`); }
        else showToast("❌ " + res.msg);
      });
    });

    container.querySelectorAll(".biz-unit-btn.unsold").forEach(btn => {
      btn.addEventListener("click", () => {
        bizSelectedEntryId = btn.dataset.entryId;
        bizSelectedUnitId  = btn.dataset.unitId;
        openUnitModal(bizSelectedBizId, bizSelectedEntryId, bizSelectedUnitId);
      });
    });
  }

  // "Yeni Proyekt" düyməsi
  document.getElementById("btn-biz-new-project").onclick = () => {
    openBizTypeDetail(state.businesses.find(b => b.id === bizSelectedBizId).typeId);
  };
}

function renderBizIncomeStreams(biz) {
  const container = document.getElementById("biz-income-streams");
  if (biz.incomeStreams.length === 0) {
    container.innerHTML = `<div class="biz-empty small">Aktiv gəlir axını yoxdur.</div>`;
    return;
  }
  const total = biz.incomeStreams.reduce((s, st) => s + st.weeklyIncome, 0);
  container.innerHTML = `
    <div class="biz-stream-total">Cəmi həftəlik: ${fmtMoney(total)}</div>
    ${biz.incomeStreams.map(st => `
    <div class="biz-stream-row">
      <span class="bsr-label">${st.label}</span>
      <span class="bsr-amount">${fmtMoney(st.weeklyIncome)}/həf</span>
    </div>`).join("")}`;
}

/* ──────────────────────────────────────────────────────────
   UNIT MODAL (sat / kirayə ver)
────────────────────────────────────────────────────────── */
function openUnitModal(bizId, entryId, unitId) {
  const biz   = state.businesses.find(b => b.id === bizId);
  const entry = biz.activeProjects.find(e => e.id === entryId);
  const unit  = entry.units.find(u => u.id === unitId);
  const proj  = BusinessEngine.getProject(biz.typeId, entry.projectId);
  const type  = BusinessEngine.getType(biz.typeId);

  document.getElementById("unit-modal-title").textContent = `${proj.icon} Unit #${unit.idx}`;
  document.getElementById("unit-modal-sell-price").textContent = fmtMoney(proj.unitSellValue);
  document.getElementById("unit-modal-rent-price").textContent = fmtMoney(proj.unitRentalWeekly) + "/həf";

  // canTransferToRE
  const reBtn = document.getElementById("btn-unit-transfer-re");
  reBtn.style.display = proj.canTransferToRE ? "flex" : "none";

  document.getElementById("biz-unit-modal-overlay").style.display = "flex";
}

function closeUnitModal() {
  document.getElementById("biz-unit-modal-overlay").style.display = "none";
}

/* ──────────────────────────────────────────────────────────
   ACTION FUNKSIYALARI
────────────────────────────────────────────────────────── */
function doUnlockBusiness(typeId) {
  const res = BusinessEngine.unlockBusiness(state, typeId);
  if (res.ok) {
    saveState();
    showToast("✅ Biznes açıldı!");
    renderBusiness();
    // type detail-i yenidən aç
    openBizTypeDetail(typeId);
  } else {
    showToast("❌ " + res.msg);
  }
}

function doStartProject(bizId, projId) {
  const biz  = state.businesses.find(b => b.id === bizId);
  const proj = BusinessEngine.getProject(biz.typeId, projId);
  const res  = BusinessEngine.startProject(state, bizId, projId);
  if (res.ok) {
    saveState();
    showToast(`🚀 ${proj.name} başladıldı! ${proj.durationDays} günə hazır olacaq`);
    renderBusiness();
  } else {
    showToast("❌ " + res.msg);
  }
}

/* ──────────────────────────────────────────────────────────
   SETUP — event listenerlar
────────────────────────────────────────────────────────── */
function setupBusinessListeners() {
  // Tab switch
  document.querySelectorAll(".biz-main-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".biz-main-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      bizActiveTab = tab.dataset.bizTab;
      document.getElementById("biz-market-list").style.display = bizActiveTab === "market" ? "block" : "none";
      document.getElementById("biz-my-list").style.display     = bizActiveTab === "mybiz"  ? "block" : "none";
      renderBusiness();
    });
  });

  // Unit modal düymələri
  document.getElementById("btn-unit-sell").addEventListener("click", () => {
    const res = BusinessEngine.sellUnit(state, bizSelectedBizId, bizSelectedEntryId, bizSelectedUnitId);
    if (res.ok) {
      saveState(); closeUnitModal();
      const biz = state.businesses.find(b => b.id === bizSelectedBizId);
      renderBizProjectList(biz); renderBizStats();
      showToast(`✅ Satıldı! +${fmtMoney(res.earned)}`);
    } else showToast("❌ " + res.msg);
  });

  document.getElementById("btn-unit-rent").addEventListener("click", () => {
    const res = BusinessEngine.rentUnit(state, bizSelectedBizId, bizSelectedEntryId, bizSelectedUnitId);
    if (res.ok) {
      saveState(); closeUnitModal();
      const biz = state.businesses.find(b => b.id === bizSelectedBizId);
      renderBizProjectList(biz); renderBizIncomeStreams(biz); renderBizStats();
      showToast("✅ Kirayəyə verildi!");
    } else showToast("❌ " + res.msg);
  });

  document.getElementById("btn-unit-modal-cancel").addEventListener("click", closeUnitModal);

  // Transfer to RE (placeholder — ileridə genişləndiriləcək)
  document.getElementById("btn-unit-transfer-re").addEventListener("click", () => {
    closeUnitModal();
    showToast("🏠 RealEstate transferi tezliklə əlavə ediləcək");
  });
}

/* ──────────────────────────────────────────────────────────
   renderAll və advanceDay ilə inteqrasiya
  (Bu funksiyaları app.js-dəki ilgili yerə əlavə et)
────────────────────────────────────────────────────────── */
// app.js-dəki advanceDay() funksiyasında bu sətirləri əlavə et:
//   BusinessEngine.processDay(state);
//   (həftəlik prosesdə:) BusinessEngine.processWeeklyIncome(state);

// app.js-dəki calcNetWorth() funksiyasına əlavə et:
//   + BusinessEngine.getTotalInvested(state)

// app.js-dəki initFreshState()-ə əlavə et:
//   state.businesses = [];

// app.js-dəki renderAll()-a əlavə et:
//   if (document.getElementById("screen-business").classList.contains("active")) renderBusiness();
