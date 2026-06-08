import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Receipt, Bell, User, ShoppingBag } from "lucide-react";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r lg:border-black/10 lg:p-6 z-40">
      <div className="flex items-center gap-2.5 mb-10">
        <div className="size-10 rounded-xl bg-zinc-900 text-zinc-50 grid place-items-center font-mono font-bold">B</div>
        <div>
          <div className="text-lg font-bold tracking-tight">BookIt</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Skip the queue</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((t) => {
          const Icon = t.icon;
          const active = path === t.to || (t.to === "/orders" && path.startsWith("/order"));
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-zinc-900 text-zinc-50" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Icon className="size-4" />
              {t.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-black/10 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
        © {new Date().getFullYear()} BookIt
      </div>
    </aside>
  );
}

/**
 * MobileFrame
 * - Mobile/tablet: full-bleed with bottom nav (rendered separately)
 * - Desktop (lg+): sidebar layout, content max-width centered, no phone shell
 */
export function MobileFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`${dark ? "dark" : ""} min-h-screen w-full bg-zinc-100`}>
      <Sidebar />
      <div className="lg:pl-64">
        {/* On mobile/tablet keep the phone-like centered canvas; on desktop go full responsive */}
        <div className="mx-auto lg:max-w-6xl bg-background text-foreground min-h-screen lg:min-h-0 lg:py-6 lg:px-8">
          <div className="lg:rounded-3xl lg:ring-1 lg:ring-black/5 lg:bg-background lg:overflow-hidden flex flex-col min-h-screen lg:min-h-[calc(100vh-3rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
