import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Search, 
  Menu, 
  X, 
  Mountain, 
  Layers, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkles, 
  ArrowLeft 
} from "lucide-react";

/* ---------- RADAR LOADER ---------- */
const Radar = styled.div`
  .loader {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    box-shadow: 25px 25px 75px rgba(0, 0, 0, 0.55);
    border: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .loader::before {
    content: "";
    position: absolute;
    inset: 20px;
    border: 1px dashed #444;
    border-radius: 50%;
    box-shadow: inset -5px -5px 25px rgba(0, 0, 0, 0.25),
      inset 5px 5px 35px rgba(0, 0, 0, 0.25);
  }
  .loader::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px dashed #444;
    box-shadow: inset -5px -5px 25px rgba(0, 0, 0, 0.25),
      inset 5px 5px 35px rgba(0, 0, 0, 0.25);
  }
  .loader span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 100%;
    transform-origin: top left;
    animation: radar81 2s linear infinite;
    border-top: 1px dashed #fff;
  }
  .loader span::before {
    content: "";
    position: absolute;
    inset: 0;
    background: seagreen;
    transform-origin: top left;
    transform: rotate(-55deg);
    filter: blur(30px) drop-shadow(20px 20px 20px seagreen);
  }
  @keyframes radar81 {
    to { transform: rotate(360deg); }
  }
`;

const Loader = () => (
  <Radar>
    <div className="loader">
      <span />
    </div>
  </Radar>
);

/* ---------- PAKISTAN FLAG ---------- */
const Flag = () => (
  <svg viewBox="0 0 30 20" className="w-9 h-6 rounded-sm shadow" aria-label="Flag of Pakistan">
    <rect width="30" height="20" fill="#01411C" />
    <rect width="7.5" height="20" fill="#fff" />
    <circle cx="19.5" cy="10" r="4.6" fill="#fff" />
    <circle cx="20.9" cy="9.2" r="3.9" fill="#01411C" />
    <polygon
      fill="#fff"
      points="21.5,5.9 21.91,7.03 23.12,7.07 22.17,7.82 22.5,8.98 21.5,8.3 20.5,8.98 20.83,7.82 19.88,7.07 21.09,7.03"
    />
  </svg>
);

/* ---------- ANCIENT CIVILIZATIONS ---------- */
const CIVILIZATIONS = [
  {
    id: "mehrgarh",
    n: "Mehrgarh Civilization",
    u: "مہر گڑھ",
    c: [29.3817, 67.6181],
    z: 11,
    d: "7000 BC - 5500 BC: Oldest civilization of South Asia discovered at the foot of Bolan Pass, Balochistan. Known for mud-brick houses, agriculture (wheat/barley), early dentistry (11 drilled teeth found), and Lapis Lazuli beads.",
    f: ["Era: 7000 BC - 5500 BC", "Location: Bolan Pass, Balochistan", "Early Dentistry: 11 drilled teeth found", "Oldest South Asian Civilisation"],
  },
  {
    id: "kotdiji",
    n: "Kot Diji",
    u: "کوٹ ڈیجی",
    c: [27.3456, 68.7083],
    z: 12,
    d: "3300 BC - 2600 BC: Located 45 km south of Khairpur, Sindh. Pre-Harappan prosperous community with a citadel (550ft x 350ft), stone foundations, wheel-made decorated pottery, and worship of Mother Goddess.",
    f: ["Era: 3300 BC - 2600 BC", "Location: Khairpur, Sindh", "Structure: Citadel with defensive wall", "Worship: Mother Goddess of fertility"],
  },
  {
    id: "indus_valley",
    n: "Indus Valley (Mohenjo-Daro & Harappa)",
    u: "وادیِ سندھ (موئن جو دڑو و ہڑپہ)",
    c: [27.3294, 68.1386],
    z: 11,
    d: "2600 BC - 1700 BC: Spanning 650,000 sq km across Harappa, Mohenjo-Daro, and Ganweriwala. World famous for urban grid planning, covered street drainage, washrooms in houses, and Priest-King artifacts.",
    f: ["Era: 2600 BC - 1700 BC", "Coverage: 650,000 sq km", "Feature: Grid town planning & covered drains", "Artifacts: Priest-King & Dancing Girl"],
  },
  {
    id: "gandhara",
    n: "Gandhara Civilization (Taxila)",
    u: "گندھارا (ٹیکسلا)",
    c: [33.7463, 72.8397],
    z: 12,
    d: "600 BC - 1100 AD: 'Land of Fragrance' centered around Peshawar Valley, Taxila, and Swat. World-famous for Taxila center of learning, Greco-Buddhist art style, stupas, and monasteries.",
    f: ["Era: 600 BC - 1100 AD", "Meaning: Land of Fragrance", "Key Center: Taxila University & Swat", "Art: Greco-Roman + Buddhist fusion"],
  },
];

