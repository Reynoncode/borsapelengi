/* ============================================================
   BUSINESS-DATA.JS — Biznes növləri və proyektlər
   ============================================================ */

const BIZ_COMPANY_TYPES = [

  /* ──── 1. TİKİNTİ ──── */
  {
    id: "construction",
    name: "Tikinti Şirkəti",
    icon: "🏗️",
    color: "#E8A33D",
    description: "Ev, bina, villa tikib satmaq",
    unlockCost: 50000,           // şirkəti qurmaq xərci
    projects: [
      {
        id: "c_cottage",
        name: "Həyət Evi",
        icon: "🏡",
        costToBuild: 50000,
        durationDays: 14,
        sellValue: 80000,
        description: "Kiçik həyət evi tikdirirsən",
        deliverable: "sell",     // sell | units | rental
        canTransferToRE: false
      },
      {
        id: "c_villa",
        name: "Villa",
        icon: "🏘️",
        costToBuild: 180000,
        durationDays: 21,
        sellValue: 310000,
        description: "Lüks villa tikintisi",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "c_apartment",
        name: "Mənzil Binası (10 mənzil)",
        icon: "🏢",
        costToBuild: 2000000,
        durationDays: 28,
        sellValue: null,
        unitCount: 10,
        unitSellValue: 300000,
        unitRentalWeekly: 20000,
        description: "10 mənzilli bina tikdirirsən. Mənzilləri satmaq və ya kirayəyə vermək olar",
        deliverable: "units",
        canTransferToRE: true
      },
      {
        id: "c_office",
        name: "Ofis Mərkəzi",
        icon: "🏬",
        costToBuild: 5000000,
        durationDays: 35,
        sellValue: 9500000,
        description: "Ofis kompleksi tikib satmaq",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "c_mall",
        name: "Ticarət Mərkəzi",
        icon: "🏪",
        costToBuild: 15000000,
        durationDays: 60,
        sellValue: null,
        unitCount: 20,
        unitSellValue: 1200000,
        unitRentalWeekly: 80000,
        description: "20 mağazalı ticarət mərkəzi",
        deliverable: "units",
        canTransferToRE: true
      }
    ]
  },

  /* ──── 2. DƏRMAN FİRMASI ──── */
  {
    id: "pharma",
    name: "Dərman Firması",
    icon: "💊",
    color: "#5AA9FF",
    description: "Dərman istehsalı və satışı",
    unlockCost: 200000,
    projects: [
      {
        id: "p_painkiller",
        name: "Ağrıkəsici Seriya",
        icon: "💉",
        costToBuild: 80000,
        durationDays: 7,
        sellValue: 130000,
        description: "Kütləvi ağrıkəsici istehsalı",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "p_antibiotic",
        name: "Antibiotik Partiyası",
        icon: "🧬",
        costToBuild: 250000,
        durationDays: 14,
        sellValue: 480000,
        description: "Antibiotik istehsal partiyası",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "p_vaccine",
        name: "Vaksin İstehsalı",
        icon: "🔬",
        costToBuild: 1500000,
        durationDays: 30,
        sellValue: 3200000,
        description: "Böyük miqyaslı vaksin istehsalı",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "p_research",
        name: "Yeni Dərman R&D",
        icon: "🧪",
        costToBuild: 5000000,
        durationDays: 45,
        sellValue: 12000000,
        description: "Yeni dərman tədqiqat & inkişaf",
        deliverable: "sell",
        canTransferToRE: false
      }
    ]
  },

  /* ──── 3. MASİN İSTEHSALI ──── */
  {
    id: "auto",
    name: "Avtomobil Zavodu",
    icon: "🚗",
    color: "#C99CFF",
    description: "Avtomobil istehsalı və satışı",
    unlockCost: 500000,
    projects: [
      {
        id: "a_sedan",
        name: "Sedan Seriyası (50 ədəd)",
        icon: "🚘",
        costToBuild: 500000,
        durationDays: 14,
        sellValue: 900000,
        description: "50 ədəd sedan istehsalı",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "a_suv",
        name: "SUV Seriyası (30 ədəd)",
        icon: "🚙",
        costToBuild: 1200000,
        durationDays: 21,
        sellValue: 2400000,
        description: "30 ədəd SUV istehsalı",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "a_electric",
        name: "Elektrik Avtomobil (20 ədəd)",
        icon: "⚡",
        costToBuild: 3000000,
        durationDays: 28,
        sellValue: 6500000,
        description: "20 ədəd elektrik avtomobil",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "a_luxury",
        name: "Lüks Avtomobil (5 ədəd)",
        icon: "🏎️",
        costToBuild: 8000000,
        durationDays: 35,
        sellValue: 20000000,
        description: "5 ədəd ultra lüks avtomobil",
        deliverable: "sell",
        canTransferToRE: false
      }
    ]
  },

  /* ──── 4. UNİVERSİTET ──── */
  {
    id: "university",
    name: "Özəl Universitet",
    icon: "🎓",
    color: "#1FD67A",
    description: "Təhsil müəssisəsi, davamlı gəlir",
    unlockCost: 3000000,
    projects: [
      {
        id: "u_campus_small",
        name: "Kiçik Campus (500 tələbə)",
        icon: "🏫",
        costToBuild: 3000000,
        durationDays: 45,
        sellValue: null,
        weeklyIncome: 200000,
        description: "500 tələbəlik kampus, həftəlik gəlir",
        deliverable: "income",
        canTransferToRE: false
      },
      {
        id: "u_campus_large",
        name: "Böyük Campus (2000 tələbə)",
        icon: "🏛️",
        costToBuild: 12000000,
        durationDays: 90,
        sellValue: null,
        weeklyIncome: 900000,
        description: "2000 tələbəlik kampus, böyük gəlir",
        deliverable: "income",
        canTransferToRE: false
      },
      {
        id: "u_online",
        name: "Online Kurs Platforması",
        icon: "💻",
        costToBuild: 500000,
        durationDays: 14,
        sellValue: null,
        weeklyIncome: 50000,
        description: "Onlayn kurs platforması",
        deliverable: "income",
        canTransferToRE: false
      }
    ]
  },

  /* ──── 5. ENERJI ──── */
  {
    id: "energy",
    name: "Enerji Şirkəti",
    icon: "⚡",
    color: "#FF8C42",
    description: "Elektrik istehsalı, davamlı gəlir",
    unlockCost: 1000000,
    projects: [
      {
        id: "e_solar",
        name: "Günəş Paneli Fermasi",
        icon: "☀️",
        costToBuild: 1000000,
        durationDays: 21,
        sellValue: null,
        weeklyIncome: 80000,
        description: "Günəş enerjisi ferması",
        deliverable: "income",
        canTransferToRE: false
      },
      {
        id: "e_wind",
        name: "Külək Turbinləri",
        icon: "🌬️",
        costToBuild: 2500000,
        durationDays: 28,
        sellValue: null,
        weeklyIncome: 200000,
        description: "10 külək turbini kompleksi",
        deliverable: "income",
        canTransferToRE: false
      },
      {
        id: "e_nuclear",
        name: "Mini Atom Elektrik St.",
        icon: "☢️",
        costToBuild: 20000000,
        durationDays: 120,
        sellValue: null,
        weeklyIncome: 2000000,
        description: "Mini nüvə elektrik stansiyası",
        deliverable: "income",
        canTransferToRE: false
      }
    ]
  },

  /* ──── 6. TEXNOLOGİYA ──── */
  {
    id: "tech",
    name: "Texnologiya Şirkəti",
    icon: "💡",
    color: "#FF4C5E",
    description: "Software və hardware məhsulları",
    unlockCost: 100000,
    projects: [
      {
        id: "t_app",
        name: "Mobil Tətbiq İnkişafı",
        icon: "📱",
        costToBuild: 50000,
        durationDays: 7,
        sellValue: 90000,
        description: "Mobil tətbiq hazırla, sat",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "t_saas",
        name: "SaaS Platforması",
        icon: "☁️",
        costToBuild: 300000,
        durationDays: 21,
        sellValue: null,
        weeklyIncome: 30000,
        description: "Abunə əsaslı SaaS platforması",
        deliverable: "income",
        canTransferToRE: false
      },
      {
        id: "t_ai",
        name: "AI Məhsulu",
        icon: "🤖",
        costToBuild: 2000000,
        durationDays: 35,
        sellValue: 8000000,
        description: "AI əsaslı məhsul işlə, sat",
        deliverable: "sell",
        canTransferToRE: false
      },
      {
        id: "t_datacenter",
        name: "Data Mərkəzi",
        icon: "🖥️",
        costToBuild: 10000000,
        durationDays: 60,
        sellValue: null,
        weeklyIncome: 800000,
        description: "Böyük data mərkəzi, davamlı gəlir",
        deliverable: "income",
        canTransferToRE: false
      }
    ]
  }
];
