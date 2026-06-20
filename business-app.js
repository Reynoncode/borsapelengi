// business-app.js
// Tələb: business-data.js və business-engine.js əvvəlcədən yüklənmiş olmalıdır

// ─── Ana render: Biz Marketi ─────────────────────────────────────────────────
function renderBizMarket(primary, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let html = `<div class="biz-market">
    <h2>🏢 Biznes Marketi</h2>
    <div class="biz-types-grid">`;

  for (const type of BIZ_COMPANY_TYPES) {
    const owned = primary.businesses && primary.businesses.find(b => b.typeId === type.id);
    const canAfford = primary.balance >= type.unlockCost;
    const meetsBalance = primary.balance >= type.requiredBalance;

    html += `
      <div class="biz-card ${owned ? 'biz-owned' : ''}" data-type-id="${type.id}">
        <div class="biz-card-header">
          <span class="biz-name">${type.name}</span>
          ${owned ? '<span class="biz-badge">✅ Açıq</span>' : ''}
        </div>
        <div class="biz-card-info">
          <div>Açılış xərci: <strong>${formatMoney(type.unlockCost)}</strong></div>
          <div>Min. balans: <strong>${formatMoney(type.requiredBalance)}</strong></div>
        </div>`;

    if (!owned) {
      const btnDisabled = (!canAfford || !meetsBalance) ? 'disabled' : '';
      let tooltip = '';
      if (!meetsBalance) tooltip = 'Kifayət qədər bank balansı yoxdur';
      else if (!canAfford) tooltip = 'Açılış xərci kifayət etmir';

      html += `
        <button class="biz-unlock-btn" ${btnDisabled}
          onclick="onUnlockBusiness('${type.id}')"
          title="${tooltip}">
          ${btnDisabled ? '🔒 Kifayət etmir' : '🔓 Aç'}
        </button>`;
    } else {
      html += `
        <button class="biz-manage-btn" onclick="onManageBusiness('${type.id}')">
          ⚙️ İdarə Et
        </button>`;
    }

    html += `</div>`;
  }

  html += `</div></div>`;
  container.innerHTML = html;
}

// ─── Biznes İdarəetmə Paneli ─────────────────────────────────────────────────
function renderBizManagePanel(primary, typeId, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const type = getType(typeId);
  const biz = primary.businesses && primary.businesses.find(b => b.typeId === typeId);
  if (!type || !biz) return;

  let html = `<div class="biz-manage-panel">
    <h2>${type.name} — İdarəetmə</h2>

    <section class="biz-projects-section">
      <h3>📋 Proyektlər</h3>
      <div class="biz-projects-grid">`;

  for (const proj of type.projects) {
    const isRunning = biz.activeProjects.find(ap => ap.projectId === proj.id && !ap.completed);
    const isCompleted = biz.activeProjects.find(ap => ap.projectId === proj.id && ap.completed);
    const canStart = primary.balance >= proj.costToBuild && !isRunning;

    html += `
      <div class="biz-proj-card">
        <div class="biz-proj-name">${proj.name}</div>
        <div class="biz-proj-details">
          <span>💰 Xərc: ${formatMoney(proj.costToBuild)}</span>
          <span>📅 Müddət: ${proj.durationDays} gün</span>
          ${proj.sellValue ? `<span>🏷️ Satış: ${formatMoney(proj.sellValue)}</span>` : ''}
          ${proj.weeklyIncome ? `<span>📈 Həftəlik: ${formatMoney(proj.weeklyIncome)}</span>` : ''}
          ${proj.deliverable === 'units' ? `<span>🏠 ${proj.unitCount} unit | Satış: ${formatMoney(proj.unitSellValue)} | Kirayə/həftə: ${formatMoney(proj.unitRentalWeekly)}</span>` : ''}
          ${proj.deliverable === 'course_platform' ? `<span>🎓 Max ${proj.maxCourses} kurs</span>` : ''}
        </div>`;

    if (isRunning) {
      const elapsed = Date.now() - isRunning.startedAt;
      const total = isRunning.durationMs;
      const pct = Math.min(100, Math.round((elapsed / total) * 100));
      html += `
        <div class="biz-progress-bar">
          <div class="biz-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="biz-progress-label">${pct}% tamamlandı</div>`;
    } else if (isCompleted && proj.deliverable === 'units') {
      const sold = isCompleted.unitsSold || 0;
      const rented = isCompleted.unitsRented || 0;
      const remaining = isCompleted.unitCount - sold - rented;
      html += `
        <div class="biz-units-info">
          Qalan: ${remaining} unit |
          Satılan: ${sold} | Kirayədə: ${rented}
        </div>
        <div class="biz-units-actions">
          <button onclick="onSellUnit('${typeId}','${proj.id}',1)">1 Unit Sat</button>
          <button onclick="onRentUnit('${typeId}','${proj.id}',1)">1 Unit Kirayəyə Ver</button>
        </div>`;
    } else {
      const btnDisabled = canStart ? '' : 'disabled';
      html += `
        <button class="biz-start-btn" ${btnDisabled}
          onclick="onStartProject('${typeId}','${proj.id}')">
          ${isRunning ? '⏳ Davam Edir' : (canStart ? '▶️ Başlat' : '🔒 Kifayət Etmir')}
        </button>`;
    }

    html += `</div>`;
  }

  html += `</div></section>`;

  // ─── Universitet Kampus/Platform UI ───────────────────────────────────────
  if (typeId === 'university' && biz.completedPlatforms.length > 0) {
    html += `<section class="biz-university-section">
      <h3>🎓 Tamamlanmış Platformlar / Kampuslar</h3>`;

    biz.completedPlatforms.forEach((platform, pIdx) => {
      const cfg = platform.courseConfig;
      const activeCount = platform.activeCourses.length;
      const finishedCount = platform.finishedCourses.length;
      const totalSlots = platform.maxCourses;
      const usedSlots = activeCount + finishedCount;
      const canAddCourse = usedSlots < totalSlots && primary.balance >= cfg.courseCost;

      html += `
        <div class="biz-platform-card">
          <div class="biz-platform-header">
            <strong>${platform.name}</strong>
            <span class="biz-platform-slots">${usedSlots}/${totalSlots} kurs</span>
          </div>

          <div class="biz-platform-courseinfo">
            Kurs xərci: ${formatMoney(cfg.courseCost)} |
            Müddət: ${cfg.courseDuration} gün |
            Qazanc: ${formatMoney(cfg.courseRevenue)}
          </div>

          <button class="biz-add-course-btn" ${canAddCourse ? '' : 'disabled'}
            onclick="onAddCourse('${typeId}', ${pIdx})">
            ➕ Dərs Əlavə Et
          </button>`;

      // Aktiv kurslar — progress bar
      if (platform.activeCourses.length > 0) {
        html += `<div class="biz-courses-active"><h4>⏳ Aktiv Dərslər</h4>`;
        for (const course of platform.activeCourses) {
          const elapsed = Date.now() - course.startedAt;
          const pct = Math.min(100, Math.round((elapsed / course.durationMs) * 100));
          const daysLeft = Math.ceil((course.durationMs - elapsed) / (24 * 60 * 60 * 1000));
          html += `
            <div class="biz-course-item">
              <div class="biz-course-meta">
                <span>📚 Kurs</span>
                <span>${pct}% — ${daysLeft > 0 ? daysLeft + ' gün qaldı' : 'Tamamlanır...'}</span>
              </div>
              <div class="biz-progress-bar">
                <div class="biz-progress-fill" style="width:${pct}%"></div>
              </div>
            </div>`;
        }
        html += `</div>`;
      }

      // Bitmiş kurslar — qazanc alma düyməsi
      if (platform.finishedCourses.length > 0) {
        html += `<div class="biz-courses-finished"><h4>✅ Bitmiş Dərslər (Qazanc Al)</h4>`;
        for (const course of platform.finishedCourses) {
          html += `
            <div class="biz-course-item biz-course-done">
              <span>🎉 Kurs Tamamlandı — Qazanc: ${formatMoney(course.revenue)}</span>
              <button class="biz-collect-btn"
                onclick="onCollectCourse('${typeId}', ${pIdx}, '${course.courseId}')">
                💵 Al
              </button>
            </div>`;
        }
        html += `</div>`;
      }

      html += `</div>`; // biz-platform-card
    });

    html += `</section>`;
  }

  html += `</div>`; // biz-manage-panel
  container.innerHTML = html;
}