/* ---------- 10 MOUNTAIN RANGES ---------- */
const RANGES = [
  {
    id: "karakoram",
    n: "Karakoram Range",
    u: "قراقرم",
    c: [35.9, 76.2],
    z: 9,
    color: "#f97316",
    spine: [[36.6, 74.9], [36.3, 75.5], [35.95, 76.2], [35.65, 76.9], [35.4, 77.5]],
    d: "Home to K2 (8,611 m), the world's 2nd highest peak. Spans Gilgit-Baltistan and contains giant glaciers like Siachen and Baltoro.",
    f: ["Highest Peak: K2 (8,611 m)", "Region: Gilgit-Baltistan", "Glaciers: Siachen, Baltoro, Biafo"],
    peaks: [{ n: "K2", h: 8611, c: [35.8825, 76.5133] }, { n: "Broad Peak", h: 8051, c: [35.8117, 76.5675] }],
  },
  {
    id: "himalaya",
    n: "Himalayas (Western)",
    u: "ہمالیہ",
    c: [35.0, 74.6],
    z: 9,
    color: "#38bdf8",
    spine: [[35.6, 74.3], [35.24, 74.6], [34.8, 74.95], [34.3, 75.4]],
    d: "The western end of the world-famous Himalayan range enters Pakistan in Kashmir and Gilgit-Baltistan, anchored by Nanga Parbat.",
    f: ["Highest Peak: Nanga Parbat (8,126 m)", "Known As: Killer Mountain", "Region: AJK & Gilgit-Baltistan"],
    peaks: [{ n: "Nanga Parbat", h: 8126, c: [35.2371, 74.5893] }],
  },
  {
    id: "hindukush",
    n: "Hindu Kush Range",
    u: "ہندوکش",
    c: [36.1, 71.8],
    z: 9,
    color: "#a78bfa",
    spine: [[36.75, 72.8], [36.25, 71.85], [35.7, 71.3], [35.25, 70.8]],
    d: "Major mountain range running along the Afghan border through Chitral and KP, separating Northern Pakistan from Central Asia.",
    f: ["Highest Peak: Tirich Mir (7,708 m)", "Location: Chitral, KP", "Historic Significance: Khyber Route"],
    peaks: [{ n: "Tirich Mir", h: 7708, c: [36.2553, 71.8431] }],
  },
  {
    id: "sulaiman",
    n: "Sulaiman Range",
    u: "کوہ سلیمان",
    c: [30.8, 70.1],
    z: 9,
    color: "#facc15",
    spine: [[32.3, 70.0], [31.6, 69.9], [30.8, 69.9], [30.0, 69.5], [29.6, 69.0]],
    d: "Extensive range forming the eastern edge of the Iranian Plateau and dividing Balochistan from the Indus plains.",
    f: ["Highest Peak: Takht-e-Sulaiman (3,487 m)", "Region: Balochistan & Punjab border", "Flora: Pine forests"],
    peaks: [{ n: "Takht-e-Sulaiman", h: 3487, c: [31.62, 69.9] }],
  },
  {
    id: "kirthar",
    n: "Kirthar Range",
    u: "کیرتھر",
    c: [26.2, 67.3],
    z: 9,
    color: "#fb7185",
    spine: [[27.4, 67.0], [26.5, 67.1], [25.8, 67.2], [25.3, 66.8]],
    d: "A dry mountain wall extending southwards along the Sindh and Balochistan border, protecting the Indus valley.",
    f: ["Highest Peak: Zardak Peak (2,260 m)", "Protected Area: Kirthar National Park", "Region: Sindh / Balochistan"],
    peaks: [{ n: "Zardak Peak", h: 2260, c: [26.0, 67.12] }],
  },
  {
    id: "saltrange",
    n: "Salt Range",
    u: "کوہ نمک",
    c: [32.7, 72.7],
    z: 10,
    color: "#f472b6",
    spine: [[32.75, 71.6], [32.7, 72.3], [32.7, 73.0], [32.65, 73.5]],
    d: "A geologically rich hill system in northern Punjab containing vast deposits of rock salt, including the world-famous Khewra Mine.",
    f: ["Highest Peak: Sakesar (1,522 m)", "Famous Mine: Khewra Salt Mine", "Region: Punjab (Jhelum/Chakwal)"],
    peaks: [{ n: "Sakesar", h: 1522, c: [32.53, 71.91] }],
  },
  {
    id: "margalla",
    n: "Margalla Hills",
    u: "مارگلہ",
    c: [33.75, 73.05],
    z: 12,
    color: "#4ade80",
    spine: [[33.74, 72.88], [33.75, 73.05], [33.78, 73.22]],
    d: "Hill range forming the foothills of the Himalayas, located directly north of Islamabad and protected as a National Park.",
    f: ["Highest Peak: Tilla Charouni (1,604 m)", "Location: Islamabad Capital Territory", "Status: National Park"],
    peaks: [{ n: "Tilla Charouni", h: 1604, c: [33.77, 73.1] }],
  },
  {
    id: "safedkoh",
    n: "Safed Koh (Spin Ghar) Range",
    u: "سفید کوہ (سپین غر)",
    c: [33.9, 70.2],
    z: 10,
    color: "#e2e8f0",
    spine: [[34.1, 69.8], [34.05, 70.4], [33.95, 71.0]],
    d: "Mountain range along the Pakistan-Afghanistan border south of the Kabul River, historically guarding the Khyber Pass.",
    f: ["Highest Peak: Mount Sikaram (4,755 m)", "Location: Kurram / Khyber Agency", "Key Feature: Khyber Pass"],
    peaks: [{ n: "Mount Sikaram", h: 4755, c: [34.0, 70.1] }],
  },
  {
    id: "chagai",
    n: "Chagai Hills",
    u: "چاغی",
    c: [28.8, 64.2],
    z: 9,
    color: "#fb923c",
    spine: [[29.3, 62.8], [29.0, 63.8], [28.8, 64.6]],
    d: "Dry granite mountain range in northwestern Balochistan near the Afghan border, historically famous for Pakistan's nuclear tests.",
    f: ["Highest Point: Koh-i-Sultan", "Location: Chagai, Balochistan", "Historic Event: Youm-e-Takbir (1998)"],
    peaks: [],
  },
  {
    id: "raskoh",
    n: "Ras Koh Range",
    u: "راس کوہ",
    c: [28.5, 65.2],
    z: 9,
    color: "#2dd4bf",
    spine: [[28.9, 64.9], [28.6, 65.3], [28.3, 65.7]],
    d: "A granite mountain range in Balochistan separating the Chagai desert from the Kharan basin.",
    f: ["Meaning: Gateway Hills", "Highest Peak: Ras Koh Peak (3,003 m)", "Region: Kharan / Chagai, Balochistan"],
    peaks: [{ n: "Ras Koh Peak", h: 3003, c: [28.6, 65.3] }],
  },
];

