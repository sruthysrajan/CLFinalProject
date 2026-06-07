import type { PersonalisedTask } from "@/lib/personalisation";
import type { TaskProgress } from "@/types/progress";

export type ProgressCalculation = {
  totalCount: number;
  completedCount: number;
  urgentRemainingCount: number;
  percentage: number;
};

function isCountableTask(task: PersonalisedTask) {
  return task.applicability === "applicable" && task.urgency !== "later";
}

function isCompleted(
  task: PersonalisedTask,
  taskProgress: Record<string, TaskProgress>,
) {
  return taskProgress[task.id]?.status === "done";
}

function isRemaining(
  task: PersonalisedTask,
  taskProgress: Record<string, TaskProgress>,
) {
  const status = taskProgress[task.id]?.status;

  return status !== "done" && status !== "skipped";
}

export function calculateProgress(
  personalisedTasks: readonly PersonalisedTask[],
  taskProgress: Record<string, TaskProgress> = {},
): ProgressCalculation {
  const countableTasks = personalisedTasks.filter(isCountableTask);
  const completedCount = countableTasks.filter((task) =>
    isCompleted(task, taskProgress),
  ).length;
  const urgentRemainingCount = personalisedTasks.filter(
    (task) => task.urgency === "urgent" && isRemaining(task, taskProgress),
  ).length;

  return {
    totalCount: countableTasks.length,
    completedCount,
    urgentRemainingCount,
    percentage:
      countableTasks.length === 0
        ? 0
        : Math.round((completedCount / countableTasks.length) * 100),
  };
}
