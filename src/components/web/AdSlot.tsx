// Reserved placement for future ad networks (AdSense, Meta Audience, sponsored
// listings). Renders nothing in production by default — opt in per project by
// setting VITE_ADS_ENABLED=true. The slot keeps layout stable when ads ship.
const adsEnabled = (import.meta as any).env?.VITE_ADS_ENABLED === "true";

export function AdSlot({ id, format = "banner", className = "" }: { id: string; format?: "banner" | "card" | "inline"; className?: string }) {
  if (!adsEnabled) return null;
  const sizing = format === "banner" ? "h-24" : format === "card" ? "h-64" : "h-16";
  return (
    <div data-ad-slot={id} className={`w-full ${sizing} rounded-2xl ring-1 ring-dashed ring-zinc-300 bg-zinc-50 grid place-items-center ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">Sponsored · {id}</span>
    </div>
  );
}
