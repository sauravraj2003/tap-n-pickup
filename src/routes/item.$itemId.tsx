import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Mic } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { items } from "@/lib/data";

export const Route = createFileRoute("/item/$itemId")({
  loader: ({ params }) => {
    const it = items.find((i) => i.id === params.itemId);
    if (!it) throw notFound();
    return { item: it };
  },
  component: ItemPage,
  notFoundComponent: () => (
    <MobileFrame>
      <div className="p-8 text-center text-sm text-muted-foreground">Item not found.</div>
    </MobileFrame>
  ),
});

const presets = ["Less spicy", "Extra sauce", "No onion", "Well done"];

function ItemPage() {
  const { item } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [active, setActive] = useState<string[]>([]);

  const toggle = (p: string) => setActive((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <MobileFrame>
      <div className="relative flex-none">
        <img src={item.image} alt={item.name} className="w-full h-72 object-cover" />
        <TopBar back />
      </div>
      <div className="flex-1 overflow-y-auto -mt-6 rounded-t-3xl bg-background relative z-10 px-6 pt-6 pb-32">
        <h1 className="text-2xl font-semibold tracking-tight">{item.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">· {item.prep} min prep</span>
        </div>

        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Special requests</h3>
          <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ring-1 transition-colors ${
                  active.includes(p) ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-surface text-muted-foreground ring-border"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Add a note</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. allergies, cooking preferences…"
            rows={3}
            className="w-full bg-surface ring-1 ring-border rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
          />
          <button className="mt-3 w-full bg-surface ring-1 ring-border rounded-2xl py-3 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 text-muted-foreground">
            <Mic className="size-4" /> Record voice request
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Quantity</h3>
          <div className="inline-flex items-center bg-surface ring-1 ring-border rounded-2xl">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-12 grid place-items-center"><Minus className="size-4" /></button>
            <span className="w-10 text-center font-mono font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="size-12 grid place-items-center"><Plus className="size-4" /></button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-background border-t border-border flex-none">
        <Link to="/cart" className="w-full bg-zinc-900 text-zinc-50 py-4 rounded-2xl font-medium text-sm flex justify-between px-6">
          <span>Add {qty} to basket</span>
          <span>${(item.price * qty).toFixed(2)}</span>
        </Link>
      </div>
    </MobileFrame>
  );
}
