import { useCallback, useEffect, useState } from "react";
import {
  hasFirebaseConfig,
  saveOverride,
  subscribeToOverrides,
} from "../lib/firebase";

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

  // Keep local tabs in sync and subscribe to the shared store when configured.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setOverrides(read());
    };
    window.addEventListener("storage", onStorage);

    const unsubscribe = hasFirebaseConfig
      ? subscribeToOverrides(
          (next) => {
            setOverrides(next);
            try {
              localStorage.setItem(KEY, JSON.stringify(next));
            } catch (error) {
              console.error("Unable to cache shared content overrides.", error);
            }
          },
          (error) => {
            console.error("Unable to subscribe to shared content overrides.", error);
          },
        )
      : () => {};

    return () => {
      window.removeEventListener("storage", onStorage);
      unsubscribe();
    };
  }, []);

  // data = { d, f } -> save. data = null -> remove edit.
  const save = useCallback((id, data) => {
    const next = read();
    if (data) next[id] = data;
    else delete next[id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Unable to cache content override locally.", error);
    }
    setOverrides(next);

    return saveOverride(id, data).catch((error) => {
      console.error("Unable to save shared content override.", error);
      throw error;
    });
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
