


































































































































































































































































































































































































































































































































import L from "leaflet";

export const CIVILIZATIONS = [
  {
    id: "mehrgarh",
    n: "Mehrgarh Civilization",
    u: "مہر گڑھ",
    c: [29.3817, 67.6181],
    z: 11,
    d: "7000 BC - 5500 BC: Oldest civilization of South Asia discovered at Bolan Pass, Balochistan.",
    f: [
      "Era: 7000-5500 BC",
      "Location: Bolan Pass",
      "Early Dentistry",
      "Oldest Civilisation",
    ],
    points: [
      { n: "Mehrgarh archaeological site", c: [29.3817, 67.6181] },
    ],
  },
  {
    id: "kotdiji",
    n: "Kot Diji",
    u: "کوٹ ڈیجی",
    c: [27.3456, 68.7083],
    z: 12,
    d: "3300 BC - 2600 BC: Pre-Harappan site with citadel and wheel-made pottery in Sindh.",
    f: ["Era: 3300-2600 BC", "Location: Khairpur", "Citadel", "Mother Goddess"],
    points: [{ n: "Kot Diji archaeological site", c: [27.3456, 68.7083] }],
  },
  {
    id: "indus_valley",
    n: "Indus Valley",
    u: "وادیِ سندھ",
    c: [27.3294, 68.1386],
    z: 11,
    d: "2600 BC - 1700 BC: Famous for grid town planning, covered drainage, and Mohenjo-Daro.",
    f: [
      "Era: 2600-1700 BC",
      "Area: 650,000 sq km",
      "Grid Planning",
      "Priest-King",
    ],
    points: [
      { n: "Mohenjo-daro", c: [27.3294, 68.1386] },
      { n: "Harappa", c: [30.6317, 72.8715] },
    ],
  },
  {
    id: "gandhara",
    n: "Gandhara (Taxila)",
    u: "گندھارا",
    c: [33.7463, 72.8397],
    z: 12,
    d: "600 BC - 1100 AD: Famous for Greco-Buddhist art and Taxila learning center.",
    f: ["Era: 600 BC-1100 AD", "Taxila University", "Greco-Buddhist Art"],
    points: [
      { n: "Taxila archaeological site", c: [33.7463, 72.8397] },
      { n: "Sirkap", c: [33.7558, 72.8256] },
    ],
  },
];

