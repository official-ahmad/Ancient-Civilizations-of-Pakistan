import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Menu, X } from "lucide-react";

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
    box-shadow:
      inset -5px -5px 25px rgba(0, 0, 0, 0.25),
      inset 5px 5px 35px rgba(0, 0, 0, 0.25);
  }
  .loader::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px dashed #444;
    box-shadow:
      inset -5px -5px 25px rgba(0, 0, 0, 0.25),
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
    to {
      transform: rotate(360deg);
    }
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
  <svg
    viewBox="0 0 30 20"
    className="w-9 h-6 rounded-sm shadow"
    aria-label="Flag of Pakistan"
  >
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

/* ---------- DATA FROM LECTURE SLIDES & GEOGRAPHY ---------- */
const CIVILIZATIONS = [
  {
    id: "mehrgarh",
    n: "Mehrgarh Civilization",
    u: "مہر گڑھ",
    c: [29.3817, 67.6181],
    z: 9,
    d: "7000 BC - 5500 BC: Oldest civilization of South Asia discovered at the foot of Bolan Pass, Balochistan. Known for mud-brick houses, agriculture (wheat/barley), dentistry (11 drilled teeth found), and Lapis Lazuli beads.",
    f: [
      "Era: 7000 BC - 5500 BC",
      "Location: Bolan Pass, Balochistan",
      "Early Dentistry: 11 drilled teeth found",
      "Oldest South Asian Civilisation",
    ],
  },
  {
    id: "kotdiji",
    n: "Kot Diji",
    u: "کوٹ ڈیجی",
    c: [27.3456, 68.7083],
    z: 10,
    d: "3300 BC - 2600 BC: Located 45 km south of Khairpur, Sindh. Pre-Harappan prosperous community with a citadel (550ft x 350ft), stone foundations, wheel-made decorated pottery, and worship of Mother Goddess.",
    f: [
      "Era: 3300 BC - 2600 BC",
      "Location: Khairpur, Sindh",
      "Structure: Citadel with defensive wall",
      "Worship: Mother Goddess of fertility",
    ],
  },
  {
    id: "indus_valley",
    n: "Indus Valley (Mohenjo-Daro & Harappa)",
    u: "وادیِ سندھ (موئن جو دڑو و ہڑپہ)",
    c: [27.3294, 68.1386],
    z: 9,
    d: "2600 BC - 1700 BC: Spanning 650,000 sq km across Harappa, Mohenjo-Daro, and Ganweriwala. World famous for urban grid planning, covered street drainage, washrooms in houses, and Priest-King artifacts.",
    f: [
      "Era: 2600 BC - 1700 BC",
      "Coverage: 650,000 sq km",
      "Feature: Grid town planning & covered drains",
      "Artifacts: Priest-King & Dancing Girl",
    ],
  },
  {
    id: "gandhara",
    n: "Gandhara Civilization (Taxila)",
    u: "گندھارا (ٹیکسلا)",
    c: [33.7463, 72.8397],
    z: 10,
    d: "600 BC - 1100 AD: 'Land of Fragrance' centered around Peshawar Valley, Taxila, and Swat. World-famous for Taxila center of learning, Greco-Buddhist art style, stupas, and monasteries.",
    f: [
      "Era: 600 BC - 1100 AD",
      "Meaning: Land of Fragrance",
      "Key Center: Taxila University & Swat",
      "Art: Greco-Roman + Buddhist fusion",
    ],
  },
];

const PROVINCES = [
  {
    id: "punjab",
    n: "Punjab",
    u: "پنجاب",
    c: [31.2, 72.7],
    z: 7,
    d: "Pakistan's most populous province and agricultural heartland, watered by five rivers.",
    f: ["Capital: Lahore", "Rivers: Jhelum, Chenab, Ravi, Sutlej"],
  },
  {
    id: "sindh",
    n: "Sindh",
    u: "سندھ",
    c: [26.0, 68.5],
    z: 7,
    d: "Southern province along the Indus and the Arabian Sea, home of Karachi, Kot Diji, and Mohenjo-Daro.",
    f: ["Capital: Karachi", "Coast: Arabian Sea"],
  },
  {
    id: "kp",
    n: "Khyber Pakhtunkhwa",
    u: "خیبر پختونخوا",
    c: [34.5, 72.0],
    z: 7,
    d: "North-western province of mountains and valleys on the Afghan border, with historic Gandhara sites.",
    f: ["Capital: Peshawar", "Border: Afghanistan"],
  },
  {
    id: "balochistan",
    n: "Balochistan",
    u: "بلوچستان",
    c: [28.5, 65.5],
    z: 6,
    d: "Largest province by area: dry mountainous region hosting the ancient Mehrgarh civilization.",
    f: ["Capital: Quetta", "Site: Mehrgarh (Bolan Pass)"],
  },
  {
    id: "gb",
    n: "Gilgit-Baltistan",
    u: "گلگت بلتستان",
    c: [35.8, 74.8],
    z: 7,
    d: "Northern region holding peaks of Karakoram, Himalaya and Hindu Kush, including K2.",
    f: ["Capital: Gilgit", "Home of K2"],
  },
  {
    id: "ajk",
    n: "Azad Jammu & Kashmir",
    u: "آزاد جموں و کشمیر",
    c: [34.0, 73.7],
    z: 8,
    d: "Pakistan-administered territory of green valleys along the Jhelum river.",
    f: ["Capital: Muzaffarabad", "River: Jhelum"],
  },
  {
    id: "ict",
    n: "Islamabad Capital Territory",
    u: "اسلام آباد",
    c: [33.68, 73.05],
    z: 10,
    d: "Federal capital territory at the foot of Margalla Hills.",
    f: ["Capital: Islamabad"],
  },
];

