"use client";

import { useContext } from "react";

import { AppStateContext } from "@/components/providers/AppStateProvider";

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
