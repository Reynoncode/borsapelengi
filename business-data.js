// business-data.js

const BIZ_COMPANY_TYPES = [
  {
    id: "construction",
    name: "🏗️ Tikinti Şirkəti",
    unlockCost: 200000,
    requiredBalance: 500000,
    projects: [
      {
        id: "hayat_evi",
        name: "Həyət Evi",
        costToBuild: 80000,
        durationDays: 14,
        sellValue: 140000,
        deliverable: "sell"
      },
      {
        id: "villa",
        name: "Villa",
        costToBuild: 400000,
        durationDays: 21,
        sellValue: 720000,
        deliverable: "sell"
      },
      {
        id: "menzil_binasi",
        name: "Mənzil Binası (10 unit)",
        costToBuild: 3000000,
        durationDays: 28,
        unitCount: 10,
        unitSellValue: 350000,
        unitRentalWeekly: 8000,
        deliverable: "units",
        canTransferToRE: true
      }
    ]
  },

  {
    id: "technology",
    name: "💡 Texnologiya Şirkəti",
    unlockCost: 80000,
    requiredBalance: 500000,
    projects: [
      {
        id: "mobil_tetbiq",
        name: "Mobil Tətbiq",
        costToBuild: 50000,
        durationDays: 7,
        sellValue: 90000,
        deliverable: "sell"
      },
      {
        id: "saas_platform",
        name: "SaaS Platforması",
        costToBuild: 1000000,
        durationDays: 21,
        weeklyIncome: 80000,
        deliverable: "income"
      },
      {
        id: "ai_mehsul",
        name: "AI Məhsulu",
        costToBuild: 2000000,
        durationDays: 35,
        sellValue: 8000000,
        deliverable: "sell"
      },
      {
        id: "data_merkezi",
        name: "Data Mərkəzi",
        costToBuild: 10000000,
        durationDays: 60,
        weeklyIncome: 800000,
        deliverable: "income"
      }
    ]
  },

  {
    id: "pharma",
    name: "💊 Dərman Firması",
    unlockCost: 600000,
    requiredBalance: 2000000,
    projects: [
      {
        id: "agrikesici",
        name: "Ağrıkəsici Seriya",
        costToBuild: 120000,
        durationDays: 7,
        sellValue: 200000,
        deliverable: "sell"
      },
      {
        id: "antibiotik",
        name: "Antibiotik Partiyası",
        costToBuild: 400000,
        durationDays: 14,
        sellValue: 750000,
        deliverable: "sell"
      },
      {
        id: "vaksin",
        name: "Vaksin İstehsalı",
        costToBuild: 2000000,
        durationDays: 30,
        sellValue: 5000000,
        deliverable: "sell"
      }
    ]
  },

  {
    id: "auto_factory",
    name: "🚗 Avtomobil Zavodu",
    unlockCost: 5000000,
    requiredBalance: 25000000,
    projects: [
      {
        id: "sedan",
        name: "Sedan (50 ədəd)",
        costToBuild: 800000,
        durationDays: 14,
        sellValue: 1500000,
        deliverable: "sell"
      },
      {
        id: "suv",
        name: "SUV (30 ədəd)",
        costToBuild: 2000000,
        durationDays: 21,
        sellValue: 4000000,
        deliverable: "sell"
      },
      {
        id: "elektrik",
        name: "Elektrik (20 ədəd)",
        costToBuild: 5000000,
        durationDays: 28,
        sellValue: 11000000,
        deliverable: "sell"
      },
      {
        id: "luks",
        name: "Lüks (5 ədəd)",
        costToBuild: 8000000,
        durationDays: 35,
        sellValue: 20000000,
        deliverable: "sell"
      }
    ]
  },

  {
    id: "energy",
    name: "⚡ Enerji Şirkəti",
    unlockCost: 1000000,
    requiredBalance: 10000000,
    noProjectLimit: true, // eyni proyektdən istənilən qədər başlatmaq olar
    projects: [
      {
        id: "gunes_panel",
        name: "Günəş Paneli Ferması",
        costToBuild: 1200000,
        durationDays: 21,
        weeklyIncome: 90000,
        deliverable: "income"
      },
      {
        id: "kulekturbin",
        name: "Külək Turbinləri",
        costToBuild: 3000000,
        durationDays: 28,
        weeklyIncome: 220000,
        deliverable: "income"
      },
      {
        id: "atom_stansiya",
        name: "Mini Atom Elektrik Stansiyası",
        costToBuild: 25000000,
        durationDays: 120,
        weeklyIncome: 2500000,
        deliverable: "income"
      }
    ]
  },

  {
    id: "university",
    name: "🎓 Özəl Universitet",
    unlockCost: 2000000,
    requiredBalance: 8000000,
    projects: [
      {
        id: "online_kurs",
        name: "Online Kurs Platforması",
        costToBuild: 400000,
        durationDays: 14,
        deliverable: "course_platform",
        maxCourses: 10,
        courseConfig: {
          courseCost: 20000,
          courseDuration: 7,      // gün
          courseRevenue: 30000
        }
      },
      {
        id: "kicik_campus",
        name: "Kiçik Campus (500 nəfər)",
        costToBuild: 3000000,
        durationDays: 45,
        deliverable: "course_platform",
        maxCourses: 4,
        courseConfig: {
          courseCost: 100000,
          courseDuration: 28,     // gün
          courseRevenue: 300000
        }
      },
      {
        id: "boyuk_campus",
        name: "Böyük Campus (2000 nəfər)",
        costToBuild: 12000000,
        durationDays: 90,
        deliverable: "course_platform",
        maxCourses: 12,
        courseConfig: {
          courseCost: 400000,
          courseDuration: 28,     // gün
          courseRevenue: 1200000
        }
      }
    ]
  }
];
