import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, CreditCard, MapPin, Settings, Receipt, LogOut, ChevronRight } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const rows = [
  { icon: Receipt, label: "Order history", to: "/orders" as const },
  { icon: Heart, label: "Saved canteens", to: "/home" as const },
  { icon: CreditCard, label: "Payment methods", to: "/profile" as const },
  { icon: MapPin, label: "Addresses", to: "/profile" as const },
  { icon: Settings, label: "Settings", to: "/profile" as const },
];

function Profile() {
  return (
    <MobileFrame>
      <TopBar back={false} title="Profile" />
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="flex items-center gap-4 p-4 bg-surface ring-1 ring-border rounded-2xl">
          <div className="size-14 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 ring-1 ring-black/5" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold">Alex Morgan</p>
            <p className="text-xs text-muted-foreground">alex@bookit.app</p>
          </div>
          <button className="text-[10px] uppercase tracking-widest text-muted-foreground">Edit</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat label="Orders" value="24" />
          <Stat label="Saved" value="6" />
          <Stat label="Reviews" value="11" />
        </div>

        <div className="mt-6 bg-surface ring-1 ring-border rounded-2xl overflow-hidden">
          {rows.map((r, i) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.label}
                to={r.to}
                className={`flex items-center gap-3 px-4 py-3.5 ${i !== rows.length - 1 ? "border-b border-border" : ""}`}
              >
                <Icon className="size-4 text-muted-foreground" />
                <span className="text-sm flex-1">{r.label}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>

        <Link to="/" className="mt-4 flex items-center justify-center gap-2 w-full py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <LogOut className="size-4" /> Sign out
        </Link>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-surface ring-1 ring-border rounded-2xl text-center">
      <div className="text-xl font-mono font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