export const RANGES = [
  {
    id: "karakoram",
    n: "Karakoram Range",
    u: "قراقرم",
    c: [35.9, 76.2],
    z: 9,
    color: "#f97316",
    spine: [
      [36.6, 74.9],
      [36.3, 75.5],
      [35.95, 76.2],
      [35.65, 76.9],
      [35.4, 77.5],
    ],
    d: "Home to K2 (8,611 m) and giant glaciers like Siachen and Baltoro.",
    f: ["Peak: K2 (8,611 m)", "Gilgit-Baltistan", "Siachen Glacier"],
    peaks: [
      { n: "K2", h: 8611, c: [35.8825, 76.5133] },
      { n: "Broad Peak", h: 8051, c: [35.8117, 76.5675] },
    ],
  },
  {
    id: "himalaya",
    n: "Himalayas (Western)",
    u: "ہمالیہ",
    c: [35.0, 74.6],
    z: 9,
    color: "#38bdf8",
    spine: [
      [35.6, 74.3],
      [35.24, 74.6],
      [34.8, 74.95],
      [34.3, 75.4],
    ],
    d: "Western end of Himalayas in Pakistan, anchored by Nanga Parbat.",
    f: ["Peak: Nanga Parbat (8,126 m)", "Killer Mountain", "AJK & GB"],
    peaks: [{ n: "Nanga Parbat", h: 8126, c: [35.2371, 74.5893] }],
  },
  {
    id: "hindukush",
    n: "Hindu Kush Range",
    u: "ہندوکش",
    c: [36.1, 71.8],
    z: 9,
    color: "#a78bfa",
    spine: [
      [36.75, 72.8],
      [36.25, 71.85],
      [35.7, 71.3],
      [35.25, 70.8],
    ],
    d: "Runs along Afghan border in Chitral, separating Pakistan from Central Asia.",
    f: ["Peak: Tirich Mir (7,708 m)", "Chitral, KP", "Khyber Route"],
    peaks: [{ n: "Tirich Mir", h: 7708, c: [36.2553, 71.8431] }],
  },
  {
    id: "sulaiman",
    n: "Sulaiman Range",
    u: "کوہ سلیمان",
    c: [30.8, 70.1],
    z: 9,
    color: "#facc15",
    spine: [
      [32.3, 70.0],
      [31.6, 69.9],
      [30.8, 69.9],
      [30.0, 69.5],
      [29.6, 69.0],
    ],
    d: "Forms eastern edge of Iranian Plateau, dividing Balochistan from Indus plains.",
    f: ["Peak: Takht-e-Sulaiman (3,487 m)", "Balochistan/Punjab Border"],
    peaks: [{ n: "Takht-e-Sulaiman", h: 3487, c: [31.62, 69.9] }],
  },
  {
    id: "kirthar",
    n: "Kirthar Range",
    u: "کیرتھر",
    c: [26.2, 67.3],
    z: 9,
    color: "#fb7185",
    spine: [
      [27.4, 67.0],
      [26.5, 67.1],
      [25.8, 67.2],
      [25.3, 66.8],
    ],
    d: "Dry mountain wall extending along Sindh and Balochistan border.",
    f: ["Peak: Zardak (2,260 m)", "Kirthar National Park"],
    peaks: [{ n: "Zardak Peak", h: 2260, c: [26.0, 67.12] }],
  },
  {
    id: "saltrange",
    n: "Salt Range",
    u: "کوہ نمک",
    c: [32.7, 72.7],
    z: 10,
    color: "#f472b6",
    spine: [
      [32.75, 71.6],
      [32.7, 72.3],
      [32.7, 73.0],
      [32.65, 73.5],
    ],
    d: "Geologically rich hill system in Punjab containing Khewra Salt Mine.",
    f: ["Peak: Sakesar (1,522 m)", "Khewra Salt Mine", "Punjab"],
    peaks: [{ n: "Sakesar", h: 1522, c: [32.53, 71.91] }],
  },
  {
    id: "margalla",
    n: "Margalla Hills",
    u: "مارگلہ",
    c: [33.75, 73.05],
    z: 12,
    color: "#4ade80",
    spine: [
      [33.74, 72.88],
      [33.75, 73.05],
      [33.78, 73.22],
    ],
    d: "Foothills of Himalayas located north of Islamabad.",
    f: ["Peak: Tilla Charouni (1,604 m)", "Islamabad", "National Park"],
    peaks: [{ n: "Tilla Charouni", h: 1604, c: [33.77, 73.1] }],
  },
  {
    id: "safedkoh",
    n: "Safed Koh Range",
    u: "سفید کوہ",
    c: [33.9, 70.2],
    z: 10,
    color: "#e2e8f0",
    spine: [
      [34.1, 69.8],
      [34.05, 70.4],
      [33.95, 71.0],
    ],
    d: "Border range south of Kabul River, guarding Khyber Pass.",
    f: ["Peak: Sikaram (4,755 m)", "Khyber Pass"],
    peaks: [{ n: "Mount Sikaram", h: 4755, c: [34.0, 70.1] }],
  },
  {
    id: "chagai",
    n: "Chagai Hills",
    u: "چاغی",
    c: [28.8, 64.2],
    z: 9,
    color: "#fb923c",
    spine: [
      [29.3, 62.8],
      [29.0, 63.8],
      [28.8, 64.6],
    ],
    d: "Granite range in Balochistan famous for nuclear test sites.",
    f: ["Koh-i-Sultan", "Balochistan", "Youm-e-Takbir"],
    peaks: [],
  },
  {
    id: "raskoh",
    n: "Ras Koh Range",
    u: "راس کوہ",
    c: [28.5, 65.2],
    z: 9,
    color: "#2dd4bf",
    spine: [
      [28.9, 64.9],
      [28.6, 65.3],
      [28.3, 65.7],
    ],
    d: "Granite range separating Chagai desert from Kharan basin.",
    f: ["Ras Koh Peak (3,003 m)", "Kharan, Balochistan"],
    peaks: [{ n: "Ras Koh Peak", h: 3003, c: [28.6, 65.3] }],
  },
  {
    id: "toba-kakar",
    n: "Toba Kakar Range",
    u: "توبہ کاکڑ سلسلہ",
    c: [30.8, 67.4],
    z: 9,
    color: "#f59e0b",
    spine: [
      [31.85, 66.25],
      [31.45, 66.85],
      [30.95, 67.35],
      [30.35, 67.8],
    ],
    d: "A major mountain system along northern Balochistan and the Afghan border, forming the north-western rim of the Balochistan Plateau.",
    f: ["Northern Balochistan", "Afghan border", "Kakar country"],
    peaks: [],
  },
  {
    id: "central-brahui",
    n: "Central Brahui Range",
    u: "وسطی براہوی سلسلہ",
    c: [28.25, 67.2],
    z: 9,
    color: "#f97316",
    spine: [
      [29.35, 66.4],
      [28.8, 66.75],
      [28.25, 67.2],
      [27.65, 67.55],
    ],
    d: "A central Balochistan mountain belt within the Brahui highlands, linking the interior plateau with the Kirthar system.",
    f: ["Balochistan Plateau", "Brahui highlands", "Central Balochistan"],
    peaks: [],
  },
  {
    id: "siahan",
    n: "Siahan Range",
    u: "سیہان سلسلہ",
    c: [27.3, 63.8],
    z: 9,
    color: "#fb7185",
    spine: [
      [28.25, 63.0],
      [27.75, 63.45],
      [27.3, 63.8],
      [26.85, 64.25],
    ],
    d: "A dry mountain belt of western Balochistan bordering the Mashkhel and Kharan basins.",
    f: ["Western Balochistan", "Kharan region", "Dry mountain belt"],
    peaks: [],
  },
  {
    id: "central-makran",
    n: "Central Makran Range",
    u: "وسطی مکران سلسلہ",
    c: [26.2, 64.7],
    z: 9,
    color: "#ec4899",
    spine: [
      [27.2, 63.8],
      [26.8, 64.35],
      [26.2, 64.7],
      [25.7, 65.2],
    ],
    d: "An east-west mountain belt across central Makran, separating the interior plateau from the coastal ranges.",
    f: ["Makran", "Balochistan", "East-west fold belt"],
    peaks: [],
  },
  {
    id: "makran-coast",
    n: "Makran Coast Range",
    u: "مکران ساحلی سلسلہ",
    c: [25.25, 63.0],
    z: 9,
    color: "#14b8a6",
    spine: [
      [25.7, 61.4],
      [25.45, 62.1],
      [25.25, 63.0],
      [25.05, 64.0],
      [25.0, 65.0],
    ],
    d: "The coastal mountain belt running parallel to the Arabian Sea across southern Makran.",
    f: ["Arabian Sea coast", "Southern Balochistan", "Makran coast"],
    peaks: [],
  },
];


