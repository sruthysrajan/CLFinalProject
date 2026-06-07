"use client";

import { useCallback, useEffect, useState } from "react";

import {
  safeReadJson,
  safeRemove,
  safeWriteJson,
} from "@/lib/storage";
import type { StorageKey } from "@/types/storage";

export function useLocalStorage<T>(key: StorageKey, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) {
        return;
      }

      setValue(safeReadJson(key, fallback));
      setIsHydrated(true);
    });

    return () => {
      isCancelled = true;
    };
  }, [fallback, key]);

  const saveValue = useCallback(
    (nextValue: T) => {
      setValue(nextValue);
      return safeWriteJson(key, nextValue);
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setValue(fallback);
    return safeRemove(key);
  }, [fallback, key]);

  return {
    value,
    setValue: saveValue,
    removeValue,
    isHydrated,
  };
}
