// business-data.js

const BIZ_COMPANY_TYPES = [
  {
    id: "construction",
    name: "🏗️ Tikinti Şirkəti",
    icon: "🏗️",
    description: "Tikinti layihələri həyata keçir, əmlak satır",
    unlockCost: 200000,
    requiredBalance: 500000,
    projects: [
      {
        id: "hayat_evi",
        name: "Həyət Evi",
        icon: "🏠",
        description: "Kiçik həyət evi tikdirirsən",
        costToBuild: 80000,
        durationDays: 14,
        sellValue: 140000,
        deliverable: "sell"
      },
      {
        id: "villa",
        name: "Villa",
        icon: "🏡",
        description: "Lüks villa tikintisi",
        costToBuild: 400000,
        durationDays: 21,
        sellValue: 720000,
        deliverable: "sell"
      },
      {
        id: "menzil_binasi",
        name: "Mənzil Binası (10 unit)",
        icon: "🏢",
        description: "10 mənzilli bina tikdirirsən. Mənzilləri satmaq və ya kirayəyə vermək olar",
        costToBuild: 3000000,
        durationDays: 28,
        unitCount: 10,
        unitSellValue: 350000,
        unitRentalWeekly: 8000,
        deliverable: "units",
        canTransferToRE: true
      },
      {
        id: "ofis_merkezi",
        name: "Ofis Mərkəzi",
        icon: "🏬",
        description: "Ofis kompleksi tikib satmaq",
        costToBuild: 5000000,
        durationDays: 35,
        sellValue: 9500000,
        deliverable: "sell"
      },
      {
        id: "ticaret_merkezi",
        name: "Ticarət Mərkəzi",
        icon: "🛒",
        description: "20 mağazalı ticarət mərkəzi",
        costToBuild: 15000000,
        durationDays: 60,
        unitCount: 20,
        unitSellValue: 1200000,
        unitRentalWeekly: 40000,
        deliverable: "units",
        canTransferToRE: false
      }
    ]
  },

  {
    id: "technology",
    name: "💡 Texnologiya Şirkəti",
    icon: "💡",
    description: "Proqram məhsulları və texnologiya həlləri",
    unlockCost: 80000,
    requiredBalance: 500000,
    projects: [
      {
        id: "mobil_tetbiq",
        name: "Mobil Tətbiq",
        icon: "📱",
        description: "iOS və Android üçün mobil tətbiq",
        costToBuild: 50000,
        durationDays: 7,
        sellValue: 90000,
        deliverable: "sell"
      },
      {
        id: "saas_platform",
        name: "SaaS Platforması",
        icon: "☁️",
        description: "Abunəlik əsaslı proqram platforması",
        costToBuild: 1000000,
        durationDays: 21,
        weeklyIncome: 80000,
        deliverable: "income"
      },
      {
        id: "ai_mehsul",
        name: "AI Məhsulu",
        icon: "🤖",
        description: "Süni intellekt əsaslı məhsul",
        costToBuild: 2000000,
        durationDays: 35,
        sellValue: 8000000,
        deliverable: "sell"
      },
      {
        id: "data_merkezi",
        name: "Data Mərkəzi",
        icon: "🖥️",
        description: "Böyük miqyaslı server və data infrastrukturu",
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
    icon: "💊",
    description: "Dərman istehsalı və satışı",
    unlockCost: 600000,
    requiredBalance: 2000000,
    projects: [
      {
        id: "agrikesici",
        name: "Ağrıkəsici Seriya",
        icon: "💉",
        description: "Kütləvi ağrıkəsici istehsalı",
        costToBuild: 120000,
        durationDays: 7,
        sellValue: 200000,
        deliverable: "sell"
      },
      {
        id: "antibiotik",
        name: "Antibiotik Partiyası",
        icon: "🧬",
        description: "Antibiotik istehsal partiyası",
        costToBuild: 400000,
        durationDays: 14,
        sellValue: 750000,
        deliverable: "sell"
      },
      {
        id: "vaksin",
        name: "Vaksin İstehsalı",
        icon: "🔬",
        description: "Böyük miqyaslı vaksin istehsalı",
        costToBuild: 2000000,
        durationDays: 30,
        sellValue: 5000000,
        deliverable: "sell"
      },
      {
        id: "yeni_derman_rd",
        name: "Yeni Dərman R&D",
        icon: "🧪",
        description: "Yeni dərman tədqiqat & inkişaf",
        costToBuild: 5000000,
        durationDays: 45,
        sellValue: 12000000,
        deliverable: "sell"
      }
    ]
  },

  {
    id: "auto_factory",
    name: "🚗 Avtomobil Zavodu",
    icon: "🚗",
    description: "Avtomobil istehsalı və satışı",
    unlockCost: 5000000,
    requiredBalance: 25000000,
    projects: [
      {
        id: "sedan",
        name: "Sedan (50 ədəd)",
        icon: "🚙",
        description: "50 ədəd sedan avtomobil istehsalı",
        costToBuild: 800000,
        durationDays: 14,
        sellValue: 1500000,
        deliverable: "sell"
      },
      {
        id: "suv",
        name: "SUV (30 ədəd)",
        icon: "🚐",
        description: "30 ədəd SUV istehsalı",
        costToBuild: 2000000,
        durationDays: 21,
        sellValue: 4000000,
        deliverable: "sell"
      },
      {
        id: "elektrik",
        name: "Elektrik (20 ədəd)",
        icon: "⚡",
        description: "20 ədəd elektrik avtomobil istehsalı",
        costToBuild: 5000000,
        durationDays: 28,
        sellValue: 11000000,
        deliverable: "sell"
      },
      {
        id: "luks",
        name: "Lüks (5 ədəd)",
        icon: "🏎️",
        description: "5 ədəd lüks avtomobil istehsalı",
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
    icon: "⚡",
    description: "Bərpa olunan enerji istehsalı",
    unlockCost: 1000000,
    requiredBalance: 10000000,
    noProjectLimit: true,
    projects: [
      {
        id: "gunes_panel",
        name: "Günəş Paneli Ferması",
        icon: "☀️",
        description: "Günəş enerjisi istehsal ferması",
        costToBuild: 1200000,
        durationDays: 21,
        weeklyIncome: 90000,
        deliverable: "income"
      },
      {
        id: "kulekturbin",
        name: "Külək Turbinləri",
        icon: "🌬️",
        description: "Külək enerjisi turbinləri kompleksi",
        costToBuild: 3000000,
        durationDays: 28,
        weeklyIncome: 220000,
        deliverable: "income"
      },
      {
        id: "atom_stansiya",
        name: "Mini Atom Elektrik Stansiyası",
        icon: "⚛️",
        description: "Kiçik miqyaslı nüvə elektrik stansiyası",
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
    icon: "🎓",
    description: "Təhsil platformaları və campus idarəsi",
    unlockCost: 2000000,
    requiredBalance: 8000000,
    projects: [
      {
        id: "online_kurs",
        name: "Online Kurs Platforması",
        icon: "💻",
        description: "Onlayn təhsil platforması qur",
        costToBuild: 400000,
        durationDays: 14,
        deliverable: "course_platform",
        maxCourses: 10,
        courseConfig: {
          courseCost: 20000,
          courseDuration: 7,
          courseRevenue: 30000
        }
      },
      {
        id: "kicik_campus",
        name: "Kiçik Campus (500 nəfər)",
        icon: "🏫",
        description: "500 nəfərlik kiçik universitet campusu",
        costToBuild: 3000000,
        durationDays: 45,
        deliverable: "course_platform",
        maxCourses: 4,
        courseConfig: {
          courseCost: 100000,
          courseDuration: 28,
          courseRevenue: 300000
        }
      },
      {
        id: "boyuk_campus",
        name: "Böyük Campus (2000 nəfər)",
        icon: "🏛️",
        description: "2000 nəfərlik böyük universitet campusu",
        costToBuild: 12000000,
        durationDays: 90,
        deliverable: "course_platform",
        maxCourses: 12,
        courseConfig: {
          courseCost: 400000,
          courseDuration: 28,
          courseRevenue: 1200000
        }
      }
    ]
  }
];
