import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { items } from "@/lib/data";

export const Route = createFileRoute("/cart")({
  component: Cart,
});

function Cart() {
  const initial = [
    { ...items[0], qty: 1 },
    { ...items[1], qty: 1 },
  ];
  const [lines, setLines] = useState(initial);
  const [pay, setPay] = useState<"full" | "down" | "pickup">("full");

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const platform = 0.49;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + platform + tax).toFixed(2);
  const longestPrep = Math.max(...lines.map((l) => l.prep), 0);

  return (
    <MobileFrame>
      <TopBar title="Your basket" />
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="space-y-3">
          {lines.map((l) => (
            <div key={l.id} className="flex items-center gap-3 p-3 bg-surface ring-1 ring-border rounded-2xl">
              <img src={l.image} alt={l.name} className="size-16 rounded-xl object-cover ring-1 ring-border" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{l.name}</h4>
                <p className="text-xs text-muted-foreground">${l.price.toFixed(2)} · {l.prep}m</p>
              </div>
              <div className="inline-flex items-center bg-background ring-1 ring-border rounded-xl">
                <button onClick={() => setLines((ls) => ls.map((x) => x.id === l.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} className="size-8 grid place-items-center"><Minus className="size-3.5" /></button>
                <span className="w-6 text-center font-mono text-sm">{l.qty}</span>
                <button onClick={() => setLines((ls) => ls.map((x) => x.id === l.id ? { ...x, qty: x.qty + 1 } : x))} className="size-8 grid place-items-center"><Plus className="size-3.5" /></button>
              </div>
              <button onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} className="text-muted-foreground"><Trash2 className="size-4" /></button>
            </div>
          ))}

          {lines.length === 0 && (
            <div className="text-center py-16">
              <div className="size-16 mx-auto rounded-2xl bg-surface ring-1 ring-border mb-3" />
              <p className="text-sm text-muted-foreground">Your basket is empty.</p>
              <Link to="/home" className="text-xs font-medium underline mt-2 inline-block">Browse canteens</Link>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Pay</h3>
          <div className="grid grid-cols-3 gap-2">
            {(["full", "down", "pickup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPay(m)}
                className={`p-3 rounded-2xl text-left text-xs font-medium ring-1 ${
                  pay === m ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-surface text-muted-foreground ring-border"
                }`}
              >
                {m === "full" ? "Full now" : m === "down" ? "20% deposit" : "At pickup"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-surface ring-1 ring-border rounded-2xl text-sm space-y-2">
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <Row label="Platform fee" value={`$${platform.toFixed(2)}`} />
          <Row label="Tax" value={`$${tax.toFixed(2)}`} />
          <div className="h-px bg-border my-2" />
          <Row label="Total" value={`$${total.toFixed(2)}`} bold />
          <p className="text-xs text-muted-foreground pt-1">Estimated prep time · {longestPrep} min</p>
        </div>
      </div>

      <div className="px-5 py-4 bg-background border-t border-border flex-none">
        <Link to="/order/confirmation" className="w-full bg-zinc-900 text-zinc-50 py-4 rounded-2xl font-medium text-sm flex justify-between px-6">
          <span>Place order</span>
          <span>${total.toFixed(2)}</span>
        </Link>
      </div>
    </MobileFrame>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={`font-mono ${bold ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}
