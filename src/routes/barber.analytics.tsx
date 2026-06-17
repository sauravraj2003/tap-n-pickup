import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { TopNav } from "@/components/web/TopNav";
import { useAuth } from "@/lib/store";
import { getVendor } from "@/lib/campus-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";
import { Users, Clock, IndianRupee, Repeat, Scissors, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/barber/analytics")({
  head: () => ({ meta: [{ title: "Barber Analytics — BookIt" }] }),
  component: BarberAnalytics,
});

function BarberAnalytics() {
  const { user } = useAuth();
  const vendorId = user?.vendorId ?? "hall-2-barber";
  const vendor = getVendor(vendorId);

  const stats = useMemo(() => mockBarberStats(vendorId), [vendorId]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav activeTab="barbers" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Barber Analytics</h1>
            <p className="text-sm text-zinc-600 mt-1">{vendor?.name} · live demo data</p>
          </div>
          <Link to="/merchant" className="text-sm font-semibold underline text-zinc-700">← Back to dashboard</Link>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Kpi icon={Users} label="Today" value={String(stats.daily)} />
          <Kpi icon={TrendingUp} label="This week" value={String(stats.weekly)} />
          <Kpi icon={Scissors} label="This month" value={String(stats.monthly)} />
          <Kpi icon={IndianRupee} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
          <Kpi icon={Clock} label="Avg service" value={`${stats.avgService}m`} />
          <Kpi icon={Repeat} label="Retention" value={`${stats.retention}%`} />
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card title="Daily customers (last 14 days)">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.daySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="d" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="#18181b" fill="#fbbf24" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Most booked services">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.serviceMix} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis type="number" stroke="#71717a" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#18181b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="Time slot performance" className="mt-6">
          <div className="grid grid-cols-12 gap-2">
            {stats.slots.map((s, i) => (
              <div key={i} className="text-center">
                <div className="rounded-md bg-amber-100" style={{ height: 12 + s * 4, background: `rgba(24, 24, 27, ${0.2 + s / 30})` }} />
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">{8 + i}h</p>
              </div>
            ))}
          </div>
        </Card>
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

function mockBarberStats(seed: string) {
  const s = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const daily = 12 + (s % 9);
  const weekly = daily * 6 + (s % 25);
  const monthly = weekly * 4 + (s % 60);
  return {
    daily,
    weekly,
    monthly,
    revenue: monthly * (80 + (s % 60)),
    avgService: 18 + (s % 12),
    retention: 55 + (s % 30),
    daySeries: Array.from({ length: 14 }, (_, i) => ({ d: `D${i + 1}`, customers: 8 + ((s + i * 11) % 14) })),
    serviceMix: [
      { name: "Haircut", count: 120 + (s % 40) },
      { name: "Beard Trim", count: 80 + (s % 30) },
      { name: "Hot Towel", count: 35 + (s % 25) },
      { name: "Styling", count: 22 + (s % 18) },
    ],
    slots: Array.from({ length: 12 }, (_, i) => Math.max(1, 5 + ((s + i * 7) % 12) - (i === 4 || i === 9 ? -6 : 0))),
  };
}