export const RIVERS = [
  {
    id: "indus",
    n: "Indus River",
    u: "دریائے سندھ",
    c: [28.5, 70.5],
    z: 7,
    color: "#0284c7",
    isPunjab: false,
    spine: [
      [34.9, 76.2],
      [35.3, 75.6],
      [35.65, 74.63],
      [35.42, 74.1],
      [35.3, 73.2],
      [34.93, 72.88],
      [34.09, 72.7],
      [33.9, 72.25],
      [32.96, 71.55],
      [31.7, 71.0],
      [30.7, 70.85],
      [29.2, 70.6],
      [28.43, 69.7],
      [27.7, 68.85],
      [26.3, 68.3],
      [25.37, 68.3],
      [24.8, 67.8],
      [24.0, 67.4],
    ],
    d: "Length: 3,180 km. National river of Pakistan originating in Tibet.",
    f: ["3,180 km", "Outflow: Arabian Sea", "Tarbela Dam"],
  },
  {
    id: "jhelum",
    n: "Jhelum River",
    u: "دریائے جہلم",
    c: [32.93, 73.72],
    z: 8,
    color: "#06b6d4",
    isPunjab: true,
    spine: [
      [34.08, 74.8],
      [34.15, 74.2],
      [34.37, 73.47],
      [33.9, 73.5],
      [33.15, 73.65],
      [32.93, 73.73],
      [32.68, 73.5],
      [31.8, 72.5],
      [31.15, 72.15],
    ],
    d: "Length: 725 km. Westernmost river of Punjab's five rivers.",
    f: ["725 km", "Mangla Dam", "Punjab & AJK"],
  },
  {
    id: "chenab",
    n: "Chenab River",
    u: "دریائے چناب",
    c: [31.5, 72.3],
    z: 8,
    color: "#3b82f6",
    isPunjab: true,
    spine: [
      [32.9, 74.75],
      [32.67, 74.46],
      [32.4, 73.97],
      [32.0, 73.2],
      [31.15, 72.15],
      [30.3, 71.4],
      [29.35, 71.02],
      [28.95, 70.35],
    ],
    d: "Length: 960 km. Major river of Punjab passing through Gujrat & Jhang.",
    f: ["960 km", "Marala Barrage", "Key Cities: Sialkot, Gujrat"],
  },
  {
    id: "ravi",
    n: "Ravi River",
    u: "دریائے راوی",
    c: [31.57, 74.31],
    z: 8,
    color: "#60a5fa",
    isPunjab: true,
    spine: [
      [32.35, 75.45],
      [32.0, 74.95],
      [31.75, 74.6],
      [31.58, 74.3],
      [31.2, 73.6],
      [30.7, 72.5],
      [30.6, 71.9],
    ],
    d: "Length: 720 km. Flows past the historic city of Lahore.",
    f: ["720 km", "Historic City: Lahore", "Balloki Barrage"],
  },
  {
    id: "sutlej",
    n: "Sutlej River",
    u: "دریائے ستلج",
    c: [29.8, 71.6],
    z: 8,
    color: "#2563eb",
    isPunjab: true,
    spine: [
      [31.0, 74.55],
      [30.4, 73.85],
      [29.85, 72.7],
      [29.4, 71.8],
      [29.35, 71.02],
    ],
    d: "Length: 1,450 km. Easternmost river of Punjab joining Chenab at Panjnad.",
    f: ["1,450 km", "Panjnad Barrage", "Bahawalpur"],
  },
  {
    id: "kabul",
    n: "Kabul River",
    u: "دریائے کابل",
    c: [34.02, 71.62],
    z: 8,
    color: "#0ea5e9",
    isPunjab: false,
    spine: [
      [34.78, 72.5],
      [34.55, 72.08],
      [34.35, 71.82],
      [34.02, 71.62],
    ],
    d: "A major transboundary river flowing from Afghanistan into Pakistan before joining the Indus.",
    f: ["Source: Afghanistan", "Confluence: Indus near Attock", "Khyber Pakhtunkhwa"],
  },
  {
    id: "gilgit",
    n: "Gilgit River",
    u: "دریائے گلگت",
    c: [35.92, 74.31],
    z: 9,
    color: "#38bdf8",
    isPunjab: false,
    spine: [
      [36.45, 74.9],
      [36.15, 74.65],
      [35.92, 74.31],
    ],
    d: "A mountain river descending through Gilgit-Baltistan to join the Indus at Junction.",
    f: ["Source: Shandur region", "Mouth: Indus River", "Gilgit-Baltistan"],
  },
  {
    id: "swat",
    n: "Swat River",
    u: "دریائے سوات",
    c: [34.18, 72.02],
    z: 9,
    color: "#22d3ee",
    isPunjab: false,
    spine: [
      [35.72, 72.48],
      [35.35, 72.32],
      [34.9, 72.2],
      [34.45, 72.08],
      [34.18, 72.02],
    ],
    d: "A clear Himalayan river flowing through Swat Valley before joining the Kabul River.",
    f: ["Source: Hindu Kush", "Mouth: Kabul River", "Swat Valley"],
  },
  {
    id: "panjkora",
    n: "Panjkora River",
    u: "دریائے پنجکوڑہ",
    c: [34.67, 71.96],
    z: 9,
    color: "#67e8f9",
    isPunjab: false,
    spine: [
      [35.55, 71.82],
      [35.25, 71.78],
      [34.98, 71.86],
      [34.67, 71.96],
    ],
    d: "A major river of Lower and Upper Dir that joins the Swat River near Chakdara.",
    f: ["Source: Hindu Kush", "Mouth: Swat River", "Dir Valley"],
  },
  {
    id: "zhob",
    n: "Zhob River",
    u: "دریائے ژوب",
    c: [31.35, 69.45],
    z: 9,
    color: "#2dd4bf",
    isPunjab: false,
    spine: [
      [31.95, 68.65],
      [31.75, 68.95],
      [31.55, 69.22],
      [31.35, 69.45],
    ],
    d: "A river of northern Balochistan flowing through Zhob district toward the Gomal system.",
    f: ["Source: Balochistan highlands", "Zhob District", "Gomal basin"],
  },
  {
    id: "hub",
    n: "Hub River",
    u: "دریائے حب",
    c: [25.02, 66.72],
    z: 10,
    color: "#14b8a6",
    isPunjab: false,
    spine: [
      [25.62, 67.18],
      [25.42, 67.02],
      [25.2, 66.83],
      [25.02, 66.72],
    ],
    d: "A seasonal river forming part of the Sindh-Balochistan boundary before reaching the Arabian Sea.",
    f: ["Source: Pab Range", "Mouth: Arabian Sea", "Hub Dam"],
  },
  {
    id: "kurram",
    n: "Kurram River",
    u: "دریائے کرم",
    c: [33.8, 70.25],
    z: 9,
    color: "#7dd3fc",
    isPunjab: false,
    spine: [[34.45, 69.85], [34.15, 70.0], [33.8, 70.25], [33.45, 70.55]],
    d: "A transboundary river flowing from Afghanistan through the Kurram Valley toward the Indus basin.",
    f: ["Kurram Valley", "Transboundary river", "Khyber Pakhtunkhwa"],
  },
  {
    id: "gomal",
    n: "Gomal River",
    u: "دریائے گومل",
    c: [31.95, 70.0],
    z: 9,
    color: "#5eead4",
    isPunjab: false,
    spine: [[32.65, 69.4], [32.35, 69.65], [31.95, 70.0], [31.55, 70.35]],
    d: "A major river of southern Khyber Pakhtunkhwa and northern Balochistan.",
    f: ["Gomal Valley", "South Waziristan", "Balochistan border"],
  },
  {
    id: "tochi",
    n: "Tochi River",
    u: "دریائے ٹوچی",
    c: [32.25, 70.55],
    z: 9,
    color: "#99f6e4",
    isPunjab: false,
    spine: [[33.0, 69.7], [32.75, 70.0], [32.45, 70.3], [32.25, 70.55]],
    d: "A seasonal river draining the Tochi Valley into the Gomal river system.",
    f: ["Tochi Valley", "North Waziristan", "Gomal basin"],
  },
  {
    id: "hunza",
    n: "Hunza River",
    u: "دریائے ہنزہ",
    c: [36.35, 74.65],
    z: 10,
    color: "#bae6fd",
    isPunjab: false,
    spine: [[36.75, 74.45], [36.55, 74.55], [36.35, 74.65], [36.0, 74.45]],
    d: "A high-altitude river in Hunza that joins the Gilgit River system.",
    f: ["Hunza Valley", "Gilgit-Baltistan", "Karakoram"],
  },
  {
    id: "shigar",
    n: "Shigar River",
    u: "دریائے شگر",
    c: [35.55, 75.7],
    z: 10,
    color: "#a5f3fc",
    isPunjab: false,
    spine: [[35.95, 76.15], [35.75, 75.95], [35.55, 75.7], [35.35, 75.65]],
    d: "A glacial river flowing through Shigar Valley into the Indus near Skardu.",
    f: ["Shigar Valley", "Baltoro Glacier", "Skardu"],
  },
  {
    id: "shyok",
    n: "Shyok River",
    u: "دریائے شیوک",
    c: [35.2, 77.0],
    z: 10,
    color: "#67e8f9",
    isPunjab: false,
    spine: [[35.8, 77.5], [35.55, 77.25], [35.2, 77.0], [34.95, 76.75]],
    d: "A major tributary of the Indus flowing through the high valleys of Gilgit-Baltistan.",
    f: ["Nubra and Shyok valleys", "Karakoram", "Indus tributary"],
  },
  {
    id: "astore",
    n: "Astore River",
    u: "دریائے استور",
    c: [35.2, 74.9],
    z: 10,
    color: "#38bdf8",
    isPunjab: false,
    spine: [[35.7, 75.25], [35.45, 75.1], [35.2, 74.9], [34.95, 74.8]],
    d: "A mountain river descending through Astore Valley to the Indus.",
    f: ["Astore Valley", "Gilgit-Baltistan", "Indus tributary"],
  },
  {
    id: "dasht",
    n: "Dasht River",
    u: "دریائے دشت",
    c: [25.2, 63.5],
    z: 9,
    color: "#2dd4bf",
    isPunjab: false,
    spine: [[26.2, 63.7], [25.8, 63.6], [25.2, 63.5], [24.75, 63.3]],
    d: "A seasonal river in southern Balochistan flowing toward the Makran coast.",
    f: ["Makran", "Balochistan", "Seasonal river"],
  },
  {
    id: "hingol",
    n: "Hingol River",
    u: "دریائے ہنگول",
    c: [25.55, 65.2],
    z: 9,
    color: "#14b8a6",
    isPunjab: false,
    spine: [[26.55, 65.5], [26.1, 65.35], [25.55, 65.2], [25.25, 65.0]],
    d: "The longest river in Balochistan, running through Hingol National Park to the Arabian Sea.",
    f: ["Hingol National Park", "Balochistan", "Arabian Sea"],
  },
  {
    id: "porali",
    n: "Porali River",
    u: "دریائے پورالی",
    c: [25.85, 66.0],
    z: 9,
    color: "#0d9488",
    isPunjab: false,
    spine: [[26.7, 66.3], [26.35, 66.2], [25.85, 66.0], [25.45, 65.8]],
    d: "A seasonal river of Balochistan draining the Lasbela region to the Arabian Sea.",
    f: ["Lasbela", "Balochistan", "Arabian Sea"],
  },
  {
    id: "lora",
    n: "Lora River",
    u: "دریائے لورا",
    c: [26.35, 64.7],
    z: 9,
    color: "#5eead4",
    isPunjab: false,
    spine: [[27.2, 64.75], [26.85, 64.7], [26.35, 64.7], [25.95, 64.55]],
    d: "A seasonal stream of western Balochistan shown on the reference rivers map.",
    f: ["Balochistan", "Seasonal stream"],
  },
  {
    id: "panjnad",
    n: "Panjnad River",
    u: "دریائے پنجند",
    c: [29.35, 71.02],
    z: 9,
    color: "#1d4ed8",
    isPunjab: true,
    spine: [[30.0, 71.25], [29.65, 71.12], [29.35, 71.02], [28.95, 70.85]],
    d: "The combined stream of Punjab's five rivers before joining the Indus.",
    f: ["Panjnad Barrage", "Punjab", "Indus confluence"],
  },
];


