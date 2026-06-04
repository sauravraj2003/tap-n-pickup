import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/auth")({
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <TopBar back={false} />
      <div className="flex-1 px-6 pt-2 pb-8 flex flex-col">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Log in or sign up — we'll take it from here.</p>

        <div className="mt-8 inline-flex bg-surface ring-1 ring-border rounded-xl p-1 self-start">
          {(["email", "phone"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors ${
                mode === m ? "bg-zinc-900 text-zinc-50" : "text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-6 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {mode === "email" ? <Mail className="size-4" /> : <Phone className="size-4" />}
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === "email" ? "you@example.com" : "+1 (555) 000-0000"}
            className="w-full bg-surface ring-1 ring-border rounded-2xl pl-11 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <button
          onClick={() => navigate({ to: "/auth/otp" })}
          className="mt-4 w-full bg-zinc-900 text-zinc-50 py-4 rounded-2xl font-medium text-sm"
        >
          Continue
        </button>

        <div className="my-7 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button className="w-full bg-surface ring-1 ring-border py-4 rounded-2xl font-medium text-sm flex items-center justify-center gap-3">
          <span className="size-4 rounded-full bg-gradient-to-tr from-red-500 via-amber-400 to-blue-500" />
          Continue with Google
        </button>

        <p className="mt-auto text-[11px] text-muted-foreground text-center leading-relaxed pt-6">
          By continuing, you agree to our <span className="underline">Terms</span> and{" "}
          <span className="underline">Privacy Policy</span>.
        </p>

        <Link to="/home" className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mt-4">
          Skip for now →
        </Link>
      </div>
    </MobileFrame>
  );
}
