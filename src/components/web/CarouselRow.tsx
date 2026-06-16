import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VendorCard } from "./VendorCard";
import type { Vendor } from "@/lib/campus-data";

export function CarouselRow({ title, subtitle, vendors }: { title: string; subtitle?: string; vendors: Vendor[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };
  if (vendors.length === 0) return null;
  return (
    <div className="mt-10">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="size-9 rounded-full ring-1 ring-zinc-300 bg-white hover:bg-zinc-900 hover:text-zinc-50 transition-colors grid place-items-center">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="size-9 rounded-full ring-1 ring-zinc-300 bg-white hover:bg-zinc-900 hover:text-zinc-50 transition-colors grid place-items-center">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div ref={scroller} className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
        {vendors.map((v, i) => (
          <div key={v.id} className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[30%]">
            <VendorCard vendor={v} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