export const DESERTS = [
  {
    id: "thar",
    n: "Thar Desert",
    u: "صحراۓ تھر",
    c: [25.5, 70.2],
    z: 8,
    color: "#eab308",
    bounds: [
      [24.0, 69.5],
      [27.0, 71.0],
    ],
    d: "Spanning 200,000 sq km in Sindh. 9th largest subtropical desert.",
    f: ["Tharparkar, Sindh", "200,000 sq km"],
  },
  {
    id: "cholistan",
    n: "Cholistan Desert",
    u: "صحراۓ چولستان",
    c: [28.5, 71.5],
    z: 8,
    color: "#d97706",
    bounds: [
      [27.8, 70.8],
      [29.5, 72.5],
    ],
    d: "Covering 25,800 sq km in Bahawalpur. Famous for Derawar Fort.",
    f: ["Bahawalpur, Punjab", "Derawar Fort"],
  },
  {
    id: "thal",
    n: "Thal Desert",
    u: "صحراۓ تھل",
    c: [31.5, 71.3],
    z: 9,
    color: "#b45309",
    bounds: [
      [30.5, 70.8],
      [32.5, 71.8],
    ],
    d: "Located in Punjab between Jhelum and Indus rivers.",
    f: ["Bhakkar, Layyah", "Sand Dunes"],
  },
  {
    id: "katpana",
    n: "Katpana Cold Desert",
    u: "صحراۓ کٹپانہ",
    c: [35.3, 75.6],
    z: 11,
    color: "#f3f4f6",
    bounds: [
      [35.2, 75.45],
      [35.4, 75.8],
    ],
    d: "World's highest cold desert located in Skardu at 2,226 meters.",
    f: ["Skardu, GB", "Elevation: 2,226m"],
  },
  {
    id: "nara",
    n: "Nara Desert",
    u: "صحرائے نارا",
    c: [27.0, 68.5],
    z: 8,
    color: "#ca8a04",
    bounds: [[26.0, 67.7], [28.4, 69.5]],
    d: "A desert region of eastern Sindh between the Indus plain and the Thar Desert.",
    f: ["Sindh", "Eastern Indus region", "Desert wildlife"],
  },
  {
    id: "kharan",
    n: "Kharan Desert",
    u: "صحرائے خاران",
    c: [28.7, 65.8],
    z: 8,
    color: "#a16207",
    bounds: [[27.8, 64.5], [29.6, 67.0]],
    d: "A broad sandy and gravel desert basin in western Balochistan.",
    f: ["Balochistan", "Kharan Basin", "Arid landscape"],
  },
];


