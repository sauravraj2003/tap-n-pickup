import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useAuth, useOrders } from "@/lib/store";

export function ActiveTicketWidget() {
  const { user } = useAuth();
  const { active } = useOrders();
  const order = user ? active(user.id) : undefined;
  const [, force] = useState(0);

  useEffect(() => {
    if (!order) return;
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [order]);

  if (!order) return null;

  const secondsLeft =
    order.status === "pending" ? Math.max(0, Math.floor((order.acceptDeadline - Date.now()) / 1000)) : null;
  const statusLabel = {
    pending: secondsLeft !== null ? `Awaiting accept · ${secondsLeft}s` : "Awaiting accept",
    accepted: `Accepted · ETA ${order.etaMinutes}m`,
    preparing: `Preparing · ETA ${order.etaMinutes}m`,
    ready: "Ready · pick up now",
  }[order.status as "pending" | "accepted" | "preparing" | "ready"];

  return (
    <Link
      to="/track"
      className="fixed bottom-6 right-6 z-40 bg-zinc-900 text-zinc-50 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 hover:bg-zinc-800 transition-colors animate-rise"
    >
      <div className="size-10 rounded-xl bg-amber-300 text-zinc-900 grid place-items-center">
        <Clock className="size-5" />
      </div>
      <div className="text-xs">
        <div className="font-mono uppercase tracking-widest text-zinc-400">Token #{String(order.token).padStart(3, "0")}</div>
        <div className="font-semibold text-sm">{statusLabel}</div>
      </div>
    </Link>
  );
}
