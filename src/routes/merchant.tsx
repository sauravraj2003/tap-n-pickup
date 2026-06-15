import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, Clock } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { useAuth, useOrders, useVendorQueue, type Order } from "@/lib/store";
import { getVendor } from "@/lib/campus-data";

export const Route = createFileRoute("/merchant")({
  head: () => ({ meta: [{ title: "Merchant Dashboard — BookIt" }] }),
  component: Merchant,
});

function Merchant() {
  const { user } = useAuth();
  const { orders, byVendor, update } = useOrders();
  const { queues, set } = useVendorQueue();

  if (!user) {
    return <Gate title="Sign in to access the Merchant Dashboard" cta="Sign in" to="/signin" />;
  }
  if (user.role === "merchant_pending") {
    return <Gate title="Your application is pending admin approval" cta="Back home" to="/home" />;
  }
  if (user.role !== "merchant") {
    return <Gate title="You don't have a Merchant Dashboard yet" cta="Apply as merchant" to="/apply" />;
  }

  // For demo: merchant manages first canteen they don't yet have a real vendorId for.
  const vendorId = user.vendorId ?? "hall-1-canteen";
  const vendor = getVendor(vendorId);
  const myOrders = byVendor(vendorId);
  const incoming = myOrders.filter((o) => o.status === "pending");
  const inProgress = myOrders.filter((o) => ["accepted", "preparing"].includes(o.status));
  const queueValue = queues[vendorId] ?? vendor?.queue ?? 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
            <p className="text-zinc-600 text-sm mt-1">{vendor?.name} · managing as {user.name}</p>
          </div>
          <div className="bg-white ring-1 ring-zinc-200 rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Live queue</span>
            <div className="inline-flex items-center bg-zinc-100 rounded-lg">
              <button onClick={() => set(vendorId, Math.max(0, queueValue - 1))} className="size-9 grid place-items-center font-bold">−</button>
              <span className="w-10 text-center font-mono font-bold">{queueValue}</span>
              <button onClick={() => set(vendorId, queueValue + 1)} className="size-9 grid place-items-center font-bold">+</button>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Incoming orders</h2>
          {incoming.length === 0 ? (
            <p className="text-sm text-zinc-500 bg-white ring-1 ring-zinc-200 rounded-2xl p-6">No new orders waiting.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {incoming.map((o) => <IncomingCard key={o.id} order={o} onAccept={() => update(o.id, { status: "accepted" })} onReject={() => { update(o.id, { status: "rejected" }); toast.error(`Order #${o.token} rejected`); }} />)}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">In progress</h2>
          {inProgress.length === 0 ? (
            <p className="text-sm text-zinc-500 bg-white ring-1 ring-zinc-200 rounded-2xl p-6">Nothing in the kitchen right now.</p>
          ) : (
            <div className="space-y-3">
              {inProgress.map((o) => (
                <div key={o.id} className="bg-white ring-1 ring-zinc-200 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-bold font-mono">#{String(o.token).padStart(3, "0")}</p>
                    <p className="text-xs text-zinc-500">{o.userName} · {o.lines.length} item{o.lines.length === 1 ? "" : "s"} · ₹{o.total}</p>
                  </div>
                  <div className="flex gap-2">
                    {o.status === "accepted" && (
                      <button onClick={() => update(o.id, { status: "preparing" })} className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-50 text-xs font-semibold">Start preparing</button>
                    )}
                    {o.status === "preparing" && (
                      <button onClick={() => { update(o.id, { status: "ready" }); toast.success(`Order #${o.token} marked ready`); }} className="px-4 py-2 rounded-lg bg-emerald-600 text-zinc-50 text-xs font-semibold">Mark ready</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function IncomingCard({ order, onAccept, onReject }: { order: Order; onAccept: () => void; onReject: () => void }) {
  // 1-minute acceptance timer
  const secondsLeft = Math.max(0, Math.floor((order.acceptDeadline - Date.now()) / 1000));
  useEffect(() => {
    const t = setInterval(() => {/* re-render every 1s via parent */}, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-white ring-1 ring-zinc-200 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold font-mono">#{String(order.token).padStart(3, "0")}</p>
          <p className="text-xs text-zinc-500">{order.userName}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Auto-reject in</p>
          <p className="font-mono text-amber-700 font-bold flex items-center gap-1 justify-end"><Clock className="size-3" /> {secondsLeft}s</p>
        </div>
      </div>
      <ul className="mt-3 text-sm space-y-1">
        {order.lines.map((l) => (
          <li key={l.id} className="flex justify-between">
            <span>{l.qty} × {l.name}</span>
            <span className="font-mono">₹{l.price * l.qty}</span>
          </li>
        ))}
      </ul>
      {order.lines.some((l) => l.notes) && (
        <p className="mt-2 text-[11px] text-amber-700 italic">Notes: {order.lines.filter(l => l.notes).map(l => `"${l.notes}"`).join(", ")}</p>
      )}
      <div className="mt-4 flex gap-2">
        <button onClick={onAccept} className="flex-1 bg-zinc-900 text-zinc-50 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-1.5"><Check className="size-4" /> Accept</button>
        <button onClick={onReject} className="px-4 py-2.5 rounded-lg ring-1 ring-zinc-300 text-zinc-700 text-sm font-semibold inline-flex items-center gap-1.5"><X className="size-4" /> Reject</button>
      </div>
    </div>
  );
}

function Gate({ title, cta, to }: { title: string; cta: string; to: string }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link to={to} className="mt-4 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">{cta}</Link>
      </div>
    </div>
  );
}
