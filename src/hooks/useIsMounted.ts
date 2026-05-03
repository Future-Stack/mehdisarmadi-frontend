"use client";

import { useSyncExternalStore } from "react";

// A no-op subscribe — this store never changes after mount
const subscribe = () => () => {};

/**
 * Returns true only after the component mounts on the client.
 *
 * Uses `useSyncExternalStore` instead of useState+useEffect to avoid the
 * "setState synchronously within an effect" lint rule introduced in React 19.
 * React automatically uses the server snapshot (false) during SSR and switches
 * to the client snapshot (true) after hydration — no extra render needed.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,  // client snapshot — always true after hydration
    () => false  // server snapshot — always false during SSR
  );
}
