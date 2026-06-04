import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { orderHistory } from "@/lib/data";

export const Route = createFileRoute("/orders")({
  component: Orders,
});

function Orders() {
  return (
    <MobileFrame>
      <TopBar back={false} title="Your orders" />
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <Link to="/order/tracking" className="block mb-6 p-4 bg-zinc-900 text-zinc-50 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">In progress</p>
              <p className="text-sm font-semibold mt-1">The Artisan Deli</p>
              <p className="text-xs text-zinc-400">Token #42 · 6 min remaining</p>
            </div>
            <div className="text-2xl font-mono">#42</div>
          </div>
          <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-zinc-50" />
          </div>
        </Link>

        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">History</h3>
        <div className="space-y-3">
          {orderHistory.map((o) => (
            <div key={o.id} className="p-4 bg-surface ring-1 ring-border rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">{o.canteen}</p>
                <p className="text-xs text-muted-foreground">{o.items} items · {o.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono">${o.total.toFixed(2)}</p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-600">{o.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}
