import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { TopNav } from "@/components/web/TopNav";
import { LiveTracker } from "@/components/web/LiveTracker";
import { useAuth, useOrders } from "@/lib/store";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Live Tracker — BookIt" }] }),
  component: Track,
});

function Track() {
  const { user } = useAuth();
  const { active, update } = useOrders();
  const router = useRouter();
  const order = user ? active(user.id) : undefined;
  const notified = useRef<Record<string, boolean>>({});

  // Simulated state progression. Auto-cancels pending orders if not accepted in 60s for demo;
  // merchant dashboard can also flip status. Once accepted → preparing → ready.
  useEffect(() => {
    if (!order) return;
    const tick = setInterval(() => {
      const now = Date.now();
      if (order.status === "accepted" && now - order.createdAt > 75_000) {
        update(order.id, { status: "preparing" });
      }
      if (order.status === "preparing" && now - order.createdAt > 75_000 + order.etaMinutes * 1000) {
        update(order.id, { status: "ready" });
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [order, update]);

  // Notifications
  useEffect(() => {
    if (!order) return;
    const key = `${order.id}-${order.status}`;
    if (notified.current[key]) return;
    notified.current[key] = true;
    if (order.status === "accepted") toast.success(`Order accepted by ${order.vendorName}`);
    if (order.status === "preparing") toast(`Your order is being prepared — ${order.etaMinutes} min ETA`);
    if (order.status === "ready") toast.success("Your order is ready! Start walking 🏃");
    if (order.status === "rejected") toast.error("Order was rejected. Refund issued.");
  }, [order?.status, order?.id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <TopNav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight">No active order</h1>
          <p className="text-zinc-600 mt-2">Place an order to see the live tracker.</p>
          <Link to="/home" className="mt-6 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">Browse canteens</Link>
        </div>
      </div>
    );
  }

  const canCancel = order.status === "pending";

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <LiveTracker order={order} />
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {canCancel && (
            <button
              onClick={() => {
                update(order.id, { status: "cancelled" });
                toast("Order cancelled · refund issued");
                router.navigate({ to: "/home" });
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold ring-1 ring-rose-300 text-rose-700 hover:bg-rose-50"
            >
              Cancel before accepted
            </button>
          )}
          <Link to="/home" className="px-5 py-2.5 rounded-xl text-sm font-semibold ring-1 ring-zinc-300 text-zinc-700 hover:bg-white">
            Order something else
          </Link>
        </div>
      </div>
    </div>
  );
}
