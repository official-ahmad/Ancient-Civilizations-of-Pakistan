import { useEffect, useState } from "react";
import { PK_BORDER_FALLBACK } from "../data/borderFallback";
import { polygonsOf } from "../utils/geo";

const CACHE_KEY = "pk-border-v2";


const SOURCES = [
  {
    url: "https://nominatim.openstreetmap.org/search?q=Pakistan&featuretype=country&format=jsonv2&polygon_geojson=1&polygon_threshold=0.001&limit=1",
    pick: (json) => json?.[0]?.geojson,
  },
  {
    url: "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries/PAK.geo.json",
    pick: (json) => json,
  },
];

const isValid = (geo) => polygonsOf(geo).length > 0;

export default function usePakistanBorder() {
  const [state, setState] = useState({
    border: PK_BORDER_FALLBACK,
    approx: true,
  });

  useEffect(() => {
    let dead = false;
    const done = (border) => !dead && setState({ border, approx: false });

    (async () => {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (isValid(cached)) return done(cached);
      } catch {

      }

      for (const src of SOURCES) {
        try {
          const res = await fetch(src.url);
          if (!res.ok) continue;
          const geo = src.pick(await res.json());
          if (!isValid(geo)) continue;
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(geo));
          } catch {

          }
          return done(geo);
        } catch {

        }
      }
    })();

    return () => {
      dead = true;
    };
  }, []);

  return state;
}
