// import React from "react";
// import { Mountain, Waves, Sun, Layers } from "lucide-react";
// import { MAP_TYPES, RANGES, RIVERS, DESERTS, KIND } from "../data/mapData";

// export default function MapControls({
//   glass,
//   mapType,
//   setMapType,
//   showRanges,
//   setShowRanges,
//   showRivers,
//   setShowRivers,
//   showDeserts,
//   setShowDeserts,
//   legendOpen,
//   setLegendOpen,
//   pick,
// }) {
//   return (
//     <div className="absolute top-[4.25rem] left-3 z-10 flex flex-col gap-2 items-start">
//       {/* MAP ENGINE TYPE */}
//       <div
//         className={`flex rounded-xl overflow-hidden text-xs font-semibold ${glass}`}
//       >
//         {MAP_TYPES.map(([id, label]) => (
//           <button
//             key={id}
//             onClick={() => setMapType(id)}
//             className={`px-3 py-2 transition ${
//               mapType === id
//                 ? "bg-emerald-500 text-slate-950 font-bold"
//                 : "hover:bg-slate-800 text-slate-300"
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* RANGES TOGGLE */}
//       <button
//         onClick={() => setShowRanges((v) => !v)}
//         className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${glass} ${
//           showRanges
//             ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/60 shadow-lg"
//             : "text-slate-300 hover:text-white"
//         }`}
//       >
//         <Mountain className="w-4 h-4" />
//         {showRanges ? "Hide Ranges" : "Show Ranges"}
//       </button>

//       {/* RIVERS TOGGLE */}
//       <button
//         onClick={() => setShowRivers((v) => !v)}
//         className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${glass} ${
//           showRivers
//             ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/60 shadow-lg"
//             : "text-slate-300 hover:text-white"
//         }`}
//       >
//         <Waves className="w-4 h-4" />
//         {showRivers ? "Hide Rivers" : "Show Rivers"}
//       </button>

//       {/* DESERTS TOGGLE */}
//       <button
//         onClick={() => setShowDeserts((v) => !v)}
//         className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${glass} ${
//           showDeserts
//             ? "bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-lg"
//             : "text-slate-300 hover:text-white"
//         }`}
//       >
//         <Sun className="w-4 h-4" />
//         {showDeserts ? "Hide Deserts" : "Show Deserts"}
//       </button>

//       {/* LEGEND */}
//       {(showRanges || showRivers || showDeserts) && (
//         <button
//           onClick={() => setLegendOpen((v) => !v)}
//           className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition ${glass}`}
//         >
//           <Layers className="w-4 h-4" />
//           Map Legend
//         </button>
//       )}

//       {legendOpen && (
//         <div
//           className={`rounded-xl p-3 text-[11px] space-y-2 max-h-60 overflow-y-auto animate-drop ${glass} bg-slate-900/95`}
//         >
//           {showRanges && (
//             <div>
//               <p className="font-bold text-slate-400 mb-1">Mountain Ranges</p>
//               {RANGES.map((r) => (
//                 <button
//                   key={r.id}
//                   onClick={() => pick({ ...r, kind: KIND.ranges })}
//                   className="flex items-center gap-2 hover:text-white text-slate-300 block py-0.5"
//                 >
//                   <span
//                     className="w-4 h-1 rounded-full"
//                     style={{ background: r.color }}
//                   />
//                   {r.n}
//                 </button>
//               ))}
//             </div>
//           )}

//           {showRivers && (
//             <div>
//               <p className="font-bold text-slate-400 mb-1 mt-2">Rivers</p>
//               {RIVERS.map((rv) => (
//                 <button
//                   key={rv.id}
//                   onClick={() => pick({ ...rv, kind: KIND.rivers })}
//                   className="flex items-center gap-2 hover:text-white text-slate-300 block py-0.5"
//                 >
//                   <span
//                     className="w-4 h-1 rounded-full"
//                     style={{ background: rv.color }}
//                   />
//                   {rv.n}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

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
  const [open, setOpen] = useState(false); // phones only
  const [legendOpen, setLegendOpen] = useState(false);
  const anyOn = showRanges || showRivers || showDeserts || showClimate;

  return (
    <div className="absolute top-[4.5rem] left-2.5 sm:left-3 z-10 flex flex-col gap-2 items-start max-w-[calc(100vw-1.25rem)]">
      {/* PHONE: one compact button that opens the panel */}
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
        {/* BASE MAP */}
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
