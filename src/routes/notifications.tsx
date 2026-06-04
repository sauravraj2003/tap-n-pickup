import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Tag, Sparkles } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { notifications } from "@/lib/data";

export const Route = createFileRoute("/notifications")({
  component: Notifs,
});

const iconMap = { ready: Check, prep: Bell, promo: Tag, new: Sparkles } as const;

function Notifs() {
  return (
    <MobileFrame>
      <TopBar back={false} title="Notifications" />
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const Icon = iconMap[n.kind as keyof typeof iconMap] || Bell;
            const accent = n.kind === "ready" ? "bg-emerald-500/15 text-emerald-600" : n.kind === "promo" ? "bg-amber-500/15 text-amber-600" : "bg-surface-2 text-foreground";
            return (
              <div key={n.id} className="p-4 bg-surface ring-1 ring-border rounded-2xl flex gap-3 animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <div className={`size-10 rounded-xl grid place-items-center flex-none ${accent}`}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}
