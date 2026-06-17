import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { TopNav } from "@/components/web/TopNav";
import { useAuth, useOrders } from "@/lib/store";
import { getVendor, menuByVendor } from "@/lib/campus-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { TrendingUp, Clock, Users, IndianRupee, Repeat, Award } from "lucide-react";

export const Route = createFileRoute("/merchant/analytics")({
  head: () => ({ meta: [{ title: "Vendor Analytics — BookIt" }] }),
  component: VendorAnalytics,
});

function VendorAnalytics() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const vendorId = user?.vendorId ?? "hall-1-canteen";
  const vendor = getVendor(vendorId);

  const stats = useMemo(() => mockStats(vendorId, orders.filter((o) => o.vendorId === vendorId)), [vendorId, orders]);
  const menu = useMemo(() => menuByVendor(vendorId), [vendorId]);
  const topItems = useMemo(() => itemSales(menu, 47), [menu]);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50"><TopNav />
        <div className="max-w-md mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Sign in to view analytics</h1>
          <Link to="/signin" className="mt-4 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Analytics</h1>
            <p className="text-sm text-zinc-600 mt-1">{vendor?.name} · live demo data</p>
          </div>
          <Link to="/merchant" className="text-sm font-semibold underline text-zinc-700">← Back to dashboard</Link>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Kpi icon={TrendingUp} label="Total orders" value={String(stats.totalOrders)} />
          <Kpi icon={IndianRupee} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
          <Kpi icon={Users} label="Today" value={String(stats.today)} />
          <Kpi icon={Clock} label="Avg prep" value={`${stats.avgPrep}m`} />
          <Kpi icon={Award} label="AOV" value={`₹${stats.aov}`} />
          <Kpi icon={Repeat} label="Repeat rate" value={`${stats.repeatRate}%`} />
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card title="Revenue trend (last 7 days)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Orders by day">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip />
                <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="Hourly heatmap (peak hours)" className="mt-6">
          <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
            {stats.hourly.map((h, i) => (
              <div key={i} title={`${i}:00 · ${h} orders`} className="aspect-square rounded" style={{ background: `rgba(245, 158, 11, ${0.1 + (h / 30) * 0.85})` }} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span></div>
        </Card>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card title="Top 10 selling items">
            <ul className="text-sm divide-y divide-zinc-100">
              {topItems.slice(0, 10).map((it, i) => (
                <li key={it.id} className="flex justify-between py-2.5">
                  <span><span className="font-mono text-zinc-400 mr-3">{String(i + 1).padStart(2, "0")}</span>{it.name}</span>
                  <span className="font-mono font-bold">{it.sold}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Least selling items">
            <ul className="text-sm divide-y divide-zinc-100">
              {[...topItems].reverse().slice(0, 5).map((it) => (
                <li key={it.id} className="flex justify-between py-2.5">
                  <span>{it.name}</span>
                  <span className="font-mono text-rose-600">{it.sold}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white ring-1 ring-zinc-200 rounded-2xl p-4">
      <Icon className="size-4 text-zinc-500" />
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">{label}</p>
      <p className="text-xl font-bold font-mono mt-0.5">{value}</p>
    </div>
  );
}

function Card({ title, children, className = "" }: any) {
  return (
    <div className={`bg-white ring-1 ring-zinc-200 rounded-2xl p-5 ${className}`}>
      <h3 className="font-bold text-sm mb-3">{title}</h3>
      {children}
    </div>
  );
}

function mockStats(seed: string, realOrders: any[]) {
  const s = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const total = 420 + (s % 200) + realOrders.length;
  const revenue = total * (95 + (s % 60));
  const revenueSeries = Array.from({ length: 7 }, (_, i) => {
    const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
    const orders = 40 + ((s + i * 13) % 35);
    return { day, orders, revenue: orders * (90 + (s % 50)) };
  });
  const hourly = Array.from({ length: 24 }, (_, h) => {
    const peak = Math.abs(h - 13) < 3 || Math.abs(h - 20) < 3 ? 25 : 6;
    return Math.max(0, peak + ((s + h * 7) % 8) - 4);
  });
  return {
    totalOrders: total,
    today: 18 + (s % 14) + realOrders.filter((o) => Date.now() - o.createdAt < 86_400_000).length,
    revenue,
    aov: Math.round(revenue / total),
    avgPrep: 8 + (s % 10),
    repeatRate: 42 + (s % 35),
    revenueSeries,
    hourly,
  };
}

function itemSales(menu: any[], seed: number) {
  return [...menu]
    .map((m, i) => ({ ...m, sold: 200 - ((i * 17 + seed) % 180) }))
    .sort((a, b) => b.sold - a.sold);
}
