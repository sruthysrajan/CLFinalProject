import { notFound } from "next/navigation";

import { TaskGuide } from "@/components/checklist/TaskGuide";
import { getAllTasks, getTaskById } from "@/lib/content";
import type { TaskId } from "@/types/content";

type TaskGuidePageProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export function generateStaticParams() {
  return getAllTasks().map((task) => ({
    taskId: task.id,
  }));
}

export default async function TaskGuidePage({ params }: TaskGuidePageProps) {
  const { taskId } = await params;
  const task = getTaskById(taskId as TaskId);

  if (!task) {
    notFound();
  }

  return <TaskGuide task={task} />;
}
