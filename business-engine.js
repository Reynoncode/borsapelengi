/* ============================================================
   BUSINESS-ENGINE.JS — Biznes Mühərriki
   ============================================================
   state.businesses = [
     {
       id: unique,
       typeId: "construction",
       unlockedDay: 3,
       activeProjects: [
         {
           id: unique,
           projectId: "c_cottage",
           startDay: 5,
           endDay: 19,
           costPaid: 50000,
           status: "building" | "ready" | "completed",
           // deliverable=units xüsusiyyətləri:
           units: [
             { id, status: "unsold"|"sold"|"rented", weeklyRent: 0 }
           ]
         }
       ],
       // deliverable=income üçün aktiv gəlir mənbələri:
       incomeStreams: [
         { projectId: "u_online", weeklyIncome: 50000, startDay: 20 }
       ]
     }
   ]
============================================================ */

const BusinessEngine = (() => {

  /* ──────────────────────────────────────────────────────────
     KÖMƏKÇİLƏR
  ────────────────────────────────────────────────────────── */
  function uid() {
    return "biz_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
  }

  function getType(typeId) {
     return BIZ_COMPANY_TYPES.find(t => t.id === typeId);
   }
   
  function getProject(typeId, projectId) {
    const t = getType(typeId);
    return t ? t.projects.find(p => p.id === projectId) : null;
  }

  /* ──────────────────────────────────────────────────────────
     BİZNES UNLOCK
  ────────────────────────────────────────────────────────── */
  function unlockBusiness(state, typeId) {
    const type = getType(typeId);
    if (!type) return { ok: false, msg: "Bilinməyən biznes tipi" };
    if (state.businesses.some(b => b.typeId === typeId))
      return { ok: false, msg: "Bu biznes artıq açılıb" };

    const primary = getPrimaryCard(); // app.js funksiyası
    if (primary.balance < type.unlockCost)
      return { ok: false, msg: "Kifayət qədər balans yoxdur" };

    primary.balance -= type.unlockCost;
    addTransaction(`${type.name} açıldı`, type.unlockCost, "out", "BUSINESS");

    state.businesses.push({
      id: uid(),
      typeId,
      unlockedDay: state.day,
      activeProjects: [],
      incomeStreams: []
    });

    return { ok: true };
  }

  /* ──────────────────────────────────────────────────────────
     PROYEKT BAŞLAT
  ────────────────────────────────────────────────────────── */
  function startProject(state, businessId, projectId) {
    const biz = state.businesses.find(b => b.id === businessId);
    if (!biz) return { ok: false, msg: "Biznes tapılmadı" };

    const proj = getProject(biz.typeId, projectId);
    if (!proj) return { ok: false, msg: "Proyekt tapılmadı" };

    const primary = getPrimaryCard();
    if (primary.balance < proj.costToBuild)
      return { ok: false, msg: "Kifayət qədər balans yoxdur" };

    primary.balance -= proj.costToBuild;
    addTransaction(`${proj.name} başladıldı`, proj.costToBuild, "out", "BUSINESS");

    const endDay = state.day + proj.durationDays;

    const entry = {
      id: uid(),
      projectId: proj.id,
      startDay: state.day,
      endDay,
      costPaid: proj.costToBuild,
      status: "building"
    };

    // Units deliverable üçün
    if (proj.deliverable === "units") {
      entry.units = Array.from({ length: proj.unitCount }, (_, i) => ({
        id: uid(),
        idx: i + 1,
        status: "unsold"
      }));
    }

    biz.activeProjects.push(entry);
    return { ok: true, endDay };
  }

  /* ──────────────────────────────────────────────────────────
     PROYEKT SATIŞI (sell deliverable)
  ────────────────────────────────────────────────────────── */
  function sellProject(state, businessId, projectEntryId) {
    const biz = state.businesses.find(b => b.id === businessId);
    if (!biz) return { ok: false, msg: "Tapılmadı" };
    const entry = biz.activeProjects.find(e => e.id === projectEntryId);
    if (!entry || entry.status !== "ready") return { ok: false, msg: "Proyekt hazır deyil" };

    const proj = getProject(biz.typeId, entry.projectId);
    const primary = getPrimaryCard();
    primary.balance += proj.sellValue;
    addTransaction(`${proj.name} satıldı`, proj.sellValue, "in", "BUSINESS");

    entry.status = "completed";
    biz.activeProjects = biz.activeProjects.filter(e => e.id !== projectEntryId);
    return { ok: true, earned: proj.sellValue };
  }

  /* ──────────────────────────────────────────────────────────
     UNIT SAT (units deliverable)
  ────────────────────────────────────────────────────────── */
  function sellUnit(state, businessId, projectEntryId, unitId) {
    const biz = state.businesses.find(b => b.id === businessId);
    const entry = biz?.activeProjects.find(e => e.id === projectEntryId);
    const unit = entry?.units?.find(u => u.id === unitId);
    if (!unit || unit.status !== "unsold") return { ok: false, msg: "Unit satıla bilməz" };
    if (entry.status !== "ready") return { ok: false, msg: "Proyekt hələ hazır deyil" };

    const proj = getProject(biz.typeId, entry.projectId);
    const primary = getPrimaryCard();
    primary.balance += proj.unitSellValue;
    addTransaction(`${proj.name} — Unit #${unit.idx} satıldı`, proj.unitSellValue, "in", "BUSINESS");

    unit.status = "sold";
    _checkAllUnitsComplete(biz, entry, proj);
    return { ok: true, earned: proj.unitSellValue };
  }

  /* ──────────────────────────────────────────────────────────
     UNIT KİRAYƏ VER (units deliverable)
  ────────────────────────────────────────────────────────── */
  function rentUnit(state, businessId, projectEntryId, unitId) {
    const biz = state.businesses.find(b => b.id === businessId);
    const entry = biz?.activeProjects.find(e => e.id === projectEntryId);
    const unit = entry?.units?.find(u => u.id === unitId);
    if (!unit || unit.status !== "unsold") return { ok: false, msg: "Unit kirayə verilə bilməz" };
    if (entry.status !== "ready") return { ok: false, msg: "Proyekt hələ hazır deyil" };

    const proj = getProject(biz.typeId, entry.projectId);
    unit.status = "rented";
    unit.weeklyRent = proj.unitRentalWeekly;

    // incomeStream əlavə et
    biz.incomeStreams.push({
      id: uid(),
      label: `${proj.name} — Unit #${unit.idx} kirayə`,
      weeklyIncome: proj.unitRentalWeekly,
      startDay: state.day,
      sourceType: "unit",
      projectEntryId,
      unitId
    });

    addTransaction(`${proj.name} — Unit #${unit.idx} kirayəyə verildi`, 0, "in", "BUSINESS");
    _checkAllUnitsComplete(biz, entry, proj);
    return { ok: true };
  }

  function _checkAllUnitsComplete(biz, entry, proj) {
    if (!entry.units) return;
    const allDone = entry.units.every(u => u.status !== "unsold");
    if (allDone) entry.status = "completed";
  }

  /* ──────────────────────────────────────────────────────────
     GÜN KEÇ — proyektləri yoxla, gəlir ver
  ────────────────────────────────────────────────────────── */
  function processDay(state) {
    if (!state.businesses) return;

    state.businesses.forEach(biz => {
      // Building → Ready
      biz.activeProjects.forEach(entry => {
        if (entry.status === "building" && state.day >= entry.endDay) {
          entry.status = "ready";
          const proj = getProject(biz.typeId, entry.projectId);
          const type = getType(biz.typeId);
          showToast(`✅ ${type.name}: ${proj.name} hazırdır!`);

          // income deliverable → dərhal incomeStream başlat
          if (proj.deliverable === "income") {
            biz.incomeStreams.push({
              id: uid(),
              label: proj.name,
              weeklyIncome: proj.weeklyIncome,
              startDay: state.day,
              sourceType: "project",
              projectEntryId: entry.id
            });
            entry.status = "completed"; // auto-complete
            biz.activeProjects = biz.activeProjects.filter(e => e.id !== entry.id);
          }
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     HƏFTƏLIK GƏLİR
  ────────────────────────────────────────────────────────── */
  function processWeeklyIncome(state) {
    if (!state.businesses) return;
    let totalEarned = 0;

    state.businesses.forEach(biz => {
      biz.incomeStreams.forEach(stream => {
        const primary = getPrimaryCard();
        primary.balance += stream.weeklyIncome;
        addTransaction(stream.label + " (həftəlik)", stream.weeklyIncome, "in", "BUSINESS");
        totalEarned += stream.weeklyIncome;
      });
    });

    if (totalEarned > 0) {
      showToast(`💼 Biznes gəliri: +${fmtMoney(totalEarned)}`);
    }
  }

  /* ──────────────────────────────────────────────────────────
     STATS
  ────────────────────────────────────────────────────────── */
  function getTotalWeeklyIncome(state) {
    if (!state.businesses) return 0;
    return state.businesses.reduce((sum, biz) =>
      sum + biz.incomeStreams.reduce((s, st) => s + st.weeklyIncome, 0), 0);
  }

  function getTotalInvested(state) {
    if (!state.businesses) return 0;
    return state.businesses.reduce((sum, biz) =>
      sum + biz.activeProjects.reduce((s, e) => s + (e.status === "building" ? e.costPaid : 0), 0), 0);
  }

  return {
    unlockBusiness,
    startProject,
    sellProject,
    sellUnit,
    rentUnit,
    processDay,
    processWeeklyIncome,
    getTotalWeeklyIncome,
    getTotalInvested,
    getType,
    getProject
  };
})();