const PROVINCES = [
  { id: "punjab", n: "Punjab", u: "پنجاب", c: [31.2, 72.7], z: 7, d: "Pakistan's most populous province and agricultural heartland, watered by five rivers.", f: ["Capital: Lahore", "Rivers: Jhelum, Chenab, Ravi, Sutlej"] },
  { id: "sindh", n: "Sindh", u: "سندھ", c: [26.0, 68.5], z: 7, d: "Southern province along the Indus and the Arabian Sea, home of Karachi, Kot Diji, and Mohenjo-Daro.", f: ["Capital: Karachi", "Coast: Arabian Sea"] },
  { id: "kp", n: "Khyber Pakhtunkhwa", u: "خیبر پختونخوا", c: [34.5, 72.0], z: 7, d: "North-western province of mountains and valleys on the Afghan border, with historic Gandhara sites.", f: ["Capital: Peshawar", "Border: Afghanistan"] },
  { id: "balochistan", n: "Balochistan", u: "بلوچستان", c: [28.5, 65.5], z: 6, d: "Largest province by area: dry mountainous region hosting the ancient Mehrgarh civilization.", f: ["Capital: Quetta", "Site: Mehrgarh (Bolan Pass)"] },
  { id: "gb", n: "Gilgit-Baltistan", u: "گلگت بلتستان", c: [35.8, 74.8], z: 7, d: "Northern region holding peaks of Karakoram, Himalaya and Hindu Kush, including K2.", f: ["Capital: Gilgit", "Home of K2"] },
  { id: "ajk", n: "Azad Jammu & Kashmir", u: "آزاد جموں و کشمیر", c: [34.0, 73.7], z: 8, d: "Pakistan-administered territory of green valleys along the Jhelum river.", f: ["Capital: Muzaffarabad", "River: Jhelum"] },
  { id: "ict", n: "Islamabad Capital Territory", u: "اسلام آباد", c: [33.68, 73.05], z: 10, d: "Federal capital territory at the foot of Margalla Hills.", f: ["Capital: Islamabad"] },
];

