import { useCallback, useEffect, useState } from "react";

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

export function useStoreKey<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
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
