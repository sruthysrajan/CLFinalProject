import type { PersonalisedTask } from "@/lib/personalisation";
import type { TaskId } from "@/types/content";

type NextActionsProps = {
  tasks: readonly PersonalisedTask[];
  onMarkDone: (taskId: TaskId) => void;
};

const urgencyLabels: Record<PersonalisedTask["urgency"], string> = {
  urgent: "Urgent",
  important: "Important",
  normal: "Next",
  later: "Later",
};

const urgencyStyles: Record<PersonalisedTask["urgency"], string> = {
  urgent: "bg-red-100 text-red-800",
  important: "bg-amber-100 text-amber-900",
  normal: "bg-zinc-100 text-zinc-700",
  later: "bg-zinc-100 text-zinc-500",
};

export function NextActions({ tasks, onMarkDone }: Readonly<NextActionsProps>) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-950">
          Top next actions
        </h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          The highest-priority remaining tasks based on your answers.
        </p>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm leading-6 text-zinc-600">
          No next actions left in the current task set.
        </p>
      ) : (
        <ol className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="space-y-3 rounded-md border border-zinc-200 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold leading-6 text-zinc-950">
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {task.summary}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${urgencyStyles[task.urgency]}`}
                >
                  {urgencyLabels[task.urgency]}
                </span>
              </div>
              {task.applicability === "maybe_applicable" ? (
                <p className="text-sm font-medium text-amber-800">
                  Maybe applicable
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => onMarkDone(task.id)}
                className="h-11 w-full rounded-md border border-teal-700 bg-white px-3 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50"
              >
                Mark done
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
