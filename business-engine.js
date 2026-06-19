// business-engine.js
// Tələb: business-data.js əvvəlcədən yüklənmiş olmalıdır (BIZ_COMPANY_TYPES mövcud olmalıdır)

// ─── Köməkçi: tip tapma ─────────────────────────────────────────────────────
function getType(typeId) {
  return BIZ_COMPANY_TYPES.find(t => t.id === typeId) || null;
}

// ─── Köməkçi: timestamp-dən gün hesabı ────────────────────────────────────
function daysBetween(tsA, tsB) {
  return (tsB - tsA) / (1000 * 60 * 60 * 24);
}

// ─── Biznes açma ───────────────────────────────────────────────────────────
/**
 * primary = oyun state-i (primary.balance, primary.businesses = [])
 * typeId  = açılacaq biznes tipi
 */
function unlockBusiness(primary, typeId) {
  const type = getType(typeId);
  if (!type) return { ok: false, msg: "Bilinməyən biznes tipi" };

  // Artıq açıqdır?
  if (primary.businesses && primary.businesses.find(b => b.typeId === typeId)) {
    return { ok: false, msg: "Bu biznes artıq açıqdır" };
  }

  // Balans yoxlaması (unlockCost)
  if (primary.balance < type.unlockCost) {
    return { ok: false, msg: "Açılış üçün kifayət qədər balans yoxdur" };
  }

  // Tələb olunan minimum balans yoxlaması
  if (primary.balance < type.requiredBalance) {
    return { ok: false, msg: "Kifayət qədər bank balansı yoxdur" };
  }

  primary.balance -= type.unlockCost;

  if (!primary.businesses) primary.businesses = [];
  primary.businesses.push({
    typeId,
    name: type.name,
    unlockedAt: Date.now(),
    activeProjects: [],   // { projectId, startedAt, deliverable, ... }
    completedPlatforms: [] // course_platform deliverable üçün
  });

  return { ok: true, msg: `${type.name} uğurla açıldı` };
}

// ─── Proyekt başlatma ───────────────────────────────────────────────────────
/**
 * primary   = oyun state-i
 * typeId    = biznes tipi id-si
 * projectId = proyekt id-si
 */
function startProject(primary, typeId, projectId) {
  const type = getType(typeId);
  if (!type) return { ok: false, msg: "Bilinməyən biznes tipi" };

  const biz = primary.businesses && primary.businesses.find(b => b.typeId === typeId);
  if (!biz) return { ok: false, msg: "Bu biznes açılmayıb" };

  const proj = type.projects.find(p => p.id === projectId);
  if (!proj) return { ok: false, msg: "Bilinməyən proyekt" };

  // Limit yoxlaması (enerji şirkəti üçün limit yoxdur)
  if (!type.noProjectLimit) {
    const alreadyRunning = biz.activeProjects.filter(ap => ap.projectId === projectId);
    if (alreadyRunning.length > 0) {
      return { ok: false, msg: "Bu proyekt artıq davam edir" };
    }
  }

  if (primary.balance < proj.costToBuild) {
    return { ok: false, msg: "Proyekt üçün kifayət qədər balans yoxdur" };
  }

  primary.balance -= proj.costToBuild;

  biz.activeProjects.push({
    projectId,
    name: proj.name,
    deliverable: proj.deliverable,
    startedAt: Date.now(),
    durationMs: proj.durationDays * 24 * 60 * 60 * 1000,
    // sell
    sellValue: proj.sellValue || null,
    // income
    weeklyIncome: proj.weeklyIncome || null,
    lastIncomeCollected: proj.deliverable === "income" ? Date.now() : null,
    // units
    unitCount: proj.unitCount || null,
    unitSellValue: proj.unitSellValue || null,
    unitRentalWeekly: proj.unitRentalWeekly || null,
    canTransferToRE: proj.canTransferToRE || false,
    // course_platform
    maxCourses: proj.maxCourses || null,
    courseConfig: proj.courseConfig || null,
    completed: false
  });

  return { ok: true, msg: `${proj.name} başladıldı` };
}

// ─── Proyekti tamamla / satış al ────────────────────────────────────────────
/**
 * Hər oyun tick-ında (məsələn timer ilə) çağırılır.
 * Tamamlanmış proyektləri işləyir.
 */
