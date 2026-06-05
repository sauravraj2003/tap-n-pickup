import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { lastToken } from "@/lib/token";

export const Route = createFileRoute("/order/tracking")({
  component: Tracking,
});

const stages = [
  { name: "Order received", time: "12:42 PM", state: "done" },
  { name: "Preparing your meal", time: "Est. 6 min left", state: "active" },
  { name: "Almost ready", time: "Step into line", state: "todo" },
  { name: "Ready for pickup", time: "Counter 02", state: "todo" },
] as const;

function Tracking() {
  const tokenStr = String(lastToken()).padStart(3, "0");
  return (
    <MobileFrame dark>
      <div className="bg-zinc-950 text-zinc-50 flex-1 flex flex-col">
        <TopBar title="Live order" />
        <div className="flex-1 overflow-y-auto px-7 pb-8">
          <div className="text-center mt-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Your token</span>
            <div className="text-7xl font-mono tracking-tighter mt-1">#{tokenStr}</div>
            <p className="text-xs text-zinc-500 mt-2">Queue position · 2nd in line · 6 min left</p>
          </div>

          <div className="mt-12 relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />
            <div className="space-y-10">
              {stages.map((s, i) => (
                <div key={i} className="flex items-start gap-5 relative z-10">
                  <div
                    className={`size-4 rounded-full ring-4 ring-zinc-950 mt-0.5 ${
                      s.state === "done" ? "bg-zinc-500" : s.state === "active" ? "bg-zinc-50 animate-pulse" : "bg-zinc-800"
                    }`}
                  />
                  <div className={`flex flex-col ${s.state === "todo" ? "opacity-40" : ""}`}>
                    <span className={`text-sm font-medium ${s.state === "active" ? "text-zinc-50" : "text-zinc-300"}`}>{s.name}</span>
                    <span className="text-[11px] text-zinc-500 mt-0.5">{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 p-4 bg-zinc-900 ring-1 ring-white/10 rounded-2xl">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Pickup at</p>
            <p className="text-sm font-semibold">The Artisan Deli · Counter 02</p>
            <p className="text-xs text-zinc-500 mt-1">Floor 2 · South Atrium</p>
          </div>

          <Link to="/order/pickup" className="mt-6 block w-full bg-zinc-50 text-zinc-900 py-4 rounded-2xl font-medium text-sm text-center">
            Simulate "Ready for pickup"
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
}
