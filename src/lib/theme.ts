import { useEffect } from "react";
import { useStoreKey } from "./store-helpers";

export type Theme = "light" | "dark" | "eye-comfort";

export function useTheme() {
  const [theme, setTheme] = useStoreKey<Theme>("campus:theme", "light");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.classList.remove("theme-light", "theme-dark", "theme-eye-comfort");
    html.classList.add(`theme-${theme}`);
  }, [theme]);
  return { theme, setTheme };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme();
  return children as any;
}
