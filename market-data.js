// market-data.js

const MARKET_STORES = [
  {
    id: "normal_cars",
    name: "Normal Maşınlar",
    icon: "🚗",
    color: "#3A86FF",
    description: "Gündəlik istifadə üçün avtomobillər",
    items: [
      {
        id: "toyota_camry",
        name: "Toyota Camry",
        brand: "Toyota",
        year: 2024,
        price: 35000,
        image: "", // şəkil linki əlavə et
        description: "Etibarlı və rahat sedan",
        weeklyAppreciation: 0.01 // 1% həftəlik
      },
      {
        id: "honda_civic",
        name: "Honda Civic",
        brand: "Honda",
        year: 2024,
        price: 28000,
        image: "",
        description: "Yığcam və iqtisadi sedan",
        weeklyAppreciation: 0.01
      }
    ]
  },

  {
    id: "luxury_cars",
    name: "Lüks Maşınlar",
    icon: "🏎️",
    color: "#FFD700",
    description: "Premium və lüks avtomobillər",
    items: [
      {
        id: "mercedes_s500",
        name: "Mercedes S500",
        brand: "Mercedes-Benz",
        year: 2024,
        price: 120000,
        image: "",
        description: "Ən yüksək sinif sedan",
        weeklyAppreciation: 0.01
      },
      {
        id: "lamborghini_huracan",
        name: "Lamborghini Huracán",
        brand: "Lamborghini",
        year: 2024,
        price: 280000,
        image: "",
        description: "İtalyan super idman avtomobili",
        weeklyAppreciation: 0.01
      }
    ]
  },

  {
    id: "marine",
    name: "Dəniz Araçları",
    icon: "🛥️",
    color: "#00B4D8",
    description: "Yatlar, qayıqlar və dəniz texnikası",
    items: [
      {
        id: "speedboat_riva",
        name: "Riva Aquariva",
        brand: "Riva",
        year: 2024,
        price: 180000,
        image: "",
        description: "Klassik italyan sürət qayığı",
        weeklyAppreciation: 0.01
      },
      {
        id: "yacht_sunseeker",
        name: "Sunseeker 55",
        brand: "Sunseeker",
        year: 2023,
        price: 950000,
        image: "",
        description: "55 futluq lüks motor yatı",
        weeklyAppreciation: 0.01
      }
    ]
  },

  {
    id: "aviation",
    name: "Hava Araçları",
    icon: "✈️",
    color: "#7B2FBE",
    description: "Özəl təyyarələr və helikopterlər",
    items: [
      {
        id: "cessna_172",
        name: "Cessna 172",
        brand: "Cessna",
        year: 2022,
        price: 420000,
        image: "",
        description: "Klassik özəl pilot təyyarəsi",
        weeklyAppreciation: 0.01
      },
      {
        id: "robinson_r44",
        name: "Robinson R44",
        brand: "Robinson",
        year: 2023,
        price: 320000,
        image: "",
        description: "Yüngül 4 nəfərlik helikopter",
        weeklyAppreciation: 0.01
      }
    ]
  },

  {
    id: "motorcycles",
    name: "Motosikllər",
    icon: "🏍️",
    color: "#FF6B35",
    description: "İdman və kruizer motosikllər",
    items: [
      {
        id: "ducati_panigale",
        name: "Ducati Panigale V4",
        brand: "Ducati",
        year: 2024,
        price: 32000,
        image: "",
        description: "İtalyan yarış motosikli",
        weeklyAppreciation: 0.01
      },
      {
        id: "harley_fatboy",
        name: "Harley-Davidson Fat Boy",
        brand: "Harley-Davidson",
        year: 2024,
        price: 24000,
        image: "",
        description: "İkonik Amerika kruizeri",
        weeklyAppreciation: 0.01
      }
    ]
  }
];
