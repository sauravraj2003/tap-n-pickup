import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/auth/otp")({
  component: Otp,
});

function Otp() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const handle = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <MobileFrame>
      <TopBar />
      <div className="flex-1 px-6 pt-2 pb-8 flex flex-col">
        <h1 className="text-3xl font-semibold tracking-tight">Verify it's you</h1>
        <p className="text-sm text-muted-foreground mt-1">We sent a 6-digit code to your device.</p>

        <div className="mt-10 flex gap-2 justify-between">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => handle(i, e.target.value)}
              inputMode="numeric"
              className="size-12 bg-surface ring-1 ring-border rounded-xl text-center font-mono text-xl focus:outline-none focus:ring-2 focus:ring-foreground"
            />
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Didn't get it? <span className="underline text-foreground">Resend in 0:24</span>
        </p>

        <button
          onClick={() => navigate({ to: "/home" })}
          className="mt-auto w-full bg-zinc-900 text-zinc-50 py-4 rounded-2xl font-medium text-sm"
        >
          Verify & continue
        </button>
      </div>
    </MobileFrame>
  );
}
