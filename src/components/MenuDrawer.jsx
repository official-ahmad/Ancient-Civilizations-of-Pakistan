// import React from "react";
// import {
//   CIVILIZATIONS,
//   RANGES,
//   RIVERS,
//   DESERTS,
//   CLIMATE_DATA,
//   PROVINCES,
//   KIND,
// } from "../data/mapData";

// export default function MenuDrawer({ glass, tab, setTab, sel, pick }) {
//   const getTabItems = () => {
//     switch (tab) {
//       case "civilizations":
//         return CIVILIZATIONS;
//       case "ranges":
//         return RANGES;
//       case "rivers":
//         return RIVERS;
//       case "punjab_rivers":
//         return RIVERS.filter((r) => r.isPunjab);
//       case "deserts":
//         return DESERTS;
//       case "climate":
//         return CLIMATE_DATA;
//       case "provinces":
//         return PROVINCES;
//       default:
//         return CIVILIZATIONS;
//     }
//   };

//   return (
//     <nav
//       className={`absolute top-[4.25rem] right-3 z-20 w-88 max-w-[calc(100vw-1.5rem)] rounded-2xl overflow-hidden animate-drop ${glass} bg-slate-900/95`}
//     >
//       <div className="flex flex-wrap border-b border-slate-700/60 bg-slate-950/40 p-1 gap-1">
//         {[
//           ["civilizations", "Civilizations"],
//           ["ranges", "10 Ranges"],
//           ["rivers", "Pak Rivers"],
//           ["punjab_rivers", "Punjab Rivers"],
//           ["deserts", "Deserts"],
//           ["climate", "Climate Change"],
//         ].map(([id, label]) => (
//           <button
//             key={id}
//             onClick={() => setTab(id)}
//             className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
//               tab === id
//                 ? "bg-emerald-500 text-slate-950"
//                 : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       <ul className="max-h-[55vh] overflow-y-auto py-1">
//         {getTabItems().map((it) => (
//           <li key={it.id}>
//             <button
//               onClick={() => pick({ ...it, kind: KIND[tab] || it.kind })}
//               className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs text-left hover:bg-slate-800 ${
//                 sel?.id === it.id ? "text-emerald-400 font-bold" : ""
//               }`}
//             >
//               <span className="flex items-center gap-2.5">
//                 {it.color && (
//                   <span
//                     className="w-2.5 h-2.5 rounded-full shrink-0"
//                     style={{ background: it.color }}
//                   />
//                 )}
//                 {it.n}
//               </span>
//               <span className="text-slate-400 font-serif" dir="rtl">
//                 {it.u}
//               </span>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }

import React, { useMemo } from "react";
import {
  CIVILIZATIONS,
  RANGES,
  RIVERS,
  DESERTS,
  CLIMATE_DATA,
  CLIMATE_ZONES,
  PROVINCES,
  TABS,
  TAB_KIND,
} from "../data/mapData";

export default function MenuDrawer({ glass, tab, setTab, sel, pick }) {
  const items = useMemo(() => {
    switch (tab) {
      case "ranges":
        return RANGES;
      case "rivers":
        return RIVERS;
      case "punjab_rivers":
        return RIVERS.filter((r) => r.isPunjab);
      case "deserts":
        return DESERTS;
      case "climate":
        return [...CLIMATE_ZONES, ...CLIMATE_DATA];
      case "provinces":
        return PROVINCES;
      default:
        return CIVILIZATIONS;
    }
  }, [tab]);

  return (
    <nav
      className={`absolute top-[4.5rem] left-2.5 right-2.5 sm:left-auto sm:right-3 sm:w-[22rem] z-40 rounded-2xl overflow-hidden anim-drop ${glass} bg-slate-900/95 shadow-2xl`}
    >
      {/* TABS (scroll sideways on small screens) */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-slate-700/60 bg-slate-950/40 p-1.5">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
              tab === id
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="max-h-[60vh] sm:max-h-[55vh] overflow-y-auto overscroll-contain py-1">
        {items.map((it) => (
          <li key={it.id}>
            <button
              onClick={() => pick({ ...it, kind: TAB_KIND[tab] })}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-left hover:bg-slate-800 transition ${
                sel?.id === it.id
                  ? "text-emerald-400 font-bold"
                  : "text-slate-200"
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                {it.color && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: it.color }}
                  />
                )}
                <span className="truncate">{it.n}</span>
              </span>
              <span className="text-slate-400 font-serif shrink-0" dir="rtl">
                {it.u}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
