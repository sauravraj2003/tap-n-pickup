import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Camera } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { canteens } from "@/lib/data";

export const Route = createFileRoute("/reviews/$id")({
  loader: ({ params }) => {
    const c = canteens.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { canteen: c };
  },
  component: ReviewPage,
});

const foodMetrics = ["Taste", "Quantity", "Quality"] as const;
const canteenMetrics = ["Cleanliness", "Service", "Overall"] as const;

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}>
          <Star className={`size-6 ${i < value ? "fill-foreground stroke-foreground" : "stroke-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

function ReviewPage() {
  const { canteen } = Route.useLoaderData();
  const [scores, setScores] = useState<Record<string, number>>({});

  return (
    <MobileFrame>
      <TopBar title="Rate your order" />
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="text-center mt-2">
          <img src={canteen.image} alt={canteen.name} className="size-20 mx-auto rounded-2xl object-cover ring-1 ring-border" />
          <h2 className="mt-3 text-lg font-semibold">{canteen.name}</h2>
          <p className="text-xs text-muted-foreground">How was your experience?</p>
        </div>

        <section className="mt-8">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Food</h3>
          <div className="space-y-3">
            {foodMetrics.map((m) => (
              <div key={m} className="flex items-center justify-between p-3 bg-surface ring-1 ring-border rounded-2xl">
                <span className="text-sm font-medium">{m}</span>
                <Stars value={scores[m] || 0} onChange={(n) => setScores((s) => ({ ...s, [m]: n }))} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Canteen</h3>
          <div className="space-y-3">
            {canteenMetrics.map((m) => (
              <div key={m} className="flex items-center justify-between p-3 bg-surface ring-1 ring-border rounded-2xl">
                <span className="text-sm font-medium">{m}</span>
                <Stars value={scores[m] || 0} onChange={(n) => setScores((s) => ({ ...s, [m]: n }))} />
              </div>
            ))}
          </div>
        </section>

        <textarea
          placeholder="Tell us more (optional)…"
          rows={3}
          className="mt-6 w-full bg-surface ring-1 ring-border rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
        />

        <button className="mt-3 w-full bg-surface ring-1 ring-border rounded-2xl py-3 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 text-muted-foreground">
          <Camera className="size-4" /> Add photo
        </button>
      </div>

      <div className="px-5 py-4 bg-background border-t border-border flex-none">
        <Link to="/home" className="w-full bg-zinc-900 text-zinc-50 py-4 rounded-2xl font-medium text-sm flex justify-center">
          Submit review
        </Link>
      </div>
    </MobileFrame>
  );
}
