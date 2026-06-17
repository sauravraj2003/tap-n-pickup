import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Calendar, X, Send } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { LiveTracker } from "@/components/web/LiveTracker";
import { useAuth, useOrders } from "@/lib/store";
import { canManageToken, tokenWindowSecondsLeft, useNotifications, useTokenAudit } from "@/lib/extras";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Live Tracker — BookIt" }] }),
  component: Track,
});

function Track() {
  const { user } = useAuth();
  const { active, update } = useOrders();
  const { push } = useNotifications(user?.id);
  const { log } = useTokenAudit();
  const router = useRouter();
  const order = user ? active(user.id) : undefined;
  const notified = useRef<Record<string, boolean>>({});
  const [, force] = useState(0);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferEmail, setTransferEmail] = useState("");

  // Tick once per second so the 10-minute window counter stays live.
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!order) return;
    const tick = setInterval(() => {
      const now = Date.now();
      if (order.status === "accepted" && now - order.createdAt > 75_000) update(order.id, { status: "preparing" });
      if (order.status === "preparing" && now - order.createdAt > 75_000 + order.etaMinutes * 1000) update(order.id, { status: "ready" });
    }, 1000);
    return () => clearInterval(tick);
  }, [order, update]);

  useEffect(() => {
    if (!order || !user) return;
    const key = `${order.id}-${order.status}`;
    if (notified.current[key]) return;
    notified.current[key] = true;
    if (order.status === "accepted") { toast.success(`Order accepted by ${order.vendorName}`); push({ userId: user.id, kind: "order", title: "Order accepted", body: `${order.vendorName} accepted token #${order.token}`, href: "/track" }); }
    if (order.status === "preparing") { toast(`Your order is being prepared — ${order.etaMinutes} min ETA`); push({ userId: user.id, kind: "order", title: "Order in the kitchen", body: `ETA ${order.etaMinutes} min for token #${order.token}`, href: "/track" }); }
    if (order.status === "ready") { toast.success("Your order is ready! Start walking 🏃"); push({ userId: user.id, kind: "order", title: "Order ready", body: `Pick up token #${order.token} now`, href: "/track" }); }
    if (order.status === "rejected") { toast.error("Order was rejected. Refund issued."); push({ userId: user.id, kind: "order", title: "Order rejected", body: `Refund issued for token #${order.token}` }); }
  }, [order?.status, order?.id, push, user]);

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

  const canManage = canManageToken(order);
  const secondsLeft = tokenWindowSecondsLeft(order);
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const cancel = () => {
    update(order.id, { status: "cancelled" });
    log({ orderId: order.id, token: order.token, action: "cancel", by: user!.id });
    push({ userId: user!.id, kind: "order", title: "Order cancelled", body: `Token #${order.token} cancelled · refund issued` });
    toast("Order cancelled · refund issued");
    router.navigate({ to: "/home" });
  };

  const reschedule = (s: "now" | "30m" | "60m") => {
    update(order.id, { schedule: s, etaMinutes: s === "60m" ? order.etaMinutes + 60 : s === "30m" ? order.etaMinutes + 30 : order.etaMinutes });
    log({ orderId: order.id, token: order.token, action: "reschedule", by: user!.id, meta: { schedule: s } });
    push({ userId: user!.id, kind: "schedule", title: "Pickup rescheduled", body: `Token #${order.token} pickup changed to ${s === "now" ? "now" : "+" + s}` });
    toast.success("Pickup rescheduled");
    setShowReschedule(false);
  };

  const transfer = () => {
    if (!transferEmail.trim()) return;
    try {
      const raw = window.localStorage.getItem("campus:users");
      const users = raw ? JSON.parse(raw) : [];
      const recipient = users.find((u: any) => u.email.toLowerCase() === transferEmail.trim().toLowerCase());
      if (!recipient) { toast.error("No registered user with that email"); return; }
      update(order.id, { userId: recipient.id, userName: recipient.name });
      log({ orderId: order.id, token: order.token, action: "transfer", by: user!.id, meta: { to: recipient.id } });
      push({ userId: user!.id, kind: "transfer", title: "Token transferred", body: `Token #${order.token} sent to ${recipient.name}` });
      push({ userId: recipient.id, kind: "transfer", title: "You received a token", body: `${user!.name} transferred token #${order.token} to you`, href: "/track" });
      toast.success(`Token transferred to ${recipient.name}`);
      setShowTransfer(false);
      setTransferEmail("");
      router.navigate({ to: "/home" });
    } catch {
      toast.error("Transfer failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <LiveTracker order={order} />

        {canManage && (
          <div className="mt-8 bg-amber-50 ring-1 ring-amber-200 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm font-bold text-amber-900">Manage this token</p>
                <p className="text-xs text-amber-800 mt-0.5">Reschedule, cancel, or transfer within the next <span className="font-mono font-bold">{mins}:{String(secs).padStart(2, "0")}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowReschedule(true)} className="text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-2 ring-1 ring-amber-300 bg-white rounded-xl"><Calendar className="size-3.5" /> Reschedule</button>
                <button onClick={() => setShowTransfer(true)} className="text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-2 ring-1 ring-amber-300 bg-white rounded-xl"><Send className="size-3.5" /> Transfer</button>
                <button onClick={cancel} className="text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-2 ring-1 ring-rose-300 text-rose-700 bg-white rounded-xl"><X className="size-3.5" /> Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link to="/home" className="text-sm font-semibold text-zinc-700 hover:underline">Order something else</Link>
        </div>
      </div>

      {showReschedule && (
        <Modal onClose={() => setShowReschedule(false)} title="Reschedule pickup">
          <div className="grid grid-cols-3 gap-2">
            {([{ id: "now", label: "Pickup Now" }, { id: "30m", label: "+30 min" }, { id: "60m", label: "+1 hour" }] as const).map((s) => (
              <button key={s.id} onClick={() => reschedule(s.id)} className="py-3 rounded-xl text-sm font-medium ring-1 ring-zinc-200 hover:ring-zinc-900">{s.label}</button>
            ))}
          </div>
        </Modal>
      )}

      {showTransfer && (
        <Modal onClose={() => setShowTransfer(false)} title="Transfer this token">
          <p className="text-xs text-zinc-500 mb-3">The recipient must be a registered BookIt user.</p>
          <input value={transferEmail} onChange={(e) => setTransferEmail(e.target.value)} placeholder="recipient@campus" className="w-full bg-zinc-50 ring-1 ring-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
          <button onClick={transfer} className="mt-4 w-full bg-zinc-900 text-zinc-50 py-3 rounded-xl text-sm font-semibold">Send token</button>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-zinc-900/50 backdrop-blur-sm p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <button onClick={onClose} className="size-9 rounded-xl bg-zinc-100 grid place-items-center"><X className="size-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