const RANGES = [
  {
    id: "karakoram",
    n: "Karakoram Range",
    u: "قراقرم",
    c: [35.9, 76.2],
    z: 8,
    d: "Rugged range holding K2 and several of Pakistan's five 8,000 m peaks.",
    f: ["Highest: K2, 8,611 m", "Glaciers: Baltoro, Siachen"],
  },
  {
    id: "himalaya",
    n: "Himalaya (Western)",
    u: "ہمالیہ",
    c: [35.0, 74.6],
    z: 8,
    d: "The western end of the Himalaya reaches Pakistan in Kashmir and Gilgit-Baltistan.",
    f: ["Peak: Nanga Parbat, 8,126 m"],
  },
  {
    id: "hindukush",
    n: "Hindu Kush",
    u: "ہندوکش",
    c: [36.1, 71.8],
    z: 8,
    d: "Range along the Afghan border, rising above Chitral.",
    f: ["Highest in Pakistan: Tirich Mir, 7,708 m"],
  },
  {
    id: "saltrange",
    n: "Salt Range",
    u: "کوہ نمک",
    c: [32.7, 72.7],
    z: 9,
    d: "Hill system in Punjab, famous for Khewra Salt Mine.",
    f: ["Khewra: world's famous salt mine"],
  },
  {
    id: "sulaiman",
    n: "Sulaiman Range",
    u: "کوہ سلیمان",
    c: [30.8, 70.1],
    z: 8,
    d: "Mountains between Balochistan plateau and Indus plain.",
    f: ["Peak: Takht-e-Sulaiman, 3,487 m"],
  },
  {
    id: "kirthar",
    n: "Kirthar Range",
    u: "کیرتھر",
    c: [26.2, 67.3],
    z: 8,
    d: "Range along the Sindh-Balochistan border.",
    f: ["Protected: Kirthar National Park"],
  },
  {
    id: "margalla",
    n: "Margalla Hills",
    u: "مارگلہ",
    c: [33.75, 73.05],
    z: 11,
    d: "Hills north of Islamabad with national park trails.",
    f: ["Highest: Tilla Charouni, 1,604 m"],
  },
  {
    id: "makran",
    n: "Makran Coastal Range",
    u: "مکران",
    c: [25.8, 63.6],
    z: 8,
    d: "Dry coastal range of Balochistan along the Arabian Sea.",
    f: ["Region: Makran coast"],
  },
];

const LOCAL = [
  ...CIVILIZATIONS.map((c) => ({ ...c, kind: "Ancient Civilization" })),
  ...PROVINCES.map((p) => ({ ...p, kind: "Province" })),
  ...RANGES.map((r) => ({ ...r, kind: "Mountain range" })),
];

const PK_BOUNDS = [
  [23.5, 60.8],
  [37.1, 77.9],
];

const MAP_TYPES = [
  ["hybrid", "Satellite"],
  ["terrain", "Terrain"],
  ["roadmap", "Map"],
];

