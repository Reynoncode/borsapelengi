// business-app.js
// app.js ile tam inteqrasiya:
// state, navigateTo, getPrimaryCard, fmtMoney, showToast, saveState, renderHome — hami app.js-dendir

// openBusiness: app-icon-wrap click-den cagrilir
function openBusiness() {
  navigateTo("business");
  renderBusiness();
}

// renderBusiness: ana business ekranini render edir
function renderBusiness() {
  updateBizStatsBar();
  const activTab = document.querySelector(".biz-main-tab.active");
  const isMyBiz  = activTab && activTab.dataset.bizTab === "mybiz";
  document.getElementById("biz-market-list").style.display = isMyBiz ? "none"  : "block";
  document.getElementById("biz-my-list").style.display     = isMyBiz ? "block" : "none";
  if (isMyBiz) renderBizMyList();
  else         renderBizMarketList();
}

function updateBizStatsBar() {
  const owned  = state.businesses || [];
  let weekly   = 0;
  let invested = 0;
  for (const biz of owned) {
    for (const ap of (biz.activeProjects || [])) {
      invested += ap.costToBuild || 0;
      if (ap.weeklyIncome && ap.completed) weekly += ap.weeklyIncome;
    }
  }
  const countEl    = document.getElementById("biz-stat-count");
  const weeklyEl   = document.getElementById("biz-stat-weekly");
  const investedEl = document.getElementById("biz-stat-invested");
  if (countEl)    countEl.textContent    = owned.length;
  if (weeklyEl)   weeklyEl.textContent   = fmtMoney(weekly) + "/heftelik";
  if (investedEl) investedEl.textContent = fmtMoney(invested);
}

function renderBizMarketList() {
  const container = document.getElementById("biz-market-list");
  if (!container) return;
  const primaryBal = getPrimaryCard()?.balance ?? 0;
  const owned      = state.businesses || [];
  let html = "";
  for (const type of BIZ_COMPANY_TYPES) {
    const isOwned   = owned.find(b => b.typeId === type.id);
    const canAfford = primaryBal >= type.unlockCost;
    const meetsMin  = primaryBal >= type.requiredBalance;
    let statusHtml = "";
    if (isOwned)        statusHtml = `<span class="bmc-status owned">ACIQ</span>`;
    else if (!meetsMin) statusHtml = `<span class="bmc-status locked">Min: ${fmtMoney(type.requiredBalance)}</span>`;
    else if (!canAfford)statusHtml = `<span class="bmc-status locked">${fmtMoney(type.unlockCost)}</span>`;
    else                statusHtml = `<span class="bmc-status available">Ac</span>`;
    html += `
      <div class="biz-market-card" data-type-id="${type.id}">
        <div class="bmc-main">
          <div class="bmc-name">${type.name}</div>
          <div class="bmc-meta">Acilis: <strong>${fmtMoney(type.unlockCost)}</strong> &nbsp;·&nbsp; Min: <strong>${fmtMoney(type.requiredBalance)}</strong></div>
          <div class="bmc-projects">${type.projects.map(p => `<span class="bmc-proj-tag">${p.name}</span>`).join("")}</div>
        </div>
        <div class="bmc-right">${statusHtml}</div>
      </div>`;
  }
  container.innerHTML = html || `<div style="padding:20px;color:var(--c-text-secondary);text-align:center;">Biznes tapilmadi</div>`;
  container.querySelectorAll(".biz-market-card").forEach(card => {
    card.addEventListener("click", () => onBizTypeClick(card.dataset.typeId));
  });
}

