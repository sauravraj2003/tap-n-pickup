import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Utensils, Store } from "lucide-react";
import { useAuth, type Role } from "@/lib/store";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign in — BookIt" }] }),
  component: SignIn,
});

function SignIn() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "merchant">("user");

  const routeFor = (r: Role) => {
    if (r === "admin") return "/admin" as const;
    if (r === "merchant") return "/merchant" as const;
    if (r === "merchant_pending") return "/merchant" as const;
    return "/home" as const;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password required");
    if (mode === "signup") {
      if (!phone || phone.replace(/\D/g, "").length < 10) return toast.error("Enter a valid phone number");
      if (password.length < 6) return toast.error("Password must be at least 6 characters");
    }
    const u =
      mode === "signin"
        ? signIn(email, password)
        : signUp(name || email.split("@")[0], email, password, phone, role);
    toast.success(`Welcome, ${u.name}`);
    router.navigate({ to: routeFor(u.role) });
  };

  return (
    <div className="min-h-screen bg-zinc-50 grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-zinc-50">
        <Link to="/home" className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-zinc-50 text-zinc-900 grid place-items-center font-mono font-bold">B</div>
          <span className="text-xl font-bold tracking-tight">BookIt</span>
        </Link>
        <div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">Skip the queue.<br /><span className="text-amber-200">Eat on time.</span></h1>
          <p className="mt-4 text-zinc-400 max-w-md">Pre-order from canteens and barbers across campus. Pay ahead, get a token, walk in.</p>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          Try <span className="text-amber-300">admin@campus</span> to demo the admin console
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex gap-2 mb-8 text-sm font-semibold">
            <button onClick={() => setMode("signin")} className={`px-4 py-2 rounded-lg ${mode === "signin" ? "bg-zinc-900 text-zinc-50" : "text-zinc-500"}`}>Sign in</button>
            <button onClick={() => setMode("signup")} className={`px-4 py-2 rounded-lg ${mode === "signup" ? "bg-zinc-900 text-zinc-50" : "text-zinc-500"}`}>Create account</button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">I am a</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setRole("user")} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium ring-1 transition-colors ${role === "user" ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-white text-zinc-700 ring-zinc-200"}`}>
                      <Utensils className="size-4" /> Student / Customer
                    </button>
                    <button type="button" onClick={() => setRole("merchant")} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium ring-1 transition-colors ${role === "merchant" ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-white text-zinc-700 ring-zinc-200"}`}>
                      <Store className="size-4" /> Merchant / Owner
                    </button>
                  </div>
                </div>
                <Field label="Full name" value={name} onChange={setName} placeholder="Arjun Singh" />
                <Field label="Phone number" type="tel" value={phone} onChange={setPhone} placeholder="+91 98xxxxxxxx" />
              </>
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@campus.edu" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            <button type="submit" className="w-full bg-zinc-900 text-zinc-50 py-3 rounded-xl font-semibold text-sm">
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-xs text-zinc-500 text-center">
            One sign-in page for everyone — we'll take you to the right dashboard automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-white ring-1 ring-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
      />
    </label>
  );
}
