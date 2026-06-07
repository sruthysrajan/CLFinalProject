import type { TaskId } from "@/types/content";

export type TaskProgressStatus = "not_started" | "in_progress" | "done" | "skipped";

export type TaskProgress = {
  taskId: TaskId;
  status: TaskProgressStatus;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
};
