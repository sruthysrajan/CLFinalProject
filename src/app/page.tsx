"use client";

import Link from "next/link";

import { useAppState } from "@/hooks/useAppState";

export default function Home() {
  const { profile, isHydrated, clearAllLocalData } = useAppState();
  const hasProfile = Boolean(profile);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">
          International student onboarding
        </p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Home
        </h2>
      </div>
      <p className="text-base leading-7 text-zinc-600">
        A mobile-first guide for the first 100 days of student life in the
        Netherlands.
      </p>

      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
        <p className="text-sm leading-6 text-zinc-600">
          Your progress is saved only in this browser.
        </p>
        {!isHydrated ? (
          <div className="h-12 rounded-md bg-zinc-100" />
        ) : (
          <>
            <Link
              href={hasProfile ? "/dashboard" : "/onboarding"}
              className="flex h-12 w-full items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              {hasProfile ? "Continue to dashboard" : "Start onboarding"}
            </Link>
            {hasProfile ? (
              <button
                type="button"
                onClick={clearAllLocalData}
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Clear local data
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
