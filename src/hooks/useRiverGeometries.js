import { useEffect, useState } from "react";

const RIVER_NAMES = [
  "Indus River",
  "Jhelum River",
  "Chenab River",
  "Ravi River",
  "Sutlej River",
  "Kabul River",
  "Gilgit River",
  "Swat River",
  "Panjkora River",
  "Zhob River",
  "Hub River",
  "Kurram River",
  "Gomal River",
  "Tochi River",
  "Hunza River",
  "Shigar River",
  "Shyok River",
  "Astore River",
  "Dasht River",
  "Hingol River",
  "Porali River",
  "Lora River",
  "Panjnad River",
];

const normalize = (name) => name.toLowerCase().replace(/\s+/g, " ").trim();

export default function useRiverGeometries() {
  const [geometries, setGeometries] = useState({});

  useEffect(() => {
    const endpoint = import.meta.env.VITE_OVERPASS_PROXY_URL;
    if (!endpoint) return undefined;

    let cancelled = false;
    const names = RIVER_NAMES.join("|");
    const query = `[out:json][timeout:30];way["waterway"="river"]["name"~"${names}"](23,60,37,78);out geom;`;

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Overpass request failed: ${response.status}`);
        return response.json();
      })
      .then((json) => {
        const next = {};
        json.elements.forEach((element) => {
          const name = element.tags?.name;
          if (!name || !element.geometry?.length) return;
          const key = normalize(name);
          const points = element.geometry.map(({ lat, lon }) => [lat, lon]);
          if (!next[key] || points.length > next[key].length) next[key] = points;
        });
        if (!cancelled) setGeometries(next);
      })
      .catch((error) => {
        console.error("Unable to load detailed river geometries.", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return geometries;
}
