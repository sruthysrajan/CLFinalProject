import Link from "next/link";

import type { Topic } from "@/types/content";

type TopicCardProps = {
  topic: Topic;
};

export function TopicCard({ topic }: Readonly<TopicCardProps>) {
  return (
    <article className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div>
        <h3 className="text-base font-semibold leading-6 text-zinc-950">
          {topic.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {topic.summary}
        </p>
      </div>
      <p className="text-sm font-medium text-zinc-500">
        {topic.relatedTaskIds.length} related tasks
      </p>
      <Link
        href={`/topics/${topic.id}`}
        className="flex h-11 w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
      >
        Open topic
      </Link>
    </article>
  );
}
