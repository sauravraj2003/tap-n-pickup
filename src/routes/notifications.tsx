import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/web/TopNav";
import { useAuth } from "@/lib/store";
import { useNotifications } from "@/lib/extras";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — BookIt" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const { all, markRead, markAllRead, clear, unread } = useNotifications(user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50"><TopNav />
        <div className="max-w-md mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Sign in to see notifications</h1>
          <Link to="/signin" className="mt-4 inline-block bg-zinc-900 text-zinc-50 px-6 py-3 rounded-xl text-sm font-semibold">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-zinc-600 mt-1">{unread} unread of {all.length}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={markAllRead} className="text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-2 ring-1 ring-zinc-300 rounded-xl"><CheckCheck className="size-3.5" /> Mark all read</button>
            <button onClick={clear} className="text-xs font-semibold inline-flex items-center gap-1.5 px-3 py-2 ring-1 ring-rose-200 text-rose-700 rounded-xl"><Trash2 className="size-3.5" /> Clear</button>
          </div>
        </div>

        {all.length === 0 ? (
          <div className="mt-8 bg-white ring-1 ring-zinc-200 rounded-2xl p-10 text-center">
            <Bell className="size-8 text-zinc-300 mx-auto" />
            <p className="text-sm text-zinc-500 mt-3">You're all caught up.</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-2">
            {all.map((n) => {
              const item = (
                <div className={`p-4 ring-1 rounded-2xl flex gap-3 transition-colors ${n.read ? "bg-white ring-zinc-200" : "bg-amber-50 ring-amber-200"}`}>
                  <div className={`size-10 rounded-xl grid place-items-center shrink-0 ${
                    n.kind === "order" ? "bg-emerald-100 text-emerald-700" :
                    n.kind === "transfer" ? "bg-blue-100 text-blue-700" :
                    n.kind === "admin" ? "bg-amber-100 text-amber-800" :
                    "bg-zinc-100 text-zinc-700"
                  }`}><Bell className="size-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3 items-baseline">
                      <p className="font-semibold text-sm">{n.title}</p>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap">{new Date(n.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-0.5">{n.body}</p>
                  </div>
                  {!n.read && (
                    <button onClick={(e) => { e.preventDefault(); markRead(n.id); }} className="self-start text-zinc-400 hover:text-zinc-900"><Check className="size-4" /></button>
                  )}
                </div>
              );
              return (
                <li key={n.id}>
                  {n.href ? <Link to={n.href as any} onClick={() => markRead(n.id)}>{item}</Link> : item}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
