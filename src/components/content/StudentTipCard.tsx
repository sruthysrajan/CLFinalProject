import type { StudentTip } from "@/types/content";

type StudentTipCardProps = {
  tip: StudentTip;
};

export function StudentTipCard({ tip }: Readonly<StudentTipCardProps>) {
  return (
    <article className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-950">{tip.title}</p>
      <p className="mt-2 text-sm leading-6 text-amber-900">{tip.body}</p>
    </article>
  );
}