function renderBizMyList() {
  const container = document.getElementById("biz-my-list");
  if (!container) return;
  const owned = state.businesses || [];
  if (owned.length === 0) {
    container.innerHTML = `<div style="padding:40px 16px;text-align:center;color:var(--c-text-secondary);font-size:13px;">Hele biznesin yoxdur.<br>Bazar-dan bir biznes ac.</div>`;
    return;
  }
  let html = "";
  for (const biz of owned) {
    const type        = BIZ_COMPANY_TYPES.find(t => t.id === biz.typeId);
    if (!type) continue;
    const activeCount = (biz.activeProjects || []).filter(ap => !ap.completed).length;
    const doneCount   = (biz.activeProjects || []).filter(ap => ap.completed).length;
    const platCount   = (biz.completedPlatforms || []).length;
    const metaParts   = [];
    if (activeCount > 0) metaParts.push(`${activeCount} aktiv`);
    if (doneCount > 0)   metaParts.push(`${doneCount} hazir`);
    if (platCount > 0)   metaParts.push(`${platCount} platform`);
    if (metaParts.length === 0) metaParts.push("Proyekt yoxdur");
    html += `
      <div class="biz-market-card" data-type-id="${biz.typeId}" style="border-left:3px solid #1FD67A;">
        <div class="bmc-main">
          <div class="bmc-name">${type.name}</div>
          <div class="bmc-meta">${metaParts.join(" &nbsp;·&nbsp; ")}</div>
        </div>
        <div class="bmc-right"><span class="bmc-status available">Idare et</span></div>
      </div>`;
  }
  container.innerHTML = html;
  container.querySelectorAll(".biz-market-card").forEach(card => {
    card.addEventListener("click", () => onBizManageClick(card.dataset.typeId));
  });
}

function onBizTypeClick(typeId) {
  const isOwned = (state.businesses || []).find(b => b.typeId === typeId);
  if (isOwned) { onBizManageClick(typeId); return; }
  const type = BIZ_COMPANY_TYPES.find(t => t.id === typeId);
  if (!type) return;
  navigateTo("business-type-detail");
  const nameEl = document.getElementById("biz-detail-name");
  if (nameEl && nameEl.childNodes[0]) nameEl.childNodes[0].textContent = type.name;
  const iconEl = document.getElementById("biz-detail-icon");
  if (iconEl) iconEl.textContent = type.name.split(" ")[0];
  const descEl = document.getElementById("biz-detail-desc");
  if (descEl) descEl.textContent = `Acilis: ${fmtMoney(type.unlockCost)} | Min. balans: ${fmtMoney(type.requiredBalance)}`;
  const unlockBtn  = document.getElementById("btn-biz-unlock");
  const primaryBal = getPrimaryCard()?.balance ?? 0;
  const canUnlock  = primaryBal >= type.unlockCost && primaryBal >= type.requiredBalance;
  if (unlockBtn) {
    unlockBtn.textContent = canUnlock ? `Ac — ${fmtMoney(type.unlockCost)}` : `Kifayet etmir`;
    unlockBtn.disabled    = !canUnlock;
    unlockBtn.onclick     = () => onUnlockBusiness(typeId);
  }
  const projList = document.getElementById("biz-project-types-list");
  if (projList) {
    projList.innerHTML = type.projects.map(proj => `
      <div style="padding:12px 16px;border-bottom:1px solid var(--c-border);">
        <div style="font-weight:600;font-size:13px;">${proj.name}</div>
        <div style="font-size:11px;color:var(--c-text-secondary);margin-top:4px;">
          ${fmtMoney(proj.costToBuild)} | ${proj.durationDays} gun
          ${proj.sellValue     ? ` | Satis: ${fmtMoney(proj.sellValue)}`         : ""}
          ${proj.weeklyIncome  ? ` | Heftelik: ${fmtMoney(proj.weeklyIncome)}`   : ""}
          ${proj.deliverable === "units"           ? ` | ${proj.unitCount} unit`  : ""}
          ${proj.deliverable === "course_platform" ? ` | Max ${proj.maxCourses} kurs` : ""}
        </div>
      </div>`).join("");
  }
}

function onBizManageClick(typeId) {
  navigateTo("business-mgmt");
  renderBizMgmt(typeId);
}

