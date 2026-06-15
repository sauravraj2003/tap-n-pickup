import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { TopNav } from "@/components/web/TopNav";
import { useAuth, useMerchantApps } from "@/lib/store";

export const Route = createFileRoute("/apply")({
  head: () => ({ meta: [{ title: "Apply as Merchant — BookIt" }] }),
  component: Apply,
});

function Apply() {
  const { user, updateRole } = useAuth();
  const { submit } = useMerchantApps();
  const router = useRouter();
  const [vendorName, setVendorName] = useState("");
  const [vendorKind, setVendorKind] = useState<"canteen" | "barber">("canteen");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <TopNav />
        <div className="max-w-md mx-auto py-20 px-6 text-center">
          <h1 className="text-2xl font-bold">Sign in to apply</h1>
          <Link to="/signin" className="mt-4 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">Sign in</Link>
        </div>
      </div>
    );
  }

  if (user.role !== "user") {
    return (
      <div className="min-h-screen bg-zinc-50">
        <TopNav />
        <div className="max-w-md mx-auto py-20 px-6 text-center">
          <h1 className="text-2xl font-bold">You're already {user.role.replace("_", " ")}</h1>
          <Link to="/home" className="mt-4 inline-block text-sm font-semibold underline">Back home</Link>
        </div>
      </div>
    );
  }

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !location || !phone) return toast.error("All fields are required");
    submit({
      userId: user.id,
      userName: user.name,
      email: user.email,
      vendorName,
      vendorKind,
      location,
      ownerPhone: phone,
    });
    updateRole("merchant_pending");
    toast.success("Application submitted · pending admin approval");
    router.navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Apply as a Merchant</h1>
        <p className="text-zinc-600 mt-2 text-sm max-w-lg">
          Tell us about your campus business. Once an admin approves you, you'll get access to the Merchant Dashboard to manage orders and queues.
        </p>
        <form onSubmit={apply} className="mt-8 bg-white ring-1 ring-zinc-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <Field label="Canteen / Barber name" value={vendorName} onChange={setVendorName} placeholder="Hall 7 Canteen" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Type</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["canteen", "barber"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setVendorKind(k)} className={`py-3 rounded-xl text-sm font-medium ring-1 capitalize ${vendorKind === k ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-white text-zinc-700 ring-zinc-200"}`}>{k}</button>
              ))}
            </div>
          </div>
          <Field label="Location on campus" value={location} onChange={setLocation} placeholder="Hall 7 · Ground Floor" />
          <Field label="Owner phone" value={phone} onChange={setPhone} placeholder="+91 98xxxxxxxx" />
          <button className="w-full bg-zinc-900 text-zinc-50 py-3 rounded-xl text-sm font-semibold">Submit application</button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-zinc-50 ring-1 ring-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
      />
    </label>
  );
}
