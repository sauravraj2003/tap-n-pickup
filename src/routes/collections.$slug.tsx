import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, ArrowUpDown, Plus, Star } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { Footer } from "@/components/web/Footer";
import { AdSlot } from "@/components/web/AdSlot";
import { getCollection, allMenuItems, vendors } from "@/lib/campus-data";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.collection.title} — Collections` },
      { name: "description", content: loaderData?.collection.subtitle },
    ],
  }),
  component: CollectionDetail,
  notFoundComponent: () => <div className="p-10 text-center">Collection not found</div>,
});

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

function CollectionDetail() {
  const { collection } = Route.useLoaderData();
  const { add } = useCart();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [vendor, setVendor] = useState<string>("all");

  const items = useMemo(() => {
    let list = allMenuItems.filter(collection.filter);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(needle) || m.desc.toLowerCase().includes(needle));
    }
    if (vendor !== "all") list = list.filter((m) => m.vendorId === vendor);
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
    return list;
  }, [collection, q, sort, vendor]);

  const vendorOptions = useMemo(() => {
    const ids = new Set(allMenuItems.filter(collection.filter).map((m) => m.vendorId));
    return vendors.filter((v) => ids.has(v.id));
  }, [collection]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <TopNav />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 w-full">
        <Link to="/collections" className="text-xs text-zinc-500 hover:text-zinc-900">← All collections</Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">{collection.title}</h1>
        <p className="text-sm text-zinc-600 mt-2">{collection.subtitle} · {items.length} item{items.length === 1 ? "" : "s"}</p>

        <div className="mt-6 grid sm:grid-cols-[1fr_auto_auto] gap-3">
          <div className="flex items-center gap-2 bg-white ring-1 ring-zinc-200 rounded-xl px-4 h-11">
            <Search className="size-4 text-zinc-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search within this collection" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <select value={vendor} onChange={(e) => setVendor(e.target.value)} className="bg-white ring-1 ring-zinc-200 rounded-xl px-4 h-11 text-sm">
            <option value="all">All vendors</option>
            {vendorOptions.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-white ring-1 ring-zinc-200 rounded-xl px-4 h-11 text-sm">
            <option value="popular">Popular</option>
            <option value="rating">Rating</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        <AdSlot id="collection-top" format="banner" className="mt-6" />

        {items.length === 0 ? (
          <div className="mt-10 bg-white ring-1 ring-zinc-200 rounded-2xl p-10 text-center text-sm text-zinc-500">
            No items match your search.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((m, i) => (
              <div key={m.id} className="bg-white ring-1 ring-zinc-200 rounded-2xl p-4 flex gap-4 animate-rise" style={{ animationDelay: `${(i % 9) * 30}ms` }}>
                <img src={m.image} alt={m.name} className="size-24 rounded-xl object-cover ring-1 ring-zinc-200" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold truncate">{m.name}</h3>
                    <span className="font-mono font-bold whitespace-nowrap">₹{m.price}</span>
                  </div>
                  <Link to="/vendor/$id" params={{ id: m.vendorId }} className="text-[11px] text-zinc-500 hover:underline">{m.vendorName}</Link>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{m.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-amber-700 font-mono uppercase tracking-widest flex items-center gap-1"><Star className="size-3 fill-amber-500 stroke-amber-500" /> {m.rating?.toFixed(1) ?? "—"}</span>
                    <button
                      onClick={() => { add({ id: `${m.id}-${Date.now()}`, vendorId: m.vendorId, vendorName: m.vendorName ?? "", name: m.name, price: m.price, prep: m.prep, qty: 1, image: m.image }); toast.success(`${m.name} added to cart`); }}
                      className="text-xs font-semibold bg-zinc-900 text-zinc-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                    >
                      <Plus className="size-3" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
