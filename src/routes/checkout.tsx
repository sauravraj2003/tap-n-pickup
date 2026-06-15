import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Minus, Plus, QrCode, CreditCard, Clock } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { useAuth, useCart, useOrders, useRewards } from "@/lib/store";
import { getVendor } from "@/lib/campus-data";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — BookIt" }] }),
  component: Checkout,
});

function Checkout() {
  const { user } = useAuth();
  const { lines, setQty, remove, clear, total } = useCart();
  const { place } = useOrders();
  const { earn } = useRewards();
  const router = useRouter();
  const [schedule, setSchedule] = useState<"now" | "30m" | "60m">("now");
  const [pay, setPay] = useState<"campus-card" | "upi">("campus-card");
  const [submitting, setSubmitting] = useState(false);

  const vendorId = lines[0]?.vendorId;
  const vendor = vendorId ? getVendor(vendorId) : undefined;
  const platformFee = lines.length ? 5 : 0;
  const grand = total + platformFee;

  const placeOrder = () => {
    if (!user) {
      toast.error("Please sign in first");
      router.navigate({ to: "/signin" });
      return;
    }
    if (!lines.length || !vendor) return;
    setSubmitting(true);
    setTimeout(() => {
      const order = place({
        userId: user.id,
        userName: user.name,
        vendorId: vendor.id,
        vendorName: vendor.name,
        lines: [...lines],
        total: grand,
        schedule,
        etaMinutes: vendor.avgPrep + Math.max(...lines.map((l) => l.prep)),
        paymentMethod: pay,
      });
      const coins = Math.floor((grand * vendor.rewardsRate) / 100);
      if (coins > 0) earn(user.id, coins, `Order at ${vendor.name}`);
      clear();
      toast.success(`Payment successful · Token #${String(order.token).padStart(3, "0")}`);
      router.navigate({ to: "/track" });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        {!lines.length ? (
          <div className="bg-white ring-1 ring-zinc-200 rounded-2xl p-10 text-center">
            <p className="text-zinc-600">Your cart is empty.</p>
            <Link to="/home" className="mt-4 inline-block bg-zinc-900 text-zinc-50 px-6 py-2.5 rounded-xl text-sm font-semibold">Browse canteens</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-8">
              <section className="bg-white ring-1 ring-zinc-200 rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">{vendor?.name}</h2>
                <div className="space-y-3">
                  {lines.map((l) => (
                    <div key={l.id} className="flex items-center gap-3 py-2">
                      {l.image && <img src={l.image} alt="" className="size-14 rounded-lg object-cover ring-1 ring-zinc-200" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{l.name}</p>
                        <p className="text-xs text-zinc-500">₹{l.price} · {l.prep}m</p>
                        {l.notes && <p className="text-[11px] text-amber-700 italic mt-0.5">"{l.notes}"</p>}
                      </div>
                      <div className="inline-flex items-center bg-zinc-100 rounded-lg">
                        <button onClick={() => setQty(l.id, l.qty - 1)} className="size-8 grid place-items-center"><Minus className="size-3" /></button>
                        <span className="w-6 text-center font-mono text-sm">{l.qty}</span>
                        <button onClick={() => setQty(l.id, l.qty + 1)} className="size-8 grid place-items-center"><Plus className="size-3" /></button>
                      </div>
                      <button onClick={() => remove(l.id)} className="text-zinc-400 hover:text-rose-600"><Trash2 className="size-4" /></button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white ring-1 ring-zinc-200 rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock className="size-4" /> Schedule pickup</h2>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "now", label: "Pickup Now" },
                    { id: "30m", label: "In 30 mins" },
                    { id: "60m", label: "In 1 hr" },
                  ] as const).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSchedule(s.id)}
                      className={`py-3 rounded-xl text-sm font-medium ring-1 ${schedule === s.id ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-white text-zinc-700 ring-zinc-200"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white ring-1 ring-zinc-200 rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">Payment</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setPay("campus-card")}
                    className={`p-4 rounded-2xl ring-1 text-left flex items-start gap-3 ${pay === "campus-card" ? "ring-zinc-900 bg-zinc-50" : "ring-zinc-200"}`}
                  >
                    <CreditCard className="size-5 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Campus Card</p>
                      <p className="text-xs text-zinc-500">Charge your student wallet</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPay("upi")}
                    className={`p-4 rounded-2xl ring-1 text-left flex items-start gap-3 ${pay === "upi" ? "ring-zinc-900 bg-zinc-50" : "ring-zinc-200"}`}
                  >
                    <QrCode className="size-5 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">UPI Scan & Pay</p>
                      <p className="text-xs text-zinc-500">Dummy QR for demo</p>
                    </div>
                  </button>
                </div>
                {pay === "upi" && (
                  <div className="mt-4 p-6 bg-zinc-50 rounded-2xl flex items-center justify-center">
                    <div className="size-40 bg-white p-3 ring-1 ring-zinc-200 rounded-xl grid place-items-center">
                      <div className="size-full bg-[conic-gradient(at_top_left,_#000_25%,_#fff_25%,_#fff_50%,_#000_50%,_#000_75%,_#fff_75%)] bg-[length:18px_18px] rounded" />
                    </div>
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-32 self-start">
              <div className="bg-white ring-1 ring-zinc-200 rounded-2xl p-6 space-y-2 text-sm">
                <Row label="Subtotal" value={`₹${total}`} />
                <Row label="Platform fee" value={`₹${platformFee}`} />
                <div className="h-px bg-zinc-200 my-2" />
                <Row label="Total" value={`₹${grand}`} bold />
                <p className="text-[11px] text-amber-700 font-medium pt-2">
                  Earn {vendor ? Math.floor((grand * vendor.rewardsRate) / 100) : 0} Campus Coins on this order
                </p>
              </div>
              <button
                disabled={submitting}
                onClick={placeOrder}
                className="w-full bg-zinc-900 text-zinc-50 py-4 rounded-xl font-semibold disabled:opacity-60"
              >
                {submitting ? "Processing…" : `Pay ₹${grand}`}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold" : "text-zinc-500"}>{label}</span>
      <span className={`font-mono ${bold ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}
