import { createFileRoute } from "@tanstack/react-router";
import { Sun, Moon, Eye, Palette, Bell, Smartphone } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { Footer } from "@/components/web/Footer";
import { useTheme, type Theme } from "@/lib/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — BookIt" }] }),
  component: Settings,
});

const themes: { id: Theme; label: string; desc: string; icon: any; preview: string }[] = [
  { id: "light", label: "Light Mode", desc: "Bright, neutral defaults", icon: Sun, preview: "bg-zinc-50 border-zinc-200" },
  { id: "dark", label: "Dark Mode", desc: "Easier in low light", icon: Moon, preview: "bg-zinc-900 border-zinc-700" },
  { id: "eye-comfort", label: "Eye Comfort", desc: "Warm, sepia tint for night reading", icon: Eye, preview: "bg-amber-50 border-amber-200" },
];

function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <TopNav />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-10 w-full">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-600 mt-2">Tune BookIt to fit how you use it.</p>

        <div className="mt-8 bg-white ring-1 ring-zinc-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold flex items-center gap-2"><Palette className="size-5" /> Appearance</h2>
          <p className="text-xs text-zinc-500 mt-1">Your choice is saved on this device and reapplied next time you sign in.</p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`text-left rounded-2xl p-4 ring-1 transition-all ${active ? "ring-zinc-900 bg-zinc-50 shadow-sm" : "ring-zinc-200 bg-white hover:ring-zinc-400"}`}
                >
                  <div className={`h-16 rounded-xl border-2 mb-3 ${t.preview}`} />
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <p className="font-semibold text-sm">{t.label}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
                  {active && <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 mt-2">Active</p>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-white ring-1 ring-zinc-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Bell className="size-5" /> Notifications</h2>
          <ToggleRow label="Order updates" desc="Status changes for your active token" defaultOn />
          <ToggleRow label="Promotional offers" desc="Weekly deals from your favorite canteens" />
          <ToggleRow label="Token transfer alerts" desc="When someone sends you a token" defaultOn />
        </div>

        <div className="mt-6 bg-white ring-1 ring-zinc-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Smartphone className="size-5" /> Accessibility</h2>
          <ToggleRow label="Reduce motion" desc="Disable card and page animations" />
          <ToggleRow label="High-contrast text" desc="Bolder text colors across the app" />
        </div>
      </section>
      <Footer />
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-zinc-500">{desc}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultOn} className="size-5 accent-zinc-900" />
    </label>
  );
}