const KIND = { ranges: "Mountain Range", civilizations: "Ancient Civilization", provinces: "Province" };

const LOCAL = [
  ...CIVILIZATIONS.map((c) => ({ ...c, kind: KIND.civilizations })),
  ...RANGES.map((r) => ({ ...r, kind: KIND.ranges })),
  ...PROVINCES.map((p) => ({ ...p, kind: KIND.provinces })),
];

const PEAKS = RANGES.flatMap((r) => r.peaks.map((p) => ({ ...p, range: r })));

const PK_BOUNDS = [
  [23.5, 60.8],
  [37.1, 77.9],
];

const MAP_TYPES = [
  ["google_satellite", "Google Satellite"],
  ["google_hybrid", "Google Hybrid"],
  ["google_terrain", "Google Terrain"],
  ["google_roadmap", "Google Maps"],
];

const PIN = L.divIcon({
  className: "",
  html: '<span class="pk-pin"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const rangeBounds = (r) => L.latLngBounds(r.spine);

/* ---------- MAIN APP COMPONENT ---------- */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("civilizations");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState("");
  const [mapType, setMapType] = useState("google_hybrid");
  const [showRanges, setShowRanges] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const tilesRef = useRef(null);
  const markerRef = useRef(null);
  const rangeLayersRef = useRef({});
  const peakLayerRef = useRef(null);
  const labelLayerRef = useRef(null);
  const pickRef = useRef(() => {});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  /* TEXT TO SPEECH NARRATOR ENGINE */
  const toggleAudio = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  /* Initialize Map Engine with DIRECT GOOGLE MAPS TILE SERVERS */
  useEffect(() => {
    if (loading || !boxRef.current) return;
    const map = L.map(boxRef.current, {
      zoomControl: false,
      minZoom: 5,
      maxZoom: 18,
      zoomSnap: 1,
      maxBounds: [
        [18, 55],
        [41, 83],
      ],
      maxBoundsViscosity: 0.8,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    map.fitBounds(PK_BOUNDS, { paddingTopLeft: [10, 70], paddingBottomRight: [10, 10] });

    // Official Direct Google Maps Tile Engines
    tilesRef.current = {
      google_satellite: L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "&copy; Google Maps Satellite",
      }),
      google_hybrid: L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "&copy; Google Maps Hybrid",
      }),
      google_terrain: L.tileLayer("https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "&copy; Google Maps Terrain",
      }),
      google_roadmap: L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "&copy; Google Maps",
      }),
    };

    /* Range layers setup */
    const rangeGroup = L.layerGroup();
    const layers = {};
    RANGES.forEach((r) => {
      const common = { lineCap: "round", lineJoin: "round", smoothFactor: 1.5 };
      const glow = L.polyline(r.spine, { ...common, color: r.color, weight: 26, opacity: 0.14 });
      const mid = L.polyline(r.spine, { ...common, color: r.color, weight: 12, opacity: 0.3 });
      const line = L.polyline(r.spine, {
        ...common,
        color: r.color,
        weight: 2.5,
        opacity: 0.95,
        dashArray: "1 7",
      });
      const group = L.featureGroup([glow, mid, line]);
      group.on("click", () => pickRef.current({ ...r, kind: KIND.ranges }));
      group.on("mouseover", () => mid.setStyle({ opacity: 0.5 }));
      group.on("mouseout", () => layers[r.id] && styleRange(r.id, false));
      group.bindTooltip(`${r.n}`, { sticky: true, className: "pk-tip" });
      layers[r.id] = { glow, mid, line, group };
    });
    rangeLayersRef.current = layers;
    rangeLayersRef.current.__group = rangeGroup;

    /* Range labels */
    const labels = L.layerGroup();
    RANGES.forEach((r) => {
      const mid = r.spine[Math.floor(r.spine.length / 2)];
      L.marker(mid, {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: "",
          html: `<div class="pk-label" style="color:${r.color}">${r.n.replace(" Range", "")}</div>`,
          iconSize: [0, 0],
        }),
      }).addTo(labels);
    });
    labelLayerRef.current = labels;

    /* Peak markers */
    const peaks = L.layerGroup();
    PEAKS.forEach((p) => {
      const icon = L.divIcon({
        className: "",
        iconSize: [0, 0],
        html: `<div class="pk-peak"><svg viewBox="0 0 24 20" width="20" height="17"><path d="M12 1 L23 19 H1 Z" fill="${p.range.color}" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 1 L16 8 L12 6.5 L8 8 Z" fill="#fff"/></svg><span>${p.n} <b>${p.h.toLocaleString()} m</b></span></div>`,
      });
      L.marker(p.c, { icon, keyboard: false })
        .on("click", () => pickRef.current({ ...p.range, kind: KIND.ranges }))
        .addTo(peaks);
    });
    peakLayerRef.current = peaks;

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      rangeLayersRef.current = {};
      peakLayerRef.current = null;
      labelLayerRef.current = null;
    };
  }, [loading]);

  /* Switch Google Map Tiles */
  useEffect(() => {
    const map = mapRef.current,
      tiles = tilesRef.current;
    if (!map || !tiles) return;
    Object.values(tiles).forEach((l) => map.removeLayer(l));
    tiles[mapType].addTo(map);
  }, [mapType, loading]);

  /* Toggle Range Belts Layer */
  useEffect(() => {
    const map = mapRef.current;
    const layers = rangeLayersRef.current;
    const lab = labelLayerRef.current;
    const peaks = peakLayerRef.current;
    if (!map) return;

    if (showRanges) {
      Object.values(layers).forEach((l) => l.group && map.addLayer(l.group));
      if (map.getZoom() <= 10) lab?.addTo(map);
      if (map.getZoom() >= 7) peaks?.addTo(map);
    } else {
      Object.values(layers).forEach((l) => l.group && map.removeLayer(l.group));
      lab && map.removeLayer(lab);
      peaks && map.removeLayer(peaks);
    }
  }, [showRanges, loading]);

  const styleRange = (id, active) => {
    const l = rangeLayersRef.current[id];
    if (!l) return;
    l.glow.setStyle({ weight: active ? 40 : 26, opacity: active ? 0.28 : 0.14 });
    l.mid.setStyle({ weight: active ? 18 : 12, opacity: active ? 0.55 : 0.3 });
    l.line.setStyle({ weight: active ? 3.5 : 2.5, dashArray: active ? null : "1 7" });
  };

  /* Selected pin + range highlighting */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markerRef.current?.remove();
    markerRef.current = null;

    if (sel?.spine) {
      setShowRanges(true);
    }

    RANGES.forEach((r) => styleRange(r.id, sel?.id === r.id));
    if (sel && !sel.spine) {
      markerRef.current = L.marker(sel.c, { icon: PIN, keyboard: false }).addTo(map);
    }
  }, [sel, loading]);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const local = LOCAL.filter((d) => d.n.toLowerCase().includes(s) || d.u.includes(s));
    const peaks = PEAKS.filter((p) => p.n.toLowerCase().includes(s)).map((p) => ({
      id: `peak-${p.n}`,
      n: p.n,
      u: "",
      kind: "Peak",
      c: p.c,
      z: 11,
      d: `${p.n} (${p.h.toLocaleString()} m) is part of the ${p.range.n}.`,
      f: [`Height: ${p.h.toLocaleString()} m`, `Range: ${p.range.n}`],
    }));
    return [...local, ...peaks].slice(0, 6);
  }, [q]);

  const pick = (item) => {
    setSel(item);
    setMenuOpen(false);
    setQ("");
    if (isSpeaking) window.speechSynthesis.cancel();
    const map = mapRef.current;
    if (!map) return;
    if (item.spine) {
      setShowRanges(true);
      map.flyToBounds(rangeBounds(item), {
        maxZoom: item.z,
        padding: [90, 90],
        duration: 1.8,
      });
    } else {
      map.flyTo(item.c, item.z, { duration: 1.8 });
    }
  };
  pickRef.current = pick;

  const closeCard = () => {
    if (isSpeaking) window.speechSynthesis.cancel();
    setSel(null);
    mapRef.current?.flyToBounds(PK_BOUNDS, {
      duration: 1.5,
      paddingTopLeft: [10, 70],
      paddingBottomRight: [10, 10],
    });
  };

  const search = async () => {
    const s = q.trim();
    if (!s) return;
    if (matches[0]) return pick(matches[0]);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=pk&limit=1&accept-language=en&q=${encodeURIComponent(s)}`;
      const res = await (await fetch(url)).json();
      if (!res.length) return setMsg("No place found in Pakistan.");
      const r = res[0],
        [s0, n0, w0, e0] = r.boundingbox.map(Number);
      setSel({
        n: r.name || s,
        u: "",
        kind: "Search result",
        d: r.display_name,
        f: [],
        c: [Number(r.lat), Number(r.lon)],
      });
      mapRef.current?.flyToBounds(
        [
          [s0, w0],
          [n0, e0],
        ],
        { maxZoom: 13, duration: 1.8 }
      );
      setQ("");
    } catch {
      setMsg("Search failed.");
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 select-none">
        <Loader />
        <div className="text-center">
          <h2 className="text-emerald-400 font-extrabold text-xl tracking-wider">
            CIVILIZATIONS OF PAKISTAN
          </h2>
          <p className="text-slate-400 text-xs mt-1 animate-pulse">
            Connecting Google Satellite Engine & Historical Archives...
          </p>
        </div>
      </div>
    );
  }

  const glass = "bg-slate-900/80 backdrop-blur-xl border border-slate-700/60";
  const selRange = sel?.spine ? sel : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      <div ref={boxRef} className="absolute inset-0 z-0 bg-slate-950" />

      {/* TOP HEADER BAR */}
      <header className="absolute top-0 inset-x-0 z-10 p-3 flex items-start gap-3 pointer-events-none">
        <div className="flex-1 basis-0 min-w-0 flex">
          <div className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl pl-3 pr-3 sm:pr-4 py-2 ${glass}`}>
            <Flag />
            <span className="hidden sm:block font-bold tracking-tight text-white">Civilizations of Pakistan</span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-[2] min-w-0 max-w-md pointer-events-auto relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="relative"
          >
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Mehrgarh, Taxila, Karakoram..."
              className={`w-full rounded-2xl pl-10 pr-3 py-3 text-sm outline-none focus:border-emerald-500 placeholder:text-slate-400 text-white ${glass}`}
            />
          </form>
          {(matches.length > 0 || msg) && (
            <div className={`mt-1 rounded-2xl overflow-hidden ${glass}`}>
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => pick(m)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-slate-800"
                >
                  <span>
                    {m.n} <span className="text-xs text-emerald-400 font-mono">[{m.kind}]</span>
                  </span>
                  <span className="text-xs text-slate-400" dir="rtl">
                    {m.u}
                  </span>
                </button>
              ))}
              {msg && <p className="px-4 py-2.5 text-sm text-amber-300">{msg}</p>}
            </div>
          )}
        </div>

        {/* HAMBURGER TOGGLE */}
        <div className="flex-1 basis-0 min-w-0 flex justify-end">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className={`pointer-events-auto w-11 h-11 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition ${glass}`}
          >
            {menuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* HAMBURGER SLIDE MENU */}
      {menuOpen && (
        <nav
          className={`absolute top-[4.25rem] right-3 z-20 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl overflow-hidden animate-drop ${glass} bg-slate-900/95`}
        >
          <div className="flex border-b border-slate-700/60">
            {[
              ["civilizations", "Ancient Civilizations"],
              ["ranges", "10 Mountain Ranges"],
              ["provinces", "Provinces"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 py-3 text-[11px] font-bold border-b-2 transition ${
                  tab === id
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="max-h-[60vh] overflow-y-auto py-1">
            {(tab === "ranges" ? RANGES : tab === "civilizations" ? CIVILIZATIONS : PROVINCES).map((it) => (
              <li key={it.id}>
                <button
                  onClick={() => pick({ ...it, kind: KIND[tab] })}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-sm text-left hover:bg-slate-800 ${
                    sel?.id === it.id ? "text-emerald-400 font-bold" : ""
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {it.color && (
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: it.color }} />
                    )}
                    {it.n}
                  </span>
                  <span className="text-slate-400" dir="rtl">
                    {it.u}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* LEFT CONTROLS: GOOGLE MAPS LAYERS */}
      <div className="absolute top-[4.25rem] left-3 z-10 flex flex-col gap-2 items-start">
        <div className={`flex rounded-xl overflow-hidden text-xs font-semibold ${glass}`}>
          {MAP_TYPES.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMapType(id)}
              className={`px-3 py-2 transition ${
                mapType === id ? "bg-emerald-500 text-slate-950 font-bold" : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowRanges((v) => !v)}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${glass} ${
            showRanges
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <Mountain className="w-4 h-4" />
          {showRanges ? "Hide Mountain Ranges" : "Show Mountain Ranges"}
        </button>

        {showRanges && (
          <button
            onClick={() => setLegendOpen((v) => !v)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition ${glass}`}
          >
            <Layers className="w-4 h-4" />
            Legend
          </button>
        )}

        {showRanges && legendOpen && (
          <ul className={`rounded-xl p-2.5 text-[11px] space-y-1.5 animate-drop ${glass} bg-slate-900/95`}>
            {RANGES.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => pick({ ...r, kind: KIND.ranges })}
                  className="flex items-center gap-2 hover:text-white text-slate-300"
                >
                  <span className="w-6 h-1.5 rounded-full" style={{ background: r.color }} />
                  {r.n}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT SLIDE DRAWER */}
      {sel && (
        <aside
          className={`absolute top-0 right-0 bottom-0 w-full md:w-[440px] z-30 p-6 flex flex-col justify-between overflow-y-auto animate-slide-left ${glass} bg-slate-900/95 shadow-2xl`}
          style={{ borderLeftColor: (selRange?.color || "#10b981") + "88" }}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={closeCard}
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/50"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Full Map
              </button>
              <button onClick={closeCard} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                {sel.kind}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2">{sel.n}</h2>
              {sel.u && <p className="text-sm text-emerald-400 font-serif mt-0.5">{sel.u}</p>}
            </div>

            {/* AUDIO GUIDE PLAYER */}
            <div className="mt-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between">
              <button
                onClick={() => toggleAudio(sel.d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  isSpeaking
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? "Stop Voice Guide" : "Listen Audio Guide"}</span>
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Historical Overview
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                  {sel.d}
                </p>
              </div>

              {sel.f.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Facts & Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sel.f.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-emerald-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selRange?.peaks?.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-xs font-bold text-slate-400 mb-2">Major Peaks in Range</p>
                  <div className="flex flex-wrap gap-2">
                    {selRange.peaks.map((p) => (
                      <button
                        key={p.n}
                        onClick={() => mapRef.current?.flyTo(p.c, 11, { duration: 1.5 })}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border bg-slate-950/40 hover:bg-slate-800 transition"
                        style={{ borderColor: selRange.color + "88", color: selRange.color }}
                      >
                        {p.n} · {p.h.toLocaleString()} m
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={closeCard}
            className="mt-6 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            Close Panel & Explore Map
          </button>
        </aside>
      )}

      {/* CUSTOM CSS & ANIMATIONS */}
      <style>{`
        .leaflet-container { background: #020617; font-family: inherit; }
        .pk-pin { display: block; width: 22px; height: 22px; border-radius: 50%; background: #10b981; border: 3px solid #fff; box-shadow: 0 0 0 0 #10b981; animation: pkpulse 1.6s infinite; }
        @keyframes pkpulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.8); } 100% { box-shadow: 0 0 0 18px rgba(16,185,129,0); } }
        
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-left { animation: slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-drop { animation: drop .25s ease-out; }
        @keyframes drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

        .pk-label { position: absolute; transform: translate(-50%, -50%); white-space: nowrap; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-shadow: 0 0 4px #000, 0 0 8px #000, 0 1px 2px #000; pointer-events: none; }
        .pk-peak { position: absolute; transform: translate(-10px, -16px); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-size: 11px; font-weight: 600; color: #fff; text-shadow: 0 0 3px #000, 0 0 6px #000; cursor: pointer; }
        .pk-tip { background: rgba(15,23,42,.92); color: #fff; border: 1px solid #334155; border-radius: 8px; font-weight: 700; font-size: 12px; }
      `}</style>
    </div>
  );
}