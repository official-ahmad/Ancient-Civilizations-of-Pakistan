/* Small geometry helpers (all points are [lat, lng] unless noted) */

// Smooths a rough polyline into a natural looking curve (keeps start & end)
export const chaikin = (pts, iter = 2) => {
  let p = pts;
  for (let k = 0; k < iter; k++) {
    const out = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i];
      const b = p[i + 1];
      out.push(
        [0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]],
        [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]],
      );
    }
    out.push(p[p.length - 1]);
    p = out;
  }
  return p;
};

// Turns a bounding box into an organic blob (used for deserts instead of ugly rectangles)
export const blob = ([[s, w], [n, e]], seed = 1, steps = 44) => {
  const cy = (s + n) / 2;
  const cx = (w + e) / 2;
  const ry = (n - s) / 2;
  const rx = (e - w) / 2;
  return Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    const wob =
      1 + 0.09 * Math.sin(3 * t + seed) + 0.06 * Math.sin(5 * t + seed * 2);
    return [cy + ry * wob * Math.sin(t), cx + rx * wob * Math.cos(t)];
  });
};

// GeoJSON (Feature / FeatureCollection / geometry) -> list of polygons.
// polygon = [ring, ring...], ring = [[lng, lat], ...]
export const polygonsOf = (geo) => {
  const geoms =
    geo?.type === "FeatureCollection"
      ? geo.features.map((f) => f.geometry)
      : geo?.type === "Feature"
        ? [geo.geometry]
        : geo
          ? [geo]
          : [];
  return geoms.flatMap((g) =>
    g?.type === "Polygon"
      ? [g.coordinates]
      : g?.type === "MultiPolygon"
        ? g.coordinates
        : [],
  );
};

// Big rectangle with Pakistan cut out -> used to softly dim everything outside Pakistan
export const outsideMask = (geo) => {
  const world = [
    [-85, -180],
    [-85, 180],
    [85, 180],
    [85, -180],
  ];
  const holes = polygonsOf(geo).map((poly) =>
    poly[0].map(([lng, lat]) => [lat, lng]),
  );
  return [world, ...holes];
};
