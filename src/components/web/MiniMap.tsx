import { ExternalLink, Navigation2, MapPin } from "lucide-react";

// Lightweight OpenStreetMap embed — no JS deps, SSR-safe.
// `lat`/`lng` mark the vendor. Distance + walking time are estimated from a
// fixed campus origin so the demo stays deterministic.
const CAMPUS_ORIGIN = { lat: 22.3149, lng: 87.3105 }; // IIT Kharagpur main gate, mock origin

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function MiniMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const delta = 0.003;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const directions = `https://www.openstreetmap.org/directions?from=${CAMPUS_ORIGIN.lat},${CAMPUS_ORIGIN.lng}&to=${lat},${lng}&engine=fossgis_osrm_foot`;
  const fullMap = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
  const km = haversineKm(CAMPUS_ORIGIN, { lat, lng });
  const walkMin = Math.max(1, Math.round((km * 1000) / 80)); // 80 m/min ≈ 4.8 km/h

  return (
    <div className="bg-white ring-1 ring-zinc-200 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg tracking-tight flex items-center gap-2"><MapPin className="size-4 text-zinc-700" /> Location</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{name}</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-mono font-bold text-zinc-900">{km.toFixed(2)} km</p>
          <p className="text-zinc-500">~{walkMin} min walk</p>
        </div>
      </div>
      <iframe
        title={`Map of ${name}`}
        src={src}
        loading="lazy"
        className="w-full h-56 border-0"
      />
      <div className="p-3 flex gap-2">
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-zinc-900 text-zinc-50 py-2.5 rounded-xl text-xs font-semibold"
        >
          <Navigation2 className="size-3.5" /> Directions
        </a>
        <a
          href={fullMap}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 ring-1 ring-zinc-300 text-zinc-700 px-3 py-2.5 rounded-xl text-xs font-semibold"
        >
          <ExternalLink className="size-3.5" /> Full map
        </a>
      </div>
    </div>
  );
}
