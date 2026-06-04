import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Clock, MapPin, Plus, Heart } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { canteens, itemsByCanteen } from "@/lib/data";

export const Route = createFileRoute("/canteen/$id")({
  loader: ({ params }) => {
    const c = canteens.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { canteen: c };
  },
  component: CanteenDetail,
  notFoundComponent: () => (
    <MobileFrame>
      <div className="flex-1 grid place-items-center p-8 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Canteen not found.</p>
          <Link to="/home" className="mt-3 inline-block text-sm font-medium underline">Back home</Link>
        </div>
      </div>
    </MobileFrame>
  ),
});

const categories = ["Snacks", "Meals", "Drinks", "Desserts"] as const;

function CanteenDetail() {
  const { canteen: c } = Route.useLoaderData();
  const items = itemsByCanteen(c.id);
  const [tab, setTab] = useState<"Menu" | "Reviews" | "About">("Menu");
  const [cat, setCat] = useState<typeof categories[number]>("Meals");

  return (
    <MobileFrame>
      <div className="relative flex-none">
        <img src={c.image} alt={c.name} className="w-full h-64 object-cover" width={1024} height={640} />
        <TopBar
          back
          right={
            <button className="size-10 rounded-full bg-zinc-50/90 backdrop-blur ring-1 ring-black/5 grid place-items-center">
              <Heart className="size-4" />
            </button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto -mt-6 rounded-t-3xl bg-background relative z-10">
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight leading-tight text-balance">{c.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{c.tagline}</p>

          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1"><Star className="size-3.5 fill-foreground stroke-foreground" /> <b>{c.rating}</b> <span className="text-muted-foreground">({c.reviews})</span></span>
            <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="size-3.5" /> {c.distance}</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="size-3.5" /> {c.hours}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md bg-zinc-900 text-zinc-50">
              ~{c.wait} min wait
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md ring-1 ring-border ${c.open ? "text-emerald-600" : "text-muted-foreground"}`}>
              {c.open ? "Open now" : "Closed"}
            </span>
          </div>

          <div className="flex gap-2 mt-6 border-b border-border">
            {(["Menu", "Reviews", "About"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-1 pb-3 text-sm font-medium relative ${tab === t ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span className="px-2">{t}</span>
                {tab === t && <span className="absolute -bottom-px left-2 right-2 h-0.5 bg-foreground rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {tab === "Menu" && (
          <div className="px-6 pt-5 pb-32">
            <div className="flex gap-2 mb-5 overflow-x-auto -mx-6 px-6 no-scrollbar">
              {categories.map((k) => (
                <button
                  key={k}
                  onClick={() => setCat(k)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ring-1 ${
                    cat === k ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-surface text-muted-foreground ring-border"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {items
                .filter((i) => i.category === cat || items.filter((x) => x.category === cat).length === 0)
                .map((it, i) => (
                  <Link
                    key={it.id}
                    to="/item/$itemId"
                    params={{ itemId: it.id }}
                    className="flex items-center justify-between p-3 bg-surface ring-1 ring-border rounded-2xl animate-rise"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex-1 pr-4 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{it.name}</h4>
                      <p className="text-xs text-muted-foreground leading-normal line-clamp-2">{it.desc}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="font-semibold">${it.price.toFixed(2)}</span>
                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="size-3" /> {it.prep}m</span>
                      </div>
                    </div>
                    <div className="size-20 rounded-xl bg-surface-2 ring-1 ring-border relative shrink-0 overflow-hidden">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" loading="lazy" />
                      <button className="absolute -bottom-2 right-2 size-8 rounded-full bg-zinc-900 text-zinc-50 grid place-items-center ring-2 ring-background">
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </Link>
                ))}
              {items.filter((i) => i.category === cat).length === 0 && items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-12">No items yet.</div>
              )}
            </div>
          </div>
        )}

        {tab === "Reviews" && (
          <div className="px-6 pt-5 pb-32 space-y-4">
            {[
              { n: "Maya R.", r: 5, t: "Tokens are a game changer. Walked in, walked out." },
              { n: "Daniel K.", r: 4, t: "Pastrami was excellent. App said 12 min, was ready in 9." },
              { n: "Priya S.", r: 5, t: "Counter staff was friendly. Loved the queue position display." },
            ].map((rv, i) => (
              <div key={i} className="p-4 bg-surface ring-1 ring-border rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">{rv.n}</span>
                  <span className="flex">{Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`size-3 ${j < rv.r ? "fill-foreground stroke-foreground" : "stroke-muted-foreground"}`} />
                  ))}</span>
                </div>
                <p className="text-sm text-muted-foreground">{rv.t}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "About" && (
          <div className="px-6 pt-5 pb-32 space-y-4 text-sm text-muted-foreground">
            <p>{c.tagline}. Family-owned since 2018, sourcing local ingredients and baking fresh every morning.</p>
            <div className="p-4 bg-surface ring-1 ring-border rounded-2xl">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hours</h4>
              <p className="text-sm text-foreground">{c.hours}</p>
            </div>
            <div className="p-4 bg-surface ring-1 ring-border rounded-2xl">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Popular items</h4>
              <ul className="space-y-1 text-sm text-foreground">
                {c.popular.map((p) => <li key={p}>· {p}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-background border-t border-border flex-none">
        <Link to="/cart" className="w-full bg-zinc-900 text-zinc-50 py-4 rounded-2xl font-medium text-sm flex justify-between px-6">
          <span>View basket (2)</span>
          <span>$22.50</span>
        </Link>
      </div>
    </MobileFrame>
  );
}