function tickProjects(primary) {
  if (!primary.businesses) return;
  const now = Date.now();

  for (const biz of primary.businesses) {
    const type = getType(biz.typeId);

    // Active proyektlər
    for (const ap of biz.activeProjects) {
      const elapsed = now - ap.startedAt;

      if (!ap.completed && elapsed >= ap.durationMs) {
        ap.completed = true;

        if (ap.deliverable === "sell") {
          // Birdəfəlik satış
          primary.balance += ap.sellValue;
          // Bu proyekti active listdən sil
          _removeActiveProject(biz, ap);
        }
        else if (ap.deliverable === "units") {
          // unit sistemi — tamamlandı, satış/kirayə seçimi player-a verilir
          ap.completedAt = now;
        }
        else if (ap.deliverable === "income") {
          // income-generatingdır — silinmir, hər həftə qazanc verir
          ap.completedAt = now;
        }
        else if (ap.deliverable === "course_platform") {
          // Kurs platforması tamamlandı — completedPlatforms-a əlavə et
          biz.completedPlatforms.push({
            projectId: ap.projectId,
            name: ap.name,
            completedAt: now,
            maxCourses: ap.maxCourses,
            courseConfig: ap.courseConfig,
            activeCourses: [],   // { courseId, startedAt, durationMs, revenue, collected }
            finishedCourses: []  // bitmiş, qazancı alınmamış kurslar
          });
          _removeActiveProject(biz, ap);
        }
      }

      // Income toplama (hər həftə)
      if (ap.deliverable === "income" && ap.completed) {
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const weeksPassed = Math.floor((now - ap.lastIncomeCollected) / weekMs);
        if (weeksPassed > 0) {
          primary.balance += ap.weeklyIncome * weeksPassed;
          ap.lastIncomeCollected += weeksPassed * weekMs;
        }
      }

      // Units kirayə toplama
      if (ap.deliverable === "units" && ap.completed && ap.unitsRented) {
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        if (!ap.lastRentalCollected) ap.lastRentalCollected = ap.completedAt;
        const weeksPassed = Math.floor((now - ap.lastRentalCollected) / weekMs);
        if (weeksPassed > 0) {
          const rentedCount = ap.unitsRented || 0;
          primary.balance += rentedCount * ap.unitRentalWeekly * weeksPassed;
          ap.lastRentalCollected += weeksPassed * weekMs;
        }
      }
    }

    // Tamamlanmış platformlardakı kurslar
    for (const platform of biz.completedPlatforms) {
      const finishedNow = [];
      for (const course of platform.activeCourses) {
        const elapsed = now - course.startedAt;
        if (elapsed >= course.durationMs && !course.finished) {
          course.finished = true;
          finishedNow.push(course);
        }
      }
      // Bitmiş kursları finishedCourses-a daşı
      for (const fc of finishedNow) {
        platform.activeCourses = platform.activeCourses.filter(c => c.courseId !== fc.courseId);
        platform.finishedCourses.push(fc);
      }
    }
  }
}

// ─── Units: satış ──────────────────────────────────────────────────────────
function sellUnits(primary, typeId, projectInstanceIndex, count) {
  const biz = _getBiz(primary, typeId);
  if (!biz) return { ok: false, msg: "Biznes tapılmadı" };

  const ap = biz.activeProjects.filter(p => p.deliverable === "units")[projectInstanceIndex];
  if (!ap || !ap.completed) return { ok: false, msg: "Proyekt tamamlanmayıb" };

  const available = ap.unitCount - (ap.unitsSold || 0) - (ap.unitsRented || 0);
  if (count > available) return { ok: false, msg: "Kifayət qədər unit yoxdur" };

  primary.balance += count * ap.unitSellValue;
  ap.unitsSold = (ap.unitsSold || 0) + count;
  _cleanupUnitsIfDone(biz, ap);

  return { ok: true, msg: `${count} unit satıldı` };
}

