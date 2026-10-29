import React, { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { Maximize2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import {
  CIVILIZATIONS,
  RANGES,
  RIVERS,
  DESERTS,
  CLIMATE_DATA,
  CLIMATE_ZONES,
  KIND,
  LOCAL,
  PEAKS,
  PK_BOUNDS,
  PIN,
  rangeBounds,
} from "./data/mapData";
import { chaikin, blob, outsideMask } from "./utils/geo";
import usePakistanBorder from "./hooks/usePakistanBorder";
import useInfoOverrides from "./hooks/useInfoOverrides";
import useRiverGeometries from "./hooks/useRiverGeometries";
import useSelectedAdminBoundary from "./hooks/useSelectedAdminBoundary";

import Loader from "./components/Loader";
import Header from "./components/Header";
import MenuDrawer from "./components/MenuDrawer";
import MapControls from "./components/MapControls";
import DetailDrawer from "./components/DetailDrawer";


const BORDER_COLOR = "#22c55e";
const DIM_OUTSIDE = true;

const gTile = (lyr, label) =>
  L.tileLayer(`https://{s}.google.com/vt/lyrs=${lyr}&x={x}&y={y}&z={z}`, {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: `&copy; ${label}`,
  });



const freeOpts = () =>
  window.innerWidth < 768
    ? { paddingTopLeft: [10, 70], paddingBottomRight: [10, 10] }
    : { paddingTopLeft: [200, 76], paddingBottomRight: [20, 20] };


const focusOpts = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w >= 1024)
    return { paddingTopLeft: [200, 90], paddingBottomRight: [460, 30] };
  return {
    paddingTopLeft: [16, 80],
    paddingBottomRight: [16, Math.round(h * 0.52)],
  };
};


const fitPakistan = (map, animate = false) => {
  map.invalidateSize(false);
  map.setMinZoom(2);
  map.fitBounds(PK_BOUNDS, { ...freeOpts(), animate });
  map.setMinZoom(Math.max(3, map.getZoom() - 1));
};

const peakIcon = (p, color) =>
  L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `<div class="pk-peak"><svg viewBox="0 0 24 20" width="18" height="15"><path d="M12 1 L23 19 H1 Z" fill="${color}" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 1 L16 8 L12 6.5 L8 8 Z" fill="#fff"/></svg><span>${p.n} <b>${p.h.toLocaleString()} m</b></span></div>`,
  });

const labelIcon = (text, color) =>
  L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `<div class="pk-label" style="color:${color}">${text}</div>`,
  });

const civIcon = (text) =>
  L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `<div class="pk-civ"><span>${text}</span></div>`,
  });

