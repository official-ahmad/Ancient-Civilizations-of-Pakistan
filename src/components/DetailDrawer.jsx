import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  Pencil,
  Plus,
  Trash2,
  Lock,
  RotateCcw,
} from "lucide-react";
// import { EDIT_PIN } from "../config";

  // process.env.REACT_APP_EDIT_PIN || process.env.NEXT_PUBLIC_EDIT_PIN;
  // DetailDrawer.jsx (Line 17 par)
const EDIT_PIN = import.meta.env.VITE_EDIT_PIN || "1234";
import toast from "react-hot-toast";

/*
  Phones / tablets  -> bottom sheet (map stays visible above it)
  Desktop (lg+)     -> floating card on the right, below the header

  sel      = item with edited text already applied
  original = item exactly as written in mapData.js
*/
export default function DetailDrawer({
  glass,
  sel,
  original,
  selRange,
  closeCard,
  toggleAudio,
  isSpeaking,
  onPeak,
  onSaveInfo,
}) {
  const accent = sel.color || "#10b981";
  const editable = !!sel.id;
  const facts = sel.f || [];
  const originalFacts = original.f || [];

  const [editing, setEditing] = useState(false);
  const [draftD, setDraftD] = useState("");
  const [draftF, setDraftF] = useState([]);
  const [askPin, setAskPin] = useState(false);
  const [pin, setPin] = useState("");
  const [notice, setNotice] = useState(null);

  // another item selected -> leave edit mode
  useEffect(() => {
    setEditing(false);
    setAskPin(false);
    setPin("");
    setNotice(null);
  }, [sel.id]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const edited =
    (original.d || "") !== (sel.d || "") || !same(originalFacts, facts);

  const startEdit = () => {
    setDraftD(sel.d || "");
    setDraftF([...facts]);
    setNotice(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setAskPin(false);
    setPin("");
  };

  const resetDraft = () => {
    setDraftD(original.d || "");
    setDraftF([...originalFacts]);
  };

  const cleanD = draftD.trim();
  const cleanF = draftF.map((s) => s.trim()).filter(Boolean);
  const changed = cleanD !== (sel.d || "").trim() || !same(cleanF, facts);

  const requestSave = () => {
    if (!changed) return cancelEdit();
    setPin("");
    setAskPin(true);
  };

  const confirmPin = (e) => {
    e.preventDefault();
    const ok = pin === EDIT_PIN;
    setAskPin(false);
    setPin("");

    if (!ok) {
      // wrong PIN -> changes discard, purani information wapis
      setEditing(false);
      toast.error("Wrong PIN. Changes were NOT saved.");
      return;
    }

    const backToOriginal =
      cleanD === (original.d || "").trim() && same(cleanF, originalFacts);
    onSaveInfo(sel.id, backToOriginal ? null : { d: cleanD, f: cleanF })
      .then(() => {
        setEditing(false);
        toast.success("Information saved successfully");
      })
      .catch(() => {
        toast.error("Information could not be saved. Please try again.");
      });
  };

  const field =
    "w-full rounded-xl bg-slate-950/70 border border-slate-700 focus:border-emerald-500 outline-none px-3 py-2 text-[13px] text-white placeholder:text-slate-500";

  return (
    <aside
      className={`drawer-anim absolute z-30 inset-x-0 bottom-0 max-h-[58vh] rounded-t-3xl lg:inset-x-auto lg:top-[4.75rem] lg:right-3 lg:bottom-3 lg:w-[420px] lg:max-h-none lg:rounded-2xl flex flex-col ${glass} bg-slate-900/95 shadow-2xl`}
      style={{ borderColor: accent + "77" }}
    >
      {/* drag handle (phones) */}
      <div className="lg:hidden flex justify-center pt-2">
        <span className="w-10 h-1 rounded-full bg-slate-600" />
      </div>

      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-2 lg:pt-4 pb-3 border-b border-slate-800">
        <button
          onClick={closeCard}
          className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/50 hover:bg-emerald-900/60 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Full Map
        </button>
        <button
          onClick={closeCard}
          aria-label="Close"
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4">
        {notice && (
          <div
            className={`mb-4 text-xs font-semibold px-3 py-2 rounded-xl border anim-drop ${
              notice.type === "ok"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                : "bg-red-500/15 text-red-300 border-red-500/40"
            }`}
          >
            {notice.text}
          </div>
        )}

        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
          style={{
            color: accent,
            borderColor: accent + "55",
            background: accent + "18",
          }}
        >
          {sel.kind}
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-tight">
          {sel.n}
        </h2>
        {sel.u && (
          <p
            className="text-base text-emerald-400 font-serif mt-1"
            dir="rtl"
            lang="ur"
          >
            {sel.u}
          </p>
        )}

        {!editing && sel.d && (
          <button
            onClick={() => toggleAudio(sel.d)}
            className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              isSpeaking
                ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {isSpeaking ? "Stop Voice Guide" : "Listen Audio Guide"}
          </button>
        )}

        <div className="mt-5 space-y-5">
          {/* ---------- OVERVIEW ---------- */}
          {(editing || sel.d) && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Overview
                  {!editing && edited && (
                    <span className="ml-1 text-[9px] normal-case text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      edited
                    </span>
                  )}
                </h3>
                {editable && !editing && (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit info
                  </button>
                )}
              </div>

              {editing ? (
                <textarea
                  rows={6}
                  dir="auto"
                  value={draftD}
                  onChange={(e) => setDraftD(e.target.value)}
                  placeholder="Write the overview here..."
                  className={`${field} resize-y leading-relaxed`}
                />
              ) : (
                <p
                  dir="auto"
                  className="text-[13px] text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 whitespace-pre-line"
                >
                  {sel.d}
                </p>
              )}
            </div>
          )}

          {/* If there is no overview yet, still allow editing */}
          {!editing && !sel.d && editable && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-3 py-2 rounded-xl border border-emerald-800/50 hover:bg-slate-800 transition"
            >
              <Pencil className="w-3.5 h-3.5" /> Add information
            </button>
          )}

          {/* ---------- KEY FACTS ---------- */}
          {(editing || facts.length > 0) && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Facts
              </h3>

              {editing ? (
                <div className="space-y-2">
                  {draftF.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        dir="auto"
                        value={f}
                        onChange={(e) =>
                          setDraftF((arr) =>
                            arr.map((x, j) => (j === i ? e.target.value : x)),
                          )
                        }
                        placeholder="Fact..."
                        className={field}
                      />
                      <button
                        onClick={() =>
                          setDraftF((arr) => arr.filter((_, j) => j !== i))
                        }
                        aria-label="Remove fact"
                        className="shrink-0 p-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setDraftF((arr) => [...arr, ""])}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-3 py-2 rounded-xl border border-dashed border-emerald-700/60 hover:bg-slate-800 transition"
                  >
                    <Plus className="w-4 h-4" /> Add fact
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {facts.map((f, i) => (
                    <span
                      key={i}
                      dir="auto"
                      className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-emerald-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add facts when there are none yet */}
          {!editing && facts.length === 0 && sel.d && editable && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-3 py-2 rounded-xl border border-dashed border-emerald-700/60 hover:bg-slate-800 transition"
            >
              <Plus className="w-4 h-4" /> Add facts
            </button>
          )}

          {editing && edited && (
            <button
              onClick={resetDraft}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to original text
            </button>
          )}

          {!editing && selRange?.peaks?.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-400 mb-2">
                Major Peaks (tap to fly there)
              </p>
              <div className="flex flex-wrap gap-2">
                {selRange.peaks.map((p) => (
                  <button
                    key={p.n}
                    onClick={() => onPeak(p)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border bg-slate-950/40 hover:bg-slate-800 transition"
                    style={{
                      borderColor: selRange.color + "88",
                      color: selRange.color,
                    }}
                  >
                    {p.n} · {p.h.toLocaleString()} m
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-4 sm:px-5 pb-4 pt-2">
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={requestSave}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Save changes
            </button>
          </div>
        ) : (
          <button
            onClick={closeCard}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            Close Panel &amp; Explore Map
          </button>
        )}
      </div>

      {/* PIN BOX */}
      {askPin && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm rounded-[inherit]">
          <form
            onSubmit={confirmPin}
            className="w-full max-w-[260px] rounded-2xl bg-slate-900 border border-emerald-500/40 p-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Lock className="w-4 h-4" /> Enter PIN / Password
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Needed to save your changes.
            </p>
            <input
              autoFocus
              type="password"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="mt-3 w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 outline-none px-3 py-2 text-sm text-white tracking-widest"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAskPin(false);
                  setPin("");
                }}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}
