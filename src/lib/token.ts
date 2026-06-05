// Generates a unique token number per order (not per user).
// Persisted in sessionStorage so confirmation + tracking show the same value
// for the most recent order, but every new order gets a fresh number.

const COUNTER_KEY = "bookit:tokenCounter";
const LAST_KEY = "bookit:lastToken";

export function mintToken(): number {
  if (typeof window === "undefined") return 1;
  const current = Number(window.sessionStorage.getItem(COUNTER_KEY) ?? "41");
  const next = current + 1;
  window.sessionStorage.setItem(COUNTER_KEY, String(next));
  window.sessionStorage.setItem(LAST_KEY, String(next));
  return next;
}

export function lastToken(): number {
  if (typeof window === "undefined") return 42;
  return Number(window.sessionStorage.getItem(LAST_KEY) ?? "42");
}
