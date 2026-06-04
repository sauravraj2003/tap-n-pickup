import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Clock, MapPin, Bell } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookIt — Skip the canteen queue" },
      { name: "description", content: "Pre-order food, get a token, and pick up without waiting." },
    ],
  }),
  component: Welcome,
});

const benefits = [
  { icon: Zap, title: "Skip the queue", desc: "Order ahead, walk straight to the counter." },
  { icon: Clock, title: "Real-time waiting", desc: "Live token & estimated ready time." },
  { icon: MapPin, title: "Discover canteens", desc: "Find what's nearby, open, and fast." },
  { icon: Bell, title: "Pickup alerts", desc: "We'll ping you when food is almost ready." },
];

function Welcome() {
  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col px-7 pt-16 pb-8">
        <div className="flex items-center gap-2 mb-12 animate-soft-fade">
          <div className="size-8 rounded-lg bg-zinc-900 text-zinc-50 grid place-items-center font-mono text-sm font-bold">B</div>
          <span className="font-semibold tracking-tight">BookIt</span>
        </div>

        <div className="flex-1 flex flex-col">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3 animate-rise">No. 042 in line — never again</p>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-balance animate-rise" style={{ animationDelay: "60ms" }}>
            Order ahead.<br />
            <span className="text-muted-foreground">Pick up at your time.</span>
          </h1>

          <div className="mt-12 space-y-5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex items-start gap-4 animate-rise" style={{ animationDelay: `${120 + i * 60}ms` }}>
                  <div className="size-10 rounded-xl bg-surface ring-1 ring-border grid place-items-center flex-none">
                    <Icon className="size-[18px]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">{b.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 space-y-3 animate-rise" style={{ animationDelay: "500ms" }}>
          <Link to="/auth" className="block w-full bg-zinc-900 text-zinc-50 py-4 rounded-2xl font-medium text-sm text-center">
            Create an account
          </Link>
          <Link to="/auth" className="block w-full bg-surface ring-1 ring-border py-4 rounded-2xl font-medium text-sm text-center">
            Log in
          </Link>
          <Link to="/home" className="block w-full py-3 text-xs font-medium text-muted-foreground text-center uppercase tracking-widest">
            Continue as guest →
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
}
