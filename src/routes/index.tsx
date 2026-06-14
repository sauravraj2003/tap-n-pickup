import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, ChevronDown, Star, Utensils, Bike, Wine, SlidersHorizontal, ChevronRight } from "lucide-react";
import { canteens } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookIt — Discover, order & skip the queue" },
      { name: "description", content: "Discover canteens, cafes & quick bites near you. Order ahead and skip the queue with BookIt." },
    ],
  }),
  component: Landing,
});

const collections = [
  { title: "Best Bars & Pubs", count: 14, img: canteens[0].image },
  { title: "Great Cafes", count: 10, img: canteens[1].image },
  { title: "Insta-worthy Spots", count: 7, img: canteens[3].image },
  { title: "Best Lunch Places", count: 14, img: canteens[2].image },
];

const filters = ["Filters", "Offers", "Rating: 4.5+", "Quick Prep", "Outdoor seating", "Serves Coffee", "Open Now"];

const tabs = [
  { id: "dining", label: "Dining Out", icon: Utensils, active: true },
  { id: "delivery", label: "Delivery", icon: Bike },
  { id: "nightlife", label: "Nightlife", icon: Wine },
];

function Landing() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* TOP BAR */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
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
              <span className="text-sm text-zinc-500 truncate">Search for canteen, cuisine or a dish</span>
            </div>
          </div>

          <button className="md:hidden ml-auto size-10 rounded-xl ring-1 ring-zinc-200 grid place-items-center">
            <Search className="size-4" />
          </button>

          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <Link to="/auth" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">Log in</Link>
            <Link to="/auth" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">Sign up</Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex gap-2 sm:gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  className={`flex items-center gap-3 py-4 border-b-2 whitespace-nowrap transition-colors ${
                    t.active ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <span className={`size-9 rounded-full grid place-items-center ${t.active ? "bg-zinc-900 text-zinc-50" : "bg-zinc-100 text-zinc-700"}`}>
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* COLLECTIONS */}
      <section className="bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Collections</h1>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl">
              Explore curated lists of top canteens, cafes, and quick bites on campus — based on trends.
            </p>
            <Link to="/home" className="text-sm font-semibold text-zinc-900 inline-flex items-center gap-1 hover:underline">
              All collections <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((c, i) => (
              <Link
                key={c.title}
                to="/home"
                className="relative aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-zinc-900/5 group animate-rise"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/85 via-zinc-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-zinc-50">
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">{c.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs font-medium opacity-90">
                    {c.count} Places <ChevronRight className="size-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="bg-white border-y border-zinc-200 sticky top-[129px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex gap-3 overflow-x-auto no-scrollbar">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full text-sm font-medium ring-1 whitespace-nowrap transition-colors ${
                i === 0
                  ? "bg-white ring-zinc-300 text-zinc-700 inline-flex items-center gap-2"
                  : "bg-white ring-zinc-200 text-zinc-700 hover:ring-zinc-900"
              }`}
            >
              {i === 0 && <SlidersHorizontal className="size-3.5" />}
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <Link to="/home" className="block rounded-2xl bg-zinc-900 text-zinc-50 px-6 sm:px-10 py-8 sm:py-12 relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3">BookIt Members</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-none">
              Get up to<br />
              <span className="text-amber-200">50% OFF</span>
            </h2>
            <p className="mt-4 text-sm text-zinc-300">On your dining bills, every weekday lunch.</p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden sm:block opacity-60">
            <img src={canteens[0].image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-transparent" />
          </div>
        </Link>
      </section>

      {/* BEST FOOD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Best Food on Campus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {[...canteens, ...canteens].map((c, i) => (
            <Link
              key={`${c.id}-${i}`}
              to="/canteen/$id"
              params={{ id: c.id }}
              className="group animate-rise"
              style={{ animationDelay: `${(i % 6) * 50}ms` }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-zinc-900/5 mb-3">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-zinc-900 text-zinc-50 text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded">
                  Promoted
                </div>
                <div className="absolute bottom-3 left-3 bg-zinc-900/90 text-zinc-50 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  Flat {10 + ((i * 5) % 30)}% OFF
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold tracking-tight truncate flex-1">{c.name}</h3>
                <div className="flex items-center gap-1 bg-zinc-900 text-zinc-50 text-xs font-bold px-1.5 py-0.5 rounded shrink-0">
                  {c.rating}
                  <Star className="size-3 fill-zinc-50 stroke-zinc-50" />
                </div>
              </div>
              <div className="flex justify-between items-baseline mt-1.5 text-sm">
                <p className="text-zinc-500 truncate flex-1 mr-3">{c.tags.join(", ")}</p>
                <p className="text-zinc-700 font-medium whitespace-nowrap">₹{300 + i * 50} for two</p>
              </div>
              <div className="flex justify-between items-baseline mt-1 text-sm">
                <p className={`font-medium ${c.open ? "text-emerald-700" : "text-rose-700"}`}>
                  {c.open ? `Open · ${c.wait}m wait` : "Opens at 12 noon"}
                </p>
                <p className="text-zinc-500 font-mono text-xs">{c.distance}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-zinc-50 text-zinc-900 grid place-items-center font-mono font-bold">B</div>
              <span className="text-zinc-50 font-bold">BookIt</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">Skip the queue. Order ahead at your favourite canteens.</p>
          </div>
          {[
            { title: "Company", links: ["About", "Careers", "Team", "Blog"] },
            { title: "For You", links: ["Privacy", "Terms", "Security", "Contact"] },
            { title: "For Canteens", links: ["Partner", "Apps", "Insights", "Support"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-zinc-50 font-semibold mb-3 text-xs uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-2 text-zinc-400">
                {col.links.map((l) => <li key={l}><a href="#" className="hover:text-zinc-50">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500 font-mono">
          © {new Date().getFullYear()} BOOKIT — All rights reserved
        </div>
      </footer>
    </div>
  );
}
