import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, MapPin } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";

export const Route = createFileRoute("/order/pickup")({
  component: Pickup,
});

function Pickup() {
  return (
    <MobileFrame dark>
      <div className="flex-1 bg-gradient-to-b from-emerald-950 via-zinc-950 to-zinc-950 text-zinc-50 flex flex-col px-7 pt-16 pb-8">
        <div className="flex items-center gap-2 mb-12 animate-soft-fade">
          <div className="size-10 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-400/30 grid place-items-center">
            <Bell className="size-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-emerald-300">Pickup ready</p>
            <p className="text-xs text-zinc-400">Just now</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center text-center animate-ticker">
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-3">Head to counter</p>
          <div className="text-[160px] font-mono leading-none tracking-tighter text-zinc-50">02</div>
          <div className="mt-8">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Show token</span>
            <div className="text-3xl font-mono mt-1">#42</div>
          </div>
          <p className="text-sm text-zinc-400 mt-8 max-w-xs mx-auto">
            Your order is ready at <b className="text-zinc-50">The Artisan Deli</b>. Please pick up within 10 minutes.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/80 backdrop-blur ring-1 ring-white/10 rounded-2xl flex items-center gap-3 mb-4">
          <MapPin className="size-4 text-zinc-400" />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">The Artisan Deli</p>
            <p className="text-[11px] text-zinc-500">Floor 2 · South Atrium · Counter 02</p>
          </div>
        </div>

        <Link to="/reviews/artisan-deli" className="w-full bg-zinc-50 text-zinc-900 py-4 rounded-2xl font-medium text-sm text-center">
          I've picked it up
        </Link>
      </div>
    </MobileFrame>
  );
}
