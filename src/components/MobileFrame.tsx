import type { ReactNode } from "react";

/**
 * MobileFrame
 * - On mobile: just renders full-bleed
 * - On md+: shows the screen inside a phone shell, centered on a neutral canvas
 */
export function MobileFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="min-h-screen w-full bg-zinc-100 md:py-10 md:px-6">
      <div className="mx-auto md:w-[390px] md:h-[820px] md:rounded-[44px] md:ring-1 md:ring-black/5 md:shadow-2xl md:overflow-hidden md:relative min-h-screen md:min-h-0 bg-background">
        <div className={`${dark ? "dark" : ""} h-full w-full bg-background text-foreground flex flex-col min-h-screen md:min-h-0 md:h-[820px]`}>
          {children}
        </div>
      </div>
    </div>
  );
}