// ─── Units: kirayəyə ver ────────────────────────────────────────────────────
function rentUnits(primary, typeId, projectInstanceIndex, count) {
  const biz = _getBiz(primary, typeId);
  if (!biz) return { ok: false, msg: "Biznes tapılmadı" };

  const ap = biz.activeProjects.filter(p => p.deliverable === "units")[projectInstanceIndex];
  if (!ap || !ap.completed) return { ok: false, msg: "Proyekt tamamlanmayıb" };

  const available = ap.unitCount - (ap.unitsSold || 0) - (ap.unitsRented || 0);
  if (count > available) return { ok: false, msg: "Kifayət qədər unit yoxdur" };

  ap.unitsRented = (ap.unitsRented || 0) + count;
  ap.lastRentalCollected = Date.now();

  return { ok: true, msg: `${count} unit kirayəyə verildi` };
}

// ─── Kurs əlavə et ─────────────────────────────────────────────────────────
/**
 * typeId      = biznes tipi (university)
 * platformIdx = completedPlatforms massivindəki index
 */
function addCourse(primary, typeId, platformIdx) {
  const biz = _getBiz(primary, typeId);
  if (!biz) return { ok: false, msg: "Biznes tapılmadı" };

  const platform = biz.completedPlatforms[platformIdx];
  if (!platform) return { ok: false, msg: "Platform tapılmadı" };

  const cfg = platform.courseConfig;
  const activeCount = platform.activeCourses.length;
  const finishedUncollected = platform.finishedCourses.length;

  if (activeCount + finishedUncollected >= platform.maxCourses) {
    return { ok: false, msg: `Maksimum kurs limitinə çatıldı (${platform.maxCourses})` };
  }

  if (primary.balance < cfg.courseCost) {
    return { ok: false, msg: "Kurs üçün kifayət qədər balans yoxdur" };
  }

  primary.balance -= cfg.courseCost;

  const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  platform.activeCourses.push({
    courseId,
    startedAt: Date.now(),
    durationMs: cfg.courseDuration * 24 * 60 * 60 * 1000,
    revenue: cfg.courseRevenue,
    finished: false
  });

  return { ok: true, msg: "Kurs əlavə edildi", courseId };
}

// ─── Bitmiş kursun qazancını al ─────────────────────────────────────────────
function collectCourseRevenue(primary, typeId, platformIdx, courseId) {
  const biz = _getBiz(primary, typeId);
  if (!biz) return { ok: false, msg: "Biznes tapılmadı" };

  const platform = biz.completedPlatforms[platformIdx];
  if (!platform) return { ok: false, msg: "Platform tapılmadı" };

  const courseIdx = platform.finishedCourses.findIndex(c => c.courseId === courseId);
  if (courseIdx === -1) return { ok: false, msg: "Kurs tapılmadı və ya hələ bitməyib" };

  const course = platform.finishedCourses[courseIdx];
  primary.balance += course.revenue;
  platform.finishedCourses.splice(courseIdx, 1);

  return { ok: true, msg: `Kurs qazancı alındı: ${course.revenue.toLocaleString()} ₼` };
}

// ─── Biznes statusu ─────────────────────────────────────────────────────────
function getBusinessStatus(primary, typeId) {
  const biz = _getBiz(primary, typeId);
  if (!biz) return null;
  const type = getType(typeId);
  return { biz, type };
}

// ─── Bütün bizneslərin özeti ─────────────────────────────────────────────────
function getAllBusinessSummary(primary) {
  if (!primary.businesses || primary.businesses.length === 0) return [];
  return primary.businesses.map(biz => {
    const type = getType(biz.typeId);
    return {
      typeId: biz.typeId,
      name: biz.name,
      activeProjectCount: biz.activeProjects.length,
      completedPlatformCount: biz.completedPlatforms.length
    };
  });
}

// ─── İçi köməkçilər ────────────────────────────────────────────────────────
function _getBiz(primary, typeId) {
  return primary.businesses && primary.businesses.find(b => b.typeId === typeId);
}

function _removeActiveProject(biz, ap) {
  biz.activeProjects = biz.activeProjects.filter(p => p !== ap);
}

function _cleanupUnitsIfDone(biz, ap) {
  const total = ap.unitCount;
  const sold = ap.unitsSold || 0;
  const rented = ap.unitsRented || 0;
  if (sold + rented >= total) {
    _removeActiveProject(biz, ap);
  }
}
