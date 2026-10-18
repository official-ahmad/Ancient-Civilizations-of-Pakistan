import { useCallback, useEffect, useState } from "react";

/*
  Stores edited information in the browser (localStorage), so it stays after reload.
  Shape:  { [itemId]: { d: "description", f: ["fact 1", "fact 2"] } }
*/
const KEY = "pk-info-overrides-v1";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    return {};
  }
};

export default function useInfoOverrides() {
  const [overrides, setOverrides] = useState(read);

  // keep other open tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setOverrides(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // data = { d, f }  -> save.   data = null -> remove edit (back to original)
  const save = useCallback((id, data) => {
    const next = read();
    if (data) next[id] = data;
    else delete next[id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked / full */
    }
    setOverrides(next);
  }, []);

  // returns the item with edited text applied (if any)
  const merge = useCallback(
    (item) => {
      const o = item?.id ? overrides[item.id] : null;
      return o ? { ...item, d: o.d ?? item.d, f: o.f ?? item.f } : item;
    },
    [overrides],
  );

  return { save, merge };
}
