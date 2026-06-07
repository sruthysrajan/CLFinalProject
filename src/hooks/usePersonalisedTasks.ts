"use client";

import { useMemo } from "react";

import { getAllTasks } from "@/lib/content";
import { getPersonalisedTasks } from "@/lib/personalisation";
import type { StudentProfile } from "@/types/profile";

export function usePersonalisedTasks(profile: StudentProfile | null) {
  return useMemo(() => getPersonalisedTasks(getAllTasks(), profile), [profile]);
}
