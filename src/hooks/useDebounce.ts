"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Debounces a value by the given delay (ms).
 * Use for search inputs to avoid hammering the API on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