function renderBizMgmt(typeId) {
  const type = BIZ_COMPANY_TYPES.find(t => t.id === typeId);
  const biz  = (state.businesses || []).find(b => b.typeId === typeId);
  if (!type || !biz) return;
  const iconEl = document.getElementById("biz-mgmt-icon");
  const nameEl = document.getElementById("biz-mgmt-name");
  if (iconEl) iconEl.textContent = type.name.split(" ")[0];
  if (nameEl) nameEl.textContent = type.name.replace(/^\S+\s/, "");
  const btnNew = document.getElementById("btn-biz-new-project");
  if (btnNew) btnNew.onclick = () => openBizNewProjectModal(typeId);
  renderBizActiveProjects(biz, typeId);
  renderBizIncomeStreams(biz, typeId);
}

function renderBizActiveProjects(biz, typeId) {
  const container = document.getElementById("biz-active-projects");
  if (!container) return;
  const running = (biz.activeProjects || []).filter(ap => !ap.completed);
  if (running.length === 0) {
    container.innerHTML = `<div style="color:var(--c-text-secondary);font-size:13px;padding:8px 0;">Aktiv proyekt yoxdur. "+ Yeni" ile baslat.</div>`;
    return;
  }
  container.innerHTML = running.map(ap => {
    const elapsed  = Date.now() - ap.startedAt;
    const pct      = Math.min(100, Math.round((elapsed / ap.durationMs) * 100));
    const daysLeft = Math.max(0, Math.ceil((ap.durationMs - elapsed) / 86400000));
    return `
      <div style="background:var(--c-surface);border:1px solid var(--c-border);border-radius:10px;padding:12px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-weight:600;font-size:13px;">${ap.name}</span>
          <span style="font-size:11px;color:var(--c-text-secondary);">${daysLeft} gun qaldi</span>
        </div>
        <div style="background:var(--c-bg);border-radius:4px;height:6px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#1a6fa0,#1FD67A);border-radius:4px;"></div>
        </div>
        <div style="font-size:11px;color:var(--c-text-secondary);margin-top:4px;text-align:right;">${pct}% tamamlandi</div>
      </div>`;
  }).join("");
}

