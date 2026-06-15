import { Link } from "@tanstack/react-router";
import { Star, Users, Clock, Coins } from "lucide-react";
import type { Vendor } from "@/lib/campus-data";
import { useVendorQueue } from "@/lib/store";

export function VendorCard({ vendor, index = 0 }: { vendor: Vendor; index?: number }) {
  const { get } = useVendorQueue();
  const liveQueue = get(vendor.id) ?? vendor.queue;
  const liveWait = vendor.avgPrep + liveQueue * 2;

  return (
    <Link
      to="/vendor/$id"
      params={{ id: vendor.id }}
      className="group animate-rise block"
      style={{ animationDelay: `${(index % 6) * 50}ms` }}
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-zinc-900/5 mb-3">
        <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded ${vendor.open ? "bg-emerald-600 text-zinc-50" : "bg-zinc-700 text-zinc-50"}`}>
          {vendor.open ? "Live" : "Closed"}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="bg-zinc-900/90 text-zinc-50 text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Users className="size-3" /> {liveQueue} in queue
          </div>
          <div className="bg-zinc-900/90 text-zinc-50 text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Clock className="size-3" /> ~{liveWait}m
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold tracking-tight truncate flex-1">{vendor.name}</h3>
        <div className="flex items-center gap-1 bg-zinc-900 text-zinc-50 text-xs font-bold px-1.5 py-0.5 rounded shrink-0">
          {vendor.rating}
          <Star className="size-3 fill-zinc-50 stroke-zinc-50" />
        </div>
      </div>
      <div className="flex justify-between items-baseline mt-1.5 text-sm">
        <p className="text-zinc-500 truncate flex-1 mr-3">{vendor.tags.join(", ")}</p>
        <p className="text-zinc-700 font-medium whitespace-nowrap text-xs">{vendor.location}</p>
      </div>
      <div className="flex justify-between items-baseline mt-1 text-sm">
        <p className={`font-medium text-xs ${vendor.open ? "text-emerald-700" : "text-rose-700"}`}>
          {vendor.open ? `Avg prep · ${vendor.avgPrep}m` : "Opens at 12 noon"}
        </p>
        <p className="text-amber-700 font-mono text-[11px] flex items-center gap-1">
          <Coins className="size-3" /> {vendor.rewardsRate}× coins
        </p>
      </div>
    </Link>
  );
}
