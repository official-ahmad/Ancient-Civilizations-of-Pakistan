







































































































































import React, { useState } from "react";
import {
  Mountain,
  Waves,
  Sun,
  Landmark,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  MAP_TYPES,
  RANGES,
  RIVERS,
  DESERTS,
  CLIMATE_ZONES,
  KIND,
} from "../data/mapData";

const TONES = {
  emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/60",
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/60",
  amber: "bg-amber-500/20 text-amber-300 border-amber-500/60",
  yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/60",
};

function Toggle({ glass, on, onClick, Icon, label, tone }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${glass} ${
        on ? `${TONES[tone]} shadow-lg` : "text-slate-300 hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4" />
      {on ? `Hide ${label}` : `Show ${label}`}
    </button>
  );
}

export default function MapControls({
  glass,
  mapType,
  setMapType,
  showRanges,
  setShowRanges,
  showRivers,
  setShowRivers,
  showDeserts,
  setShowDeserts,
  showCiv,
  setShowCiv,
  showClimate,
  setShowClimate,
  pick,
}) {
  const [open, setOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const anyOn = showRanges || showRivers || showDeserts || showClimate;

  return (
    <div className="absolute top-[4.5rem] left-2.5 sm:left-3 z-10 flex flex-col gap-2 items-start max-w-[calc(100vw-1.25rem)]">
      {}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`md:hidden flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 ${glass}`}
      >
        <Layers className="w-4 h-4 text-emerald-400" />
        Layers
        <ChevronDown
          className={`w-3.5 h-3.5 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`${open ? "flex" : "hidden"} md:flex flex-col gap-2 items-start`}
      >
        {}
        <div
          className={`grid grid-cols-2 md:flex rounded-xl overflow-hidden text-xs font-semibold ${glass}`}
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

        <Toggle
          glass={glass}
          on={showCiv}
          onClick={() => setShowCiv((v) => !v)}
          Icon={Landmark}
          label="Civilizations"
          tone="yellow"
        />
        <Toggle
          glass={glass}
          on={showRanges}
          onClick={() => setShowRanges((v) => !v)}
          Icon={Mountain}
          label="Ranges"
          tone="emerald"
        />
        <Toggle
          glass={glass}
          on={showRivers}
          onClick={() => setShowRivers((v) => !v)}
          Icon={Waves}
          label="Rivers"
          tone="cyan"
        />

        <Toggle
          glass={glass}
          on={showDeserts}
          onClick={() => setShowDeserts((v) => !v)}
          Icon={Sun}
          label="Deserts"
          tone="amber"
        />
        <Toggle
          glass={glass}
          on={showClimate}
          onClick={() => setShowClimate((v) => !v)}
          Icon={Layers}
          label="Climate Zones"
          tone="cyan"
        />

        {anyOn && (
          <button
            onClick={() => setLegendOpen((v) => !v)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition ${glass}`}
          >
            <Layers className="w-4 h-4" />
            Map Legend
          </button>
        )}

        {anyOn && legendOpen && (
          <div
            className={`rounded-xl p-3 text-[11px] space-y-2 max-h-56 overflow-y-auto anim-drop ${glass} bg-slate-900/95`}
          >
            {showRanges && (
              <LegendGroup
                title="Mountain Ranges"
                items={RANGES}
                kind={KIND.ranges}
                pick={pick}
              />
            )}
            {showRivers && (
              <LegendGroup
                title="Rivers"
                items={RIVERS}
                kind={KIND.rivers}
                pick={pick}
              />
            )}
            {showDeserts && (
              <LegendGroup
                title="Deserts"
                items={DESERTS}
                kind={KIND.deserts}
                pick={pick}
              />
            )}
            {showClimate && (
              <LegendGroup
                title="Climatic Zones"
                items={CLIMATE_ZONES}
                kind={KIND.climate}
                pick={pick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LegendGroup({ title, items, kind, pick }) {
  return (
    <div>
      <p className="font-bold text-slate-400 mb-1">{title}</p>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => pick({ ...it, kind })}
          className="flex items-center gap-2 hover:text-white text-slate-300 py-0.5 w-full text-left"
        >
          <span
            className="w-4 h-1 rounded-full shrink-0"
            style={{ background: it.color }}
          />
          {it.n}
        </button>
      ))}
    </div>
  );
}