function renderBizIncomeStreams(biz, typeId) {
  const container = document.getElementById("biz-income-streams");
  if (!container) return;
  let html = "";
  const completed = (biz.activeProjects || []).filter(ap => ap.completed);
  for (const ap of completed) {
    if (ap.deliverable === "income") {
      html += `
        <div style="background:var(--c-surface);border:1px solid var(--c-border);border-radius:10px;padding:12px;margin-bottom:10px;">
          <div style="font-weight:600;font-size:13px;">${ap.name}</div>
          <div style="color:#1FD67A;font-size:12px;margin-top:4px;">${fmtMoney(ap.weeklyIncome)}/heftelik</div>
        </div>`;
    } else if (ap.deliverable === "units") {
      const sold = ap.unitsSold || 0, rented = ap.unitsRented || 0, remaining = ap.unitCount - sold - rented;
      html += `
        <div style="background:var(--c-surface);border:1px solid var(--c-border);border-radius:10px;padding:12px;margin-bottom:10px;">
          <div style="font-weight:600;font-size:13px;">${ap.name}</div>
          <div style="font-size:11px;color:var(--c-text-secondary);margin-top:4px;">Qalan: ${remaining} | Satilan: ${sold} | Kiraye: ${rented}</div>
          ${rented > 0 ? `<div style="color:#1FD67A;font-size:12px;margin-top:4px;">${fmtMoney(rented * ap.unitRentalWeekly)}/heftelik kiraye</div>` : ""}
          ${remaining > 0 ? `<button onclick="onBizUnitModal('${typeId}','${ap.projectId}')" style="margin-top:8px;padding:6px 14px;background:#1a5a7a;color:#fff;border:none;border-radius:6px;font-size:12px;cursor:pointer;">Sat / Kiraye ver</button>` : ""}
        </div>`;
    }
  }
  for (let pIdx = 0; pIdx < (biz.completedPlatforms || []).length; pIdx++) {
    const platform    = biz.completedPlatforms[pIdx];
    const cfg         = platform.courseConfig;
    const activeCount = platform.activeCourses.length;
    const doneCount   = platform.finishedCourses.length;
    const usedSlots   = activeCount + doneCount;
    const canAdd      = usedSlots < platform.maxCourses && (getPrimaryCard()?.balance ?? 0) >= cfg.courseCost;
    html += `
      <div style="background:var(--c-surface);border:1px solid #2a4060;border-radius:10px;padding:12px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-weight:600;font-size:13px;">${platform.name}</span>
          <span style="font-size:11px;color:var(--c-text-secondary);">${usedSlots}/${platform.maxCourses} kurs</span>
        </div>
        <div style="font-size:11px;color:var(--c-text-secondary);margin-bottom:8px;">Xefc: ${fmtMoney(cfg.courseCost)} | Qazanc: ${fmtMoney(cfg.courseRevenue)} | ${cfg.courseDuration} gun</div>
        <button onclick="onAddCourse('${typeId}', ${pIdx})" ${canAdd ? "" : "disabled"}
          style="padding:7px 14px;background:${canAdd ? "#5b2d8e" : "#2a2a2a"};color:${canAdd ? "#fff" : "#555"};border:none;border-radius:6px;font-size:12px;cursor:${canAdd ? "pointer" : "not-allowed"};font-weight:600;margin-bottom:8px;">
          + Ders Elave Et (${fmtMoney(cfg.courseCost)})
        </button>`;
    if (activeCount > 0) {
      html += `<div style="margin-top:4px;font-size:11px;font-weight:700;color:var(--c-text-secondary);margin-bottom:4px;">AKTIV DERSLER</div>`;
      for (const course of platform.activeCourses) {
        const elapsed  = Date.now() - course.startedAt;
        const pct      = Math.min(100, Math.round((elapsed / course.durationMs) * 100));
        const daysLeft = Math.max(0, Math.ceil((course.durationMs - elapsed) / 86400000));
        html += `
          <div style="margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--c-text-secondary);margin-bottom:3px;"><span>Kurs</span><span>${pct}% - ${daysLeft} gun</span></div>
            <div style="background:var(--c-bg);border-radius:4px;height:5px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#5b2d8e,#1FD67A);border-radius:4px;"></div></div>
          </div>`;
      }
    }
    if (doneCount > 0) {
      html += `<div style="margin-top:6px;font-size:11px;font-weight:700;color:#1FD67A;margin-bottom:4px;">BITMIS DERSLER</div>`;
      for (const course of platform.finishedCourses) {
        html += `
          <div style="display:flex;justify-content:space-between;align-items:center;background:#1a3020;border-radius:8px;padding:8px 10px;margin-bottom:6px;">
            <span style="font-size:12px;color:#1FD67A;">${fmtMoney(course.revenue)} qazanc hazirdir</span>
            <button onclick="onCollectCourse('${typeId}', ${pIdx}, '${course.courseId}')" style="padding:5px 12px;background:#27ae60;color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;">Al</button>
          </div>`;
      }
    }
    html += `</div>`;
  }
  container.innerHTML = html || `<div style="color:var(--c-text-secondary);font-size:13px;">Hele gelir axini yoxdur.</div>`;
}

let _bizNewProjTypeId = null;
function openBizNewProjectModal(typeId) {
  _bizNewProjTypeId = typeId;
  const type       = BIZ_COMPANY_TYPES.find(t => t.id === typeId);
  const biz        = (state.businesses || []).find(b => b.typeId === typeId);
  if (!type) return;
  const primaryBal = getPrimaryCard()?.balance ?? 0;
  const available  = type.projects.filter(proj => {
    if (primaryBal < proj.costToBuild) return false;
    if (!type.noProjectLimit) {
      if ((biz?.activeProjects || []).find(ap => ap.projectId === proj.id && !ap.completed)) return false;
    }
    return true;
  });
  if (available.length === 0) { showToast("Baslada bileceyun proyekt yoxdur"); return; }
  const opts   = available.map((p, i) => `${i + 1}) ${p.name} — ${fmtMoney(p.costToBuild)} (${p.durationDays} gun)`).join("\n");
  const choice = prompt(`Proyekt sec (nomre daxil et):\n\n${opts}`);
  const idx    = parseInt(choice) - 1;
  if (isNaN(idx) || idx < 0 || idx >= available.length) return;
  onStartProject(typeId, available[idx].id);
}