// ─── Callback-lər (oyun kodu tərəfindən implement ediləcək) ─────────────────

function onUnlockBusiness(typeId) {
  const result = unlockBusiness(getGameState(), typeId);
  showToast(result.msg);
  saveGame();
  refreshUI();
}

function onManageBusiness(typeId) {
  renderBizManagePanel(getGameState(), typeId, '#biz-manage-container');
  showSection('biz-manage-container');
}

function onStartProject(typeId, projectId) {
  const result = startProject(getGameState(), typeId, projectId);
  showToast(result.msg);
  saveGame();
  refreshUI();
}

function onSellUnit(typeId, projectId, count) {
  const biz = getGameState().businesses.find(b => b.typeId === typeId);
  const idx = biz.activeProjects.filter(p => p.deliverable === 'units')
                                .findIndex(p => p.projectId === projectId);
  const result = sellUnits(getGameState(), typeId, idx, count);
  showToast(result.msg);
  saveGame();
  refreshUI();
}

function onRentUnit(typeId, projectId, count) {
  const biz = getGameState().businesses.find(b => b.typeId === typeId);
  const idx = biz.activeProjects.filter(p => p.deliverable === 'units')
                                .findIndex(p => p.projectId === projectId);
  const result = rentUnits(getGameState(), typeId, idx, count);
  showToast(result.msg);
  saveGame();
  refreshUI();
}

function onAddCourse(typeId, platformIdx) {
  const result = addCourse(getGameState(), typeId, platformIdx);
  showToast(result.msg);
  saveGame();
  refreshUI();
}

function onCollectCourse(typeId, platformIdx, courseId) {
  const result = collectCourseRevenue(getGameState(), typeId, platformIdx, courseId);
  showToast(result.msg);
  saveGame();
  refreshUI();
}

// ─── Köməkçi: pul formatı ───────────────────────────────────────────────────
function formatMoney(amount) {
  if (!amount && amount !== 0) return '—';
  return amount.toLocaleString('az-AZ') + ' ₼';
}

// ─── Köməkçilər: app.js state-inə uyğun ────────────────────────────────────
function getGameState() { return state; }
function refreshUI()    { renderAll(); }
function showSection(id){ navigateTo(id); }

// ─── app.js ilə inteqrasiya: çatışmayan 3 funksiya ──────────────────────────

function openBusiness() {
  renderBusiness();
  navigateTo("business");
}

function setupBusinessListeners() {
  const btnBack = document.getElementById("btn-business-mgmt-back");
  if (btnBack) {
    btnBack.addEventListener("click", () => navigateTo("business"));
  }
}

function renderBusiness() {
  renderBizMarket(state, "#biz-market-container");
}

// ─── onManageBusiness: state + navigateTo ilə ───────────────────────────────
function onManageBusiness(typeId) {
  renderBizManagePanel(state, typeId, '#biz-manage-container');
  navigateTo("business-mgmt");
}