export const CLIMATE_ZONES = [
  {
    id: "upper-indus-plain",
    n: "Upper Indus Plain",
    u: "بالائی میدانِ سندھ",
    kind: "Climate Zone",
    c: [31.1, 72.7],
    z: 7,
    color: "#facc15",
    bounds: [
      [28.2, 68.6],
      [34.0, 75.5],
    ],
    polygon: [
      [33.9, 72.4],
      [33.35, 74.8],
      [31.8, 75.3],
      [30.0, 74.2],
      [28.35, 71.8],
      [28.55, 70.5],
      [29.35, 69.8],
      [31.25, 68.75],
      [32.5, 69.4],
    ],
    style: "solid",
    d: "The northern part of the Indus Plain, covering most of Punjab and extending toward the central Sindh transition.",
    f: ["Upper Indus Plain", "Punjab", "Five rivers and their doabs", "Indus tributary system"],
  },
  {
    id: "lower-indus-plain",
    n: "Lower Indus Plain",
    u: "زیریں میدانِ سندھ",
    kind: "Climate Zone",
    c: [27.2, 68.5],
    z: 7,
    color: "#f97316",
    bounds: [
      [23.7, 66.0],
      [29.4, 71.2],
    ],
    polygon: [
      [29.35, 70.4],
      [28.65, 71.05],
      [27.8, 70.65],
      [26.75, 70.05],
      [25.85, 69.35],
      [24.95, 68.75],
      [24.1, 67.55],
      [23.75, 66.25],
      [24.55, 66.0],
      [25.75, 66.45],
      [26.85, 67.15],
      [27.9, 67.8],
      [28.8, 68.85],
    ],
    style: "dotted",
    d: "The southern Indus Plain in Sindh, where the Indus continues southward toward the delta and Arabian Sea.",
    f: ["Lower Indus Plain", "Sindh", "Indus floodplain", "Indus Delta"],
  },
  {
    id: "highland-climate",
    n: "Highland Climate",
    u: "پہاڑی آب و ہوا",
    kind: "Climate Zone",
    c: [35.2, 74.2],
    z: 7,
    color: "#38bdf8",
    bounds: [
      [33.7, 69.5],
      [37.2, 77.8],
    ],
    polygon: [
      [37.05, 73.8],
      [36.65, 75.9],
      [35.8, 77.7],
      [34.8, 76.6],
      [33.8, 74.8],
      [34.05, 72.6],
      [35.1, 71.3],
      [36.3, 72.3],
    ],
    d: "The northern and north-western highlands, with cold winters, mild summers and rainfall in all seasons.",
    f: ["Zone A", "Cold winters", "Mild summers", "Rainfall in all seasons"],
  },
  {
    id: "lowland-climate",
    n: "Lowland Climate",
    u: "میدانی آب و ہوا",
    kind: "Climate Zone",
    c: [30.9, 72.8],
    z: 7,
    color: "#facc15",
    bounds: [
      [27.0, 67.5],
      [34.2, 75.2],
    ],
    polygon: [
      [34.0, 72.4],
      [33.5, 75.0],
      [31.5, 75.2],
      [28.2, 73.4],
      [27.2, 69.0],
      [29.0, 67.7],
      [32.0, 69.0],
    ],
    d: "The Indus Plain and most lowland areas, ranging from semi-arid to arid with hot summers and monsoon influence.",
    f: ["Zone B", "Semi-arid to arid", "Hot summers", "Monsoon influence"],
  },
  {
    id: "coastal-climate",
    n: "Coastal Climate",
    u: "ساحلی آب و ہوا",
    kind: "Climate Zone",
    c: [24.7, 66.7],
    z: 8,
    color: "#2dd4bf",
    bounds: [
      [23.4, 60.8],
      [26.8, 68.0],
    ],
    polygon: [
      [25.9, 66.9],
      [25.4, 67.8],
      [24.2, 67.4],
      [23.7, 65.8],
      [24.0, 61.0],
      [25.0, 61.0],
      [26.0, 64.0],
    ],
    d: "The narrow southern coastal belt along the Arabian Sea, with mild winters and warm summers.",
    f: ["Zone C", "Arabian Sea coast", "Mild winters", "Warm summers"],
  },
  {
    id: "arid-climate",
    n: "Arid Climate",
    u: "خشک آب و ہوا",
    kind: "Climate Zone",
    c: [29.0, 66.0],
    z: 7,
    color: "#fb923c",
    bounds: [
      [24.0, 61.0],
      [32.5, 71.0],
    ],
    polygon: [
      [33.0, 69.5],
      [31.0, 67.0],
      [28.0, 67.5],
      [25.8, 65.2],
      [24.0, 61.0],
      [29.0, 61.0],
      [31.5, 64.0],
    ],
    d: "The dry western and south-western region, with mild winters, hot summers and extreme aridity.",
    f: ["Zone D", "Mild winters", "Hot summers", "Extreme aridity"],
  },
];


