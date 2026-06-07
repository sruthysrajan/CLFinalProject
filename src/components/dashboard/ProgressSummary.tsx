import { ProgressBar } from "@/components/dashboard/ProgressBar";
import type { ProgressCalculation } from "@/lib/progress";

type ProgressSummaryProps = {
  progress: ProgressCalculation;
};

export function ProgressSummary({ progress }: Readonly<ProgressSummaryProps>) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-950">Progress</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {progress.completedCount} of {progress.totalCount} core tasks
            completed
          </p>
        </div>
        <p className="text-2xl font-semibold text-zinc-950">
          {progress.percentage}%
        </p>
      </div>
      <ProgressBar percentage={progress.percentage} />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-zinc-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Completed
          </p>
          <p className="mt-1 text-xl font-semibold text-zinc-950">
            {progress.completedCount}
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-red-700">
            Urgent left
          </p>
          <p className="mt-1 text-xl font-semibold text-red-800">
            {progress.urgentRemainingCount}
          </p>
        </div>
      </div>
    </section>
  );
}
