import Link from "next/link";

import type { Task } from "@/types/content";

type RelatedTasksProps = {
  tasks: readonly Task[];
};

export function RelatedTasks({ tasks }: Readonly<RelatedTasksProps>) {
  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="text-base font-semibold text-zinc-950">
        Related checklist tasks
      </h3>
      <div className="grid gap-2">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/checklist/${task.id}`}
            className="rounded-md bg-zinc-50 px-3 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
          >
            {task.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