export const CLIMATE_DATA = [
  {
    id: "floods2022",
    n: "2022 Super Floods",
    u: "تاریخی سیلاب 2022",
    c: [27.5, 68.2],
    z: 8,
    d: "Monsoon floods submerged 1/3rd of Pakistan, affecting 33 million people.",
    f: ["Affected: 33M People", "1/3rd Submerged", "Damage: $30B+"],
    points: [
      { n: "Sindh flood-affected corridor", c: [27.5, 68.2] },
      { n: "Sukkur flood impact area", c: [27.705, 68.857] },
    ],
  },
  {
    id: "jacobabad",
    n: "Jacobabad Extreme Heat",
    u: "یعقوب آباد شدید گرمی",
    c: [28.28, 68.43],
    z: 10,
    d: "One of the hottest places on Earth, regularly crossing 50°C.",
    f: ["Peak: > 52°C", "Location: Sindh"],
    points: [{ n: "Jacobabad heat hotspot", c: [28.28, 68.43] }],
  },
  {
    id: "smog_lahore",
    n: "Lahore Smog Crisis",
    u: "لاہور اسموگ",
    c: [31.52, 74.35],
    z: 11,
    d: "Annual winter smog with AQI crossing hazardous levels (> 800).",
    f: ["AQI: > 800", "Winter Inversion"],
    points: [
      { n: "Lahore urban smog hotspot", c: [31.52, 74.35] },
      { n: "Ravi corridor", c: [31.57, 74.31] },
    ],
  },
];

