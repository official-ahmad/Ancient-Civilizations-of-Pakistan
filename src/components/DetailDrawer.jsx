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
  Share2,
  MapPin,
  Star,
} from "lucide-react";




const EDIT_PIN = import.meta.env.VITE_EDIT_PIN || "1234";
import toast from "react-hot-toast";

const isPreviewImage = (url) =>
  !url || url.includes("images.unsplash.com") || url === "/images.jpg";

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
  relatedItems,
  onSelectRelated,
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
  const [tab, setTab] = useState("overview");
  const [activeImage, setActiveImage] = useState(sel.image || "");
  const [draftImage, setDraftImage] = useState(sel.image || "");
  const [draftGallery, setDraftGallery] = useState(sel.gallery || []);

  useEffect(() => {
    setActiveImage(sel.image || "");
  }, [sel.id, sel.n, sel.image]);


  useEffect(() => {
    setEditing(false);
    setAskPin(false);
    setPin("");
    setNotice(null);
  }, [sel.id]);

  const sharePlace = async () => {
    const text = `${sel.n} - ${sel.kind}`;
    try {
      if (navigator.share) await navigator.share({ title: sel.n, text });
      else {
        await navigator.clipboard.writeText(`${text}${sel.c ? ` (${sel.c.join(", ")})` : ""}`);
        toast.success("Place details copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") toast.error("Unable to share this place");
    }
  };

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
    setDraftImage(isPreviewImage(sel.image) ? "" : sel.image || "");
    setDraftGallery((sel.gallery || []).filter((url) => !isPreviewImage(url)));
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
    setDraftImage(isPreviewImage(original.image) ? "" : original.image || "");
    setDraftGallery((original.gallery || []).filter((url) => !isPreviewImage(url)));
  };

  const cleanD = draftD.trim();
  const cleanF = draftF.map((s) => s.trim()).filter(Boolean);
  const cleanImage = draftImage.trim();
  const cleanGallery = draftGallery.map((s) => s.trim()).filter(Boolean);
  const galleryImages = [
    editing
      ? draftImage
      : isPreviewImage(activeImage)
        ? ""
        : activeImage,
    ...(editing
      ? draftGallery
      : (sel.gallery || []).filter((url) => !isPreviewImage(url))),
  ]
    .filter((url, index, list) => url && list.indexOf(url) === index)
    .slice(0, 5);
  const changed =
    cleanD !== (sel.d || "").trim() ||
    !same(cleanF, facts) ||
    cleanImage !== (sel.image || "") ||
    !same(cleanGallery, sel.gallery || []);

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

      setEditing(false);
      toast.error("Wrong PIN. Changes were NOT saved.");
      return;
    }

    const backToOriginal =
      cleanD === (original.d || "").trim() &&
      same(cleanF, originalFacts) &&
      cleanImage === (original.image || "") &&
      same(cleanGallery, original.gallery || []);
    onSaveInfo(
      sel.id,
      backToOriginal
        ? null
        : { d: cleanD, f: cleanF, image: cleanImage, gallery: cleanGallery },
    )
      .then(() => {
          setActiveImage(cleanImage || cleanGallery[0] || "/images.jpg");
          setEditing(false);
          toast.success("Information saved successfully");
      })
      .catch((error) => {
        const reason =
          error?.code === "permission-denied"
            ? "Firestore permission denied. Publish the contentOverrides rule."
            : "Information could not be saved. Please try again.";
        toast.error(reason);
      });
  };

  const field =
    "w-full rounded-xl bg-slate-950/70 border border-slate-700 focus:border-emerald-500 outline-none px-3 py-2 text-[13px] text-white placeholder:text-slate-500";

  return (
    <aside
      className={`drawer-anim absolute z-30 inset-x-0 bottom-0 max-h-[72vh] rounded-t-3xl lg:inset-x-auto lg:top-0 lg:left-0 lg:bottom-0 lg:w-[430px] lg:max-h-none lg:rounded-none flex flex-col ${glass} bg-slate-900/95 shadow-2xl`}
      style={{ borderColor: accent + "77" }}
    >
      {}
      <div className="lg:hidden flex justify-center pt-2">
        <span className="w-10 h-1 rounded-full bg-slate-600" />
      </div>

      {}
      <div className="relative h-44 shrink-0 overflow-hidden border-b border-slate-800">
        <img
          src={activeImage || "/images.jpg"}
          alt=""
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = "/images.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 pt-3">
          <button
            onClick={closeCard}
            className="rounded-full bg-slate-950/70 p-2 text-white backdrop-blur hover:bg-slate-900"
            aria-label="Back to full map"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={closeCard}
            aria-label="Close"
            className="rounded-full bg-slate-950/70 p-2 text-white backdrop-blur hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-3 px-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            {sel.kind}
          </span>
          <h2 className="mt-1 text-2xl font-extrabold text-white">{sel.n}</h2>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-1 text-xs text-amber-300">
          <Star className="h-4 w-4 fill-current" />
          <span>Historical reference</span>
        </div>
        <button
          onClick={sharePlace}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-3 pb-2">
        <button
          onClick={() => setTab("overview")}
          className={`border-b-2 px-2 py-2 text-xs font-bold ${tab === "overview" ? "border-emerald-400 text-emerald-300" : "border-transparent text-slate-400"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("related")}
          className={`border-b-2 px-2 py-2 text-xs font-bold ${tab === "related" ? "border-emerald-400 text-emerald-300" : "border-transparent text-slate-400"}`}
        >
          Nearby & related
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4">
        <section className="mb-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            More pictures
          </h3>
          {editable && !editing && (
            <button
              onClick={startEdit}
              className="mb-3 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              Edit pictures and add exact location photos
            </button>
          )}
          <div className="grid grid-cols-3 gap-2">
            {galleryImages.map((url) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(url)}
                    className="h-20 overflow-hidden rounded-lg border border-slate-800 hover:border-emerald-400"
                  >
                    <img
                      src={url}
                      alt={`${sel.n} picture`}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.parentElement?.remove();
                      }}
                    />
                  </button>
            ))}
          </div>
          {galleryImages.length === 0 && !editing && (
            <p className="rounded-lg border border-slate-800 px-3 py-4 text-center text-xs text-slate-500">
              No pictures added yet. Add exact location photos below.
            </p>
          )}
          {editing && (
            <div className="mt-3 space-y-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <input
                value={draftImage}
                onChange={(event) => setDraftImage(event.target.value)}
                placeholder="Main image URL"
                className={field}
              />
              {draftGallery.map((url, index) => (
                <div key={`${url}-${index}`} className="flex gap-2">
                  <input
                    value={url}
                    onChange={(event) =>
                      setDraftGallery((items) =>
                        items.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      )
                    }
                    placeholder={`Gallery image ${index + 1} URL`}
                    className={field}
                  />
                  <button
                    onClick={() =>
                      setDraftGallery((items) =>
                        items.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="rounded-xl border border-slate-700 px-3 text-red-400"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setDraftGallery((items) => [...items, ""])}
                className="flex items-center gap-1 text-xs font-bold text-emerald-400"
              >
                <Plus className="h-4 w-4" /> Add image URL
              </button>
            </div>
          )}
        </section>
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

        {tab === "overview" && <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
          style={{
            color: accent,
            borderColor: accent + "55",
            background: accent + "18",
          }}
        >
          {sel.kind}
        </span>}
        {tab === "overview" && <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2 leading-tight">{sel.n}</h2>}
        {tab === "overview" && sel.u && (
          <p
            className="text-base text-emerald-400 font-serif mt-1"
            dir="rtl"
            lang="ur"
          >
            {sel.u}
          </p>
        )}

        {tab === "overview" && !editing && sel.d && (
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

        {tab === "related" ? (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Nearby places and map features</h3>
            {relatedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectRelated(item)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-left hover:bg-slate-800"
              >
                <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  <strong className="block text-sm text-white">{item.n}</strong>
                  <small className="text-xs text-slate-400">{item.kind}</small>
                </span>
              </button>
            ))}
          </div>
        ) : <div className="mt-5 space-y-5">
          {}
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

          {}
          {!editing && !sel.d && editable && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-3 py-2 rounded-xl border border-emerald-800/50 hover:bg-slate-800 transition"
            >
              <Pencil className="w-3.5 h-3.5" /> Add information
            </button>
          )}

          {}
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

          {}
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
        </div>}
      </div>

      {}
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

      {}
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
              placeholder="••••••••••"
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