const PIN = L.divIcon({
  className: "",
  html: '<span class="pk-pin"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/* ---------- APP COMPONENT ---------- */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("civilizations");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState("");
  const [mapType, setMapType] = useState("hybrid");

  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const tilesRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  /* Initialize Map */
  useEffect(() => {
    if (loading || !boxRef.current) return;
    const map = L.map(boxRef.current, {
      zoomControl: false,
      minZoom: 5,
      maxZoom: 16,
      zoomSnap: 1,
      maxBounds: [
        [18, 55],
        [41, 83],
      ],
      maxBoundsViscosity: 0.8,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    map.fitBounds(PK_BOUNDS, {
      paddingTopLeft: [10, 70],
      paddingBottomRight: [10, 10],
    });

    const esri = (p) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/${p}/MapServer/tile/{z}/{y}/{x}`;

    tilesRef.current = {
      hybrid: L.layerGroup([
        L.tileLayer(esri("World_Imagery"), {
          maxZoom: 16,
          attribution: "Imagery &copy; Esri",
        }),
        L.tileLayer(esri("Reference/World_Boundaries_and_Places"), {
          maxZoom: 16,
        }),
      ]),
      terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        maxZoom: 16,
        attribution:
          "&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap (CC-BY-SA)",
      }),
      roadmap: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 16,
        attribution: "&copy; OpenStreetMap contributors",
      }),
    };

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [loading]);

  /* Switch Map Tile Layer */
  useEffect(() => {
    const map = mapRef.current,
      tiles = tilesRef.current;
    if (!map || !tiles) return;
    Object.values(tiles).forEach((l) => map.removeLayer(l));
    tiles[mapType].addTo(map);
  }, [mapType, loading]);

  /* Add Marker Pin */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markerRef.current?.remove();
    markerRef.current = sel
      ? L.marker(sel.c, { icon: PIN, keyboard: false }).addTo(map)
      : null;
  }, [sel]);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? LOCAL.filter(
          (d) => d.n.toLowerCase().includes(s) || d.u.includes(s),
        ).slice(0, 6)
      : [];
  }, [q]);

  const pick = (item) => {
    setSel(item);
    setMenuOpen(false);
    setQ("");
    mapRef.current?.flyTo(item.c, item.z, { duration: 1.8 });
  };

  const closeCard = () => {
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
      if (!res.length)
        return setMsg("No place found in Pakistan. Try another search.");
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
        { maxZoom: 13, duration: 1.8 },
      );
      setQ("");
    } catch {
      setMsg("Search failed. Check your connection.");
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 select-none">
        <Loader />
        <div className="text-center">
          <h2 className="text-emerald-400 font-extrabold text-xl tracking-wider">
            PAKISTANPEDIA
          </h2>
          <p className="text-slate-400 text-xs mt-1 animate-pulse">
            Scanning ancient civilizations & geography...
          </p>
        </div>
      </div>
    );
  }

  const glass = "bg-slate-900/80 backdrop-blur-xl border border-slate-700/60";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      <div ref={boxRef} className="absolute inset-0 z-0 bg-slate-950" />

      {/* TOP BAR */}
      <header className="absolute top-0 inset-x-0 z-10 p-3 flex items-start gap-3 pointer-events-none">
        <div className="flex-1 basis-0 min-w-0 flex">
          <div
            className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl pl-3 pr-3 sm:pr-4 py-2 ${glass}`}
          >
            <Flag />
            <span className="hidden sm:block font-bold tracking-tight text-white">
              Pakistan
            </span>
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
              placeholder="Search Mehrgarh, Kot Diji, Taxila, Punjab..."
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
                    {m.n}{" "}
                    <span className="text-xs text-emerald-400 font-mono">
                      [{m.kind}]
                    </span>
                  </span>
                  <span className="text-xs text-slate-400" dir="rtl">
                    {m.u}
                  </span>
                </button>
              ))}
              {msg && (
                <p className="px-4 py-2.5 text-sm text-amber-300">{msg}</p>
              )}
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
            {menuOpen ? (
              <X className="w-5 h-5 text-emerald-400" />
            ) : (
              <Menu className="w-5 h-5 text-emerald-400" />
            )}
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
              ["provinces", "Provinces"],
              ["ranges", "Mountain Ranges"],
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
            {(tab === "civilizations"
              ? CIVILIZATIONS
              : tab === "provinces"
                ? PROVINCES
                : RANGES
            ).map((it) => (
              <li key={it.id}>
                <button
                  onClick={() =>
                    pick({
                      ...it,
                      kind:
                        tab === "civilizations"
                          ? "Ancient Civilization"
                          : tab === "provinces"
                            ? "Province"
                            : "Mountain range",
                    })
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-slate-800 ${
                    sel?.id === it.id ? "text-emerald-400" : ""
                  }`}
                >
                  <span>{it.n}</span>
                  <span className="text-slate-400" dir="rtl">
                    {it.u}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* MAP TYPE SWITCHER */}
      <div
        className={`absolute top-[4.25rem] left-3 z-10 flex rounded-xl overflow-hidden text-xs font-semibold ${glass}`}
      >
        {MAP_TYPES.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMapType(id)}
            className={`px-3 py-2 transition ${
              mapType === id
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* BOTTOM INFO CARD */}
      {sel && (
        <section
          className={`absolute bottom-4 left-3 right-3 md:right-auto md:w-[420px] z-10 rounded-2xl p-4 animate-drop ${glass} bg-slate-900/95 border border-emerald-500/30`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                {sel.kind}
              </p>
              <h2 className="text-xl font-extrabold leading-tight mt-0.5 text-white">
                {sel.n}
              </h2>
              {sel.u && (
                <p className="text-emerald-300 text-base mt-0.5" dir="rtl">
                  {sel.u}
                </p>
              )}
            </div>
            <button
              onClick={closeCard}
              aria-label="Close"
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mt-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            {sel.d}
          </p>

          {sel.f.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {sel.f.map((f) => (
                <span
                  key={f}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CUSTOM CSS */}
      <style>{`
        .leaflet-container { background: #020617; font-family: inherit; }
        .pk-pin { display: block; width: 20px; height: 20px; border-radius: 50%; background: #10b981; border: 3px solid #fff; box-shadow: 0 0 0 0 #10b981; animation: pkpulse 1.6s infinite; }
        @keyframes pkpulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.8); } 100% { box-shadow: 0 0 0 16px rgba(16,185,129,0); } }
        .animate-drop { animation: drop .25s ease-out; }
        @keyframes drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .animate-drop, .pk-pin { animation: none; } }
      `}</style>
    </div>
  );
}