const riverLabelIcon = (text) =>
  L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `<div class="pk-river-label">${text}</div>`,
  });

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("civilizations");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState("");
  const [mapType, setMapType] = useState("google_hybrid");

  const [showRanges, setShowRanges] = useState(false);
  const [showRivers, setShowRivers] = useState(true);
  const [showDeserts, setShowDeserts] = useState(true);
  const [showCiv, setShowCiv] = useState(false);
  const [showClimate, setShowClimate] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { border, approx } = usePakistanBorder();
  const { save: saveInfo, merge } = useInfoOverrides();
  const riverGeometries = useRiverGeometries();
  const selectedAdminBoundary = useSelectedAdminBoundary(sel);

  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const tilesRef = useRef(null);
  const markerRef = useRef(null);
  const reg = useRef({});
  const pickRef = useRef(() => {});
  const stateRef = useRef({});
  stateRef.current = { showRanges, hasSel: !!sel };


  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3500);
    return () => clearTimeout(t);
  }, [msg]);


  const stopSpeech = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleAudio = (text) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) return stopSpeech();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);


  useEffect(() => {
    if (loading || !boxRef.current) return;

    const map = L.map(boxRef.current, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 18,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 90,
      maxBounds: [
        [17, 54],
        [42, 84],
      ],
      maxBoundsViscosity: 1,
      worldCopyJump: false,
    });

    L.control.zoom({ position: "bottomleft" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);


    [
      ["mask", 250],
      ["deserts", 410],
      ["ranges", 420],
      ["rivers", 430],
      ["border", 450],
    ].forEach(([name, z]) => {
      const p = map.createPane(name);
      p.style.zIndex = z;
      if (name === "mask" || name === "border") p.style.pointerEvents = "none";
    });

    fitPakistan(map);



    let userMoved = false;
    const el = boxRef.current;
    const markMoved = () => {
      userMoved = true;
    };
    const userEvents = ["mousedown", "touchstart", "wheel"];
    userEvents.forEach((ev) =>
      el.addEventListener(ev, markMoved, { passive: true }),
    );
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
      if (!userMoved && !stateRef.current.hasSel) fitPakistan(map);
    });
    ro.observe(el);

    tilesRef.current = {
      google_satellite: gTile("s", "Google Satellite"),
      google_hybrid: gTile("y", "Google Hybrid"),
      google_terrain: gTile("p", "Google Terrain"),
      google_roadmap: gTile("m", "Google Maps"),
    };


    const makeLine = (item, pane, widths) => {
      const pts = chaikin(item.spine);
      const base = { pane, lineCap: "round", lineJoin: "round" };
      const glow = L.polyline(pts, {
        ...base,
        color: item.color,
        weight: widths[0],
        opacity: 0.18,
      });
      const mid = L.polyline(pts, {
        ...base,
        color: item.color,
        weight: widths[1],
        opacity: 0.35,
      });
      const line = L.polyline(pts, {
        ...base,
        color: item.color,
        weight: widths[2],
        opacity: 0.95,
      });
      const group = L.featureGroup([glow, mid, line]);
      group.bindTooltip(item.n, { sticky: true, className: "pk-tip" });
      return { group, glow, mid, line, color: item.color, w: widths, pts };
    };


    const rangeGroup = L.layerGroup();
    const labelsGroup = L.layerGroup();
    const peaksGroup = L.layerGroup();
    const rL = {};
    RANGES.forEach((r) => {
      const l = makeLine(r, "ranges", [18, 8, 2.5]);
      const lats = r.spine.map(([lat]) => lat);
      const lngs = r.spine.map(([, lng]) => lng);
      const latPad = Math.max((Math.max(...lats) - Math.min(...lats)) * 0.12, 0.08);
      const lngPad = Math.max((Math.max(...lngs) - Math.min(...lngs)) * 0.12, 0.08);
      l.area = L.polygon(
        [
          [Math.min(...lats) - latPad, Math.min(...lngs) - lngPad],
          [Math.min(...lats) - latPad, Math.max(...lngs) + lngPad],
          [Math.max(...lats) + latPad, Math.max(...lngs) + lngPad],
          [Math.max(...lats) + latPad, Math.min(...lngs) - lngPad],
        ],
        {
          pane: "ranges",
          color: r.color,
          weight: 1.5,
          dashArray: "3 5",
          fillColor: r.color,
          fillOpacity: 0.08,
          interactive: false,
        },
      );
      l.group.addLayer(l.area);
      l.group.on("click", () => pickRef.current({ ...r, kind: KIND.ranges }));
      l.group.addTo(rangeGroup);
      rL[r.id] = l;

      L.marker(l.pts[Math.floor(l.pts.length / 2)], {
        icon: labelIcon(r.n.replace(" Range", ""), r.color),
        interactive: false,
        keyboard: false,
      }).addTo(labelsGroup);
    });
    PEAKS.forEach((p) => {
      L.marker(p.c, { icon: peakIcon(p, p.range.color), keyboard: false })
        .on("click", () => pickRef.current({ ...p.range, kind: KIND.ranges }))
        .addTo(peaksGroup);
    });

    const riverGroup = L.layerGroup();
    const riverLabelsGroup = L.layerGroup();
    const rvL = {};
    RIVERS.forEach((rv) => {
      const l = makeLine(rv, "rivers", [3.5, 1.8, 1.05]);
      l.glow.setStyle({ opacity: 0.08 });
      l.mid.setStyle({ opacity: 0.2 });
      const label = L.marker(l.pts[Math.floor(l.pts.length / 2)], {
        icon: riverLabelIcon(rv.n.replace(" River", "")),
        interactive: false,
        keyboard: false,
      }).addTo(riverLabelsGroup);
      l.label = label;
      l.group.on("click", () => pickRef.current({ ...rv, kind: KIND.rivers }));
      l.group.addTo(riverGroup);
      rvL[rv.id] = l;
    });


    const desertGroup = L.layerGroup();
    const dL = {};
    DESERTS.forEach((d, i) => {
      const poly = L.polygon(blob(d.bounds, i + 1), {
        pane: "deserts",
        color: d.color,
        weight: 2,
        dashArray: "4 4",
        fillColor: d.color,
        fillOpacity: 0.22,
      });
      poly.bindTooltip(d.n, { sticky: true, className: "pk-tip" });
      poly.on("click", () => pickRef.current({ ...d, kind: KIND.deserts }));
      poly.addTo(desertGroup);
      dL[d.id] = poly;
    });


    const climateGroup = L.layerGroup();
    const climateLayers = {};
    CLIMATE_ZONES.forEach((zone) => {
      const polygon = L.polygon(zone.polygon, {
        pane: "deserts",
        color: zone.color,
        weight: 2,
        dashArray: zone.style === "dotted" ? "1 6" : "6 4",
        fillColor: zone.color,
        fillOpacity: zone.style === "dotted" ? 0.08 : 0.2,
      });
      polygon
        .bindTooltip(zone.n, { sticky: true, className: "pk-tip" })
        .on("click", () => pickRef.current({ ...zone, kind: KIND.climate }))
        .addTo(climateGroup);
      L.marker(zone.c, {
        icon: labelIcon(zone.n, zone.color),
        interactive: false,
        keyboard: false,
      }).addTo(climateGroup);
      climateLayers[zone.id] = polygon;
    });


    const civGroup = L.layerGroup();
    CIVILIZATIONS.forEach((c) => {
      L.marker(c.c, { icon: civIcon(c.n.split(" (")[0]), keyboard: false })
        .on("click", () => pickRef.current({ ...c, kind: KIND.civilizations }))
        .addTo(civGroup);
    });
    const pointGroup = L.layerGroup();
    [...CIVILIZATIONS, ...CLIMATE_DATA].forEach((item) => {
      (item.points || []).forEach((point) => {
        L.circleMarker(point.c, {
          pane: "border",
          radius: 5,
          color: item.color || "#fbbf24",
          weight: 2,
          fillColor: item.color || "#fbbf24",
          fillOpacity: 0.9,
        })
          .bindTooltip(point.n, { sticky: true, className: "pk-tip" })
          .on("click", () => pickRef.current({ ...item, n: point.n, c: point.c }))
          .addTo(pointGroup);
      });
    });


    const sync = () => {
      const z = map.getZoom();
      const on = stateRef.current.showRanges;
      on && z >= 6.5 ? peaksGroup.addTo(map) : map.removeLayer(peaksGroup);
      on && z <= 9.5 ? labelsGroup.addTo(map) : map.removeLayer(labelsGroup);
      const riversOn = map.hasLayer(riverGroup);
      riversOn && z <= 10.5
        ? riverLabelsGroup.addTo(map)
        : map.removeLayer(riverLabelsGroup);
    };
    map.on("zoomend", sync);

    reg.current = {
      ranges: rL,
      rivers: rvL,
      deserts: dL,
      climate: climateLayers,
      groups: {
        ranges: rangeGroup,
        rivers: riverGroup,
        riverLabels: riverLabelsGroup,
        deserts: desertGroup,
        civ: civGroup,
        points: pointGroup,
        climate: climateGroup,
      },
      sync,
    };
    mapRef.current = map;

    return () => {
      ro.disconnect();
      userEvents.forEach((ev) => el.removeEventListener(ev, markMoved));
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      reg.current = {};
    };
  }, [loading]);

  useEffect(() => {
    const R = reg.current;
    if (!R.rivers) return;
    RIVERS.forEach((river) => {
      const points =
        riverGeometries[river.n.toLowerCase()] ||
        riverGeometries[river.n.replace(" River", "").toLowerCase()];
      const layer = R.rivers[river.id];
      if (!points || !layer) return;
      layer.pts = points;
      layer.glow.setLatLngs(points);
      layer.mid.setLatLngs(points);
      layer.line.setLatLngs(points);
      layer.label.setLatLng(points[Math.floor(points.length / 2)]);
    });
  }, [riverGeometries]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !border) return;
    const grp = L.layerGroup().addTo(map);


    if (DIM_OUTSIDE && !approx) {
      L.polygon(outsideMask(border), {
        pane: "mask",
        stroke: false,
        fillColor: "#020617",
        fillOpacity: 0.5,
        interactive: false,
      }).addTo(grp);
    }


    L.geoJSON(border, {
      pane: "border",
      interactive: false,
      style: { color: BORDER_COLOR, weight: 7, opacity: 0.22, fill: false },
    }).addTo(grp);
    L.geoJSON(border, {
      pane: "border",
      interactive: false,
      style: {
        color: BORDER_COLOR,
        weight: 2,
        opacity: 1,
        fillColor: BORDER_COLOR,
        fillOpacity: 0.04,
      },
    }).addTo(grp);

    return () => grp.remove();
  }, [border, approx, loading]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedAdminBoundary) return undefined;
    const group = L.layerGroup().addTo(map);
    L.geoJSON(selectedAdminBoundary, {
      pane: "border",
      interactive: false,
      style: {
        color: "#86efac",
        weight: 2,
        opacity: 0.95,
        dashArray: "7 5",
        fillColor: "#22c55e",
        fillOpacity: 0.08,
      },
    }).addTo(group);
    return () => group.remove();
  }, [selectedAdminBoundary]);


  useEffect(() => {
    const map = mapRef.current;
    const tiles = tilesRef.current;
    if (!map || !tiles) return;
    Object.values(tiles).forEach((l) => map.removeLayer(l));
    tiles[mapType].addTo(map).bringToBack();
  }, [mapType, loading]);


  useEffect(() => {
    const map = mapRef.current;
    const R = reg.current;
    if (!map || !R.groups) return;
    const t = (g, on) => (on ? g.addTo(map) : map.removeLayer(g));
    t(R.groups.ranges, showRanges);
    t(R.groups.rivers, showRivers);
    t(R.groups.deserts, showDeserts);
    t(R.groups.civ, showCiv);
    t(R.groups.points, showCiv);
    t(R.groups.climate, showClimate);
    R.sync();
  }, [showRanges, showRivers, showDeserts, showCiv, showClimate, loading]);


  useEffect(() => {
    const R = reg.current;
    if (!R.ranges) return;
    const hot = (g, on) => {
      g.glow.setStyle({
        weight: on ? g.w[0] * 1.7 : g.w[0],
        opacity: on ? 0.4 : 0.18,
      });
      g.mid.setStyle({
        weight: on ? g.w[1] * 1.6 : g.w[1],
        opacity: on ? 0.65 : 0.35,
      });
      g.line.setStyle({
        weight: on ? g.w[2] * 1.5 : g.w[2],
        color: on ? "#ffffff" : g.color,
      });
      if (on) {
        g.glow.bringToFront();
        g.mid.bringToFront();
        g.line.bringToFront();
      }
    };
    const selectedRange = sel?.kind === KIND.ranges ? sel.id : null;
    RANGES.forEach((r) => {
      const layer = R.ranges[r.id];
      if (selectedRange && selectedRange !== r.id) {
        mapRef.current?.removeLayer(layer.group);
      } else if (showRanges) {
        layer.group.addTo(mapRef.current);
      }
      hot(layer, selectedRange === r.id);
    });
    RIVERS.forEach((r) => hot(R.rivers[r.id], sel?.id === r.id));
    DESERTS.forEach((d) =>
      R.deserts[d.id].setStyle({
        weight: sel?.id === d.id ? 3.5 : 2,
        fillOpacity: sel?.id === d.id ? 0.4 : 0.22,
      }),
    );
    CLIMATE_ZONES.forEach((zone) =>
      R.climate?.[zone.id]?.setStyle({
        weight: sel?.id === zone.id ? 4 : 2,
        fillOpacity:
          sel?.id === zone.id ? 0.38 : zone.style === "dotted" ? 0.08 : 0.2,
      }),
    );
  }, [sel, loading]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markerRef.current?.remove();
    markerRef.current = null;
    if (sel && !sel.spine && !sel.bounds && sel.c) {
      markerRef.current = L.marker(sel.c, { icon: PIN, keyboard: false }).addTo(
        map,
      );
    }
  }, [sel, loading]);


  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return LOCAL.filter(
      (d) => d.n.toLowerCase().includes(s) || d.u.includes(s),
    ).slice(0, 6);
  }, [q]);

  const search = async () => {
    const s = q.trim();
    if (!s) return;
    if (matches[0]) return pick(matches[0]);
    try {
      setMsg("Searching...");
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=pk&limit=1&accept-language=en&q=${encodeURIComponent(s)}`;
      const res = await (await fetch(url)).json();
      if (!res.length)
        return setMsg("No place found in Pakistan. Try another search.");
      const r = res[0];
      const [s0, n0, w0, e0] = r.boundingbox.map(Number);
      setMsg("");
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
        { ...focusOpts(), maxZoom: 13, duration: 1.8 },
      );
      setQ("");
    } catch {
      setMsg("Search failed. Check your connection.");
    }
  };


  const pick = (item) => {
    setSel(item);
    setMenuOpen(false);
    setQ("");
    stopSpeech();
    const map = mapRef.current;
    if (!map) return;
    const opts = { ...focusOpts(), duration: 1.8 };

    if (item.spine) {
      if (item.kind === KIND.rivers) setShowRivers(true);
      else setShowRanges(true);
      map.flyToBounds(rangeBounds(item), { ...opts, maxZoom: item.z || 9 });
    } else if (item.bounds) {
      setShowDeserts(true);
      map.flyToBounds(item.bounds, { ...opts, maxZoom: item.z || 9 });
    } else {
      if (item.kind === KIND.climate) {
        if (item.polygon) setShowClimate(true);
        else setShowCiv(true);
      }
      map.flyToBounds(L.latLng(item.c).toBounds(800), {
        ...opts,
        maxZoom: item.z || 10,
      });
    }
  };
  pickRef.current = pick;

  const closeCard = () => {
    stopSpeech();
    setSel(null);
    mapRef.current?.flyToBounds(PK_BOUNDS, { ...freeOpts(), duration: 1.5 });
  };

  const flyToPeak = (p) => {
    mapRef.current?.flyToBounds(L.latLng(p.c).toBounds(1500), {
      ...focusOpts(),
      maxZoom: 12,
      duration: 1.6,
    });
  };

  if (loading) return <Loader />;

  const glass = "bg-slate-900/80 backdrop-blur-xl border border-slate-700/60";
  const selRange = sel?.spine && sel.kind === KIND.ranges ? sel : null;
  const relatedItems = sel
    ? LOCAL.filter((item) => item.id !== sel.id && item.c)
        .sort(
          (a, b) =>
            Math.hypot(a.c[0] - sel.c[0], a.c[1] - sel.c[1]) -
            Math.hypot(b.c[0] - sel.c[0], b.c[1] - sel.c[1]),
        )
        .slice(0, 4)
    : [];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none"
      style={{ height: "100dvh" }}
    >
      <div ref={boxRef} className="absolute inset-0 z-0 bg-slate-950" />
      <Toaster
        position="top-center"
        containerStyle={{ top: 80 }}
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid #334155",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#0f172a" } },
        }}
      />
      <Header
        glass={glass}
        q={q}
        setQ={setQ}
        search={search}
        matches={matches}
        msg={msg}
        pick={pick}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {menuOpen && (
        <MenuDrawer
          glass={glass}
          tab={tab}
          setTab={setTab}
          sel={sel}
          pick={pick}
        />
      )}

      <MapControls
        glass={glass}
        mapType={mapType}
        setMapType={setMapType}
        showRanges={showRanges}
        setShowRanges={setShowRanges}
        showRivers={showRivers}
        setShowRivers={setShowRivers}
        showDeserts={showDeserts}
        setShowDeserts={setShowDeserts}
        showCiv={showCiv}
        setShowCiv={setShowCiv}
        showClimate={showClimate}
        setShowClimate={setShowClimate}
        pick={pick}
      />

      {}
      <button
        onClick={closeCard}
        aria-label="Show full Pakistan"
        title="Show full Pakistan"
        className={`absolute z-10 left-2.5 sm:left-3 bottom-14 md:bottom-[6.5rem] w-10 h-10 rounded-xl items-center justify-center text-emerald-400 hover:bg-slate-800 transition ${glass} ${
          sel ? "hidden lg:flex" : "flex"
        }`}
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {sel && (
        <DetailDrawer
          glass={glass}
          sel={merge(sel)}
          original={sel}
          onSaveInfo={saveInfo}
          selRange={selRange}
          closeCard={closeCard}
          toggleAudio={toggleAudio}
          isSpeaking={isSpeaking}
          onPeak={flyToPeak}
          relatedItems={relatedItems}
          onSelectRelated={pick}
        />
      )}
    </div>
  );
}
