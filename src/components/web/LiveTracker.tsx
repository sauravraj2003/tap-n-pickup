import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { Order } from "@/lib/store";

const STAGES: { key: Order["status"]; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
];

export function LiveTracker({ order }: { order: Order }) {
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const activeIdx = STAGES.findIndex((s) => s.key === order.status);
  const isPending = order.status === "pending";
  const secondsLeft = Math.max(0, Math.floor((order.acceptDeadline - Date.now()) / 1000));

  return (
    <div>
      {/* progress bar */}
      <div className="flex items-center">
        {STAGES.map((s, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <div key={s.key} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`size-10 rounded-full grid place-items-center font-bold text-sm transition-colors ${
                    done
                      ? "bg-emerald-600 text-zinc-50"
                      : active
                        ? "bg-zinc-900 text-zinc-50 ring-4 ring-zinc-200"
                        : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </div>
                <span className={`text-xs mt-2 font-semibold ${active || done ? "text-zinc-900" : "text-zinc-400"}`}>{s.label}</span>
              </div>
              {i < STAGES.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full ${i < activeIdx ? "bg-emerald-600" : "bg-zinc-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* big token / status display */}
      <div className="mt-10 bg-zinc-900 text-zinc-50 rounded-3xl p-8 sm:p-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Your token</p>
        <p className="text-[100px] sm:text-[140px] font-mono tracking-tighter leading-none mt-2">
          #{String(order.token).padStart(3, "0")}
        </p>
        <p className="text-sm text-zinc-400 mt-4">
          {order.vendorName} · {order.lines.length} item{order.lines.length === 1 ? "" : "s"}
        </p>

        {isPending && (
          <div className="mt-8 mx-auto max-w-sm">
            <p className="text-xs uppercase tracking-widest text-amber-300 font-mono">Vendor must accept in</p>
            <p className="text-5xl font-mono mt-2 text-amber-200">{secondsLeft}s</p>
            <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-300 transition-all duration-1000"
                style={{ width: `${(secondsLeft / 60) * 100}%` }}
              />
            </div>
          </div>
        )}

        {!isPending && order.status !== "ready" && (
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">ETA</p>
              <p className="text-2xl font-semibold mt-1">{order.etaMinutes}m</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Queue position</p>
              <p className="text-2xl font-semibold mt-1">#{order.queuePosition}</p>
            </div>
          </div>
        )}

        {order.status === "ready" && (
          <div className="mt-8 inline-block px-6 py-3 bg-emerald-500 text-zinc-900 rounded-2xl font-bold">
            Ready for pickup — head to counter
          </div>
        )}
      </div>
    </div>
  );
}
