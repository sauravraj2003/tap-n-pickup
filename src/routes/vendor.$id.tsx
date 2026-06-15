import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Star, Users, Clock, Coins, X, Plus } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { getVendor, menuByVendor } from "@/lib/campus-data";
import { useCart, useVendorQueue } from "@/lib/store";

export const Route = createFileRoute("/vendor/$id")({
  loader: ({ params }) => {
    const vendor = getVendor(params.id);
    if (!vendor) throw notFound();
    return { vendor, menu: menuByVendor(params.id) };
  },
  component: VendorDetail,
  notFoundComponent: () => <div className="p-10 text-center">Vendor not found</div>,
});

function VendorDetail() {
  const { vendor, menu } = Route.useLoaderData();
  const { add } = useCart();
  const { get } = useVendorQueue();
  const [selected, setSelected] = useState<(typeof menu)[number] | null>(null);
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState(1);

  const liveQueue = get(vendor.id) ?? vendor.queue;
  const liveWait = vendor.avgPrep + liveQueue * 2;

  const openModal = (item: (typeof menu)[number]) => {
    setSelected(item);
    setNotes("");
    setQty(1);
  };

  const confirm = () => {
    if (!selected) return;
    add({
      id: `${selected.id}-${Date.now()}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      name: selected.name,
      price: selected.price,
      prep: selected.prep,
      qty,
      notes: notes || undefined,
      image: selected.image,
    });
    toast.success(`${qty} × ${selected.name} added to cart`);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav activeTab={vendor.kind === "canteen" ? "canteens" : "barbers"} />

      <div className="relative aspect-[5/2] sm:aspect-[5/1.5] max-h-80 overflow-hidden">
        <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 text-zinc-50">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{vendor.name}</h1>
          <p className="text-zinc-300 text-sm mt-2">{vendor.tagline} · {vendor.location}</p>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
            <span className="bg-emerald-600 px-2 py-1 rounded font-semibold flex items-center gap-1.5"><Star className="size-3 fill-zinc-50" /> {vendor.rating} ({vendor.reviews})</span>
            <span className="bg-zinc-900/80 px-2 py-1 rounded font-semibold flex items-center gap-1.5"><Users className="size-3" /> {liveQueue} in queue</span>
            <span className="bg-zinc-900/80 px-2 py-1 rounded font-semibold flex items-center gap-1.5"><Clock className="size-3" /> Avg prep {vendor.avgPrep}m · ETA ~{liveWait}m</span>
            <span className="bg-amber-300 text-zinc-900 px-2 py-1 rounded font-semibold flex items-center gap-1.5"><Coins className="size-3" /> {vendor.rewardsRate}× Campus Coins</span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menu.map((item) => (
            <div key={item.id} className="bg-white ring-1 ring-zinc-200 rounded-2xl p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="size-24 rounded-xl object-cover ring-1 ring-zinc-200" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{item.name}</h3>
                  <span className="font-mono font-bold">₹{item.price}</span>
                </div>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{item.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-widest">{item.prep}m prep</span>
                  <button onClick={() => openModal(item)} className="text-xs font-semibold bg-zinc-900 text-zinc-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                    <Plus className="size-3" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link to="/checkout" className="mt-10 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">
          Go to cart
        </Link>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-900/50 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{selected.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{selected.desc}</p>
              </div>
              <button onClick={() => setSelected(null)} className="size-9 rounded-xl bg-zinc-100 grid place-items-center"><X className="size-4" /></button>
            </div>
            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Special instructions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Make it spicy, no onion…"
                rows={3}
                className="mt-2 w-full bg-zinc-50 ring-1 ring-zinc-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="inline-flex items-center bg-zinc-100 rounded-xl">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-10 grid place-items-center">−</button>
                <span className="w-10 text-center font-mono font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="size-10 grid place-items-center">+</button>
              </div>
              <button onClick={confirm} className="bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">
                Add · ₹{selected.price * qty}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
