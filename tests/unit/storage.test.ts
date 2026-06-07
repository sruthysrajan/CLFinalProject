import { afterEach, describe, expect, it, vi } from "vitest";

import {
  safeReadJson,
  safeRemove,
  safeWriteJson,
  STORAGE_KEYS,
} from "@/lib/storage";

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
    clear: vi.fn(() => {
      values.clear();
    }),
    key: vi.fn((index: number) => [...values.keys()][index] ?? null),
    get length() {
      return values.size;
    },
  } satisfies Storage;
}

describe("storage helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns fallback during server rendering", () => {
    vi.stubGlobal("window", undefined);

    expect(safeReadJson(STORAGE_KEYS.profile, { profile: null })).toEqual({
      profile: null,
    });
  });

  it("reads valid JSON from localStorage", () => {
    const localStorage = createMemoryStorage();
    localStorage.setItem(STORAGE_KEYS.onboardingCompleted, "true");
    vi.stubGlobal("window", { localStorage });

    expect(safeReadJson(STORAGE_KEYS.onboardingCompleted, false)).toBe(true);
  });

  it("returns fallback on invalid JSON", () => {
    const localStorage = createMemoryStorage();
    localStorage.setItem(STORAGE_KEYS.profile, "{invalid");
    vi.stubGlobal("window", { localStorage });

    expect(safeReadJson(STORAGE_KEYS.profile, null)).toBeNull();
  });

  it("writes JSON safely", () => {
    const localStorage = createMemoryStorage();
    vi.stubGlobal("window", { localStorage });

    expect(safeWriteJson(STORAGE_KEYS.contentVersion, "0.1.0")).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.contentVersion)).toBe("\"0.1.0\"");
  });

  it("removes stored values safely", () => {
    const localStorage = createMemoryStorage();
    localStorage.setItem(STORAGE_KEYS.lastVisitedAt, "\"2026-06-07\"");
    vi.stubGlobal("window", { localStorage });

    expect(safeRemove(STORAGE_KEYS.lastVisitedAt)).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.lastVisitedAt)).toBeNull();
  });

  it("does not crash when localStorage is unavailable", () => {
    vi.stubGlobal("window", {
      get localStorage() {
        throw new Error("blocked");
      },
    });

    expect(safeReadJson(STORAGE_KEYS.taskProgress, {})).toEqual({});
    expect(safeWriteJson(STORAGE_KEYS.taskProgress, {})).toBe(false);
    expect(safeRemove(STORAGE_KEYS.taskProgress)).toBe(false);
  });
});
