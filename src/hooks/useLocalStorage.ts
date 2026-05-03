"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Persists a value to localStorage with the given key.
 * SSR-safe — uses useSyncExternalStore for hydration and cross-tab synchronization.
 *
 * @param key    localStorage key
 * @param initial Value to use if no stored value exists
 */
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // ─── Subscription ──────────────────────────────────────────────────────────
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    []
  );

  // ─── Snapshot Logic ────────────────────────────────────────────────────────
  const getSnapshot = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : JSON.stringify(initial);
    } catch {
      return JSON.stringify(initial);
    }
  };

  const getServerSnapshot = () => JSON.stringify(initial);

  // ─── Syncing ───────────────────────────────────────────────────────────────
  const rawValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const storedValue: T = JSON.parse(rawValue);

  // ─── Setter ────────────────────────────────────────────────────────────────
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const next =
          value instanceof Function ? value(storedValue) : value;
        
        window.localStorage.setItem(key, JSON.stringify(next));
        
        // Manual dispatch to trigger update in the same tab
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.warn(`[useLocalStorage] Could not write key "${key}":`, err);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
