import { useEffect, useState } from "react";

const CACHE_KEY = "pk-admin-boundaries-v1";

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") || {};
  } catch {
    return {};
  }
};

export default function useSelectedAdminBoundary(item) {
  const [boundary, setBoundary] = useState(null);

  useEffect(() => {
    if (!item?.c) {
      setBoundary(null);
      return undefined;
    }

    let cancelled = false;
    const cache = readCache();
    const key = item.id || `${item.c[0]},${item.c[1]}`;
    if (cache[key]) {
      setBoundary(cache[key]);
      return undefined;
    }

    const load = async () => {
      try {
        const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${item.c[0]}&lon=${item.c[1]}&zoom=10&polygon_geojson=1`;
        const reverse = await fetch(reverseUrl).then((response) => {
          if (!response.ok) throw new Error(`Reverse geocode failed: ${response.status}`);
          return response.json();
        });
        const address = reverse.address || {};
        const area = address.county || address.state_district || address.state;
        if (!area) throw new Error("No administrative area found.");

        const forwardUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&polygon_geojson=1&countrycodes=pk&q=${encodeURIComponent(`${area}, Pakistan`)}`;
        const results = await fetch(forwardUrl).then((response) => {
          if (!response.ok) throw new Error(`Boundary lookup failed: ${response.status}`);
          return response.json();
        });
        const geo = results[0]?.geojson;
        if (!geo || cancelled) return;
        const nextCache = { ...cache, [key]: geo };
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(nextCache));
        } catch (error) {
          console.error("Unable to cache administrative boundary.", error);
        }
        setBoundary(geo);
      } catch (error) {
        console.error("Unable to load selected administrative boundary.", error);
        if (!cancelled) setBoundary(null);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [item]);

  return boundary;
}
