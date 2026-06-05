import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, Star, Clock } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { CanteenStories } from "@/components/CanteenStories";
import { canteens } from "@/lib/data";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [{ title: "Home — BookIt" }],
  }),
  component: Home,
});

function CanteenCard({ c, index }: { c: typeof canteens[number]; index: number }) {
  return (
    <Link
      to="/canteen/$id"
      params={{ id: c.id }}
      className="block group animate-rise"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative">
        <img
          src={c.image}
          alt={c.name}
          loading="lazy"
          width={1024}
          height={640}
          className="w-full aspect-[16/10] object-cover rounded-2xl ring-1 ring-black/5 mb-3"
        />
        <div className="absolute top-3 left-3 bg-zinc-50/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-[11px]">
          <Star className="size-3 fill-zinc-900 stroke-zinc-900" />
          <span className="font-semibold text-zinc-900">{c.rating}</span>
          <span className="text-zinc-500">({c.reviews})</span>
        </div>
        <div className={`absolute bottom-3 right-3 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${
          c.open ? "bg-zinc-900/90 text-zinc-50" : "bg-zinc-50/90 text-zinc-500"
        }`}>
          {c.open ? `${c.wait}m wait` : "Closed"}
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <h3 className="text-base font-semibold truncate">{c.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{c.tagline}</p>
        </div>
        <div className="text-right flex-none ml-3">
          <div className="text-[11px] font-mono text-muted-foreground">{c.distance}</div>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const open = canteens.filter((c) => c.open);
  const topRated = [...canteens].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <MobileFrame>
      <header className="px-5 pt-12 pb-4 flex-none">
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Pickup at</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              <span className="text-sm font-semibold">Main Plaza Canteen</span>
            </div>
          </div>
          <Link to="/profile" className="size-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 ring-1 ring-black/5" />
        </div>
        <div className="w-full bg-surface ring-1 ring-border rounded-2xl px-4 py-3 flex items-center gap-3">
          <Search className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Find your favorite meal</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {/* Canteen stories — Instagram-style horizontal scroll */}
        <div className="mb-5 -mt-1">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Canteens nearby</h2>
            <span className="text-[10px] font-mono text-muted-foreground">{canteens.filter(c => c.open).length} open</span>
          </div>
          <CanteenStories />
        </div>

        {/* Active order strip */}
        <Link to="/order/tracking" className="block mb-6 animate-rise">
          <div className="bg-zinc-900 text-zinc-50 rounded-2xl p-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-zinc-800 grid place-items-center font-mono text-sm font-bold">
              LIVE
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Preparing your meal</p>
              <p className="text-sm font-semibold truncate">The Artisan Deli — ready in ~6 min</p>
            </div>
            <Clock className="size-4 text-zinc-400" />
          </div>
        </Link>

        <div className="flex gap-2 mb-5 overflow-x-auto -mx-5 px-5 no-scrollbar">
          {["Nearby", "Top Rated", "Quick Prep", "Open Now", "Budget"].map((t, i) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ring-1 ${
                i === 0 ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-surface text-muted-foreground ring-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-balance">Popular near you</h2>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">View all</span>
          </div>
          <div className="space-y-6">
            {open.map((c, i) => (
              <CanteenCard key={c.id} c={c} index={i} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Top rated this week</h2>
          <div className="flex gap-4 overflow-x-auto -mx-5 px-5 pb-2 no-scrollbar">
            {topRated.map((c) => (
              <Link key={c.id} to="/canteen/$id" params={{ id: c.id }} className="flex-none w-48">
                <img src={c.image} alt={c.name} loading="lazy" className="w-full aspect-square object-cover rounded-2xl ring-1 ring-black/5 mb-2" />
                <h4 className="text-sm font-semibold truncate">{c.name}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="size-3 fill-foreground stroke-foreground" /> {c.rating} • {c.distance}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Recommended for you</h2>
          <div className="space-y-6">
            {canteens.slice(1, 4).map((c, i) => (
              <CanteenCard key={c.id} c={c} index={i} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </MobileFrame>
  );
}
