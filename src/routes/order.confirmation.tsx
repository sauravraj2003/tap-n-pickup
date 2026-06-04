import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Clock } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";

export const Route = createFileRoute("/order/confirmation")({
  component: Confirm,
});

function Confirm() {
  return (
    <MobileFrame dark>
      <div className="flex-1 flex flex-col items-center px-7 pt-16 pb-8 bg-zinc-950 text-zinc-50">
        <div className="bg-zinc-900/60 p-1.5 rounded-2xl mb-10 ring-1 ring-white/10 animate-soft-fade">
          <div className="px-4 py-2 bg-zinc-800 rounded-xl text-[10px] font-medium text-zinc-400 uppercase tracking-[0.25em]">
            Order confirmed
          </div>
        </div>

        {/* The Deli Ticket */}
        <div className="w-full aspect-[4/5] bg-zinc-50 rounded-sm relative shadow-[0_30px_80px_rgba(0,0,0,0.5)] flex flex-col animate-ticker">
          <div className="h-4 w-full flex gap-1 px-1 -mt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-1 h-4 bg-zinc-950 rounded-b-full" />
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center pt-4 px-6">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.3em] mb-2">Your token</span>
            <span className="text-[110px] font-mono text-zinc-900 tracking-tighter leading-none">#42</span>
            <div className="mt-6 flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Queue position</span>
              <span className="text-xl font-semibold text-zinc-900">3rd in line</span>
            </div>
          </div>
          <div className="p-5 border-t border-dashed border-zinc-200">
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>THE ARTISAN DELI</span>
              <span>12:42 PM</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-zinc-400 text-center mt-8 max-w-xs">
          Your order is being prepared. We'll notify you when it's almost ready.
        </p>

        <div className="w-full mt-6 p-4 bg-zinc-900 ring-1 ring-white/10 rounded-2xl flex items-center gap-4">
          <div className="size-10 rounded-xl bg-zinc-800 grid place-items-center">
            <Clock className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Estimated ready</p>
            <p className="text-sm font-semibold">12:54 PM · ~12 min</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Counter</p>
            <p className="text-sm font-semibold">02</p>
          </div>
        </div>

        <Link to="/order/tracking" className="mt-auto w-full bg-zinc-50 text-zinc-900 py-4 rounded-2xl font-medium text-sm text-center">
          Track order
        </Link>
        <Link to="/home" className="mt-3 text-[11px] uppercase tracking-widest text-zinc-500">
          <MapPin className="size-3 inline mr-1" /> Back to home
        </Link>
      </div>
    </MobileFrame>
  );
}
