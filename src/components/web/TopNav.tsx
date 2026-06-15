import { Link } from "@tanstack/react-router";
import { Search, MapPin, ChevronDown, Bell, User, ShoppingBag, Utensils, Scissors, LogOut } from "lucide-react";
import { useAuth, useCart } from "@/lib/store";

export function TopNav({ activeTab = "canteens" }: { activeTab?: "canteens" | "barbers" }) {
  const { user, signOut } = useAuth();
  const { lines } = useCart();
  const cartCount = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-3 sm:gap-6">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <div className="size-9 rounded-xl bg-zinc-900 text-zinc-50 grid place-items-center font-mono font-bold">B</div>
          <span className="hidden sm:block text-xl font-bold tracking-tight">BookIt</span>
        </Link>

        <div className="flex-1 min-w-0 hidden md:flex items-center gap-0 bg-white ring-1 ring-zinc-200 rounded-xl shadow-sm h-12 overflow-hidden">
          <div className="flex items-center gap-2 px-4 h-full border-r border-zinc-200 min-w-0">
            <MapPin className="size-4 text-zinc-900 shrink-0" />
            <span className="text-sm font-medium truncate">Main Campus</span>
            <ChevronDown className="size-4 text-zinc-500 shrink-0" />
          </div>
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
            <Search className="size-4 text-zinc-500 shrink-0" />
            <input className="text-sm bg-transparent outline-none flex-1 min-w-0 placeholder:text-zinc-500" placeholder="Search for canteen, barber, or a dish" />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-5 shrink-0 text-sm">
          {user?.role === "admin" && (
            <Link to="/admin" className="font-semibold text-zinc-900 hover:underline">Admin</Link>
          )}
          {user?.role === "merchant" && (
            <Link to="/merchant" className="font-semibold text-zinc-900 hover:underline">Merchant</Link>
          )}
          {user?.role === "merchant_pending" && (
            <span className="text-xs px-2 py-1 rounded-md bg-amber-100 text-amber-900 font-medium">Pending Approval</span>
          )}
          {user?.role === "user" && (
            <Link to="/apply" className="text-zinc-700 hover:text-zinc-900">Apply as Merchant</Link>
          )}
          <Link to="/checkout" className="relative text-zinc-700 hover:text-zinc-900">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-zinc-900 text-zinc-50 text-[10px] font-bold rounded-full size-4 grid place-items-center">{cartCount}</span>
            )}
          </Link>
          <Link to="/notifications" className="text-zinc-700 hover:text-zinc-900"><Bell className="size-5" /></Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900">
                <User className="size-5" />
                <span className="text-sm font-medium hidden xl:inline">{user.name}</span>
              </Link>
              <button onClick={signOut} className="text-zinc-500 hover:text-zinc-900" title="Sign out"><LogOut className="size-4" /></button>
            </div>
          ) : (
            <Link to="/signin" className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-50 text-sm font-semibold">Sign in</Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex gap-2 sm:gap-8 overflow-x-auto no-scrollbar">
          <TabLink to="/home" active={activeTab === "canteens"} icon={Utensils} label="Canteens" />
          <TabLink to="/barbers" active={activeTab === "barbers"} icon={Scissors} label="Barbers" />
        </div>
      </div>
    </header>
  );
}

function TabLink({ to, active, icon: Icon, label }: { to: string; active: boolean; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 py-4 border-b-2 whitespace-nowrap transition-colors ${
        active ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-900"
      }`}
    >
      <span className={`size-9 rounded-full grid place-items-center ${active ? "bg-zinc-900 text-zinc-50" : "bg-zinc-100 text-zinc-700"}`}>
        <Icon className="size-4" />
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