export const PROVINCES = [
  {
    id: "punjab",
    n: "Punjab",
    u: "پنجاب",
    c: [31.2, 72.7],
    z: 7,
    d: "Agricultural heartland watered by five rivers.",
    f: ["Capital: Lahore"],
  },
  {
    id: "sindh",
    n: "Sindh",
    u: "سندھ",
    c: [26.0, 68.5],
    z: 7,
    d: "Southern province along Indus & Arabian Sea.",
    f: ["Capital: Karachi"],
  },
  {
    id: "kp",
    n: "Khyber Pakhtunkhwa",
    u: "خیبر پختونخوا",
    c: [34.5, 72.0],
    z: 7,
    d: "North-western mountainous province.",
    f: ["Capital: Peshawar"],
  },
  {
    id: "balochistan",
    n: "Balochistan",
    u: "بلوچستان",
    c: [28.5, 65.5],
    z: 6,
    d: "Largest province by area with ancient Mehrgarh.",
    f: ["Capital: Quetta"],
  },
  {
    id: "gb",
    n: "Gilgit-Baltistan",
    u: "گلگت بلتستان",
    c: [35.8, 74.8],
    z: 7,
    d: "Northern region containing K2 & Karakoram.",
    f: ["Capital: Gilgit"],
  },
  {
    id: "ajk",
    n: "Azad Kashmir",
    u: "آزاد کشمیر",
    c: [34.0, 73.7],
    z: 8,
    d: "Valley region along Jhelum river.",
    f: ["Capital: Muzaffarabad"],
  },
  {
    id: "ict",
    n: "Islamabad ICT",
    u: "اسلام آباد",
    c: [33.68, 73.05],
    z: 10,
    d: "Federal capital territory.",
    f: ["Capital: Islamabad"],
  },
];

