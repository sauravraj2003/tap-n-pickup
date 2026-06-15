import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { useAuth, useMerchantApps } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — BookIt" }] }),
  component: Admin,
});

function Admin() {
  const { user, updateRole } = useAuth();
  const { apps, decide } = useMerchantApps();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-zinc-50">
        <TopNav />
        <div className="max-w-md mx-auto py-20 px-6 text-center">
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-sm text-zinc-500 mt-2">Sign in with <span className="font-mono">admin@campus</span> to view this page.</p>
          <Link to="/signin" className="mt-4 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">Sign in</Link>
        </div>
      </div>
    );
  }

  const approve = (id: string, userId: string, vendorName: string) => {
    decide(id, "approved");
    // If the applicant is the currently-signed-in user, flip their role too.
    // In a real backend we'd update the target user record.
    if (user.id === userId) updateRole("merchant");
    toast.success(`Approved · ${vendorName}`);
  };
  const reject = (id: string, vendorName: string) => {
    decide(id, "rejected");
    toast.error(`Rejected · ${vendorName}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-zinc-600 text-sm mt-1">Review and approve merchant applications.</p>

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Merchant applications</h2>
          {apps.length === 0 ? (
            <p className="text-sm text-zinc-500 bg-white ring-1 ring-zinc-200 rounded-2xl p-6">No applications yet.</p>
          ) : (
            <div className="bg-white ring-1 ring-zinc-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-left text-[10px] uppercase tracking-widest text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3 hidden md:table-cell">Location</th>
                    <th className="px-4 py-3 hidden md:table-cell">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id} className="border-t border-zinc-100">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{a.userName}</p>
                        <p className="text-xs text-zinc-500">{a.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{a.vendorName}</p>
                        <p className="text-xs text-zinc-500 capitalize">{a.vendorKind}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-zinc-600">{a.location}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-zinc-600 font-mono text-xs">{a.ownerPhone}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${a.status === "pending" ? "bg-amber-100 text-amber-900" : a.status === "approved" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>{a.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {a.status === "pending" && (
                          <div className="inline-flex gap-2">
                            <button onClick={() => approve(a.id, a.userId, a.vendorName)} className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-50 text-xs font-semibold inline-flex items-center gap-1"><Check className="size-3" /> Approve</button>
                            <button onClick={() => reject(a.id, a.vendorName)} className="px-3 py-1.5 rounded-lg ring-1 ring-zinc-300 text-zinc-700 text-xs font-semibold inline-flex items-center gap-1"><X className="size-3" /> Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
