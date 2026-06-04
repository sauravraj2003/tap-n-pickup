import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function TopBar({ title, right, back = true }: { title?: string; right?: ReactNode; back?: boolean }) {
  const router = useRouter();
  return (
    <header className="px-5 pt-12 pb-3 flex items-center justify-between flex-none">
      <div className="flex items-center gap-3 min-w-0">
        {back && (
          <button
            onClick={() => router.history.back()}
            className="size-10 rounded-full bg-surface ring-1 ring-border grid place-items-center"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {title && <h1 className="text-base font-semibold truncate">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}

export function PageScroll({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>;
}
