import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Receipt, Bell, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] bg-zinc-950/95 backdrop-blur-xl rounded-2xl py-2.5 px-3 flex justify-between items-center ring-1 ring-white/10 shadow-xl z-50">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = path === t.to || (t.to === "/orders" && path.startsWith("/order"));
        return (
          <Link
            key={t.to}
            to={t.to}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-colors ${
              active ? "text-zinc-50" : "text-zinc-500"
            }`}
          >
            <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 1.8} />
            <span className="text-[9px] font-medium uppercase tracking-widest">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
