import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { VendorCard } from "@/components/web/VendorCard";
import { vendors, collections, userFilters } from "@/lib/campus-data";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Canteens — BookIt" }] }),
  component: Home,
});

function Home() {
  return <VendorFeed kind="canteen" />;
}

export function VendorFeed({ kind }: { kind: "canteen" | "barber" }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [visible, setVisible] = useState(8);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = vendors.filter((v) => v.kind === kind);
    if (activeFilters.includes("open-now")) list = list.filter((v) => v.open);
    if (activeFilters.includes("shortest-wait")) list = [...list].sort((a, b) => a.queue * 2 + a.avgPrep - (b.queue * 2 + b.avgPrep));
    if (activeFilters.includes("high-rewards")) list = [...list].sort((a, b) => b.rewardsRate - a.rewardsRate);
    if (activeFilters.includes("quick-prep")) list = list.filter((v) => v.avgPrep <= 12);
    return list;
  }, [activeFilters, kind]);

  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setVisible((n) => Math.min(filtered.length, n + 6));
    });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [filtered.length]);

  const toggle = (id: string) => setActiveFilters((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <TopNav activeTab={kind === "canteen" ? "canteens" : "barbers"} />

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Collections</h1>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl">
              Curated picks from across campus — updated weekly.
            </p>
            <button className="text-sm font-semibold text-zinc-900 inline-flex items-center gap-1 hover:underline self-start sm:self-auto">
              All collections <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {collections.map((c, i) => {
              const pool = vendors.filter((v) => v.kind === kind).filter(c.filter);
              const pick = pool[0] ?? vendors[0];
              return (
                <Link
                  key={c.id}
                  to="/vendor/$id"
                  params={{ id: pick.id }}
                  className="relative aspect-[5/3] rounded-2xl overflow-hidden ring-1 ring-zinc-900/5 group animate-rise"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <img src={pick.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/85 via-zinc-900/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-zinc-50">
                    <h3 className="text-lg sm:text-xl font-bold leading-tight">{c.title}</h3>
                    <p className="text-xs opacity-90 mt-1">{c.subtitle}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium opacity-90">
                      {pool.length} places <ChevronRight className="size-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-zinc-200 sticky top-[129px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex gap-3 overflow-x-auto no-scrollbar">
          <button className="px-4 py-2 rounded-full text-sm font-medium ring-1 ring-zinc-300 inline-flex items-center gap-2 bg-white text-zinc-700 whitespace-nowrap">
            <SlidersHorizontal className="size-3.5" /> Filters
          </button>
          {userFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ring-1 whitespace-nowrap transition-colors ${
                activeFilters.includes(f.id)
                  ? "bg-zinc-900 text-zinc-50 ring-zinc-900"
                  : "bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          {kind === "canteen" ? "All Canteens on Campus" : "All Barbers on Campus"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filtered.slice(0, visible).map((v, i) => (
            <VendorCard key={v.id} vendor={v} index={i} />
          ))}
        </div>
        {visible < filtered.length && (
          <div ref={sentinel} className="h-16 grid place-items-center text-xs text-zinc-500 mt-8">Loading more…</div>
        )}
      </section>
    </div>
  );
}
