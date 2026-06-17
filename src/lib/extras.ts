// New mock stores layered on top of existing campus store: notifications,
// support tickets, and token management actions for orders.
import { useStoreKey } from "./store-helpers";
import type { Order } from "./store";

// ---- NOTIFICATIONS ----
export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  kind: "order" | "transfer" | "schedule" | "vendor" | "admin" | "system";
  at: number;
  read: boolean;
  href?: string;
};

const NOTIF_KEY = "campus:notifications";

export function useNotifications(userId?: string) {
  const [all, setAll] = useStoreKey<AppNotification[]>(NOTIF_KEY, []);
  const mine = userId ? all.filter((n) => n.userId === userId) : all;
  const unread = mine.filter((n) => !n.read).length;
  const push = (n: Omit<AppNotification, "id" | "at" | "read">) => {
    const item: AppNotification = { ...n, id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), read: false };
    setAll((prev) => [item, ...prev].slice(0, 200));
    return item;
  };
  const markRead = (id: string) => setAll((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setAll((prev) => prev.map((n) => (userId && n.userId !== userId ? n : { ...n, read: true })));
  const clear = () => setAll((prev) => prev.filter((n) => userId && n.userId !== userId));
  return { all: mine, unread, push, markRead, markAllRead, clear };
}

// ---- SUPPORT TICKETS ----
export type TicketCategory =
  | "technical"
  | "payment"
  | "vendor"
  | "barber"
  | "feature"
  | "feedback";

export type Ticket = {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: TicketCategory;
  message: string;
  voiceUrl?: string; // data URL for demo
  attachmentName?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  at: number;
  replies: { from: "user" | "admin"; text: string; at: number }[];
};

const TICKET_KEY = "campus:tickets";

export function useTickets(userId?: string) {
  const [tickets, setTickets] = useStoreKey<Ticket[]>(TICKET_KEY, []);
  const mine = userId ? tickets.filter((t) => t.userId === userId) : tickets;
  const open = (t: Omit<Ticket, "id" | "at" | "status" | "replies">) => {
    const item: Ticket = { ...t, id: `tk-${Date.now()}`, at: Date.now(), status: "open", replies: [] };
    setTickets((prev) => [item, ...prev]);
    return item;
  };
  const setStatus = (id: string, status: Ticket["status"]) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  const reply = (id: string, from: "user" | "admin", text: string) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, replies: [...t.replies, { from, text, at: Date.now() }] } : t)));
  return { tickets: mine, all: tickets, open, setStatus, reply };
}

// ---- TOKEN MANAGEMENT HELPERS ----
// 10-minute window after booking for reschedule / cancel / transfer.
export const TOKEN_MGMT_WINDOW_MS = 10 * 60 * 1000;
export function canManageToken(o: Order): boolean {
  if (!o) return false;
  if (["cancelled", "rejected", "picked_up"].includes(o.status)) return false;
  return Date.now() - o.createdAt <= TOKEN_MGMT_WINDOW_MS;
}
export function tokenWindowSecondsLeft(o: Order): number {
  return Math.max(0, Math.floor((o.createdAt + TOKEN_MGMT_WINDOW_MS - Date.now()) / 1000));
}

// ---- TOKEN AUDIT ----
export type TokenAudit = {
  id: string;
  orderId: string;
  token: number;
  action: "reschedule" | "cancel" | "transfer";
  at: number;
  by: string; // userId
  meta?: Record<string, any>;
};
const AUDIT_KEY = "campus:token_audit";
export function useTokenAudit() {
  const [audit, setAudit] = useStoreKey<TokenAudit[]>(AUDIT_KEY, []);
  const log = (entry: Omit<TokenAudit, "id" | "at">) => {
    const item: TokenAudit = { ...entry, id: `aud-${Date.now()}`, at: Date.now() };
    setAudit((prev) => [item, ...prev].slice(0, 500));
  };
  return { audit, log };
}
