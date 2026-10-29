import { useCallback, useEffect, useRef, useState } from "react";
import {
  hasFirebaseConfig,
  saveOverride,
  subscribeToOverrides,
} from "../lib/firebase";


export default function useInfoOverrides() {
  const [overrides, setOverrides] = useState({});
  const pendingRef = useRef({});


  useEffect(() => {
    const unsubscribe = hasFirebaseConfig
      ? subscribeToOverrides(
          (next) => {
            setOverrides((current) => {
              const pending = pendingRef.current;
              const merged = { ...next };
              Object.keys(pending).forEach((id) => {
                if (!(id in merged)) merged[id] = pending[id];
              });
              return merged;
            });
          },
          (error) => {
            console.error("Unable to subscribe to shared content overrides.", error);
          },
        )
      : () => {};

    return () => {
      unsubscribe();
    };
  }, []);


  const save = useCallback((id, data) => {
    if (data) pendingRef.current[id] = data;
    else delete pendingRef.current[id];
    setOverrides((current) => {
      const next = { ...current };
      if (data) next[id] = data;
      else delete next[id];
      return next;
    });

    return saveOverride(id, data)
      .then(() => {
        delete pendingRef.current[id];
      })
      .catch((error) => {
        delete pendingRef.current[id];
        console.error("Unable to save shared content override.", error);
        throw error;
      });
  }, []);


  const merge = useCallback(
    (item) => {
      const o = item?.id ? overrides[item.id] : null;
      return o
        ? {
            ...item,
            d: o.d ?? item.d,
            f: o.f ?? item.f,
            image: o.image ?? item.image,
            gallery: o.gallery ?? item.gallery,
          }
        : item;
    },
    [overrides],
  );

  return { save, merge };
}
