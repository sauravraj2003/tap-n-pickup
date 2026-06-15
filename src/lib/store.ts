// localStorage-backed mock store for auth, cart, orders, merchant apps, rewards.
// Structure mirrors what would be a Supabase schema so it can be swapped later.
import { useEffect, useState, useCallback } from "react";

const KEYS = {
  auth: "campus:auth",
  cart: "campus:cart",
  orders: "campus:orders",
  apps: "campus:merchant_apps",
  approved: "campus:approved_merchants",
  rewards: "campus:rewards",
  menus: "campus:menus",
  queues: "campus:queues",
};

export type Role = "guest" | "user" | "merchant_pending" | "merchant" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  vendorId?: string; // for merchants
};

export type CartLine = {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  price: number;
  prep: number;
  qty: number;
  notes?: string;
  image?: string;
};

export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "picked_up" | "rejected" | "cancelled";

export type Order = {
  id: string;
  token: number;
  userId: string;
  userName: string;
  vendorId: string;
  vendorName: string;
  lines: CartLine[];
  total: number;
  schedule: "now" | "30m" | "60m";
  status: OrderStatus;
  createdAt: number;
  acceptDeadline: number; // unix ms — vendor must accept by this time
  etaMinutes: number;
  queuePosition: number;
  notes?: string;
  paymentMethod: "campus-card" | "upi";
};

export type MerchantApplication = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  vendorName: string;
  vendorKind: "canteen" | "barber";
  location: string;
  ownerPhone: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
};

export type RewardTxn = {
  id: string;
  userId: string;
  amount: number; // positive = earn, negative = spend
  reason: string;
  at: number;
};

// ---- low-level helpers ----
const read = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent(`store:${k}`));
};

function useStoreKey<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => read(key, fallback));
  useEffect(() => {
    const onChange = () => setVal(read(key, fallback));
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setVal(read(key, fallback));
    };
    window.addEventListener(`store:${key}`, onChange as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(`store:${key}`, onChange as EventListener);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === "function" ? (v as (prev: T) => T)(read(key, fallback)) : v;
      write(key, next);
      setVal(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [val, set];
}

// ---- AUTH ----
const SEEDED_ADMIN: AuthUser = { id: "admin-1", email: "admin@campus", name: "Campus Admin", role: "admin" };

export function useAuth() {
  const [user, setUser] = useStoreKey<AuthUser | null>(KEYS.auth, null);

  const signIn = (email: string, _password: string) => {
    if (email.trim().toLowerCase() === "admin@campus") {
      setUser(SEEDED_ADMIN);
      return SEEDED_ADMIN;
    }
    const u: AuthUser = {
      id: `u-${Date.now()}`,
      email,
      name: email.split("@")[0] || "Student",
      role: "user",
    };
    setUser(u);
    return u;
  };
  const signUp = (name: string, email: string, _password: string) => {
    const u: AuthUser = { id: `u-${Date.now()}`, email, name, role: "user" };
    setUser(u);
    return u;
  };
  const signOut = () => setUser(null);
  const updateRole = (role: Role, vendorId?: string) => {
    if (!user) return;
    setUser({ ...user, role, vendorId });
  };

  return { user, signIn, signUp, signOut, updateRole };
}

// ---- CART ----
export function useCart() {
  const [lines, setLines] = useStoreKey<CartLine[]>(KEYS.cart, []);
  const add = (line: Omit<CartLine, "qty"> & { qty?: number }) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === line.id);
      if (existing) {
        return prev.map((l) => (l.id === line.id ? { ...l, qty: l.qty + (line.qty ?? 1) } : l));
      }
      return [...prev, { ...line, qty: line.qty ?? 1 }];
    });
  };
  const setQty = (id: string, qty: number) =>
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))));
  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));
  const clear = () => setLines([]);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return { lines, add, setQty, remove, clear, total };
}

// ---- ORDERS ----
export function useOrders() {
  const [orders, setOrders] = useStoreKey<Order[]>(KEYS.orders, []);
  const place = (o: Omit<Order, "id" | "token" | "createdAt" | "status" | "acceptDeadline" | "queuePosition">) => {
    const now = Date.now();
    const token = 40 + (orders.length % 200) + Math.floor(Math.random() * 60);
    const queuePosition = Math.max(1, Math.floor(Math.random() * 5));
    const order: Order = {
      ...o,
      id: `ord-${now}`,
      token,
      createdAt: now,
      status: "pending",
      acceptDeadline: now + 60_000,
      queuePosition,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };
  const update = (id: string, patch: Partial<Order>) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  const byUser = (uid: string) => orders.filter((o) => o.userId === uid);
  const byVendor = (vid: string) => orders.filter((o) => o.vendorId === vid);
  const active = (uid: string) => orders.find((o) => o.userId === uid && ["pending", "accepted", "preparing", "ready"].includes(o.status));
  return { orders, place, update, byUser, byVendor, active };
}

// ---- MERCHANT APPLICATIONS ----
export function useMerchantApps() {
  const [apps, setApps] = useStoreKey<MerchantApplication[]>(KEYS.apps, []);
  const submit = (app: Omit<MerchantApplication, "id" | "status" | "createdAt">) => {
    const a: MerchantApplication = { ...app, id: `app-${Date.now()}`, status: "pending", createdAt: Date.now() };
    setApps((prev) => [a, ...prev]);
    return a;
  };
  const decide = (id: string, status: "approved" | "rejected") => setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  return { apps, submit, decide };
}

// ---- REWARDS ----
export function useRewards(userId?: string) {
  const [txns, setTxns] = useStoreKey<RewardTxn[]>(KEYS.rewards, []);
  const balance = txns.filter((t) => !userId || t.userId === userId).reduce((s, t) => s + t.amount, 0);
  const earn = (uid: string, amount: number, reason: string) => {
    const t: RewardTxn = { id: `rw-${Date.now()}`, userId: uid, amount, reason, at: Date.now() };
    setTxns((prev) => [t, ...prev]);
    return t;
  };
  const mine = userId ? txns.filter((t) => t.userId === userId) : [];
  return { txns: mine, balance, earn };
}

// ---- VENDOR QUEUE / MENU OVERRIDES (merchant edits) ----
export function useVendorQueue(vendorId?: string) {
  const [queues, setQueues] = useStoreKey<Record<string, number>>(KEYS.queues, {});
  const set = (vid: string, n: number) => setQueues((prev) => ({ ...prev, [vid]: n }));
  const get = (vid: string) => queues[vid];
  return { queues, set, get, current: vendorId ? queues[vendorId] : undefined };
}
