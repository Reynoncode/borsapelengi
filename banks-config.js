/* ============================================================
   BANKS — Bank və Kart Kataloqu
   ============================================================
   Hər bank 3 kart tipi təklif edir: standard, gold, lux
   - standard: həmişə açıq (şəhərə bağlı görünürlük)
   - gold/lux: requiredNetWorth şərti ilə kilidli, subscriptionFee var

   countryId: bu kart hansı ölkədə "yerli bank" sayılır
   (TRAVEL-də o ölkəyə köçəndə həmin bankın kartları wallet-də əlçatan olur)
   ============================================================ */

const BANKS = [
  // ───────── AZƏRBAYCAN (başdan açıq) ─────────
  {
    id: "kapitan",
    name: "KapitanBank",
    countryId: "azerbaijan",
    color: "#1FD67A",
    cards: {
      standard: {
        tier: "standard",
        name: "KapitanBank Standart",
        weeklyFreeLimit: 10000,
        overLimitFeeRate: 0.005,      // 0.5%
        weeklyInterestRate: 0.0015,   // 0.15% həftəlik, cüzi
        vaultMonthlyRate: 0.10,       // xəzinə üçün aylıq 10%
        subscriptionFee: 0
      },
      gold: {
        tier: "gold",
        name: "KapitanBank Gold",
        requiredNetWorth: 100000,
        subscriptionFee: 25,          // həftəlik
        weeklyFreeLimit: 50000,
        overLimitFeeRate: 0.003,
        feeWaiveMinBalance: 200000,
        weeklyInterestRate: 0.006,
        vaultMonthlyRate: 0.12
      },
      lux: {
        tier: "lux",
        name: "KapitanBank Lux",
        requiredNetWorth: 1000000,
        subscriptionFee: 150,
        weeklyFreeLimit: null,        // limitsiz
        overLimitFeeRate: 0,
        feeWaiveMinBalance: null,
        weeklyInterestRate: 0.012,
        vaultMonthlyRate: 0.14
      }
    }
  },
  {
    id: "loe",
    name: "LoeBank",
    countryId: "azerbaijan",
    color: "#5AA9FF",
    cards: {
      standard: {
        tier: "standard",
        name: "LoeBank Standart",
        weeklyFreeLimit: 8000,
        overLimitFeeRate: 0.006,
        weeklyInterestRate: 0.001,
        vaultMonthlyRate: 0.10,
        subscriptionFee: 0
      },
      gold: {
        tier: "gold",
        name: "LoeBank Gold",
        requiredNetWorth: 100000,
        subscriptionFee: 20,
        weeklyFreeLimit: 45000,
        overLimitFeeRate: 0.0025,
        feeWaiveMinBalance: 180000,
        weeklyInterestRate: 0.007,
        vaultMonthlyRate: 0.13
      },
      lux: {
        tier: "lux",
        name: "LoeBank Lux",
        requiredNetWorth: 1000000,
        subscriptionFee: 140,
        weeklyFreeLimit: null,
        overLimitFeeRate: 0,
        feeWaiveMinBalance: null,
        weeklyInterestRate: 0.013,
        vaultMonthlyRate: 0.15
      }
    }
  },
  {
    id: "aab",
    name: "AAB",
    countryId: "azerbaijan",
    color: "#E8A33D",
    cards: {
      standard: {
        tier: "standard",
        name: "AAB Standart",
        weeklyFreeLimit: 12000,
        overLimitFeeRate: 0.004,
        weeklyInterestRate: 0.002,
        vaultMonthlyRate: 0.11,
        subscriptionFee: 0
      },
      gold: {
        tier: "gold",
        name: "AAB Gold",
        requiredNetWorth: 100000,
        subscriptionFee: 22,
        weeklyFreeLimit: 55000,
        overLimitFeeRate: 0.002,
        feeWaiveMinBalance: 220000,
        weeklyInterestRate: 0.0065,
        vaultMonthlyRate: 0.12
      },
      lux: {
        tier: "lux",
        name: "AAB Lux",
        requiredNetWorth: 1000000,
        subscriptionFee: 145,
        weeklyFreeLimit: null,
        overLimitFeeRate: 0,
        feeWaiveMinBalance: null,
        weeklyInterestRate: 0.0125,
        vaultMonthlyRate: 0.145
      }
    }
  },

  // ───────── DİGƏR ÖLKƏLƏR (köçəndə açılır) ─────────
  {
    id: "baypal",
    name: "BayPal",
    countryId: "usa",
    color: "#C99CFF",
    cards: {
      standard: {
        tier: "standard", name: "BayPal Standart",
        weeklyFreeLimit: 11000, overLimitFeeRate: 0.005,
        weeklyInterestRate: 0.0018,
        vaultMonthlyRate: 0.105, subscriptionFee: 0
      },
      gold: {
        tier: "gold", name: "BayPal Gold",
        requiredNetWorth: 100000, subscriptionFee: 24,
        weeklyFreeLimit: 52000, overLimitFeeRate: 0.0028,
        feeWaiveMinBalance: 210000, weeklyInterestRate: 0.0068,
        vaultMonthlyRate: 0.125
      },
      lux: {
        tier: "lux", name: "BayPal Lux",
        requiredNetWorth: 1000000, subscriptionFee: 155,
        weeklyFreeLimit: null, overLimitFeeRate: 0,
        feeWaiveMinBalance: null, weeklyInterestRate: 0.0128,
        vaultMonthlyRate: 0.148
      }
    }
  },
  {
    id: "barklis",
    name: "Barklis",
    countryId: "uk",
    color: "#FF8C42",
    cards: {
      standard: {
        tier: "standard", name: "Barklis Standart",
        weeklyFreeLimit: 9500, overLimitFeeRate: 0.0055,
        weeklyInterestRate: 0.0017,
        vaultMonthlyRate: 0.108, subscriptionFee: 0
      },
      gold: {
        tier: "gold", name: "Barklis Gold",
        requiredNetWorth: 100000, subscriptionFee: 23,
        weeklyFreeLimit: 48000, overLimitFeeRate: 0.0027,
        feeWaiveMinBalance: 190000, weeklyInterestRate: 0.0066,
        vaultMonthlyRate: 0.122
      },
      lux: {
        tier: "lux", name: "Barklis Lux",
        requiredNetWorth: 1000000, subscriptionFee: 148,
        weeklyFreeLimit: null, overLimitFeeRate: 0,
        feeWaiveMinBalance: null, weeklyInterestRate: 0.0126,
        vaultMonthlyRate: 0.146
      }
    }
  },
  {
    id: "tokyu",
    name: "TokyuBank",
    countryId: "japan",
    color: "#FF4C5E",
    cards: {
      standard: {
        tier: "standard", name: "TokyuBank Standart",
        weeklyFreeLimit: 10500, overLimitFeeRate: 0.0045,
        weeklyInterestRate: 0.0016,
        vaultMonthlyRate: 0.102, subscriptionFee: 0
      },
      gold: {
        tier: "gold", name: "TokyuBank Gold",
        requiredNetWorth: 100000, subscriptionFee: 21,
        weeklyFreeLimit: 51000, overLimitFeeRate: 0.0026,
        feeWaiveMinBalance: 20500, weeklyInterestRate: 0.0067,
        vaultMonthlyRate: 0.118
      },
      lux: {
        tier: "lux", name: "TokyuBank Lux",
        requiredNetWorth: 1000000, subscriptionFee: 142,
        weeklyFreeLimit: null, overLimitFeeRate: 0,
        feeWaiveMinBalance: null, weeklyInterestRate: 0.0122,
        vaultMonthlyRate: 0.142
      }
    }
  }
];

// Şəhər → ölkə map (CITIES içindəki şəhər id-lərinə uyğunlaşdırılmalı)
const CITY_TO_COUNTRY = {
  baku: "azerbaijan",
  dubai: "uae",
  london: "uk",
  newyork: "usa",
  tokyo: "japan",
  bali: "indonesia"
};