export const PROVINCE_FEATURES = {
  punjab: {
    rivers: ["jhelum", "chenab", "ravi", "sutlej", "indus"],
    ranges: ["saltrange", "sulaiman"],
    deserts: ["cholistan", "thal"],
  },
  sindh: {
    rivers: ["indus", "hub"],
    ranges: ["kirthar"],
    deserts: ["thar"],
  },
  kp: {
    rivers: ["kabul", "swat", "panjkora", "indus"],
    ranges: ["hindukush", "safedkoh"],
    deserts: [],
  },
  balochistan: {
    rivers: ["zhob", "hub"],
    ranges: [
      "sulaiman",
      "kirthar",
      "chagai",
      "raskoh",
      "toba-kakar",
      "central-brahui",
      "siahan",
      "central-makran",
      "makran-coast",
    ],
    deserts: [],
  },
  gb: {
    rivers: ["indus", "gilgit"],
    ranges: ["karakoram", "himalaya", "hindukush"],
    deserts: ["katpana"],
  },
  ajk: {
    rivers: ["jhelum"],
    ranges: ["himalaya"],
    deserts: [],
  },
  ict: {
    rivers: ["indus"],
    ranges: ["margalla"],
    deserts: [],
  },
};

export const KIND = {
  ranges: "Mountain Range",
  civilizations: "Ancient Civilization",
  provinces: "Province",
  rivers: "Major River",
  deserts: "Desert",
  climate: "Climate Zone",
  peak: "Mountain Peak",
};

export const PEAKS = RANGES.flatMap((r) =>
  r.peaks.map((p) => ({ ...p, range: r })),
);

export const PK_BOUNDS = [
  [23.5, 60.8],
  [37.1, 77.9],
];

export const MAP_TYPES = [
  ["google_satellite", "Satellite"],
  ["google_hybrid", "Hybrid"],
  ["google_terrain", "Terrain"],
  ["google_roadmap", "Roadmap"],
];

export const PIN = L.divIcon({
  className: "",
  html: '<span class="pk-pin"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const rangeBounds = (r) => L.latLngBounds(r.spine || r.bounds || [r.c]);


export const PEAK_ITEMS = PEAKS.map((p) => ({
  id: `peak-${p.n}`,
  n: p.n,
  u: "",
  kind: KIND.peak,
  c: p.c,
  z: 12,
  d: `${p.n} (${p.h.toLocaleString()} m) is part of the ${p.range.n}.`,
  f: [`Height: ${p.h.toLocaleString()} m`, `Range: ${p.range.n}`],
}));


export const LOCAL = [
  ...CIVILIZATIONS.map((c) => ({ ...c, kind: KIND.civilizations })),
  ...RANGES.map((r) => ({ ...r, kind: KIND.ranges })),
  ...RIVERS.map((rv) => ({ ...rv, kind: KIND.rivers })),
  ...DESERTS.map((d) => ({ ...d, kind: KIND.deserts })),
  ...CLIMATE_DATA.map((cl) => ({ ...cl, kind: KIND.climate })),
  ...CLIMATE_ZONES.map((zone) => ({ ...zone, kind: KIND.climate })),
  ...PROVINCES.map((p) => ({ ...p, kind: KIND.provinces })),
  ...PEAK_ITEMS,
];


export const TABS = [
  ["civilizations", "Civilizations"],
  ["ranges", "10 Ranges"],
  ["rivers", "Pak Rivers"],
  ["punjab_rivers", "Punjab Rivers"],
  ["deserts", "Deserts"],
  ["climate", "Climate"],
  ["provinces", "Provinces"],
];

export const TAB_KIND = {
  civilizations: KIND.civilizations,
  ranges: KIND.ranges,
  rivers: KIND.rivers,
  punjab_rivers: KIND.rivers,
  deserts: KIND.deserts,
  climate: KIND.climate,
  provinces: KIND.provinces,
};
