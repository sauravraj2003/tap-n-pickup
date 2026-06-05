import { Link } from "@tanstack/react-router";
import { canteens } from "@/lib/data";

export function CanteenStories() {
  return (
    <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 no-scrollbar">
      {canteens.map((c) => (
        <Link
          key={c.id}
          to="/canteen/$id"
          params={{ id: c.id }}
          className="flex-none w-[72px] flex flex-col items-center gap-1.5 group"
        >
          <div className="relative">
            <span
              className={`block rounded-full p-[2.5px] ${
                c.open
                  ? "bg-[conic-gradient(from_180deg,#f59e0b,#ef4444,#a855f7,#3b82f6,#f59e0b)]"
                  : "bg-zinc-300"
              } group-active:scale-95 transition-transform`}
            >
              <span className="block bg-background p-[2px] rounded-full">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="size-16 rounded-full object-cover ring-1 ring-black/5"
                />
              </span>
            </span>
            {c.open && (
              <span className="absolute -bottom-0.5 right-0 bg-zinc-900 text-zinc-50 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ring-2 ring-background">
                {c.wait}m
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-center truncate w-full leading-tight">
            {c.name.split(" ")[c.name.split(" ").length - 1]}
          </span>
        </Link>
      ))}
    </div>
  );
}