let _unitModalTypeId = null, _unitModalProjId = null;
function onBizUnitModal(typeId, projectId) {
  _unitModalTypeId = typeId;
  _unitModalProjId = projectId;
  const biz = (state.businesses || []).find(b => b.typeId === typeId);
  const ap  = (biz?.activeProjects || []).find(p => p.projectId === projectId && p.deliverable === "units" && p.completed);
  if (!ap) return;
  document.getElementById("unit-modal-title").textContent     = ap.name;
  document.getElementById("unit-modal-sell-price").textContent = fmtMoney(ap.unitSellValue);
  document.getElementById("unit-modal-rent-price").textContent = fmtMoney(ap.unitRentalWeekly) + "/heftelik";
  const transferBtn = document.getElementById("btn-unit-transfer-re");
  if (transferBtn) transferBtn.style.display = ap.canTransferToRE ? "block" : "none";
  document.getElementById("biz-unit-modal-overlay").style.display = "flex";
}
function closeBizUnitModal() {
  document.getElementById("biz-unit-modal-overlay").style.display = "none";
}

function setupBusinessListeners() {
  document.querySelectorAll(".biz-main-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".biz-main-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const which = tab.dataset.bizTab;
      document.getElementById("biz-market-list").style.display = which === "market" ? "block" : "none";
      document.getElementById("biz-my-list").style.display     = which === "mybiz"  ? "block" : "none";
      if (which === "market") renderBizMarketList();
      else                    renderBizMyList();
    });
  });
  const btnSell = document.getElementById("btn-unit-sell");
  if (btnSell) {
    btnSell.addEventListener("click", () => {
      if (!_unitModalTypeId || !_unitModalProjId) return;
      const biz = (state.businesses || []).find(b => b.typeId === _unitModalTypeId);
      const idx = (biz?.activeProjects || []).filter(p => p.deliverable === "units").findIndex(p => p.projectId === _unitModalProjId);
      const result = sellUnits(state, _unitModalTypeId, idx, 1);
      showToast(result.msg);
      if (result.ok) { saveState(); renderHome(); }
      closeBizUnitModal();
      renderBizMgmt(_unitModalTypeId);
      updateBizStatsBar();
    });
  }
  const btnRent = document.getElementById("btn-unit-rent");
  if (btnRent) {
    btnRent.addEventListener("click", () => {
      if (!_unitModalTypeId || !_unitModalProjId) return;
      const biz = (state.businesses || []).find(b => b.typeId === _unitModalTypeId);
      const idx = (biz?.activeProjects || []).filter(p => p.deliverable === "units").findIndex(p => p.projectId === _unitModalProjId);
      const result = rentUnits(state, _unitModalTypeId, idx, 1);
      showToast(result.msg);
      if (result.ok) { saveState(); renderHome(); }
      closeBizUnitModal();
      renderBizMgmt(_unitModalTypeId);
      updateBizStatsBar();
    });
  }
  const btnCancel = document.getElementById("btn-unit-modal-cancel");
  if (btnCancel) btnCancel.addEventListener("click", closeBizUnitModal);
}

function onUnlockBusiness(typeId) {
  const result = unlockBusiness(state, typeId);
  showToast(result.msg);
  if (result.ok) { saveState(); renderHome(); navigateTo("business"); renderBusiness(); }
}
function onStartProject(typeId, projectId) {
  const result = startProject(state, typeId, projectId);
  showToast(result.msg);
  if (result.ok) { saveState(); renderHome(); renderBizMgmt(typeId); updateBizStatsBar(); }
}
function onAddCourse(typeId, platformIdx) {
  const result = addCourse(state, typeId, platformIdx);
  showToast(result.msg);
  if (result.ok) { saveState(); renderBizMgmt(typeId); }
}
function onCollectCourse(typeId, platformIdx, courseId) {
  const result = collectCourseRevenue(state, typeId, platformIdx, courseId);
  showToast(result.msg);
  if (result.ok) { saveState(); renderHome(); renderBizMgmt(typeId); }
}
