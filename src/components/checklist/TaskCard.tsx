"use client";

import Link from "next/link";

import { TaskStatusControl } from "@/components/checklist/TaskStatusControl";
import type { PersonalisedTask } from "@/lib/personalisation";
import type { TaskId } from "@/types/content";
import type { TaskProgressStatus } from "@/types/progress";

type TaskCardProps = {
  task: PersonalisedTask;
  status?: TaskProgressStatus;
  onStatusChange: (taskId: TaskId, status: TaskProgressStatus) => void;
};

const priorityLabels: Record<PersonalisedTask["urgency"], string> = {
  urgent: "Urgent",
  important: "Important",
  normal: "Normal",
  later: "Later",
};

const priorityStyles: Record<PersonalisedTask["urgency"], string> = {
  urgent: "bg-red-100 text-red-800",
  important: "bg-amber-100 text-amber-900",
  normal: "bg-zinc-100 text-zinc-700",
  later: "bg-zinc-100 text-zinc-500",
};

export function TaskCard({
  task,
  status,
  onStatusChange,
}: Readonly<TaskCardProps>) {
  return (
    <article className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-6 text-zinc-950">
            {task.title}
          </h3>
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${priorityStyles[task.urgency]}`}
          >
            {priorityLabels[task.urgency]}
          </span>
        </div>
        <p className="text-sm leading-6 text-zinc-600">{task.summary}</p>
        {task.applicability === "maybe_applicable" ? (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
            Maybe applicable based on your answers
          </p>
        ) : null}
      </div>
      <TaskStatusControl
        taskId={task.id}
        status={status}
        onStatusChange={onStatusChange}
      />
      <Link
        href={`/checklist/${task.id}`}
        className="flex h-11 w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
      >
        View guide
      </Link>
    </article>
  );
}
