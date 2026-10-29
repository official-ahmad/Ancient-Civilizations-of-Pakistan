import React, { useRef } from "react";
import { Menu, X } from "lucide-react";
import Flag from "./Flag";

export default function Header({
  glass,
  q,
  setQ,
  search,
  matches,
  msg,
  pick,
  menuOpen,
  setMenuOpen,
}) {
  const inputRef = useRef(null);

  return (
    <header className="absolute top-0 inset-x-0 z-20 p-2.5 sm:p-3 flex items-start justify-between gap-2 pointer-events-none">
      {}
      <div
        className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl px-3 py-2 shrink-0 ${glass}`}
      >
        <Flag />
        <div className="hidden sm:block leading-tight">
          <p className="font-extrabold text-white text-sm tracking-tight">
            Civilizations of Pakistan
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">
            History &amp; Geography Explorer
          </p>
        </div>
      </div>

      {}
      <div className="flex items-start gap-2 min-w-0 flex-1 justify-end">
        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            onClick={() => inputRef.current?.focus()}
            className={`search-pill pointer-events-auto group ${q ? "is-open" : ""}`}
          >
            <div className="search-pill__icon fill-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Isolation_Mode"
                data-name="Isolation Mode"
                viewBox="0 0 24 24"
                width={22}
                height={22}
              >
                <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search K2, Taxila, Indus..."
              aria-label="Search"
            />
          </form>

          {}
          {(matches.length > 0 || msg) && (
            <div
              className={`search-results pointer-events-auto absolute right-0 top-full mt-2 max-h-[50vh] overflow-y-auto overscroll-contain rounded-2xl anim-drop ${glass} bg-slate-900/95 shadow-2xl`}
            >
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => pick(m)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-800 transition"
                >
                  <span className="min-w-0">
                    <span className="block truncate">{m.n}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {m.kind}
                    </span>
                  </span>
                  <span className="text-xs text-slate-400 shrink-0" dir="rtl">
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

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className={`pointer-events-auto w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition ${glass}`}
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-emerald-400" />
          ) : (
            <Menu className="w-5 h-5 text-emerald-400" />
          )}
        </button>
      </div>
    </header>
  );
}
