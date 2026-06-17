import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/store";
import { useNotifications } from "@/lib/extras";

export function NotificationBell() {
  const { user } = useAuth();
  const { unread } = useNotifications(user?.id);
  return (
    <Link to="/notifications" className="relative text-zinc-700 hover:text-zinc-900" aria-label="Notifications">
      <Bell className="size-5" />
      {unread > 0 && (
        <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 grid place-items-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
