import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "reklamator-ai-theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(value)) return value;
  } catch {
    // ignore
  }
  return "system";
}

function resolveEffective(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }
  return theme;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const effective = resolveEffective(theme);
  document.documentElement.classList.toggle("dark", effective === "dark");
}

const listeners = new Set<() => void>();
let currentTheme: Theme =
  typeof window === "undefined" ? "system" : readStoredTheme();
let mediaWatcherInstalled = false;

function notify() {
  listeners.forEach((cb) => cb());
}

function ensureMediaWatcher() {
  if (mediaWatcherInstalled || typeof window === "undefined" || !window.matchMedia) {
    return;
  }
  mediaWatcherInstalled = true;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (currentTheme === "system") {
      applyTheme("system");
      notify();
    }
  };
  media.addEventListener("change", handler);
}

function setThemeGlobal(next: Theme) {
  currentTheme = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore
  }
  applyTheme(next);
  notify();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "system";
}

export function initTheme(): void {
  if (typeof window === "undefined") return;
  currentTheme = readStoredTheme();
  applyTheme(currentTheme);
  ensureMediaWatcher();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = useCallback((next: Theme) => setThemeGlobal(next), []);

  return {
    theme,
    setTheme,
    effective: resolveEffective(theme),
  };
}

export type { Theme };
