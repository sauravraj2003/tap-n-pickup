import { createFileRoute, Link } from "@tanstack/react-router";
import { Coins, Award, TrendingUp } from "lucide-react";
import { TopNav } from "@/components/web/TopNav";
import { useAuth, useRewards } from "@/lib/store";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards Wallet — BookIt" }] }),
  component: Rewards,
});

const badges = [
  { id: "first-order", name: "First Bite", desc: "Place your first order", icon: "🍽️", threshold: 1 },
  { id: "loyal", name: "Loyal Foodie", desc: "5 orders placed", icon: "🥇", threshold: 5 },
  { id: "high-roller", name: "Campus Star", desc: "Earn 500 coins", icon: "⭐", threshold: 500 },
];

function Rewards() {
  const { user } = useAuth();
  const { txns, balance, earn } = useRewards(user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <TopNav />
        <div className="max-w-md mx-auto py-20 px-6 text-center">
          <h1 className="text-2xl font-bold">Sign in to view rewards</h1>
          <Link to="/signin" className="mt-4 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">Sign in</Link>
        </div>
      </div>
    );
  }

  const orderCount = txns.filter((t) => t.amount > 0).length;

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Rewards Wallet</h1>
        <p className="text-zinc-600 text-sm mt-1">Earn Campus Coins on every order. Redeem for discounts.</p>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900 text-zinc-50 rounded-3xl p-6 sm:col-span-2 relative overflow-hidden">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-mono">Balance</p>
            <p className="text-6xl font-mono font-bold mt-3 flex items-baseline gap-2">
              <Coins className="size-8 text-amber-300" /> {balance}
            </p>
            <p className="text-xs text-zinc-400 mt-3">Campus Coins · 100 coins = ₹10 off</p>
            <button onClick={() => earn(user.id, 50, "Daily check-in bonus")} className="mt-5 px-4 py-2 rounded-xl bg-amber-300 text-zinc-900 text-xs font-bold">+ Daily check-in</button>
          </div>
          <div className="bg-white ring-1 ring-zinc-200 rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-mono">This month</p>
            <p className="text-3xl font-bold mt-3 flex items-center gap-2"><TrendingUp className="size-5" /> +{balance}</p>
            <p className="text-xs text-zinc-500 mt-2">{orderCount} earning event{orderCount === 1 ? "" : "s"}</p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="size-5" /> Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {badges.map((b) => {
              const earned = b.id === "first-order" ? orderCount >= 1 : b.id === "loyal" ? orderCount >= 5 : balance >= 500;
              return (
                <div key={b.id} className={`rounded-2xl p-5 ring-1 ${earned ? "bg-amber-50 ring-amber-200" : "bg-white ring-zinc-200 opacity-60"}`}>
                  <div className="text-3xl">{b.icon}</div>
                  <p className="font-bold mt-2">{b.name}</p>
                  <p className="text-xs text-zinc-500">{b.desc}</p>
                  {earned && <p className="mt-2 text-[10px] font-bold text-amber-700 uppercase tracking-widest">Earned</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Transaction history</h2>
          {txns.length === 0 ? (
            <p className="text-sm text-zinc-500 bg-white ring-1 ring-zinc-200 rounded-2xl p-6">No transactions yet — place an order to earn coins.</p>
          ) : (
            <div className="bg-white ring-1 ring-zinc-200 rounded-2xl divide-y divide-zinc-100">
              {txns.map((t) => (
                <div key={t.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t.reason}</p>
                    <p className="text-xs text-zinc-500 font-mono">{new Date(t.at).toLocaleString()}</p>
                  </div>
                  <span className={`font-mono font-bold ${t.amount >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                    {t.amount >= 0 ? "+" : ""}{t.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
