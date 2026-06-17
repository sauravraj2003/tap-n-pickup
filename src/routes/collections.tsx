import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/web/TopNav";
import { Footer } from "@/components/web/Footer";
import { priceCollections, categoryCollections, allMenuItems } from "@/lib/campus-data";
import { Tag, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — BookIt" },
      { name: "description", content: "Discover food across campus by price and category — Maggi, shakes, coffee, breakfast, healthy and more." },
    ],
  }),
  component: CollectionsIndex,
});

function CollectionsIndex() {
  const countFor = (filter: (m: any) => boolean) => allMenuItems.filter(filter).length;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <TopNav />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Collections</h1>
        <p className="text-sm text-zinc-600 mt-2 max-w-2xl">Discover dishes from every canteen on campus, grouped by price and what you're in the mood for.</p>

        <h2 className="mt-10 text-xl font-bold tracking-tight flex items-center gap-2"><IndianRupee className="size-5" /> Shop by price</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {priceCollections.map((c, i) => (
            <Link
              key={c.slug}
              to="/collections/$slug"
              params={{ slug: c.slug }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 ring-1 ring-amber-200 rounded-2xl p-5 hover:shadow-md transition-shadow animate-rise"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <p className="text-2xl font-bold tracking-tight">{c.title}</p>
              <p className="text-xs text-zinc-600 mt-1">{c.subtitle}</p>
              <p className="text-[11px] font-mono uppercase tracking-widest text-amber-700 mt-3">{countFor(c.filter)} items</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 text-xl font-bold tracking-tight flex items-center gap-2"><Tag className="size-5" /> Shop by category</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryCollections.map((c, i) => {
            const items = allMenuItems.filter(c.filter);
            const cover = items[0]?.image;
            return (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-zinc-200 group animate-rise"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {cover && <img src={cover} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-zinc-50">
                  <p className="font-bold leading-tight">{c.title}</p>
                  <p className="text-[11px] opacity-80 mt-0.5">{items.length} items · {c.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
